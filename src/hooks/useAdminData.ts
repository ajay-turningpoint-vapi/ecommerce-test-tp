import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAdminOrders() {
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, order_number, status, total_amount, payment_status, created_at, user_id,
          order_items (id, product_name, quantity, price, status, variant_id),
          user_addresses!orders_shipping_address_id_fkey (name, phone, address_line1, address_line2, city, pincode)
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
    staleTime: 30_000,
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, title, slug, description, category_id, brand_id, status, weight, tags, discount, delivery_time,
          product_variants (id, name, size, price, discount_price, mrp, sku, status, is_default)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 60_000,
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('level', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 60_000,
  });
}

export function useAdminInventory() {
  return useQuery({
    queryKey: ['admin-inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          id, available_stock, reserved_stock, damaged_stock,
          product_variants!inventory_variant_id_fkey (id, name, size, sku, price,
            products!product_variants_product_id_fkey (id, title)
          )
        `)
        .order('available_stock', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 30_000,
  });
}

export function useAdminCustomers() {
  return useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, phone, status, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 60_000,
  });
}

export function useAdminBanners() {
  return useQuery({
    queryKey: ['admin-banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('position');
      if (error) throw error;
      return data || [];
    },
    staleTime: 60_000,
  });
}

export function useAdminShipments() {
  return useQuery({
    queryKey: ['admin-shipments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipments')
        .select(`
          id, order_id, tracking_number, courier_name, status, shipped_at, estimated_delivery, created_at,
          orders!shipments_order_id_fkey (order_number)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 30_000,
  });
}

export function useAdminReturns() {
  return useQuery({
    queryKey: ['admin-returns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('returns')
        .select(`
          id, reason, status, requested_at,
          order_items!returns_order_item_id_fkey (id, product_name, price, quantity,
            orders!order_items_order_id_fkey (order_number)
          )
        `)
        .order('requested_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 30_000,
  });
}
