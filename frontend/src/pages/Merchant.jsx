import { Link } from 'react-router-dom'
import { Store, ArrowLeft, CheckCircle } from 'lucide-react'

export default function Merchant() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">商家入驻</h1>
          <p className="text-lg text-muted-foreground mb-8">加入 UniShop 平台，开启你的电商之旅</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              { title: '流量扶持', desc: '新店入驻享平台流量推荐' },
              { title: '低佣金率', desc: '行业最低佣金，让利商家' },
              { title: '专属客服', desc: '一对一运营指导服务' },
            ].map((item) => (
              <div key={item.title} className="bg-card rounded-xl p-5 border border-border/50">
                <CheckCircle className="w-6 h-6 text-primary mb-2" />
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-muted-foreground mb-6">入驻功能即将上线，敬请期待</p>
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
