require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const ebayService = require('../services/ebayService')

const prisma = new PrismaClient()

const categories = [
  { name: "手机数码", keyword: "smartphones electronics" },
  { name: "电脑办公", keyword: "laptop computer office" },
  { name: "家用电器", keyword: "home appliances" },
  { name: "服饰鞋包", keyword: "fashion clothing shoes" },
  { name: "美妆护肤", keyword: "beauty skincare makeup" },
  { name: "食品生鲜", keyword: "food grocery" },
  { name: "运动户外", keyword: "sports outdoor" },
  { name: "家居家装", keyword: "home furniture decor" },
]

async function ensureCategory(name) {
  let cat = await prisma.category.findUnique({ where: { name } })
  if (!cat) {
    cat = await prisma.category.create({ data: { name } })
  }
  return cat.id
}

async function syncCategory(catName, keyword, categoryId) {
  let allItems = []
  const batchSize = 50
  const target = 100

  for (let offset = 0; allItems.length < target; offset += batchSize) {
    const remaining = target - allItems.length
    const limit = Math.min(batchSize, remaining)

    try {
      console.log(`  批次 ${Math.floor(offset/batchSize)+1}: offset=${offset}, limit=${limit}`)
      const data = await ebayService.searchProducts(keyword, limit, offset)
      if (!data.items || data.items.length === 0) break
      allItems.push(...data.items)
    } catch (err) {
      console.error(`  Error fetching ${keyword} offset=${offset}: ${err.message}`)
      break
    }

    await sleep(800)
  }

  // 去重
  const seen = new Set()
  const unique = allItems.filter(item => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  }).slice(0, target)

  let inserted = 0
  let skipped = 0

  for (const item of unique) {
    try {
      const sellerFeedback = JSON.stringify({
        score: item.sellerFeedbackScore || 0,
        percentage: item.sellerFeedbackPercentage || '99.0',
      })

      // 基于卖家信息生成模拟评论
      const reviews = generateReviews(item)

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
          sellerFeedback,
          reviews,
        },
        create: {
          name: item.title,
          price: item.price,
          currency: item.currency || 'USD',
          image: item.image,
          stock: 99,
          sales: Math.floor(Math.random() * 500) + 50,
          condition: item.condition || null,
          ebayItemId: item.id,
          ebayUrl: item.itemWebUrl || null,
          source: 'ebay',
          categoryId: categoryId,
          sellerName: item.seller || null,
          sellerFeedback,
          reviews,
        },
      })
      inserted++
    } catch (err) {
      skipped++
    }
  }

  return { fetched: unique.length, inserted, skipped }
}

const reviewTemplates = [
  { text: "Great product, exactly as described. Fast shipping!", rating: 5 },
  { text: "Very satisfied with the quality. Would buy again.", rating: 5 },
  { text: "Good value for the price. Arrived on time.", rating: 4 },
  { text: "Product works well. Packaging could be better.", rating: 4 },
  { text: "Excellent condition, looks brand new. Highly recommend!", rating: 5 },
  { text: "Decent quality for the price point. No complaints.", rating: 4 },
  { text: "Exactly what I expected. Seller was very responsive.", rating: 5 },
  { text: "Nice product, took a bit longer to arrive but worth the wait.", rating: 4 },
  { text: "Perfect! My second purchase from this seller.", rating: 5 },
  { text: "Good product overall. Minor cosmetic issue but functions perfectly.", rating: 4 },
  { text: "Absolutely love it! Better than expected quality.", rating: 5 },
  { text: "Works as advertised. Happy with my purchase.", rating: 5 },
  { text: "Solid build quality. Recommend this seller.", rating: 4 },
  { text: "Item was well packed and arrived safely. Great experience.", rating: 5 },
  { text: "Pretty good! A few scratches but nothing major.", rating: 3 },
]

const userNames = [
  "j***n", "m***k", "s***h", "a***z", "l***t", "r***d", "c***e", "b***y",
  "p***l", "d***s", "k***a", "t***o", "n***e", "h***r", "w***g", "f***x",
]

function generateReviews(item) {
  const count = Math.floor(Math.random() * 4) + 2 // 2-5 条评论
  const reviews = []
  const usedIndices = new Set()

  for (let i = 0; i < count; i++) {
    let idx
    do { idx = Math.floor(Math.random() * reviewTemplates.length) } while (usedIndices.has(idx))
    usedIndices.add(idx)
    const template = reviewTemplates[idx]
    const daysAgo = Math.floor(Math.random() * 60) + 1
    const date = new Date(Date.now() - daysAgo * 86400000)

    reviews.push({
      username: userNames[Math.floor(Math.random() * userNames.length)],
      rating: template.rating,
      text: template.text,
      date: date.toISOString().split('T')[0],
      verified: Math.random() > 0.2,
    })
  }

  return reviews
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  console.log('=== eBay 商品同步开始 ===\n')

  const results = []
  let totalInserted = 0

  for (const cat of categories) {
    console.log(`[${cat.name}] 搜索关键词: "${cat.keyword}"`)
    const categoryId = await ensureCategory(cat.name)
    const result = await syncCategory(cat.name, cat.keyword, categoryId)
    console.log(`  → 获取 ${result.fetched} 条, 入库 ${result.inserted} 条, 跳过 ${result.skipped} 条`)
    results.push({ category: cat.name, ...result })
    totalInserted += result.inserted

    // 分类间间隔，避免限流
    await sleep(1000)
  }

  // 统计数据库总商品数
  const totalProducts = await prisma.product.count()
  const ebayProducts = await prisma.product.count({ where: { source: 'ebay' } })
  const localProducts = await prisma.product.count({ where: { source: 'local' } })

  console.log('\n=== 同步完成 ===')
  console.log(`\n各分类统计:`)
  results.forEach(r => {
    console.log(`  ${r.category}: 获取 ${r.fetched} 条, 入库 ${r.inserted} 条`)
  })
  console.log(`\n本次入库: ${totalInserted} 条`)
  console.log(`数据库总商品: ${totalProducts} 条`)
  console.log(`  - eBay 商品: ${ebayProducts} 条`)
  console.log(`  - 本地商品: ${localProducts} 条`)
}

main()
  .catch(err => {
    console.error('同步失败:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
