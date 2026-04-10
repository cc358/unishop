import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ConfirmDialog, Drawer, Loading } from './UIComponents';
import { createOrder } from '../../api/order';
import { useCartStore } from '../../stores/useCartStore';
import api from '../../api/index';

// 模拟收货地址
const mockAddresses = [
  {
    id: 1,
    name: '张三',
    phone: '138****8888',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detail: '科技园路100号腾讯大厦',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '139****9999',
    province: '北京市',
    city: '北京市',
    district: '海淀区',
    detail: '中关村大街1号',
    isDefault: false
  }
];

// 模拟订单商品
const mockOrderItems = [
  {
    id: 101,
    shopId: 1,
    shopName: 'UniShop 官方旗舰店',
    name: '简约纯棉T恤 舒适透气 2024新款',
    image: 'https://picsum.photos/200/200?random=1',
    spec: '白色 / M',
    price: 89.00,
    quantity: 2
  },
  {
    id: 102,
    shopId: 1,
    shopName: 'UniShop 官方旗舰店',
    name: '休闲运动裤 宽松版型 百搭款',
    image: 'https://picsum.photos/200/200?random=2',
    spec: '黑色 / L',
    price: 159.00,
    quantity: 1
  }
];

// 优惠券数据
const mockCoupons = [
  { id: 1, name: '满200减20', threshold: 200, discount: 20, type: 'full' },
  { id: 2, name: '满300减50', threshold: 300, discount: 50, type: 'full' },
  { id: 3, name: '9折优惠券', discount: 0.9, type: 'percent' }
];

