import { Inbox } from 'lucide-react'

// 空状态
function Empty({ message = '暂无数据' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <Inbox className="w-16 h-16 mb-3" />
      <p>{message}</p>
    </div>
  )
}

export default Empty
