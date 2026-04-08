import { useState } from 'react';
import { Link } from 'react-router-dom';

// 登录表单组件
function LoginForm({ onSwitch, onForgotPassword }) {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.phone) {
      newErrors.phone = '请输入手机号';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入正确的手机号';
    }
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少6位';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    // 模拟登录请求
    setTimeout(() => {
      setIsLoading(false);
      // 这里由 Claude Code 对接实际登录 API
      console.log('登录数据:', formData);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
      {/* 手机号输入 */}
      <div>
        <div className={`flex items-center border rounded-xl px-4 py-3 lg:py-3.5 transition-colors ${
          errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-primary'
        }`}>
          <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="请输入手机号"
            maxLength={11}
            className="flex-1 outline-none text-sm lg:text-base bg-transparent placeholder-gray-400"
          />
          {formData.phone && (
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, phone: '' }))}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {errors.phone && <p className="text-xs text-red-500 mt-1 ml-1">{errors.phone}</p>}
      </div>

      {/* 密码输入 */}
      <div>
        <div className={`flex items-center border rounded-xl px-4 py-3 lg:py-3.5 transition-colors ${
          errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-primary'
        }`}>
          <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="请输入密码"
            className="flex-1 outline-none text-sm lg:text-base bg-transparent placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>}
      </div>

      {/* 记住我 & 忘记密码 */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-gray-600">记住我</span>
        </label>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-primary hover:text-primary/80"
        >
          忘记密码?
        </button>
      </div>

      {/* 登录按钮 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 lg:py-3.5 bg-primary text-white rounded-xl font-medium transition-colors hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading && (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {isLoading ? '登录中...' : '登录'}
      </button>

      {/* 切换注册 */}
      <p className="text-center text-sm text-gray-600">
        还没有账号?
        <button
          type="button"
          onClick={onSwitch}
          className="text-primary ml-1 font-medium hover:text-primary/80"
        >
          立即注册
        </button>
      </p>
    </form>
  );
}

