require('dotenv').config()
const { PrismaClient, Prisma } = require('@prisma/client')
const ebayService = require('../services/ebayService')

const prisma = new PrismaClient()

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  console.log('=== 商品多图回填 ===\n')

  // 获取所有有 ebayItemId 但没有 images 的商品
  const products = await prisma.product.findMany({
    where: {
      ebayItemId: { not: null },
      images: { equals: Prisma.DbNull },
      source: 'ebay',
    },
    select: { id: true, ebayItemId: true, name: true, image: true },
    take: 500, // 每次处理500条，避免太慢
  })

  console.log(`待处理: ${products.length} 条\n`)

  let updated = 0, failed = 0, single = 0

  for (let i = 0; i < products.length; i++) {
    const p = products[i]

    try {
      const detail = await ebayService.getProductDetail(p.ebayItemId)
      const allImages = detail.images || []

      if (allImages.length > 0) {
        await prisma.product.update({
          where: { id: p.id },
          data: {
            images: allImages,
            image: allImages[0], // 确保主图也是高清的
          },
        })
        if (allImages.length > 1) {
          updated++
        } else {
          single++
        }
      } else {
        // 没有图片，用现有的 image 字段填充
        if (p.image) {
          await prisma.product.update({
            where: { id: p.id },
            data: { images: [p.image] },
          })
        }
        single++
      }
    } catch {
      // API 失败，用现有 image 兜底
      if (p.image) {
        await prisma.product.update({
          where: { id: p.id },
          data: { images: [p.image] },
        })
      }
      failed++
    }

    if ((i + 1) % 20 === 0 || i === products.length - 1) {
      const pct = ((i + 1) / products.length * 100).toFixed(1)
      console.log(`[${pct}%] ${i + 1}/${products.length} | 多图: ${updated} | 单图: ${single} | 失败: ${failed}`)
    }

    await sleep(300) // eBay API 限速
  }

  console.log('\n=== 完成 ===')
  console.log(`多图更新: ${updated} 条`)
  console.log(`单图填充: ${single} 条`)
  console.log(`失败兜底: ${failed} 条`)
}

main()
  .catch(err => { console.error(err); process.exit(1) })
  .finally(() => prisma.$disconnect())
