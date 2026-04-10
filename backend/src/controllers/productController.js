const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// 获取商品列表（分页）
exports.getProducts = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 20, sortBy, seller } = req.query
    const where = { name: { not: '__EBAY_PLACEHOLDER__' } }

    if (seller) {
      where.sellerName = seller
    }

    if (category && category !== 'all') {
      // 查找该分类及其所有子分类
      const cat = await prisma.category.findFirst({ where: { name: category } })
      if (cat) {
        const children = await prisma.category.findMany({ where: { parentId: cat.id }, select: { id: true } })
        const allCatIds = [cat.id, ...children.map(c => c.id)]
        where.categoryId = { in: allCatIds }
      } else {
        where.category = { name: category }
      }
    }
    if (search) {
      where.AND = [
        { name: { not: '__EBAY_PLACEHOLDER__' } },
        { name: { contains: search, mode: 'insensitive' } },
      ]
      delete where.name
    }

    // 排序
    let orderBy = { createdAt: 'desc' }
    if (sortBy === 'price-asc') orderBy = { price: 'asc' }
    else if (sortBy === 'price-desc') orderBy = { price: 'desc' }
    else if (sortBy === 'newest') orderBy = { createdAt: 'desc' }
    else if (sortBy === 'sales') orderBy = { sales: 'desc' }

    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.min(100, Math.max(1, Number(limit)))

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy,
      }),
      prisma.product.count({ where }),
    ])

    res.json({
      products,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    })
  } catch (err) {
    next(err)
  }
}

// 获取商品详情（支持本地ID和eBay ID）
exports.getProduct = async (req, res, next) => {
  try {
    const paramId = req.params.id
    let product = await prisma.product.findUnique({
      where: { id: paramId },
      include: { category: true },
    })
    // 如果本地ID找不到，尝试用ebayItemId查找
    if (!product && paramId.includes('|')) {
      product = await prisma.product.findFirst({
        where: { ebayItemId: paramId },
        include: { category: true },
      })
    }
    if (!product) {
      return res.status(404).json({ message: '商品不存在' })
    }
    res.json(product)
  } catch (err) {
    next(err)
  }
}

// 获取分类列表（含子分类和商品数量）
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        _count: { select: { products: true } },
        children: {
          include: { _count: { select: { products: true } } },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    })
    const result = categories.map(c => ({
      id: c.id,
      name: c.name,
      image: c.image,
      productCount: c._count.products,
      children: c.children.map(ch => ({
        id: ch.id,
        name: ch.name,
        productCount: ch._count.products,
      })),
    }))
    res.json(result)
  } catch (err) {
    next(err)
  }
}
