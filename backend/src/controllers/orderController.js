const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// 获取或创建 eBay 占位商品
async function getEbayPlaceholderProduct() {
  let product = await prisma.product.findFirst({ where: { name: '__EBAY_PLACEHOLDER__' } })
  if (!product) {
    product = await prisma.product.create({
      data: { name: '__EBAY_PLACEHOLDER__', price: 0, stock: 999999 },
    })
  }
  return product.id
}

// 创建订单
exports.createOrder = async (req, res, next) => {
  try {
    const { items, address, payMethod, totalAmount } = req.body

    const addr = await prisma.address.create({
      data: {
        userId: req.userId,
        name: address.name,
        phone: address.phone,
        detail: address.detail,
      },
    })

    // 处理订单项：eBay 商品用占位 productId
    const ebayPlaceholderId = await getEbayPlaceholderProduct()
    const orderItems = items.map((item) => {
      const isEbay = item.source === 'ebay' || (typeof item.ebayItemId === 'string' && item.ebayItemId.includes('v1|'))
      return {
        productId: isEbay ? ebayPlaceholderId : item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '',
        ebayItemId: isEbay ? (item.ebayItemId || item.id) : null,
        source: isEbay ? 'ebay' : 'local',
        currency: item.currency || 'USD',
      }
    })

    const order = await prisma.order.create({
      data: {
        userId: req.userId,
        totalAmount,
        payMethod,
        status: 'pending',
        addressId: addr.id,
        items: { create: orderItems },
      },
      include: { items: true, address: true },
    })

    res.status(201).json(order)
  } catch (err) {
    next(err)
  }
}

// 获取用户订单列表
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(orders)
  } catch (err) {
    next(err)
  }
}

// 获取订单详情
exports.getOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: { items: true, address: true },
    })
    if (!order) {
      return res.status(404).json({ message: '订单不存在' })
    }
    res.json(order)
  } catch (err) {
    next(err)
  }
}
