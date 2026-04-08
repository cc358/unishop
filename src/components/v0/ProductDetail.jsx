import { useState } from "react"
import { Link } from "react-router-dom"
import { 
  ChevronLeft, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Minus, 
  Plus, 
  Star, 
  Truck, 
  Shield, 
  RefreshCw,
  ChevronRight,
  MessageCircle
} from "lucide-react"

// 示例商品数据（实际使用时由 props 传入）
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
    "/images/product-1.jpg",
    "/images/product-2.jpg",
    "/images/product-3.jpg",
    "/images/product-4.jpg",
  ],
  specs: [
    { name: "颜色", options: ["经典黑", "纯净白", "复古灰", "藏青蓝"] },
    { name: "尺码", options: ["38", "39", "40", "41", "42", "43", "44"] },
  ],
  services: [
    { icon: Truck, text: "顺丰包邮" },
    { icon: Shield, text: "正品保证" },
    { icon: RefreshCw, text: "7天退换" },
  ],
  description: "采用高品质透气网面材质，轻便舒适，适合日常运动和休闲穿搭。鞋底采用减震设计，有效保护膝盖。",
}

// 图片轮播组件
function ImageGallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div className="relative">
      {/* 主图 */}
      <div className="aspect-square bg-secondary overflow-hidden">
        <img 
          src={images[currentIndex]} 
          alt="商品图片" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* 图片指示器 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? "bg-primary w-5" 
                : "bg-white/70"
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
            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              index === currentIndex 
                ? "border-primary" 
                : "border-transparent opacity-60 hover:opacity-100"
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
    <div className="py-3 border-b border-border">
      <div className="flex items-start gap-3">
        <span className="text-sm text-muted-foreground w-14 flex-shrink-0 pt-1.5">
          {spec.name}
        </span>
        <div className="flex flex-wrap gap-2">
          {spec.options.map((option) => (
            <button
              key={option}
              onClick={() => onSelect(spec.name, option)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                selected === option
                  ? "border-primary bg-primary/5 text-primary font-medium"
                  : "border-border text-foreground hover:border-primary/50"
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
        <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
          <service.icon className="w-3.5 h-3.5 text-primary" />
          <span>{service.text}</span>
        </div>
      ))}
    </div>
  )
}

