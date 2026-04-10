require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const ebayService = require('../services/ebayService')

const prisma = new PrismaClient()

// 脏数据过滤规则
const cleanRules = {
  "白酒": ['book', 'guide', 'science', 'engineering', 'empty bottle', '空瓶', '茶具', 'tray', 'display', 'poster', 'sign', 'art', 'decor'],
  "鸡尾酒": ['shaker', 'bartender', 'tool set', 'bar tool', 'recipe', 'glass set', 'mixer set', 'jigger', 'strainer'],
  "啤酒": ['book', 'guide', 'brewing kit', 'equipment', 'sign', 'poster', 'glass', 'opener', 'tap', 'keg'],
  "葡萄酒": ['book', 'guide', 'glass', 'opener', 'rack', 'decanter', 'accessory', 'tool', 'sign', 'art', 'decor', 'stopper', 'corkscrew'],
  "茶类": ['teapot', 'cup', 'mug', 'strainer', 'infuser', 'book', 'artwork', 'canister', 'tin', 'kettle'],
  "矿泉水": ['bottle opener', 'dispenser', 'machine', 'filter', 'purifier', 'book', 'guide', 'cooler'],
  "果汁": ['juicer', 'machine', 'press', 'extractor', 'book', 'blender'],
}

// 精准抓取关键词
const refillCategories = [
  { name: "白酒", keyword: "baijiu chinese liquor spirits 500ml", exclude: /book|guide|empty|display|poster|sign|art|decor/i },
  { name: "鸡尾酒", keyword: "cocktail drink ready-to-drink canned premixed", exclude: /shaker|tool|kit|glass|bartender|recipe/i },
  { name: "啤酒", keyword: "beer lager ale stout craft beer can bottle", exclude: /book|equipment|brewing kit|glass|opener|sign|poster|tap|keg/i },
  { name: "葡萄酒", keyword: "wine red wine white wine bottle", exclude: /glass|opener|rack|decanter|book|tool|sign|stopper|corkscrew/i },
  { name: "茶类", keyword: "tea bag loose leaf green tea black tea herbal", exclude: /teapot|cup|mug|strainer|infuser|kettle|pot/i },
  { name: "矿泉水", keyword: "mineral water spring water drinking water bottle pack", exclude: /filter|purifier|dispenser|machine|cooler/i },
  { name: "果汁", keyword: "fruit juice orange juice apple juice drink bottle", exclude: /juicer|machine|press|extractor|blender/i },
]

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  console.log('=== 分类脏数据清理 + 精准补充 ===\n')

  const results = []

  for (const [catName, keywords] of Object.entries(cleanRules)) {
    const cat = await prisma.category.findFirst({ where: { name: catName } })
    if (!cat) { console.log(`跳过: ${catName} 不存在`); continue }

    const beforeCount = await prisma.product.count({ where: { categoryId: cat.id } })

    // 构建 OR 条件
    let deleted = 0
    for (const kw of keywords) {
      const r = await prisma.product.deleteMany({
        where: { categoryId: cat.id, name: { contains: kw, mode: 'insensitive' } }
      })
      deleted += r.count
    }

    const afterCount = await prisma.product.count({ where: { categoryId: cat.id } })
    console.log(`[${catName}] 清理前 ${beforeCount} → 删除 ${deleted} → 剩余 ${afterCount}`)
    results.push({ name: catName, before: beforeCount, deleted, after: afterCount })
  }

  console.log('\n=== 精准补充抓取 ===\n')

  for (const cat of refillCategories) {
    const dbCat = await prisma.category.findFirst({ where: { name: cat.name } })
    if (!dbCat) continue

    process.stdout.write(`[${cat.name}] "${cat.keyword}" ... `)

    let allItems = []
    for (let offset = 0; allItems.length < 100; offset += 50) {
      try {
        const data = await ebayService.searchProducts(cat.keyword, 50, offset)
        if (!data.items || data.items.length === 0) break
        allItems.push(...data.items.filter(i =>
          i.image && i.image.startsWith('http') && !cat.exclude.test(i.title)
        ))
      } catch (err) {
        console.error(`Error: ${err.message.substring(0, 40)}`)
        break
      }
      await sleep(700)
    }

    const seen = new Set()
    const unique = allItems.filter(i => { if (seen.has(i.id)) return false; seen.add(i.id); return true }).slice(0, 100)

    let inserted = 0
    for (const item of unique) {
      try {
        const existing = await prisma.product.findUnique({ where: { ebayItemId: item.id } })
        if (existing) continue
        await prisma.product.create({
          data: {
            name: item.title, price: item.price, currency: item.currency || 'USD', image: item.image,
            stock: 99, sales: Math.floor(Math.random() * 200) + 20, condition: item.condition || null,
            ebayItemId: item.id, ebayUrl: item.itemWebUrl || null, source: 'ebay', categoryId: dbCat.id,
            sellerName: item.seller || null,
            sellerFeedback: JSON.stringify({ score: item.sellerFeedbackScore || 0, percentage: item.sellerFeedbackPercentage || '99.0' }),
            reviews: [],
          },
        })
        inserted++
      } catch {}
    }

    const finalCount = await prisma.product.count({ where: { categoryId: dbCat.id } })
    console.log(`获取 ${unique.length}, 新增 ${inserted} | 总计 ${finalCount}`)

    const r = results.find(x => x.name === cat.name)
    if (r) { r.refilled = inserted; r.final = finalCount }
    await sleep(800)
  }

  console.log('\n=== 汇总 ===\n')
  console.log('分类'.padEnd(10) + '清理前'.padStart(6) + '删除'.padStart(6) + '补充'.padStart(6) + '最终'.padStart(6))
  console.log('-'.repeat(34))
  for (const r of results) {
    console.log(`${r.name.padEnd(10)}${String(r.before).padStart(6)}${String(r.deleted).padStart(6)}${String(r.refilled || 0).padStart(6)}${String(r.final || r.after).padStart(6)}`)
  }
}

main()
  .catch(err => { console.error(err); process.exit(1) })
  .finally(() => prisma.$disconnect())
