require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const ebayService = require('../services/ebayService')

const prisma = new PrismaClient()
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  console.log('=== 热门商品多图获取 ===\n')

  // 获取销量最高和最新的商品（首页会展示的）
  const products = await prisma.product.findMany({
    where: {
      source: 'ebay',
      ebayItemId: { not: null },
      name: { not: '__EBAY_PLACEHOLDER__' },
    },
    select: { id: true, ebayItemId: true, name: true, images: true },
    orderBy: [{ sales: 'desc' }],
    take: 200,
  })

  // 只处理单图的
  const singleImage = products.filter(p => !Array.isArray(p.images) || p.images.length <= 1)
  console.log(`总共 ${products.length} 条, 单图 ${singleImage.length} 条待处理\n`)

  let multi = 0, single = 0, failed = 0

  for (let i = 0; i < singleImage.length; i++) {
    const p = singleImage[i]
    try {
      const detail = await ebayService.getProductDetail(p.ebayItemId)
      if (detail.images && detail.images.length > 0) {
        await prisma.product.update({
          where: { id: p.id },
          data: { images: detail.images, image: detail.images[0] },
        })
        if (detail.images.length > 1) multi++
        else single++
      } else {
        single++
      }
    } catch {
      failed++
    }

    if ((i + 1) % 20 === 0 || i === singleImage.length - 1) {
      console.log(`[${i + 1}/${singleImage.length}] 多图: ${multi} | 单图: ${single} | 失败: ${failed}`)
    }
    await sleep(250)
  }

  console.log(`\n完成: 多图 ${multi}, 单图 ${single}, 失败 ${failed}`)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
