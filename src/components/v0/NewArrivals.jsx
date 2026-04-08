import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Sparkles, Clock, Heart, ShoppingCart } from "lucide-react"

const newProducts = [
  { id: 1, name: "智能运动手表 Pro", image: "/images/new-product-1.jpg", price: 1299, originalPrice: 1599, tag: "新品", tagColor: "bg-emerald-500", releaseDate: "3天前上新" },
  { id: 2, name: "降噪无线耳机 Max", image: "/images/new-product-2.jpg", price: 899, originalPrice: 1199, tag: "首发", tagColor: "bg-violet-500", releaseDate: "今日上新" },
  { id: 3, name: "极简商务双肩包", image: "/images/new-product-3.jpg", price: 359, originalPrice: 499, tag: "热卖", tagColor: "bg-rose-500", releaseDate: "2天前上新" },
  { id: 4, name: "北欧风陶瓷杯套装", image: "/images/new-product-4.jpg", price: 128, originalPrice: 198, tag: "限量", tagColor: "bg-amber-500", releaseDate: "本周上新" },
]

export function NewArrivals() {
  const [favorites, setFavorites] = useState([])

  const toggleFavorite = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <section className="py-6 lg:py-10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-5 lg:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 lg:w-5 lg:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base lg:text-xl font-bold text-foreground">新品首发</h2>
              <p className="text-[11px] lg:text-xs text-muted-foreground">发现最新潮流好物</p>
            </div>
          </div>
          <Link to="#" className="flex items-center gap-0.5 text-xs lg:text-sm text-primary font-medium">
            更多
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar lg:grid lg:grid-cols-4 lg:gap-4">
          {newProducts.map((product) => (
            <Link
              key={product.id}
              to="#"
              className="group relative flex-shrink-0 w-[160px] lg:w-auto bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="absolute top-2.5 left-2.5 z-10">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold text-white ${product.tagColor}`}>
                  {product.tag}
                </span>
              </div>
              <button
                onClick={(e) => toggleFavorite(product.id, e)}
                className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
              >
                <Heart className={`w-3.5 h-3.5 transition-colors ${favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
              </button>
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 lg:p-6 transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
                  <Clock className="w-2.5 h-2.5 text-white/80" />
                  <span className="text-[10px] text-white/90">{product.releaseDate}</span>
                </div>
              </div>
              <div className="p-3 lg:p-4">
                <h3 className="text-xs lg:text-sm font-medium text-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm lg:text-base font-bold text-primary">¥{product.price}</span>
                    <span className="text-[10px] lg:text-xs text-muted-foreground line-through">¥{product.originalPrice}</span>
                  </div>
                  <button onClick={(e) => e.preventDefault()} className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white text-primary transition-colors">
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
