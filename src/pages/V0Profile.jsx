import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft, Settings, ChevronRight, Package, Wallet, Ticket, Heart,
  Clock, Truck, RotateCcw, Star, MapPin, CreditCard, Bell, Shield,
  HelpCircle, MessageSquare, Gift, Zap, Crown, LogOut, Camera, Edit3, CheckCircle
} from "lucide-react"
import { MobileNav } from "../components/v0/MobileNav"

const userData = {
  name: "张小明", level: "黄金会员", levelProgress: 68,
  points: 2580, balance: 128.50, coupons: 12, favorites: 36,
  phone: "138****8888",
}

const orderStatus = [
  { id: "pending", name: "待付款", icon: Wallet, count: 2, color: "text-orange-500", bg: "bg-orange-50" },
  { id: "shipped", name: "待发货", icon: Package, count: 1, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "delivery", name: "待收货", icon: Truck, count: 3, color: "text-purple-500", bg: "bg-purple-50" },
  { id: "review", name: "待评价", icon: Star, count: 5, color: "text-yellow-500", bg: "bg-yellow-50" },
  { id: "refund", name: "退换/售后", icon: RotateCcw, count: 0, color: "text-gray-500", bg: "bg-gray-50" },
]

const assets = [
  { name: "账户余额", value: `¥${userData.balance}`, icon: Wallet, color: "from-orange-400 to-orange-500" },
  { name: "充值", value: "充值", icon: CreditCard, color: "from-green-400 to-emerald-500" },
  { name: "优惠券", value: `${userData.coupons}张`, icon: Ticket, color: "from-pink-400 to-pink-500" },
  { name: "积分", value: userData.points, icon: Zap, color: "from-purple-400 to-purple-500" },
  { name: "收藏", value: userData.favorites, icon: Heart, color: "from-red-400 to-red-500" },
]

const tools = [
  { name: "收货地址", icon: MapPin, href: "#", color: "text-blue-500", bg: "bg-blue-50" },
  { name: "支付管理", icon: CreditCard, href: "#", color: "text-green-500", bg: "bg-green-50" },
  { name: "消息通知", icon: Bell, href: "#", color: "text-orange-500", bg: "bg-orange-50", badge: 3 },
  { name: "账户安全", icon: Shield, href: "#", color: "text-purple-500", bg: "bg-purple-50" },
  { name: "帮助中心", icon: HelpCircle, href: "#", color: "text-cyan-500", bg: "bg-cyan-50" },
  { name: "在线客服", icon: MessageSquare, href: "#", color: "text-pink-500", bg: "bg-pink-50" },
  { name: "邀请有礼", icon: Gift, href: "#", color: "text-yellow-500", bg: "bg-yellow-50" },
  { name: "浏览记录", icon: Clock, href: "#", color: "text-gray-500", bg: "bg-gray-50" },
]

const recentOrders = [
  {
    id: "ORD20240315001", status: "待收货", statusColor: "text-purple-500",
    items: [{ name: "经典款运动休闲鞋", image: "/images/product-1.jpg", spec: "白色 / 42码", price: 299, quantity: 1 }],
    total: 299, date: "2024-03-15"
  },
  {
    id: "ORD20240312002", status: "已完成", statusColor: "text-green-500",
    items: [{ name: "无线降噪蓝牙耳机", image: "/images/product-2.jpg", spec: "黑色", price: 599, quantity: 1 }],
    total: 599, date: "2024-03-12"
  },
]

export default function V0Profile() {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="relative bg-gradient-to-br from-primary via-orange-500 to-amber-500 pt-12 pb-24 lg:pb-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">返回首页</span>
            </Link>
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white/20 ring-4 ring-white/30 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                  <span className="text-3xl lg:text-4xl font-bold text-white">{userData.name.charAt(0)}</span>
                </div>
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl lg:text-2xl font-bold text-white">{userData.name}</h1>
                <button className="p-1 hover:bg-white/10 rounded transition-colors"><Edit3 className="w-4 h-4 text-white/70" /></button>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full text-xs font-semibold text-white shadow-sm">
                  <Crown className="w-3 h-3" />{userData.level}
                </span>
                <span className="text-white/70 text-sm">{userData.phone}</span>
              </div>
              <div className="max-w-xs">
                <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                  <span>距离钻石会员还需 320 成长值</span>
                  <span>{userData.levelProgress}%</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full transition-all duration-500" style={{ width: `${userData.levelProgress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 lg:-mt-20 relative z-10 pb-24 lg:pb-8">
        {/* 资产卡片 */}
        <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 mb-4">
          <div className="grid grid-cols-5 gap-1 lg:gap-4">
            {assets.map((item, index) => (
              <button key={index} className="flex flex-col items-center py-3 lg:py-4 rounded-xl transition-colors group hover:bg-gray-50">
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm`}>
                  <item.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <span className="text-base lg:text-xl font-bold text-gray-900">{item.value}</span>
                <span className="text-[10px] lg:text-xs text-gray-500">{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 订单区域 */}
        <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base lg:text-lg font-bold text-gray-900">我的订单</h2>
            <Link to="/orders" className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors">
              全部订单<ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-5 gap-2 lg:gap-4">
            {orderStatus.map((item) => (
              <button key={item.id} className="flex flex-col items-center py-3 rounded-xl hover:bg-gray-50 transition-colors group relative">
                <div className={`w-11 h-11 lg:w-14 lg:h-14 rounded-xl ${item.bg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${item.color}`} />
                </div>
                <span className="text-xs lg:text-sm text-gray-600">{item.name}</span>
                {item.count > 0 && <span className="absolute top-1 right-1/4 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold rounded-full bg-primary text-white">{item.count}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* 最近订单 */}
        <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 mb-4">
          <h2 className="text-base lg:text-lg font-bold text-gray-900 mb-4">最近订单</h2>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="border border-gray-100 rounded-xl p-3 lg:p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400">订单号：{order.id}</span>
                  <span className={`text-sm font-medium ${order.statusColor}`}>{order.status}</span>
                </div>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{item.spec}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-primary">¥{item.price}</span>
                        <span className="text-xs text-gray-400">x{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">{order.date}</span>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-full hover:border-gray-300 transition-colors">查看详情</button>
                    {order.status === "待收货" && <button className="px-3 py-1.5 text-xs text-white bg-primary rounded-full hover:bg-primary/90 transition-colors">确认收货</button>}
                    {order.status === "已完成" && <button className="px-3 py-1.5 text-xs text-primary border border-primary rounded-full hover:bg-primary/5 transition-colors">再次购买</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 常用功能 */}
        <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 mb-4">
          <h2 className="text-base lg:text-lg font-bold text-gray-900 mb-4">常用功能</h2>
          <div className="grid grid-cols-4 gap-3 lg:gap-4">
            {tools.map((item, index) => (
              <Link key={index} to={item.href} className="flex flex-col items-center py-3 rounded-xl hover:bg-gray-50 transition-colors group relative">
                <div className={`w-11 h-11 lg:w-12 lg:h-12 rounded-xl ${item.bg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${item.color}`} />
                </div>
                <span className="text-xs lg:text-sm text-gray-600">{item.name}</span>
                {item.badge && item.badge > 0 && <span className="absolute top-1 right-1/4 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold rounded-full bg-primary text-white">{item.badge}</span>}
              </Link>
            ))}
          </div>
        </div>

        <button className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center justify-center gap-2 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">退出登录</span>
        </button>
      </div>

      <MobileNav />
    </div>
  )
}
