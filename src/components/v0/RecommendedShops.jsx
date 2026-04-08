import { Link } from "react-router-dom"
import { ArrowRight, Store, Star, Users, Package, ChevronRight } from "lucide-react"

const shops = [
  { id: 1, name: "潮流先锋旗舰店", logo: "/images/shop-1.jpg", category: "时尚服饰", rating: 4.9, followers: "12.8万", products: 2680, tags: ["正品保障", "极速发货"], coverColor: "from-rose-400 to-pink-500" },
  { id: 2, name: "数码科技专营店", logo: "/images/shop-2.jpg", category: "数码家电", rating: 4.8, followers: "8.5万", products: 1520, tags: ["官方授权", "7天无理由"], coverColor: "from-blue-400 to-cyan-500" },
  { id: 3, name: "美妆护肤集合店", logo: "/images/shop-3.jpg", category: "美妆护肤", rating: 4.9, followers: "15.2万", products: 3200, tags: ["正品保障", "专柜同款"], coverColor: "from-pink-400 to-rose-500" },
  { id: 4, name: "生活家居优选", logo: "/images/shop-4.jpg", category: "家居生活", rating: 4.7, followers: "6.3万", products: 980, tags: ["品质优选", "包邮"], coverColor: "from-emerald-400 to-teal-500" },
]

export function RecommendedShops() {
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
              <p className="text-[11px] lg:text-xs text-muted-foreground">精选优质商家</p>
            </div>
          </div>
          <Link to="#" className="flex items-center gap-0.5 text-xs lg:text-sm text-primary font-medium">
            全部店铺
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar lg:grid lg:grid-cols-4 lg:gap-4">
          {shops.map((shop) => (
            <Link key={shop.id} to="#" className="group flex-shrink-0 w-[220px] lg:w-auto bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
              <div className={`relative h-16 lg:h-20 bg-gradient-to-r ${shop.coverColor}`}>
                <div className="absolute -bottom-6 left-4 w-14 h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden border-4 border-white shadow-lg bg-white">
                  <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="pt-8 lg:pt-10 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{shop.name}</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{shop.category}</p>
                  </div>
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-50">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-[11px] font-semibold text-amber-600">{shop.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 py-2.5 mb-3 border-y border-border/50">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs"><span className="font-semibold text-foreground">{shop.followers}</span><span className="text-muted-foreground ml-0.5">粉丝</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs"><span className="font-semibold text-foreground">{shop.products}</span><span className="text-muted-foreground ml-0.5">商品</span></span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {shop.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-primary/5 text-primary border border-primary/10">{tag}</span>
                  ))}
                </div>
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
