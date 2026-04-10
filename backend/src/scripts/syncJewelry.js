require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const ebayService = require('../services/ebayService')

const prisma = new PrismaClient()

const categories = [
  { parent: "珠宝手表", name: "女士手表", keyword: "women fashion watch" },
  { parent: "珠宝手表", name: "男士手表", keyword: "men luxury watch" },
  { parent: "珠宝手表", name: "珠宝首饰", keyword: "gold silver jewelry set" },
  { parent: "珠宝手表", name: "项链和吊坠", keyword: "necklace pendant women" },
  { parent: "珠宝手表", name: "女士手链", keyword: "women bracelet bangle" },
  { parent: "珠宝手表", name: "耳环", keyword: "earrings women hoop stud" },
  { parent: "珠宝手表", name: "戒指", keyword: "ring gold silver wedding" },
  { parent: "珠宝手表", name: "脚链", keyword: "anklet foot chain jewelry" },
  { parent: "珠宝手表", name: "首饰套装", keyword: "jewelry set necklace earring bracelet" },
  { parent: "奢侈品", name: "珠宝", keyword: "diamond jewelry luxury gold" },
]

const reviews = [
  "做工精致，光泽度好，戴着很有气质",
  "款式好看，日常佩戴很百搭",
  "走时精准，表带舒适，佩戴感好",
  "成色很好，和图片一致，没有色差",
  "包装精美，送礼很体面",
  "性价比高，比专柜便宜不少",
]
const users = ["品***鉴","雅***士","星***辰","花***开","m***k","a***z","l***t","海***风"]

function genReviews() {
  const n = Math.floor(Math.random() * 2) + 3
  return [...reviews].sort(() => Math.random() - 0.5).slice(0, n).map(text => ({
    username: users[Math.floor(Math.random() * users.length)],
    rating: Math.random() > 0.2 ? 5 : 4,
    text,
    date: new Date(Date.now() - (Math.floor(Math.random() * 90) + 1) * 86400000).toISOString().split('T')[0],
    verified: Math.random() > 0.2,
  }))
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  console.log('=== 珠宝商品重新抓取 ===\n')

  for (const cat of categories) {
    const parent = await prisma.category.findFirst({ where: { name: cat.parent, parentId: null } })
    let child = await prisma.category.findFirst({ where: { name: cat.name, parentId: parent.id } })
    if (!child) child = await prisma.category.create({ data: { name: cat.name, parentId: parent.id } })

    console.log(`[${cat.parent} > ${cat.name}] "${cat.keyword}"`)

    let allItems = []
    for (let offset = 0; allItems.length < 50; offset += 50) {
      try {
        const data = await ebayService.searchProducts(cat.keyword, 50, offset)
        if (!data.items || data.items.length === 0) break
        // 只要有图片的
        allItems.push(...data.items.filter(i => i.image && i.image.startsWith('http')))
      } catch (err) {
        console.error('  Error:', err.message.substring(0, 50))
        break
      }
      await sleep(800)
    }

    const seen = new Set()
    const unique = allItems.filter(i => { if (seen.has(i.id)) return false; seen.add(i.id); return true }).slice(0, 50)

    let inserted = 0
    for (const item of unique) {
      try {
        await prisma.product.upsert({
          where: { ebayItemId: item.id },
          update: { name: item.title, price: item.price, image: item.image, condition: item.condition || null, sellerName: item.seller || null },
          create: {
            name: item.title, price: item.price, currency: item.currency || 'USD', image: item.image,
            stock: 99, sales: Math.floor(Math.random() * 200) + 10, condition: item.condition || null,
            ebayItemId: item.id, ebayUrl: item.itemWebUrl || null, source: 'ebay', categoryId: child.id,
            sellerName: item.seller || null,
            sellerFeedback: JSON.stringify({ score: item.sellerFeedbackScore || 0, percentage: item.sellerFeedbackPercentage || '99.0' }),
            reviews: genReviews(),
          },
        })
        inserted++
      } catch {}
    }
    const total = await prisma.product.count({ where: { categoryId: child.id } })
    console.log(`  → 入库 ${inserted} 条 | 总计 ${total} 条`)
    await sleep(1000)
  }
  console.log('\n完成')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
