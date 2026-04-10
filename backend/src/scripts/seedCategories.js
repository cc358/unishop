require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const categories = [
  { name: "饮品酒水", children: ["矿泉水","果汁","碳酸饮料","乳饮","茶类","啤酒","白酒","鸡尾酒","葡萄酒"] },
  { name: "男士服装", children: ["领带","领结","男士T恤","男士衬衫","男士帽子","男士内衣和袜子","男士皮带","男士皮夹克","男士上衣","男士睡衣","男士外套","男士西装","男士下装","男士鞋子","男士正装","运动套装","风衣夹克","帽子手套围巾","男士保暖内衣","男士毛衣针织衫","外套羽绒服"] },
  { name: "女士服装", children: ["女款衬衫","女士短裤","女士帽子","女士牛仔裤","女士裙子","女士上衣","女士睡衣","女士外套","女士西装","女士鞋子","女士腰带及皮带","女士长裤","袜子","眼镜和太阳镜","内衣内裤","手套","风衣夹克","帽子手套围巾","女士保暖内衣","女士毛衣针织衫","外套羽绒服"] },
  { name: "零食甜点", children: ["坚果","甜点","蛋糕","果冻","面筋","肉干"] },
  { name: "休闲渔具", children: ["路亚","鱼竿","鱼钩","渔网","鱼线","鱼饵","鱼漂","沉子","抄网","钓箱"] },
  { name: "手机配件", children: ["充电器充电线","拍照配件","屏幕保护膜","手机","手机壳和保护套","手机维修工具","手机移动电源","手机支架"] },
  { name: "防疫物品", children: ["防护服","防护面罩","防护鞋套","护目镜","酒精和消毒剂","温度计","一次性手套","医用口罩","医用头罩"] },
  { name: "办公文具", children: ["办公室配件","办公小电器","办公装订用品","办公桌收纳","胶带粘合剂","美术用品","日历卡片","书写和修正用品","文具贴纸","邮件运输用品","纸和笔记本"] },
  { name: "电脑配件", children: ["笔记本电脑","打印机和扫描仪","电脑组装配件","键盘和鼠标","联网设备","平板电脑","台式机","投影仪及配件","显示器"] },
  { name: "数码产品", children: ["耳机和头戴式耳机","其他智能设备","麦克风","扬声器","相机","相机配件","智能手表和配件","智能追踪器","家庭影院系统","电视盒","电视和配件","视频游戏设备"] },
  { name: "户外运动", children: ["冬季运动","高尔夫球","户外发电机","户外服装和鞋子","户外休闲","健身和健美","旅行用品","手电筒","水上运动","野营装备","渔具","远足和攀岩","运动防护装备","运动男装","运动女装","自行车配件"] },
  { name: "居家橱柜", children: ["厨房电器","家具橱柜","风扇和空调设备","家电配件","家庭音响和剧院","净水设备","空气净化器","清洁设备","洗衣干衣电器"] },
  { name: "美妆美肤", children: ["除臭剂和止汗剂","化妆工具","化妆品","口红","脸部","美甲用品","美容仪器","皮肤护理","剃须刀和脱毛","头发护理和造型","卫生保健","牙齿和口腔护理","眼睛和睫毛"] },
  { name: "母婴用品", children: ["婴儿服装","宝宝和妈妈","奶粉","肚围肚兜","口水巾食饭衣","尿不湿","手套脚套","婴儿帽类","婴儿推车","婴儿玩具"] },
  { name: "珠宝手表", children: ["女士手表","男士手表","珠宝首饰","项链和吊坠","女士手链","耳环","戒指","脚链","头饰和胸针","首饰套装","钥匙扣和饰品"] },
  { name: "儿童玩具", children: ["布绒玩具","金属玩具","木质玩具","启蒙玩具","塑料玩具"] },
  { name: "奢侈品", children: ["包包","服装","手表","艺术品","珠宝"] },
  { name: "节日装饰", children: [] },
  { name: "童装", children: ["儿童包包","男童服装","男童裤子","男童内衣和袜子","男童上衣和T恤","男童睡衣","男童外套","男童鞋","女童服饰","女童裤子","女童内衣和袜子","女童裙子","女童上衣和T恤","女童睡衣","女童套装","女童外套","女童鞋","女童配饰","男童配饰","装扮道具"] },
  { name: "男士包包", children: [] },
  { name: "女士包包", children: [] },
]

