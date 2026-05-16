import { useParams, Link } from 'react-router-dom';
import ProductImageGallery from '@/components/ProductImageGallery';
import { useState, useEffect, useMemo } from 'react';
import { Package, Truck, Plus, Minus, AlertCircle, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import PromoBanner from '@/components/banners/PromoBanner';
import DualBanner from '@/components/banners/DualBanner';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';
import ProductDetailSkeleton from '@/components/skeletons/ProductDetailSkeleton';
import ShareProduct from '@/components/ShareProduct';
import RecentlyViewed from '@/components/RecentlyViewed';
import { useDbProducts, useDbProduct } from '@/hooks/useDbProducts';
import { useDbCategories } from '@/hooks/useDbCategories';
import { useCart } from '@/contexts/CartContext';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { getStockInfo } from '@/lib/stock';
import freeShipping from '@/assets/banners/free-shipping.jpg';
import glowUp from '@/assets/banners/glow-up-sale.jpg';
import newArrivals from '@/assets/banners/new-arrivals.jpg';

// Common color name → hex mapping for swatches
const COLOR_HEX: Record<string, string> = {
  red: '#EF4444', ruby: '#E11D48', rose: '#F43F5E', pink: '#EC4899', fuchsia: '#D946EF',
  purple: '#A855F7', violet: '#8B5CF6', indigo: '#6366F1', blue: '#3B82F6', sky: '#0EA5E9',
  cyan: '#06B6D4', teal: '#14B8A6', emerald: '#10B981', green: '#22C55E', lime: '#84CC16',
  yellow: '#EAB308', amber: '#F59E0B', orange: '#F97316', brown: '#92400E', chocolate: '#7B3F00',
  beige: '#F5F5DC', ivory: '#FFFFF0', cream: '#FFFDD0', gold: '#FFD700', silver: '#C0C0C0',
  black: '#1F2937', white: '#F9FAFB', grey: '#6B7280', gray: '#6B7280', nude: '#E8C4A8',
  coral: '#FF7F50', peach: '#FFCBA4', maroon: '#800000', burgundy: '#800020', navy: '#1E3A5F',
  mauve: '#E0B0FF', lavender: '#E6E6FA', mint: '#98FF98', olive: '#808000', charcoal: '#36454F',
  'rose gold': '#B76E79', copper: '#B87333', bronze: '#CD7F32', taupe: '#483C32',
};

function getColorHex(colorValue: string): string | null {
  const lower = colorValue.toLowerCase().trim();
  if (/^#[0-9a-f]{3,8}$/i.test(lower)) return lower;
  for (const [name, hex] of Object.entries(COLOR_HEX)) {
    if (lower.includes(name)) return hex;
  }
  return null;
}

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading: productLoading } = useDbProduct(slug);
  const { data: products = [] } = useDbProducts();
  const { data: catData } = useDbCategories();
  const categories = catData?.categories || [];
  const { items, addItem, updateQuantity } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(0);

  useEffect(() => {
    setSelectedVariant(0);
  }, [slug]);

  // Build attribute options across all variants
  const { attributeMap, isColorAttr } = useMemo(() => {
    if (!product?.variantAttributes) return { attributeMap: {} as Record<string, { values: string[]; variantIndices: Record<string, number[]> }>, isColorAttr: {} as Record<string, boolean> };
    const map: Record<string, { values: string[]; variantIndices: Record<string, number[]> }> = {};
    const colorCheck: Record<string, boolean> = {};

    product.variants.forEach((v, idx) => {
      const attrs = product.variantAttributes?.[v.id] || [];
      attrs.forEach(attr => {
        if (!map[attr.name]) {
          map[attr.name] = { values: [], variantIndices: {} };
        }
        if (!map[attr.name].values.includes(attr.value)) {
          map[attr.name].values.push(attr.value);
        }
        if (!map[attr.name].variantIndices[attr.value]) {
          map[attr.name].variantIndices[attr.value] = [];
        }
        map[attr.name].variantIndices[attr.value].push(idx);
        // Check if this is a color attribute
        const isColor = attr.name.toLowerCase().includes('color') || attr.name.toLowerCase().includes('colour') || attr.name.toLowerCase().includes('shade');
        if (isColor) colorCheck[attr.name] = true;
      });
    });

    return { attributeMap: map, isColorAttr: colorCheck };
  }, [product]);

  if (!productLoading && !product) {
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

  const variant = product?.variants[selectedVariant];
  const cartItem = product && variant ? items.find(i => i.product.id === product.id && i.variantId === variant.id) : undefined;
  const qty = cartItem?.quantity || 0;
  const category = categories.find(c => c.id === product?.categoryId);
  const related = products.filter(p => p.categoryId === product?.categoryId && p.id !== product?.id).slice(0, 5);

  // Get current variant's attribute values
  const currentAttrs: Record<string, string> = {};
  if (product && variant && product.variantAttributes?.[variant.id]) {
    product.variantAttributes[variant.id].forEach(a => { currentAttrs[a.name] = a.value; });
  }

  const handleAttributeChange = (attrName: string, value: string) => {
    if (!product?.variantAttributes) return;
    // Find the best matching variant
    const indices = attributeMap[attrName]?.variantIndices[value] || [];
    if (indices.length === 1) {
      setSelectedVariant(indices[0]);
    } else if (indices.length > 1) {
      // Try to find one that matches other current attributes
      const best = indices.find(idx => {
        const vAttrs = product.variantAttributes?.[product.variants[idx].id] || [];
        return Object.entries(currentAttrs).every(([k, v]) => k === attrName || vAttrs.some(a => a.name === k && a.value === v));
      });
      setSelectedVariant(best ?? indices[0]);
    }
  };

  const hasAttributes = Object.keys(attributeMap).length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-4">
        <div className="text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link>
          {' / '}
          <Link to={`/category/${category?.slug}`} className="hover:text-primary">{category?.name}</Link>
          {' / '}
          <span className="text-primary">{product?.name}</span>
        </div>

        {productLoading || !product || !variant ? (
          <ProductDetailSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image gallery with thumbnails */}
            <ProductImageGallery images={product.images?.length ? product.images : [product.image]} name={product.name} />

            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              {product.brandName && (
                <p className="text-sm font-medium text-primary mt-0.5">by {product.brandName}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">{product.tags.join(' | ')}</p>

              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Package className="h-4 w-4" /> {product.weight}</span>
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

              {product.specifications && product.specifications.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-bold">Specifications</h3>
                  {product.specifications.map((spec: { key: string; value: string }, i: number) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <span className="font-medium min-w-[120px]">{spec.key}:</span>
                      <span className="text-muted-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Attribute-based variant selection */}
              {hasAttributes && (
                <div className="mt-4 space-y-4">
                  {Object.entries(attributeMap).map(([attrName, { values }]) => {
                    const isColor = isColorAttr[attrName];
                    const currentVal = currentAttrs[attrName] || '';

                    return (
                      <div key={attrName}>
                        <h3 className="text-sm font-bold mb-2">{attrName}: <span className="font-normal text-muted-foreground">{currentVal}</span></h3>
                        {isColor ? (
                          <div className="flex gap-2 flex-wrap">
                            {values.map(val => {
                              const hex = getColorHex(val);
                              const selected = currentVal === val;
                              return (
                                <button
                                  key={val}
                                  onClick={() => handleAttributeChange(attrName, val)}
                                  title={val}
                                  className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                                    selected ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-border hover:border-primary/50'
                                  }`}
                                >
                                  {hex ? (
                                    <span className="w-6 h-6 rounded-full block" style={{ backgroundColor: hex }} />
                                  ) : (
                                    <span className="text-[9px] font-medium leading-tight text-center">{val.slice(0, 3)}</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <select
                            value={currentVal}
                            onChange={e => handleAttributeChange(attrName, e.target.value)}
                            className="rounded-lg border border-border bg-background px-3 py-2 text-sm min-w-[140px]"
                          >
                            {values.map(val => (
                              <option key={val} value={val}>{val}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Simple variant buttons (when no attributes) */}
              {!hasAttributes && product.variants.length > 1 && (
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
              {productLoading
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
