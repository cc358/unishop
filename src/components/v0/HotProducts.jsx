import { useState } from "react"
import { Star, Heart, ShoppingCart, ArrowRight, Flame } from "lucide-react"
import { Button } from "../ui/button"

const products = [
  { id: 1, name: "春季新款纯棉连衣裙", price: 189, originalPrice: 299, sales: 2341, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop", tag: "热销" },
  { id: 2, name: "轻薄羽绒保暖外套", price: 459, originalPrice: 699, sales: 1856, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop", tag: "新品" },
  { id: 3, name: "真皮通勤手提包", price: 329, originalPrice: 499, sales: 987, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop", tag: "折扣" },
  { id: 4, name: "运动透气跑步鞋", price: 259, originalPrice: 399, sales: 3421, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", tag: "爆款" },
  { id: 5, name: "智能全自动扫地机器人", price: 1299, originalPrice: 1999, sales: 654, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop", tag: "特惠" },
  { id: 6, name: "有机新鲜水果礼盒", price: 98, originalPrice: 138, sales: 4532, image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=400&fit=crop", tag: "精选" },
  { id: 7, name: "护肤补水套装礼盒", price: 399, originalPrice: 599, sales: 1234, image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop", tag: "热销" },
  { id: 8, name: "儿童益智玩具套装", price: 149, originalPrice: 229, sales: 876, image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop", tag: "推荐" },
]

export function HotProducts() {
  const [favorites, setFavorites] = useState([])

  const toggleFavorite = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const formatSales = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "k"
    return num.toString()
  }

  return (
    <section className="py-8 lg:py-12 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-foreground flex items-center gap-2">
                热门商品
                <Flame className="w-5 h-5 text-primary" />
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">精选品质，为你推荐</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-sm gap-1">
            查看全部
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer bg-card rounded-xl lg:rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-square overflow-hidden bg-secondary/50">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-semibold">{product.tag}</div>
                <button onClick={(e) => toggleFavorite(product.id, e)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-sm">
                  <Heart className={`w-3.5 h-3.5 transition-colors ${favorites.includes(product.id) ? "fill-primary text-primary" : "text-foreground"}`} />
                </button>
              </div>
              <div className="p-3 space-y-2">
                <h3 className="text-xs lg:text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                <div className="flex items-end justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm lg:text-base font-bold text-primary">¥{product.price}</span>
                    <span className="text-[10px] lg:text-xs text-muted-foreground line-through">¥{product.originalPrice}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{formatSales(product.sales)}已售</span>
                  </div>
                </div>
                <button className="w-full py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-primary hover:text-primary-foreground transition-colors lg:opacity-0 lg:group-hover:opacity-100">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  加入购物袋
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
