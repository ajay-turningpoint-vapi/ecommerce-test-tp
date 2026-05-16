import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import BannerSlider from '@/components/banners/BannerSlider';
import PromoBanner from '@/components/banners/PromoBanner';
import DualBanner from '@/components/banners/DualBanner';
import { useDbProducts } from '@/hooks/useDbProducts';
import { useDbCategories } from '@/hooks/useDbCategories';
import { useSyncExternalStore } from 'react';
import { getBanners, subscribe, getVersion } from '@/data/adminSharedData';
import bannerDesktop from '@/assets/banners/banner-desktop.jpg';
import bannerMobile from '@/assets/banners/banner-mobile.jpg';

const Index = () => {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  const { data: products = [] } = useDbProducts();
  const { data: catData } = useDbCategories();
  const categories = catData?.categories || [];

  const allBanners = getBanners();
  const banners = allBanners
    .filter(b => b.isActive)
    .map(b => ({ image: b.image, mobileImage: bannerMobile, alt: b.title, link: b.link || undefined }));

  const currentHits = products.slice(0, 5);
  const recommended = products.slice(5, 11);
  const trendingDeals = products.slice(11, 16);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Slider */}
      <section className="container mx-auto px-4 mt-4">
        {banners.length > 0 && <BannerSlider banners={banners} />}
      </section>

      {/* Current Hits */}
      <section className="container mx-auto px-4 mt-8">
        <h2 className="text-lg font-bold">Our current hits</h2>
        <p className="text-sm text-muted-foreground">Here's what everyone's loving!</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
          {currentHits.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Dual Banner Row */}
      {banners.length >= 2 && (
        <section className="container mx-auto px-4 mt-8">
          <DualBanner
            left={{ image: banners[0].image, title: banners[0].alt, subtitle: '', link: banners[0].link || '#' }}
            right={{ image: banners[1].image, title: banners[1].alt, subtitle: '', link: banners[1].link || '#' }}
          />
        </section>
      )}

      {/* Categories */}
      <section className="container mx-auto px-4 mt-8">
        <h2 className="text-lg font-bold">What's trending today?</h2>
        <p className="text-sm text-muted-foreground">Explore our wide range of beauty products!</p>
        <div className="mt-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth">
          <div className="grid grid-rows-2 grid-flow-col auto-cols-max gap-x-6 gap-y-4 pb-2 w-max [&>*]:snap-start">
            {categories.map(cat => (
              <Link key={cat.id} to={`/category/${cat.slug}`} className="flex flex-col items-center gap-2 group w-20">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <span className="text-xs font-medium text-center line-clamp-2">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width Banner */}
      {banners.length >= 3 && (
        <section className="container mx-auto px-4 mt-8">
          <PromoBanner image={banners[2].image} title={banners[2].alt} subtitle="" cta="Shop Now" variant="full" link={banners[2].link || '#'} />
        </section>
      )}

      {/* Top Deals */}
      <section className="container mx-auto px-4 mt-8">
        <h2 className="text-lg font-bold">Top Deals</h2>
        <p className="text-sm text-muted-foreground">Don't miss out on these offers!</p>
        <div className="grid grid-cols-2 md:grid-cols-[1fr_2fr_1fr] gap-4 mt-4">
          {banners.length >= 4 && (
            <PromoBanner image={banners[3].image} title={banners[3].alt} subtitle="" variant="vertical" link={banners[3].link || '#'} className="hidden md:block" />
          )}
          <div className="grid grid-cols-2 gap-4 col-span-2 md:col-span-1">
            {(trendingDeals.length > 0 ? trendingDeals.slice(0, 4) : currentHits.slice(0, 4)).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {banners.length >= 5 && (
            <PromoBanner image={banners[4].image} title={banners[4].alt} subtitle="" variant="vertical" link={banners[4].link || '#'} className="hidden md:block" />
          )}
        </div>
      </section>

      {/* Bottom Banner */}
      {banners.length >= 6 && (
        <section className="container mx-auto px-4 mt-8">
          <PromoBanner image={banners[banners.length - 1].image} title={banners[banners.length - 1].alt} variant="horizontal" link={banners[banners.length - 1].link || '#'} />
        </section>
      )}

      {/* Recommended */}
      <section className="container mx-auto px-4 mt-8">
        <h2 className="text-lg font-bold italic">Recommended for you</h2>
        <p className="text-sm text-muted-foreground">Picked just for you!</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
          {recommended.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
