// 底部
function Footer() {
  return (
    <footer className="hidden md:block bg-gray-800 text-gray-400 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="text-white font-semibold mb-3">UniShop</h3>
            <p>发现好物，尽在 UniShop</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">帮助中心</h3>
            <p>退换货政策</p>
            <p>配送说明</p>
            <p>联系客服</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">关于我们</h3>
            <p>关于 UniShop</p>
            <p>隐私政策</p>
            <p>用户协议</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-xs">
          © 2026 UniShop. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
