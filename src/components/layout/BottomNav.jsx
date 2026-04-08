import { Link, useLocation } from 'react-router-dom'
import { Home, Search, ShoppingCart, User } from 'lucide-react'
import { useCartStore } from '../../stores/useCartStore'

// 移动端底部导航
const navItems = [
  { icon: Home, label: '首页', path: '/' },
  { icon: Search, label: '分类', path: '/products' },
  { icon: ShoppingCart, label: '购物车', path: '/cart' },
  { icon: User, label: '我的', path: '/profile' },
]

function BottomNav() {
  const location = useLocation()
  const itemCount = useCartStore((s) => s.items.length)

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const active = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center text-xs ${
                active ? 'text-indigo-600' : 'text-gray-500'
              }`}
            >
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {item.label === '购物车' && itemCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
