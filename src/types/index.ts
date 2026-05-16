export interface ProductVariant {
  id: string;
  name: string;
  size: string;
  price: number;
  mrp: number;
}

export interface VariantAttribute {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  subCategoryId: string;
  brandName?: string;
  image: string;
  description: string;
  tags: string[];
  weight: string;
  pieces?: string;
  serves?: string;
  specifications?: { key: string; value: string }[];
  variants: ProductVariant[];
  variantAttributes?: Record<string, VariantAttribute[]>;
  ingredients?: string;
  howToUse?: string;
  discount: number;
  deliveryTime: string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface CartItem {
  product: Product;
  variantId: string;
  quantity: number;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  email: string;
  house: string;
  road: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  address: Address;
  paymentMethod: string;
  subtotal: number;
  delivery: number;
  total: number;
  savings: number;
  date: string;
  status: string;
  paymentId?: string;
}
