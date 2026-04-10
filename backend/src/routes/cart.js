const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartController')
const authMiddleware = require('../middleware/auth')

router.use(authMiddleware)

router.get('/', cartController.getCart)
router.post('/add', cartController.addToCart)
router.put('/:id', cartController.updateCartItem)
router.delete('/:id', cartController.deleteCartItem)
router.delete('/', cartController.clearCart)

module.exports = router
