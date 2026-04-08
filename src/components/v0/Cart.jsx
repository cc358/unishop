import { useState } from 'react';
import { Link } from 'react-router-dom';

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
  return (
    <div className="flex items-start gap-3 py-4 border-b border-gray-100 last:border-b-0">
      {/* 选择框 */}
      <button
        onClick={() => onSelect(item.id)}
        className="flex-shrink-0 mt-4"
      >
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          item.selected ? 'bg-primary border-primary' : 'border-gray-300'
        }`}>
          {item.selected && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          className="w-20 h-20 object-cover rounded-lg"
        />
      </Link>

      {/* 商品信息 */}
      <div className="flex-1 min-w-0">
        <Link to={`/product/${item.id}`}>
          <h4 className="text-sm text-gray-800 line-clamp-2 leading-tight mb-1">
            {item.name}
          </h4>
        </Link>
        <p className="text-xs text-gray-500 mb-2">{item.spec}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-primary font-semibold">¥{item.price.toFixed(2)}</span>
            {item.originalPrice > item.price && (
              <span className="text-xs text-gray-400 line-through">¥{item.originalPrice.toFixed(2)}</span>
            )}
          </div>

          {/* 数量选择器 */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-7 h-7 flex items-center justify-center text-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="w-7 h-7 flex items-center justify-center text-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 删除按钮 */}
      <button
        onClick={() => onDelete(item.id)}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
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
    <div className="bg-white rounded-xl mb-3 overflow-hidden">
      {/* 店铺头部 */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button
          onClick={() => onSelectShop(shop.shopId, !allSelected)}
          className="flex-shrink-0"
        >
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            allSelected ? 'bg-primary border-primary' : someSelected ? 'bg-primary/50 border-primary/50' : 'border-gray-300'
          }`}>
            {(allSelected || someSelected) && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </button>
        <Link to={`/shop/${shop.shopId}`} className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="font-medium text-sm text-gray-800">{shop.shopName}</span>
        </Link>
        <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* 商品列表 */}
      <div className="px-4">
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
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <p className="text-gray-500 mb-4">购物车是空的</p>
      <Link
        to="/"
        className="px-6 py-2 bg-primary text-white rounded-full text-sm font-medium"
      >
        去逛逛
      </Link>
    </div>
  );
}

export default function Cart() {
  const [cartData, setCartData] = useState(mockCartData);
  const [isEditing, setIsEditing] = useState(false);

  // 计算选中的商品数量和总价
  const selectedItems = cartData.flatMap(shop => shop.items.filter(item => item.selected));
  const totalCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalOriginalPrice = selectedItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  const savedPrice = totalOriginalPrice - totalPrice;

  // 全选状态
  const allItems = cartData.flatMap(shop => shop.items);
  const allSelected = allItems.length > 0 && allItems.every(item => item.selected);

  // 选择单个商品
  const handleSelectItem = (itemId) => {
    setCartData(prev => prev.map(shop => ({
      ...shop,
      items: shop.items.map(item =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    })));
  };

  // 选择店铺所有商品
  const handleSelectShop = (shopId, selected) => {
    setCartData(prev => prev.map(shop =>
      shop.shopId === shopId
        ? { ...shop, items: shop.items.map(item => ({ ...item, selected })) }
        : shop
    ));
  };

  // 全选/取消全选
  const handleSelectAll = () => {
    const newSelected = !allSelected;
    setCartData(prev => prev.map(shop => ({
      ...shop,
      items: shop.items.map(item => ({ ...item, selected: newSelected }))
    })));
  };

  // 修改数量
  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 1) return;
    setCartData(prev => prev.map(shop => ({
      ...shop,
      items: shop.items.map(item =>
        item.id === itemId ? { ...item, quantity: Math.min(quantity, item.stock) } : item
      )
    })));
  };

  // 删除商品
  const handleDeleteItem = (itemId) => {
    setCartData(prev => prev.map(shop => ({
      ...shop,
      items: shop.items.filter(item => item.id !== itemId)
    })).filter(shop => shop.items.length > 0));
  };

  // 删除选中商品
  const handleDeleteSelected = () => {
    setCartData(prev => prev.map(shop => ({
      ...shop,
      items: shop.items.filter(item => !item.selected)
    })).filter(shop => shop.items.length > 0));
  };

  const isEmpty = cartData.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="p-1">
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold">购物车{allItems.length > 0 && `(${allItems.length})`}</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm text-primary"
          >
            {isEditing ? '完成' : '管理'}
          </button>
        </div>
      </div>

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <>
          {/* 购物车列表 */}
          <div className="px-3 pt-3">
            {cartData.map(shop => (
              <ShopGroup
                key={shop.shopId}
                shop={shop}
                onSelectShop={handleSelectShop}
                onSelectItem={handleSelectItem}
                onQuantityChange={handleQuantityChange}
                onDeleteItem={handleDeleteItem}
              />
            ))}
          </div>

          {/* 猜你喜欢 */}
          <div className="px-3 mt-4">
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3">猜你喜欢</h3>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map(i => (
                  <Link key={i} to={`/product/${i}`} className="block">
                    <img
                      src={`https://picsum.photos/200/200?random=${i + 10}`}
                      alt="推荐商品"
                      className="w-full aspect-square object-cover rounded-lg mb-2"
                    />
                    <p className="text-xs text-gray-800 line-clamp-2 mb-1">推荐商品名称</p>
                    <p className="text-sm text-primary font-semibold">¥99.00</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 底部结算栏 */}
      {!isEmpty && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 safe-area-inset-bottom">
          <div className="flex items-center">
            {/* 全选 */}
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2"
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                allSelected ? 'bg-primary border-primary' : 'border-gray-300'
              }`}>
                {allSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-600">全选</span>
            </button>

            {/* 价格信息 */}
            <div className="flex-1 text-right mr-3">
              {isEditing ? (
                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedItems.length === 0}
                  className="text-sm text-red-500 disabled:text-gray-400"
                >
                  删除选中({selectedItems.length})
                </button>
              ) : (
                <>
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-sm text-gray-600">合计:</span>
                    <span className="text-lg font-semibold text-primary">¥{totalPrice.toFixed(2)}</span>
                  </div>
                  {savedPrice > 0 && (
                    <p className="text-xs text-gray-500">已优惠 ¥{savedPrice.toFixed(2)}</p>
                  )}
                </>
              )}
            </div>

            {/* 结算按钮 */}
            {!isEditing && (
              <Link
                to={totalCount > 0 ? '/checkout' : '#'}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  totalCount > 0
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                结算({totalCount})
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
