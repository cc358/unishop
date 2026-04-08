import { useNavigate } from 'react-router-dom'
import { User, Package, MapPin, LogOut } from 'lucide-react'
import { useAuthStore } from '../stores/useAuthStore'

// 个人中心
function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  if (!user) {
    navigate('/login')
    return null
  }

  const menuItems = [
    { icon: Package, label: '我的订单', path: '/orders' },
    { icon: MapPin, label: '收货地址', path: '/addresses' },
  ]

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* 用户信息 */}
      <div className="bg-white rounded-lg p-6 shadow-sm text-center mb-6">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <User className="w-10 h-10 text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>
      </div>

      {/* 菜单 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition border-b last:border-0"
          >
            <item.icon className="w-5 h-5 text-gray-500" />
            <span>{item.label}</span>
          </button>
        ))}
        <button
          onClick={() => { logout(); navigate('/') }}
          className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition text-red-500"
        >
          <LogOut className="w-5 h-5" />
          <span>退出登录</span>
        </button>
      </div>
    </div>
  )
}

export default Profile
