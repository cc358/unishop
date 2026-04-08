import api from './index'

// 获取商品列表
export const getProducts = (params) => api.get('/products', { params })

// 获取商品详情
export const getProduct = (id) => api.get(`/products/${id}`)

// 获取分类列表
export const getCategories = () => api.get('/products/categories')
