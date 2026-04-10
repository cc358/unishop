const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./src/routes/auth')
const productRoutes = require('./src/routes/products')
const orderRoutes = require('./src/routes/orders')
const userRoutes = require('./src/routes/users')
const cartRoutes = require('./src/routes/cart')
const ebayRoutes = require('./src/routes/ebay')
const adminRoutes = require('./src/routes/admin')
const sellerRoutes = require('./src/routes/sellers')
const errorHandler = require('./src/middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json())

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/users', userRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/ebay', ebayRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/sellers', sellerRoutes)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// 错误处理
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`UniShop API 运行在 http://localhost:${PORT}`)
})
