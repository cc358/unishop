import { Link } from 'react-router-dom'
import { Trash2, Minus, Plus } from 'lucide-react'
import { useCartStore } from '../stores/useCartStore'
import Empty from '../components/common/Empty'

// 购物车页
function Cart() {
  const { items, removeItem, updateQuantity, total } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <Empty message="购物车空空如也" />
        <div className="text-center mt-4">
          <Link to="/products" className="text-indigo-600 hover:underline">
            去逛逛
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">购物车</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-4 flex items-center gap-4 shadow-sm">
            <img
              src={item.image || '/placeholder.png'}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-red-500 font-bold">¥{item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-7 h-7 flex items-center justify-center border rounded"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center border rounded"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* 结算栏 */}
      <div className="mt-6 bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-gray-600">合计：</span>
          <span className="text-2xl font-bold text-red-500">¥{total()}</span>
        </div>
        <Link
          to="/checkout"
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          去结算
        </Link>
      </div>
    </div>
  )
}

export default Cart
