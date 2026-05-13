import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Package, Layers, Users, Truck, Plus, Minus } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import PromoBanner from '@/components/banners/PromoBanner';
import DualBanner from '@/components/banners/DualBanner';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';
import ProductDetailSkeleton from '@/components/skeletons/ProductDetailSkeleton';
import { products, categories } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import freeShipping from '@/assets/banners/free-shipping.jpg';
import glowUp from '@/assets/banners/glow-up-sale.jpg';
import newArrivals from '@/assets/banners/new-arrivals.jpg';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find(p => p.slug === slug);
  const { items, addItem, updateQuantity } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link to="/" className="text-primary mt-4 inline-block">Go Home</Link>
        </div>
      </div>
    );
  }

  const variant = product.variants[selectedVariant];
  const cartItem = items.find(i => i.product.id === product.id && i.variantId === variant.id);
  const qty = cartItem?.quantity || 0;
  const category = categories.find(c => c.id === product.categoryId);
  const related = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-4">
        <div className="text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link>
          {' / '}
          <Link to={`/category/${category?.slug}`} className="hover:text-primary">{category?.name}</Link>
          {' / '}
          <span className="text-primary">{product.name}</span>
        </div>

        {loading ? (
          <ProductDetailSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl overflow-hidden border border-border">
              <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
            </div>

            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">{product.tags.join(' | ')}</p>

              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Package className="h-4 w-4" /> {product.weight}</span>
                {product.pieces && <span className="flex items-center gap-1"><Layers className="h-4 w-4" /> {product.pieces}</span>}
                {product.serves && <span className="flex items-center gap-1"><Users className="h-4 w-4" /> Serves {product.serves}</span>}
              </div>

              {product.discount >= 20 && (
                <div className="flex items-center justify-between mt-4 rounded-lg border border-border px-4 py-2">
                  <span className="text-sm font-medium">
                    {product.discount}% off + Free delivery <span className="text-muted-foreground">*For First 5 Orders</span>
                  </span>
                  <span className="rounded-md bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">Code: BEAUTY20</span>
                </div>
              )}

              <p className="text-sm mt-4">{product.description}</p>

              {product.ingredients && (
                <div className="mt-4">
                  <h3 className="text-sm font-bold">Key Ingredients</h3>
                  <p className="text-sm text-muted-foreground mt-1">{product.ingredients}</p>
                </div>
              )}

              {product.howToUse && (
                <div className="mt-3">
                  <h3 className="text-sm font-bold">How to Use</h3>
                  <p className="text-sm text-muted-foreground mt-1">{product.howToUse}</p>
                </div>
              )}

              {product.variants.length > 1 && (
                <div className="mt-4">
                  <h3 className="text-sm font-bold mb-2">Select Variant</h3>
                  <div className="flex gap-2 flex-wrap">
                    {product.variants.map((v, i) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(i)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                          i === selectedVariant
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {v.name} – {v.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mt-6">
                <div>
                  <span className="text-2xl font-bold">₹{variant.price}</span>
                  {variant.mrp > variant.price && (
                    <span className="text-sm text-success ml-2">{product.discount}% off</span>
                  )}
                  {variant.mrp > variant.price && (
                    <p className="text-sm text-muted-foreground">
                      MRP: <span className="line-through">₹{variant.mrp}</span> (incl. of all taxes)
                    </p>
                  )}
                </div>
                {qty === 0 ? (
                  <button
                    onClick={() => addItem(product, variant.id)}
                    className="ml-auto rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="ml-auto flex items-center gap-3 rounded-lg border border-primary overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product.id, variant.id, qty - 1)}
                      className="px-3 py-3 hover:bg-primary hover:text-primary-foreground transition-colors text-primary"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-bold text-primary min-w-[1.5rem] text-center">{qty}</span>
                    <button
                      onClick={() => updateQuantity(product.id, variant.id, qty + 1)}
                      className="px-3 py-3 hover:bg-primary hover:text-primary-foreground transition-colors text-primary"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-sm text-success mt-3 flex items-center gap-1">
                <Truck className="h-4 w-4" /> Delivery in {product.deliveryTime}
              </p>
            </div>
          </div>
        )}

        <PromoBanner title="Free Shipping" subtitle="on orders above ₹499" variant="small" link="/category/skincare" className="mt-8" />

        <DualBanner
          left={{ image: glowUp, title: 'Skincare Sale', subtitle: 'Up to 40% off', link: '/category/skincare' }}
          right={{ image: newArrivals, title: 'New Arrivals', subtitle: 'Trending now', link: '/category/new-arrivals' }}
          className="mt-6"
        />

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold">You may also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        <PromoBanner image={freeShipping} title="Free Shipping on ₹499+" variant="horizontal" link="/category/bestsellers" className="mt-8" />
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
