import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Sparkles, Heart, ShoppingCart } from "lucide-react"
import { getProducts } from "../../api/product"

export function NewArrivals() {
  const [favorites, setFavorites] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts({ limit: 20, sortBy: 'newest' })
      .then(data => {
        const all = (data.products || []).filter(p => p.price >= 10 && p.image && !p.image.includes('placeholder'))
        const shuffled = all.sort(() => Math.random() - 0.5)
        setProducts(shuffled.slice(0, 4))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleFavorite = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
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
          <Link to="/category" className="flex items-center gap-0.5 text-xs lg:text-sm text-primary font-medium">
            更多
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-3 lg:grid lg:grid-cols-4 lg:gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex-shrink-0 w-[160px] lg:w-auto bg-card rounded-2xl overflow-hidden border border-border/50 animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-3"><div className="h-4 bg-gray-200 rounded mb-2" /><div className="h-4 bg-gray-200 rounded w-2/3" /></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto no-scrollbar lg:grid lg:grid-cols-4 lg:gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group relative flex-shrink-0 w-[160px] lg:w-auto bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                {product.condition && (
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold text-white bg-emerald-500">
                      {product.condition.split(' - ')[0]}
                    </span>
                  </div>
                )}
                <button
                  onClick={(e) => toggleFavorite(product.id, e)}
                  className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                >
                  <Heart className={`w-3.5 h-3.5 transition-colors ${favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </button>
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <img src={product.image || '/placeholder.jpg'} alt={product.name} onError={(e) => { e.target.src = '/placeholder.jpg' }} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-3 lg:p-4">
                  <h3 className="text-xs lg:text-sm font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm lg:text-base font-bold text-primary">${product.price}</span>
                    <button onClick={(e) => e.preventDefault()} className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white text-primary transition-colors">
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
