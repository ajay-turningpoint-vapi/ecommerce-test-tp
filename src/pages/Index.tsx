import { Link } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import BannerSlider from '@/components/banners/BannerSlider';
import PromoBanner from '@/components/banners/PromoBanner';
import DualBanner from '@/components/banners/DualBanner';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';
import BannerSkeleton from '@/components/skeletons/BannerSkeleton';
import CategorySkeleton from '@/components/skeletons/CategorySkeleton';
import { useDbProducts } from '@/hooks/useDbProducts';
import { useDbCategories } from '@/hooks/useDbCategories';
import heroBanner from '@/assets/hero-banner.jpg';
import sale50 from '@/assets/banners/sale-50-off.jpg';
import newArrivals from '@/assets/banners/new-arrivals.jpg';
import glowUp from '@/assets/banners/glow-up-sale.jpg';
import freeShipping from '@/assets/banners/free-shipping.jpg';
import fragrances from '@/assets/banners/fragrances-vertical.jpg';
import lipFest from '@/assets/banners/lip-fest-vertical.jpg';
import hairCare from '@/assets/banners/hair-care-week.jpg';

const Index = () => {
  const { data: products = [], isLoading: productsLoading } = useDbProducts();
  const { data: catData, isLoading: catsLoading } = useDbCategories();
  const categories = catData?.categories || [];

  const loading = productsLoading || catsLoading;

  const currentHits = products.slice(0, 5);
  const recommended = products.slice(5, 11);
  const trendingDeals = products.slice(11, 16);

  const heroSlides = [
    { image: heroBanner, alt: 'Premium Beauty Products' },
    { image: sale50, alt: 'Flat 50% Off Sale' },
    { image: newArrivals, alt: 'New Arrivals' },
    { image: glowUp, alt: 'Glow Up Sale' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Slider */}
      <section className="mx-4 mt-4 md:mx-8">
        {loading ? <BannerSkeleton variant="hero" /> : <BannerSlider banners={heroSlides} />}
      </section>

      {/* Small Strip Banner */}
      <section className="mx-4 md:mx-8 mt-4">
        {loading ? <BannerSkeleton variant="small" /> : <PromoBanner title="Free Shipping" subtitle="on orders above ₹499" variant="small" link="/category/skincare" />}
      </section>

      {/* Current Hits */}
      <section className="container mx-auto px-4 mt-8">
        <h2 className="text-lg font-bold">Our current hits</h2>
        <p className="text-sm text-muted-foreground">Here's what everyone's loving!</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : currentHits.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Dual Banner Row */}
      <section className="mx-4 md:mx-8 mt-8">
        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            <BannerSkeleton variant="horizontal" />
            <BannerSkeleton variant="horizontal" />
          </div>
        ) : (
          <DualBanner
            left={{ image: sale50, title: 'Mega Sale', subtitle: 'Up to 50% off', link: '/category/skincare' }}
            right={{ image: hairCare, title: 'Hair Care Week', subtitle: 'Best deals on hair products', link: '/category/haircare' }}
          />
        )}
      </section>

      {/* Promo Banner */}
      <section className="mx-4 md:mx-8 mt-6">
        {loading ? <BannerSkeleton variant="small" /> : <PromoBanner title="Glowing Skin Essentials" subtitle="all under ₹499" variant="small" link="/category/skincare" bgColor="bg-primary" />}
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 mt-8">
        <h2 className="text-lg font-bold">What's trending today?</h2>
        <p className="text-sm text-muted-foreground">Explore our wide range of beauty products!</p>
        <div className="mt-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth">
          <div className="grid grid-rows-2 grid-flow-col auto-cols-max gap-x-6 gap-y-4 pb-2 w-max [&>*]:snap-start">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => <CategorySkeleton key={i} />)
              : categories.map(cat => (
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
      <section className="mx-4 md:mx-8 mt-8">
        {loading ? <BannerSkeleton variant="horizontal" /> : <PromoBanner image={newArrivals} title="New Arrivals" subtitle="Discover the latest beauty trends" cta="Shop Now" variant="full" link="/category/new-arrivals" />}
      </section>

      {/* Top Deals */}
      <section className="container mx-auto px-4 mt-8">
        <h2 className="text-lg font-bold">Top Deals</h2>
        <p className="text-sm text-muted-foreground">Don't miss out on these offers!</p>
        <div className="grid grid-cols-2 md:grid-cols-[1fr_2fr_1fr] gap-4 mt-4">
          {loading ? <BannerSkeleton variant="vertical" className="hidden md:block" /> : <PromoBanner image={fragrances} title="Exclusive Fragrances" subtitle="Starting ₹299" variant="vertical" link="/category/fragrance" className="hidden md:block" />}
          <div className="grid grid-cols-2 gap-4 col-span-2 md:col-span-1">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : (trendingDeals.length > 0 ? trendingDeals.slice(0, 4) : currentHits.slice(0, 4)).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {loading ? <BannerSkeleton variant="vertical" className="hidden md:block" /> : <PromoBanner image={lipFest} title="Lip Fest" subtitle="All lip products on sale" variant="vertical" link="/category/lip-care" className="hidden md:block" />}
        </div>
      </section>

      {/* Glow Up Banner */}
      <section className="mx-4 md:mx-8 mt-8">
        {loading ? <BannerSkeleton variant="horizontal" /> : <PromoBanner image={glowUp} title="Glow Up Sale" subtitle="Skincare at unbeatable prices" cta="Explore" variant="full" link="/category/skincare" />}
      </section>

      {/* Recommended */}
      <section className="container mx-auto px-4 mt-8">
        <h2 className="text-lg font-bold italic">Recommended for you</h2>
        <p className="text-sm text-muted-foreground">Picked just for you!</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : recommended.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="mx-4 md:mx-8 mt-8">
        {loading ? <BannerSkeleton variant="horizontal" /> : <PromoBanner image={freeShipping} title="Free Shipping on ₹499+" variant="horizontal" link="/category/bestsellers" />}
      </section>

      <Footer />
    </div>
  );
};

export default Index;
