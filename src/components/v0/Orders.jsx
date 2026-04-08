import { useState } from 'react';
import { Link } from 'react-router-dom';

// 订单状态配置
const ORDER_STATUS = {
  all: { label: '全部', value: 'all' },
  pending: { label: '待付款', value: 'pending', color: 'text-primary' },
  paid: { label: '待发货', value: 'paid', color: 'text-blue-500' },
  shipped: { label: '待收货', value: 'shipped', color: 'text-green-500' },
  completed: { label: '已完成', value: 'completed', color: 'text-gray-500' },
  cancelled: { label: '已取消', value: 'cancelled', color: 'text-gray-400' }
};

// 模拟订单数据
const mockOrders = [
  {
    id: '202403150001',
    status: 'pending',
    shopName: 'UniShop 官方旗舰店',
    shopId: 1,
    items: [
      {
        id: 101,
        name: '简约纯棉T恤 舒适透气 2024新款',
        image: 'https://picsum.photos/200/200?random=1',
        spec: '白色 / M',
        price: 89.00,
        quantity: 2
      },
      {
        id: 102,
        name: '休闲运动裤 宽松版型 百搭款',
        image: 'https://picsum.photos/200/200?random=2',
        spec: '黑色 / L',
        price: 159.00,
        quantity: 1
      }
    ],
    totalPrice: 337.00,
    freight: 0,
    createTime: '2024-03-15 14:30:25',
    expireTime: '2024-03-15 15:00:25'
  },
  {
    id: '202403140002',
    status: 'shipped',
    shopName: '时尚潮流店',
    shopId: 2,
    items: [
      {
        id: 201,
        name: '复古帆布鞋 经典款式 男女同款',
        image: 'https://picsum.photos/200/200?random=3',
        spec: '米白色 / 42',
        price: 199.00,
        quantity: 1
      }
    ],
    totalPrice: 199.00,
    freight: 10.00,
    createTime: '2024-03-14 10:15:00',
    logistics: {
      company: '顺丰速运',
      number: 'SF1234567890',
      status: '运输中',
      updateTime: '2024-03-15 08:30:00'
    }
  },
  {
    id: '202403130003',
    status: 'completed',
    shopName: 'UniShop 官方旗舰店',
    shopId: 1,
    items: [
      {
        id: 103,
        name: '经典牛仔外套 修身版型',
        image: 'https://picsum.photos/200/200?random=4',
        spec: '深蓝色 / L',
        price: 299.00,
        quantity: 1
      }
    ],
    totalPrice: 299.00,
    freight: 0,
    createTime: '2024-03-13 16:45:00',
    completedTime: '2024-03-14 12:00:00'
  },
  {
    id: '202403120004',
    status: 'cancelled',
    shopName: '运动专营店',
    shopId: 3,
    items: [
      {
        id: 301,
        name: '专业跑步鞋 缓震透气',
        image: 'https://picsum.photos/200/200?random=5',
        spec: '黑红色 / 43',
        price: 459.00,
        quantity: 1
      }
    ],
    totalPrice: 459.00,
    freight: 0,
    createTime: '2024-03-12 09:20:00',
    cancelReason: '买家取消'
  }
];

// 订单项组件
function OrderItem({ item }) {
  return (
    <Link
      to={`/product/${item.id}`}
      className="flex gap-3 py-3 border-b border-gray-50 last:border-b-0"
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm text-gray-800 line-clamp-2 leading-tight mb-1">
          {item.name}
        </h4>
        <p className="text-xs text-gray-500 mb-2">{item.spec}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-800">¥{item.price.toFixed(2)}</span>
          <span className="text-xs text-gray-500">x{item.quantity}</span>
        </div>
      </div>
    </Link>
  );
}

