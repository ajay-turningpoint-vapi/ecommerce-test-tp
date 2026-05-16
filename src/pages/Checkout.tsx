import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, X, ChevronDown, ChevronUp, Truck, CreditCard, Smartphone, Banknote, Building } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Address, Order } from '@/types';

const steps = ['Sign Up', 'Address', 'Payment'];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];

interface AddressFormData {
  name: string; phone: string; house: string; road: string; landmark: string;
  city: string; state: string; pincode: string;
}

const emptyAddress: AddressFormData = { name: '', phone: '', house: '', road: '', landmark: '', city: '', state: '', pincode: '' };

const Checkout = () => {
  const { items, totalItems, totalPrice, totalSavings, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(user ? 1 : 0);
  const [showBag, setShowBag] = useState(false);

  // Load saved addresses from localStorage
  const savedAddresses: Address[] = JSON.parse(localStorage.getItem('addresses') || '[]');

  // Address form
  const [addrForm, setAddrForm] = useState<AddressFormData>({
    ...emptyAddress,
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [addrErrors, setAddrErrors] = useState<Partial<AddressFormData>>({});
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    savedAddresses.find(a => a.isDefault) || savedAddresses[0] || null
  );

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const validateAddress = (): boolean => {
    const errors: Partial<AddressFormData> = {};
    if (!addrForm.name.trim()) errors.name = 'Name is required';
    if (!addrForm.phone.trim() || !/^[6-9]\d{9}$/.test(addrForm.phone.trim())) errors.phone = 'Valid 10-digit phone required';
    if (!addrForm.house.trim()) errors.house = 'House/Flat number is required';
    if (!addrForm.road.trim()) errors.road = 'Road/Area is required';
    if (!addrForm.city.trim()) errors.city = 'City is required';
    if (!addrForm.state) errors.state = 'State is required';
    if (!addrForm.pincode.trim() || !/^\d{6}$/.test(addrForm.pincode.trim())) errors.pincode = 'Valid 6-digit pincode required';
    setAddrErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAddress = () => {
    if (!validateAddress()) return;
    const addr: Address = {
      id: Date.now().toString(),
      ...addrForm,
      email: user?.email || '',
      isDefault: savedAddresses.length === 0,
    };
    const allAddresses = [...savedAddresses, addr];
    localStorage.setItem('addresses', JSON.stringify(allAddresses));
    setSelectedAddress(addr);
    setShowAddressForm(false);
    setStep(2);
  };

  const handleSelectAddress = (addr: Address) => {
    setSelectedAddress(addr);
    setStep(2);
  };

  const saveOrderAndRedirect = (paymentId: string) => {
    const order: Order = {
      id: Date.now().toString(),
      orderNumber: Math.floor(100000 + Math.random() * 900000).toString(),
      items: [...items],
      address: selectedAddress!,
      paymentMethod,
      subtotal: totalPrice,
      delivery: 0,
      total: totalPrice,
      savings: totalSavings,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Processing',
      paymentId,
    };
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    clearCart();
    navigate(`/order/${order.id}`);
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'cod') {
      saveOrderAndRedirect('COD');
      return;
    }
    const options = {
      key: 'rzp_test_SP6LMvYbb7pF1E',
      amount: totalPrice * 100,
      currency: 'INR',
      name: 'Super Beauty',
      description: `Order of ${totalItems} item(s)`,
      handler: (response: { razorpay_payment_id: string }) => {
        toast.success('Payment successful!');
        saveOrderAndRedirect(response.razorpay_payment_id);
      },
      prefill: {
        name: selectedAddress?.name || user?.name || '',
        email: selectedAddress?.email || user?.email || '',
        contact: selectedAddress?.phone || user?.phone || '',
      },
      theme: { color: '#e91e63' },
      modal: { ondismiss: () => toast.error('Payment cancelled') },
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const paymentMethods = [
    { id: 'upi', label: 'UPI', desc: 'Pay by any UPI app', icon: Smartphone },
    { id: 'card', label: 'Credit/Debit Card', desc: 'Visa, Mastercard & more', icon: CreditCard },
    { id: 'cod', label: 'Cash on Delivery', desc: 'Pay at your doorstep', icon: Banknote },
    { id: 'netbanking', label: 'NetBanking', desc: 'Pay through your favourite bank', icon: Building },
  ];

  const inputClass = (err?: string) => `w-full mt-1 rounded-lg border ${err ? 'border-destructive' : 'border-border'} px-3 py-2 text-sm bg-background`;

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
            {/* Step 0: Login */}
            {step === 0 && (
              <div className="rounded-lg border border-border p-6">
                <h2 className="text-lg font-bold">Please login to continue</h2>
                <button onClick={() => navigate('/login?redirect=/checkout')}
                  className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground">
                  Login / Sign Up
                </button>
              </div>
            )}

            {/* Step 1: Address */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold">Choose Address</h2>
                <p className="text-sm text-muted-foreground">Detailed address will help our delivery partner reach your doorstep quickly</p>

                {/* Saved addresses */}
                {savedAddresses.length > 0 && !showAddressForm && (
                  <div className="space-y-3 mt-4">
                    {savedAddresses.map(addr => (
                      <div key={addr.id} className={`rounded-lg border p-4 cursor-pointer transition-colors ${
                        selectedAddress?.id === addr.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`} onClick={() => setSelectedAddress(addr)}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{addr.name} <span className="text-muted-foreground">• {addr.phone}</span></p>
                            <p className="text-sm text-muted-foreground mt-1">{addr.house}, {addr.road}{addr.landmark ? `, ${addr.landmark}` : ''}</p>
                            <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</p>
                            {addr.isDefault && <span className="inline-block mt-1 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>}
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedAddress?.id === addr.id ? 'border-primary' : 'border-muted-foreground/30'
                          }`}>
                            {selectedAddress?.id === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-3 mt-2">
                      <button onClick={() => handleSelectAddress(selectedAddress!)}
                        disabled={!selectedAddress}
                        className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50">
                        Deliver Here
                      </button>
                      <button onClick={() => { setShowAddressForm(true); setAddrErrors({}); setAddrForm({ ...emptyAddress, name: user?.name || '', phone: user?.phone || '' }); }}
                        className="rounded-lg border border-border px-6 py-2 text-sm font-medium text-primary hover:bg-accent">
                        + Add New Address
                      </button>
                    </div>
                  </div>
                )}

                {/* No saved addresses */}
                {savedAddresses.length === 0 && !showAddressForm && (
                  <button onClick={() => setShowAddressForm(true)}
                    className="mt-4 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 md:p-8 w-full md:w-72 text-primary font-medium text-sm">
                    <span className="text-2xl">+</span> Add New Address
                  </button>
                )}

                {/* Address Form - same as Profile */}
                {showAddressForm && (
                  <div className="mt-4 rounded-lg border border-border p-4 md:p-6 max-w-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold">Add New Address</h3>
                      <button onClick={() => setShowAddressForm(false)}><X className="h-5 w-5" /></button>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium">Full Name *</label>
                          <input value={addrForm.name} onChange={e => setAddrForm({ ...addrForm, name: e.target.value })}
                            className={inputClass(addrErrors.name)} placeholder="Full Name" />
                          {addrErrors.name && <p className="text-xs text-destructive mt-0.5">{addrErrors.name}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-medium">Phone *</label>
                          <input value={addrForm.phone} onChange={e => setAddrForm({ ...addrForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                            className={inputClass(addrErrors.phone)} placeholder="10-digit phone" />
                          {addrErrors.phone && <p className="text-xs text-destructive mt-0.5">{addrErrors.phone}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium">House / Flat / Office No. *</label>
                        <input value={addrForm.house} onChange={e => setAddrForm({ ...addrForm, house: e.target.value })}
                          className={inputClass(addrErrors.house)} placeholder="House / Flat / Office No." />
                        {addrErrors.house && <p className="text-xs text-destructive mt-0.5">{addrErrors.house}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-medium">Road / Area / Colony *</label>
                        <textarea value={addrForm.road} onChange={e => setAddrForm({ ...addrForm, road: e.target.value })}
                          className={inputClass(addrErrors.road)} rows={2} placeholder="Road / Area / Colony" />
                        {addrErrors.road && <p className="text-xs text-destructive mt-0.5">{addrErrors.road}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-medium">Landmark (Optional)</label>
                        <input value={addrForm.landmark} onChange={e => setAddrForm({ ...addrForm, landmark: e.target.value })}
                          className={inputClass()} placeholder="Near School, Temple etc." />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium">City *</label>
                          <input value={addrForm.city} onChange={e => setAddrForm({ ...addrForm, city: e.target.value })}
                            className={inputClass(addrErrors.city)} placeholder="City" />
                          {addrErrors.city && <p className="text-xs text-destructive mt-0.5">{addrErrors.city}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-medium">Pincode *</label>
                          <input value={addrForm.pincode} onChange={e => setAddrForm({ ...addrForm, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                            className={inputClass(addrErrors.pincode)} placeholder="6-digit pincode" />
                          {addrErrors.pincode && <p className="text-xs text-destructive mt-0.5">{addrErrors.pincode}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium">State *</label>
                        <select value={addrForm.state} onChange={e => setAddrForm({ ...addrForm, state: e.target.value })}
                          className={inputClass(addrErrors.state)}>
                          <option value="">Select State</option>
                          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {addrErrors.state && <p className="text-xs text-destructive mt-0.5">{addrErrors.state}</p>}
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
                      <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                        className={`w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                          paymentMethod === pm.id ? 'border-primary bg-primary/5' : 'border-border'
                        }`}>
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

                    <button onClick={handlePlaceOrder}
                      className="mt-4 md:mt-6 w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground">
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

            {selectedAddress && (
              <div className="rounded-lg border border-border p-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Deliver to</span>
                  <button onClick={() => setStep(1)} className="text-sm text-primary font-medium">Change</button>
                </div>
                <p className="text-sm font-medium mt-1">{selectedAddress.name}</p>
                <p className="text-xs text-muted-foreground">{selectedAddress.house}, {selectedAddress.road}</p>
                <p className="text-xs text-muted-foreground">{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
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
