import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, X, ChevronDown, ChevronUp, Truck, CreditCard, Smartphone, Banknote, Building } from 'lucide-react';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Address, Order } from '@/types';

const steps = ['Sign Up', 'Address', 'Payment'];

const Checkout = () => {
  const { items, totalItems, totalPrice, totalSavings, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(user ? 1 : 0);
  const [showBag, setShowBag] = useState(false);

  // Address form
  const [address, setAddress] = useState<Partial<Address>>({
    pincode: '', house: '', road: '', name: user?.name || '', phone: user?.phone || '', email: user?.email || '', isDefault: true,
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savedAddress, setSavedAddress] = useState<Address | null>(null);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSaveAddress = () => {
    const addr: Address = {
      id: Date.now().toString(),
      pincode: address.pincode || '',
      house: address.house || '',
      road: address.road || '',
      name: address.name || '',
      phone: address.phone || '',
      email: address.email || '',
      isDefault: true,
    };
    setSavedAddress(addr);
    setShowAddressForm(false);
    setStep(2);
  };

  const handlePlaceOrder = () => {
    const order: Order = {
      id: Date.now().toString(),
      orderNumber: Math.floor(100000 + Math.random() * 900000).toString(),
      items: [...items],
      address: savedAddress!,
      paymentMethod,
      subtotal: totalPrice,
      delivery: 0,
      total: totalPrice,
      savings: totalSavings,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Processing',
    };
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    clearCart();
    navigate(`/order/${order.id}`);
  };

  const paymentMethods = [
    { id: 'upi', label: 'UPI', desc: 'Pay by any UPI app', icon: Smartphone },
    { id: 'card', label: 'Credit/Debit Card', desc: 'Visa, Mastercard & more', icon: CreditCard },
    { id: 'cod', label: 'Cash on Delivery', desc: 'Pay at your doorstep', icon: Banknote },
    { id: 'netbanking', label: 'NetBanking', desc: 'Pay through your favourite bank', icon: Building },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Stepper */}
      <div className="flex items-center justify-center gap-0 px-4 py-4 md:py-6">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold ${
                i < step ? 'bg-success text-success-foreground' : i === step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {i < step ? <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4" /> : i + 1}
              </div>
              <span className={`text-xs md:text-sm font-medium ${i <= step ? 'text-foreground' : 'text-muted-foreground'}`}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`w-8 md:w-20 h-0.5 mx-1.5 md:mx-3 ${i < step ? 'bg-success' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-3 md:px-4 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Main content */}
          <div className="md:col-span-2">
            {/* Step 0: Login redirect */}
            {step === 0 && (
              <div className="rounded-lg border border-border p-6">
                <h2 className="text-lg font-bold">Please login to continue</h2>
                <button
                  onClick={() => navigate('/login?redirect=/checkout')}
                  className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground"
                >
                  Login / Sign Up
                </button>
              </div>
            )}

            {/* Step 1: Address */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold">Choose Address</h2>
                <p className="text-sm text-muted-foreground">Detailed address will help our delivery partner reach your doorstep quickly</p>

                {savedAddress && !showAddressForm ? (
                  <div className="mt-4 rounded-lg border border-border p-4">
                    <p className="font-medium">{savedAddress.house}, {savedAddress.road}, {savedAddress.pincode}</p>
                    <button onClick={() => setStep(2)} className="mt-3 rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground">
                      Continue
                    </button>
                  </div>
                ) : !showAddressForm ? (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="mt-4 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-8 w-full md:w-72 text-primary font-medium"
                  >
                    <span className="text-2xl">+</span> Add New Address
                  </button>
                ) : null}

                {showAddressForm && (
                  <div className="mt-4 rounded-lg border border-border p-4 md:p-6 max-w-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold">Add New Address</h3>
                      <button onClick={() => setShowAddressForm(false)}><X className="h-5 w-5" /></button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Address</label>
                        <input placeholder="Pincode" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
                      </div>
                      <input placeholder="House/ Flat/ Office No." value={address.house} onChange={e => setAddress({ ...address, house: e.target.value })}
                        className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
                      <textarea placeholder="Road Name/ Area /Colony" value={address.road} onChange={e => setAddress({ ...address, road: e.target.value })}
                        className="w-full rounded-lg border border-border px-3 py-2 text-sm" rows={3} />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Use as default address</span>
                        <div className="w-10 h-5 rounded-full bg-primary relative cursor-pointer">
                          <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-primary-foreground" />
                        </div>
                      </div>
                      <div className="pt-2">
                        <h4 className="text-sm font-bold">Contact</h4>
                        <p className="text-xs text-muted-foreground">Information provided here will be used to contact you for delivery updates</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium">Name</label>
                        <input value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })}
                          className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium">Phone</label>
                        <input placeholder="Phone" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })}
                          className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium">Email ID (Optional)</label>
                        <input value={address.email} onChange={e => setAddress({ ...address, email: e.target.value })}
                          className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
                      </div>
                      <button onClick={handleSaveAddress}
                        className="w-full rounded-lg bg-primary py-3 text-sm font-bold uppercase text-primary-foreground">
                        Ship to this address
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold">Choose payment method</h2>
                <p className="text-sm text-muted-foreground">Choose the payment method you prefer</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold mb-2">Payment Method Options</h3>
                    {paymentMethods.map(pm => (
                      <button
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                          paymentMethod === pm.id ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        <pm.icon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{pm.label}</p>
                          <p className="text-xs text-muted-foreground">{pm.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="rounded-lg border border-border p-6">
                    {paymentMethod === 'upi' && (
                      <>
                        <h3 className="font-bold">Pay with UPI</h3>
                        <div className="mt-3">
                          <label className="text-sm font-medium">Enter UPI ID</label>
                          <input placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)}
                            className="w-full mt-1 rounded-lg border border-border px-3 py-2 text-sm" />
                        </div>
                      </>
                    )}
                    {paymentMethod === 'card' && <h3 className="font-bold">Enter Card Details</h3>}
                    {paymentMethod === 'cod' && <h3 className="font-bold">Cash on Delivery</h3>}
                    {paymentMethod === 'netbanking' && <h3 className="font-bold">Select Bank</h3>}

                    <button
                      onClick={handlePlaceOrder}
                      className="mt-4 md:mt-6 w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground"
                    >
                      Pay ₹{totalPrice}
                    </button>
                  </div>
                </div>

                <button onClick={() => setStep(1)} className="mt-4 text-sm text-muted-foreground hover:text-foreground">
                  ← Back to Address
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-lg border border-border p-4">
              <button onClick={() => setShowBag(!showBag)} className="flex justify-between items-center w-full">
                <span className="font-bold">Bag</span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  {totalItems} Items {showBag ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              </button>
              {showBag && (
                <div className="mt-3 space-y-2">
                  {items.map(item => {
                    const v = item.product.variants.find(v => v.id === item.variantId)!;
                    return (
                      <div key={item.product.id + item.variantId} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.product.name}</span>
                        <span>₹{v.price * item.quantity}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border p-4">
              <h3 className="font-bold">Price Details</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-success font-semibold">FREE</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
              {totalSavings > 0 && (
                <div className="mt-3 rounded-lg bg-success/10 py-2 text-center text-sm text-success font-medium">
                  You are saving ₹{totalSavings}
                </div>
              )}
            </div>

            {savedAddress && (
              <div className="rounded-lg border border-border p-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Deliver to</span>
                  <button onClick={() => setStep(1)} className="text-sm text-primary font-medium">Change</button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{savedAddress.house}, {savedAddress.road}, {savedAddress.pincode}</p>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground px-2">
              <Truck className="h-4 w-4 shrink-0" />
              Authentic Products. Secure Payments. Easy Return & Exchange.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
