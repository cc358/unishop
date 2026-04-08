import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../stores/useCartStore'
import { createOrder } from '../api/order'

// 结算页
function Checkout() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCartStore()
  const [address, setAddress] = useState({ name: '', phone: '', detail: '' })
  const [payMethod, setPayMethod] = useState('stripe')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const order = await createOrder({
        items,
        address,
        payMethod,
        totalAmount: total(),
      })
      clearCart()
      navigate(`/orders/${order.id}`)
    } catch (err) {
      alert('下单失败：' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">确认订单</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 收货地址 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="font-semibold mb-3">收货信息</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="收货人姓名"
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
            <input
              type="tel"
              placeholder="手机号码"
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
            <textarea
              placeholder="详细地址"
              value={address.detail}
              onChange={(e) => setAddress({ ...address, detail: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              rows={2}
              required
            />
          </div>
        </div>

        {/* 支付方式 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="font-semibold mb-3">支付方式</h2>
          <div className="space-y-2">
            {[
              { value: 'stripe', label: '信用卡 (Stripe)' },
              { value: 'usdt', label: 'USDT 加密支付' },
            ].map((method) => (
              <label key={method.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payMethod"
                  value={method.value}
                  checked={payMethod === method.value}
                  onChange={(e) => setPayMethod(e.target.value)}
                />
                <span>{method.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 订单汇总 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="font-semibold mb-3">订单商品</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
              <span>{item.name} × {item.quantity}</span>
              <span>¥{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 font-bold">
            <span>合计</span>
            <span className="text-red-500">¥{total()}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {submitting ? '提交中...' : '提交订单'}
        </button>
      </form>
    </div>
  )
}

export default Checkout
