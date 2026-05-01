import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/data/products';
import heroBanner from '@/assets/hero-banner.jpg';

const Index = () => {
  const currentHits = products.slice(0, 5);
  const recommended = products.slice(5, 11);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Banner */}
      <section className="relative mx-4 mt-4 rounded-xl overflow-hidden md:mx-8">
        <img src={heroBanner} alt="Beauty essentials" className="w-full h-48 md:h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center">
          <div className="px-6 md:px-10 max-w-md">
            <h1 className="text-xl md:text-3xl font-bold text-primary-foreground leading-tight">
              Premium Beauty<br />Products You'll Love
            </h1>
            <p className="text-xs md:text-sm text-primary-foreground/80 mt-1">Exciting offers only for you!</p>
            <p className="text-sm md:text-lg font-bold text-primary-foreground mt-2">Starting at ₹149</p>
          </div>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary-foreground flex items-center justify-center">
            <ArrowRight className="h-4 w-4 text-primary" />
          </button>
        </div>
      </section>

      {/* Current Hits */}
      <section className="container mx-auto px-4 mt-10">
        <h2 className="text-lg font-bold">Our current hits</h2>
        <p className="text-sm text-muted-foreground">Here's what everyone's loving!</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
          {currentHits.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="mx-4 md:mx-8 mt-10 rounded-xl bg-primary px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">💄</span>
          <span className="text-sm font-bold text-primary-foreground uppercase">
            Glowing Skin Essentials{' '}
            <span className="text-primary-foreground/80 font-normal">all under ₹499</span>
          </span>
        </div>
        <ArrowRight className="h-5 w-5 text-primary-foreground" />
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 mt-10">
        <h2 className="text-lg font-bold">What's trending today?</h2>
        <p className="text-sm text-muted-foreground">Explore our wide range of beauty products!</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 mt-6">
          {categories.map(cat => (
            <Link key={cat.id} to={`/category/${cat.slug}`} className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <span className="text-xs font-medium text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended */}
      <section className="container mx-auto px-4 mt-10">
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