// 订单卡片组件
function OrderCard({ order, onAction }) {
  const statusConfig = ORDER_STATUS[order.status];
  
  // 获取操作按钮
  const getActions = () => {
    switch (order.status) {
      case 'pending':
        return [
          { label: '取消订单', type: 'cancel', style: 'border border-gray-200 text-gray-600' },
          { label: '去支付', type: 'pay', style: 'bg-primary text-white' }
        ];
      case 'paid':
        return [
          { label: '提醒发货', type: 'remind', style: 'border border-gray-200 text-gray-600' }
        ];
      case 'shipped':
        return [
          { label: '查看物流', type: 'logistics', style: 'border border-gray-200 text-gray-600' },
          { label: '确认收货', type: 'confirm', style: 'bg-primary text-white' }
        ];
      case 'completed':
        return [
          { label: '删除订单', type: 'delete', style: 'border border-gray-200 text-gray-600' },
          { label: '再次购买', type: 'rebuy', style: 'border border-primary text-primary' },
          { label: '评价', type: 'review', style: 'bg-primary text-white' }
        ];
      case 'cancelled':
        return [
          { label: '删除订单', type: 'delete', style: 'border border-gray-200 text-gray-600' },
          { label: '再次购买', type: 'rebuy', style: 'border border-primary text-primary' }
        ];
      default:
        return [];
    }
  };

  const actions = getActions();
  const itemsTotal = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-xl mb-3 overflow-hidden">
      {/* 店铺头部 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <Link to={`/shop/${order.shopId}`} className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-sm font-medium text-gray-800">{order.shopName}</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <span className={`text-sm font-medium ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      </div>

      {/* 商品列表 */}
      <Link to={`/order/${order.id}`} className="block px-4">
        {order.items.slice(0, 2).map(item => (
          <OrderItem key={item.id} item={item} />
        ))}
        {order.items.length > 2 && (
          <div className="py-2 text-center text-xs text-gray-500">
            查看全部 {order.items.length} 件商品
          </div>
        )}
      </Link>

      {/* 物流信息 */}
      {order.logistics && (
        <div className="mx-4 mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs text-gray-600">
              {order.logistics.company}: {order.logistics.status}
            </span>
          </div>
        </div>
      )}

      {/* 订单金额 */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {itemsTotal} 件商品</span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-gray-600">实付款:</span>
            <span className="text-lg font-semibold text-gray-800">
              ¥{(order.totalPrice + order.freight).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      {actions.length > 0 && (
        <div className="flex items-center justify-end gap-3 px-4 pb-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => onAction(order.id, action.type)}
              className={`px-4 py-1.5 rounded-full text-sm ${action.style}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// 空订单状态
function EmptyOrders({ status }) {
  const messages = {
    all: '暂无订单',
    pending: '暂无待付款订单',
    paid: '暂无待发货订单',
    shipped: '暂无待收货订单',
    completed: '暂无已完成订单'
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <p className="text-gray-500 mb-4">{messages[status] || messages.all}</p>
      <Link
        to="/"
        className="px-6 py-2 bg-primary text-white rounded-full text-sm font-medium"
      >
        去逛逛
      </Link>
    </div>
  );
}

export default function Orders() {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState(mockOrders);

  // 过滤订单
  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(order => order.status === activeTab);

  // 处理订单操作
  const handleAction = (orderId, actionType) => {
    console.log(`订单 ${orderId} 执行操作: ${actionType}`);
    
    switch (actionType) {
      case 'cancel':
        setOrders(prev => prev.map(order =>
          order.id === orderId ? { ...order, status: 'cancelled', cancelReason: '买家取消' } : order
        ));
        break;
      case 'confirm':
        setOrders(prev => prev.map(order =>
          order.id === orderId ? { ...order, status: 'completed' } : order
        ));
        break;
      case 'delete':
        setOrders(prev => prev.filter(order => order.id !== orderId));
        break;
      case 'pay':
        // 跳转支付页面
        window.location.href = `/checkout?order=${orderId}`;
        break;
      case 'logistics':
        // 跳转物流详情
        window.location.href = `/logistics/${orderId}`;
        break;
      case 'rebuy':
        // 加入购物车
        console.log('再次购买');
        break;
      case 'review':
        // 跳转评价页
        window.location.href = `/review/${orderId}`;
        break;
      default:
        break;
    }
  };

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待付款' },
    { key: 'paid', label: '待发货' },
    { key: 'shipped', label: '待收货' },
    { key: 'completed', label: '已完成' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/profile" className="p-1">
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold">我的订单</h1>
          <button className="p-1 text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* 标签页 */}
        <div className="flex border-b border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-sm font-medium relative transition-colors ${
                activeTab === tab.key ? 'text-primary' : 'text-gray-600'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="px-3 py-3">
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="搜索订单"
            className="flex-1 text-sm outline-none placeholder-gray-400"
          />
        </div>
      </div>

      {/* 订单列表 */}
      <div className="px-3 pb-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onAction={handleAction}
            />
          ))
        ) : (
          <EmptyOrders status={activeTab} />
        )}
      </div>
    </div>
  );
}
