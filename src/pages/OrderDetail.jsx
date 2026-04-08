import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getOrder } from '../api/order'
import Loading from '../components/common/Loading'

// 订单详情页
function OrderDetail() {
  const { id } = useParams()

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(id),
  })

  if (isLoading) return <Loading />
  if (!order) return <div className="text-center py-20">订单不存在</div>

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">订单详情</h1>

      <div className="space-y-4">
        {/* 订单状态 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">订单号：{order.id}</p>
          <p className="text-lg font-semibold mt-1">状态：{order.status}</p>
          <p className="text-sm text-gray-500 mt-1">
            下单时间：{new Date(order.createdAt).toLocaleString('zh-CN')}
          </p>
        </div>

        {/* 商品列表 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="font-semibold mb-3">商品信息</h2>
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-2 border-b last:border-0">
              <img
                src={item.image || '/placeholder.png'}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">× {item.quantity}</p>
              </div>
              <p className="font-bold">¥{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="flex justify-between pt-3 font-bold text-lg">
            <span>合计</span>
            <span className="text-red-500">¥{order.totalAmount}</span>
          </div>
        </div>

        {/* 收货信息 */}
        {order.address && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold mb-2">收货信息</h2>
            <p>{order.address.name} {order.address.phone}</p>
            <p className="text-gray-600">{order.address.detail}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDetail
