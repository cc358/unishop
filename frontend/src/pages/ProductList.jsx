import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../api/product'
import ProductCard from '../components/common/ProductCard'
import Loading from '../components/common/Loading'
import Empty from '../components/common/Empty'

// 商品列表页
function ProductList() {
  const [category, setCategory] = useState('all')

  const { data, isLoading } = useQuery({
    queryKey: ['products', category],
    queryFn: () => getProducts({ category }),
  })
  const products = data?.products || []

  if (isLoading) return <Loading />

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">全部商品</h1>

      {/* 分类筛选 */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['all', '电子产品', '服饰', '食品', '家居'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
              category === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {cat === 'all' ? '全部' : cat}
          </button>
        ))}
      </div>

      {/* 商品网格 */}
      {products.length === 0 ? (
        <Empty message="暂无商品" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductList
