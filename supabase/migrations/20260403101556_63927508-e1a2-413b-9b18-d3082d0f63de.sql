
-- Enable pgcrypto for SHA-256 hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Helper: verify admin token, returns admin id
CREATE OR REPLACE FUNCTION public.verify_admin_token(p_token text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  token_data jsonb;
  admin_id uuid;
BEGIN
  BEGIN
    token_data := convert_from(decode(p_token, 'base64'), 'UTF8')::jsonb;
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Invalid token format';
  END;
  IF (token_data->>'exp')::bigint < (extract(epoch from now()) * 1000)::bigint THEN
    RAISE EXCEPTION 'Token expired';
  END IF;
  admin_id := (token_data->>'sub')::uuid;
  IF NOT EXISTS (SELECT 1 FROM admin_users WHERE id = admin_id) THEN
    RAISE EXCEPTION 'Invalid admin user';
  END IF;
  RETURN admin_id;
END;
$$;

-- Admin login function
CREATE OR REPLACE FUNCTION public.admin_login(p_email text, p_password text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_row record;
  token_payload jsonb;
  token text;
BEGIN
  SELECT * INTO admin_row FROM admin_users
  WHERE email = p_email
    AND password_hash = encode(digest(p_password, 'sha256'), 'hex');

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Invalid email or password');
  END IF;

  token_payload := jsonb_build_object(
    'sub', admin_row.id,
    'email', admin_row.email,
    'role', admin_row.role,
    'name', admin_row.name,
    'exp', (extract(epoch from now()) * 1000 + 28800000)::bigint
  );
  token := encode(convert_to(token_payload::text, 'UTF8'), 'base64');

  RETURN jsonb_build_object(
    'token', token,
    'admin', jsonb_build_object(
      'id', admin_row.id,
      'email', admin_row.email,
      'name', admin_row.name,
      'role', admin_row.role
    )
  );
END;
$$;

-- Generic admin mutation function
CREATE OR REPLACE FUNCTION public.admin_mutation(
  p_token text,
  p_resource text,
  p_operation text,
  p_data jsonb DEFAULT '{}'::jsonb,
  p_id text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_id uuid;
  v_result jsonb;
  v_uuid uuid;
BEGIN
  -- Verify admin
  v_admin_id := verify_admin_token(p_token);
  IF p_id IS NOT NULL AND p_id != '' THEN
    v_uuid := p_id::uuid;
  END IF;

  -- PRODUCTS
  IF p_resource = 'products' THEN
    IF p_operation = 'insert' THEN
      WITH ins AS (
        INSERT INTO products (title, slug, description, category_id, brand_id, status, discount, weight, tags, ingredients, how_to_use, delivery_time)
        VALUES (
          p_data->>'title', p_data->>'slug', p_data->>'description',
          NULLIF(p_data->>'category_id','')::uuid, NULLIF(p_data->>'brand_id','')::uuid,
          COALESCE(p_data->>'status','active'), COALESCE((p_data->>'discount')::int,0),
          p_data->>'weight',
          CASE WHEN p_data ? 'tags' AND p_data->'tags' IS NOT NULL THEN ARRAY(SELECT jsonb_array_elements_text(p_data->'tags')) ELSE '{}'::text[] END,
          p_data->>'ingredients', p_data->>'how_to_use', COALESCE(p_data->>'delivery_time','30 mins')
        )
        RETURNING *
      )
      SELECT to_jsonb(ins.*) INTO v_result FROM ins;
      RETURN v_result;
    ELSIF p_operation = 'update' AND v_uuid IS NOT NULL THEN
      WITH upd AS (
        UPDATE products SET
          title = COALESCE(p_data->>'title', title),
          slug = COALESCE(p_data->>'slug', slug),
          description = COALESCE(p_data->>'description', description),
          category_id = CASE WHEN p_data ? 'category_id' THEN NULLIF(p_data->>'category_id','')::uuid ELSE category_id END,
          brand_id = CASE WHEN p_data ? 'brand_id' THEN NULLIF(p_data->>'brand_id','')::uuid ELSE brand_id END,
          status = COALESCE(p_data->>'status', status),
          discount = CASE WHEN p_data ? 'discount' THEN (p_data->>'discount')::int ELSE discount END,
          weight = COALESCE(p_data->>'weight', weight),
          ingredients = COALESCE(p_data->>'ingredients', ingredients),
          how_to_use = COALESCE(p_data->>'how_to_use', how_to_use),
          delivery_time = COALESCE(p_data->>'delivery_time', delivery_time),
          updated_at = now()
        WHERE id = v_uuid
        RETURNING *
      )
      SELECT to_jsonb(upd.*) INTO v_result FROM upd;
      RETURN COALESCE(v_result, '{"error":"Not found"}'::jsonb);
    ELSIF p_operation = 'delete' AND v_uuid IS NOT NULL THEN
      DELETE FROM product_variants WHERE product_id = v_uuid;
      DELETE FROM product_images WHERE product_id = v_uuid;
      DELETE FROM products WHERE id = v_uuid;
      RETURN '{"success":true}'::jsonb;
    END IF;

  -- PRODUCT VARIANTS
  ELSIF p_resource = 'product_variants' THEN
    IF p_operation = 'insert' THEN
      WITH ins AS (
        INSERT INTO product_variants (product_id, name, sku, size, price, mrp, discount_price, is_default, status)
        VALUES (
          (p_data->>'product_id')::uuid, p_data->>'name', p_data->>'sku', p_data->>'size',
          (p_data->>'price')::numeric, NULLIF(p_data->>'mrp','')::numeric,
          NULLIF(p_data->>'discount_price','')::numeric,
          COALESCE((p_data->>'is_default')::boolean, false),
          COALESCE(p_data->>'status','active')
        )
        RETURNING *
      )
      SELECT to_jsonb(ins.*) INTO v_result FROM ins;
      RETURN v_result;
    ELSIF p_operation = 'update' AND v_uuid IS NOT NULL THEN
      WITH upd AS (
        UPDATE product_variants SET
          name = COALESCE(p_data->>'name', name),
          size = COALESCE(p_data->>'size', size),
          price = CASE WHEN p_data ? 'price' THEN (p_data->>'price')::numeric ELSE price END,
          mrp = CASE WHEN p_data ? 'mrp' THEN NULLIF(p_data->>'mrp','')::numeric ELSE mrp END,
          discount_price = CASE WHEN p_data ? 'discount_price' THEN NULLIF(p_data->>'discount_price','')::numeric ELSE discount_price END,
          status = COALESCE(p_data->>'status', status)
        WHERE id = v_uuid
        RETURNING *
      )
      SELECT to_jsonb(upd.*) INTO v_result FROM upd;
      RETURN COALESCE(v_result, '{"error":"Not found"}'::jsonb);
    ELSIF p_operation = 'delete' AND v_uuid IS NOT NULL THEN
      DELETE FROM product_variants WHERE id = v_uuid;
      RETURN '{"success":true}'::jsonb;
    END IF;

  -- CATEGORIES
  ELSIF p_resource = 'categories' THEN
    IF p_operation = 'insert' THEN
      WITH ins AS (
        INSERT INTO categories (name, slug, level, parent_id, icon, banner_image, status)
        VALUES (
          p_data->>'name', p_data->>'slug',
          COALESCE((p_data->>'level')::int, 0),
          NULLIF(p_data->>'parent_id','')::uuid,
          p_data->>'icon', p_data->>'banner_image',
          COALESCE(p_data->>'status','active')
        )
        RETURNING *
      )
      SELECT to_jsonb(ins.*) INTO v_result FROM ins;
      RETURN v_result;
    ELSIF p_operation = 'update' AND v_uuid IS NOT NULL THEN
      WITH upd AS (
        UPDATE categories SET
          name = COALESCE(p_data->>'name', name),
          slug = COALESCE(p_data->>'slug', slug),
          level = CASE WHEN p_data ? 'level' THEN (p_data->>'level')::int ELSE level END,
          parent_id = CASE WHEN p_data ? 'parent_id' THEN NULLIF(p_data->>'parent_id','')::uuid ELSE parent_id END,
          icon = COALESCE(p_data->>'icon', icon),
          banner_image = COALESCE(p_data->>'banner_image', banner_image),
          status = COALESCE(p_data->>'status', status)
        WHERE id = v_uuid
        RETURNING *
      )
      SELECT to_jsonb(upd.*) INTO v_result FROM upd;
      RETURN COALESCE(v_result, '{"error":"Not found"}'::jsonb);
    ELSIF p_operation = 'delete' AND v_uuid IS NOT NULL THEN
      DELETE FROM categories WHERE id = v_uuid;
      RETURN '{"success":true}'::jsonb;
    END IF;

  -- ORDERS
  ELSIF p_resource = 'orders' THEN
    IF p_operation = 'update' AND v_uuid IS NOT NULL THEN
      WITH upd AS (
        UPDATE orders SET
          status = COALESCE(p_data->>'status', status),
          payment_status = COALESCE(p_data->>'payment_status', payment_status)
        WHERE id = v_uuid
        RETURNING *
      )
      SELECT to_jsonb(upd.*) INTO v_result FROM upd;
      RETURN COALESCE(v_result, '{"error":"Not found"}'::jsonb);
    END IF;

  -- ORDER ITEMS
  ELSIF p_resource = 'order_items' THEN
    IF p_operation = 'update' AND v_uuid IS NOT NULL THEN
      WITH upd AS (
        UPDATE order_items SET
          status = COALESCE(p_data->>'status', status),
          shipment_id = CASE WHEN p_data ? 'shipment_id' THEN NULLIF(p_data->>'shipment_id','')::uuid ELSE shipment_id END
        WHERE id = v_uuid
        RETURNING *
      )
      SELECT to_jsonb(upd.*) INTO v_result FROM upd;
      RETURN COALESCE(v_result, '{"error":"Not found"}'::jsonb);
    END IF;

  -- INVENTORY
  ELSIF p_resource = 'inventory' THEN
    IF p_operation = 'update' AND v_uuid IS NOT NULL THEN
      WITH upd AS (
        UPDATE inventory SET
          available_stock = CASE WHEN p_data ? 'available_stock' THEN (p_data->>'available_stock')::int ELSE available_stock END,
          reserved_stock = CASE WHEN p_data ? 'reserved_stock' THEN (p_data->>'reserved_stock')::int ELSE reserved_stock END,
          damaged_stock = CASE WHEN p_data ? 'damaged_stock' THEN (p_data->>'damaged_stock')::int ELSE damaged_stock END,
          updated_at = now()
        WHERE id = v_uuid
        RETURNING *
      )
      SELECT to_jsonb(upd.*) INTO v_result FROM upd;
      RETURN COALESCE(v_result, '{"error":"Not found"}'::jsonb);
    END IF;

  -- BANNERS
  ELSIF p_resource = 'banners' THEN
    IF p_operation = 'insert' THEN
      WITH ins AS (
        INSERT INTO banners (title, image_url, link, position, status)
        VALUES (
          p_data->>'title', p_data->>'image_url', p_data->>'link',
          COALESCE((p_data->>'position')::int, 0),
          COALESCE(p_data->>'status','active')
        )
        RETURNING *
      )
      SELECT to_jsonb(ins.*) INTO v_result FROM ins;
      RETURN v_result;
    ELSIF p_operation = 'update' AND v_uuid IS NOT NULL THEN
      WITH upd AS (
        UPDATE banners SET
          title = COALESCE(p_data->>'title', title),
          image_url = COALESCE(p_data->>'image_url', image_url),
          link = CASE WHEN p_data ? 'link' THEN p_data->>'link' ELSE link END,
          position = CASE WHEN p_data ? 'position' THEN (p_data->>'position')::int ELSE position END,
          status = COALESCE(p_data->>'status', status)
        WHERE id = v_uuid
        RETURNING *
      )
      SELECT to_jsonb(upd.*) INTO v_result FROM upd;
      RETURN COALESCE(v_result, '{"error":"Not found"}'::jsonb);
    ELSIF p_operation = 'delete' AND v_uuid IS NOT NULL THEN
      DELETE FROM banners WHERE id = v_uuid;
      RETURN '{"success":true}'::jsonb;
    END IF;

  -- CUSTOMERS (users table)
  ELSIF p_resource = 'customers' THEN
    IF p_operation = 'update' AND v_uuid IS NOT NULL THEN
      WITH upd AS (
        UPDATE users SET
          status = COALESCE(p_data->>'status', status),
          name = COALESCE(p_data->>'name', name),
          phone = CASE WHEN p_data ? 'phone' THEN p_data->>'phone' ELSE phone END
        WHERE id = v_uuid
        RETURNING *
      )
      SELECT to_jsonb(upd.*) INTO v_result FROM upd;
      RETURN COALESCE(v_result, '{"error":"Not found"}'::jsonb);
    END IF;

  -- SHIPMENTS
  ELSIF p_resource = 'shipments' THEN
    IF p_operation = 'insert' THEN
      WITH ins AS (
        INSERT INTO shipments (order_id, tracking_number, courier_name, status, estimated_delivery)
        VALUES (
          (p_data->>'order_id')::uuid, p_data->>'tracking_number',
          p_data->>'courier_name', COALESCE(p_data->>'status','PENDING'),
          NULLIF(p_data->>'estimated_delivery','')::timestamptz
        )
        RETURNING *
      )
      SELECT to_jsonb(ins.*) INTO v_result FROM ins;
      RETURN v_result;
    ELSIF p_operation = 'update' AND v_uuid IS NOT NULL THEN
      WITH upd AS (
        UPDATE shipments SET
          status = COALESCE(p_data->>'status', status),
          tracking_number = COALESCE(p_data->>'tracking_number', tracking_number),
          courier_name = COALESCE(p_data->>'courier_name', courier_name),
          shipped_at = CASE WHEN p_data ? 'shipped_at' THEN NULLIF(p_data->>'shipped_at','')::timestamptz ELSE shipped_at END,
          estimated_delivery = CASE WHEN p_data ? 'estimated_delivery' THEN NULLIF(p_data->>'estimated_delivery','')::timestamptz ELSE estimated_delivery END
        WHERE id = v_uuid
        RETURNING *
      )
      SELECT to_jsonb(upd.*) INTO v_result FROM upd;
      RETURN COALESCE(v_result, '{"error":"Not found"}'::jsonb);
    END IF;

  -- RETURNS
  ELSIF p_resource = 'returns' THEN
    IF p_operation = 'update' AND v_uuid IS NOT NULL THEN
      WITH upd AS (
        UPDATE returns SET
          status = COALESCE(p_data->>'status', status)
        WHERE id = v_uuid
        RETURNING *
      )
      SELECT to_jsonb(upd.*) INTO v_result FROM upd;
      RETURN COALESCE(v_result, '{"error":"Not found"}'::jsonb);
    END IF;

  ELSE
    RETURN jsonb_build_object('error', 'Unknown resource: ' || p_resource);
  END IF;

  RETURN jsonb_build_object('error', 'Invalid operation');
END;
$$;

-- Grant execute to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.admin_login(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_admin_token(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_mutation(text, text, text, jsonb, text) TO anon, authenticated;
