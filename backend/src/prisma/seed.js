const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const categories = [
  { name: '时尚服饰', image: '/images/category-fashion.jpg' },
  { name: '数码家电', image: '/images/category-electronics.jpg' },
  { name: '生鲜美食', image: '/images/category-fresh.jpg' },
  { name: '美妆护肤', image: '/images/category-beauty.jpg' },
  { name: '家居生活', image: '/images/category-home.jpg' },
  { name: '精选礼品', image: '/images/category-gifts.jpg' },
  { name: '母婴用品', image: '/images/category-baby.jpg' },
  { name: '运动户外', image: '/images/category-sports.jpg' },
  { name: '珠宝手表', image: '/images/category-gifts.jpg' },
  { name: '办公文具', image: '/images/category-home.jpg' },
]

const products = [
  // 时尚服饰
  { name: '春季新款纯棉连衣裙', price: 189, originalPrice: 299, stock: 200, sales: 2341, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop', category: '时尚服饰' },
  { name: '轻薄羽绒保暖外套', price: 459, originalPrice: 699, stock: 150, sales: 1856, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop', category: '时尚服饰' },
  { name: '纯棉舒适T恤', price: 89, originalPrice: 159, stock: 500, sales: 5678, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', category: '时尚服饰' },
  { name: '高腰修身牛仔裤', price: 199, originalPrice: 329, stock: 300, sales: 3210, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', category: '时尚服饰' },
  { name: '商务休闲西装外套', price: 599, originalPrice: 899, stock: 100, sales: 876, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop', category: '时尚服饰' },
  // 数码家电
  { name: '无线降噪蓝牙耳机', price: 599, originalPrice: 899, stock: 300, sales: 1823, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', category: '数码家电' },
  { name: '智能运动手表', price: 899, originalPrice: 1299, stock: 200, sales: 1567, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', category: '数码家电' },
  { name: '便携式充电宝 20000mAh', price: 99, originalPrice: 299, stock: 500, sales: 4521, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop', category: '数码家电' },
  { name: '智能全自动扫地机器人', price: 1299, originalPrice: 1999, stock: 80, sales: 654, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', category: '数码家电' },
  { name: '4K超清投影仪', price: 2999, originalPrice: 4599, stock: 50, sales: 321, image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=400&fit=crop', category: '数码家电' },
  // 生鲜美食
  { name: '有机新鲜水果礼盒', price: 98, originalPrice: 138, stock: 1000, sales: 4532, image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=400&fit=crop', category: '生鲜美食' },
  { name: '进口澳洲牛排套餐', price: 298, originalPrice: 458, stock: 200, sales: 1876, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop', category: '生鲜美食' },
  { name: '精选坚果大礼包', price: 68, originalPrice: 99, stock: 800, sales: 6543, image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=400&h=400&fit=crop', category: '生鲜美食' },
  { name: '新鲜三文鱼刺身', price: 158, originalPrice: 228, stock: 150, sales: 2134, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop', category: '生鲜美食' },
  { name: '有机蔬菜套餐', price: 49, originalPrice: 79, stock: 600, sales: 3456, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop', category: '生鲜美食' },
  // 美妆护肤
  { name: '护肤补水套装礼盒', price: 399, originalPrice: 599, stock: 250, sales: 1234, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop', category: '美妆护肤' },
  { name: '高端精华液 30ml', price: 699, originalPrice: 999, stock: 100, sales: 876, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop', category: '美妆护肤' },
  { name: '防晒隔离霜 SPF50+', price: 159, originalPrice: 239, stock: 400, sales: 3456, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop', category: '美妆护肤' },
  { name: '口红礼盒套装', price: 299, originalPrice: 499, stock: 180, sales: 2345, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop', category: '美妆护肤' },
  { name: '卸妆洁面乳 200ml', price: 89, originalPrice: 139, stock: 500, sales: 4567, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop', category: '美妆护肤' },
  // 家居生活
  { name: '北欧简约台灯', price: 199, originalPrice: 299, stock: 300, sales: 789, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop', category: '家居生活' },
  { name: '日式陶瓷杯具套装', price: 159, originalPrice: 239, stock: 400, sales: 2156, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop', category: '家居生活' },
  { name: '记忆棉护颈枕', price: 129, originalPrice: 199, stock: 350, sales: 1876, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=400&fit=crop', category: '家居生活' },
  { name: '智能香薰机', price: 249, originalPrice: 399, stock: 200, sales: 1234, image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop', category: '家居生活' },
  { name: '纯棉四件套床品', price: 399, originalPrice: 599, stock: 150, sales: 2345, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop', category: '家居生活' },
  // 精选礼品
  { name: '高档钢笔礼盒', price: 299, originalPrice: 499, stock: 100, sales: 567, image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=400&fit=crop', category: '精选礼品' },
  { name: '真皮手提包', price: 329, originalPrice: 499, stock: 120, sales: 987, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop', category: '精选礼品' },
  { name: '精美丝巾礼盒', price: 199, originalPrice: 329, stock: 200, sales: 1234, image: 'https://images.unsplash.com/photo-1601924921557-45e8e0e5f144?w=400&h=400&fit=crop', category: '精选礼品' },
  { name: '手工巧克力礼盒', price: 168, originalPrice: 258, stock: 300, sales: 2345, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop', category: '精选礼品' },
  { name: '高端红酒礼盒', price: 599, originalPrice: 899, stock: 80, sales: 456, image: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400&h=400&fit=crop', category: '精选礼品' },
  // 母婴用品
  { name: '婴儿纯棉连体衣', price: 79, originalPrice: 129, stock: 400, sales: 3456, image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=400&fit=crop', category: '母婴用品' },
  { name: '儿童益智玩具套装', price: 149, originalPrice: 229, stock: 300, sales: 876, image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop', category: '母婴用品' },
  { name: '婴儿推车轻便折叠', price: 899, originalPrice: 1399, stock: 60, sales: 543, image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=400&h=400&fit=crop', category: '母婴用品' },
  { name: '宝宝辅食料理机', price: 299, originalPrice: 499, stock: 150, sales: 1234, image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop', category: '母婴用品' },
  { name: '儿童绘本故事书套装', price: 59, originalPrice: 99, stock: 500, sales: 4567, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop', category: '母婴用品' },
  // 运动户外
  { name: '运动透气跑步鞋', price: 259, originalPrice: 399, stock: 300, sales: 3421, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', category: '运动户外' },
  { name: '瑜伽垫加厚防滑', price: 99, originalPrice: 159, stock: 400, sales: 2345, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop', category: '运动户外' },
  { name: '户外登山背包 50L', price: 349, originalPrice: 549, stock: 120, sales: 876, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', category: '运动户外' },
  { name: '速干运动T恤', price: 69, originalPrice: 119, stock: 500, sales: 5678, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', category: '运动户外' },
  { name: '可折叠哑铃套装', price: 199, originalPrice: 329, stock: 200, sales: 1567, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop', category: '运动户外' },
  // 珠宝手表
  { name: '简约时尚石英手表', price: 499, originalPrice: 799, stock: 100, sales: 876, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop', category: '珠宝手表' },
  { name: '925银项链吊坠', price: 299, originalPrice: 499, stock: 150, sales: 1234, image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=400&h=400&fit=crop', category: '珠宝手表' },
  { name: '珍珠耳环套装', price: 199, originalPrice: 329, stock: 200, sales: 2345, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop', category: '珠宝手表' },
  { name: '钛钢手链男款', price: 159, originalPrice: 259, stock: 250, sales: 1567, image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop', category: '珠宝手表' },
  { name: '情侣对戒礼盒', price: 699, originalPrice: 999, stock: 80, sales: 543, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop', category: '珠宝手表' },
  // 办公文具
  { name: '多功能笔记本套装', price: 49, originalPrice: 79, stock: 600, sales: 3456, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop', category: '办公文具' },
  { name: '桌面收纳整理架', price: 89, originalPrice: 139, stock: 400, sales: 2345, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop', category: '办公文具' },
  { name: '无线蓝牙键盘鼠标套装', price: 199, originalPrice: 299, stock: 250, sales: 1876, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop', category: '办公文具' },
  { name: '护眼LED台灯', price: 159, originalPrice: 249, stock: 300, sales: 2134, image: 'https://images.unsplash.com/photo-1534105615256-13940a56ff44?w=400&h=400&fit=crop', category: '办公文具' },
  { name: '人体工学办公椅', price: 899, originalPrice: 1399, stock: 60, sales: 567, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=400&fit=crop', category: '办公文具' },
]

async function main() {
  console.log('Seeding database...')

  // 清空旧数据
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.address.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // 创建分类
  const categoryMap = {}
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat })
    categoryMap[cat.name] = created.id
  }
  console.log(`Created ${categories.length} categories`)

  // 创建商品
  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        description: `${p.name} - 品质保障，正品发货`,
        price: p.price,
        image: p.image,
        stock: p.stock,
        sales: p.sales,
        categoryId: categoryMap[p.category],
      },
    })
  }
  console.log(`Created ${products.length} products`)

  // 创建测试用户
  const hashedPassword = await bcrypt.hash('123456', 10)
  await prisma.user.create({
    data: {
      name: '张小明',
      email: 'test@unishop.com',
      password: hashedPassword,
    },
  })
  console.log('Created test user: test@unishop.com / 123456')

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
