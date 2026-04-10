const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// 获取推荐卖家
router.get('/featured', async (req, res, next) => {
  try {
    // 获取所有有卖家信息的商品，按卖家分组统计
    const products = await prisma.product.findMany({
      where: {
        sellerName: { not: null },
        sellerFeedback: { not: null },
        source: 'ebay',
        name: { not: '__EBAY_PLACEHOLDER__' },
      },
      select: {
        sellerName: true,
        sellerFeedback: true,
        category: { select: { name: true, parentId: true, parent: { select: { name: true } } } },
      },
    })

    // 按卖家分组
    const sellerMap = {}
    for (const p of products) {
      const name = p.sellerName
      if (!name) continue
      if (!sellerMap[name]) {
        let feedback = { score: 0, percentage: '99.0' }
        try { feedback = JSON.parse(p.sellerFeedback) } catch {}
        sellerMap[name] = {
          name,
          feedbackScore: feedback.score || 0,
          feedbackPercent: feedback.percentage || '99.0',
          productCount: 0,
          categories: {},
        }
      }
      sellerMap[name].productCount++
      // 统计卖家主营分类
      const catName = p.category?.parent?.name || p.category?.name || '综合'
      sellerMap[name].categories[catName] = (sellerMap[name].categories[catName] || 0) + 1
    }

    // 排序：好评率 > 商品数 > 反馈分数
    const sellers = Object.values(sellerMap)
      .filter(s => s.productCount >= 2 && s.feedbackScore >= 50)
      .sort((a, b) => {
        const pa = parseFloat(a.feedbackPercent) || 0
        const pb = parseFloat(b.feedbackPercent) || 0
        if (pb !== pa) return pb - pa
        if (b.productCount !== a.productCount) return b.productCount - a.productCount
        return b.feedbackScore - a.feedbackScore
      })
      .slice(0, 8)
      .map(s => {
        // 找到主营分类
        const topCategory = Object.entries(s.categories).sort((a, b) => b[1] - a[1])[0]
        return {
          name: s.name,
          feedbackScore: s.feedbackScore,
          feedbackPercent: s.feedbackPercent,
          productCount: s.productCount,
          category: topCategory ? topCategory[0] : '综合',
        }
      })

    res.json(sellers)
  } catch (err) {
    next(err)
  }
})

module.exports = router
