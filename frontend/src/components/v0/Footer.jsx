import { Link } from "react-router-dom"
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react"

const footerLinks = {
  "购物指南": ["购物流程", "支付方式", "发票说明", "购物保障"],
  "配送服务": ["配送范围", "配送时间", "验货签收", "自提服务"],
  "售后服务": ["退换货政策", "价格保护", "维修服务", "投诉建议"],
  "关于我们": ["公司介绍", "联系我们", "招聘信息", "合作加盟"],
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="py-12 lg:py-16 grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-2xl">U</span>
              </div>
              <div>
                <span className="text-xl font-bold text-background">UniShop</span>
                <span className="block text-[10px] text-background/60 tracking-widest uppercase">Global Selection</span>
              </div>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed mb-6 max-w-xs">
              致力于为您提供高品质的购物体验，精选全球好物，品质保障。
            </p>
            <div className="space-y-3 text-sm text-background/80">
              <a href="tel:400-888-8888" className="flex items-center gap-3 hover:text-background transition-colors">
                <Phone className="w-4 h-4 text-primary" />
                <span>400-888-8888</span>
              </a>
              <a href="mailto:service@unishop.com" className="flex items-center gap-3 hover:text-background transition-colors">
                <Mail className="w-4 h-4 text-primary" />
                <span>service@unishop.com</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>上海市浦东新区科技大道888号</span>
              </div>
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-background mb-4 text-sm tracking-wide">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link to="#" className="text-sm text-background/60 hover:text-background transition-colors inline-flex items-center gap-1 group">
                      {link}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-background/10 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-background/50">
            <p>© 2024 UniShop 版权所有 沪ICP备12345678号</p>
            <div className="flex items-center gap-6">
              <Link to="#" className="hover:text-background transition-colors">隐私政策</Link>
              <Link to="#" className="hover:text-background transition-colors">服务条款</Link>
              <Link to="#" className="hover:text-background transition-colors">法律声明</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
