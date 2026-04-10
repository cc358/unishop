import { Routes, Route } from 'react-router-dom'
import { Header } from './components/v0/Header'
import { Footer } from './components/v0/Footer'
import { MobileNav } from './components/v0/MobileNav'
import { ToastProvider } from './components/v0/UIComponents'
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import ProductDetail from './components/v0/ProductDetail'
import V0Cart from './components/v0/Cart'
import V0Checkout from './components/v0/Checkout'
import V0Payment from './components/v0/Payment'
import V0PaymentSuccess from './components/v0/PaymentSuccess'
import V0Orders from './components/v0/Orders'
import OrderDetail from './pages/OrderDetail'
import AuthPage from './components/v0/AuthPage'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Category from './pages/Category'
import V0Profile from './pages/V0Profile'
import MerchantApply from './components/v0/MerchantApply'

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/product/*" element={<ProductDetail />} />
            <Route path="/cart" element={<V0Cart />} />
            <Route path="/checkout" element={<V0Checkout />} />
            <Route path="/payment" element={<V0Payment />} />
            <Route path="/payment-success" element={<V0PaymentSuccess />} />
            <Route path="/payment/success" element={<V0PaymentSuccess />} />
            <Route path="/orders" element={<V0Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<V0Profile />} />
            <Route path="/profile/old" element={<Profile />} />
            <Route path="/category" element={<Category />} />
            <Route path="/merchant" element={<MerchantApply />} />
          </Routes>
        </main>
        <div className="hidden md:block">
          <Footer />
        </div>
        <MobileNav />
      </div>
    </ToastProvider>
  )
}

export default App
