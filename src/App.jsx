import { Routes, Route } from 'react-router-dom'
import { Header } from './components/v0/Header'
import { Footer } from './components/v0/Footer'
import { MobileNav } from './components/v0/MobileNav'
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderList from './pages/OrderList'
import OrderDetail from './pages/OrderDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Category from './pages/Category'
import V0Profile from './pages/V0Profile'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<V0Profile />} />
          <Route path="/profile/old" element={<Profile />} />
          <Route path="/category" element={<Category />} />
        </Routes>
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileNav />
    </div>
  )
}

export default App
