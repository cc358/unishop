import api from './index'

// 创建订单
export const createOrder = (data) => api.post('/orders', data)

// 获取订单列表
export const getOrders = () => api.get('/orders')

// 获取订单详情
export const getOrder = (id) => api.get(`/orders/${id}`)
