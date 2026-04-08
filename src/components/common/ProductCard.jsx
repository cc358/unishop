import { Link } from 'react-router-dom'

// 商品卡片
function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
    >
      <img
        src={product.image || '/placeholder.png'}
        alt={product.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-3">
        <h3 className="text-sm font-medium truncate">{product.name}</h3>
        <p className="text-red-500 font-bold mt-1">¥{product.price}</p>
        {product.sales !== undefined && (
          <p className="text-xs text-gray-400 mt-1">已售 {product.sales}</p>
        )}
      </div>
    </Link>
  )
}

export default ProductCard
