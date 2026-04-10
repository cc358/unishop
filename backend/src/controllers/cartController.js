const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// 获取购物车
exports.getCart = async (req, res, next) => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.userId },
      include: { product: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json(items)
  } catch (err) {
    next(err)
  }
}

// 添加到购物车
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body
    const item = await prisma.cartItem.upsert({
      where: { userId_productId: { userId: req.userId, productId } },
      update: { quantity: { increment: quantity } },
      create: { userId: req.userId, productId, quantity },
      include: { product: true },
    })
    res.status(201).json(item)
  } catch (err) {
    next(err)
  }
}

// 更新购物车商品
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity, selected } = req.body
    const data = {}
    if (quantity !== undefined) data.quantity = quantity
    if (selected !== undefined) data.selected = selected

    const item = await prisma.cartItem.updateMany({
      where: { id: req.params.id, userId: req.userId },
      data,
    })
    res.json(item)
  } catch (err) {
    next(err)
  }
}

// 删除购物车商品
exports.deleteCartItem = async (req, res, next) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { id: req.params.id, userId: req.userId },
    })
    res.json({ message: '已删除' })
  } catch (err) {
    next(err)
  }
}

// 清空购物车
exports.clearCart = async (req, res, next) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.userId },
    })
    res.json({ message: '已清空' })
  } catch (err) {
    next(err)
  }
}
