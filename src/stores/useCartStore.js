import { create } from 'zustand'

// 购物车状态管理
export const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('cart') || '[]'),

  // 添加商品
  addItem: (product) => {
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id)
      let newItems
      if (existing) {
        newItems = state.items.map((i) =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + (product.quantity || 1) }
            : i
        )
      } else {
        newItems = [...state.items, { ...product, quantity: product.quantity || 1 }]
      }
      localStorage.setItem('cart', JSON.stringify(newItems))
      return { items: newItems }
    })
  },

  // 删除商品
  removeItem: (id) => {
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== id)
      localStorage.setItem('cart', JSON.stringify(newItems))
      return { items: newItems }
    })
  },

  // 更新数量
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) return get().removeItem(id)
    set((state) => {
      const newItems = state.items.map((i) =>
        i.id === id ? { ...i, quantity } : i
      )
      localStorage.setItem('cart', JSON.stringify(newItems))
      return { items: newItems }
    })
  },

  // 计算总价
  total: () => {
    const items = get().items
    return items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)
  },

  // 清空购物车
  clearCart: () => {
    localStorage.removeItem('cart')
    set({ items: [] })
  },
}))
