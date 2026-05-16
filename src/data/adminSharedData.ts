// ─── Shared Admin Data Layer (Mutable) ───
// Uses the SAME data from user panel (src/data/products.ts + src/data/adminMockData.ts)
// with in-memory CRUD operations for admin panel.

import { products as userProducts, categories as userCategories, subCategories as userSubCategories } from './products';
import type { Product, Category, SubCategory } from '@/types';
import {
  generateMockOrders,
  generateMockStock,
  generateMockCustomers,
  generateMockShipments,
  generateMockReturns,
  generateMockBanners,
  adminSettings,
  type StockItem,
  type CustomerData,
  type ShipmentData,
  type ReturnRequest,
  type BannerData,
} from './adminMockData';
import type { Order } from '@/types';

// ─── ID generator ───
let _nextId = 5000;
function genId(prefix = 'id') { return `${prefix}-${++_nextId}-${Date.now()}`; }

// ─── Mutable data arrays (initialized from user panel) ───
export const products: Product[] = [...userProducts];
export const categories: Category[] = [...userCategories];
export const subCategories: SubCategory[] = [...userSubCategories];

// ─── Singleton lazy init for generated data ───
let _orders: Order[] | null = null;
let _stock: StockItem[] | null = null;
let _customers: CustomerData[] | null = null;
let _shipments: ShipmentData[] | null = null;
let _returns: ReturnRequest[] | null = null;
let _banners: BannerData[] | null = null;

export function getOrders(): Order[] {
  if (!_orders) _orders = generateMockOrders(50);
  return _orders;
}
export function getStock(): StockItem[] {
  if (!_stock) _stock = generateMockStock();
  return _stock;
}
export function getCustomers(): CustomerData[] {
  if (!_customers) _customers = generateMockCustomers(30);
  return _customers;
}
export function getShipments(): ShipmentData[] {
  if (!_shipments) _shipments = generateMockShipments(getOrders());
  return _shipments;
}
export function getReturns(): ReturnRequest[] {
  if (!_returns) _returns = generateMockReturns(getOrders());
  return _returns;
}
export function getBanners(): BannerData[] {
  if (!_banners) _banners = generateMockBanners();
  return _banners;
}

// ─── Version counter for reactivity ───
let _version = 0;
const _listeners = new Set<() => void>();

export function getVersion() { return _version; }
export function subscribe(fn: () => void) {
  _listeners.add(fn);
  return () => { _listeners.delete(fn); };
}
function notify() {
  _version++;
  _listeners.forEach(fn => fn());
}

// ─── Generic CRUD helpers ───

export function addItem<T extends { id: string }>(list: T[], item: Omit<T, 'id'>, prefix = 'id'): T {
  const newItem = { ...item, id: genId(prefix) } as T;
  list.push(newItem);
  notify();
  return newItem;
}

export function updateItem<T extends { id: string }>(list: T[], id: string, updates: Partial<T>): T | null {
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates };
  notify();
  return list[idx];
}

export function deleteItem<T extends { id: string }>(list: T[], id: string): boolean {
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return false;
  list.splice(idx, 1);
  notify();
  return true;
}

// ─── Re-exports ───
export { adminSettings };
export type { Product, Category, SubCategory, Order, StockItem, CustomerData, ShipmentData, ReturnRequest, BannerData };

// ─── Helpers ───

export function getCategoryName(id: string): string {
  const cat = categories.find(c => c.id === id);
  if (cat) return cat.name;
  const sub = subCategories.find(s => s.id === id || s.categoryId === id);
  return sub?.name || id;
}

export interface AdminBrand {
  id: string;
  name: string;
}

export function getBrands(): AdminBrand[] {
  const seen = new Map<string, string>();
  products.forEach(p => {
    if (p.brandName && !seen.has(p.brandName)) {
      seen.set(p.brandName, `brand-${seen.size + 1}`);
    }
  });
  return Array.from(seen.entries()).map(([name, id]) => ({ id, name }));
}

export function getBrandName(product: Product): string {
  return product.brandName || '—';
}
