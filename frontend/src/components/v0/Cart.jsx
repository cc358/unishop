import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ConfirmDialog, Drawer } from './UIComponents';
import { useCartStore } from '../../stores/useCartStore';

// 模拟购物车数据
const mockCartData = [
  {
    id: 1,
    shopId: 1,
    shopName: 'UniShop 官方旗舰店',
    items: [
      {
        id: 101,
        name: '简约纯棉T恤 舒适透气 2024新款',
        image: 'https://picsum.photos/200/200?random=1',
        price: 89.00,
        originalPrice: 129.00,
        spec: '白色 / M',
        quantity: 2,
        stock: 99,
        selected: true
      },
      {
        id: 102,
        name: '休闲运动裤 宽松版型 百搭款',
        image: 'https://picsum.photos/200/200?random=2',
        price: 159.00,
        originalPrice: 219.00,
        spec: '黑色 / L',
        quantity: 1,
        stock: 50,
        selected: true
      }
    ]
  },
  {
    id: 2,
    shopId: 2,
    shopName: '时尚潮流店',
    items: [
      {
        id: 201,
        name: '复古帆布鞋 经典款式 男女同款',
        image: 'https://picsum.photos/200/200?random=3',
        price: 199.00,
        originalPrice: 299.00,
        spec: '米白色 / 42',
        quantity: 1,
        stock: 20,
        selected: false
      }
    ]
  }
];

