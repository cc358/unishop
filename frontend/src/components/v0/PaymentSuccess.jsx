import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function PaymentSuccess() {
  const location = useLocation();
  const { orderId = 'ORD123456789', totalPrice = 337.00 } = location.state || {};
  
  const [showAnimation, setShowAnimation] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // 显示成功动画后显示内容
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 800);

    // 隐藏动画
    const hideTimer = setTimeout(() => {
      setShowAnimation(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-white flex flex-col">
      {/* 成功动画 */}
      <div className={`flex-1 flex flex-col items-center justify-center px-4 transition-opacity duration-500 ${showAnimation ? 'opacity-100' : 'opacity-0 absolute'}`}>
        {/* 成功图标 */}
        <div className="relative mb-6">
          {/* 脉冲环 */}
          <div className="absolute inset-0 rounded-full bg-green-400/30 animate-pulse-ring" />
          <div className="absolute inset-0 rounded-full bg-green-400/20 animate-pulse-ring" style={{ animationDelay: '0.3s' }} />
          
          {/* 主图标 */}
          <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-green-500 flex items-center justify-center animate-scale-in shadow-lg shadow-green-500/30">
            <svg 
              className="w-12 h-12 lg:w-16 lg:h-16 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7"
                style={{
                  strokeDasharray: 30,
                  strokeDashoffset: 30,
                  animation: 'checkDraw 0.5s ease-out 0.3s forwards'
                }}
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          支付成功
        </h1>
        <p className="text-gray-500 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          感谢您的购买
        </p>
      </div>

      {/* 主内容 */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* 订单信息卡片 */}
        <div className="max-w-lg mx-auto w-full px-4 pt-8 lg:pt-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            {/* 成功图标 - 小版本 */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-center text-gray-800 mb-1">支付成功</h2>
            <p className="text-center text-gray-500 mb-6">订单已提交，商家将尽快为您发货</p>

            {/* 订单详情 */}
            <div className="space-y-3 py-4 border-t border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">订单编号</span>
                <span className="text-sm text-gray-800 font-mono">{orderId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">支付金额</span>
                <span className="text-lg font-semibold text-primary">¥{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">支付时间</span>
                <span className="text-sm text-gray-800">
                  {new Date().toLocaleString('zh-CN', { 
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </span>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3 mt-6">
              <Link
                to="/orders"
                className="flex-1 py-3 border-2 border-primary text-primary rounded-xl font-medium text-center hover:bg-primary/5 transition-colors"
              >
                查看订单
              </Link>
              <Link
                to="/"
                className="flex-1 py-3 bg-primary text-white rounded-xl font-medium text-center hover:bg-primary/90 transition-colors"
              >
                继续购物
              </Link>
            </div>
          </div>

          {/* 提示信息 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">温馨提示</h4>
                <p className="text-xs text-blue-600 leading-relaxed">
                  商家发货后，您将收到短信通知。您可以在"我的订单"中查看物流信息，收货后记得确认收货哦~
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 猜你喜欢 */}
        <div className="max-w-lg mx-auto w-full px-4 py-8">
          <h3 className="font-semibold text-gray-800 mb-4">猜你喜欢</h3>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Link key={i} to={`/product/${i}`} className="block group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                  <img
                    src={`https://picsum.photos/200/200?random=${i + 20}`}
                    alt="推荐商品"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-xs text-gray-800 line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                  热销商品推荐款
                </p>
                <p className="text-sm text-primary font-semibold">¥{(Math.random() * 200 + 50).toFixed(0)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
