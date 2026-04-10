// MerchantApply.jsx - UniShop 商家入驻页面完整代码
// 使用前需安装: shadcn/ui 组件库 和 lucide-react 图标库

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Store,
  ShoppingBag,
  User,
  Search,
  ArrowRight,
  Sparkles,
  Zap,
  Percent,
  Headphones,
  TrendingUp,
  Shield,
  Globe,
  FileText,
  Rocket,
  Star,
  Quote,
  Phone,
  Mail,
  X,
  Upload,
  CheckCircle,
  ArrowLeft,
  Building2,
} from "lucide-react"

// ============================================================
// UI Components (来自 shadcn/ui，需要提前安装)
// ============================================================
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Avatar, AvatarFallback } from "../ui/avatar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"
import { cn } from "../../lib/utils"

// ============================================================
// Header 组件
// ============================================================
function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">U</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">UniShop</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Global Selection
            </span>
          </div>
        </Link>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden flex-1 max-w-md mx-8 md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索商品、品牌、分类..."
              className="w-full pl-10 pr-20 bg-input border-border"
            />
            <Button
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-4"
            >
              搜索
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/category"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            全部商品
          </Link>
          <Link
            to="/merchant"
            className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            商家入驻
          </Link>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <ShoppingBag className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <User className="h-5 w-5" />
          </Button>
        </nav>
      </div>
    </header>
  )
}

// ============================================================
// Hero 区域组件
// ============================================================
function HeroSection({ onOpenForm }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>新商家入驻享专属流量扶持</span>
          </div>

          {/* Icon */}
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
            <Store className="h-10 w-10 text-primary-foreground" />
          </div>

          {/* Title */}
          <h1 className="mb-6 max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            加入 UniShop 平台
            <span className="block text-primary">开启您的电商之旅</span>
          </h1>

          {/* Description */}
          <p className="mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
            我们为商家提供专业的电商解决方案，帮助您触达全球消费者，
            实现业务增长。零门槛入驻，全程专人指导。
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <Button
              size="lg"
              className="h-12 px-8 text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
              onClick={onOpenForm}
            >
              立即入驻
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base font-semibold"
            >
              了解更多
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>7天快速审核</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>零保证金入驻</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>全程专人指导</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// 数据统计组件
// ============================================================
const stats = [
  { label: "入驻商家", value: 50000, suffix: "+", prefix: "" },
  { label: "日均订单量", value: 1200000, suffix: "+", prefix: "" },
  { label: "覆盖用户", value: 8000, suffix: "万+", prefix: "" },
  { label: "商家平均增长", value: 300, suffix: "%", prefix: "" },
]

function AnimatedNumber({ value, suffix, prefix }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 10000).toFixed(0) + "万"
    }
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + "万"
    }
    return num.toLocaleString()
  }

  return (
    <span>
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </span>
  )
}

