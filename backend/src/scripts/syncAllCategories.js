require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const ebayService = require('../services/ebayService')

const prisma = new PrismaClient()

// ====== 所有子分类及关键词 ======
const allCategories = [
  { parent: "男士服装", name: "领带", keyword: "men necktie tie formal" },
  { parent: "男士服装", name: "领结", keyword: "men bow tie formal" },
  { parent: "男士服装", name: "男士T恤", keyword: "men t-shirt casual" },
  { parent: "男士服装", name: "男士衬衫", keyword: "men dress shirt formal" },
  { parent: "男士服装", name: "男士帽子", keyword: "men hat cap baseball" },
  { parent: "男士服装", name: "男士内衣和袜子", keyword: "men underwear socks" },
  { parent: "男士服装", name: "男士皮带", keyword: "men leather belt" },
  { parent: "男士服装", name: "男士皮夹克", keyword: "men leather jacket" },
  { parent: "男士服装", name: "男士上衣", keyword: "men top shirt casual" },
  { parent: "男士服装", name: "男士睡衣", keyword: "men pajamas sleepwear" },
  { parent: "男士服装", name: "男士外套", keyword: "men coat outerwear" },
  { parent: "男士服装", name: "男士西装", keyword: "men suit blazer formal" },
  { parent: "男士服装", name: "男士下装", keyword: "men pants trousers jeans" },
  { parent: "男士服装", name: "男士鞋子", keyword: "men shoes sneakers" },
  { parent: "男士服装", name: "男士正装", keyword: "men formal wear dress" },
  { parent: "男士服装", name: "运动套装", keyword: "men sports tracksuit" },
  { parent: "男士服装", name: "风衣夹克", keyword: "men windbreaker jacket" },
  { parent: "男士服装", name: "帽子手套围巾", keyword: "men winter hat gloves scarf" },
  { parent: "男士服装", name: "男士保暖内衣", keyword: "men thermal underwear" },
  { parent: "男士服装", name: "男士毛衣针织衫", keyword: "men sweater knitwear" },
  { parent: "男士服装", name: "外套羽绒服", keyword: "men down jacket winter coat" },
  { parent: "女士服装", name: "女款衬衫", keyword: "women blouse shirt" },
  { parent: "女士服装", name: "女士短裤", keyword: "women shorts" },
  { parent: "女士服装", name: "女士帽子", keyword: "women hat cap" },
  { parent: "女士服装", name: "女士牛仔裤", keyword: "women jeans denim" },
  { parent: "女士服装", name: "女士裙子", keyword: "women skirt dress" },
  { parent: "女士服装", name: "女士上衣", keyword: "women top blouse" },
  { parent: "女士服装", name: "女士睡衣", keyword: "women pajamas sleepwear" },
  { parent: "女士服装", name: "女士外套", keyword: "women coat jacket" },
  { parent: "女士服装", name: "女士西装", keyword: "women suit blazer" },
  { parent: "女士服装", name: "女士鞋子", keyword: "women shoes heels sneakers" },
  { parent: "女士服装", name: "女士腰带及皮带", keyword: "women belt leather" },
  { parent: "女士服装", name: "女士长裤", keyword: "women pants trousers" },
  { parent: "女士服装", name: "袜子", keyword: "women socks stockings" },
  { parent: "女士服装", name: "眼镜和太阳镜", keyword: "women sunglasses eyeglasses" },
  { parent: "女士服装", name: "内衣内裤", keyword: "women underwear lingerie" },
  { parent: "女士服装", name: "手套", keyword: "women gloves winter" },
  { parent: "女士服装", name: "女士保暖内衣", keyword: "women thermal underwear" },
  { parent: "女士服装", name: "女士毛衣针织衫", keyword: "women sweater knitwear" },
  { parent: "手机配件", name: "充电器充电线", keyword: "phone charger cable USB" },
  { parent: "手机配件", name: "拍照配件", keyword: "phone camera lens photography" },
  { parent: "手机配件", name: "屏幕保护膜", keyword: "phone screen protector tempered glass" },
  { parent: "手机配件", name: "手机", keyword: "smartphone iPhone Samsung" },
  { parent: "手机配件", name: "手机壳和保护套", keyword: "phone case cover" },
  { parent: "手机配件", name: "手机维修工具", keyword: "phone repair tools kit" },
  { parent: "手机配件", name: "手机移动电源", keyword: "power bank portable charger" },
  { parent: "手机配件", name: "手机支架", keyword: "phone holder stand mount" },
  { parent: "电脑配件", name: "笔记本电脑", keyword: "laptop notebook computer" },
  { parent: "电脑配件", name: "打印机和扫描仪", keyword: "printer scanner" },
  { parent: "电脑配件", name: "电脑组装配件", keyword: "PC parts GPU CPU motherboard" },
  { parent: "电脑配件", name: "键盘和鼠标", keyword: "keyboard mouse wireless" },
  { parent: "电脑配件", name: "联网设备", keyword: "router wifi network" },
  { parent: "电脑配件", name: "平板电脑", keyword: "tablet iPad Android" },
  { parent: "电脑配件", name: "台式机", keyword: "desktop computer PC" },
  { parent: "电脑配件", name: "投影仪及配件", keyword: "projector home theater" },
  { parent: "电脑配件", name: "显示器", keyword: "monitor display screen" },
  { parent: "数码产品", name: "耳机和头戴式耳机", keyword: "headphones earbuds wireless" },
  { parent: "数码产品", name: "麦克风", keyword: "microphone recording studio" },
  { parent: "数码产品", name: "扬声器", keyword: "speaker bluetooth portable" },
  { parent: "数码产品", name: "相机", keyword: "camera DSLR mirrorless" },
  { parent: "数码产品", name: "相机配件", keyword: "camera lens tripod accessories" },
  { parent: "数码产品", name: "智能手表和配件", keyword: "smartwatch fitness tracker" },
  { parent: "数码产品", name: "智能追踪器", keyword: "GPS tracker smart device" },
  { parent: "数码产品", name: "家庭影院系统", keyword: "home theater sound system" },
  { parent: "数码产品", name: "电视盒", keyword: "TV box streaming Android" },
  { parent: "数码产品", name: "电视和配件", keyword: "TV television smart 4K" },
  { parent: "数码产品", name: "视频游戏设备", keyword: "gaming console PlayStation Xbox" },
  { parent: "户外运动", name: "冬季运动", keyword: "winter sports skiing snowboard" },
  { parent: "户外运动", name: "高尔夫球", keyword: "golf club ball equipment" },
  { parent: "户外运动", name: "户外服装和鞋子", keyword: "outdoor clothing hiking boots" },
  { parent: "户外运动", name: "户外休闲", keyword: "outdoor leisure picnic" },
  { parent: "户外运动", name: "健身和健美", keyword: "fitness gym equipment weights" },
  { parent: "户外运动", name: "旅行用品", keyword: "travel accessories luggage" },
  { parent: "户外运动", name: "手电筒", keyword: "flashlight torch LED" },
  { parent: "户外运动", name: "水上运动", keyword: "water sports swimming diving" },
  { parent: "户外运动", name: "野营装备", keyword: "camping tent sleeping bag" },
  { parent: "户外运动", name: "远足和攀岩", keyword: "hiking climbing gear" },
  { parent: "户外运动", name: "运动防护装备", keyword: "sports protection gear" },
  { parent: "户外运动", name: "运动男装", keyword: "men sportswear athletic" },
  { parent: "户外运动", name: "运动女装", keyword: "women sportswear athletic" },
  { parent: "户外运动", name: "自行车配件", keyword: "bicycle bike accessories" },
  { parent: "居家橱柜", name: "厨房电器", keyword: "kitchen appliances cooking" },
  { parent: "居家橱柜", name: "家具橱柜", keyword: "furniture cabinet storage" },
  { parent: "居家橱柜", name: "风扇和空调设备", keyword: "fan air conditioner cooling" },
  { parent: "居家橱柜", name: "家电配件", keyword: "home appliance parts accessories" },
  { parent: "居家橱柜", name: "净水设备", keyword: "water filter purifier" },
  { parent: "居家橱柜", name: "空气净化器", keyword: "air purifier cleaner" },
  { parent: "居家橱柜", name: "清洁设备", keyword: "cleaning vacuum mop" },
  { parent: "居家橱柜", name: "洗衣干衣电器", keyword: "washing machine dryer laundry" },
  { parent: "美妆美肤", name: "除臭剂和止汗剂", keyword: "deodorant antiperspirant" },
  { parent: "美妆美肤", name: "化妆工具", keyword: "makeup brush beauty tools" },
  { parent: "美妆美肤", name: "化妆品", keyword: "makeup cosmetics foundation" },
  { parent: "美妆美肤", name: "口红", keyword: "lipstick lip gloss" },
  { parent: "美妆美肤", name: "美甲用品", keyword: "nail polish gel nail art" },
  { parent: "美妆美肤", name: "美容仪器", keyword: "beauty device facial" },
  { parent: "美妆美肤", name: "皮肤护理", keyword: "skincare moisturizer serum" },
  { parent: "美妆美肤", name: "剃须刀和脱毛", keyword: "razor shaver hair removal" },
  { parent: "美妆美肤", name: "头发护理和造型", keyword: "hair care styling products" },
  { parent: "美妆美肤", name: "牙齿和口腔护理", keyword: "toothbrush dental oral care" },
  { parent: "美妆美肤", name: "眼睛和睫毛", keyword: "mascara eyeliner eyeshadow" },
  { parent: "母婴用品", name: "婴儿服装", keyword: "baby clothes infant" },
  { parent: "母婴用品", name: "奶粉", keyword: "baby formula milk powder" },
  { parent: "母婴用品", name: "尿不湿", keyword: "diapers nappies baby" },
  { parent: "母婴用品", name: "婴儿推车", keyword: "stroller pram baby carriage" },
  { parent: "母婴用品", name: "婴儿玩具", keyword: "baby toys infant educational" },
  { parent: "珠宝手表", name: "女士手表", keyword: "women watch fashion" },
  { parent: "珠宝手表", name: "男士手表", keyword: "men watch luxury" },
  { parent: "珠宝手表", name: "珠宝首饰", keyword: "jewelry gold silver" },
  { parent: "珠宝手表", name: "项链和吊坠", keyword: "necklace pendant chain" },
  { parent: "珠宝手表", name: "女士手链", keyword: "women bracelet bangle" },
  { parent: "珠宝手表", name: "耳环", keyword: "earrings stud hoop" },
  { parent: "珠宝手表", name: "戒指", keyword: "ring gold silver diamond" },
  { parent: "珠宝手表", name: "脚链", keyword: "anklet foot bracelet" },
  { parent: "珠宝手表", name: "首饰套装", keyword: "jewelry set necklace earring" },
  { parent: "儿童玩具", name: "布绒玩具", keyword: "stuffed animal plush toy" },
  { parent: "儿童玩具", name: "金属玩具", keyword: "metal toy die cast model" },
  { parent: "儿童玩具", name: "木质玩具", keyword: "wooden toy educational" },
  { parent: "儿童玩具", name: "启蒙玩具", keyword: "educational toy learning kids" },
  { parent: "儿童玩具", name: "塑料玩具", keyword: "plastic toy action figure" },
  { parent: "奢侈品", name: "包包", keyword: "luxury handbag designer bag" },
  { parent: "奢侈品", name: "手表", keyword: "luxury watch Rolex Omega" },
  { parent: "奢侈品", name: "珠宝", keyword: "luxury jewelry diamond gold" },
  { parent: "男士包包", name: "男士背包", keyword: "men backpack rucksack" },
  { parent: "男士包包", name: "男士单肩包", keyword: "men shoulder bag messenger" },
  { parent: "男士包包", name: "男士公文包", keyword: "men briefcase laptop bag" },
  { parent: "男士包包", name: "男士钱包", keyword: "men wallet leather" },
  { parent: "女士包包", name: "女士背包", keyword: "women backpack fashion" },
  { parent: "女士包包", name: "女士单肩包", keyword: "women shoulder bag tote" },
  { parent: "女士包包", name: "女士钱包", keyword: "women wallet purse" },
  { parent: "女士包包", name: "女士斜挎手提包", keyword: "women crossbody handbag" },
  { parent: "女士包包", name: "行李箱", keyword: "luggage suitcase travel bag" },
]

