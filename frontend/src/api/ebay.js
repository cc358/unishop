import api from './index'

export const searchProducts = (keyword, limit = 20) =>
  api.get('/ebay/search', { params: { q: keyword, limit } })

export const getProductDetail = (itemId) =>
  api.get(`/ebay/product/${itemId}`)
