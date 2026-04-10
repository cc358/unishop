import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Zap, ShoppingCart } from "lucide-react"
import { getProducts } from "../../api/product"

function CountdownTimer() {
  const [time, setTime] = useState({ hours: 2, minutes: 30, seconds: 45 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev
        if (seconds > 0) { seconds-- }
        else if (minutes > 0) { minutes--; seconds = 59 }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59 }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-1">
      <TimeBlock value={time.hours} />
      <span className="text-primary font-bold text-xs">:</span>
      <TimeBlock value={time.minutes} />
      <span className="text-primary font-bold text-xs">:</span>
      <TimeBlock value={time.seconds} />
    </div>
  )
}

function TimeBlock({ value }) {
  return (
    <span className="bg-primary text-white px-1.5 py-1 rounded-md text-[11px] font-mono font-bold min-w-[26px] text-center">
      {value.toString().padStart(2, "0")}
    </span>
  )
}

export function FlashSale() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts({ limit: 20, sortBy: 'sales' })
      .then(data => {
        const all = (data.products || []).filter(p => p.price >= 10 && p.image && !p.image.includes('placeholder'))
        // 随机选4条
        const shuffled = all.sort(() => Math.random() - 0.5)
        setProducts(shuffled.slice(0, 4))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-6 lg:py-10 bg-gradient-to-b from-orange-50/50 to-transparent">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-5 lg:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 lg:w-5 lg:h-5 text-white" fill="currentColor" />
            </div>
            <div>
              <h2 className="text-base lg:text-xl font-bold text-foreground">限时秒杀</h2>
              <p className="text-[11px] lg:text-xs text-muted-foreground">超值好物限量抢</p>
            </div>
          </div>
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-primary/5">
              <span className="text-[11px] text-muted-foreground hidden sm:block">距结束</span>
              <CountdownTimer />
            </div>
            <Link to="/category?sortBy=price-asc" className="text-xs text-primary font-medium flex items-center gap-0.5">
              更多
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
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
                className="group relative flex-shrink-0 w-[160px] lg:w-auto bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {product.condition && (
                  <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold shadow-sm">
                    {product.condition.split(' - ')[0]}
                  </div>
                )}
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <img src={product.image || '/placeholder.jpg'} alt={product.name} onError={(e) => { e.target.src = '/placeholder.jpg' }} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-3 lg:p-4">
                  <h3 className="text-xs lg:text-sm font-medium text-foreground line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm lg:text-base font-bold text-primary">${product.price}</span>
                    <button onClick={(e) => e.preventDefault()} className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors">
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {product.sales > 0 && (
                    <span className="text-[10px] text-muted-foreground">{product.sales} 已售</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