function StatsSection() {
  return (
    <section className="border-y border-border bg-card py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center"
            >
              <div className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
              </div>
              <div className="mt-2 text-sm font-medium text-muted-foreground sm:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// 平台优势组件
// ============================================================
const benefits = [
  {
    icon: Zap,
    title: "流量扶持",
    description: "新店入驻享受平台流量倾斜，首月免费推广位，助力快速起步",
  },
  {
    icon: Percent,
    title: "低佣金率",
    description: "行业最低佣金政策，最低仅3%，让利商家实现更高利润",
  },
  {
    icon: Headphones,
    title: "专属客服",
    description: "一对一运营指导，7x24小时在线支持，解决您的所有问题",
  },
  {
    icon: TrendingUp,
    title: "数据赋能",
    description: "智能数据分析工具，实时掌握店铺动态，精准营销决策",
  },
  {
    icon: Shield,
    title: "资金安全",
    description: "平台担保交易，T+1快速结算，资金安全有保障",
  },
  {
    icon: Globe,
    title: "全球市场",
    description: "覆盖180+国家和地区，一站式跨境解决方案，轻松出海",
  },
]

function BenefitsSection() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            为什么选择 UniShop
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            我们致力于为商家提供最优质的服务和最具竞争力的政策
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <Card
              key={benefit.title}
              className="group relative overflow-hidden border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// 入驻流程组件
// ============================================================
const processSteps = [
  {
    number: "01",
    icon: FileText,
    title: "提交申请",
    description: "填写商家入驻申请表，上传相关资质文件",
    duration: "约5分钟",
  },
  {
    number: "02",
    icon: Search,
    title: "资质审核",
    description: "平台审核资质信息，确保合规经营",
    duration: "1-3个工作日",
  },
  {
    number: "03",
    icon: Store,
    title: "店铺装修",
    description: "完成店铺基础设置，上传商品信息",
    duration: "约30分钟",
  },
  {
    number: "04",
    icon: Rocket,
    title: "正式上线",
    description: "开始接单销售，享受平台流量扶持",
    duration: "即刻开始",
  },
]

function ProcessSection() {
  return (
    <section className="py-16 sm:py-24 bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            入驻流程简单便捷
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            四步轻松完成入驻，最快1天即可开店
          </p>
        </div>

        {/* Process Steps */}
        <div className="mt-12 lg:mt-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector Line */}
                {index < processSteps.length - 1 && (
                  <div className="absolute left-1/2 top-16 hidden h-0.5 w-full bg-gradient-to-r from-primary/50 to-primary/10 lg:block" />
                )}

                <div className="flex flex-col items-center text-center">
                  {/* Step Number & Icon */}
                  <div className="relative mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                      <step.icon className="h-8 w-8" />
                    </div>
                    <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-card text-xs font-bold text-primary shadow-md">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {step.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// 成功商家案例组件
// ============================================================
const testimonials = [
  {
    name: "张明",
    role: "数码配件店主",
    avatar: "张",
    rating: 5,
    content:
      "入驻UniShop三个月，店铺销售额增长了200%。平台的流量扶持政策非常给力，专属客服也很专业，帮助我们快速解决了很多运营问题。",
    stats: { growth: "200%", orders: "5000+", months: "3" },
  },
  {
    name: "李芳",
    role: "服装品牌创始人",
    avatar: "李",
    rating: 5,
    content:
      "作为一个新品牌，UniShop给了我们很大的支持。低佣金政策让我们有更多利润空间用于产品研发，数据分析工具也帮助我们更精准地定位目标客户。",
    stats: { growth: "350%", orders: "12000+", months: "6" },
  },
  {
    name: "王海",
    role: "家居用品商家",
    avatar: "王",
    rating: 5,
    content:
      "从传统批发转型电商，UniShop的一对一指导让我少走了很多弯路。现在每月稳定出单上万件，已经开始筹备第二家店铺了。",
    stats: { growth: "500%", orders: "30000+", months: "12" },
  },
]

function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            成功商家故事
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            听听他们是如何在UniShop平台上实现业务增长的
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="relative overflow-hidden border-border bg-card"
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/10" />

                {/* Rating */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  {`"${testimonial.content}"`}
                </p>

                {/* Stats */}
                <div className="mb-6 grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {testimonial.stats.growth}
                    </div>
                    <div className="text-xs text-muted-foreground">增长率</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {testimonial.stats.orders}
                    </div>
                    <div className="text-xs text-muted-foreground">总订单</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {testimonial.stats.months}个月
                    </div>
                    <div className="text-xs text-muted-foreground">入驻时间</div>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// FAQ 组件
// ============================================================
const faqs = [
  {
    question: "入驻需要什么资质？",
    answer:
      "企业商家需提供营业执照、法人身份证、银行开户许可证等基础资质。个人商家需提供身份证、个人银行卡信息。部分类目可能需要额外的行业资质证明。",
  },
  {
    question: "入驻费用是多少？",
    answer:
      "UniShop实行零保证金入驻政策，无需缴纳任何入驻费用。我们仅在您产生销售时收取行业最低的佣金（3%-8%不等，视类目而定）。",
  },
  {
    question: "审核需要多长时间？",
    answer:
      "资质审核通常在1-3个工作日内完成。如您提交的资料完整且清晰，最快当天即可通过审核。审核结果会通过短信和站内信通知您。",
  },
  {
    question: "如何获得平台流量支持？",
    answer:
      "新入驻商家自动享受30天流量扶持期，包括首页推荐位展示、搜索权重加成等。此外，您还可以参与平台的各类营销活动获取更多曝光。",
  },
  {
    question: "结算周期是多久？",
    answer:
      "我们提供T+1快速结算服务，订单确认收货后款项将在次日自动结算到您的账户。您也可以申请即时结算服务（需满足一定条件）。",
  },
  {
    question: "可以销售什么类目的商品？",
    answer:
      "UniShop涵盖服装、数码、家居、美妆、食品等20+个主流类目。除国家法律法规禁止销售的商品外，大部分商品类型均可入驻销售。",
  },
]

function FAQSection() {
  return (
    <section className="py-16 sm:py-24 bg-muted/50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            常见问题
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            了解更多关于入驻的问题
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mt-12">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-lg border border-border bg-card px-6 data-[state=open]:border-primary/50"
              >
                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// CTA 组件
// ============================================================
function CTASection({ onOpenForm }) {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/80">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />

          <CardContent className="relative px-6 py-12 sm:px-12 sm:py-16 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              {/* Content */}
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl text-balance">
                  准备好开启您的电商之旅了吗？
                </h2>
                <p className="mt-4 text-lg text-primary-foreground/80">
                  立即提交入驻申请，我们的专业团队将在24小时内与您联系
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-12 px-8 text-base font-semibold bg-card text-primary hover:bg-card/90"
                    onClick={onOpenForm}
                  >
                    立即入驻
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 text-base font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    预约咨询
                  </Button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-end">
                <div className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-4 py-3 backdrop-blur">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
                    <Phone className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-sm text-primary-foreground/70">
                      招商热线
                    </div>
                    <div className="font-semibold text-primary-foreground">
                      400-888-9999
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-4 py-3 backdrop-blur">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
                    <Mail className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-sm text-primary-foreground/70">
                      商务邮箱
                    </div>
                    <div className="font-semibold text-primary-foreground">
                      merchant@unishop.com
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

// ============================================================
// Footer 组件
// ============================================================
const footerLinks = {
  platform: {
    title: "平台服务",
    links: [
      { label: "商家入驻", href: "/merchant" },
      { label: "物流服务", href: "/logistics" },
      { label: "金融服务", href: "/finance" },
      { label: "营销工具", href: "/marketing" },
    ],
  },
  support: {
    title: "商家支持",
    links: [
      { label: "帮助中心", href: "/help" },
      { label: "商家学院", href: "/academy" },
      { label: "规则中心", href: "/rules" },
      { label: "联系客服", href: "/contact" },
    ],
  },
  about: {
    title: "关于我们",
    links: [
      { label: "公司介绍", href: "/about" },
      { label: "新闻动态", href: "/news" },
      { label: "加入我们", href: "/careers" },
      { label: "合作伙伴", href: "/partners" },
    ],
  },
  legal: {
    title: "法律条款",
    links: [
      { label: "用户协议", href: "/terms" },
      { label: "隐私政策", href: "/privacy" },
      { label: "知识产权", href: "/ip" },
      { label: "免责声明", href: "/disclaimer" },
    ],
  },
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">
                  U
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">
                  UniShop
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Global Selection
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              全球精选电商平台，连接优质商家与消费者，打造一站式购物体验。
            </p>
          </div>

          {/* Links Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground">{section.title}</h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} UniShop. 保留所有权利。
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/terms"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              条款
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              隐私
            </Link>
            <Link
              to="/cookies"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================================
// 入驻申请表单组件
// ============================================================
const formSteps = [
  { id: 1, name: "基本信息", icon: User },
  { id: 2, name: "企业信息", icon: Building2 },
  { id: 3, name: "店铺信息", icon: Store },
  { id: 4, name: "资质上传", icon: FileText },
]

const businessCategories = [
  "服装鞋帽",
  "数码电子",
  "家居家装",
  "美妆个护",
  "食品生鲜",
  "母婴用品",
  "运动户外",
  "图书文具",
  "珠宝配饰",
  "其他",
]

function ApplicationForm({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    // 基本信息
    contactName: "",
    phone: "",
    email: "",
    // 企业信息
    companyName: "",
    businessLicense: "",
    companyAddress: "",
    legalPerson: "",
    // 店铺信息
    shopName: "",
    category: "",
    description: "",
    expectedProducts: "",
    // 资质文件
    licenseFile: null,
    idCardFront: null,
    idCardBack: null,
  })

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
  }

  const handleClose = () => {
    setCurrentStep(1)
    setIsSubmitted(false)
    setFormData({
      contactName: "",
      phone: "",
      email: "",
      companyName: "",
      businessLicense: "",
      companyAddress: "",
      legalPerson: "",
      shopName: "",
      category: "",
      description: "",
      expectedProducts: "",
      licenseFile: null,
      idCardFront: null,
      idCardBack: null,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {isSubmitted ? (
          // Success State
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-foreground">
              申请提交成功
            </h2>
            <p className="mb-8 max-w-md text-muted-foreground">
              感谢您申请入驻 UniShop 平台！我们的招商团队将在 1-3 个工作日内审核您的申请，
              并通过电话或邮件与您联系。
            </p>
            <div className="mb-8 rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                申请编号：<span className="font-semibold text-foreground">US{Date.now()}</span>
              </p>
            </div>
            <Button onClick={handleClose} className="px-8">
              返回首页
            </Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="border-b border-border px-6 py-6">
              <h2 className="text-2xl font-bold text-foreground">商家入驻申请</h2>
              <p className="mt-1 text-muted-foreground">
                请填写以下信息，完成入驻申请
              </p>
            </div>

            {/* Progress Steps */}
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                {formSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                          currentStep === step.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : currentStep > step.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-muted-foreground"
                        )}
                      >
                        {currentStep > step.id ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <step.icon className="h-5 w-5" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "mt-2 text-xs font-medium",
                          currentStep === step.id
                            ? "text-primary"
                            : currentStep > step.id
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        {step.name}
                      </span>
                    </div>
                    {index < formSteps.length - 1 && (
                      <div
                        className={cn(
                          "mx-2 h-0.5 w-12 sm:w-20 lg:w-28",
                          currentStep > step.id ? "bg-primary" : "bg-border"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="px-6 py-6">
              {/* Step 1: 基本信息 */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-lg">联系人信息</CardTitle>
                      <CardDescription>
                        请填写主要联系人信息，方便我们与您沟通
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 px-0">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="contactName">
                            联系人姓名 <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="contactName"
                            placeholder="请输入联系人姓名"
                            value={formData.contactName}
                            onChange={(e) =>
                              updateFormData("contactName", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">
                            手机号码 <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="请输入手机号码"
                            value={formData.phone}
                            onChange={(e) =>
                              updateFormData("phone", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          电子邮箱 <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="请输入电子邮箱"
                          value={formData.email}
                          onChange={(e) =>
                            updateFormData("email", e.target.value)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 2: 企业信息 */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-lg">企业信息</CardTitle>
                      <CardDescription>
                        请填写企业基本信息，确保与营业执照一致
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 px-0">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">
                          公司名称 <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="companyName"
                          placeholder="请输入营业执照上的公司全称"
                          value={formData.companyName}
                          onChange={(e) =>
                            updateFormData("companyName", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="businessLicense">
                            统一社会信用代码 <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="businessLicense"
                            placeholder="请输入18位信用代码"
                            value={formData.businessLicense}
                            onChange={(e) =>
                              updateFormData("businessLicense", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="legalPerson">
                            法定代表人 <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="legalPerson"
                            placeholder="请输入法人姓名"
                            value={formData.legalPerson}
                            onChange={(e) =>
                              updateFormData("legalPerson", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyAddress">
                          公司地址 <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="companyAddress"
                          placeholder="请输入公司详细地址"
                          value={formData.companyAddress}
                          onChange={(e) =>
                            updateFormData("companyAddress", e.target.value)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 3: 店铺信息 */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-lg">店铺信息</CardTitle>
                      <CardDescription>
                        请填写您想要开设的店铺信息
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 px-0">
                      <div className="space-y-2">
                        <Label htmlFor="shopName">
                          店铺名称 <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="shopName"
                          placeholder="请输入您的店铺名称"
                          value={formData.shopName}
                          onChange={(e) =>
                            updateFormData("shopName", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>
                          主营类目 <span className="text-destructive">*</span>
                        </Label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                          {businessCategories.map((category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() =>
                                updateFormData("category", category)
                              }
                              className={cn(
                                "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                                formData.category === category
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted"
                              )}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">
                          店铺简介
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="请简要描述您的店铺特色和主营产品"
                          rows={3}
                          value={formData.description}
                          onChange={(e) =>
                            updateFormData("description", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expectedProducts">
                          预计上架商品数量
                        </Label>
                        <Input
                          id="expectedProducts"
                          placeholder="请输入预计上架的商品数量"
                          value={formData.expectedProducts}
                          onChange={(e) =>
                            updateFormData("expectedProducts", e.target.value)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 4: 资质上传 */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-lg">资质文件上传</CardTitle>
                      <CardDescription>
                        请上传相关资质文件，支持 JPG、PNG、PDF 格式，单个文件不超过 5MB
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 px-0">
                      {/* 营业执照 */}
                      <div className="space-y-2">
                        <Label>
                          营业执照 <span className="text-destructive">*</span>
                        </Label>
                        <div
                          className={cn(
                            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
                            formData.licenseFile
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          {formData.licenseFile ? (
                            <div className="flex items-center gap-3">
                              <CheckCircle className="h-5 w-5 text-primary" />
                              <span className="text-sm font-medium">
                                {formData.licenseFile.name}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateFormData("licenseFile", null)
                                }
                                className="text-sm text-destructive hover:underline"
                              >
                                删除
                              </button>
                            </div>
                          ) : (
                            <>
                              <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                              <p className="mb-1 text-sm font-medium text-foreground">
                                点击或拖拽上传营业执照
                              </p>
                              <p className="text-xs text-muted-foreground">
                                支持 JPG、PNG、PDF 格式
                              </p>
                              <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                className="absolute inset-0 cursor-pointer opacity-0"
                                onChange={(e) =>
                                  updateFormData(
                                    "licenseFile",
                                    e.target.files?.[0] || null
                                  )
                                }
                              />
                            </>
                          )}
                        </div>
                      </div>

                      {/* 身份证 */}
                      <div className="space-y-2">
                        <Label>
                          法人身份证 <span className="text-destructive">*</span>
                        </Label>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {/* 正面 */}
                          <div
                            className={cn(
                              "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
                              formData.idCardFront
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            {formData.idCardFront ? (
                              <div className="flex flex-col items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-primary" />
                                <span className="text-xs font-medium">
                                  身份证正面已上传
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateFormData("idCardFront", null)
                                  }
                                  className="text-xs text-destructive hover:underline"
                                >
                                  删除
                                </button>
                              </div>
                            ) : (
                              <>
                                <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                                <p className="text-sm font-medium text-foreground">
                                  身份证正面
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  人像面
                                </p>
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png"
                                  className="absolute inset-0 cursor-pointer opacity-0"
                                  onChange={(e) =>
                                    updateFormData(
                                      "idCardFront",
                                      e.target.files?.[0] || null
                                    )
                                  }
                                />
                              </>
                            )}
                          </div>

                          {/* 反面 */}
                          <div
                            className={cn(
                              "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
                              formData.idCardBack
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            {formData.idCardBack ? (
                              <div className="flex flex-col items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-primary" />
                                <span className="text-xs font-medium">
                                  身份证反面已上传
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateFormData("idCardBack", null)
                                  }
                                  className="text-xs text-destructive hover:underline"
                                >
                                  删除
                                </button>
                              </div>
                            ) : (
                              <>
                                <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                                <p className="text-sm font-medium text-foreground">
                                  身份证反面
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  国徽面
                                </p>
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png"
                                  className="absolute inset-0 cursor-pointer opacity-0"
                                  onChange={(e) =>
                                    updateFormData(
                                      "idCardBack",
                                      e.target.files?.[0] || null
                                    )
                                  }
                                />
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 提示信息 */}
                      <div className="rounded-lg bg-muted p-4">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">温馨提示：</span>
                          上传的资质文件将用于审核您的入驻资格，我们将严格保护您的信息安全。
                          如有疑问，请联系客服：400-888-9999
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                上一步
              </Button>

              {currentStep < 4 ? (
                <Button onClick={handleNext} className="gap-2">
                  下一步
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="gap-2 px-8">
                  提交申请
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ============================================================
// 主页面组件
// ============================================================
export default function MerchantApply() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <>
      <HeroSection onOpenForm={() => setIsFormOpen(true)} />
      <StatsSection />
      <BenefitsSection />
      <ProcessSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection onOpenForm={() => setIsFormOpen(true)} />

      <ApplicationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </>
  )
}
