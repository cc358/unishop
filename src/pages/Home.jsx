import { Link } from 'react-router-dom'
import { ShoppingBag, Truck, Shield, Headphones } from 'lucide-react'

// 首页
function Home() {
  return (
    <div>
      {/* Banner */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">UniShop</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">发现好物，尽在 UniShop</p>
          <Link
            to="/products"
            className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full hover:shadow-lg transition"
          >
            立即选购
          </Link>
        </div>
      </section>

      {/* 特色服务 */}
      <section className="max-w-6xl mx-auto py-12 px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: ShoppingBag, title: '精选好物', desc: '严格品控' },
          { icon: Truck, title: '快速配送', desc: '闪电发货' },
          { icon: Shield, title: '正品保障', desc: '假一赔十' },
          { icon: Headphones, title: '售后无忧', desc: '7天退换' },
        ].map((item) => (
          <div key={item.title} className="text-center p-4">
            <item.icon className="w-10 h-10 mx-auto mb-3 text-indigo-600" />
            <h3 className="font-semibold mb-1">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* 推荐商品占位 */}
      <section className="max-w-6xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">热门推荐</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
              <div className="bg-gray-200 h-40 rounded mb-3" />
              <div className="bg-gray-200 h-4 rounded mb-2" />
              <div className="bg-gray-200 h-4 rounded w-1/2" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
