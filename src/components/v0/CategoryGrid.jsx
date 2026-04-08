import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"

const categories = [
  { id: 1, name: "时尚服饰", count: "2.3万+", image: "/images/category-fashion.jpg", bgColor: "from-rose-50 to-pink-50", borderColor: "hover:border-rose-300", shadowColor: "hover:shadow-rose-100" },
  { id: 2, name: "数码家电", count: "1.8万+", image: "/images/category-electronics.jpg", bgColor: "from-blue-50 to-indigo-50", borderColor: "hover:border-blue-300", shadowColor: "hover:shadow-blue-100" },
  { id: 3, name: "生鲜美食", count: "5千+", image: "/images/category-fresh.jpg", bgColor: "from-green-50 to-emerald-50", borderColor: "hover:border-green-300", shadowColor: "hover:shadow-green-100" },
  { id: 4, name: "美妆护肤", count: "1.2万+", image: "/images/category-beauty.jpg", bgColor: "from-pink-50 to-fuchsia-50", borderColor: "hover:border-pink-300", shadowColor: "hover:shadow-pink-100" },
  { id: 5, name: "家居生活", count: "3.5万+", image: "/images/category-home.jpg", bgColor: "from-amber-50 to-yellow-50", borderColor: "hover:border-amber-300", shadowColor: "hover:shadow-amber-100" },
  { id: 6, name: "精选礼品", count: "8千+", image: "/images/category-gifts.jpg", bgColor: "from-purple-50 to-violet-50", borderColor: "hover:border-purple-300", shadowColor: "hover:shadow-purple-100" },
  { id: 7, name: "母婴用品", count: "1.5万+", image: "/images/category-baby.jpg", bgColor: "from-cyan-50 to-teal-50", borderColor: "hover:border-cyan-300", shadowColor: "hover:shadow-cyan-100" },
  { id: 8, name: "运动户外", count: "9千+", image: "/images/category-sports.jpg", bgColor: "from-orange-50 to-red-50", borderColor: "hover:border-orange-300", shadowColor: "hover:shadow-orange-100" },
]

export function CategoryGrid() {
  return (
    <section className="py-6 lg:py-10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center mb-6 lg:mb-8">
          <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-2">热卖分类</h2>
          <div className="flex items-center gap-2">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-primary rounded-full" />
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
            </div>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-primary rounded-full" />
          </div>
        </div>

        <div className="flex lg:grid lg:grid-cols-8 gap-3 lg:gap-4 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category`}
              className="group flex-shrink-0 w-[90px] lg:w-auto"
            >
              <div className={`relative bg-gradient-to-br ${category.bgColor} rounded-2xl p-2.5 lg:p-3 border-2 border-transparent ${category.borderColor} ${category.shadowColor} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                <div className="relative w-16 h-16 lg:w-[72px] lg:h-[72px] mx-auto mb-2 rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-black/5">
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="text-center">
                  <h3 className="text-xs lg:text-sm font-semibold text-foreground mb-0.5 truncate group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-[10px] lg:text-xs text-muted-foreground">{category.count}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-4 lg:mt-6">
          <Link to="/category" className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium transition-colors group">
            查看全部分类
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
