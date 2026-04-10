import { create } from 'zustand'
import * as cartApi from '../api/cart'

export const useCartStore = create((set, get) => ({
  items: [],
  loading: false,

  // 从 API 加载购物车（合并本地 eBay 商品）
  fetchCart: async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    set({ loading: true })
    try {
      const data = await cartApi.getCart()
      const serverItems = data.map(item => ({
        cartItemId: item.id,
        id: item.productId,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        stock: item.product.stock,
        quantity: item.quantity,
        selected: item.selected,
        source: 'local',
      }))
      // 合并本地 eBay 商品
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]')
      const localEbayItems = localCart.filter(i => i.source === 'ebay' || (typeof i.id === 'string' && i.id.includes('v1|')))
      const merged = [...serverItems, ...localEbayItems]
      set({ items: merged, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  // 添加商品
  addItem: async (product) => {
    const isEbay = product.source === 'ebay' || (typeof product.id === 'string' && product.id.includes('v1|'))
    const token = localStorage.getItem('token')

    // eBay 商品或未登录：本地存储
    if (isEbay || !token) {
      set((state) => {
        const existing = state.items.find((i) => i.id === product.id)
        const newItems = existing
          ? state.items.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + (product.quantity || 1) } : i)
          : [...state.items, { ...product, quantity: product.quantity || 1, selected: true }]
        localStorage.setItem('cart', JSON.stringify(newItems))
        return { items: newItems }
      })
      return
    }
    try {
      await cartApi.addToCart(product.id, product.quantity || 1)
      await get().fetchCart()
    } catch {}
  },

  // 删除商品
  removeItem: async (id) => {
    const item = get().items.find(i => i.id === id)
    if (item?.cartItemId) {
      try {
        await cartApi.deleteCartItem(item.cartItemId)
        await get().fetchCart()
      } catch {}
    } else {
      set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
    }
  },

  // 更新数量
  updateQuantity: async (id, quantity) => {
    if (quantity <= 0) return get().removeItem(id)
    const item = get().items.find(i => i.id === id)
    if (item?.cartItemId) {
      try {
        await cartApi.updateCartItem(item.cartItemId, { quantity })
        set((state) => ({
          items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
        }))
      } catch {}
    } else {
      set((state) => ({
        items: state.items.map((i) => i.id === id ? { ...i, quantity } : i)
      }))
    }
  },

  // 切换选中
  toggleSelect: async (id) => {
    const item = get().items.find(i => i.id === id)
    if (item?.cartItemId) {
      try {
        await cartApi.updateCartItem(item.cartItemId, { selected: !item.selected })
      } catch {}
    }
    set((state) => ({
      items: state.items.map(i => i.id === id ? { ...i, selected: !i.selected } : i)
    }))
  },

  // 全选/取消全选
  toggleSelectAll: (selected) => {
    set((state) => ({
      items: state.items.map(i => ({ ...i, selected }))
    }))
  },

  // 获取选中商品
  getSelectedItems: () => get().items.filter(i => i.selected),

  // 计算总价
  total: () => {
    return get().items.filter(i => i.selected).reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)
  },

  // 清空购物车
  clearCart: async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try { await cartApi.clearCart() } catch {}
    }
    set({ items: [] })
  },
}))
