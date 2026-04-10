const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// 获取用户收货地址列表
router.get('/addresses', authMiddleware, async (req, res, next) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.userId },
    })
    res.json(addresses)
  } catch (err) {
    next(err)
  }
})

// 添加收货地址
router.post('/addresses', authMiddleware, async (req, res, next) => {
  try {
    const { name, phone, detail } = req.body
    const address = await prisma.address.create({
      data: { userId: req.userId, name, phone, detail },
    })
    res.status(201).json(address)
  } catch (err) {
    next(err)
  }
})

module.exports = router
