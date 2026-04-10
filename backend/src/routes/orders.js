const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')
const authMiddleware = require('../middleware/auth')

// 所有订单接口都需要登录
router.use(authMiddleware)

// 创建订单
router.post('/', orderController.createOrder)

// 获取订单列表
router.get('/', orderController.getOrders)

// 获取订单详情
router.get('/:id', orderController.getOrder)

module.exports = router