// 地址选择组件
function AddressCard({ address, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
        selected ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium text-gray-800">{address.name}</span>
        <span className="text-sm text-gray-500">{address.phone}</span>
        {address.isDefault && (
          <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">默认</span>
        )}
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">
        {address.province} {address.city} {address.district} {address.detail}
      </p>
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const clearCart = useCartStore(s => s.clearCart);
  const [addresses, setAddresses] = useState(mockAddresses);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const passedItems = location.state?.items || [];
  const [orderItems] = useState(
    passedItems.length > 0 ? passedItems.map(item => ({
      id: item.id, shopId: 1, shopName: 'UniShop 官方旗舰店',
      name: item.name, image: item.image, spec: item.spec || '',
      price: item.price, quantity: item.quantity,
    })) : mockOrderItems
  );

  useEffect(() => {
    api.get('/users/addresses').then(data => {
      if (data.length > 0) {
        const mapped = data.map(a => ({
          id: a.id, name: a.name, phone: a.phone,
          province: '', city: '', district: '', detail: a.detail, isDefault: false
        }));
        setAddresses(mapped);
        setSelectedAddress(mapped[0]);
      } else {
        setSelectedAddress(addresses[0]);
      }
    }).catch(() => {
      setSelectedAddress(addresses[0]);
    });
  }, []);
  const [remark, setRemark] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showAddressDrawer, setShowAddressDrawer] = useState(false);
  const [showCouponDrawer, setShowCouponDrawer] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 判断是否有 eBay 商品
  const hasEbayItems = orderItems.some(item => item.source === 'ebay' || item.ebayItemId);
  const currencySymbol = hasEbayItems ? '$' : '¥';

  // 计算价格
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freight = hasEbayItems ? 0 : (subtotal >= 99 ? 0 : 10);
  
  let couponDiscount = 0;
  if (selectedCoupon) {
    if (selectedCoupon.type === 'full' && subtotal >= selectedCoupon.threshold) {
      couponDiscount = selectedCoupon.discount;
    } else if (selectedCoupon.type === 'percent') {
      couponDiscount = subtotal * (1 - selectedCoupon.discount);
    }
  }
  
  const totalPrice = subtotal + freight - couponDiscount;
  const totalCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  // 提交订单
  const handleSubmit = () => {
    if (!selectedAddress) {
      alert('请选择收货地址');
      return;
    }
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);

    try {
      const order = await createOrder({
        items: orderItems.map(item => ({
          id: item.id, name: item.name, price: item.price,
          quantity: item.quantity, image: item.image || '',
          ebayItemId: item.ebayItemId || null,
          source: item.source || 'local',
          currency: item.currency || 'USD',
        })),
        address: {
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          detail: `${selectedAddress.province}${selectedAddress.city}${selectedAddress.district}${selectedAddress.detail}`,
        },
        payMethod: 'online',
        totalAmount: totalPrice,
      });
      await clearCart();
      setIsSubmitting(false);
      navigate('/payment', {
        state: { orderId: order.id, totalPrice }
      });
    } catch (err) {
      setIsSubmitting(false);
      alert(err.message || '下单失败');
    }
  };

  // 可用优惠券
  const availableCoupons = mockCoupons.filter(c => 
    c.type === 'percent' || (c.type === 'full' && subtotal >= c.threshold)
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-32 lg:pb-8">
      {/* Loading 遮罩 */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl px-8 py-6 flex flex-col items-center gap-3">
            <Loading size="large" />
            <p className="text-sm text-gray-600">正在提交订单...</p>
          </div>
        </div>
      )}

      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between px-4 lg:px-8 py-3 lg:py-4">
            <button onClick={() => navigate(-1)} className="p-1">
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold">确认订单</h1>
            <div className="w-6" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 lg:px-8 py-3 lg:py-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* 左侧内容 */}
          <div className="lg:col-span-2 space-y-3 lg:space-y-4">
            {/* 收货地址 */}
            <div 
              onClick={() => setShowAddressDrawer(true)}
              className="bg-white rounded-xl p-4 lg:p-5 cursor-pointer hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {selectedAddress ? (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800">{selectedAddress.name}</span>
                      <span className="text-sm text-gray-500">{selectedAddress.phone}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {selectedAddress.province} {selectedAddress.city} {selectedAddress.district} {selectedAddress.detail}
                    </p>
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className="text-gray-500">请选择收货地址</p>
                  </div>
                )}
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* 商品列表 */}
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="px-4 lg:px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium text-gray-800 text-sm lg:text-base">UniShop 官方旗舰店</span>
              </div>
              <div className="p-4 lg:p-5 space-y-4">
                {orderItems.map(item => (
                  <div key={item.id} className="flex gap-3 lg:gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm lg:text-base text-gray-800 line-clamp-2 leading-tight mb-1">
                        {item.name}
                      </h4>
                      <p className="text-xs lg:text-sm text-gray-500 mb-2">{item.spec}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-medium">{currencySymbol}{item.price.toFixed(2)}</span>
                        <span className="text-sm text-gray-500">x{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 优惠券 */}
            <div 
              onClick={() => setShowCouponDrawer(true)}
              className="bg-white rounded-xl p-4 lg:p-5 cursor-pointer hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span className="text-sm lg:text-base text-gray-800">优惠券</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedCoupon ? (
                    <span className="text-primary font-medium">-¥{couponDiscount.toFixed(2)}</span>
                  ) : availableCoupons.length > 0 ? (
                    <span className="text-sm text-primary">{availableCoupons.length}张可用</span>
                  ) : (
                    <span className="text-sm text-gray-400">暂无可用</span>
                  )}
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 订单备注 */}
            <div className="bg-white rounded-xl p-4 lg:p-5">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-sm lg:text-base text-gray-800">订单备注</span>
              </div>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="选填，请输入您的特殊需求"
                className="w-full p-3 bg-gray-50 rounded-lg text-sm outline-none resize-none h-20 placeholder-gray-400 focus:bg-gray-100 transition-colors"
                maxLength={200}
              />
              <p className="text-xs text-gray-400 text-right mt-1">{remark.length}/200</p>
            </div>
          </div>

          {/* 右侧结算卡片 - PC端 */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-xl p-5 sticky top-20">
              <h3 className="font-semibold text-lg mb-4 pb-4 border-b border-gray-100">订单金额</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">商品金额</span>
                  <span className="text-gray-800">{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">运费</span>
                  <span className="text-gray-800">{freight === 0 ? '免运费' : `¥${freight.toFixed(2)}`}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">优惠券</span>
                    <span className="text-red-500">-¥{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-baseline pt-4 border-t border-gray-100 mb-6">
                <span className="text-gray-600">应付总额:</span>
                <span className="text-2xl font-bold text-primary">{currencySymbol}{totalPrice.toFixed(2)}</span>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                提交订单
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 底部结算栏 - 移动端 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 lg:hidden safe-area-inset-bottom">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 mb-1">共 {totalCount} 件，合计:</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-primary">{currencySymbol}{totalPrice.toFixed(2)}</span>
              {couponDiscount > 0 && (
                <span className="text-xs text-red-500">已优惠¥{couponDiscount.toFixed(2)}</span>
              )}
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors"
          >
            提交订单
          </button>
        </div>
      </div>

      {/* 地址选择抽屉 */}
      <Drawer
        visible={showAddressDrawer}
        position="bottom"
        title="选择收货地址"
        onClose={() => setShowAddressDrawer(false)}
      >
        <div className="p-4 space-y-3 max-h-[60vh] overflow-auto">
          {addresses.map(address => (
            <AddressCard
              key={address.id}
              address={address}
              selected={selectedAddress?.id === address.id}
              onClick={() => {
                setSelectedAddress(address);
                setShowAddressDrawer(false);
              }}
            />
          ))}
          <Link
            to="/address/add"
            className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-primary hover:text-primary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>新增收货地址</span>
          </Link>
        </div>
      </Drawer>

      {/* 优惠券选择抽屉 */}
      <Drawer
        visible={showCouponDrawer}
        position="bottom"
        title="选择优惠券"
        onClose={() => setShowCouponDrawer(false)}
      >
        <div className="p-4 space-y-3 max-h-[60vh] overflow-auto">
          {/* 不使用优惠券 */}
          <div
            onClick={() => {
              setSelectedCoupon(null);
              setShowCouponDrawer(false);
            }}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              !selectedCoupon ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <span className="text-gray-600">不使用优惠券</span>
          </div>
          
          {availableCoupons.map(coupon => (
            <div
              key={coupon.id}
              onClick={() => {
                setSelectedCoupon(coupon);
                setShowCouponDrawer(false);
              }}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedCoupon?.id === coupon.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-primary">{coupon.name}</span>
                  {coupon.type === 'full' && (
                    <p className="text-xs text-gray-500 mt-1">满{coupon.threshold}元可用</p>
                  )}
                </div>
                {selectedCoupon?.id === coupon.id && (
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          ))}
          
          {availableCoupons.length === 0 && (
            <div className="py-10 text-center text-gray-400">
              暂无可用优惠券
            </div>
          )}
        </div>
      </Drawer>

      {/* 确认提交弹窗 */}
      <ConfirmDialog
        visible={showConfirm}
        title="确认提交订单"
        message={`共 ${totalCount} 件商品，实付 ¥${totalPrice.toFixed(2)}`}
        confirmText="确认提交"
        onConfirm={confirmSubmit}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
