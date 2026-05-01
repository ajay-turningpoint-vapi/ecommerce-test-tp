import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products, categories, subCategories } from '@/data/products';

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find(c => c.slug === slug);
  const subs = subCategories.filter(s => s.categoryId === category?.id);
  const [activeSub, setActiveSub] = useState('all');

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Category not found</h1>
          <Link to="/" className="text-primary mt-4 inline-block">Go Home</Link>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(p => {
    if (p.categoryId !== category.id) return false;
    if (activeSub === 'all') return true;
    return p.subCategoryId === activeSub;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-4">
        <div className="text-sm text-muted-foreground mb-2">
          <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-primary">{category.name}</span>
        </div>

        <h1 className="text-xl font-bold">{category.name}</h1>

        {/* Sub-category pills */}
        {subs.length > 0 && (
          <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
            {subs.map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSub(sub.slug === 'all' ? 'all' : sub.id)}
                className={`flex flex-col items-center gap-1 shrink-0 ${
                  (sub.slug === 'all' && activeSub === 'all') || activeSub === sub.id
                    ? 'opacity-100'
                    : 'opacity-60 hover:opacity-80'
                }`}
              >
                <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${
                  (sub.slug === 'all' && activeSub === 'all') || activeSub === sub.id
                    ? 'border-primary'
                    : 'border-border'
                }`}>
                  <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-medium">{sub.name}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium">
            ☰ Filters
          </button>
          <button className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" /> 30min delivery
          </button>
        </div>

        <p className="text-sm text-muted-foreground mt-3">{filteredProducts.length} items available</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        {/* Recommended */}
        <div className="mt-10">
          <h2 className="text-lg font-bold italic">Recommended for you</h2>
          <p className="text-sm text-muted-foreground">You might also like these</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {products.filter(p => p.categoryId !== category.id).slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Category;