// 商品名→父分类 映射（用于重新分配现有商品）
const productCategoryMap = [
  { keywords: ['phone','iphone','samsung','galaxy','smartphone','android','mobile','cell phone','charger','cable','screen protector','phone case','power bank','phone stand'], category: '手机配件' },
  { keywords: ['laptop','computer','macbook','notebook','desktop','monitor','keyboard','mouse','printer','tablet','ipad','scanner','projector'], category: '电脑配件' },
  { keywords: ['headphone','earphone','earbud','airpod','speaker','bluetooth','camera','gopro','drone','microphone','watch','smartwatch','tv','television','gaming','console','playstation','xbox','nintendo'], category: '数码产品' },
  { keywords: ['shoe','sneaker','boot','sandal','slipper','jordan','nike','adidas','running shoe','trainer'], category: '户外运动' },
  { keywords: ['shirt','dress','jacket','coat','pant','jean','hoodie','sweater','blouse','skirt','clothing','fashion','t-shirt','polo','vest','suit','tie','belt'], category: '男士服装' },
  { keywords: ['women','lady','ladies','girl','female','bra','lingerie','bikini'], category: '女士服装' },
  { keywords: ['bag','handbag','backpack','purse','wallet','luggage','tote'], category: '女士包包' },
  { keywords: ['cream','serum','beauty','makeup','skincare','moisturizer','sunscreen','lipstick','foundation','mascara','perfume','cologne','lotion','shampoo','hair'], category: '美妆美肤' },
  { keywords: ['furniture','sofa','table','chair','desk','lamp','shelf','bed','mattress','curtain','pillow','decor','rug','mirror','kitchen','appliance','blender','mixer','cooker','microwave','vacuum','iron','washer','dryer','fridge','refrigerator','air condition','fan'], category: '居家橱柜' },
  { keywords: ['food','snack','chocolate','coffee','tea','candy','protein','vitamin','supplement','organic','spice','sauce','drink','juice','water','beer','wine'], category: '饮品酒水' },
  { keywords: ['sport','fitness','gym','yoga','dumbbell','bicycle','bike','hiking','camping','outdoor','tent','fishing','ball','basketball','football','soccer','tennis','golf','swim'], category: '户外运动' },
  { keywords: ['ring','necklace','bracelet','earring','jewelry','watch','pendant','chain'], category: '珠宝手表' },
  { keywords: ['baby','infant','toddler','stroller','diaper','nursing'], category: '母婴用品' },
  { keywords: ['toy','puzzle','lego','doll','robot','game board'], category: '儿童玩具' },
  { keywords: ['mask','glove','sanitizer','thermometer','protective','medical'], category: '防疫物品' },
  { keywords: ['office','pen','notebook','paper','stapler','folder','desk organizer','sticker'], category: '办公文具' },
  { keywords: ['fish','fishing','rod','reel','lure','hook','bait'], category: '休闲渔具' },
  { keywords: ['kid','boy','girl','children','child'], category: '童装' },
]

function matchCategory(productName) {
  const name = productName.toLowerCase()
  for (const mapping of productCategoryMap) {
    if (mapping.keywords.some(kw => name.includes(kw))) {
      return mapping.category
    }
  }
  return null
}

async function main() {
  console.log('=== 分类结构初始化 ===\n')

  // 1. 先把所有商品的 categoryId 设为 null
  await prisma.product.updateMany({ data: { categoryId: null } })
  console.log('已清空商品分类关联')

  // 2. 删除所有现有分类
  await prisma.category.deleteMany()
  console.log('已清空旧分类')

  // 3. 创建新的父子分类
  let parentCount = 0
  let childCount = 0
  const parentMap = {} // name → id

  for (const cat of categories) {
    const parent = await prisma.category.create({
      data: { name: cat.name },
    })
    parentMap[cat.name] = parent.id
    parentCount++

    for (const childName of cat.children) {
      await prisma.category.create({
        data: { name: childName, parentId: parent.id },
      })
      childCount++
    }
  }

  console.log(`创建 ${parentCount} 个父分类, ${childCount} 个子分类`)

  // 4. 重新分配商品到父分类
  const products = await prisma.product.findMany({
    where: { name: { not: '__EBAY_PLACEHOLDER__' } },
    select: { id: true, name: true },
  })

  let assigned = 0
  let unassigned = 0

  for (const product of products) {
    const catName = matchCategory(product.name)
    if (catName && parentMap[catName]) {
      await prisma.product.update({
        where: { id: product.id },
        data: { categoryId: parentMap[catName] },
      })
      assigned++
    } else {
      unassigned++
    }
  }

  // 把未分配的商品放到"居家橱柜"作为默认
  if (unassigned > 0 && parentMap['居家橱柜']) {
    await prisma.product.updateMany({
      where: { categoryId: null, name: { not: '__EBAY_PLACEHOLDER__' } },
      data: { categoryId: parentMap['居家橱柜'] },
    })
  }

  console.log(`\n商品分配: ${assigned} 已分类, ${unassigned} 未匹配(归入居家橱柜)`)

  // 5. 打印统计
  const stats = await prisma.category.findMany({
    where: { parentId: null },
    include: { _count: { select: { products: true } }, children: true },
  })

  console.log('\n分类统计:')
  for (const cat of stats) {
    console.log(`  ${cat.name}: ${cat._count.products} 个商品, ${cat.children.length} 个子分类`)
  }

  const total = await prisma.product.count({ where: { name: { not: '__EBAY_PLACEHOLDER__' } } })
  console.log(`\n总商品: ${total}`)
}

main()
  .catch(err => { console.error('失败:', err); process.exit(1) })
  .finally(() => prisma.$disconnect())
