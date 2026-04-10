import api from './index'

export const getCart = () => api.get('/cart')
export const addToCart = (productId, quantity = 1) => api.post('/cart/add', { productId, quantity })
export const updateCartItem = (id, data) => api.put(`/cart/${id}`, data)
export const deleteCartItem = (id) => api.delete(`/cart/${id}`)
export const clearCart = () => api.delete('/cart')
