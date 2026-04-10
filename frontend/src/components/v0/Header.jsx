import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, ShoppingBag, User, Menu, X, ChevronDown, Store } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { useCartStore } from "../../stores/useCartStore"

const navLinks = [
  { name: "全部商品", href: "/category" },
  { name: "商家入驻", href: "/merchant" },
]


export function Header() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/category?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsMenuOpen(false)
    }
  }
  const cartItems = useCartStore((s) => s.items)
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-lg shadow-sm"
          : "bg-card"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="relative w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-bold text-lg lg:text-xl">U</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-base lg:text-lg font-bold text-foreground tracking-tight">UniShop</span>
              <span className="text-[9px] text-muted-foreground tracking-widest uppercase">Global Selection</span>
            </div>
          </Link>

          {/* 中间搜索栏 - 桌面端常驻展开 */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8">
            <div className="relative w-full group">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索 UniShop 全球商品..."
                className="w-full h-10 lg:h-11 pl-11 pr-24 rounded-full border-2 border-border bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:outline-none transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 lg:h-8 px-4 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                搜索
              </button>
            </div>
          </form>

          {/* 桌面端导航 */}
          <nav className="hidden lg:flex items-center gap-5 flex-shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group whitespace-nowrap"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
            <Button variant="ghost" size="icon" className="md:hidden rounded-full h-9 w-9 hover:bg-secondary">
              <Search className="h-[18px] w-[18px]" />
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative rounded-full h-9 w-9 hover:bg-secondary">
                <ShoppingBag className="h-[18px] w-[18px]" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center p-0 text-[10px] font-semibold rounded-full">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full h-9 w-9 hover:bg-secondary">
                <User className="h-[18px] w-[18px]" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full h-9 w-9 hover:bg-secondary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
            </Button>
          </div>
        </div>

      </div>

      {/* 移动端菜单 */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 border-t border-border ${
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索 UniShop 全球商品..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </form>
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-sm font-medium">{link.name}</span>
                <ChevronDown className="w-4 h-4 -rotate-90 text-muted-foreground" />
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-border mt-3">
            <div className="flex gap-4 px-3">
              <Link to="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsMenuOpen(false)}>
                <User className="h-4 w-4" />
                <span>我的账户</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