function CartItem({ item, onSelect, onQuantityChange, onDelete }) {
  const [isChanging, setIsChanging] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    setIsChanging(true);
    onQuantityChange(item.id, newQuantity);
    setTimeout(() => setIsChanging(false), 200);
  };

  return (
    <div className="flex items-start gap-3 lg:gap-4 py-4 border-b border-gray-100 last:border-b-0">
      {/* 选择框 */}
      <button
        onClick={() => onSelect(item.id)}
        className="flex-shrink-0 mt-4 lg:mt-6"
      >
        <div className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          item.selected ? 'bg-primary border-primary scale-110' : 'border-gray-300'
        }`}>
          {item.selected && (
            <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </button>

      {/* 商品图片 */}
      <Link to={`/product/${item.id}`} className="flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 lg:w-28 lg:h-28 object-cover rounded-lg"
        />
      </Link>

      {/* 商品信息 */}
      <div className="flex-1 min-w-0 lg:flex lg:items-center lg:justify-between">
        <div className="lg:flex-1 lg:pr-8">
          <Link to={`/product/${item.id}`}>
            <h4 className="text-sm lg:text-base text-gray-800 line-clamp-2 leading-tight mb-1 lg:mb-2 hover:text-primary transition-colors">
              {item.name}
            </h4>
          </Link>
          <p className="text-xs lg:text-sm text-gray-500 mb-2 lg:mb-0">{item.spec}</p>
          
          {/* 移动端价格和数量 */}
          <div className="flex items-center justify-between lg:hidden">
            <div className="flex items-baseline gap-1">
              <span className="text-primary font-semibold">¥{item.price.toFixed(2)}</span>
              {item.originalPrice > item.price && (
                <span className="text-xs text-gray-400 line-through">¥{item.originalPrice.toFixed(2)}</span>
              )}
            </div>

            {/* 数量选择器 */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-7 h-7 flex items-center justify-center text-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed active:bg-gray-100 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className={`w-8 text-center text-sm transition-transform ${isChanging ? 'scale-110' : ''}`}>
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= item.stock}
                className="w-7 h-7 flex items-center justify-center text-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed active:bg-gray-100 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* PC端：价格列 */}
        <div className="hidden lg:flex lg:items-center lg:gap-12">
          <div className="w-28 text-center">
            <span className="text-primary font-semibold text-lg">¥{item.price.toFixed(2)}</span>
            {item.originalPrice > item.price && (
              <p className="text-xs text-gray-400 line-through">¥{item.originalPrice.toFixed(2)}</p>
            )}
          </div>

          {/* PC端数量选择器 */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed active:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className={`w-12 text-center font-medium transition-transform ${isChanging ? 'scale-110' : ''}`}>
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed active:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* PC端小计 */}
          <div className="w-28 text-center">
            <span className={`font-semibold text-gray-800 transition-all ${isChanging ? 'text-primary scale-105' : ''}`}>
              ¥{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>

          {/* PC端删除按钮 */}
          <button
            onClick={() => onDelete(item)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* 移动端删除按钮 */}
      <button
        onClick={() => onDelete(item)}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors lg:hidden"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

function ShopGroup({ shop, onSelectShop, onSelectItem, onQuantityChange, onDeleteItem }) {
  const allSelected = shop.items.every(item => item.selected);
  const someSelected = shop.items.some(item => item.selected);

  return (
    <div className="bg-white rounded-xl mb-3 lg:mb-4 overflow-hidden lg:shadow-sm">
      {/* 店铺头部 */}
      <div className="flex items-center gap-3 px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-100">
        <button
          onClick={() => onSelectShop(shop.shopId, !allSelected)}
          className="flex-shrink-0"
        >
          <div className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            allSelected ? 'bg-primary border-primary scale-110' : someSelected ? 'bg-primary/50 border-primary/50' : 'border-gray-300'
          }`}>
            {(allSelected || someSelected) && (
              <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </button>
        <Link to={`/shop/${shop.shopId}`} className="flex items-center gap-2 hover:text-primary transition-colors">
          <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="font-medium text-sm lg:text-base text-gray-800">{shop.shopName}</span>
        </Link>
        <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* PC端表头 */}
      <div className="hidden lg:flex items-center px-6 py-3 bg-gray-50 text-sm text-gray-500">
        <div className="flex-1 pl-14">商品信息</div>
        <div className="w-28 text-center">单价</div>
        <div className="w-28 text-center">数量</div>
        <div className="w-28 text-center">小计</div>
        <div className="w-14 text-center">操作</div>
      </div>

      {/* 商品列表 */}
      <div className="px-4 lg:px-6">
        {shop.items.map(item => (
          <CartItem
            key={item.id}
            item={item}
            onSelect={onSelectItem}
            onQuantityChange={onQuantityChange}
            onDelete={onDeleteItem}
          />
        ))}
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-20 lg:py-32 px-4">
      <div className="w-32 h-32 lg:w-40 lg:h-40 bg-gray-100 rounded-full flex items-center justify-center mb-4 lg:mb-6">
        <svg className="w-16 h-16 lg:w-20 lg:h-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <p className="text-gray-500 mb-4 lg:text-lg">购物车是空的</p>
      <Link
        to="/"
        className="px-6 py-2 lg:px-8 lg:py-3 bg-primary text-white rounded-full text-sm lg:text-base font-medium hover:bg-primary/90 transition-colors"
      >
        去逛逛
      </Link>
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const { items: storeItems, fetchCart, toggleSelect, toggleSelectAll, updateQuantity, removeItem } = useCartStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBatchDeleteConfirm, setShowBatchDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [priceAnimating, setPriceAnimating] = useState(false);
  const cartIconRef = useRef(null);

  useEffect(() => { fetchCart() }, []);

  // 将扁平 items 包装成 cartData 格式（单店铺）
  const cartItems = storeItems.map(item => ({
    ...item,
    originalPrice: Math.round(item.price * 1.5),
    spec: '',
    stock: item.stock || 99,
  }));
  const cartData = cartItems.length > 0 ? [{
    id: 1, shopId: 1, shopName: 'UniShop 官方旗舰店',
    items: cartItems
  }] : [];

  const selectedItems = cartItems.filter(item => item.selected);
  const totalCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalOriginalPrice = selectedItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  const savedPrice = totalOriginalPrice - totalPrice;

  const allItems = cartItems;
  const allSelected = allItems.length > 0 && allItems.every(item => item.selected);

  const handleSelectItem = (itemId) => { toggleSelect(itemId) };

  const handleSelectShop = (shopId, selected) => { toggleSelectAll(selected) };

  const handleSelectAll = () => { toggleSelectAll(!allSelected) };

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 1) return;
    updateQuantity(itemId, quantity);
    setPriceAnimating(true);
    setTimeout(() => setPriceAnimating(false), 300);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteItem = () => {
    if (itemToDelete) { removeItem(itemToDelete.id) }
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    setShowBatchDeleteConfirm(true);
  };

  const confirmBatchDelete = async () => {
    for (const item of selectedItems) { await removeItem(item.id) }
    setShowBatchDeleteConfirm(false);
  };

  const handleCheckout = () => {
    if (totalCount === 0) return;
    navigate('/checkout', { state: { items: selectedItems } });
  };

  const isEmpty = cartData.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-32 lg:pb-8">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between px-4 lg:px-8 py-3 lg:py-4">
            <Link to="/" className="p-1 lg:hidden">
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            {/* PC端 Logo */}
            <Link to="/" className="hidden lg:flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">UniShop</span>
              <span className="text-gray-300 mx-2">|</span>
              <span className="text-xl text-gray-600">购物车</span>
            </Link>
            <h1 className="text-lg font-semibold lg:hidden">
              购物车{allItems.length > 0 && `(${allItems.length})`}
            </h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {isEditing ? '完成' : '管理'}
            </button>
          </div>
        </div>
      </div>

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="lg:flex lg:gap-6 lg:px-8 lg:py-6">
            {/* 左侧：购物车列表 */}
            <div className="lg:flex-1">
              <div className="px-3 lg:px-0 pt-3 lg:pt-0">
                {cartData.map(shop => (
                  <ShopGroup
                    key={shop.shopId}
                    shop={shop}
                    onSelectShop={handleSelectShop}
                    onSelectItem={handleSelectItem}
                    onQuantityChange={handleQuantityChange}
                    onDeleteItem={handleDeleteClick}
                  />
                ))}
              </div>

              {/* 猜你喜欢 */}
              <div className="px-3 lg:px-0 mt-4">
                <div className="bg-white rounded-xl p-4 lg:p-6 lg:shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-3 lg:mb-4 lg:text-lg">猜你喜欢</h3>
                  <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <Link key={i} to={`/product/${i}`} className="block group">
                        <img
                          src={`https://picsum.photos/200/200?random=${i + 10}`}
                          alt="推荐商品"
                          className="w-full aspect-square object-cover rounded-lg mb-2 group-hover:opacity-90 transition-opacity"
                        />
                        <p className="text-xs lg:text-sm text-gray-800 line-clamp-2 mb-1 group-hover:text-primary transition-colors">推荐商品名称</p>
                        <p className="text-sm lg:text-base text-primary font-semibold">¥99.00</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：PC端结算卡片 */}
            <div className="hidden lg:block lg:w-80">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h3 className="font-semibold text-lg mb-4 pb-4 border-b border-gray-100">结算详情</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">商品件数</span>
                    <span className="text-gray-800">{totalCount} 件</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">商品总价</span>
                    <span className="text-gray-800">¥{totalOriginalPrice.toFixed(2)}</span>
                  </div>
                  {savedPrice > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">优惠金额</span>
                      <span className="text-red-500">-¥{savedPrice.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">运费</span>
                    <span className="text-gray-800">免运费</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-gray-100 mb-6">
                  <span className="text-gray-600">应付总额:</span>
                  <span className={`text-2xl font-bold text-primary transition-transform ${priceAnimating ? 'scale-110' : ''}`}>
                    ¥{totalPrice.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={totalCount === 0}
                  className={`block w-full py-3 rounded-xl text-center font-semibold transition-all ${
                    totalCount > 0
                      ? 'bg-primary text-white hover:bg-primary/90 active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  结算({totalCount})
                </button>

                {isEditing && (
                  <button
                    onClick={handleDeleteSelected}
                    disabled={selectedItems.length === 0}
                    className="w-full mt-3 py-3 rounded-xl text-center font-semibold border border-red-400 text-red-500 hover:bg-red-50 disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-transparent transition-colors"
                  >
                    删除选中({selectedItems.length})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 底部结算栏 - 移动端 */}
      {!isEmpty && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 safe-area-inset-bottom lg:hidden">
          <div className="flex items-center">
            {/* 全选 */}
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2"
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                allSelected ? 'bg-primary border-primary scale-110' : 'border-gray-300'
              }`}>
                {allSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-600">全选</span>
            </button>

            <div className="flex-1 flex items-center justify-end gap-3">
              {/* 价格信息 */}
              {!isEditing && (
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-sm text-gray-600">合计:</span>
                    <span className={`text-xl font-bold text-primary transition-transform ${priceAnimating ? 'scale-110' : ''}`}>
                      ¥{totalPrice.toFixed(2)}
                    </span>
                  </div>
                  {savedPrice > 0 && (
                    <p className="text-xs text-gray-500">
                      已优惠 <span className="text-red-500">¥{savedPrice.toFixed(2)}</span>
                    </p>
                  )}
                </div>
              )}

              {/* 结算/删除按钮 */}
              {isEditing ? (
                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedItems.length === 0}
                  className="px-6 py-2 rounded-full font-semibold text-sm border border-red-400 text-red-500 disabled:border-gray-200 disabled:text-gray-400 transition-colors"
                >
                  删除({selectedItems.length})
                </button>
              ) : (
                <button
                  onClick={handleCheckout}
                  disabled={totalCount === 0}
                  className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                    totalCount > 0
                      ? 'bg-primary text-white active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  结算({totalCount})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 删除单个商品确认弹窗 */}
      <ConfirmDialog
        visible={showDeleteConfirm}
        title="确认删除"
        message={`确定要删除"${itemToDelete?.name?.slice(0, 20)}..."吗？`}
        confirmText="删除"
        confirmType="danger"
        onConfirm={confirmDeleteItem}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setItemToDelete(null);
        }}
      />

      {/* 批量删除确认弹窗 */}
      <ConfirmDialog
        visible={showBatchDeleteConfirm}
        title="确认删除"
        message={`确定要删除选中的 ${selectedItems.length} 件商品吗？`}
        confirmText="删除"
        confirmType="danger"
        onConfirm={confirmBatchDelete}
        onCancel={() => setShowBatchDeleteConfirm(false)}
      />
    </div>
  );
}
