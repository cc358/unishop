import { HeroBanner } from '../components/v0/HeroBanner'
import { CategoryGrid } from '../components/v0/CategoryGrid'
import { PromoBanners } from '../components/v0/PromoBanners'
import { NewArrivals } from '../components/v0/NewArrivals'
import { FlashSale } from '../components/v0/FlashSale'
import { RecommendedShops } from '../components/v0/RecommendedShops'
import { HotProducts } from '../components/v0/HotProducts'
import { TrustBadges } from '../components/v0/TrustBadges'

function Home() {
  return (
    <div>
      <HeroBanner />
      <CategoryGrid />
      <PromoBanners />
      <NewArrivals />
      <FlashSale />
      <RecommendedShops />
      <HotProducts />
      <TrustBadges />
    </div>
  )
}

export default Home
