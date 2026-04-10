require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('=== 商品数据修复 ===\n')

  // 1. 清理标题末尾的长数字
  const allProducts = await prisma.product.findMany({
    where: { name: { not: '__EBAY_PLACEHOLDER__' } },
    select: { id: true, name: true },
  })

  let titleFixed = 0
  for (const p of allProducts) {
    const cleaned = p.name.replace(/\s+\d{6,}$/, '').trim()
    if (cleaned !== p.name) {
      await prisma.product.update({ where: { id: p.id }, data: { name: cleaned } })
      titleFixed++
    }
  }
  console.log(`标题修复: ${titleFixed} 条 (去除末尾数字)`)

  // 2. 统计空图片商品
  const emptyImageProducts = await prisma.product.findMany({
    where: {
      name: { not: '__EBAY_PLACEHOLDER__' },
      OR: [{ image: null }, { image: '' }],
    },
    select: { id: true, name: true, ebayItemId: true },
  })
  console.log(`\n空图片商品: ${emptyImageProducts.length} 条`)

  // 3. 给空图片商品设置占位图
  if (emptyImageProducts.length > 0) {
    await prisma.product.updateMany({
      where: {
        OR: [{ image: null }, { image: '' }],
        name: { not: '__EBAY_PLACEHOLDER__' },
      },
      data: { image: '/placeholder.jpg' },
    })
    console.log(`已设置占位图: ${emptyImageProducts.length} 条`)
  }

  // 打印几条看看
  const sample = emptyImageProducts.slice(0, 5)
  sample.forEach(p => console.log(`  - ${p.name.substring(0, 50)} | ebayId: ${p.ebayItemId?.substring(0, 30) || 'null'}`))

  console.log('\n完成')
}

main()
  .catch(err => { console.error(err); process.exit(1) })
  .finally(() => prisma.$disconnect())
