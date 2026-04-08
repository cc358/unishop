import { ShieldCheck, Truck, RotateCcw, Headphones, BadgeCheck, Clock } from "lucide-react"

const badges = [
  { icon: ShieldCheck, title: "正品保障", desc: "官方授权 假一赔十", color: "text-green-600", bg: "bg-green-50" },
  { icon: Truck, title: "极速配送", desc: "全国大部分地区次日达", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: RotateCcw, title: "无忧退换", desc: "7天无理由退换货", color: "text-orange-600", bg: "bg-orange-50" },
  { icon: Headphones, title: "专属客服", desc: "7x24小时在线服务", color: "text-purple-600", bg: "bg-purple-50" },
  { icon: BadgeCheck, title: "品质精选", desc: "严格质检 层层把关", color: "text-cyan-600", bg: "bg-cyan-50" },
  { icon: Clock, title: "极速退款", desc: "审核通过后立即退款", color: "text-rose-600", bg: "bg-rose-50" },
]

export function TrustBadges() {
  return (
    <section className="py-8 lg:py-12 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-6 lg:mb-8">
          <h2 className="text-lg lg:text-xl font-bold text-foreground">购物保障</h2>
          <p className="text-sm text-muted-foreground mt-1">让每一次购物都安心无忧</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {badges.map((badge) => {
            const Icon = badge.icon
            return (
              <div key={badge.title} className="group flex flex-col items-center text-center p-4 lg:p-5 rounded-2xl bg-card hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl ${badge.bg} flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 lg:w-7 lg:h-7 ${badge.color}`} strokeWidth={1.5} />
                </div>
                <h3 className="text-sm lg:text-base font-semibold text-foreground mb-1">{badge.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{badge.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
