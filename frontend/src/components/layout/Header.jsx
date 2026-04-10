import { Link } from 'react-router-dom'
import { ShoppingCart, User, Search } from 'lucide-react'
import { useCartStore } from '../../stores/useCartStore'
import { useAuthStore } from '../../stores/useAuthStore'

// 顶部导航
function Header() {
  const itemCount = useCartStore((s) => s.items.length)
  const user = useAuthStore((s) => s.user)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-indigo-600">
          UniShop
        </Link>

        {/* 搜索栏 - 桌面端 */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索商品..."
              className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* 右侧图标 */}
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-600" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <Link to={user ? '/profile' : '/login'}>
            <User className="w-6 h-6 text-gray-600" />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
