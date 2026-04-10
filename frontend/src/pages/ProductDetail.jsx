import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ShoppingCart, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { getProduct } from '../api/product'
import { useCartStore } from '../stores/useCartStore'
import Loading from '../components/common/Loading'

// 商品详情页
function ProductDetail() {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((s) => s.addItem)

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
  })

  if (isLoading) return <Loading />
  if (!product) return <div className="text-center py-20">商品不存在</div>

  const handleAddToCart = () => {
    addItem({ ...product, quantity })
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* 商品图片 */}
        <div className="bg-white rounded-lg overflow-hidden">
          <img
            src={product.image || '/placeholder.png'}
            alt={product.name}
            className="w-full h-80 object-cover"
          />
        </div>

        {/* 商品信息 */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-3xl font-bold text-red-500 mb-4">
            ¥{product.price}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* 数量选择 */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-gray-600">数量：</span>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center border rounded"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center border rounded"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* 加入购物车 */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
          >
            <ShoppingCart className="w-5 h-5" />
            加入购物车
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
