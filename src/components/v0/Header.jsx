import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, ShoppingBag, User, Menu, X, Heart, ChevronDown, Flame } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

const navLinks = [
  { name: "全部分类", href: "/category" },
  { name: "新品首发", href: "#" },
  { name: "限时特惠", href: "#" },
  { name: "品牌精选", href: "#" },
]

const hotSearches = ["春季新款", "运动鞋", "护肤套装", "蓝牙耳机", "限时秒杀"]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const cartCount = 2

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
          <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8">
            <div className="relative w-full group">
              <input
                type="search"
                placeholder="搜索商品、品牌、分类..."
                className="w-full h-10 lg:h-11 pl-11 pr-24 rounded-full border-2 border-border bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:outline-none transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 lg:h-8 px-4 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                搜索
              </button>
            </div>
          </div>

          {/* 桌面端导航 */}
          <nav className="hidden xl:flex items-center gap-5 flex-shrink-0">
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
            <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full h-9 w-9 hover:bg-secondary">
              <Heart className="h-[18px] w-[18px]" />
            </Button>
            <Button variant="ghost" size="icon" className="relative rounded-full h-9 w-9 hover:bg-secondary">
              <ShoppingBag className="h-[18px] w-[18px]" />
              {cartCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center p-0 text-[10px] font-semibold rounded-full">
                  {cartCount}
                </Badge>
              )}
            </Button>
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

        {/* 热门搜索 - 桌面端 */}
        <div className="hidden md:flex items-center gap-2 pb-3 -mt-1">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Flame className="w-3 h-3 text-primary" />
            热搜
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {hotSearches.map((term, index) => (
              <button
                key={term}
                className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                  index === 0
                    ? "bg-primary/10 text-primary font-medium hover:bg-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {term}
              </button>
            ))}
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
          <div className="relative mb-4">
            <input
              type="search"
              placeholder="搜索商品、品牌、分类..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Flame className="w-3 h-3 text-primary" />
              热搜
            </span>
            {hotSearches.slice(0, 4).map((term, index) => (
              <button
                key={term}
                className={`text-xs px-2 py-1 rounded-full transition-colors ${
                  index === 0
                    ? "bg-primary/10 text-primary font-medium"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {term}
              </button>
            ))}
          </div>
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
              <Link to="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsMenuOpen(false)}>
                <Heart className="h-4 w-4" />
                <span>我的收藏</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