// 商品详情页主组件
export function ProductDetail({ product = mockProduct, onAddToCart, onBuyNow }) {
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedSpecs, setSelectedSpecs] = useState({})

  const handleSpecSelect = (specName, option) => {
    setSelectedSpecs(prev => ({ ...prev, [specName]: option }))
  }

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, Math.min(prev + delta, product.stock)))
  }

  const discount = Math.round((1 - product.price / product.originalPrice) * 100)

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      {/* 顶部导航栏 - 移动端 */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg lg:hidden">
        <div className="flex items-center justify-between px-4 h-12">
          <Link to="/" className="w-9 h-9 flex items-center justify-center rounded-full bg-secondary">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-secondary"
            >
              <Heart 
                className={`w-5 h-5 transition-colors ${isFavorite ? "text-red-500 fill-red-500" : ""}`} 
              />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-secondary">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="lg:container lg:mx-auto lg:px-8 lg:py-6">
        <div className="lg:grid lg:grid-cols-2 lg:gap-10">
          {/* 图片区域 */}
          <div className="lg:sticky lg:top-20">
            <ImageGallery images={product.images} />
          </div>

          {/* 商品信息区域 */}
          <div className="bg-card lg:bg-transparent">
            {/* 价格区域 */}
            <div className="px-4 py-4 lg:px-0 lg:pt-0 bg-gradient-to-b from-primary/5 to-transparent lg:from-transparent">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl lg:text-3xl font-bold text-primary">
                  ¥{product.price}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ¥{product.originalPrice}
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-primary rounded">
                  {discount}%OFF
                </span>
              </div>
              <h1 className="text-base lg:text-xl font-medium text-foreground leading-relaxed">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium text-foreground">{product.rating}</span>
                </div>
                <span>销量 {product.sales}</span>
                <span>评价 {product.reviews}</span>
              </div>
            </div>

            {/* 服务保障 */}
            <div className="px-4 lg:px-0 border-t border-border lg:border-0">
              <ServiceBadges services={product.services} />
            </div>

            {/* 规格选择 */}
            <div className="px-4 lg:px-0 bg-card lg:bg-transparent mt-2 lg:mt-0">
              {product.specs.map((spec) => (
                <SpecSelector
                  key={spec.name}
                  spec={spec}
                  selected={selectedSpecs[spec.name]}
                  onSelect={handleSpecSelect}
                />
              ))}

              {/* 数量选择 */}
              <div className="py-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">数量</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-muted-foreground ml-2">
                      库存 {product.stock} 件
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 店铺信息 - 桌面端 */}
            <div className="hidden lg:block mt-6 p-4 bg-secondary/50 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">U</span>
                  </div>
                  <div>
                    <h3 className="font-medium">UniShop 官方旗舰店</h3>
                    <p className="text-xs text-muted-foreground">已售 10万+ | 好评率 99%</p>
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
                onClick={() => onAddToCart && onAddToCart({ ...product, quantity, specs: selectedSpecs })}
                className="flex-1 h-12 flex items-center justify-center gap-2 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary/5 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                加入购物车
              </button>
              <button
                onClick={() => onBuyNow && onBuyNow({ ...product, quantity, specs: selectedSpecs })}
                className="flex-1 h-12 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                立即购买
              </button>
            </div>
          </div>
        </div>

        {/* 商品详情/评价 Tab */}
        <div className="mt-4 lg:mt-10">
          {/* 店铺信息卡片 - 移动端 */}
          <div className="lg:hidden mx-4 p-3 bg-card rounded-xl border border-border mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-bold text-primary">U</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium">UniShop 官方旗舰店</h3>
                  <p className="text-[11px] text-muted-foreground">已售 10万+ | 好评率 99%</p>
                </div>
              </div>
              <Link 
                to="/shop/1" 
                className="text-xs px-3 py-1.5 border border-primary text-primary rounded-full"
              >
                进店
              </Link>
            </div>
          </div>

          {/* 用户评价预览 */}
          <div className="mx-4 lg:mx-0 p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">用户评价</h3>
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              </div>
              <Link to={`/products/${product.id}/reviews`} className="text-xs text-primary flex items-center">
                查看全部 <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {[1, 2].map((_, index) => (
                <div key={index} className="pb-3 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-secondary" />
                    <span className="text-sm">用户***{index + 1}</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className="w-3 h-3 text-yellow-500 fill-yellow-500" 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    质量非常好，穿着很舒服，物流也很快，下次还会回购！
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 商品详情 */}
          <div className="mx-4 lg:mx-0 mt-4 p-4 bg-card rounded-xl border border-border">
            <h3 className="font-medium mb-3">商品详情</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {product.description}
            </p>
            <div className="space-y-2">
              {product.images.slice(0, 3).map((img, index) => (
                <img 
                  key={index}
                  src={img}
                  alt={`详情图 ${index + 1}`}
                  className="w-full rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 底部操作栏 - 移动端 */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 lg:hidden z-50">
        <div className="flex items-center gap-3">
          {/* 左侧图标按钮 */}
          <div className="flex items-center gap-1">
            <Link to="/shop/1" className="flex flex-col items-center px-3 py-1">
              <MessageCircle className="w-5 h-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground mt-0.5">客服</span>
            </Link>
            <Link to="/cart" className="flex flex-col items-center px-3 py-1 relative">
              <ShoppingCart className="w-5 h-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground mt-0.5">购物车</span>
              <span className="absolute -top-0.5 right-1 w-4 h-4 bg-primary text-[10px] text-white rounded-full flex items-center justify-center">
                2
              </span>
            </Link>
          </div>

          {/* 操作按钮 */}
          <div className="flex-1 flex gap-2">
            <button
              onClick={() => onAddToCart && onAddToCart({ ...product, quantity, specs: selectedSpecs })}
              className="flex-1 h-10 border-2 border-primary text-primary rounded-full font-semibold text-sm hover:bg-primary/5 transition-colors"
            >
              加入购物车
            </button>
            <button
              onClick={() => onBuyNow && onBuyNow({ ...product, quantity, specs: selectedSpecs })}
              className="flex-1 h-10 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              立即购买
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
