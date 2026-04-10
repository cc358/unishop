import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Grid3X3,
  LayoutList,
  Heart,
  ShoppingCart,
  X,
  ChevronRight
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { getProducts, getCategories } from "../api/product"
import { searchProducts as ebaySearch } from "../api/ebay"

const sortOptions = [
  { id: "recommend", name: "综合推荐" },
  { id: "price-asc", name: "价格↑" },
  { id: "price-desc", name: "价格↓" },
  { id: "newest", name: "最新" },
]

export default function Category() {
  const [searchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') || ''
  const urlSeller = searchParams.get('seller') || ''
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [sortBy, setSortBy] = useState("recommend")
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [viewMode, setViewMode] = useState("grid")
  const [searchQuery, setSearchQuery] = useState(urlQuery)
  const [searchInput, setSearchInput] = useState(urlQuery)
  const [favorites, setFavorites] = useState([])
  const [showMobileCategories, setShowMobileCategories] = useState(false)
  const [dbProducts, setDbProducts] = useState([])
  const [dbCategories, setDbCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const PAGE_SIZE = 20

  // Sync URL query
  useEffect(() => {
    if (urlQuery) {
      setSearchQuery(urlQuery)
      setSearchInput(urlQuery)
      setCurrentPage(1)
    }
  }, [urlQuery])

  // Fetch categories with counts
  useEffect(() => {
    getCategories().then(data => {
      setDbCategories(data)
    }).catch(() => {})
  }, [])

  // Fetch products: eBay real-time search when query, local DB for category browse
  useEffect(() => {
    setLoading(true)

    if (searchQuery) {
      // 有搜索词 → 调 eBay 实时搜索
      ebaySearch(searchQuery, 40)
        .then(data => {
          setDbProducts(data.products || [])
          setTotalCount(data.total || 0)
          setTotalPages(data.totalPages || 1)
        })
        .catch(() => { setDbProducts([]); setTotalCount(0); setTotalPages(1) })
        .finally(() => setLoading(false))
    } else {
      // 无搜索词 → 查本地数据库
      const params = { limit: PAGE_SIZE, page: currentPage }
      if (urlSeller) {
        params.seller = urlSeller
      } else if (selectedSubCategory) {
        const allChildren = dbCategories.flatMap(c => c.children || [])
        const sub = allChildren.find(ch => ch.id === selectedSubCategory) || allChildren.find(ch => ch.name === selectedSubCategory)
        if (sub) params.category = sub.name
        else params.category = selectedSubCategory
      } else if (selectedCategory !== 'all') {
        const cat = dbCategories.find(c => c.id === selectedCategory) || dbCategories.find(c => c.name === selectedCategory)
        if (cat) params.category = cat.name
        else params.category = selectedCategory
      }
      if (sortBy !== 'recommend') params.sortBy = sortBy

      getProducts(params).then(data => {
        setDbProducts(data.products || [])
        setTotalCount(data.total || 0)
        setTotalPages(data.totalPages || 1)
      }).catch(() => { setDbProducts([]); setTotalCount(0); setTotalPages(1) })
        .finally(() => setLoading(false))
    }
  }, [selectedCategory, selectedSubCategory, searchQuery, dbCategories, currentPage, sortBy, urlSeller])

  // Reset page when filters change
  const resetAndSelect = (catId, subId = null) => {
    setSelectedCategory(catId)
    setSelectedSubCategory(subId)
    setCurrentPage(1)
    setSearchQuery('')
    setSearchInput('')
  }

  const goToPage = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalProductCount = dbCategories.reduce((sum, c) => sum + (c.productCount || 0), 0)



  // 硬编码分类结构和顺序
  const categoryStructure = [
    { name: "全部商品", children: [] },
    { name: "饮品酒水", children: ["矿泉水","果汁","碳酸饮料","乳饮","茶类","啤酒","白酒","鸡尾酒","葡萄酒"] },
    { name: "男士服装", children: ["领带","领结","男士T恤","男士衬衫","男士帽子","男士内衣和袜子","男士皮带","男士皮夹克","男士上衣","男士睡衣","男士外套","男士西装","男士下装","男士鞋子","男士正装","运动套装","风衣夹克","帽子手套围巾","男士保暖内衣","男士毛衣针织衫","外套羽绒服"] },
    { name: "女士服装", children: ["女款衬衫","女士短裤","女士帽子","女士牛仔裤","女士裙子","女士上衣","女士睡衣","女士外套","女士西装","女士鞋子","女士腰带及皮带","女士长裤","袜子","眼镜和太阳镜","内衣内裤","手套","风衣夹克","帽子手套围巾","女士保暖内衣","女士毛衣针织衫","外套羽绒服"] },
    { name: "零食甜点", children: ["坚果","甜点","蛋糕","果冻","面筋","肉干"] },
    { name: "手机配件", children: ["充电器充电线","拍照配件","屏幕保护膜","手机","手机壳和保护套","手机维修工具","手机移动电源","手机支架"] },
    { name: "办公文具", children: ["办公室配件","办公小电器","办公装订用品","办公桌收纳","胶带粘合剂","美术用品","日历卡片","书写和修正用品","文具贴纸","邮件运输用品","纸和笔记本"] },
    { name: "电脑配件", children: ["笔记本电脑","打印机和扫描仪","电脑组装配件","键盘和鼠标","联网设备","平板电脑","台式机","投影仪及配件","显示器"] },
    { name: "数码产品", children: ["耳机和头戴式耳机","麦克风","扬声器","相机","相机配件","智能手表和配件","智能追踪器","家庭影院系统","电视盒","电视和配件","视频游戏设备"] },
    { name: "户外运动", children: ["冬季运动","高尔夫球","户外服装和鞋子","户外休闲","健身和健美","旅行用品","手电筒","水上运动","野营装备","远足和攀岩","运动防护装备","运动男装","运动女装","自行车配件"] },
    { name: "居家橱柜", children: ["厨房电器","家具橱柜","风扇和空调设备","家电配件","净水设备","空气净化器","清洁设备","洗衣干衣电器"] },
    { name: "美妆美肤", children: ["除臭剂和止汗剂","化妆工具","化妆品","口红","美甲用品","美容仪器","皮肤护理","剃须刀和脱毛","头发护理和造型","牙齿和口腔护理","眼睛和睫毛"] },
    { name: "母婴用品", children: ["婴儿服装","奶粉","尿不湿","婴儿推车","婴儿玩具"] },
    { name: "珠宝手表", children: ["女士手表","男士手表","珠宝首饰","项链和吊坠","女士手链","耳环","戒指","脚链","首饰套装"] },
    { name: "儿童玩具", children: ["布绒玩具","金属玩具","木质玩具","启蒙玩具","塑料玩具"] },
    { name: "奢侈品", children: ["包包","服装","手表","艺术品","珠宝"] },
    { name: "童装", children: ["儿童包包","男童服装","男童裤子","男童内衣和袜子","男童上衣和T恤","男童睡衣","男童外套","男童鞋","女童服饰","女童裤子","女童内衣和袜子","女童裙子","女童上衣和T恤","女童睡衣","女童套装","女童外套","女童鞋","女童配饰","男童配饰","装扮道具"] },
    { name: "男士包包", children: ["男士背包","男士单肩包","男士公文包","男士钱包","行李箱"] },
    { name: "女士包包", children: ["女士背包","女士单肩包","女士钱包","女士斜挎手提包","行李箱"] },
  ]

  // 将硬编码结构与数据库 ID/数量关联
  const dbCatMap = {}
  for (const c of dbCategories) {
    dbCatMap[c.name] = c
    for (const ch of (c.children || [])) {
      dbCatMap[ch.name] = ch
    }
  }

  const displayCategories = categoryStructure.map(cat => {
    const dbCat = dbCatMap[cat.name]
    return {
      key: cat.name === '全部商品' ? 'all' : (dbCat?.id || cat.name),
      name: cat.name,
      count: cat.name === '全部商品' ? totalProductCount : (dbCat?.productCount || 0),
      children: cat.children.map(childName => {
        const dbChild = dbCatMap[childName]
        return { key: dbChild?.id || childName, name: childName, count: dbChild?.productCount || 0 }
      }),
    }
  })

  const currentCategory = displayCategories.find(c => c.key === selectedCategory)

  const toggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    )
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQuery(searchInput)
    setCurrentPage(1)
  }

  const isEbay = (product) => product.source === 'ebay'
  const priceSymbol = (product) => product.currency === 'USD' || isEbay(product) ? '$' : '¥'

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 lg:pb-0">

      <div className="container mx-auto px-4 py-4 lg:py-6">

        <div className="flex gap-6">
          {/* 左侧分类导航 - 桌面端 */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-foreground">商品分类</h2>
              </div>
              <nav className="py-2">
                {displayCategories.map((category) => {
                  const isExpanded = expandedCategory === category.key
                  const isSelected = selectedCategory === category.key && !selectedSubCategory
                  const hasChildren = category.children.length > 0
                  return (
                    <div key={category.key}>
                      <button onClick={() => {
                        resetAndSelect(category.key)
                        setExpandedCategory(isExpanded ? null : category.key)
                      }}
                        className={`relative w-full flex items-center justify-between pl-5 pr-4 py-2.5 text-sm transition-all ${isSelected ? "text-primary font-medium" : "text-gray-700 hover:text-foreground hover:bg-gray-50"}`}>
                        {isSelected && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />}
                        <span>{category.name}</span>
                        <span className="flex items-center gap-1.5">
                          {hasChildren && <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""} ${isSelected ? "text-primary" : "text-gray-400"}`} />}
                        </span>
                      </button>
                      {isExpanded && hasChildren && (
                        <div className="pl-7 pr-4 pb-2 space-y-0.5">
                          {category.children.map((sub) => (
                            <button key={sub.key} onClick={() => { resetAndSelect(category.key, sub.key) }}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between ${selectedSubCategory === sub.key ? "bg-primary/10 text-primary font-medium" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
                              <span>{sub.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* 移动端分类选择器 */}
          <div className="lg:hidden -mx-4 px-4 mb-4">
            <button onClick={() => setShowMobileCategories(true)} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm">
              <span className="font-medium">{currentCategory?.name}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* 商品区域 */}
          <main className="flex-1 min-w-0">
            {/* 排序栏 */}
            <div className="flex items-center justify-between gap-4 mb-4 lg:mb-6">
              <div className="flex items-center gap-2 lg:gap-3 overflow-x-auto no-scrollbar">
                {sortOptions.map((option) => (
                  <button key={option.id} onClick={() => { setSortBy(option.id); setCurrentPage(1) }}
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

            {/* 搜索/卖家筛选提示 */}
            {(searchQuery || urlSeller) && (
              <div className="flex items-center gap-2 mb-4">
                {searchQuery && <span className="text-sm text-gray-400">搜索: "{searchQuery}"</span>}
                {urlSeller && <span className="text-sm text-gray-400">店铺: {urlSeller}</span>}
                <span className="text-sm text-gray-400">({dbProducts.length} 个结果)</span>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* 商品网格 */}
            {!loading && (
              <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
                {dbProducts.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`} className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${viewMode === "list" ? "flex" : ""}`}>
                    <div className={`relative bg-gray-50 ${viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "aspect-square"}`}>
                      <img src={product.image || '/placeholder.jpg'} alt={product.name} onError={(e) => { e.target.src = '/placeholder.jpg' }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {product.condition && (
                        <div className="absolute top-3 left-0 flex items-center">
                          <span className="w-1 h-5 bg-primary rounded-r-full" />
                          <span className="ml-1.5 px-2 py-0.5 bg-primary text-white text-xs font-medium rounded-r-full">{product.condition.split(' - ')[0]}</span>
                        </div>
                      )}
                      <button onClick={(e) => { e.preventDefault(); toggleFavorite(product.id) }}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${favorites.includes(product.id) ? "bg-rose-50 opacity-100" : "bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100"}`}>
                        <Heart className={`w-4 h-4 transition-colors ${favorites.includes(product.id) ? "fill-rose-500 text-rose-500" : "text-gray-400"}`} />
                      </button>
                    </div>
                    <div className={`p-4 ${viewMode === "list" ? "flex-1 flex flex-col justify-center" : ""}`}>
                      <h3 className="font-medium text-sm lg:text-base text-gray-800 line-clamp-2 mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                      {viewMode === "list" && product.condition && (
                        <span className="text-xs text-gray-400 mb-2 block">{product.condition}</span>
                      )}
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg lg:text-xl font-bold text-primary">{priceSymbol(product)}{product.price}</span>
                        <span className="text-xs text-muted-foreground">{product.currency || 'USD'}</span>
                        {product.sales > 0 && viewMode === "grid" && (
                          <span className="ml-auto text-xs text-gray-400">{product.sales}已售</span>
                        )}
                      </div>
                      {viewMode === "list" && (
                        <div className="flex items-center gap-2 mt-3">
                          <Button size="sm" className="flex-1 rounded-full shadow-md shadow-primary/20">
                            <ShoppingCart className="w-4 h-4 mr-1" />加入购物车
                          </Button>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* 空状态 */}
            {!loading && dbProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg mb-2">没有找到商品</p>
                <p className="text-gray-300 text-sm">试试换个关键词或分类</p>
              </div>
            )}

            {/* 分页 */}
            {!loading && totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center gap-3">
                <p className="text-sm text-gray-400">共 {totalCount} 件商品</p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white text-gray-600 shadow-sm hover:shadow-md hover:text-primary"
                  >
                    上一页
                  </button>
                  {(() => {
                    const pages = []
                    const show = 5
                    let start = Math.max(1, currentPage - Math.floor(show / 2))
                    let end = Math.min(totalPages, start + show - 1)
                    if (end - start < show - 1) start = Math.max(1, end - show + 1)

                    if (start > 1) {
                      pages.push(<button key={1} onClick={() => goToPage(1)} className="w-9 h-9 rounded-lg text-sm font-medium bg-white text-gray-600 shadow-sm hover:text-primary">1</button>)
                      if (start > 2) pages.push(<span key="s1" className="px-1 text-gray-400">...</span>)
                    }
                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <button key={i} onClick={() => goToPage(i)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${i === currentPage ? "bg-primary text-white shadow-md shadow-primary/25" : "bg-white text-gray-600 shadow-sm hover:text-primary hover:shadow-md"}`}>
                          {i}
                        </button>
                      )
                    }
                    if (end < totalPages) {
                      if (end < totalPages - 1) pages.push(<span key="s2" className="px-1 text-gray-400">...</span>)
                      pages.push(<button key={totalPages} onClick={() => goToPage(totalPages)} className="w-9 h-9 rounded-lg text-sm font-medium bg-white text-gray-600 shadow-sm hover:text-primary">{totalPages}</button>)
                    }
                    return pages
                  })()}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white text-gray-600 shadow-sm hover:shadow-md hover:text-primary"
                  >
                    下一页
                  </button>
                </div>
              </div>
            )}
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
              {displayCategories.map((category) => {
                const isExpanded = expandedCategory === category.key
                const hasChildren = category.children.length > 0
                return (
                  <div key={category.key}>
                    <button onClick={() => {
                      resetAndSelect(category.key)
                      setExpandedCategory(isExpanded ? null : category.key)
                      if (!hasChildren) setShowMobileCategories(false)
                    }}
                      className={`relative w-full flex items-center justify-between pl-4 pr-3 py-2.5 text-sm transition-all rounded-xl ${selectedCategory === category.key && !selectedSubCategory ? "text-primary font-medium bg-primary/5" : "text-gray-700 hover:bg-gray-50"}`}>
                      {selectedCategory === category.key && !selectedSubCategory && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />}
                      <span>{category.name}</span>
                      <span className="flex items-center gap-1.5">
                        {hasChildren && <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />}
                      </span>
                    </button>
                    {isExpanded && hasChildren && (
                      <div className="pl-6 pr-3 pb-1 space-y-0.5">
                        {category.children.map((sub) => (
                          <button key={sub.key} onClick={() => { resetAndSelect(category.key, sub.key); setShowMobileCategories(false) }}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all ${selectedSubCategory === sub.key ? "bg-primary/10 text-primary font-medium" : "text-gray-500 hover:bg-gray-50"}`}>
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
