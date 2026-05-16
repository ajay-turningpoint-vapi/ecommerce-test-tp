import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, MapPin, LogOut, Plus, Edit2, Trash2, X, Camera, RotateCcw, ArrowLeftRight, Ban, HelpCircle, ChevronDown, ChevronUp, Mail, Phone, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import type { Order, Address } from '@/types';
import OrderTracker from '@/components/OrderTracker';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];

const CANCEL_REASONS = ['Changed my mind', 'Found better price elsewhere', 'Ordered by mistake', 'Delivery too slow', 'Other'];
const RETURN_REASONS = ['Defective/Damaged product', 'Wrong product received', 'Product not as described', 'Quality not satisfactory', 'Allergic reaction', 'Other'];
const EXCHANGE_REASONS = ['Wrong size/shade', 'Defective product', 'Received wrong item', 'Other'];

interface AddressFormData {
  name: string; phone: string; house: string; road: string; landmark: string;
  city: string; state: string; pincode: string;
}

const emptyAddress: AddressFormData = { name: '', phone: '', house: '', road: '', landmark: '', city: '', state: '', pincode: '' };

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3 text-left">
        <span className="text-sm font-medium">{question}</span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>
      {open && <p className="px-3 pb-3 text-xs text-muted-foreground">{answer}</p>}
    </div>
  );
};

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Address state
  const [addresses, setAddresses] = useState<Address[]>(() => JSON.parse(localStorage.getItem('addresses') || '[]'));
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState<AddressFormData>(emptyAddress);
  const [addrErrors, setAddrErrors] = useState<Partial<AddressFormData>>({});

  // Order action modal
  const [actionModal, setActionModal] = useState<{ type: 'cancel' | 'return' | 'exchange'; order: Order } | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [actionImage, setActionImage] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState('');

  useEffect(() => {
    localStorage.setItem('addresses', JSON.stringify(addresses));
  }, [addresses]);

  if (!user) { navigate('/login'); return null; }

  const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');

  const handleSave = () => {
    updateProfile({ name, phone });
    toast.success('Profile updated');
  };

  const handleLogout = () => { logout(); navigate('/'); };

  // Address validation
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
    if (editingId) {
      setAddresses(prev => prev.map(a => a.id === editingId ? { ...a, ...addrForm } : a));
      toast.success('Address updated');
    } else {
      const newAddr: Address = { id: Date.now().toString(), ...addrForm, email: user.email, isDefault: addresses.length === 0 };
      setAddresses(prev => [...prev, newAddr]);
      toast.success('Address added');
    }
    setShowAddressForm(false);
    setEditingId(null);
    setAddrForm(emptyAddress);
    setAddrErrors({});
  };

  const handleEditAddress = (addr: Address) => {
    setEditingId(addr.id);
    setAddrForm({ name: addr.name, phone: addr.phone, house: addr.house, road: addr.road, landmark: addr.landmark || '', city: addr.city, state: addr.state, pincode: addr.pincode });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast.success('Address deleted');
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    toast.success('Default address updated');
  };

  // Order actions
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setActionImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const submitOrderAction = () => {
    if (!actionModal) return;
    const reason = actionReason === 'Other' ? customReason : actionReason;
    if (!reason.trim()) { toast.error('Please select a reason'); return; }
    if ((actionModal.type === 'return' || actionModal.type === 'exchange') && !actionImage) {
      toast.error('Please upload a product image');
      return;
    }

    const allOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const idx = allOrders.findIndex(o => o.id === actionModal.order.id);
    if (idx >= 0) {
      if (actionModal.type === 'cancel') allOrders[idx].status = 'Cancelled';
      else if (actionModal.type === 'return') allOrders[idx].status = 'Return Requested';
      else if (actionModal.type === 'exchange') allOrders[idx].status = 'Exchange Requested';
      localStorage.setItem('orders', JSON.stringify(allOrders));
    }

    toast.success(`${actionModal.type === 'cancel' ? 'Order cancelled' : actionModal.type === 'return' ? 'Return requested' : 'Exchange requested'} successfully`);
    setActionModal(null);
    setActionReason('');
    setActionImage(null);
    setCustomReason('');
  };

  const canCancel = (status: string) => ['Pending', 'Confirmed', 'ORDER_PLACED'].includes(status);
  const canReturn = (status: string) => status === 'Delivered';
  const canExchange = (status: string) => status === 'Delivered';

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const inputClass = (err?: string) => `w-full mt-1 rounded-lg border ${err ? 'border-destructive' : 'border-border'} px-3 py-2 text-sm bg-background`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="rounded-lg border border-border p-4">
            <div className="mb-4">
              <p className="font-bold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-primary bg-primary/5' : 'hover:bg-accent'}`}>
                  <tab.icon className="h-4 w-4" /> {tab.label}
                </button>
              ))}
              <button onClick={handleLogout}
                className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/5">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="rounded-lg border border-border p-6 max-w-lg">
                <h2 className="text-lg font-bold">My Profile</h2>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} className={inputClass()} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <input value={email} disabled className={`${inputClass()} bg-muted`} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} className={inputClass()} />
                  </div>
                  <button onClick={handleSave} className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-lg font-bold">My Orders</h2>
                {orders.length === 0 ? (
                  <p className="text-muted-foreground mt-4">No orders yet.</p>
                ) : (
                  <div className="space-y-4 mt-4">
                    {orders.map(order => (
                      <div key={order.id} className="rounded-lg border border-border p-4">
                        <Link to={`/order/${order.id}`} className="block hover:bg-accent/50 transition-colors rounded-lg -m-1 p-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-bold text-sm">Order #{order.orderNumber}</p>
                              <p className="text-xs text-muted-foreground">{order.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-sm">₹{order.total}</p>
                              <span className="text-xs rounded-full border border-border px-2 py-0.5">{order.status}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {order.items.map(i => i.product.name).join(', ')}
                          </p>
                        </Link>
                        <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                          {canCancel(order.status) && (
                            <button onClick={() => { setActionModal({ type: 'cancel', order }); setActionReason(''); }}
                              className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-destructive text-destructive hover:bg-destructive/5 transition-colors">
                              <Ban className="h-3.5 w-3.5" /> Cancel
                            </button>
                          )}
                          {canReturn(order.status) && (
                            <button onClick={() => { setActionModal({ type: 'return', order }); setActionReason(''); setActionImage(null); }}
                              className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors">
                              <RotateCcw className="h-3.5 w-3.5" /> Return
                            </button>
                          )}
                          {canExchange(order.status) && (
                            <button onClick={() => { setActionModal({ type: 'exchange', order }); setActionReason(''); setActionImage(null); }}
                              className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors">
                              <ArrowLeftRight className="h-3.5 w-3.5" /> Exchange
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">My Addresses</h2>
                  <button onClick={() => { setShowAddressForm(true); setEditingId(null); setAddrForm(emptyAddress); setAddrErrors({}); }}
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    <Plus className="h-4 w-4" /> Add New
                  </button>
                </div>

                {addresses.length === 0 && !showAddressForm && (
                  <p className="text-muted-foreground mt-4 text-sm">No saved addresses. Add one to speed up checkout.</p>
                )}

                {/* Address list */}
                <div className="space-y-3 mt-4">
                  {addresses.map(addr => (
                    <div key={addr.id} className={`rounded-lg border p-4 ${addr.isDefault ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{addr.name} <span className="text-muted-foreground">• {addr.phone}</span></p>
                          <p className="text-sm text-muted-foreground mt-1">{addr.house}, {addr.road}{addr.landmark ? `, ${addr.landmark}` : ''}</p>
                          <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</p>
                          {addr.isDefault && <span className="inline-block mt-2 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>}
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => handleEditAddress(addr)} className="p-1.5 rounded hover:bg-accent"><Edit2 className="h-4 w-4" /></button>
                          <button onClick={() => handleDeleteAddress(addr.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                      {!addr.isDefault && (
                        <button onClick={() => handleSetDefault(addr.id)} className="mt-2 text-xs text-primary font-medium hover:underline">Set as default</button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Address form */}
                {showAddressForm && (
                  <div className="mt-4 rounded-lg border border-border p-5 max-w-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
                      <button onClick={() => { setShowAddressForm(false); setAddrErrors({}); }}><X className="h-5 w-5" /></button>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium">Full Name *</label>
                          <input value={addrForm.name} onChange={e => setAddrForm({ ...addrForm, name: e.target.value })} className={inputClass(addrErrors.name)} placeholder="Full Name" />
                          {addrErrors.name && <p className="text-xs text-destructive mt-0.5">{addrErrors.name}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-medium">Phone *</label>
                          <input value={addrForm.phone} onChange={e => setAddrForm({ ...addrForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} className={inputClass(addrErrors.phone)} placeholder="10-digit phone" />
                          {addrErrors.phone && <p className="text-xs text-destructive mt-0.5">{addrErrors.phone}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium">House / Flat / Office No. *</label>
                        <input value={addrForm.house} onChange={e => setAddrForm({ ...addrForm, house: e.target.value })} className={inputClass(addrErrors.house)} placeholder="House / Flat / Office No." />
                        {addrErrors.house && <p className="text-xs text-destructive mt-0.5">{addrErrors.house}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-medium">Road / Area / Colony *</label>
                        <textarea value={addrForm.road} onChange={e => setAddrForm({ ...addrForm, road: e.target.value })} className={inputClass(addrErrors.road)} rows={2} placeholder="Road / Area / Colony" />
                        {addrErrors.road && <p className="text-xs text-destructive mt-0.5">{addrErrors.road}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-medium">Landmark (Optional)</label>
                        <input value={addrForm.landmark} onChange={e => setAddrForm({ ...addrForm, landmark: e.target.value })} className={inputClass()} placeholder="Near School, Temple etc." />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium">City *</label>
                          <input value={addrForm.city} onChange={e => setAddrForm({ ...addrForm, city: e.target.value })} className={inputClass(addrErrors.city)} placeholder="City" />
                          {addrErrors.city && <p className="text-xs text-destructive mt-0.5">{addrErrors.city}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-medium">Pincode *</label>
                          <input value={addrForm.pincode} onChange={e => setAddrForm({ ...addrForm, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })} className={inputClass(addrErrors.pincode)} placeholder="6-digit pincode" />
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
                        className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground">
                        {editingId ? 'Update Address' : 'Save Address'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Help Tab */}
            {activeTab === 'help' && (
              <div>
                <h2 className="text-lg font-bold">Help & Support</h2>
                <p className="text-sm text-muted-foreground mt-1">We're here to help you with anything</p>

                {/* Contact Options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  <a href="mailto:support@superbeauty.com" className="rounded-lg border border-border p-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
                    <Mail className="h-6 w-6 mx-auto text-primary" />
                    <p className="font-medium text-sm mt-2">Email Us</p>
                    <p className="text-xs text-muted-foreground mt-1">support@superbeauty.com</p>
                  </a>
                  <a href="tel:+911234567890" className="rounded-lg border border-border p-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
                    <Phone className="h-6 w-6 mx-auto text-primary" />
                    <p className="font-medium text-sm mt-2">Call Us</p>
                    <p className="text-xs text-muted-foreground mt-1">+91 123 456 7890</p>
                  </a>
                  <a href="https://wa.me/911234567890" target="_blank" rel="noreferrer" className="rounded-lg border border-border p-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
                    <MessageCircle className="h-6 w-6 mx-auto text-primary" />
                    <p className="font-medium text-sm mt-2">WhatsApp</p>
                    <p className="text-xs text-muted-foreground mt-1">Chat with us</p>
                  </a>
                </div>

                {/* FAQs */}
                <h3 className="font-bold mt-6 mb-3">Frequently Asked Questions</h3>
                <div className="space-y-2">
                  {[
                    { q: 'How do I track my order?', a: 'Go to the Orders tab and click on any order to see real-time tracking with delivery timeline.' },
                    { q: 'What is the return policy?', a: 'We accept returns within 7 days of delivery. The product must be unused and in original packaging. Go to Orders → click Return.' },
                    { q: 'How do I exchange a product?', a: 'Go to Orders tab, find your delivered order, and click Exchange. Select a reason and upload a product photo.' },
                    { q: 'How long does delivery take?', a: 'Standard delivery takes 3-5 business days. Express delivery is available for select pincodes.' },
                    { q: 'How do I cancel an order?', a: 'You can cancel orders before they are shipped. Go to Orders tab and click Cancel on the order.' },
                    { q: 'Are the products authentic?', a: 'Yes! We source all products directly from brands and authorized distributors. 100% genuine guaranteed.' },
                    { q: 'How do I change my delivery address?', a: 'Go to the Addresses tab to add, edit, or set a default address. You can also change address during checkout.' },
                    { q: 'What payment methods are accepted?', a: 'We accept UPI, Credit/Debit cards, Net Banking, and Cash on Delivery.' },
                  ].map((faq, i) => (
                    <FaqItem key={i} question={faq.q} answer={faq.a} />
                  ))}
                </div>

                {/* Policies */}
                <h3 className="font-bold mt-6 mb-3">Policies</h3>
                <div className="space-y-2 text-sm">
                  <div className="rounded-lg border border-border p-4">
                    <p className="font-medium">Shipping Policy</p>
                    <p className="text-muted-foreground text-xs mt-1">Free shipping on all orders. Standard delivery in 3-5 business days.</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="font-medium">Return & Exchange Policy</p>
                    <p className="text-muted-foreground text-xs mt-1">7-day easy returns. Product must be unused with original packaging. Refund within 5-7 business days.</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="font-medium">Privacy Policy</p>
                    <p className="text-muted-foreground text-xs mt-1">Your data is secure. We never share personal information with third parties.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold capitalize">{actionModal.type} Order</h3>
              <button onClick={() => setActionModal(null)}><X className="h-5 w-5" /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Order #{actionModal.order.orderNumber}</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Reason *</label>
                <div className="mt-2 space-y-2">
                  {(actionModal.type === 'cancel' ? CANCEL_REASONS : actionModal.type === 'return' ? RETURN_REASONS : EXCHANGE_REASONS).map(r => (
                    <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="reason" value={r} checked={actionReason === r}
                        onChange={() => setActionReason(r)} className="accent-primary" />
                      {r}
                    </label>
                  ))}
                </div>
                {actionReason === 'Other' && (
                  <textarea value={customReason} onChange={e => setCustomReason(e.target.value)}
                    placeholder="Please describe your reason..."
                    className="w-full mt-2 rounded-lg border border-border px-3 py-2 text-sm" rows={3} />
                )}
              </div>

              {(actionModal.type === 'return' || actionModal.type === 'exchange') && (
                <div>
                  <label className="text-sm font-medium">Upload Product Image *</label>
                  <p className="text-xs text-muted-foreground mb-2">Please upload a clear photo of the product</p>
                  {actionImage ? (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border">
                      <img src={actionImage} alt="Uploaded" className="w-full h-full object-cover" />
                      <button onClick={() => setActionImage(null)}
                        className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-32 h-32 rounded-lg border-2 border-dashed border-border cursor-pointer hover:border-primary transition-colors">
                      <Camera className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">Add Photo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              )}

              <button onClick={submitOrderAction}
                className={`w-full rounded-lg py-2.5 text-sm font-bold text-primary-foreground ${actionModal.type === 'cancel' ? 'bg-destructive' : 'bg-primary'}`}>
                {actionModal.type === 'cancel' ? 'Cancel Order' : actionModal.type === 'return' ? 'Request Return' : 'Request Exchange'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
