import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function verifyAdmin(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) throw new Error('No token');
  try {
    const payload = JSON.parse(atob(token));
    if (!payload.sub || !payload.exp || payload.exp < Date.now()) throw new Error('Expired');
    return payload;
  } catch {
    throw new Error('Invalid token');
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    await verifyAdmin(req);
  } catch {
    return json({ error: 'Unauthorized' }, 401);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const url = new URL(req.url);
  const path = url.pathname.split('/').filter(Boolean);
  // Path format: /admin-api/{resource}[/{id}]
  const resource = path[1] || url.searchParams.get('resource') || '';
  const id = path[2] || url.searchParams.get('id') || '';
  const method = req.method;

  try {
    // ─── PRODUCTS ───
    if (resource === 'products') {
      if (method === 'GET') {
        const { data, error } = await supabase
          .from('products')
          .select(`*, product_variants(*), product_images(*)`)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return json(data);
      }
      if (method === 'POST') {
        const body = await req.json();
        const { variants, ...productData } = body;
        const { data: product, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();
        if (error) throw error;
        if (variants?.length) {
          const variantRows = variants.map((v: any) => ({ ...v, product_id: product.id }));
          const { error: vErr } = await supabase.from('product_variants').insert(variantRows);
          if (vErr) throw vErr;
        }
        return json(product, 201);
      }
      if (method === 'PUT' && id) {
        const body = await req.json();
        const { variants, ...productData } = body;
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        // Upsert variants if provided
        if (variants?.length) {
          for (const v of variants) {
            if (v.id) {
              await supabase.from('product_variants').update(v).eq('id', v.id);
            } else {
              await supabase.from('product_variants').insert({ ...v, product_id: id });
            }
          }
        }
        return json(data);
      }
      if (method === 'DELETE' && id) {
        // Delete variants first
        await supabase.from('product_variants').delete().eq('product_id', id);
        await supabase.from('product_images').delete().eq('product_id', id);
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        return json({ success: true });
      }
    }

    // ─── CATEGORIES ───
    if (resource === 'categories') {
      if (method === 'GET') {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('level', { ascending: true })
          .order('name', { ascending: true });
        if (error) throw error;
        return json(data);
      }
      if (method === 'POST') {
        const body = await req.json();
        const { data, error } = await supabase.from('categories').insert(body).select().single();
        if (error) throw error;
        return json(data, 201);
      }
      if (method === 'PUT' && id) {
        const body = await req.json();
        const { data, error } = await supabase.from('categories').update(body).eq('id', id).select().single();
        if (error) throw error;
        return json(data);
      }
      if (method === 'DELETE' && id) {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        return json({ success: true });
      }
    }

    // ─── ORDERS ───
    if (resource === 'orders') {
      if (method === 'GET') {
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
        return json(data);
      }
      if (method === 'PUT' && id) {
        const body = await req.json();
        const { data, error } = await supabase.from('orders').update(body).eq('id', id).select().single();
        if (error) throw error;
        return json(data);
      }
    }

    // ─── ORDER ITEMS STATUS ───
    if (resource === 'order-items') {
      if (method === 'PUT' && id) {
        const body = await req.json();
        const { data, error } = await supabase.from('order_items').update(body).eq('id', id).select().single();
        if (error) throw error;
        return json(data);
      }
    }

    // ─── INVENTORY ───
    if (resource === 'inventory') {
      if (method === 'GET') {
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
        return json(data);
      }
      if (method === 'PUT' && id) {
        const body = await req.json();
        const { data, error } = await supabase.from('inventory').update(body).eq('id', id).select().single();
        if (error) throw error;
        return json(data);
      }
    }

    // ─── BANNERS ───
    if (resource === 'banners') {
      if (method === 'GET') {
        const { data, error } = await supabase.from('banners').select('*').order('position');
        if (error) throw error;
        return json(data);
      }
      if (method === 'POST') {
        const body = await req.json();
        const { data, error } = await supabase.from('banners').insert(body).select().single();
        if (error) throw error;
        return json(data, 201);
      }
      if (method === 'PUT' && id) {
        const body = await req.json();
        const { data, error } = await supabase.from('banners').update(body).eq('id', id).select().single();
        if (error) throw error;
        return json(data);
      }
      if (method === 'DELETE' && id) {
        const { error } = await supabase.from('banners').delete().eq('id', id);
        if (error) throw error;
        return json({ success: true });
      }
    }

    // ─── CUSTOMERS ───
    if (resource === 'customers') {
      if (method === 'GET') {
        const { data, error } = await supabase
          .from('users')
          .select('id, name, email, phone, status, created_at')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return json(data);
      }
      if (method === 'PUT' && id) {
        const body = await req.json();
        const { data, error } = await supabase.from('users').update(body).eq('id', id).select().single();
        if (error) throw error;
        return json(data);
      }
    }

    // ─── SHIPMENTS ───
    if (resource === 'shipments') {
      if (method === 'GET') {
        const { data, error } = await supabase
          .from('shipments')
          .select(`*, orders!shipments_order_id_fkey(order_number)`)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return json(data);
      }
      if (method === 'POST') {
        const body = await req.json();
        const { data, error } = await supabase.from('shipments').insert(body).select().single();
        if (error) throw error;
        return json(data, 201);
      }
      if (method === 'PUT' && id) {
        const body = await req.json();
        const { data, error } = await supabase.from('shipments').update(body).eq('id', id).select().single();
        if (error) throw error;
        return json(data);
      }
    }

    // ─── RETURNS ───
    if (resource === 'returns') {
      if (method === 'GET') {
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
        return json(data);
      }
      if (method === 'PUT' && id) {
        const body = await req.json();
        const { data, error } = await supabase.from('returns').update(body).eq('id', id).select().single();
        if (error) throw error;
        return json(data);
      }
    }

    // ─── DASHBOARD STATS ───
    if (resource === 'dashboard') {
      const [orders, inventory, customers] = await Promise.all([
        supabase.from('orders').select('id, status, total_amount, created_at, order_items(product_name, quantity)').order('created_at', { ascending: false }).limit(500),
        supabase.from('inventory').select('id, available_stock, reserved_stock, product_variants!inventory_variant_id_fkey(name, products!product_variants_product_id_fkey(title))'),
        supabase.from('users').select('id', { count: 'exact', head: true }),
      ]);
      return json({
        orders: orders.data || [],
        inventory: inventory.data || [],
        customerCount: customers.count || 0,
      });
    }

    return json({ error: 'Not found' }, 404);
  } catch (err: any) {
    return json({ error: err.message || 'Server error' }, 500);
  }
});
