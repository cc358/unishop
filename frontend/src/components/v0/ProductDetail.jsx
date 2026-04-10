import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useParams, useLocation } from "react-router-dom"
import { ShieldCheck, Lock, RefreshCw, Headphones, Truck, RotateCcw, Share2, Bell, Star, Flame, Eye, Globe, Shield, ShoppingCart, Zap, Heart, Minus, Plus, Check, TrendingUp } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"
import { ImagePreview, Drawer, ConfirmDialog } from "./UIComponents"
import { getProduct } from "../../api/product"
import { getProductDetail as getEbayProduct } from "../../api/ebay"
import { searchProducts as ebaySearch } from "../../api/ebay"
import { useCartStore } from "../../stores/useCartStore"

// 示例商品数据
const mockProduct = {
  id: 1,
  name: "2024新款春季时尚休闲运动鞋 透气轻便跑步鞋",
  price: 299,
  originalPrice: 599,
  sales: 2847,
  rating: 4.9,
  reviews: 1256,
  stock: 86,
  images: [
    "https://picsum.photos/600/600?random=1",
    "https://picsum.photos/600/600?random=2",
    "https://picsum.photos/600/600?random=3",
    "https://picsum.photos/600/600?random=4",
  ],
  specs: [
    { name: "颜色", options: ["经典黑", "纯净白", "复古灰", "藏青蓝"] },
    { name: "尺码", options: ["38", "39", "40", "41", "42", "43", "44"] },
  ],
  services: [
    { icon: "truck", text: "顺丰包邮" },
    { icon: "shield", text: "正品保证" },
    { icon: "refresh", text: "7天退换" },
  ],
  description: "采用高品质透气网面材质，轻便舒适，适合日常运动和休闲穿搭。鞋底采用减震设计，有效保护膝盖。",
}

// 服务图标
const ServiceIcon = ({ type }) => {
  const icons = {
    truck: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    shield: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    refresh: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  }
  return icons[type] || null
}

// 图片轮播组件
function upgradeImageUrl(url) {
  if (!url) return url
  // eBay: upgrade s-l225 thumbnail to s-l1600 high-res
  return url.replace(/\/s-l\d+\./, '/s-l1600.')
}

