const express = require('express')
const router = express.Router()
const ebayService = require('../services/ebayService')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// 搜索商品（eBay 实时 + 缓存到本地 DB）
router.get('/search', async (req, res, next) => {
  try {
    const { q, limit = 40 } = req.query
    if (!q) {
      return res.status(400).json({ message: '请提供搜索关键词 q' })
    }

    // 1. 调 eBay API
    const result = await ebayService.searchProducts(q, Number(limit))
    const items = (result.items || []).filter(i => i.image && i.image.startsWith('http'))

    // 2. 后台异步缓存到数据库（不阻塞响应）
    cacheToDb(items).catch(() => {})

    // 3. 返回给前端（带分页格式兼容）
    res.json({
      products: items.map(i => ({
        id: i.id,
        name: i.title,
        price: i.price,
        currency: i.currency || 'USD',
        image: i.image,
        condition: i.condition || null,
        source: 'ebay',
        ebayItemId: i.id,
        ebayUrl: i.itemWebUrl || null,
        sellerName: i.seller || null,
        sales: 0,
      })),
      total: result.total || items.length,
      page: 1,
      limit: Number(limit),
      totalPages: 1,
      source: 'ebay',
    })
  } catch (err) {
    next(err)
  }
})

async function cacheToDb(items) {
  for (const item of items) {
    try {
      await prisma.product.upsert({
        where: { ebayItemId: item.id },
        update: { name: item.title, price: item.price, image: item.image, condition: item.condition || null },
        create: {
          name: item.title, price: item.price, currency: item.currency || 'USD',
          image: item.image, stock: 99, sales: 0, condition: item.condition || null,
          ebayItemId: item.id, ebayUrl: item.itemWebUrl || null, source: 'ebay',
          sellerName: item.seller || null,
          sellerFeedback: JSON.stringify({ score: item.sellerFeedbackScore || 0, percentage: item.sellerFeedbackPercentage || '99.0' }),
          reviews: [],
        },
      })
    } catch {}
  }
}

// 获取商品详情（同时回写多图到数据库）
router.get('/product/:id', async (req, res, next) => {
  try {
    const result = await ebayService.getProductDetail(req.params.id)

    // 异步回写多图到数据库
    if (result.images && result.images.length > 0) {
      prisma.product.updateMany({
        where: { ebayItemId: req.params.id },
        data: { images: result.images, image: result.images[0] },
      }).catch(() => {})
    }

    res.json(result)
  } catch (err) {
    next(err)
  }
})

module.exports = router
