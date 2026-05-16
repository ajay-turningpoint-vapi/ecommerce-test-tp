import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

function getAdminToken() {
  return localStorage.getItem('adminToken') || '';
}

async function adminFetch(resource: string, method = 'GET', body?: any, id?: string) {
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  let url = `https://${projectId}.supabase.co/functions/v1/admin-api?resource=${resource}`;
  if (id) url += `&id=${id}`;

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAdminToken()}`,
      'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── READ HOOKS ───

export function useAdminOrders() {
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => adminFetch('orders'),
    staleTime: 30_000,
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ['admin-products'],
    queryFn: () => adminFetch('products'),
    staleTime: 60_000,
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminFetch('categories'),
    staleTime: 60_000,
  });
}

export function useAdminInventory() {
  return useQuery({
    queryKey: ['admin-inventory'],
    queryFn: () => adminFetch('inventory'),
    staleTime: 30_000,
  });
}

export function useAdminCustomers() {
  return useQuery({
    queryKey: ['admin-customers'],
    queryFn: () => adminFetch('customers'),
    staleTime: 60_000,
  });
}

export function useAdminBanners() {
  return useQuery({
    queryKey: ['admin-banners'],
    queryFn: () => adminFetch('banners'),
    staleTime: 60_000,
  });
}

export function useAdminShipments() {
  return useQuery({
    queryKey: ['admin-shipments'],
    queryFn: () => adminFetch('shipments'),
    staleTime: 30_000,
  });
}

export function useAdminReturns() {
  return useQuery({
    queryKey: ['admin-returns'],
    queryFn: () => adminFetch('returns'),
    staleTime: 30_000,
  });
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminFetch('dashboard'),
    staleTime: 30_000,
  });
}

// ─── MUTATION HOOKS ───

export function useAdminMutation(resource: string) {
  const qc = useQueryClient();
  const key = `admin-${resource}`;

  const create = useMutation({
    mutationFn: (body: any) => adminFetch(resource, 'POST', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: any) => adminFetch(resource, 'PUT', body, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminFetch(resource, 'DELETE', undefined, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });

  return { create, update, remove };
}
