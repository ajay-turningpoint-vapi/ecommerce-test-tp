// ─── Shared Admin Data Layer ───
// Uses the SAME data from user panel (src/data/products.ts + src/data/adminMockData.ts)
// so both panels always show identical information.

import { products, categories, subCategories } from './products';
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

// ─── Stable singleton instances (generated once per session) ───

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

// ─── Direct re-exports from user panel ───

export { products, categories, subCategories, adminSettings };
export type { Product, Category, SubCategory, Order, StockItem, CustomerData, ShipmentData, ReturnRequest, BannerData };

// ─── Helper: get category name by id ───

export function getCategoryName(id: string): string {
  const cat = categories.find(c => c.id === id);
  if (cat) return cat.name;
  const sub = subCategories.find(s => s.id === id || s.categoryId === id);
  return sub?.name || id;
}

// ─── Helper: unique brands extracted from user panel products ───

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
