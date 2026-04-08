import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Grid3X3,
  LayoutList,
  Heart,
  ShoppingCart,
  Star,
  ArrowLeft,
  X,
  ChevronRight
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { MobileNav } from "../components/v0/MobileNav"

const categories = [
  { id: "all", name: "全部商品", count: 12680, subcategories: [] },
  { id: "women-fashion", name: "女士服装", count: 1568, subcategories: ["连衣裙", "T恤", "衬衫", "裤子", "外套", "毛衣"] },
  { id: "men-fashion", name: "男士服装", count: 1423, subcategories: ["T恤", "衬衫", "裤子", "外套", "夹克", "西装"] },
  { id: "kids-fashion", name: "童装", count: 856, subcategories: ["男童", "女童", "婴儿服", "亲子装"] },
  { id: "women-bags", name: "女士包包", count: 723, subcategories: ["手提包", "单肩包", "斜挎包", "双肩包", "钱包"] },
  { id: "men-bags", name: "男士包包", count: 456, subcategories: ["公文包", "双肩包", "斜挎包", "钱包", "腰包"] },
  { id: "beauty", name: "美妆美肤", count: 1356, subcategories: ["护肤", "彩妆", "香水", "美发", "美甲", "面膜"] },
  { id: "digital", name: "数码产品", count: 923, subcategories: ["手机", "平板", "相机", "智能穿戴", "游戏机"] },
  { id: "computer", name: "电脑配件", count: 678, subcategories: ["键盘", "鼠标", "显示器", "硬盘", "内存", "显卡"] },
  { id: "phone-accessories", name: "手机配件", count: 534, subcategories: ["手机壳", "充电器", "数据线", "耳机", "支架"] },
  { id: "drinks", name: "饮品酒水", count: 445, subcategories: ["白酒", "红酒", "啤酒", "饮料", "茶叶", "咖啡"] },
  { id: "snacks", name: "零食甜点", count: 612, subcategories: ["糖果", "饼干", "坚果", "蛋糕", "巧克力", "膨化食品"] },
  { id: "home", name: "居家橱柜", count: 789, subcategories: ["家具", "灯具", "厨具", "床品", "收纳", "装饰"] },
  { id: "sports", name: "户外运动", count: 567, subcategories: ["运动鞋", "运动服", "健身器材", "户外装备", "球类"] },
]

const products = [
  { id: 1, name: "经典款运动休闲鞋", price: 299, originalPrice: 459, image: "/images/product-1.jpg", sales: 2341, rating: 4.9, tag: "hot" },
  { id: 2, name: "无线降噪蓝牙耳机", price: 599, originalPrice: 899, image: "/images/product-2.jpg", sales: 1823, rating: 4.8, tag: "new" },
  { id: 3, name: "轻奢真皮手提包", price: 1299, originalPrice: 1899, image: "/images/product-3.jpg", sales: 892, rating: 4.9, tag: "" },
  { id: 4, name: "智能运动手表", price: 899, originalPrice: 1299, image: "/images/product-4.jpg", sales: 1567, rating: 4.7, tag: "sale" },
  { id: 5, name: "纯棉舒适T恤", price: 89, originalPrice: 159, image: "/images/product-5.jpg", sales: 5678, rating: 4.6, tag: "" },
  { id: 6, name: "高端护肤套装", price: 699, originalPrice: 999, image: "/images/product-6.jpg", sales: 1234, rating: 4.9, tag: "hot" },
  { id: 7, name: "北欧简约台灯", price: 199, originalPrice: 299, image: "/images/product-7.jpg", sales: 789, rating: 4.5, tag: "" },
  { id: 8, name: "日式陶瓷杯具套装", price: 159, originalPrice: 239, image: "/images/product-8.jpg", sales: 2156, rating: 4.8, tag: "new" },
]

const sortOptions = [
  { id: "recommend", name: "综合推荐" },
  { id: "price", name: "价格" },
  { id: "newest", name: "上新" },
  { id: "sales", name: "热销" },
  { id: "sale", name: "限时特惠" },
]

const filterOptions = {
  brand: ["Nike", "Adidas", "Apple", "小米", "华为", "其他"],
}

