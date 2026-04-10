require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const ebayService = require('../services/ebayService')

const prisma = new PrismaClient()

const kidCategories = [
  { name: "儿童包包", keyword: "kids backpack school bag children" },
  { name: "男童服装", keyword: "boys clothing outfit set" },
  { name: "男童裤子", keyword: "boys pants jeans trousers" },
  { name: "男童内衣和袜子", keyword: "boys underwear socks kids" },
  { name: "男童上衣和T恤", keyword: "boys t-shirt top kids" },
  { name: "男童睡衣", keyword: "boys pajamas sleepwear kids" },
  { name: "男童外套", keyword: "boys jacket coat outerwear kids" },
  { name: "男童鞋", keyword: "boys shoes sneakers kids" },
  { name: "女童服饰", keyword: "girls clothing dress outfit" },
  { name: "女童裤子", keyword: "girls pants leggings kids" },
  { name: "女童内衣和袜子", keyword: "girls underwear socks kids" },
  { name: "女童裙子", keyword: "girls skirt dress kids" },
  { name: "女童上衣和T恤", keyword: "girls t-shirt top blouse kids" },
  { name: "女童睡衣", keyword: "girls pajamas sleepwear kids" },
  { name: "女童套装", keyword: "girls outfit set clothing kids" },
  { name: "女童外套", keyword: "girls jacket coat kids" },
  { name: "女童鞋", keyword: "girls shoes sandals kids" },
  { name: "女童配饰", keyword: "girls accessories hair bow headband" },
  { name: "男童配饰", keyword: "boys accessories hat belt kids" },
  { name: "装扮道具", keyword: "kids costume dress up play pretend" },
]

const reviews = [
  "面料柔软舒适，孩子穿着很开心",
  "做工精细，没有线头，质量很好",
  "颜色鲜艳好看，孩子非常喜欢",
  "尺码标准，买的刚好合适",
  "洗了几次不褪色不变形，耐穿",
  "款式可爱，幼儿园老师都夸好看",
  "透气性好，夏天穿不闷热",
  "性价比高，比实体店便宜很多",
  "包装完好，发货快，孩子等不及了",
  "质量超出预期，已经回购第二件了",
]
const users = ["宝***妈","辣***妈","超***爸","小***米","快***乐","星***辰","花***开","天***蓝","m***k","a***z"]

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
  console.log('=== 童装分类商品抓取 (每个100条) ===\n')

  const parent = await prisma.category.findFirst({ where: { name: '童装', parentId: null } })
  if (!parent) { console.error('童装分类不存在'); return }

  const results = []

  for (let ci = 0; ci < kidCategories.length; ci++) {
    const cat = kidCategories[ci]
    let child = await prisma.category.findFirst({ where: { name: cat.name, parentId: parent.id } })
    if (!child) child = await prisma.category.create({ data: { name: cat.name, parentId: parent.id } })

    process.stdout.write(`[${ci + 1}/${kidCategories.length}] ${cat.name} ... `)

    let allItems = []
    for (let offset = 0; allItems.length < 100; offset += 50) {
      try {
        const data = await ebayService.searchProducts(cat.keyword, 50, offset)
        if (!data.items || data.items.length === 0) break
        allItems.push(...data.items.filter(i => i.image && i.image.startsWith('http')))
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
            reviews: genReviews(),
          },
        })
        inserted++
      } catch {}
    }

    const total = await prisma.product.count({ where: { categoryId: child.id } })
    console.log(`获取 ${unique.length}, 新增 ${inserted} | 总计 ${total}`)
    results.push({ name: cat.name, fetched: unique.length, inserted, total })
    await sleep(800)
  }

  const allChildIds = await prisma.category.findMany({ where: { parentId: parent.id }, select: { id: true } })
  const grandTotal = await prisma.product.count({ where: { categoryId: { in: [parent.id, ...allChildIds.map(c => c.id)] } } })

  console.log('\n=== 完成 ===\n')
  results.forEach(r => console.log(`  ${r.name}: ${r.total} 条`))
  console.log(`\n童装总计: ${grandTotal} 条`)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
