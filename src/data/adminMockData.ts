import { products, categories } from './products';
import type { Order, Address } from '@/types';

const sampleAddress: Address = {
  id: 'addr1', pincode: '400001', house: '12A, Rose Apartments',
  road: 'MG Road, Andheri West', name: 'Priya Sharma', phone: '+91 9876543210',
  email: 'priya@email.com', isDefault: true,
};

const statuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested'];
const paymentMethods = ['UPI', 'Card', 'COD', 'NetBanking'];
const customerNames = ['Priya Sharma', 'Rahul Verma', 'Anita Patel', 'Vikram Singh', 'Meera Joshi', 'Arjun Reddy', 'Sneha Gupta', 'Karan Malhotra'];

function randomItem<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

export function generateMockOrders(count = 50): Order[] {
  const orders: Order[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const product = randomItem(products);
    const variant = randomItem(product.variants);
    const qty = randomInt(1, 3);
    const subtotal = variant.price * qty;
    const delivery = subtotal > 500 ? 0 : 40;
    const daysAgo = randomInt(0, 30);
    const date = new Date(now - daysAgo * 86400000);
    const name = randomItem(customerNames);
    orders.push({
      id: `ord-${i + 1}`,
      orderNumber: `SB${String(10000 + i)}`,
      items: [{ product, variantId: variant.id, quantity: qty }],
      address: { ...sampleAddress, id: `addr-${i}`, name, email: `${name.toLowerCase().replace(' ', '.')}@email.com` },
      paymentMethod: randomItem(paymentMethods),
      subtotal, delivery, total: subtotal + delivery,
      savings: (variant.mrp - variant.price) * qty,
      date: date.toISOString(),
      status: randomItem(statuses),
      paymentId: `pay_${Date.now()}_${i}`,
    });
  }
  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export interface StockItem {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  currentStock: number;
  reservedStock: number;
  lowStockThreshold: number;
}

export function generateMockStock(): StockItem[] {
  return products.flatMap(p =>
    p.variants.map(v => ({
      productId: p.id, productName: p.name,
      variantId: v.id, variantName: v.name,
      currentStock: randomInt(0, 200),
      reservedStock: randomInt(0, 20),
      lowStockThreshold: 10,
    }))
  );
}

export interface CustomerData {
  id: string; name: string; email: string; phone: string;
  totalOrders: number; totalSpent: number; joinDate: string;
  status: 'Active' | 'Blocked';
}

export function generateMockCustomers(count = 20): CustomerData[] {
  return Array.from({ length: count }, (_, i) => {
    const name = randomItem(customerNames) + ` ${i}`;
    return {
      id: `cust-${i}`, name, email: `${name.toLowerCase().replace(/\s/g, '.')}@email.com`,
      phone: `+91 ${randomInt(7000000000, 9999999999)}`,
      totalOrders: randomInt(1, 25), totalSpent: randomInt(500, 15000),
      joinDate: new Date(Date.now() - randomInt(1, 365) * 86400000).toISOString(),
      status: Math.random() > 0.1 ? 'Active' : 'Blocked',
    };
  });
}

export interface ShipmentData {
  id: string; orderId: string; orderNumber: string; carrier: string;
  trackingNumber: string; status: string; scheduledPickup: string;
  shippingCharge: number; isReverse: boolean;
}

export function generateMockShipments(orders: Order[]): ShipmentData[] {
  const carriers = ['Delhivery', 'BlueDart', 'Ekart', 'DTDC'];
  return orders.filter(o => ['Shipped', 'Delivered', 'Return Requested'].includes(o.status)).map((o, i) => ({
    id: `ship-${i}`, orderId: o.id, orderNumber: o.orderNumber,
    carrier: randomItem(carriers),
    trackingNumber: `TRK${randomInt(100000, 999999)}`,
    status: o.status === 'Delivered' ? 'Delivered' : o.status === 'Return Requested' ? 'Return Pickup Pending' : 'In Transit',
    scheduledPickup: new Date(new Date(o.date).getTime() + 86400000).toISOString(),
    shippingCharge: o.delivery, isReverse: o.status === 'Return Requested',
  }));
}

export interface ReturnRequest {
  id: string; orderId: string; orderNumber: string; productName: string;
  reason: string; status: string; requestDate: string; refundAmount: number;
}

export function generateMockReturns(orders: Order[]): ReturnRequest[] {
  const reasons = ['Damaged product', 'Wrong item', 'Not as described', 'Changed mind', 'Quality issue'];
  return orders.filter(o => o.status === 'Return Requested').map((o, i) => ({
    id: `ret-${i}`, orderId: o.id, orderNumber: o.orderNumber,
    productName: o.items[0]?.product.name || 'Unknown',
    reason: randomItem(reasons),
    status: randomItem(['Pending', 'Approved', 'Rejected', 'Refunded']),
    requestDate: new Date(new Date(o.date).getTime() + 2 * 86400000).toISOString(),
    refundAmount: o.total,
  }));
}

export interface BannerData {
  id: string; title: string; type: string; image: string;
  link: string; isActive: boolean; startDate: string; endDate: string;
}

export function generateMockBanners(): BannerData[] {
  const types = ['Homepage', 'Campaign', 'Sale', 'Category'];
  return types.flatMap((type, ti) =>
    Array.from({ length: 2 }, (_, i) => ({
      id: `ban-${ti}-${i}`, title: `${type} Banner ${i + 1}`, type,
      image: '/placeholder.svg', link: '/',
      isActive: Math.random() > 0.3,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    }))
  );
}

export const adminSettings = {
  shippingCharge: 40, freeShippingAbove: 500,
  gstPercent: 18, returnWindowDays: 7,
  codEnabled: true, codLimit: 5000,
};