const tagConfig = {
  hot: { color: "bg-rose-500", text: "热卖" },
  new: { color: "bg-emerald-500", text: "新品" },
  sale: { color: "bg-amber-500", text: "限时" },
}

export default function Category() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [sortBy, setSortBy] = useState("recommend")
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [viewMode, setViewMode] = useState("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState([])
  const [showMobileCategories, setShowMobileCategories] = useState(false)

  const currentCategory = categories.find(c => c.id === selectedCategory)

  const toggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 lg:pb-0">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 h-14 lg:h-16">
            <Link to="/" className="lg:hidden">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-primary/10 text-gray-600 hover:text-primary transition-all">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">返回首页</span>
              </Link>
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">U</span>
                </div>
                <span className="font-bold text-lg text-foreground">UniShop</span>
              </Link>
            </div>
            <h1 className="lg:hidden font-semibold text-foreground">商品分类</h1>
            <div className="flex-1 max-w-xl ml-auto lg:ml-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="text" placeholder="搜索商品..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 h-10 bg-gray-50 border-0 rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setShowFilterPanel(true)}>
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 lg:py-6">
        <div className="flex gap-6">
          {/* 左侧分类导航 - 桌面端 */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-foreground">商品分类</h2>
              </div>
              <nav className="py-2">
                {categories.map((category) => (
                  <div key={category.id}>
                    <button onClick={() => { setSelectedCategory(category.id); setSelectedSubcategory(null) }}
                      className={`relative w-full flex items-center justify-between pl-5 pr-4 py-3 text-sm transition-all ${selectedCategory === category.id ? "text-primary font-medium" : "text-gray-700 hover:text-foreground hover:bg-gray-50"}`}>
                      {selectedCategory === category.id && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />}
                      <span>{category.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category.id ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400"}`}>{category.count}</span>
                    </button>
                    {selectedCategory === category.id && category.subcategories.length > 0 && (
                      <div className="pl-6 pr-4 pb-2 space-y-1">
                        {category.subcategories.map((sub) => (
                          <button key={sub} onClick={() => setSelectedSubcategory(sub)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2 ${selectedSubcategory === sub ? "bg-primary/10 text-primary font-medium" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
                            <ChevronRight className={`w-3 h-3 transition-transform ${selectedSubcategory === sub ? "text-primary" : "text-gray-300"}`} />
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* 移动端分类选择器 */}
          <div className="lg:hidden mb-4 -mx-4 px-4">
            <button onClick={() => setShowMobileCategories(true)} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm">
              <span className="font-medium">{currentCategory?.name}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* 商品区域 */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 mb-4 lg:mb-6">
              <div className="flex items-center gap-2 lg:gap-3 overflow-x-auto no-scrollbar">
                {sortOptions.map((option) => (
                  <button key={option.id} onClick={() => setSortBy(option.id)}
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${sortBy === option.id ? "bg-primary text-white shadow-md shadow-primary/25" : "bg-white text-gray-600 shadow-sm hover:shadow-md hover:text-primary"}`}>
                    {option.name}
                  </button>
                ))}
              </div>
              <div className="hidden lg:flex items-center gap-1 bg-white rounded-full p-1 shadow-sm">
                <button onClick={() => setViewMode("grid")} className={`p-2 rounded-full transition-all ${viewMode === "grid" ? "bg-primary text-white shadow-md" : "text-gray-400 hover:text-gray-600"}`}>
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-2 rounded-full transition-all ${viewMode === "list" ? "bg-primary text-white shadow-md" : "text-gray-400 hover:text-gray-600"}`}>
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>

            {selectedSubcategory && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-sm text-gray-400">已选：</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-primary rounded-full text-sm shadow-sm">
                  {selectedSubcategory}
                  <button onClick={() => setSelectedSubcategory(null)} className="hover:bg-primary/10 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                </span>
                <button onClick={() => setSelectedSubcategory(null)} className="text-sm text-gray-400 hover:text-primary transition-colors">清除</button>
              </div>
            )}

            <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
              {products.map((product) => (
                <div key={product.id} className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${viewMode === "list" ? "flex" : ""}`}>
                  <div className={`relative bg-gray-50 ${viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "aspect-square"}`}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {product.tag && tagConfig[product.tag] && (
                      <div className="absolute top-3 left-0 flex items-center">
                        <span className={`w-1 h-5 ${tagConfig[product.tag].color} rounded-r-full`} />
                        <span className={`ml-1.5 px-2 py-0.5 ${tagConfig[product.tag].color} text-white text-xs font-medium rounded-r-full`}>{tagConfig[product.tag].text}</span>
                      </div>
                    )}
                    <button onClick={() => toggleFavorite(product.id)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${favorites.includes(product.id) ? "bg-rose-50 opacity-100" : "bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100"}`}>
                      <Heart className={`w-4 h-4 transition-colors ${favorites.includes(product.id) ? "fill-rose-500 text-rose-500" : "text-gray-400"}`} />
                    </button>
                  </div>
                  <div className={`p-4 ${viewMode === "list" ? "flex-1 flex flex-col justify-center" : ""}`}>
                    <h3 className="font-medium text-sm lg:text-base text-gray-800 line-clamp-2 mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                    {viewMode === "list" && (
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /><span className="text-sm text-gray-700">{product.rating}</span></div>
                        <span className="text-xs text-gray-400">已售 {product.sales}</span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg lg:text-xl font-bold text-primary">¥{product.price}</span>
                      <span className="text-xs text-gray-300 line-through">¥{product.originalPrice}</span>
                      {viewMode === "grid" && <span className="ml-auto text-xs text-gray-400">{product.sales}人付款</span>}
                    </div>
                    {viewMode === "list" && (
                      <div className="flex items-center gap-2 mt-4">
                        <Button size="sm" className="flex-1 rounded-full shadow-md shadow-primary/20"><ShoppingCart className="w-4 h-4 mr-1" />加入购物车</Button>
                        <Button size="sm" variant="outline" className="rounded-full">立即购买</Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline" className="px-8 rounded-full shadow-sm hover:shadow-md transition-shadow">加载更多商品</Button>
            </div>
          </main>
        </div>
      </div>

      {/* 移动端分类侧边栏 */}
      {showMobileCategories && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setShowMobileCategories(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="font-semibold">选择分类</h2>
              <button onClick={() => setShowMobileCategories(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <nav className="p-2 h-full overflow-y-auto pb-20">
              {categories.map((category) => (
                <div key={category.id}>
                  <button onClick={() => { setSelectedCategory(category.id); setSelectedSubcategory(null) }}
                    className={`relative w-full flex items-center justify-between pl-4 pr-3 py-3 text-sm transition-all rounded-xl ${selectedCategory === category.id ? "text-primary font-medium bg-primary/5" : "text-gray-700 hover:bg-gray-50"}`}>
                    {selectedCategory === category.id && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />}
                    <span>{category.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category.id ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400"}`}>{category.count}</span>
                  </button>
                  {selectedCategory === category.id && category.subcategories.length > 0 && (
                    <div className="pl-5 pr-3 pb-2 space-y-1">
                      {category.subcategories.map((sub) => (
                        <button key={sub} onClick={() => { setSelectedSubcategory(sub); setShowMobileCategories(false) }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2 ${selectedSubcategory === sub ? "bg-primary/10 text-primary font-medium" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
                          <ChevronRight className={`w-3 h-3 ${selectedSubcategory === sub ? "text-primary" : "text-gray-300"}`} />
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* 移动端筛选面板 */}
      {showFilterPanel && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setShowFilterPanel(false)} />
          <div className="fixed inset-y-0 right-0 w-80 bg-white z-50 lg:hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="font-semibold">筛选</h2>
              <button onClick={() => setShowFilterPanel(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div>
                <h3 className="font-medium text-sm text-gray-800 mb-3">品牌</h3>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.brand.map((brand) => (
                    <button key={brand} className="px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">{brand}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-3">
              <Button variant="outline" className="flex-1 rounded-full">重置</Button>
              <Button className="flex-1 rounded-full shadow-md shadow-primary/25" onClick={() => setShowFilterPanel(false)}>确定</Button>
            </div>
          </div>
        </>
      )}

      <MobileNav />
    </div>
  )
}