// 注册表单组件
function RegisterForm({ onSwitch }) {
  const [formData, setFormData] = useState({
    phone: '',
    code: '',
    password: '',
    confirmPassword: '',
    agreement: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const sendCode = () => {
    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      setErrors(prev => ({ ...prev, phone: '请输入正确的手机号' }));
      return;
    }
    // 模拟发送验证码
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.phone) {
      newErrors.phone = '请输入手机号';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入正确的手机号';
    }
    if (!formData.code) {
      newErrors.code = '请输入验证码';
    } else if (formData.code.length !== 6) {
      newErrors.code = '验证码为6位数字';
    }
    if (!formData.password) {
      newErrors.password = '请设置密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少6位';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次密码不一致';
    }
    if (!formData.agreement) {
      newErrors.agreement = '请阅读并同意用户协议';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('注册数据:', formData);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
      {/* 手机号 */}
      <div>
        <div className={`flex items-center border rounded-xl px-4 py-3 lg:py-3.5 transition-colors ${
          errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-primary'
        }`}>
          <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="请输入手机号"
            maxLength={11}
            className="flex-1 outline-none text-sm lg:text-base bg-transparent placeholder-gray-400"
          />
        </div>
        {errors.phone && <p className="text-xs text-red-500 mt-1 ml-1">{errors.phone}</p>}
      </div>

      {/* 验证码 */}
      <div>
        <div className={`flex items-center border rounded-xl px-4 py-3 lg:py-3.5 transition-colors ${
          errors.code ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-primary'
        }`}>
          <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="请输入验证码"
            maxLength={6}
            className="flex-1 outline-none text-sm lg:text-base bg-transparent placeholder-gray-400"
          />
          <button
            type="button"
            onClick={sendCode}
            disabled={countdown > 0}
            className="text-sm text-primary disabled:text-gray-400 whitespace-nowrap hover:text-primary/80"
          >
            {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
          </button>
        </div>
        {errors.code && <p className="text-xs text-red-500 mt-1 ml-1">{errors.code}</p>}
      </div>

      {/* 密码 */}
      <div>
        <div className={`flex items-center border rounded-xl px-4 py-3 lg:py-3.5 transition-colors ${
          errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-primary'
        }`}>
          <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="请设置密码（至少6位）"
            className="flex-1 outline-none text-sm lg:text-base bg-transparent placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>}
      </div>

      {/* 确认密码 */}
      <div>
        <div className={`flex items-center border rounded-xl px-4 py-3 lg:py-3.5 transition-colors ${
          errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-primary'
        }`}>
          <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="请确认密码"
            className="flex-1 outline-none text-sm lg:text-base bg-transparent placeholder-gray-400"
          />
        </div>
        {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.confirmPassword}</p>}
      </div>

      {/* 用户协议 */}
      <div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="agreement"
            checked={formData.agreement}
            onChange={handleChange}
            className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-xs lg:text-sm text-gray-600">
            我已阅读并同意
            <Link to="/agreement" className="text-primary hover:text-primary/80">《用户协议》</Link>
            和
            <Link to="/privacy" className="text-primary hover:text-primary/80">《隐私政策》</Link>
          </span>
        </label>
        {errors.agreement && <p className="text-xs text-red-500 mt-1 ml-1">{errors.agreement}</p>}
      </div>

      {/* 注册按钮 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 lg:py-3.5 bg-primary text-white rounded-xl font-medium transition-colors hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading && (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {isLoading ? '注册中...' : '注册'}
      </button>

      {/* 切换登录 */}
      <p className="text-center text-sm text-gray-600">
        已有账号?
        <button
          type="button"
          onClick={onSwitch}
          className="text-primary ml-1 font-medium hover:text-primary/80"
        >
          立即登录
        </button>
      </p>
    </form>
  );
}

// 第三方登录
function SocialLogin() {
  const socialPlatforms = [
    { name: '微信', icon: (
      <svg className="w-6 h-6 lg:w-7 lg:h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18z"/>
        <path d="M23.98 14.438c0-3.405-3.265-6.169-7.29-6.169-4.026 0-7.29 2.764-7.29 6.17 0 3.405 3.264 6.168 7.29 6.168.76 0 1.49-.096 2.183-.26a.724.724 0 0 1 .607.077l1.601.935a.273.273 0 0 0 .141.046c.136 0 .245-.11.245-.246 0-.06-.024-.12-.04-.178l-.327-1.233a.497.497 0 0 1 .18-.56c1.542-1.132 2.7-2.805 2.7-4.75zm-9.436-1.19c-.538 0-.974-.444-.974-.99a.98.98 0 0 1 .974-.99c.538 0 .974.444.974.99s-.436.99-.974.99zm4.292 0a.98.98 0 0 1-.974-.99c0-.546.436-.99.974-.99s.974.444.974.99-.436.99-.974.99z"/>
      </svg>
    ), color: '#07C160' },
    { name: 'QQ', icon: (
      <svg className="w-6 h-6 lg:w-7 lg:h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195S3.55 14.96 3.55 17.474c0 .665.17 1.025.281 1.025.114 0 .902-.484 1.748-2.072 0 0-.18 2.197 1.904 3.967 0 0-1.77.495-1.77 1.182 0 .686 4.078.43 6.29.43 2.239 0 6.29.256 6.29-.43 0-.687-1.77-1.182-1.77-1.182 2.085-1.77 1.904-3.967 1.904-3.967.846 1.588 1.634 2.072 1.746 2.072.111 0 .283-.36.283-1.025 0-2.514-2.166-6.954-2.166-6.954V9.325C18.29 3.364 14.268 2 12.003 2z"/>
      </svg>
    ), color: '#12B7F5' },
    { name: '微博', icon: (
      <svg className="w-6 h-6 lg:w-7 lg:h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.194.573zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.579-.18-.405-.649.388-1.032.426-1.922.002-2.555-.792-1.183-2.961-1.122-5.453-.033 0 0-.782.343-.583-.28.386-1.236.324-2.274-.273-2.87-1.35-1.349-4.943.053-8.022 3.133C1.447 10.271 0 12.319 0 14.076c0 3.36 4.31 5.407 8.524 5.407 5.525 0 9.199-3.207 9.199-5.756 0-1.544-1.301-2.421-2.664-2.778zm1.582-5.727c-.074-.253.093-.527.372-.612.276-.087.565.049.646.301.499 1.639-.007 3.434-1.392 4.593-.22.184-.556.152-.747-.07-.19-.219-.163-.547.054-.734 1.089-.912 1.479-2.301 1.067-3.478zm2.293-1.686c-.173-.591.217-1.234.87-1.432.65-.199 1.322.116 1.499.706 1.164 3.826-.035 8.001-3.247 10.705-.519.432-1.306.354-1.746-.177-.439-.53-.363-1.297.151-1.733 2.524-2.131 3.476-5.41 2.473-8.069z"/>
      </svg>
    ), color: '#E6162D' }
  ];

  return (
    <div className="mt-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-xs lg:text-sm text-gray-400">其他方式登录</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>
      <div className="flex justify-center gap-8 lg:gap-10">
        {socialPlatforms.map((platform, index) => (
          <button
            key={index}
            className="flex flex-col items-center gap-2 group"
            onClick={() => console.log(`${platform.name} 登录`)}
          >
            <div 
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${platform.color}15`, color: platform.color }}
            >
              {platform.icon}
            </div>
            <span className="text-xs text-gray-500">{platform.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// 主组件
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleForgotPassword = () => {
    console.log('跳转忘记密码页面');
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:bg-gray-100 lg:flex lg:items-center lg:justify-center">
      {/* 移动端顶部导航 */}
      <div className="sticky top-0 z-10 bg-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="p-1">
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold">{isLogin ? '登录' : '注册'}</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* PC端布局容器 */}
      <div className="lg:flex lg:bg-white lg:rounded-2xl lg:shadow-xl lg:overflow-hidden lg:max-w-5xl lg:w-full lg:mx-4">
        {/* PC端左侧品牌区域 */}
        <div className="hidden lg:flex lg:flex-col lg:justify-center lg:items-center lg:w-1/2 lg:bg-gradient-to-br lg:from-primary lg:to-orange-600 lg:p-12 lg:text-white">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">UniShop</h1>
            <p className="text-xl mb-8 opacity-90">您的一站式购物平台</p>
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>海量正品，品质保证</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>极速配送，准时到达</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>7天无理由退换</span>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧/主内容区域 */}
        <div className="lg:w-1/2 lg:p-12">
          {/* Logo - 移动端显示 */}
          <div className="px-6 pt-8 pb-6 lg:hidden">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-primary mb-2">UniShop</h2>
              <p className="text-sm text-gray-500">欢迎{isLogin ? '回来' : '加入'}!</p>
            </div>
          </div>

          {/* PC端标题 */}
          <div className="hidden lg:block lg:mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isLogin ? '欢迎回来' : '创建账号'}
            </h2>
            <p className="text-gray-500">
              {isLogin ? '登录您的账号，继续购物之旅' : '注册账号，开启购物新体验'}
            </p>
          </div>

          {/* 表单区域 */}
          <div className="px-6 lg:px-0">
            <div className="bg-white rounded-2xl p-6 lg:p-0 lg:bg-transparent shadow-sm lg:shadow-none">
              {isLogin ? (
                <LoginForm 
                  onSwitch={() => setIsLogin(false)} 
                  onForgotPassword={handleForgotPassword}
                />
              ) : (
                <RegisterForm onSwitch={() => setIsLogin(true)} />
              )}

              <SocialLogin />
            </div>
          </div>

          {/* 底部协议 - 移动端 */}
          <div className="px-6 py-8 lg:hidden">
            <p className="text-center text-xs text-gray-400">
              登录即表示您同意
              <Link to="/agreement" className="text-primary">《用户协议》</Link>
              和
              <Link to="/privacy" className="text-primary">《隐私政策》</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
