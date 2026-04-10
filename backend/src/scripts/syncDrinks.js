require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const ebayService = require('../services/ebayService')

const prisma = new PrismaClient()

const drinkCategories = [
  { name: "矿泉水", keyword: "mineral water drinking water" },
  { name: "果汁", keyword: "fruit juice orange juice" },
  { name: "碳酸饮料", keyword: "soda cola carbonated drinks" },
  { name: "乳饮", keyword: "milk drink dairy beverage" },
  { name: "茶类", keyword: "tea green tea herbal tea" },
  { name: "啤酒", keyword: "beer craft beer brewing" },
  { name: "白酒", keyword: "baijiu chinese liquor spirits" },
  { name: "鸡尾酒", keyword: "cocktail mixer spirits" },
  { name: "葡萄酒", keyword: "wine red wine white wine" },
]

const drinkReviews = [
  "包装完好，到货及时，口感不错",
  "性价比很高，味道纯正，会回购",
  "产品正品，口感好，物流很快",
  "味道浓郁醇厚，很正宗，家人都喜欢",
  "包装精美，送礼体面，朋友很满意",
  "口感清爽，冰镇后更好喝，夏天必备",
  "品质不错，和超市买的一样，价格更划算",
  "第二次购买了，味道一如既往的好",
  "送的很快，包装严实没有破损",
  "量足味正，自饮送礼都合适",
  "入口顺滑，回味甘甜，值得推荐",
  "保质期新鲜，日期很近，放心购买",
]

const userNames = [
  "小***米", "大***王", "天***蓝", "快***乐", "阳***光",
  "星***辰", "海***风", "云***淡", "花***开", "月***明",
  "茶***客", "品***酒", "j***n", "m***k", "a***z",
]

function generateDrinkReviews() {
  const count = Math.floor(Math.random() * 3) + 3
  const shuffled = [...drinkReviews].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map(text => {
    const daysAgo = Math.floor(Math.random() * 90) + 1
    return {
      username: userNames[Math.floor(Math.random() * userNames.length)],
      rating: Math.random() > 0.3 ? 5 : 4,
      text,
      date: new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0],
      verified: Math.random() > 0.2,
    }
  })
}

// 过滤不良内容
function isClean(title) {
  const bad = /18\+|adult|xxx|nude|erotic|sexy|tobacco|cigarette|vape|nicotine|marijuana|cannabis|cbd|thc/i
  return !bad.test(title)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function ensureSubCategory(parentName, childName) {
  // 找到父分类
  const parent = await prisma.category.findFirst({ where: { name: parentName, parentId: null } })
  if (!parent) throw new Error(`父分类 "${parentName}" 不存在`)

  // 找或创建子分类
  let child = await prisma.category.findFirst({ where: { name: childName, parentId: parent.id } })
  if (!child) {
    child = await prisma.category.create({ data: { name: childName, parentId: parent.id } })
  }
  return child.id
}

async function syncSubCategory(subName, keyword, categoryId) {
  let allItems = []

  for (let offset = 0; allItems.length < 50; offset += 50) {
    try {
      const data = await ebayService.searchProducts(keyword, 50, offset)
      if (!data.items || data.items.length === 0) break
      allItems.push(...data.items.filter(item => isClean(item.title)))
    } catch (err) {
      console.error(`  Error: ${err.message.substring(0, 60)}`)
      break
    }
    await sleep(800)
  }

  const unique = []
  const seen = new Set()
  for (const item of allItems) {
    if (!seen.has(item.id)) {
      seen.add(item.id)
      unique.push(item)
    }
  }
  const items = unique.slice(0, 50)

  let inserted = 0
  for (const item of items) {
    try {
      await prisma.product.upsert({
        where: { ebayItemId: item.id },
        update: {
          name: item.title,
          price: item.price,
          currency: item.currency || 'USD',
          image: item.image,
          condition: item.condition || null,
          ebayUrl: item.itemWebUrl || null,
          sellerName: item.seller || null,
          sellerFeedback: JSON.stringify({
            score: item.sellerFeedbackScore || 0,
            percentage: item.sellerFeedbackPercentage || '99.0',
          }),
          reviews: generateDrinkReviews(),
        },
        create: {
          name: item.title,
          price: item.price,
          currency: item.currency || 'USD',
          image: item.image,
          stock: 99,
          sales: Math.floor(Math.random() * 300) + 50,
          condition: item.condition || null,
          ebayItemId: item.id,
          ebayUrl: item.itemWebUrl || null,
          source: 'ebay',
          categoryId,
          sellerName: item.seller || null,
          sellerFeedback: JSON.stringify({
            score: item.sellerFeedbackScore || 0,
            percentage: item.sellerFeedbackPercentage || '99.0',
          }),
          reviews: generateDrinkReviews(),
        },
      })
      inserted++
    } catch {}
  }

  return { fetched: items.length, inserted }
}

async function main() {
  console.log('=== 饮品酒水分类商品同步 ===\n')

  const results = []

  for (const cat of drinkCategories) {
    console.log(`[${cat.name}] 关键词: "${cat.keyword}"`)
    const categoryId = await ensureSubCategory('饮品酒水', cat.name)
    const result = await syncSubCategory(cat.name, cat.keyword, categoryId)
    console.log(`  → 获取 ${result.fetched} 条, 入库 ${result.inserted} 条`)
    results.push({ name: cat.name, ...result })
    await sleep(1000)
  }

  // 统计
  const parentCat = await prisma.category.findFirst({ where: { name: '饮品酒水', parentId: null } })
  const childCats = await prisma.category.findMany({ where: { parentId: parentCat.id } })
  const allChildIds = [parentCat.id, ...childCats.map(c => c.id)]
  const totalDrinks = await prisma.product.count({
    where: { categoryId: { in: allChildIds }, name: { not: '__EBAY_PLACEHOLDER__' } }
  })

  console.log('\n=== 同步完成 ===')
  console.log('\n各子分类统计:')
  results.forEach(r => console.log(`  ${r.name}: 获取 ${r.fetched}, 入库 ${r.inserted}`))
  console.log(`\n饮品酒水总商品: ${totalDrinks} 条`)
}

main()
  .catch(err => { console.error('失败:', err); process.exit(1) })
  .finally(() => prisma.$disconnect())
