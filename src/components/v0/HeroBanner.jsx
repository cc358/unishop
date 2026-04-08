import { useState, useEffect } from "react"
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Zap, Crown } from "lucide-react"
import { Button } from "../ui/button"

const banners = [
  {
    id: 1,
    title: "新品首发",
    subtitle: "抢先体验全球精选",
    description: "每周上新数百款，发现属于你的心动好物",
    cta: "立即探索",
    badge: "NEW",
    icon: Sparkles,
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    bgGradient: "from-orange-50 via-amber-50/50 to-background",
    image: "/images/hero-new.jpg",
  },
  {
    id: 2,
    title: "限时促销",
    subtitle: "全场低至 5 折",
    description: "春季焕新大促，精选商品限时特惠，手慢无",
    cta: "抢购好物",
    badge: "50% OFF",
    icon: Zap,
    gradient: "from-red-500 via-rose-500 to-pink-500",
    bgGradient: "from-rose-50 via-pink-50/50 to-background",
    image: "/images/hero-sale.jpg",
  },
  {
    id: 3,
    title: "会员专享",
    subtitle: "尊享 VIP 特权",
    description: "积分翻倍、专属折扣、生日礼遇等你来享",
    cta: "开通会员",
    badge: "VIP",
    icon: Crown,
    gradient: "from-violet-500 via-purple-500 to-indigo-500",
    bgGradient: "from-violet-50 via-purple-50/50 to-background",
    image: "/images/hero-vip.jpg",
  },
]

export function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext()
    }, 5000)
    return () => clearInterval(timer)
  }, [current])

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrent((prev) => (prev + 1) % banners.length)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const handlePrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const handleDot = (index) => {
    if (isAnimating || index === current) return
    setIsAnimating(true)
    setCurrent(index)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const currentBanner = banners[current]

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${currentBanner.bgGradient} transition-all duration-700`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 bg-gradient-to-r ${currentBanner.gradient} -translate-y-1/2 transition-all duration-700`} />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="py-8 md:py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative min-h-[260px] md:min-h-[300px] order-2 lg:order-1">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 transition-all duration-600 ease-out ${
                    index === current
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4 pointer-events-none"
                  }`}
                >
                  <div className="space-y-4 lg:space-y-5">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${banner.gradient} text-white text-xs font-bold shadow-lg`}>
                      <banner.icon className="w-3.5 h-3.5" />
                      {banner.subtitle}
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-foreground tracking-tight leading-tight">
                      {banner.title}
                    </h1>
                    <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-lg leading-relaxed">
                      {banner.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-3">
                      <Button
                        size="lg"
                        className={`rounded-full px-8 h-12 text-sm font-bold bg-gradient-to-r ${banner.gradient} hover:opacity-90 transition-all shadow-xl hover:shadow-2xl hover:scale-105`}
                      >
                        {banner.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="rounded-full px-6 h-12 text-sm font-semibold border-2 hover:bg-secondary"
                      >
                        了解更多
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg">
                <div className="relative aspect-[4/3] md:aspect-square">
                  {banners.map((banner, index) => (
                    <div
                      key={banner.id}
                      className={`absolute inset-0 transition-all duration-500 ease-out ${
                        index === current
                          ? "opacity-100 scale-100 translate-y-0"
                          : "opacity-0 scale-95 translate-y-4"
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <div className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className={`absolute -top-3 -right-3 md:-top-4 md:-right-4 px-4 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl bg-gradient-to-r ${banner.gradient} text-white font-bold text-sm md:text-base shadow-lg`}>
                          {banner.badge}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 md:mt-10">
            <div className="flex items-center gap-2">
              {banners.map((banner, index) => (
                <button
                  key={index}
                  onClick={() => handleDot(index)}
                  className={`relative h-2.5 rounded-full transition-all duration-300 overflow-hidden ${
                    index === current ? "w-10" : "w-2.5 bg-border hover:bg-muted-foreground/50"
                  }`}
                >
                  {index === current && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-3 hidden sm:block">
                {String(current + 1).padStart(2, '0')} / {String(banners.length).padStart(2, '0')}
              </span>
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10 md:h-11 md:w-11 border-2 hover:bg-secondary transition-all hover:scale-105" onClick={handlePrev}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10 md:h-11 md:w-11 border-2 hover:bg-secondary transition-all hover:scale-105" onClick={handleNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
