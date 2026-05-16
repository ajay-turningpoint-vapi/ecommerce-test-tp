import { useParams, Link } from 'react-router-dom';
import { CheckCircle, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import OrderTracker from '@/components/OrderTracker';
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
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="rounded-lg border border-border p-6 text-center">
          <CheckCircle className="mx-auto h-10 w-10 text-success" />
          <h1 className="text-xl font-bold mt-3">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Order <span className="font-bold text-foreground">#{order.orderNumber}</span> • {order.date}
          </p>
        </div>

        {/* Order Tracking */}
        <div className="rounded-lg border border-border p-5 mt-4">
          <h2 className="font-bold text-sm mb-4">Order Tracking</h2>
          <OrderTracker status={order.status} orderDate={order.date} />
        </div>

        {/* Order Items */}
        <div className="rounded-lg border border-border p-5 mt-4">
          <h2 className="font-bold text-sm mb-3">Order Items</h2>
          <div className="space-y-3">
            {order.items.map(item => {
              const v = item.product.variants.find(v => v.id === item.variantId)!;
              return (
                <div key={item.product.id + item.variantId} className="flex gap-3 items-center">
                  <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover border border-border" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} • {v.size}</p>
                  </div>
                  <span className="font-medium text-sm">₹{v.price * item.quantity}</span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-border mt-3 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span><span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span className="text-success font-semibold">FREE</span>
            </div>
            {order.savings > 0 && (
              <div className="flex justify-between text-success">
                <span>Savings</span><span>-₹{order.savings}</span>
              </div>
            )}
            <div className="flex justify-between font-bold border-t border-border pt-2">
              <span>Total</span><span>₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Delivery & Payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-bold text-sm flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Delivery Address</h3>
            <p className="text-xs text-muted-foreground mt-2">{order.address.name} • {order.address.phone}</p>
            <p className="text-xs text-muted-foreground">{order.address.house}, {order.address.road}</p>
            <p className="text-xs text-muted-foreground">{order.address.city}, {order.address.state} - {order.address.pincode}</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-bold text-sm flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> Payment</h3>
            <p className="text-sm text-muted-foreground mt-2 capitalize">{order.paymentMethod}</p>
            {order.paymentId && order.paymentId !== 'COD' && (
              <p className="text-xs text-muted-foreground mt-1">Txn: {order.paymentId}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
          <Link to="/" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground text-center">
            Continue Shopping
          </Link>
          <Link to="/profile" className="rounded-lg border border-border px-6 py-2.5 text-sm font-bold text-center flex items-center justify-center gap-1">
            View All Orders <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
