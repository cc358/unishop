import { Link } from "react-router-dom"
import { ArrowUpRight, Sparkles, Gift, Crown, Percent } from "lucide-react"

const promos = [
  { id: 1, title: "品牌特卖", subtitle: "大牌低至3折", icon: Sparkles, bgColor: "bg-gradient-to-br from-orange-500 to-amber-500", iconBg: "bg-white/25" },
  { id: 2, title: "新人专区", subtitle: "首单立减20元", icon: Gift, bgColor: "bg-gradient-to-br from-rose-500 to-pink-500", iconBg: "bg-white/25" },
  { id: 3, title: "限时折扣", subtitle: "每日精选好物", icon: Percent, bgColor: "bg-gradient-to-br from-violet-500 to-purple-600", iconBg: "bg-white/25" },
  { id: 4, title: "会员尊享", subtitle: "积分兑好礼", icon: Crown, bgColor: "bg-gradient-to-br from-gray-800 to-gray-900", iconBg: "bg-white/20" },
]

export function PromoBanners() {
  return (
    <section className="py-4 lg:py-6">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {promos.map((promo) => (
            <Link
              key={promo.id}
              to="#"
              className={`group relative overflow-hidden rounded-2xl p-4 lg:p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${promo.bgColor}`}
            >
              <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10" />
              <div className="absolute right-4 top-4 w-12 h-12 rounded-full bg-white/5" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-8 lg:mb-10">
                  <div className={`w-10 h-10 lg:w-11 lg:h-11 rounded-xl ${promo.iconBg} flex items-center justify-center backdrop-blur-sm`}>
                    <promo.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-2">
                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <h3 className="text-base lg:text-lg font-bold text-white mb-0.5">{promo.title}</h3>
                <p className="text-xs lg:text-sm text-white/80">{promo.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
