import { Loader2 } from 'lucide-react'

// 加载状态
function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  )
}

export default Loading
