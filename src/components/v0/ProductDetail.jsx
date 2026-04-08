import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ImagePreview, Drawer, ConfirmDialog } from "./UIComponents"

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
function ImageGallery({ images, onImageClick }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div className="relative">
      {/* 主图 */}
      <div 
        className="aspect-square bg-gray-100 overflow-hidden cursor-zoom-in"
        onClick={() => onImageClick(currentIndex)}
      >
        <img 
          src={images[currentIndex]} 
          alt="商品图片" 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* 图片指示器 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
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

      {/* 缩略图 - 桌面端显示 */}
      <div className="hidden lg:flex gap-2 mt-3">
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
      </div>
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
function SpecDrawer({ visible, product, selectedSpecs, quantity, onSpecSelect, onQuantityChange, onClose, onConfirm, actionType }) {
  const allSpecsSelected = product.specs.every(spec => selectedSpecs[spec.name])
  
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
            <p className="text-lg font-semibold text-primary mb-1">¥{product.price}</p>
            <p className="text-sm text-gray-500">
              {allSpecsSelected 
                ? `已选: ${Object.values(selectedSpecs).join(' / ')}`
                : '请选择规格'
              }
            </p>
            <p className="text-xs text-gray-400 mt-1">库存 {product.stock} 件</p>
          </div>
        </div>

        {/* 规格选择 */}
        {product.specs.map((spec) => (
          <SpecSelector
            key={spec.name}
            spec={spec}
            selected={selectedSpecs[spec.name]}
            onSelect={onSpecSelect}
          />
        ))}

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

// 商品详情页主组件
export default function ProductDetail({ product = mockProduct }) {
  const navigate = useNavigate()
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

  const handleAddToCart = () => {
    const allSpecsSelected = product.specs.every(spec => selectedSpecs[spec.name])
    if (!allSpecsSelected) {
      setActionType('cart')
      setShowSpecDrawer(true)
      return
    }
    
    // 执行加入购物车动画
    setIsAddingToCart(true)
    setTimeout(() => {
      setIsAddingToCart(false)
      setCartCount(prev => prev + quantity)
      setShowAddedTip(true)
      setTimeout(() => setShowAddedTip(false), 2000)
    }, 300)
  }

  const handleBuyNow = () => {
    const allSpecsSelected = product.specs.every(spec => selectedSpecs[spec.name])
    if (!allSpecsSelected) {
      setActionType('buy')
      setShowSpecDrawer(true)
      return
    }
    
    // 跳转到结算页
    navigate('/checkout', {
      state: {
        items: [{
          ...product,
          quantity,
          spec: Object.values(selectedSpecs).join(' / ')
        }]
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
        <div className="lg:grid lg:grid-cols-2 lg:gap-10">
          {/* 图片区域 */}
          <div className="lg:sticky lg:top-20">
            <ImageGallery images={product.images} onImageClick={handleImageClick} />
          </div>

          {/* 商品信息区域 */}
          <div className="bg-white lg:bg-transparent">
            {/* 价格区域 */}
            <div className="px-4 py-4 lg:px-0 lg:pt-0 bg-gradient-to-b from-primary/5 to-transparent lg:from-transparent">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl lg:text-3xl font-bold text-primary">
                  ¥{product.price}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ¥{product.originalPrice}
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-primary rounded">
                  {discount}%OFF
                </span>
              </div>
              <h1 className="text-base lg:text-xl font-medium text-gray-800 leading-relaxed">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="font-medium text-gray-800">{product.rating}</span>
                </div>
                <span>销量 {product.sales}</span>
                <span>评价 {product.reviews}</span>
              </div>
            </div>

            {/* 服务保障 */}
            <div className="px-4 lg:px-0 border-t border-gray-100 lg:border-0">
              <ServiceBadges services={product.services} />
            </div>

            {/* 规格选择 - 移动端点击打开抽屉 */}
            <div 
              onClick={() => {
                setActionType('cart')
                setShowSpecDrawer(true)
              }}
              className="px-4 py-3 mx-4 lg:mx-0 my-2 bg-gray-50 rounded-xl cursor-pointer lg:cursor-default lg:bg-transparent lg:p-0"
            >
              <div className="flex items-center justify-between lg:hidden">
                <span className="text-sm text-gray-500">已选</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-800">
                    {Object.keys(selectedSpecs).length > 0 
                      ? Object.values(selectedSpecs).join(' / ')
                      : '请选择规格'
                    }
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              {/* PC端直接显示规格选择 */}
              <div className="hidden lg:block">
                {product.specs.map((spec) => (
                  <SpecSelector
                    key={spec.name}
                    spec={spec}
                    selected={selectedSpecs[spec.name]}
                    onSelect={handleSpecSelect}
                  />
                ))}

                {/* 数量选择 */}
                <div className="py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">数量</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-10 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                      <span className="text-xs text-gray-400 ml-2">
                        库存 {product.stock} 件
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 店铺信息 - 桌面端 */}
            <div className="hidden lg:block mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">U</span>
                  </div>
                  <div>
                    <h3 className="font-medium">UniShop 官方旗舰店</h3>
                    <p className="text-xs text-gray-500">已售 10万+ | 好评率 99%</p>
                  </div>
                </div>
                <Link 
                  to="/shop/1" 
                  className="px-4 py-2 text-sm border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
                >
                  进店逛逛
                </Link>
              </div>
            </div>

            {/* 桌面端操作按钮 */}
            <div className="hidden lg:flex gap-4 mt-6">
              <button
                ref={addButtonRef}
                onClick={handleAddToCart}
                className={`flex-1 h-12 flex items-center justify-center gap-2 border-2 border-primary text-primary rounded-xl font-semibold transition-all ${
                  isAddingToCart ? 'scale-95 bg-primary/10' : 'hover:bg-primary/5 active:scale-95'
                }`}
              >
                <svg className={`w-5 h-5 transition-transform ${isAddingToCart ? 'animate-cart-bounce' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {isAddingToCart ? '已加入' : '加入购物车'}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 h-12 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 active:scale-95 transition-all"
              >
                立即购买
              </button>
            </div>
          </div>
        </div>

        {/* 商品详情/评价 Tab */}
        <div className="mt-4 lg:mt-10">
          {/* 店铺信息卡片 - 移动端 */}
          <div className="lg:hidden mx-4 p-3 bg-white rounded-xl border border-gray-100 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-bold text-primary">U</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium">UniShop 官方旗舰店</h3>
                  <p className="text-[11px] text-gray-500">已售 10万+ | 好评率 99%</p>
                </div>
              </div>
              <Link 
                to="/shop/1" 
                className="text-xs px-3 py-1.5 border border-primary text-primary rounded-full active:scale-95 transition-transform"
              >
                进店
              </Link>
            </div>
          </div>

          {/* 用户评价预览 */}
          <div className="mx-4 lg:mx-0 p-4 bg-white rounded-xl border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">用户评价</h3>
                <span className="text-xs text-gray-500">({product.reviews})</span>
              </div>
              <Link to={`/products/${product.id}/reviews`} className="text-xs text-primary flex items-center">
                查看全部
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="space-y-3">
              {[1, 2].map((_, index) => (
                <div key={index} className="pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-gray-100" />
                    <span className="text-sm">用户***{index + 1}</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-3 h-3 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    质量非常好，穿着很舒服，物流也很快，下次还会回购！
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 商品详情 */}
          <div className="mx-4 lg:mx-0 mt-4 p-4 bg-white rounded-xl border border-gray-100">
            <h3 className="font-medium mb-3">商品详情</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {product.description}
            </p>
            <div className="space-y-2">
              {product.images.slice(0, 3).map((img, index) => (
                <img 
                  key={index}
                  src={img}
                  alt={`详情图 ${index + 1}`}
                  className="w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </div>
          </div>
        </div>
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
      />
    </div>
  )
}
