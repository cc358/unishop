import { useState, useEffect, createContext, useContext } from 'react';

// ==================== Toast 消息提示 ====================

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', duration = 2500) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const toast = {
    success: (msg, duration) => showToast(msg, 'success', duration),
    error: (msg, duration) => showToast(msg, 'error', duration),
    info: (msg, duration) => showToast(msg, 'info', duration),
    warning: (msg, duration) => showToast(msg, 'warning', duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast 容器 */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function Toast({ message, type }) {
  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-gray-800 text-white',
  };

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-toast-in ${colors[type]}`}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

// ==================== Loading 加载动画 ====================

export function Loading({ size = 'default', text = '' }) {
  const sizes = {
    small: 'w-5 h-5',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`relative ${sizes[size]}`}>
        <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
        <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}

export function LoadingOverlay({ visible, text = '加载中...' }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-black/30 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl px-8 py-6 flex flex-col items-center gap-3 shadow-xl">
        <Loading size="large" />
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </div>
  );
}

export function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

// ==================== 确认弹窗 ====================

export function ConfirmDialog({ 
  visible, 
  title = '确认', 
  message, 
  confirmText = '确定',
  cancelText = '取消',
  confirmType = 'primary', // 'primary' | 'danger'
  onConfirm, 
  onCancel 
}) {
  if (!visible) return null;

  const confirmStyles = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-scale-in">
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <div className="flex border-t border-gray-100">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <div className="w-px bg-gray-100" />
          <button
            onClick={onConfirm}
            className={`flex-1 py-3.5 font-medium transition-colors ${confirmStyles[confirmType]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 抽屉组件 ====================

export function Drawer({ 
  visible, 
  position = 'bottom', // 'bottom' | 'right' | 'left'
  title,
  children, 
  onClose,
  showClose = true
}) {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  if (!visible) return null;

  const positionStyles = {
    bottom: 'inset-x-0 bottom-0 rounded-t-3xl animate-slide-up max-h-[85vh]',
    right: 'inset-y-0 right-0 rounded-l-3xl animate-slide-left w-full max-w-md',
    left: 'inset-y-0 left-0 rounded-r-3xl animate-slide-right w-full max-w-md',
  };

  return (
    <div className="fixed inset-0 z-[70]">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className={`absolute bg-white flex flex-col ${positionStyles[position]}`}>
        {/* 头部 */}
        {(title || showClose) && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            {position === 'bottom' && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-200 rounded-full" />
            )}
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {showClose && (
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        {/* 内容 */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// ==================== 模态框 ====================

export function Modal({ 
  visible, 
  title, 
  children, 
  onClose,
  footer,
  showClose = true,
  size = 'default' // 'small' | 'default' | 'large' | 'full'
}) {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  if (!visible) return null;

  const sizeStyles = {
    small: 'max-w-sm',
    default: 'max-w-lg',
    large: 'max-w-2xl',
    full: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className={`relative bg-white rounded-2xl w-full ${sizeStyles[size]} max-h-[90vh] flex flex-col shadow-xl animate-scale-in`}>
        {/* 头部 */}
        {(title || showClose) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {showClose && (
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        {/* 内容 */}
        <div className="flex-1 overflow-auto p-5">
          {children}
        </div>
        {/* 底部 */}
        {footer && (
          <div className="px-5 py-4 border-t border-gray-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== 图片预览 ====================

export function ImagePreview({ visible, images = [], initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setScale(1);
  }, [initialIndex, visible]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  if (!visible || images.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
    setScale(1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
    setScale(1);
  };

  const handleZoom = () => {
    setScale(prev => (prev >= 2 ? 1 : prev + 0.5));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 图片计数 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {/* 上一张 */}
      {images.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 p-2 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* 图片 */}
      <div 
        className="max-w-full max-h-full overflow-hidden"
        onClick={handleZoom}
      >
        <img
          src={images[currentIndex]}
          alt=""
          className="max-w-full max-h-[90vh] object-contain transition-transform duration-200"
          style={{ transform: `scale(${scale})` }}
        />
      </div>

      {/* 下一张 */}
      {images.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 p-2 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* 缩略图 */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setScale(1);
              }}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex ? 'border-white' : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== 加入购物车动画 ====================

export function AddToCartAnimation({ visible, startPosition, endPosition, image, onComplete }) {
  const [animating, setAnimating] = useState(false);
  const [position, setPosition] = useState(startPosition);

  useEffect(() => {
    if (visible && startPosition && endPosition) {
      setPosition(startPosition);
      setAnimating(true);
      
      // 开始动画
      requestAnimationFrame(() => {
        setPosition(endPosition);
      });

      // 动画结束
      const timer = setTimeout(() => {
        setAnimating(false);
        onComplete && onComplete();
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [visible, startPosition, endPosition, onComplete]);

  if (!visible || !animating) return null;

  return (
    <div
      className="fixed z-[110] w-12 h-12 rounded-full overflow-hidden shadow-lg pointer-events-none transition-all duration-500 ease-out"
      style={{
        left: position?.x || 0,
        top: position?.y || 0,
        transform: position === endPosition ? 'scale(0.3)' : 'scale(1)',
      }}
    >
      <img src={image} alt="" className="w-full h-full object-cover" />
    </div>
  );
}

// ==================== 成功动画 ====================

export function SuccessAnimation({ visible, title = '操作成功', subtitle = '', onComplete }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onComplete && onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center animate-fade-in">
      {/* 成功图标动画 */}
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-scale-in">
        <svg 
          className="w-12 h-12 text-green-500 animate-check-draw" 
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
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}

// ==================== 骨架屏 ====================

export function Skeleton({ className = '', variant = 'rect' }) {
  const variants = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-4',
  };

  return (
    <div 
      className={`bg-gray-200 animate-pulse ${variants[variant]} ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <Skeleton className="aspect-square" />
      <div className="p-3">
        <Skeleton variant="text" className="w-full mb-2" />
        <Skeleton variant="text" className="w-2/3 mb-3" />
        <Skeleton variant="text" className="w-1/3" />
      </div>
    </div>
  );
}
