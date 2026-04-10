require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const Anthropic = require('@anthropic-ai/sdk')

const prisma = new PrismaClient()
const anthropic = new Anthropic.default()

const BATCH_SIZE = 10 // 每批处理10个商品后打印进度
const DELAY_MS = 1200 // 每次请求间隔1.2秒

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function generateReviewsForProduct(product) {
  const prompt = `为以下商品生成3条真实买家评论。

商品：${product.name}
价格：$${product.price}
${product.condition ? `状态：${product.condition}` : ''}
${product.sellerName ? `卖家：${product.sellerName}` : ''}

要求：
- 语气自然，像真实买家写的
- 有具体细节（尺寸/颜色/使用感受）
- 有优点也有小缺点，不要全是好评
- 中文，50-100字每条
- 用户名格式：脱敏如 小***米、a***z
- 评分4或5星（偶尔3星）
- 日期在2025-10到2026-04之间
- 直接返回JSON数组，不要其他文字

[{"username":"脱敏用户名","rating":5,"date":"2026-01-15","text":"评论内容","verified":true}]`

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]?.text || ''

  // 提取 JSON 数组
  const match = content.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('No JSON array in response')

  const reviews = JSON.parse(match[0])
  return reviews.map(r => ({
    username: r.username || '匿***名',
    rating: Math.min(5, Math.max(1, r.rating || 5)),
    date: r.date || new Date().toISOString().split('T')[0],
    text: r.text || r.comment || '',
    verified: r.verified !== false,
  }))
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ 缺少 ANTHROPIC_API_KEY，请在 .env 中添加：')
    console.error('   ANTHROPIC_API_KEY=sk-ant-...')
    process.exit(1)
  }

  console.log('=== Claude AI 评论生成 ===\n')

  const products = await prisma.product.findMany({
    where: { name: { not: '__EBAY_PLACEHOLDER__' } },
    select: { id: true, name: true, price: true, condition: true, sellerName: true },
    orderBy: { createdAt: 'desc' },
  })

  console.log(`共 ${products.length} 个商品\n`)

  let success = 0
  let failed = 0
  let totalReviews = 0

  for (let i = 0; i < products.length; i++) {
    const product = products[i]

    try {
      const reviews = await generateReviewsForProduct(product)

      await prisma.product.update({
        where: { id: product.id },
        data: { reviews },
      })

      success++
      totalReviews += reviews.length

      if ((i + 1) % BATCH_SIZE === 0 || i === products.length - 1) {
        const pct = ((i + 1) / products.length * 100).toFixed(1)
        console.log(`[${pct}%] ${i + 1}/${products.length} | 成功: ${success} | 失败: ${failed} | 评论: ${totalReviews}`)
      }
    } catch (err) {
      failed++
      console.error(`  ✗ ${product.name.substring(0, 40)}... — ${err.message.substring(0, 60)}`)
    }

    await sleep(DELAY_MS)
  }

  console.log('\n=== 完成 ===')
  console.log(`成功: ${success} 个商品`)
  console.log(`失败: ${failed} 个商品`)
  console.log(`生成评论: ${totalReviews} 条`)
}

main()
  .catch(err => {
    console.error('脚本错误:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
