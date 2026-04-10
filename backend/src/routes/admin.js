const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const authMiddleware = require('../middleware/auth')

const prisma = new PrismaClient()

const EBAY_ITEM_URL = 'https://www.ebay.com/itm/'

// 管理员：获取全部订单（含 eBay 商品链接）
router.get('/orders', authMiddleware, async (req, res, next) => {
  try {
    // 检查是否为管理员
    const user = await prisma.user.findUnique({ where: { id: req.userId } })
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: '无权限' })
    }

    const { status, page = 1, limit = 20 } = req.query
    const where = {}
    if (status && status !== 'all') where.status = status

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
          address: true,
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: Number(limit),
      }),
      prisma.order.count({ where }),
    ])

    // 为 eBay 订单项附加采购链接
    const enriched = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        ebayPurchaseUrl: item.ebayItemId
          ? `${EBAY_ITEM_URL}${item.ebayItemId.split('|')[1] || item.ebayItemId}`
          : null,
      })),
    }))

    res.json({ orders: enriched, total, page: Number(page), limit: Number(limit) })
  } catch (err) {
    next(err)
  }
})

// 管理员：更新订单状态
router.put('/orders/:id/status', authMiddleware, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } })
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: '无权限' })
    }

    const { status } = req.body
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: { items: true, address: true },
    })
    res.json(order)
  } catch (err) {
    next(err)
  }
})

module.exports = router
