import { Link } from 'react-router-dom';
import { Plus, Minus, ChevronDown } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/types';

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const { items, addItem, updateQuantity } = useCart();
  const variant = product.variants[0];
  const cartItem = items.find(i => i.product.id === product.id && i.variantId === variant.id);
  const qty = cartItem?.quantity || 0;

  return (
    <div className="group rounded-lg border border-border bg-card overflow-hidden">
      <Link to={`/product/${product.slug}`} className="block relative">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.variants.length > 1 ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground shadow-sm">
            View Variants
          </span>
        ) : qty === 0 ? (
          <button
            onClick={e => {
              e.preventDefault();
              addItem(product, variant.id);
            }}
            className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg border border-primary bg-background px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        ) : (
          <div
            onClick={e => e.preventDefault()}
            className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg border border-primary bg-background overflow-hidden"
          >
            <button
              onClick={e => { e.preventDefault(); updateQuantity(product.id, variant.id, qty - 1); }}
              className="px-2 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors text-primary"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-2 text-xs font-bold text-primary">{qty}</span>
            <button
              onClick={e => { e.preventDefault(); updateQuantity(product.id, variant.id, qty + 1); }}
              className="px-2 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors text-primary"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        )}
      </Link>
      <div className="p-3">
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold line-clamp-1">{product.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-0.5">{product.weight}{product.pieces ? ` | ${product.pieces}` : ''}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-bold">₹{variant.price}</span>
          {variant.mrp > variant.price && (
            <>
              <span className="text-xs text-muted-foreground line-through">₹{variant.mrp}</span>
              <span className="text-xs font-semibold text-success">{product.discount}% off</span>
            </>
          )}
        </div>
        <p className="text-xs text-success mt-1 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-success" />
          Delivery in {product.deliveryTime}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
