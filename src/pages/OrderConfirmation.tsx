import { useParams, Link } from 'react-router-dom';
import { CheckCircle, MapPin, CreditCard } from 'lucide-react';
import Header from '@/components/Header';
import type { Order } from '@/types';

const OrderConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Order not found</h1>
          <Link to="/" className="text-primary mt-4 inline-block">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="rounded-lg border border-border p-8 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-success" />
          <h1 className="text-2xl font-bold mt-4">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mt-1">
            Your order <span className="font-bold text-foreground">#{order.orderNumber}</span> has been confirmed
          </p>
          <p className="text-sm text-muted-foreground">{order.date}</p>
        </div>

        <div className="rounded-lg border border-border p-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="font-bold flex items-center gap-2">
              <span className="text-primary">🎁</span> Order Details
            </h2>
            <span className="text-xs rounded-full border border-border px-3 py-1 font-medium">{order.status}</span>
          </div>
          <div className="mt-4 space-y-3">
            {order.items.map(item => {
              const v = item.product.variants.find(v => v.id === item.variantId)!;
              return (
                <div key={item.product.id + item.variantId} className="flex justify-between items-center border-b border-border pb-3">
                  <div>
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium">₹{v.price * item.quantity}</span>
                </div>
              );
            })}
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span><span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span className="text-success font-semibold">FREE</span>
            </div>
            <div className="flex justify-between font-bold border-t border-border pt-2">
              <span>Total</span><span>₹{order.total}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-bold text-sm flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Delivery Address</h3>
            <p className="text-sm text-muted-foreground mt-1">{order.address.house}, {order.address.road}, {order.address.pincode}</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-bold text-sm flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> Payment Method</h3>
            <p className="text-sm text-muted-foreground mt-1 capitalize">{order.paymentMethod}</p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Link to="/" className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Continue Shopping</Link>
          <Link to="/profile" className="rounded-lg border border-border px-6 py-3 text-sm font-bold">View All Orders</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
