import { useState, useEffect } from "react"
import { ArrowRight, Zap, ShoppingCart } from "lucide-react"

const flashSaleProducts = [
  { id: 1, name: "无线降噪耳机 Pro", originalPrice: 499, salePrice: 199, sold: 85, total: 100, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop" },
  { id: 2, name: "智能运动手表", originalPrice: 899, salePrice: 399, sold: 72, total: 100, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop" },
  { id: 3, name: "便携式充电宝", originalPrice: 299, salePrice: 99, sold: 91, total: 100, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop" },
  { id: 4, name: "真皮手提包", originalPrice: 599, salePrice: 259, sold: 68, total: 100, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop" },
]

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
            <button className="text-xs text-primary font-medium flex items-center gap-0.5">
              更多
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar lg:grid lg:grid-cols-4 lg:gap-4">
          {flashSaleProducts.map((product) => (
            <div key={product.id} className="group relative flex-shrink-0 w-[160px] lg:w-auto bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold shadow-sm">
                {Math.round((1 - product.salePrice / product.originalPrice) * 100)}%OFF
              </div>
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-3 lg:p-4">
                <h3 className="text-xs lg:text-sm font-medium text-foreground line-clamp-1 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm lg:text-base font-bold text-primary">¥{product.salePrice}</span>
                    <span className="text-[10px] lg:text-xs text-muted-foreground line-through">¥{product.originalPrice}</span>
                  </div>
                  <button className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors">
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="relative h-2 bg-primary/10 rounded-full overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-orange-500 rounded-full transition-all duration-500" style={{ width: `${(product.sold / product.total) * 100}%` }} />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-muted-foreground">已抢 <span className="text-primary font-semibold">{product.sold}%</span></span>
                  <span className="text-[10px] text-muted-foreground">仅剩{product.total - product.sold}件</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
