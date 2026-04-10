const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/auth')

// 注册
router.post('/register', authController.register)

// 登录
router.post('/login', authController.login)

// 获取当前用户信息（需登录）
router.get('/profile', authMiddleware, authController.getProfile)

module.exports = router