function ImageGallery({ images: rawImages, onImageClick }) {
  // Deduplicate and upgrade to high-res
  const seen = new Set()
  const images = (rawImages || []).filter(img => {
    if (!img) return false
    const key = img.replace(/\/s-l\d+\./, '/s-l__.')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).map(upgradeImageUrl)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [zoom, setZoom] = useState({ active: false, x: 0, y: 0, lensX: 0, lensY: 0 })
  const imgRef = useRef(null)

  const LENS_SIZE = 120
  const ZOOM_FACTOR = 2.5

  const handleMouseMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    // Clamp to 0-1
    const cx = Math.max(0, Math.min(1, x))
    const cy = Math.max(0, Math.min(1, y))

    // Lens position (centered on cursor, clamped within image)
    const lensX = Math.max(0, Math.min(rect.width - LENS_SIZE, e.clientX - rect.left - LENS_SIZE / 2))
    const lensY = Math.max(0, Math.min(rect.height - LENS_SIZE, e.clientY - rect.top - LENS_SIZE / 2))

    setZoom({ active: true, x: cx, y: cy, lensX, lensY })
  }

  const handleMouseLeave = () => {
    setZoom({ active: false, x: 0, y: 0, lensX: 0, lensY: 0 })
  }

  const zoomBgSize = `${ZOOM_FACTOR * 100}%`
  const zoomBgPosX = `${zoom.x * 100}%`
  const zoomBgPosY = `${zoom.y * 100}%`

  return (
    <div className="relative">
      <div className="lg:flex lg:gap-4">
        {/* 主图 */}
        <div className="relative flex-1">
          <div
            ref={imgRef}
            className="aspect-square bg-gray-100 overflow-hidden cursor-zoom-in relative"
            onClick={() => onImageClick(currentIndex)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={images[currentIndex] || '/placeholder.jpg'}
              alt="商品图片"
              onError={(e) => { e.target.src = '/placeholder.jpg' }}
              className="w-full h-full object-cover"
              draggable={false}
            />
            {/* 放大镜方框 - 仅桌面端 */}
            {zoom.active && (
              <div
                className="hidden lg:block absolute pointer-events-none border-2 border-white/80 bg-white/20 shadow-lg z-10"
                style={{
                  width: LENS_SIZE,
                  height: LENS_SIZE,
                  left: zoom.lensX,
                  top: zoom.lensY,
                }}
              />
            )}
          </div>

          {/* 图片指示器 - 移动端 */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 lg:hidden">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary w-5"
                    : "bg-white/70 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 放大预览区 - 仅桌面端 */}
        {zoom.active && (
          <div
            className="hidden lg:block absolute left-full ml-4 top-0 w-[400px] aspect-square rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-gray-100 z-30"
            style={{
              backgroundImage: `url(${images[currentIndex]})`,
              backgroundSize: zoomBgSize,
              backgroundPosition: `${zoomBgPosX} ${zoomBgPosY}`,
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}
      </div>

      {/* 缩略图 - 桌面端显示（多图时） */}
      {images.length > 1 && <div className="hidden lg:flex gap-2 mt-3">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              index === currentIndex
                ? "border-primary scale-105 shadow-md"
                : "border-transparent opacity-60 hover:opacity-100 hover:border-gray-200"
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>}
    </div>
  )
}

// 规格选择组件
function SpecSelector({ spec, selected, onSelect }) {
  return (
    <div className="py-3 border-b border-gray-100">
      <div className="flex items-start gap-3">
        <span className="text-sm text-gray-500 w-14 flex-shrink-0 pt-1.5">
          {spec.name}
        </span>
        <div className="flex flex-wrap gap-2">
          {spec.options.map((option) => (
            <button
              key={option}
              onClick={() => onSelect(spec.name, option)}
              className={`px-4 py-2 text-sm rounded-lg border-2 transition-all duration-200 ${
                selected === option
                  ? "border-primary bg-primary/10 text-primary font-medium scale-105 shadow-sm"
                  : "border-gray-200 text-gray-700 hover:border-primary/50 hover:bg-gray-50 active:scale-95"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// 下拉规格选择器（eBay 变体用）
function VariantSpecSelector({ specs, selectedSpecs, onSelect, onPriceChange }) {
  if (!specs || specs.length === 0) return null
  return (
    <div className="space-y-4 py-3">
      {specs.map((spec) => (
        <div key={spec.name}>
          <span className="text-sm font-semibold text-foreground mb-2 block">{spec.name}</span>
          <div className="flex flex-wrap gap-2">
            {spec.values.map((item) => {
              const val = typeof item === 'string' ? item : item.value
              const available = typeof item === 'object' ? item.available !== false : true
              const price = typeof item === 'object' ? item.price : null
              const isSelected = selectedSpecs[spec.name] === val
              return (
                <button
                  key={val}
                  onClick={() => {
                    if (!available) return
                    onSelect(spec.name, val)
                    if (price && onPriceChange) onPriceChange(price)
                  }}
                  disabled={!available}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg border-2 transition-all duration-200 relative",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                      : available
                        ? "border-gray-200 text-gray-700 hover:border-primary/50 hover:bg-gray-50"
                        : "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                  )}
                >
                  {val}
                  {!available && <span className="text-[9px] block text-gray-300">缺货</span>}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// 服务标签组件
function ServiceBadges({ services }) {
  return (
    <div className="flex items-center gap-4 py-3">
      {services.map((service, index) => (
        <div key={index} className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="text-primary">
            <ServiceIcon type={service.icon} />
          </span>
          <span>{service.text}</span>
        </div>
      ))}
    </div>
  )
}

// 规格选择抽屉
function SpecDrawer({ visible, product, selectedSpecs, quantity, onSpecSelect, onQuantityChange, onClose, onConfirm, actionType, isEbay = false }) {
  const allSpecsSelected = product.specs?.every(spec => selectedSpecs[spec.name]) ?? true
  
  return (
    <Drawer visible={visible} position="bottom" title="选择规格" onClose={onClose}>
      <div className="p-4 max-h-[70vh] overflow-auto">
        {/* 商品信息 */}
        <div className="flex gap-3 mb-4 pb-4 border-b border-gray-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <p className="text-lg font-semibold text-primary mb-1">{isEbay ? '$' : '¥'}{product.price}</p>
            <p className="text-sm text-gray-500">
              {allSpecsSelected 
                ? `已选: ${Object.values(selectedSpecs).join(' / ')}`
                : '请选择规格'
              }
            </p>
            <p className="text-xs text-gray-400 mt-1">库存 {product.stock} 件</p>
          </div>
        </div>

        {/* 规格选择 — 仅 eBay 变体商品显示 */}
        {product.hasVariants && product.variantSpecs?.length > 0 && (
          <VariantSpecSelector specs={product.variantSpecs} selectedSpecs={selectedSpecs} onSelect={onSpecSelect} />
        )}

        {/* 数量选择 */}
        <div className="py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">数量</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button
                onClick={() => onQuantityChange(1)}
                disabled={quantity >= product.stock}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 确认按钮 */}
        <div className="pt-4 pb-safe">
          <button
            onClick={onConfirm}
            disabled={!allSpecsSelected}
            className={`w-full py-3 rounded-xl font-semibold transition-all active:scale-95 ${
              allSpecsSelected
                ? actionType === 'buy' 
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-primary/10 text-primary border-2 border-primary hover:bg-primary/20'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {actionType === 'buy' ? '立即购买' : '加入购物车'}
          </button>
        </div>
      </div>
    </Drawer>
  )
}

// 从商品标题提取核心搜索词
const NOISE_WORDS = new Set(['new','oem','genuine','original','for','the','and','with','in','of','a','an','set','lot','pack','pcs','pc','kit','box','open','used','pre-owned','sealed','brand','fast','free','shipping','us','usa','uk'])

function extractKeywords(title) {
  if (!title) return ''
  const words = title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !NOISE_WORDS.has(w))

  // 优先取品牌+类型词
  const brands = ['apple','iphone','samsung','galaxy','sony','canon','nikon','dyson','nike','adidas','lenovo','dell','asus','dji','rolex','omega','gucci','louis','chanel']
  const brand = words.find(w => brands.includes(w)) || ''
  const typeWords = words.filter(w => w !== brand).slice(0, 2)
  return [brand, ...typeWords].filter(Boolean).join(' ')
}

// 配套商品关键词映射
function getAccessoryKeyword(title) {
  const name = (title || '').toLowerCase()
  if (/iphone|phone|samsung|galaxy|smartphone|android/.test(name)) return 'phone case screen protector charger'
  if (/camera|canon|nikon|sony.*a[0-9]|fujifilm|dslr|mirrorless/.test(name)) return 'camera lens tripod memory card bag'
  if (/headphone|earphone|earbud|airpod|wh-1000/.test(name)) return 'earphone case cable replacement ear tips'
  if (/watch|smartwatch|apple watch|fitbit/.test(name)) return 'watch band strap charger'
  if (/laptop|macbook|notebook|thinkpad|xps/.test(name)) return 'laptop sleeve bag USB hub mouse pad'
  if (/playstation|ps5|xbox|nintendo|switch|console/.test(name)) return 'gaming controller headset charging dock'
  if (/shoe|sneaker|jordan|air max|ultraboost/.test(name)) return 'shoe cleaning kit insole laces'
  if (/vacuum|dyson|roomba/.test(name)) return 'vacuum filter brush roller replacement'
  if (/drone|dji|mavic/.test(name)) return 'drone battery propeller landing pad'
  if (/tablet|ipad/.test(name)) return 'tablet case stylus pen keyboard'
  if (/tv|television/.test(name)) return 'TV mount HDMI cable remote'
  if (/ring|necklace|bracelet|earring|jewelry/.test(name)) return 'jewelry box cleaning cloth gift bag'
  return ''
}

// 商品卡片行（通用）
function ProductRow({ title, items }) {
  if (!items || items.length === 0) return null
  return (
    <div className="mx-4 lg:mx-0 mt-6">
      <h3 className="text-base font-bold mb-3">{title}</h3>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {items.map((p, i) => (
          <Link key={p.id || i} to={`/product/${p.id}`} className="flex-shrink-0 w-[140px] lg:w-[180px] bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
            <img src={p.image || '/placeholder.jpg'} alt={p.name} onError={(e) => { e.target.src = '/placeholder.jpg' }} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="p-2.5">
              <p className="text-xs line-clamp-2 text-gray-700 mb-1.5 group-hover:text-primary transition-colors">{p.name}</p>
              <p className="text-sm font-bold text-primary">${p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// 猜你喜欢 - eBay 搜索相关商品
function RecommendSection({ title, productName }) {
  const [items, setItems] = useState([])
  useEffect(() => {
    if (!productName) return
    const keyword = extractKeywords(productName)
    if (!keyword) return
    import('../../api/ebay').then(({ searchProducts }) => {
      searchProducts(keyword, 8).then(data => {
        setItems((data.products || []).filter(p => p.image).slice(0, 6))
      }).catch(() => {})
    })
  }, [productName])
  return <ProductRow title={title} items={items} />
}

// 看了又看 - 同分类商品
function SameCategorySection({ categoryId, currentId }) {
  const [items, setItems] = useState([])
  useEffect(() => {
    if (!categoryId) return
    import('../../api/product').then(({ getProducts }) => {
      getProducts({ limit: 12, sortBy: 'sales' }).then(data => {
        setItems((data.products || []).filter(p => p.id !== currentId && p.image && !p.image.includes('placeholder')).slice(0, 6))
      }).catch(() => {})
    })
  }, [categoryId, currentId])
  return <ProductRow title="看了又看" items={items} />
}

// 买了还买 - 配套商品
function AccessorySection({ productName }) {
  const [items, setItems] = useState([])
  useEffect(() => {
    if (!productName) return
    const keyword = getAccessoryKeyword(productName)
    if (!keyword) return
    import('../../api/ebay').then(({ searchProducts }) => {
      searchProducts(keyword, 6).then(data => {
        setItems((data.products || []).filter(p => p.image).slice(0, 4))
      }).catch(() => {})
    })
  }, [productName])
  return <ProductRow title="买了还买" items={items} />
}

// 根据商品名/分类生成可选规格
// 商品详情页主组件
export default function ProductDetail() {
  const navigate = useNavigate()
  const params = useParams()
  const location = useLocation()
  // Extract ID: either from :id param or from wildcard * (for eBay IDs with |)
  const id = params.id || decodeURIComponent(location.pathname.replace('/product/', '').replace('/products/', ''))
  const [product, setProduct] = useState(mockProduct)
  const [isEbay, setIsEbay] = useState(false)
  const [ebayUrl, setEbayUrl] = useState('')
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    if (!id) return
    if (id.includes('v1|')) {
      // eBay ID — 先查本地数据库（搜索缓存），再回退到 eBay API
      setIsEbay(true)
      getProduct(id).then((data) => {
        // 本地找到了缓存的商品
        setIsEbay(data.source === 'ebay')
        const localImages = (Array.isArray(data.images) && data.images.length > 0) ? data.images : (data.image ? [data.image] : mockProduct.images)
        setProduct({
          ...mockProduct, id: data.id, name: data.name, price: data.price,
          currency: data.currency || 'USD', description: data.description || '',
          stock: data.stock || 99, sales: data.sales || 0, images: localImages, image: data.image,
          category: data.category, condition: data.condition, sellerName: data.sellerName,
          reviews: data.reviews || [], ebayUrl: data.ebayUrl, aspects: [],
          variantSpecs: [], hasVariants: false,
          specs: [],
          services: [
            { icon: "truck", text: "International Shipping" },
            { icon: "shield", text: data.condition || "New" },
            { icon: "refresh", text: "eBay Buyer Protection" },
          ],
        })
        if (data.ebayUrl) setEbayUrl(data.ebayUrl)
        // eBay商品 → 获取多图 + 变体规格（纯eBay数据）
        if (data.ebayItemId) {
          getEbayProduct(data.ebayItemId).then((ebayData) => {
            setProduct(prev => ({
              ...prev,
              images: ebayData.images?.length > 0 ? ebayData.images : prev.images,
              aspects: ebayData.aspects || prev.aspects,
              variantSpecs: ebayData.variantSpecs || [],
              hasVariants: ebayData.hasVariants || false,
            }))
          }).catch(() => {})
        }
      }).catch(() => {
        // 本地没有 — 直接调 eBay API
        getEbayProduct(id).then((data) => {
          setProduct({
            ...mockProduct, id: data.id, name: data.title, price: data.price,
            currency: data.currency, description: data.description || '', stock: 99, sales: 0,
            images: data.images?.length > 0 ? data.images : mockProduct.images,
            seller: data.seller, aspects: data.aspects || [],
            variantSpecs: data.variantSpecs || [], hasVariants: data.hasVariants || false,
            specs: [],
            services: [
              { icon: "truck", text: "International Shipping" },
              { icon: "shield", text: data.condition || "Used" },
              { icon: "refresh", text: "eBay Buyer Protection" },
            ],
          })
          setEbayUrl(data.itemWebUrl || '')
        }).catch(() => {})
      })
    } else {
      // Local product
      setIsEbay(false)
      getProduct(id).then((data) => {
        setIsEbay(data.source === 'ebay')
        const localImages = (Array.isArray(data.images) && data.images.length > 0) ? data.images : (data.image ? [data.image] : mockProduct.images)

        const buildProduct = (imgs) => ({
          ...mockProduct,
          id: data.id,
          name: data.name,
          price: data.price,
          currency: data.currency || 'USD',
          description: data.description || '',
          stock: data.stock,
          sales: data.sales,
          images: imgs,
          image: data.image,
          category: data.category,
          condition: data.condition,
          sellerName: data.sellerName,
          sellerFeedback: data.sellerFeedback,
          reviews: data.reviews || [],
          ebayUrl: data.ebayUrl,
          ebayItemId: data.ebayItemId,
          aspects: [], variantSpecs: [], hasVariants: false,
          specs: [],
          services: data.source === 'ebay'
            ? [{ icon: "truck", text: "International Shipping" }, { icon: "shield", text: data.condition || "eBay Item" }, { icon: "refresh", text: "eBay Buyer Protection" }]
            : mockProduct.services,
        })

        setProduct(buildProduct(localImages))
        if (data.ebayUrl) setEbayUrl(data.ebayUrl)

        // eBay商品 → 获取多图 + 变体规格（纯eBay数据）
        if (data.ebayItemId && data.source === 'ebay') {
          getEbayProduct(data.ebayItemId).then((ebayData) => {
            setProduct(prev => ({
              ...prev,
              images: ebayData.images?.length > 0 ? ebayData.images : prev.images,
              aspects: ebayData.aspects || prev.aspects,
              variantSpecs: ebayData.variantSpecs || [],
              hasVariants: ebayData.hasVariants || false,
            }))
          }).catch(() => {})
        }
      }).catch(() => {})
    }
  }, [id])
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedSpecs, setSelectedSpecs] = useState({})
  const [showImagePreview, setShowImagePreview] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)
  const [showSpecDrawer, setShowSpecDrawer] = useState(false)
  const [actionType, setActionType] = useState('cart') // 'cart' | 'buy'
  const [showAddedTip, setShowAddedTip] = useState(false)
  const [cartCount, setCartCount] = useState(2)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const addButtonRef = useRef(null)

  const handleSpecSelect = (specName, option) => {
    setSelectedSpecs(prev => ({ ...prev, [specName]: option }))
  }

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, Math.min(prev + delta, product.stock)))
  }

  const handleImageClick = (index) => {
    setPreviewIndex(index)
    setShowImagePreview(true)
  }

  const buildCartItem = () => ({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.images?.[0] || product.image || '',
    quantity,
    currency: product.currency || 'USD',
    ebayItemId: isEbay ? product.id : null,
    source: isEbay ? 'ebay' : 'local',
    spec: Object.values(selectedSpecs).join(' / '),
  })

  const handleAddToCart = () => {
    const allSpecsSelected = product.specs?.every(spec => selectedSpecs[spec.name]) ?? true
    if (!allSpecsSelected) {
      setActionType('cart')
      setShowSpecDrawer(true)
      return
    }

    addItem(buildCartItem())
    setIsAddingToCart(true)
    setTimeout(() => {
      setIsAddingToCart(false)
      setCartCount(prev => prev + quantity)
      setShowAddedTip(true)
      setTimeout(() => setShowAddedTip(false), 2000)
    }, 300)
  }

  const handleBuyNow = () => {
    const allSpecsSelected = product.specs?.every(spec => selectedSpecs[spec.name]) ?? true
    if (!allSpecsSelected) {
      setActionType('buy')
      setShowSpecDrawer(true)
      return
    }

    navigate('/checkout', {
      state: {
        items: [buildCartItem()]
      }
    })
  }

  const handleSpecConfirm = () => {
    setShowSpecDrawer(false)
    if (actionType === 'cart') {
      handleAddToCart()
    } else {
      handleBuyNow()
    }
  }

  const discount = Math.round((1 - product.price / product.originalPrice) * 100)

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      {/* 顶部导航栏 - 移动端 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg lg:hidden">
        <div className="flex items-center justify-between px-4 h-12">
          <Link to="/" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${
                isFavorite ? 'bg-red-50' : 'bg-gray-100'
              }`}
            >
              <svg 
                className={`w-5 h-5 transition-all duration-300 ${
                  isFavorite ? "text-red-500 fill-red-500 scale-110" : "text-gray-600"
                }`}
                fill={isFavorite ? "currentColor" : "none"}
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="lg:container lg:mx-auto lg:px-8 lg:py-6">
        <div className="lg:grid lg:grid-cols-2 lg:gap-10" style={{ overflow: 'visible' }}>
          {/* 图片区域 */}
          <div className="lg:sticky lg:top-20" style={{ overflow: 'visible' }}>
            <ImageGallery images={product.images} onImageClick={handleImageClick} />
          </div>

          {/* 商品信息区域 */}
          <div className="bg-white lg:bg-transparent flex flex-col">
            {/* Price Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-5 mx-4 lg:mx-0">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">限时特惠</span>
                </div>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-5xl font-bold tracking-tight text-foreground">${product.price}</span>
                  <div className="flex flex-col">
                    <span className="text-base text-muted-foreground line-through decoration-muted-foreground/50">${product.originalPrice}</span>
                    <span className="inline-flex items-center rounded-md bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                      省 ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${Math.min(90, Math.round((product.sales || 50) / Math.max(product.stock || 99, 1) * 100))}%` }} />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">已售 {Math.min(90, Math.round((product.sales || 50) / Math.max(product.stock || 99, 1) * 100))}%</span>
                </div>
              </div>
            </div>

            {/* Product Title */}
            <div className="mt-6 px-4 lg:px-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-600">
                  <Check className="mr-1 h-3 w-3" />
                  {product.condition?.includes('New') ? 'OEM 正品' : '品质保障'}
                </span>
                <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-1 text-xs font-semibold text-blue-600">
                  {product.condition?.includes('New') ? '全新' : (product.condition?.split(' - ')[0] || '现货')}
                </span>
              </div>
              <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-[1.75rem] text-balance">
                {product.name}
              </h1>
            </div>

            {/* Ratings & Stats */}
            <div className="mt-5 px-4 lg:px-0 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("h-4 w-4", i < 5 ? "fill-amber-400 text-amber-400" : "fill-muted text-muted")} />
                  ))}
                </div>
                <span className="text-sm font-bold text-amber-700">{product.rating}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm">
                <Flame className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">{product.sales || 50} 人购买</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{Math.floor(Math.random() * 20) + 5} 人正在浏览</span>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-5 px-4 lg:px-0 flex flex-wrap items-center gap-2">
              {[
                { icon: Globe, label: "国际配送", color: "text-sky-600 bg-sky-50" },
                { icon: Shield, label: "买家保护", color: "text-emerald-600 bg-emerald-50" },
              ].map((tag, index) => (
                <div key={index} className={cn("flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:opacity-80", tag.color)}>
                  <tag.icon className="h-4 w-4" />
                  {tag.label}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="mx-4 lg:mx-0 my-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* PC端规格选择 — 仅 eBay 变体商品显示 */}
            {product.hasVariants && product.variantSpecs?.length > 0 && (
              <div className="hidden lg:block px-4 lg:px-0">
                <VariantSpecSelector specs={product.variantSpecs} selectedSpecs={selectedSpecs} onSelect={handleSpecSelect} />
              </div>
            )}

            {/* Quantity Selector */}
            <div className="px-4 lg:px-0 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-foreground">数量</span>
                <div className="flex items-center rounded-xl border border-border bg-card p-1 shadow-sm">
                  <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40">
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="flex h-9 w-12 items-center justify-center text-base font-semibold">{quantity}</div>
                  <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm text-muted-foreground">库存 <span className="font-semibold text-foreground">{product.stock}</span> 件</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="hidden lg:flex mt-6 px-4 lg:px-0 flex-col gap-3 sm:flex-row">
              <Button variant="outline" size="lg" onClick={handleAddToCart}
                className={cn("group flex-1 gap-2.5 rounded-xl border-2 border-primary/20 bg-primary/5 py-6 text-base font-semibold text-primary transition-all hover:border-primary hover:bg-primary/10", isAddingToCart && "scale-95 bg-primary/10")}>
                <ShoppingCart className={cn("h-5 w-5 transition-transform group-hover:scale-110", isAddingToCart && "animate-cart-bounce")} />
                {isAddingToCart ? '已加入' : '加入购物车'}
              </Button>
              <Button size="lg" onClick={handleBuyNow}
                className="group relative flex-1 gap-2.5 overflow-hidden rounded-xl py-6 text-base font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] transition-all group-hover:animate-gradient" />
                <span className="relative flex items-center gap-2.5">
                  <Zap className="h-5 w-5 transition-transform group-hover:scale-110" />
                  立即购买
                </span>
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="hidden lg:flex mt-5 items-center justify-center gap-6">
              <button onClick={() => setIsFavorite(!isFavorite)}
                className={cn("flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all", isFavorite ? "bg-red-50 text-red-500" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                <Heart className={cn("h-4 w-4 transition-transform", isFavorite && "fill-current scale-110")} />
                {isFavorite ? "已收藏" : "收藏"}
              </button>
              <div className="h-4 w-px bg-border" />
              <button onClick={() => { navigator.clipboard?.writeText(window.location.href); alert('链接已复制') }}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
                <Share2 className="h-4 w-4" />
                分享
              </button>
            </div>
          </div>
        </div>

        {/* === 商品保障 === */}
        <div className="mx-4 lg:mx-0 mt-4 lg:mt-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:p-6">
            <div className="grid grid-cols-4 gap-4 lg:gap-6">
              {[
                { Icon: ShieldCheck, title: "正品保证", desc: "官方授权", color: "text-primary", bg: "bg-primary/10" },
                { Icon: Lock, title: "安全支付", desc: "加密保障", color: "text-primary", bg: "bg-primary/10" },
                { Icon: RefreshCw, title: "7天退换", desc: "无忧售后", color: "text-primary", bg: "bg-primary/10" },
                { Icon: Headphones, title: "售后保障", desc: "全程跟踪", color: "text-primary", bg: "bg-primary/10" },
              ].map(item => (
                <div key={item.title} className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-2`}>
                    <item.Icon className={`w-6 h-6 lg:w-7 lg:h-7 ${item.color}`} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === 配送信息 + 退换货政策 === */}
        <div className="mx-4 lg:mx-0 mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 配送信息 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-gray-900">配送信息</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">预计到货</span>
                <span className="text-sm font-semibold text-gray-900">7-15 个工作日</span>
              </div>
              <div className="border-t border-gray-50" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">运费</span>
                <span className="text-sm font-semibold text-primary">$0 免费配送</span>
              </div>
              <div className="border-t border-gray-50" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">配送方式</span>
                <span className="text-sm font-semibold text-gray-900">国际标准快递</span>
              </div>
            </div>
          </div>

          {/* 退换货政策 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-gray-900">退换货政策</h3>
            </div>
            <div className="space-y-4">
              {["7天无理由退换货", "退货运费由买家承担", "收到商品15天内可申请"].map(text => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-sm text-gray-700">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === 商品规格 === */}
        <div className="mx-4 lg:mx-0 mt-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">商品规格</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "商品状况", value: product.condition || "New" },
                { label: "商品编号", value: product.ebayItemId ? product.ebayItemId.split('|')[1] : String(product.id || '').substring(0, 12) },
                { label: "卖家", value: product.sellerName || "UniShop" },
                { label: "配送方式", value: "国际快递" },
                ...(product.aspects || []).filter(a => a.values?.[0]).map(a => ({
                  label: a.name, value: a.values[0]
                })),
              ].map(spec => (
                <div key={spec.label}>
                  <p className="text-xs text-gray-400 mb-1">{spec.label}</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === 分享 + 到货提醒 === */}
        <div className="mx-4 lg:mx-0 mt-4 grid grid-cols-2 gap-3">
          <button onClick={() => {
            navigator.clipboard?.writeText(window.location.href)
            alert('链接已复制')
          }} className="py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" />
            分享商品
          </button>
          <button onClick={() => {
            const email = prompt('输入邮箱，商品有货时通知您：')
            if (email) alert('已设置到货提醒：' + email)
          }} className="py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
            <Bell className="w-4 h-4" />
            到货提醒
          </button>
        </div>

        {/* === 猜你喜欢 === */}
        <RecommendSection title="猜你喜欢" productName={product.name} />

        {/* === 配套商品 === */}
        <AccessorySection productName={product.name} />

        {/* === 看了又看 === */}
        <SameCategorySection categoryId={product.category?.id} currentId={product.id} />

        <div className="h-8" />
      </div>

      {/* 底部操作栏 - 移动端 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 lg:hidden z-40">
        <div className="flex items-center gap-3">
          {/* 左侧图标按钮 */}
          <div className="flex items-center gap-1">
            <Link to="/shop/1" className="flex flex-col items-center px-3 py-1">
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-[10px] text-gray-500 mt-0.5">客服</span>
            </Link>
            <Link to="/cart" className="flex flex-col items-center px-3 py-1 relative">
              <svg className={`w-5 h-5 text-gray-500 ${showAddedTip ? 'animate-cart-bounce' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-[10px] text-gray-500 mt-0.5">购物车</span>
              <span className={`absolute -top-0.5 right-1 min-w-[16px] h-4 bg-primary text-[10px] text-white rounded-full flex items-center justify-center px-1 transition-transform ${showAddedTip ? 'scale-125' : ''}`}>
                {cartCount}
              </span>
            </Link>
          </div>

          {/* 操作按钮 */}
          <div className="flex-1 flex gap-2">
            <button
              onClick={handleAddToCart}
              className={`flex-1 h-10 border-2 border-primary text-primary rounded-full font-semibold text-sm transition-all ${
                isAddingToCart ? 'scale-95 bg-primary/10' : 'active:scale-95'
              }`}
            >
              {isAddingToCart ? '已加入' : '加入购物车'}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 h-10 bg-primary text-white rounded-full font-semibold text-sm active:scale-95 transition-all"
            >
              立即购买
            </button>
          </div>
        </div>

        {/* 加入购物车成功提示 */}
        {showAddedTip && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg animate-toast-in">
            已加入购物车
          </div>
        )}
      </div>

      {/* 图片预览 */}
      <ImagePreview
        visible={showImagePreview}
        images={product.images}
        initialIndex={previewIndex}
        onClose={() => setShowImagePreview(false)}
      />

      {/* 规格选择抽屉 - 移动端 */}
      <SpecDrawer
        visible={showSpecDrawer}
        product={product}
        selectedSpecs={selectedSpecs}
        quantity={quantity}
        onSpecSelect={handleSpecSelect}
        onQuantityChange={handleQuantityChange}
        onClose={() => setShowSpecDrawer(false)}
        onConfirm={handleSpecConfirm}
        actionType={actionType}
        isEbay={isEbay}
      />
    </div>
  )
}
