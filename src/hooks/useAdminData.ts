import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

function getAdminToken() {
  return localStorage.getItem('adminToken') || '';
}

async function adminMutate(resource: string, operation: string, data?: any, id?: string) {
  const { data: result, error } = await supabase.rpc('admin_mutation', {
    p_token: getAdminToken(),
    p_resource: resource,
    p_operation: operation,
    p_data: data || {},
    p_id: id || null,
  });
  if (error) throw new Error(error.message);
  if (result && (result as any).error) throw new Error((result as any).error);
  return result;
}

// ─── READ HOOKS (direct Supabase queries — public SELECT RLS) ───

export function useAdminOrders() {
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *, order_items(*, product_variants(name, size, price)),
          user_addresses!orders_shipping_address_id_fkey(name, phone, address_line1, address_line2, city, pincode),
          users!orders_user_id_fkey(name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      return data;
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
        .select(`*, product_variants(*), product_images(*)`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
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
        .order('level', { ascending: true })
        .order('name', { ascending: true });
      if (error) throw error;
      return data;
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
          *,
          product_variants!inventory_variant_id_fkey(id, name, size, sku, price,
            products!product_variants_product_id_fkey(id, title)
          )
        `)
        .order('available_stock', { ascending: true });
      if (error) throw error;
      return data;
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
      return data;
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
      return data;
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
        .select(`*, orders!shipments_order_id_fkey(order_number)`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
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
          *,
          order_items!returns_order_item_id_fkey(id, product_name, price, quantity,
            orders!order_items_order_id_fkey(order_number)
          )
        `)
        .order('requested_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 30_000,
  });
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const [orders, inventory, customers] = await Promise.all([
        supabase.from('orders').select('id, status, total_amount, created_at, order_items(product_name, quantity)').order('created_at', { ascending: false }).limit(500),
        supabase.from('inventory').select('id, available_stock, reserved_stock, product_variants!inventory_variant_id_fkey(name, products!product_variants_product_id_fkey(title))'),
        supabase.from('users').select('id', { count: 'exact', head: true }),
      ]);
      return {
        orders: orders.data || [],
        inventory: inventory.data || [],
        customerCount: customers.count || 0,
      };
    },
    staleTime: 30_000,
  });
}

// ─── MUTATION HOOKS (via admin_mutation RPC) ───

export function useAdminMutation(resource: string) {
  const qc = useQueryClient();
  const key = `admin-${resource}`;

  const create = useMutation({
    mutationFn: (body: any) => adminMutate(resource, 'insert', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: any) => adminMutate(resource, 'update', body, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminMutate(resource, 'delete', {}, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });

  return { create, update, remove };
}
