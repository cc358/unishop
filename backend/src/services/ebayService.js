const https = require('https')

const BASE_URL = process.env.EBAY_ENV === 'production'
  ? 'https://api.ebay.com'
  : 'https://api.sandbox.ebay.com'

let cachedToken = null
let tokenExpiry = 0

// 获取 OAuth Access Token (Client Credentials Grant)
async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken
  }

  const credentials = Buffer.from(
    `${process.env.EBAY_APP_ID}:${process.env.EBAY_CERT_ID}`
  ).toString('base64')

  const body = 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope'

  const data = await request(`${BASE_URL}/identity/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    },
    body,
  })

  cachedToken = data.access_token
  // 提前 5 分钟过期
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000
  return cachedToken
}

// 搜索商品
async function searchProducts(keyword, limit = 20, offset = 0, options = {}) {
  const token = await getAccessToken()
  const q = encodeURIComponent(keyword)
  let url = `${BASE_URL}/buy/browse/v1/item_summary/search?q=${q}&limit=${limit}&offset=${offset}`
  const filters = []
  if (options.minPrice && options.maxPrice) filters.push(`price:[${options.minPrice}..${options.maxPrice}],priceCurrency:USD`)
  else if (options.minPrice) filters.push(`price:[${options.minPrice}..],priceCurrency:USD`)
  else if (options.maxPrice) filters.push(`price:[..${options.maxPrice}],priceCurrency:USD`)
  if (filters.length) url += `&filter=${filters.join(',')}`

  const data = await request(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    },
  })

  if (!data.itemSummaries) {
    return { total: 0, items: [] }
  }

  return {
    total: data.total || 0,
    items: data.itemSummaries.map(item => ({
      id: item.itemId,
      title: item.title,
      price: item.price ? parseFloat(item.price.value) : 0,
      currency: item.price?.currency || 'USD',
      image: item.image?.imageUrl || item.thumbnailImages?.[0]?.imageUrl || '',
      condition: item.condition || '',
      seller: item.seller?.username || '',
      sellerFeedbackScore: item.seller?.feedbackScore || 0,
      sellerFeedbackPercentage: item.seller?.feedbackPercentage || '',
      itemWebUrl: item.itemWebUrl || '',
      shippingCost: item.shippingOptions?.[0]?.shippingCost?.value || '0.00',
    })),
  }
}

// 获取商品详情（含变体规格）
async function getProductDetail(itemId) {
  const token = await getAccessToken()
  const headers = { 'Authorization': `Bearer ${token}`, 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US' }

  const data = await request(`${BASE_URL}/buy/browse/v1/item/${itemId}`, { method: 'GET', headers })

  const result = {
    id: data.itemId,
    title: data.title,
    price: data.price ? parseFloat(data.price.value) : 0,
    currency: data.price?.currency || 'USD',
    images: data.image?.imageUrl
      ? [data.image.imageUrl, ...(data.additionalImages || []).map(i => i.imageUrl)]
      : [],
    condition: data.condition || '',
    description: data.shortDescription || data.description || '',
    seller: {
      username: data.seller?.username || '',
      feedbackScore: data.seller?.feedbackScore || 0,
      feedbackPercentage: data.seller?.feedbackPercentage || '',
    },
    itemWebUrl: data.itemWebUrl || '',
    shippingOptions: (data.shippingOptions || []).map(opt => ({
      type: opt.shippingServiceCode || '',
      cost: opt.shippingCost?.value || '0.00',
      currency: opt.shippingCost?.currency || 'USD',
    })),
    categoryPath: data.categoryPath || '',
    aspects: (data.localizedAspects || []).map(a => ({
      name: a.name,
      values: a.value ? [a.value] : [],
    })),
    variantSpecs: [],
    hasVariants: false,
  }

  // 检查是否有变体组
  const groupId = data.primaryItemGroup?.itemGroupId
  if (groupId) {
    try {
      const groupData = await request(
        `${BASE_URL}/buy/browse/v1/item/get_items_by_item_group?item_group_id=${groupId}`,
        { method: 'GET', headers }
      )

      if (groupData.items && groupData.items.length > 0) {
        // 提取规格名 → { value → { price, available } }
        const specMap = {}
        for (const variant of groupData.items) {
          const price = variant.price ? parseFloat(variant.price.value) : 0
          const available = variant.estimatedAvailabilities?.[0]?.estimatedAvailabilityStatus !== 'OUT_OF_STOCK'
          for (const aspect of (variant.localizedAspects || [])) {
            if (!aspect.value) continue
            if (!specMap[aspect.name]) specMap[aspect.name] = {}
            if (!specMap[aspect.name][aspect.value]) {
              specMap[aspect.name][aspect.value] = { price, available }
            }
          }
        }

        // 过滤出有多选项的规格（2-30个值）
        const variantSpecs = Object.entries(specMap)
          .filter(([_, vals]) => Object.keys(vals).length >= 2 && Object.keys(vals).length <= 30)
          .map(([name, vals]) => ({
            name,
            values: Object.entries(vals)
              .sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }))
              .map(([value, info]) => ({ value, price: info.price, available: info.available })),
          }))

        result.variantSpecs = variantSpecs
        result.hasVariants = variantSpecs.length > 0
      }
    } catch {
      // itemGroup API 失败不影响主流程
    }
  }

  return result
}

// HTTP 请求工具
function request(url, options) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const reqOptions = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    }

    const req = https.request(reqOptions, (res) => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        try {
          const data = JSON.parse(body)
          if (res.statusCode >= 400) {
            const errMsg = data.errors?.[0]?.longMessage || data.error_description || data.message || `HTTP ${res.statusCode}`
            reject(new Error(errMsg))
          } else {
            resolve(data)
          }
        } catch {
          reject(new Error(`Invalid JSON response: ${body.substring(0, 200)}`))
        }
      })
    })

    req.on('error', reject)
    req.setTimeout(15000, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })

    if (options.body) req.write(options.body)
    req.end()
  })
}

module.exports = { getAccessToken, searchProducts, getProductDetail }
