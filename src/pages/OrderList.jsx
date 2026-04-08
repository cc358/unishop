import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getOrders } from '../api/order'
import Loading from '../components/common/Loading'
import Empty from '../components/common/Empty'

// 订单状态映射
const statusMap = {
  pending: { text: '待付款', color: 'text-yellow-600' },
  paid: { text: '已付款', color: 'text-green-600' },
  shipped: { text: '已发货', color: 'text-blue-600' },
  completed: { text: '已完成', color: 'text-gray-600' },
  cancelled: { text: '已取消', color: 'text-red-600' },
}

function OrderList() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  })

  if (isLoading) return <Loading />

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">我的订单</h1>

      {orders.length === 0 ? (
        <Empty message="暂无订单" />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusMap[order.status] || statusMap.pending
            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block bg-white rounded-lg p-4 shadow-sm hover:shadow transition"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">订单号：{order.id}</span>
                  <span className={`text-sm font-semibold ${status.color}`}>
                    {status.text}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{order.items?.length || 0} 件商品</span>
                  <span className="font-bold">¥{order.totalAmount}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OrderList