// ====== 分类评论模板 ======
const reviewsByParent = {
  "男士服装": ["面料舒适，版型正，穿着很有型","做工精细，颜色正，尺码标准","质量不错，洗后不变形不褪色","款式大方，适合通勤穿搭","弹性好，活动自如，穿着舒适","性价比高，比实体店便宜很多"],
  "女士服装": ["面料很舒服，上身效果比预期好","颜色好看，版型修身，很显气质","做工精致，走线整齐，质感很好","款式百搭，日常穿搭都很合适","穿着舒适，透气性好，春秋穿很合适","弹性好，不挑身材，推荐入手"],
  "手机配件": ["兼容性好，充电速度快，很实用","做工精细，手感好，完美贴合手机","质量不错，用了半个月没有问题","保护效果好，防摔防刮，很放心","安装简单，效果明显，推荐购买","性价比很高，比官方配件便宜很多"],
  "电脑配件": ["运行速度快，散热好，性能稳定","做工扎实，手感舒适，打字很顺畅","画面清晰，色彩还原度高","安装简单，兼容性好，即插即用","性能提升明显，升级很值","静音效果好，办公学习都很适合"],
  "数码产品": ["音质很好，降噪效果明显","画质清晰，操作简单，上手很快","做工精致，颜值在线，功能强大","续航持久，日常使用两三天没问题","连接稳定，延迟很低，体验很好","性价比很高，功能齐全，值得推荐"],
  "户外运动": ["质量过硬，做工精细，户外使用很放心","轻便透气，穿着舒适，运动必备","防水效果好，下雨天也能放心用","弹性好，缓震效果明显，保护膝盖","材质结实，耐磨耐用，值这个价","颜值很高，功能实用，推荐入手"],
  "居家橱柜": ["做工扎实，用料厚实，物超所值","安装简单，说明书详细，自己就能搞定","外观大方，放在家里很有格调","功能齐全，操作简单，家人都很满意","质量很好，用了两个月没问题","静音效果好，不影响休息"],
  "美妆美肤": ["质地轻薄，上脸服帖，不闷痘","效果明显，用了一周皮肤有改善","温和不刺激，敏感肌也能用","持久度好，一整天不脱妆","味道清淡好闻，成分安心","用量省，性价比很高，会回购"],
  "母婴用品": ["材质安全柔软，宝宝穿着很舒服","做工精细，无线头无异味，放心给宝宝用","宝宝很喜欢，每天都要玩","质量好，反复洗不变形不褪色","推车轻便好推，折叠方便","大品牌，品质有保障，买得放心"],
  "珠宝手表": ["做工精致，光泽度好，戴着很有气质","款式好看，日常佩戴很百搭","走时精准，表带舒适，佩戴感好","成色很好，和图片一致，没有色差","包装精美，送礼很体面","性价比高，比专柜便宜不少"],
  "儿童玩具": ["做工精细，没有毛刺，安全放心","孩子很喜欢，玩了很久都不腻","材质安全，无异味，颜色鲜艳","益智又好玩，开发宝宝动手能力","做工结实，不容易坏，耐玩","包装完好，送给孩子当礼物很合适"],
  "奢侈品": ["做工精湛，用料考究，质感一流","经典款式，永不过时，值得收藏","细节处理完美，彰显品位","正品品质，包装精美，非常满意","佩戴舒适，光泽度好，很有档次","投资收藏两相宜，非常推荐"],
  "男士包包": ["容量大，分层合理，很能装","做工精细，皮质柔软，手感很好","款式简约大方，通勤出差都适合","质量不错，用了一个月没有任何问题","拉链顺滑，缝线整齐，细节到位","性价比高，日常使用很方便"],
  "女士包包": ["颜色漂亮，款式时尚，上身好看","容量不错，日常出门够用了","做工精细，五金件质感好","背着很舒适，肩带不勒","送给女朋友她很喜欢","质感很好，比预期还漂亮"],
}
const defaultReviews = ["收到货物完好，质量符合预期，很满意","卖家发货快，包装仔细，商品和描述一致","性价比很高，下次还会购买","做工不错，用料扎实，值这个价","物流很快，两天就收到了，好评","朋友推荐的，果然没有让我失望"]

const userNames = ["小***米","大***王","天***蓝","快***乐","阳***光","星***辰","海***风","云***淡","花***开","月***明","j***n","m***k","s***h","a***z","l***t","r***d","c***e","b***y"]

function generateReviews(parentName) {
  const templates = reviewsByParent[parentName] || defaultReviews
  const count = Math.floor(Math.random() * 3) + 3
  const shuffled = [...templates, ...defaultReviews].sort(() => Math.random() - 0.5)
  const used = new Set()
  const picked = []
  for (const t of shuffled) {
    if (!used.has(t) && picked.length < count) { used.add(t); picked.push(t) }
  }
  return picked.map(text => ({
    username: userNames[Math.floor(Math.random() * userNames.length)],
    rating: Math.random() > 0.25 ? 5 : 4,
    text,
    date: new Date(Date.now() - (Math.floor(Math.random() * 90) + 1) * 86400000).toISOString().split('T')[0],
    verified: Math.random() > 0.2,
  }))
}

function isClean(title) {
  return !/18\+|adult|xxx|nude|erotic|sexy|tobacco|cigarette|vape|nicotine|marijuana|cannabis|cbd|thc/i.test(title)
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// 缓存父分类 ID
const parentCache = {}
async function getParentId(name) {
  if (parentCache[name]) return parentCache[name]
  const cat = await prisma.category.findFirst({ where: { name, parentId: null } })
  if (cat) parentCache[name] = cat.id
  return cat?.id
}

async function ensureChild(parentName, childName) {
  const parentId = await getParentId(parentName)
  if (!parentId) { console.error(`  父分类 "${parentName}" 不存在`); return null }
  let child = await prisma.category.findFirst({ where: { name: childName, parentId } })
  if (!child) {
    child = await prisma.category.create({ data: { name: childName, parentId } })
  }
  return child.id
}

async function syncOne(cat) {
  const categoryId = await ensureChild(cat.parent, cat.name)
  if (!categoryId) return { fetched: 0, inserted: 0 }

  let allItems = []
  for (let offset = 0; allItems.length < 50; offset += 50) {
    try {
      const data = await ebayService.searchProducts(cat.keyword, 50, offset)
      if (!data.items || data.items.length === 0) break
      allItems.push(...data.items.filter(i => isClean(i.title)))
    } catch (err) {
      console.error(`    eBay error: ${err.message.substring(0, 50)}`)
      break
    }
    await sleep(600)
  }

  const seen = new Set()
  const unique = allItems.filter(i => { if (seen.has(i.id)) return false; seen.add(i.id); return true }).slice(0, 50)

  let inserted = 0
  for (const item of unique) {
    try {
      await prisma.product.upsert({
        where: { ebayItemId: item.id },
        update: { name: item.title, price: item.price, currency: item.currency || 'USD', image: item.image, condition: item.condition || null, ebayUrl: item.itemWebUrl || null, sellerName: item.seller || null, sellerFeedback: JSON.stringify({ score: item.sellerFeedbackScore || 0, percentage: item.sellerFeedbackPercentage || '99.0' }), reviews: generateReviews(cat.parent), categoryId },
        create: { name: item.title, price: item.price, currency: item.currency || 'USD', image: item.image, stock: 99, sales: Math.floor(Math.random() * 400) + 30, condition: item.condition || null, ebayItemId: item.id, ebayUrl: item.itemWebUrl || null, source: 'ebay', categoryId, sellerName: item.seller || null, sellerFeedback: JSON.stringify({ score: item.sellerFeedbackScore || 0, percentage: item.sellerFeedbackPercentage || '99.0' }), reviews: generateReviews(cat.parent) },
      })
      inserted++
    } catch {}
  }
  return { fetched: unique.length, inserted }
}

async function main() {
  console.log('=== 全分类商品同步 ===')
  console.log(`共 ${allCategories.length} 个子分类\n`)

  const parentStats = {}
  let totalFetched = 0, totalInserted = 0, idx = 0

  for (const cat of allCategories) {
    idx++
    process.stdout.write(`[${idx}/${allCategories.length}] ${cat.parent} > ${cat.name} ... `)
    const r = await syncOne(cat)
    console.log(`获取 ${r.fetched}, 入库 ${r.inserted}`)
    totalFetched += r.fetched
    totalInserted += r.inserted
    if (!parentStats[cat.parent]) parentStats[cat.parent] = 0
    parentStats[cat.parent] += r.inserted
    await sleep(800)
  }

  // 总统计
  const totalProducts = await prisma.product.count({ where: { name: { not: '__EBAY_PLACEHOLDER__' } } })

  console.log('\n=== 同步完成 ===\n')
  console.log('各父分类入库统计:')
  Object.entries(parentStats).forEach(([k, v]) => console.log(`  ${k}: ${v} 条`))
  console.log(`\n本次: 获取 ${totalFetched}, 入库 ${totalInserted}`)
  console.log(`数据库总商品: ${totalProducts} 条`)
}

main()
  .catch(err => { console.error('失败:', err); process.exit(1) })
  .finally(() => prisma.$disconnect())
