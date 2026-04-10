import api from './index'

// 登录
export const login = (data) => api.post('/auth/login', data)

// 注册
export const register = (data) => api.post('/auth/register', data)

// 获取当前用户信息
export const getProfile = () => api.get('/auth/profile')
