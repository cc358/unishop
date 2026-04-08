import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loading, ConfirmDialog } from './UIComponents';

// 支付方式配置
const paymentMethods = [
  {
    id: 'alipay',
    name: '支付宝',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#1677FF">
        <path d="M21.422 15.358c-1.385-.539-2.842-1.107-4.3-1.66 1.19-2.057 2.088-4.36 2.621-6.84h-5.407V5.143h6.715V3.857h-6.715V.857h-2.143v3h-6.57v1.286h6.57v1.714H6.57v1.286h9.354c-.486 1.857-1.21 3.62-2.133 5.247a45.473 45.473 0 00-7.97-1.927c-2.362-.357-4.368.45-4.821 2.022-.453 1.571.772 3.405 3.097 4.179 2.928.974 6.263.24 8.547-1.704.853.343 1.705.7 2.545 1.07 3.182 1.398 6.046 2.656 8.153 2.656.772 0 1.38-.163 1.837-.514.743-.57.915-1.585.386-2.682-.53-1.098-2.026-1.893-4.143-2.638zm-12.77 4.278c-2.045 1.454-4.613 1.884-6.494 1.254-1.498-.502-2.186-1.551-1.93-2.451.256-.9 1.404-1.333 2.748-1.133a40.47 40.47 0 016.177 1.563c-.15.265-.32.524-.501.767z"/>
      </svg>
    ),
    description: '推荐使用，支付更快捷'
  },
  {
    id: 'wechat',
    name: '微信支付',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#07C160">
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18z"/>
        <path d="M23.98 14.438c0-3.405-3.265-6.169-7.29-6.169-4.026 0-7.29 2.764-7.29 6.17 0 3.405 3.264 6.168 7.29 6.168.76 0 1.49-.096 2.183-.26a.724.724 0 01.607.077l1.601.935a.273.273 0 00.141.046c.136 0 .245-.11.245-.246 0-.06-.024-.12-.04-.178l-.327-1.233a.497.497 0 01.18-.56c1.542-1.132 2.7-2.805 2.7-4.75zm-9.436-1.19c-.538 0-.974-.444-.974-.99a.98.98 0 01.974-.99c.538 0 .974.444.974.99s-.436.99-.974.99zm4.292 0a.98.98 0 01-.974-.99c0-.546.436-.99.974-.99s.974.444.974.99-.436.99-.974.99z"/>
      </svg>
    ),
    description: '微信安全支付'
  },
  {
    id: 'bank',
    name: '银行卡支付',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#333">
        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
      </svg>
    ),
    description: '支持各大银行储蓄卡/信用卡'
  }
];

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId = 'ORD123456789', totalPrice = 337.00 } = location.state || {};
  
  const [selectedMethod, setSelectedMethod] = useState('alipay');
  const [isPaying, setIsPaying] = useState(false);
  const [countdown, setCountdown] = useState(30 * 60); // 30分钟支付倒计时
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // 倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          navigate('/orders', { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  // 格式化倒计时
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 确认支付
  const handlePay = async () => {
    setIsPaying(true);
    
    // 模拟支付过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsPaying(false);
    // 跳转到支付成功页
    navigate('/payment/success', { 
      state: { 
        orderId,
        totalPrice,
        paymentMethod: selectedMethod
      },
      replace: true
    });
  };

  // 取消支付
  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    navigate('/orders', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading 遮罩 */}
      {isPaying && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl px-8 py-6 flex flex-col items-center gap-3">
            <Loading size="large" />
            <p className="text-sm text-gray-600">正在支付...</p>
          </div>
        </div>
      )}

      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between px-4 lg:px-8 py-3 lg:py-4">
            <button onClick={handleCancel} className="p-1">
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold">收银台</h1>
            <div className="w-6" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 lg:px-8 py-6">
        {/* 支付金额卡片 */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 text-center mb-4">
          <p className="text-sm text-gray-500 mb-2">支付金额</p>
          <p className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            <span className="text-2xl lg:text-3xl">¥</span>{totalPrice.toFixed(2)}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>支付剩余时间 {formatCountdown(countdown)}</span>
          </div>
        </div>

        {/* 订单信息 */}
        <div className="bg-white rounded-2xl p-4 lg:p-5 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">订单编号</span>
            <span className="text-gray-800 font-mono">{orderId}</span>
          </div>
        </div>

        {/* 支付方式选择 */}
        <div className="bg-white rounded-2xl overflow-hidden mb-6">
          <div className="px-4 lg:px-5 py-3 border-b border-gray-100">
            <h3 className="font-medium text-gray-800">选择支付方式</h3>
          </div>
          <div className="p-2 lg:p-3">
            {paymentMethods.map(method => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                  selectedMethod === method.id ? 'bg-primary/5' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex-shrink-0">
                  {method.icon}
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-gray-800">{method.name}</h4>
                  <p className="text-xs text-gray-500">{method.description}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedMethod === method.id ? 'border-primary bg-primary' : 'border-gray-300'
                }`}>
                  {selectedMethod === method.id && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 支付按钮 */}
        <button
          onClick={handlePay}
          disabled={isPaying}
          className="w-full py-4 bg-primary text-white rounded-2xl font-semibold text-lg hover:bg-primary/90 disabled:bg-primary/50 transition-colors"
        >
          确认支付
        </button>

        {/* 支付提示 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            支付即表示您已阅读并同意
            <span className="text-primary">《支付服务协议》</span>
          </p>
        </div>
      </div>

      {/* 取消支付确认弹窗 */}
      <ConfirmDialog
        visible={showCancelConfirm}
        title="确认取消支付？"
        message="取消后订单将保留30分钟，您可以在订单列表中继续支付"
        confirmText="继续支付"
        cancelText="确认取消"
        onConfirm={() => setShowCancelConfirm(false)}
        onCancel={confirmCancel}
      />
    </div>
  );
}
