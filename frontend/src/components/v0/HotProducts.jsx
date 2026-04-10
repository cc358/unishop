import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Star, Heart, ShoppingCart, ArrowRight, Flame } from "lucide-react"
import { Button } from "../ui/button"
import { getProducts } from "../../api/product"
import { useCartStore } from "../../stores/useCartStore"

const tags = ["热销", "新品", "折扣", "爆款", "特惠", "精选", "推荐", "好评"]

export function HotProducts() {
  const [favorites, setFavorites] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    getProducts({ limit: 8, sortBy: 'sales' })
      .then((data) => {
        const items = (data.products || []).map(p => ({
          id: p.id,
          title: p.name,
          price: p.price,
          currency: p.currency || 'USD',
          image: p.image,
          condition: p.condition,
          sales: p.sales,
          source: p.source,
        }))
        setProducts(items)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleFavorite = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const isEbayId = (id) => typeof id === 'string' && id.includes('v1|')

  const handleAddCart = (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ id: product.id, name: product.title, price: product.price, image: product.image, quantity: 1 })
  }

  if (loading) {
    return (
      <section className="py-8 lg:py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-card rounded-xl overflow-hidden border border-border/50 animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
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
          <Link to="/category">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-sm gap-1">
              查看全部
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
          {products.map((product, index) => {
            const productUrl = isEbayId(product.id)
              ? `/product/${product.id}`
              : `/product/${product.id}`
            return (
              <Link key={product.id} to={productUrl} className="group cursor-pointer bg-card rounded-xl lg:rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-square overflow-hidden bg-secondary/50">
                  <img src={product.image || '/placeholder.jpg'} alt={product.title} onError={(e) => { e.target.src = '/placeholder.jpg' }} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-semibold">{tags[index % tags.length]}</div>
                  <button onClick={(e) => toggleFavorite(product.id, e)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-sm">
                    <Heart className={`w-3.5 h-3.5 transition-colors ${favorites.includes(product.id) ? "fill-primary text-primary" : "text-foreground"}`} />
                  </button>
                </div>
                <div className="p-3 space-y-2">
                  <h3 className="text-xs lg:text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">{product.title}</h3>
                  <div className="flex items-end justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm lg:text-base font-bold text-primary">${product.price}</span>
                      <span className="text-[10px] text-muted-foreground">{product.currency}</span>
                    </div>
                    {product.condition && (
                      <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">{product.condition}</span>
                    )}
                  </div>
                  <button onClick={(e) => handleAddCart(product, e)} className="w-full py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-primary hover:text-primary-foreground transition-colors lg:opacity-0 lg:group-hover:opacity-100">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    加入购物袋
                  </button>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
