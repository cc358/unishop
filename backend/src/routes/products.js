const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')

// 获取分类列表
router.get('/categories', productController.getCategories)

// 获取商品列表
router.get('/', productController.getProducts)

// 获取商品详情
router.get('/:id', productController.getProduct)

module.exports = router
