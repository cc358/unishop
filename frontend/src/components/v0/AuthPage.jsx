import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingOverlay, SuccessAnimation } from './UIComponents';
import { login as loginApi, register as registerApi } from '../../api/auth';
import { useAuthStore } from '../../stores/useAuthStore';

// 登录表单组件
function LoginForm({ onSwitch, onForgotPassword, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({});

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

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name);
  };

  const validateField = (fieldName) => {
    const newErrors = { ...errors };
    
    if (fieldName === 'phone') {
      if (!formData.phone) {
        newErrors.phone = '请输入手机号';
      } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
        newErrors.phone = '请输入正确的11位手机号';
      } else {
        delete newErrors.phone;
      }
    }
    
    if (fieldName === 'password') {
      if (!formData.password) {
        newErrors.password = '请输入密码';
      } else if (formData.password.length < 6) {
        newErrors.password = '密码至少需要6位字符';
      } else {
        delete newErrors.password;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.phone) {
      newErrors.phone = '请输入手机号或邮箱';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.phone)) {
      newErrors.phone = '请输入正确的手机号或邮箱';
    }
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少需要6位字符';
    }
    setErrors(newErrors);
    setTouched({ phone: true, password: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const data = await loginApi({ email: formData.phone, password: formData.password });
      const setAuth = useAuthStore.getState().setAuth;
      setAuth(data.user, data.token);
      setIsLoading(false);
      onLoginSuccess && onLoginSuccess();
    } catch (err) {
      setIsLoading(false);
      setErrors({ phone: err.message || '登录失败，请检查账号密码' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
      {/* 手机号输入 */}
      <div>
        <div className={`flex items-center border-2 rounded-xl px-4 py-3 lg:py-3.5 transition-all duration-200 ${
          errors.phone && touched.phone 
            ? 'border-red-400 bg-red-50/50' 
            : 'border-gray-200 focus-within:border-primary focus-within:shadow-sm focus-within:shadow-primary/10'
        }`}>
          <svg className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${errors.phone && touched.phone ? 'text-red-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="请输入手机号或邮箱"
            className="flex-1 outline-none text-sm lg:text-base bg-transparent placeholder-gray-400"
          />
          {formData.phone && (
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, phone: '' }))}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {errors.phone && touched.phone && (
          <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5 ml-1 animate-fade-in">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errors.phone}
          </p>
        )}
      </div>

      {/* 密码输入 */}
      <div>
        <div className={`flex items-center border-2 rounded-xl px-4 py-3 lg:py-3.5 transition-all duration-200 ${
          errors.password && touched.password 
            ? 'border-red-400 bg-red-50/50' 
            : 'border-gray-200 focus-within:border-primary focus-within:shadow-sm focus-within:shadow-primary/10'
        }`}>
          <svg className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${errors.password && touched.password ? 'text-red-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="请输入密码"
            className="flex-1 outline-none text-sm lg:text-base bg-transparent placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
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
        {errors.password && touched.password && (
          <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5 ml-1 animate-fade-in">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errors.password}
          </p>
        )}
      </div>

      {/* 记住我 & 忘记密码 */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
            formData.rememberMe ? 'bg-primary border-primary' : 'border-gray-300 group-hover:border-primary/50'
          }`}>
            {formData.rememberMe && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="hidden"
          />
          <span className="text-sm text-gray-600">记住我</span>
        </label>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          忘记密码?
        </button>
      </div>

      {/* 登录按钮 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 lg:py-3.5 bg-primary text-white rounded-xl font-medium transition-all hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
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
          className="text-primary ml-1 font-medium hover:text-primary/80 transition-colors"
        >
          立即注册
        </button>
      </p>
    </form>
  );
}

// 注册表单组件
function RegisterForm({ onSwitch, onRegisterSuccess }) {
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
  const [touched, setTouched] = useState({});
  const [codeSending, setCodeSending] = useState(false);

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

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const sendCode = async () => {
    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      setErrors(prev => ({ ...prev, phone: '请输入正确的11位手机号' }));
      setTouched(prev => ({ ...prev, phone: true }));
      return;
    }
    
    // 发送验证码动画
    setCodeSending(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setCodeSending(false);
    
    // 开始倒计时
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
      newErrors.phone = '请输入手机号或邮箱';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.phone)) {
      newErrors.phone = '请输入正确的手机号或邮箱';
    }
    if (!formData.code) {
      newErrors.code = '请输入验证码';
    } else if (formData.code.length !== 6) {
      newErrors.code = '验证码为6位数字';
    }
    if (!formData.password) {
      newErrors.password = '请设置密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少需要6位字符';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }
    if (!formData.agreement) {
      newErrors.agreement = '请阅读并同意用户协议';
    }
    setErrors(newErrors);
    setTouched({ phone: true, code: true, password: true, confirmPassword: true, agreement: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const data = await registerApi({ name: formData.phone, email: formData.phone, password: formData.password });
      const setAuth = useAuthStore.getState().setAuth;
      setAuth(data.user, data.token);
      setIsLoading(false);
      onRegisterSuccess && onRegisterSuccess();
    } catch (err) {
      setIsLoading(false);
      setErrors({ phone: err.message || '注册失败' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
      {/* 手机号 */}
      <div>
        <div className={`flex items-center border-2 rounded-xl px-4 py-3 lg:py-3.5 transition-all duration-200 ${
          errors.phone && touched.phone 
            ? 'border-red-400 bg-red-50/50' 
            : 'border-gray-200 focus-within:border-primary focus-within:shadow-sm focus-within:shadow-primary/10'
        }`}>
          <svg className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${errors.phone && touched.phone ? 'text-red-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="请输入手机号或邮箱"
            className="flex-1 outline-none text-sm lg:text-base bg-transparent placeholder-gray-400"
          />
        </div>
        {errors.phone && touched.phone && (
          <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5 ml-1 animate-fade-in">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errors.phone}
          </p>
        )}
      </div>

      {/* 验证码 */}
      <div>
        <div className={`flex items-center border-2 rounded-xl px-4 py-3 lg:py-3.5 transition-all duration-200 ${
          errors.code && touched.code 
            ? 'border-red-400 bg-red-50/50' 
            : 'border-gray-200 focus-within:border-primary focus-within:shadow-sm focus-within:shadow-primary/10'
        }`}>
          <svg className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${errors.code && touched.code ? 'text-red-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="请输入验证码"
            maxLength={6}
            className="flex-1 outline-none text-sm lg:text-base bg-transparent placeholder-gray-400"
          />
          <button
            type="button"
            onClick={sendCode}
            disabled={countdown > 0 || codeSending}
            className={`text-sm whitespace-nowrap transition-all ${
              countdown > 0 || codeSending
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-primary hover:text-primary/80 active:scale-95'
            }`}
          >
            {codeSending ? (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                发送中
              </span>
            ) : countdown > 0 ? (
              <span className="tabular-nums">{countdown}s 后重发</span>
            ) : (
              '获取验证码'
            )}
          </button>
        </div>
        {errors.code && touched.code && (
          <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5 ml-1 animate-fade-in">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errors.code}
          </p>
        )}
      </div>

      {/* 密码 */}
      <div>
        <div className={`flex items-center border-2 rounded-xl px-4 py-3 lg:py-3.5 transition-all duration-200 ${
          errors.password && touched.password 
            ? 'border-red-400 bg-red-50/50' 
            : 'border-gray-200 focus-within:border-primary focus-within:shadow-sm focus-within:shadow-primary/10'
        }`}>
          <svg className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${errors.password && touched.password ? 'text-red-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="请设置密码（至少6位）"
            className="flex-1 outline-none text-sm lg:text-base bg-transparent placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
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
        {errors.password && touched.password && (
          <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5 ml-1 animate-fade-in">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errors.password}
          </p>
        )}
      </div>

      {/* 确认密码 */}
      <div>
        <div className={`flex items-center border-2 rounded-xl px-4 py-3 lg:py-3.5 transition-all duration-200 ${
          errors.confirmPassword && touched.confirmPassword 
            ? 'border-red-400 bg-red-50/50' 
            : 'border-gray-200 focus-within:border-primary focus-within:shadow-sm focus-within:shadow-primary/10'
        }`}>
          <svg className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${errors.confirmPassword && touched.confirmPassword ? 'text-red-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="请确认密码"
            className="flex-1 outline-none text-sm lg:text-base bg-transparent placeholder-gray-400"
          />
        </div>
        {errors.confirmPassword && touched.confirmPassword && (
          <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5 ml-1 animate-fade-in">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* 用户协议 */}
      <div>
        <label className="flex items-start gap-2 cursor-pointer group">
          <div className={`w-4 h-4 mt-0.5 rounded border-2 flex items-center justify-center transition-all ${
            formData.agreement ? 'bg-primary border-primary' : errors.agreement && touched.agreement ? 'border-red-400' : 'border-gray-300 group-hover:border-primary/50'
          }`}>
            {formData.agreement && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <input
            type="checkbox"
            name="agreement"
            checked={formData.agreement}
            onChange={handleChange}
            className="hidden"
          />
          <span className="text-xs lg:text-sm text-gray-600">
            我已阅读并同意
            <Link to="/agreement" className="text-primary hover:text-primary/80">《用户协议》</Link>
            和
            <Link to="/privacy" className="text-primary hover:text-primary/80">《隐私政策》</Link>
          </span>
        </label>
        {errors.agreement && touched.agreement && (
          <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5 ml-6 animate-fade-in">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errors.agreement}
          </p>
        )}
      </div>

      {/* 注册按钮 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 lg:py-3.5 bg-primary text-white rounded-xl font-medium transition-all hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
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
          className="text-primary ml-1 font-medium hover:text-primary/80 transition-colors"
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
    { name: '微信', color: '#07C160' },
    { name: 'QQ', color: '#12B7F5' },
    { name: '微博', color: '#E6162D' }
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
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-95"
              style={{ backgroundColor: `${platform.color}15`, color: platform.color }}
            >
              <span className="text-lg font-bold">{platform.name[0]}</span>
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
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', subtitle: '' });

  const handleForgotPassword = () => {
    console.log('跳转忘记密码页面');
  };

  const handleLoginSuccess = () => {
    setSuccessMessage({ title: '登录成功', subtitle: '欢迎回来!' });
    setShowSuccess(true);
  };

  const handleRegisterSuccess = () => {
    setSuccessMessage({ title: '注册成功', subtitle: '欢迎加入 UniShop!' });
    setShowSuccess(true);
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:bg-gray-100 lg:flex lg:items-center lg:justify-center">
      {/* 成功动画 */}
      <SuccessAnimation
        visible={showSuccess}
        title={successMessage.title}
        subtitle={successMessage.subtitle}
        onComplete={handleSuccessComplete}
      />

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
                  onLoginSuccess={handleLoginSuccess}
                />
              ) : (
                <RegisterForm 
                  onSwitch={() => setIsLogin(true)}
                  onRegisterSuccess={handleRegisterSuccess}
                />
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
