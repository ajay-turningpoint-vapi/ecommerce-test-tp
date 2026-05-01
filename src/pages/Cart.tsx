import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';

const Cart = () => {
  const { items, updateQuantity, removeItem, totalItems, totalPrice, totalSavings } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <Link to="/" className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-xl font-bold">Your Cart ({totalItems} items)</h1>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2 space-y-4">
            {items.map(item => {
              const variant = item.product.variants.find(v => v.id === item.variantId)!;
              return (
                <div key={`${item.product.id}-${item.variantId}`} className="flex items-center gap-4 rounded-lg border border-border p-4">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.product.weight} | {variant.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-sm">₹{variant.price * item.quantity}</span>
                      {variant.mrp > variant.price && (
                        <span className="text-xs text-muted-foreground line-through">₹{variant.mrp * item.quantity}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.variantId, item.quantity - 1)}
                      className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-accent"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.variantId, item.quantity + 1)}
                      className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-accent"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id, item.variantId)}
                      className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-border p-6 h-fit">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="text-success font-semibold">FREE</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="mt-6 block w-full rounded-lg bg-primary py-3 text-center text-sm font-bold text-primary-foreground"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
