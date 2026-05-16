import { Package, CheckCircle, Truck, Home, Clock, XCircle } from 'lucide-react';

const ORDER_STEPS = [
  { key: 'ORDER_PLACED', label: 'Order Placed', icon: Package, desc: 'Your order has been placed successfully' },
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle, desc: 'Seller has confirmed your order' },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck, desc: 'Your order is on its way' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck, desc: 'Your order is nearby' },
  { key: 'DELIVERED', label: 'Delivered', icon: Home, desc: 'Order delivered successfully' },
];

const STATUS_MAP: Record<string, number> = {
  'Processing': 0, 'ORDER_PLACED': 0, 'Pending': 0,
  'Confirmed': 1, 'CONFIRMED': 1,
  'Shipped': 2, 'SHIPPED': 2,
  'Out for Delivery': 3, 'OUT_FOR_DELIVERY': 3,
  'Delivered': 4, 'DELIVERED': 4,
};

interface OrderTrackerProps {
  status: string;
  orderDate: string;
}

const OrderTracker = ({ status, orderDate }: OrderTrackerProps) => {
  const isCancelled = ['Cancelled', 'CANCELLED', 'Return Requested', 'Exchange Requested'].includes(status);
  const currentStep = isCancelled ? -1 : (STATUS_MAP[status] ?? 0);

  if (isCancelled) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex items-center gap-3">
          <XCircle className="h-6 w-6 text-destructive" />
          <div>
            <p className="font-bold text-sm">{status}</p>
            <p className="text-xs text-muted-foreground">This order has been {status.toLowerCase()}</p>
          </div>
        </div>
      </div>
    );
  }

  // Generate estimated dates
  const base = new Date(orderDate);
  const addDays = (d: Date, n: number) => {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const stepDates = [
    orderDate,
    addDays(base, 1),
    addDays(base, 2),
    addDays(base, 4),
    addDays(base, 5),
  ];

  return (
    <div className="py-2">
      <div className="relative">
        {ORDER_STEPS.map((step, i) => {
          const done = i <= currentStep;
          const active = i === currentStep;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="flex gap-3 relative">
              {/* Vertical line */}
              {i < ORDER_STEPS.length - 1 && (
                <div className={`absolute left-[15px] top-[32px] w-0.5 h-[calc(100%-8px)] ${i < currentStep ? 'bg-success' : 'bg-border'}`} />
              )}

              {/* Icon */}
              <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                done ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
              } ${active ? 'ring-2 ring-success/30' : ''}`}>
                {done && i < currentStep ? <CheckCircle className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
              </div>

              {/* Content */}
              <div className={`pb-6 ${i === ORDER_STEPS.length - 1 ? 'pb-0' : ''}`}>
                <p className={`text-sm font-medium ${done ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</p>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {done ? stepDates[i] : `Expected: ${stepDates[i]}`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;
