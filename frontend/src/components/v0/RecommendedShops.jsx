import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Store, Star, Package, ChevronRight, ShieldCheck } from "lucide-react"
import api from "../../api/index"

const coverColors = [
  "from-rose-400 to-pink-500",
  "from-blue-400 to-cyan-500",
  "from-violet-400 to-purple-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-indigo-400 to-blue-500",
  "from-pink-400 to-rose-500",
  "from-cyan-400 to-teal-500",
]

function formatScore(score) {
  if (score >= 10000) return (score / 10000).toFixed(1) + '万'
  if (score >= 1000) return (score / 1000).toFixed(1) + 'k'
  return score.toString()
}

export function RecommendedShops() {
  const [sellers, setSellers] = useState([])

  useEffect(() => {
    api.get('/sellers/featured')
      .then(data => setSellers(data))
      .catch(() => {})
  }, [])

  if (sellers.length === 0) return null

  return (
    <section className="py-6 lg:py-10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-5 lg:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Store className="w-4.5 h-4.5 lg:w-5 lg:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base lg:text-xl font-bold text-foreground">推荐店铺</h2>
              <p className="text-[11px] lg:text-xs text-muted-foreground">eBay 优质商家精选</p>
            </div>
          </div>
          <Link to="/category" className="flex items-center gap-0.5 text-xs lg:text-sm text-primary font-medium">
            全部商品
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar lg:grid lg:grid-cols-4 lg:gap-4">
          {sellers.map((seller, index) => (
            <Link
              key={seller.name}
              to={`/category?seller=${encodeURIComponent(seller.name)}`}
              className="group flex-shrink-0 w-[220px] lg:w-auto bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
            >
              {/* 顶部渐变背景 */}
              <div className={`relative h-16 lg:h-20 bg-gradient-to-r ${coverColors[index % coverColors.length]}`}>
                {/* Logo - 首字母 */}
                <div className="absolute -bottom-6 left-4 w-14 h-14 lg:w-16 lg:h-16 rounded-xl border-4 border-white shadow-lg bg-white flex items-center justify-center">
                  <span className="text-2xl lg:text-3xl font-bold text-primary">
                    {seller.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="pt-8 lg:pt-10 p-4">
                {/* 卖家名和好评率 */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {seller.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{seller.category}</p>
                  </div>
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-50">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-[11px] font-semibold text-amber-600">{seller.feedbackPercent}%</span>
                  </div>
                </div>

                {/* 数据统计 */}
                <div className="flex items-center gap-4 py-2.5 mb-3 border-y border-border/50">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs">
                      <span className="font-semibold text-foreground">{formatScore(seller.feedbackScore)}</span>
                      <span className="text-muted-foreground ml-0.5">好评</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs">
                      <span className="font-semibold text-foreground">{seller.productCount}</span>
                      <span className="text-muted-foreground ml-0.5">商品</span>
                    </span>
                  </div>
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-primary/5 text-primary border border-primary/10">
                    eBay 认证
                  </span>
                  {parseFloat(seller.feedbackPercent) >= 99 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                      优质商家
                    </span>
                  )}
                </div>

                {/* 进店按钮 */}
                <button className="w-full flex items-center justify-center gap-1 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary hover:text-white transition-colors">
                  进店逛逛
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
