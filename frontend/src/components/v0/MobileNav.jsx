import { Link, useLocation } from "react-router-dom"
import { Home, Grid2X2, Headphones, ShoppingCart, User } from "lucide-react"

const navItems = [
  { name: "首页", icon: Home, href: "/" },
  { name: "分类", icon: Grid2X2, href: "/category" },
  { name: "在线客服", icon: Headphones, href: "#" },
  { name: "购物车", icon: ShoppingCart, badge: 2, href: "/cart" },
  { name: "我的", icon: User, href: "/profile" },
]

export function MobileNav() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 md:hidden z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div
        className="flex items-center justify-around h-16 px-2"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              to={item.href}
              className="relative flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200"
            >
              <div className={`relative flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-200 ${isActive ? "bg-primary/10" : ""}`}>
                <item.icon
                  className={`w-5 h-5 transition-all ${isActive ? "text-primary" : "text-gray-400"}`}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center px-1 text-[10px] font-bold rounded-full bg-primary text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] transition-all ${isActive ? "text-primary font-semibold" : "text-gray-400 font-medium"}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
