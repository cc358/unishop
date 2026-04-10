require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const ebayService = require('../services/ebayService')

const prisma = new PrismaClient()

const allCategories = [
  // 办公文具
  { parent: "办公文具", name: "办公室配件", keyword: "office accessories desk organizer" },
  { parent: "办公文具", name: "办公小电器", keyword: "office small appliance shredder laminator" },
  { parent: "办公文具", name: "办公装订用品", keyword: "binding stapler paper clip" },
  { parent: "办公文具", name: "办公桌收纳", keyword: "desk organizer storage office" },
  { parent: "办公文具", name: "胶带粘合剂", keyword: "tape adhesive glue office" },
  { parent: "办公文具", name: "美术用品", keyword: "art supplies paint brush canvas" },
  { parent: "办公文具", name: "日历卡片", keyword: "calendar planner cards greeting" },
  { parent: "办公文具", name: "书写和修正用品", keyword: "pen pencil marker correction tape" },
  { parent: "办公文具", name: "文具贴纸", keyword: "sticker label decorative stationery" },
  { parent: "办公文具", name: "邮件运输用品", keyword: "shipping supplies envelope mailer box" },
  { parent: "办公文具", name: "纸和笔记本", keyword: "notebook paper journal diary" },

  // 零食甜点
  { parent: "零食甜点", name: "坚果", keyword: "nuts almonds cashew snack" },
  { parent: "零食甜点", name: "甜点", keyword: "dessert sweet candy treat" },
  { parent: "零食甜点", name: "蛋糕", keyword: "cake baking mix decoration" },
  { parent: "零食甜点", name: "果冻", keyword: "jelly gummy candy fruit snack" },
  { parent: "零食甜点", name: "面筋", keyword: "jerky dried meat snack protein" },
  { parent: "零食甜点", name: "肉干", keyword: "beef jerky dried meat snack" },
]

const reviewMap = {
  "办公文具": [
    "质量不错，做工精细，办公很实用",
    "款式简约大方，放在桌上很整洁",
    "用料扎实，比预期好，推荐购买",
    "颜色好看，收纳功能强大，物超所值",
    "书写流畅，手感很好，会回购",
    "包装仔细，没有破损，发货也快",
  ],
  "零食甜点": [
    "口感很好，香脆可口，停不下来",
    "味道正宗，包装精美，送人体面",
    "新鲜好吃，日期很近，放心购买",
    "量足味美，性价比很高，全家都爱",
    "甜度刚好，不腻口，当零食很合适",
    "包装严实没有碎，味道超级棒",
  ],
}
const defaultReviews = ["收到货物完好，质量符合预期，很满意","性价比很高，下次还会购买","物流很快，包装仔细，好评"]
const users = ["小***米","大***王","天***蓝","快***乐","阳***光","星***辰","海***风","云***淡","花***开","月***明","j***n","m***k"]

function genReviews(parentName) {
  const templates = [...(reviewMap[parentName] || []), ...defaultReviews]
  const n = Math.floor(Math.random() * 2) + 3
  return [...templates].sort(() => Math.random() - 0.5).slice(0, n).map(text => ({
    username: users[Math.floor(Math.random() * users.length)],
    rating: Math.random() > 0.25 ? 5 : 4,
    text,
    date: new Date(Date.now() - (Math.floor(Math.random() * 90) + 1) * 86400000).toISOString().split('T')[0],
    verified: Math.random() > 0.2,
  }))
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  console.log('=== 办公文具 + 零食甜点 商品抓取 (每个100条) ===\n')

  const results = []

  for (let i = 0; i < allCategories.length; i++) {
    const cat = allCategories[i]
    const parent = await prisma.category.findFirst({ where: { name: cat.parent, parentId: null } })
    if (!parent) { console.log(`跳过: 父分类 ${cat.parent} 不存在`); continue }
    let child = await prisma.category.findFirst({ where: { name: cat.name, parentId: parent.id } })
    if (!child) child = await prisma.category.create({ data: { name: cat.name, parentId: parent.id } })

    process.stdout.write(`[${i + 1}/${allCategories.length}] ${cat.parent} > ${cat.name} ... `)

    let allItems = []
    for (let offset = 0; allItems.length < 100; offset += 50) {
      try {
        const data = await ebayService.searchProducts(cat.keyword, 50, offset)
        if (!data.items || data.items.length === 0) break
        allItems.push(...data.items.filter(item => item.image && item.image.startsWith('http')))
      } catch (err) {
        console.error(`Error: ${err.message.substring(0, 50)}`)
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
            stock: 99, sales: Math.floor(Math.random() * 300) + 20, condition: item.condition || null,
            ebayItemId: item.id, ebayUrl: item.itemWebUrl || null, source: 'ebay', categoryId: child.id,
            sellerName: item.seller || null,
            sellerFeedback: JSON.stringify({ score: item.sellerFeedbackScore || 0, percentage: item.sellerFeedbackPercentage || '99.0' }),
            reviews: genReviews(cat.parent),
          },
        })
        inserted++
      } catch {}
    }

    const total = await prisma.product.count({ where: { categoryId: child.id } })
    console.log(`获取 ${unique.length}, 新增 ${inserted} | 总计 ${total}`)
    results.push({ parent: cat.parent, name: cat.name, inserted, total })
    await sleep(800)
  }

  console.log('\n=== 完成 ===\n')
  let curParent = ''
  results.forEach(r => {
    if (r.parent !== curParent) { curParent = r.parent; console.log(`\n${curParent}:`) }
    console.log(`  ${r.name}: ${r.total} 条`)
  })
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
