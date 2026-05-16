import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product, ProductVariant } from '@/types';

// Import local images for fallback mapping
import vitaminCSerum from '@/assets/products/vitamin-c-serum.jpg';
import matteLipstick from '@/assets/products/matte-lipstick.jpg';
import faceCream from '@/assets/products/face-cream.jpg';
import faceWash from '@/assets/products/face-wash.jpg';
import mascara from '@/assets/products/mascara.jpg';
import highlighter from '@/assets/products/highlighter.jpg';
import hairOil from '@/assets/products/hair-oil.jpg';
import sheetMask from '@/assets/products/sheet-mask.jpg';
import settingSpray from '@/assets/products/setting-spray.jpg';
import lipGlossSet from '@/assets/products/lip-gloss-set.jpg';
import sunscreen from '@/assets/products/sunscreen.jpg';
import foundation from '@/assets/products/foundation.jpg';
import eyeshadowPalette from '@/assets/products/eyeshadow-palette.jpg';
import blush from '@/assets/products/blush.jpg';
import perfume from '@/assets/products/perfume.jpg';
import nailPolish from '@/assets/products/nail-polish.jpg';
import bodyLotion from '@/assets/products/body-lotion.jpg';
import shampoo from '@/assets/products/shampoo.jpg';
import brushSet from '@/assets/products/brush-set.jpg';
import eyeliner from '@/assets/products/eyeliner.jpg';
import lipBalm from '@/assets/products/lip-balm.jpg';

const slugImageMap: Record<string, string> = {
  'vitamin-c-serum': vitaminCSerum,
  'matte-lipstick-ruby': matteLipstick,
  'hydrating-face-cream': faceCream,
  'gentle-foam-cleanser': faceWash,
  'volumizing-mascara': mascara,
  'rose-gold-highlighter': highlighter,
  'argan-hair-oil': hairOil,
  'hyaluronic-sheet-mask': sheetMask,
  'setting-spray': settingSpray,
  'lip-gloss-set': lipGlossSet,
  'spf50-sunscreen': sunscreen,
  'silk-finish-foundation': foundation,
  'warm-eyeshadow-palette': eyeshadowPalette,
  'soft-petal-blush': blush,
  'luxury-eau-de-parfum': perfume,
  'nail-polish-collection': nailPolish,
  'hydra-body-lotion': bodyLotion,
  'botanical-shampoo': shampoo,
  'pro-brush-set': brushSet,
  'precision-eyeliner': eyeliner,
  'tinted-lip-balm': lipBalm,
};

async function fetchProducts(): Promise<Product[]> {
  const { data: dbProducts, error } = await supabase
    .from('products')
    .select(`
      id, title, slug, description, category_id, brand_id, status,
      weight, tags, ingredients, how_to_use, delivery_time, discount, pieces, serves,
      product_variants (id, name, size, price, discount_price, mrp, is_default, sku, status),
      product_images (image_url, is_thumbnail)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (dbProducts || []).map((p: any) => {
    const variants: ProductVariant[] = (p.product_variants || [])
      .sort((a: any, b: any) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0))
      .map((v: any) => ({
        id: v.id,
        name: v.name || v.sku,
        size: v.size || '',
        price: Number(v.discount_price ?? v.price),
        mrp: Number(v.mrp ?? v.price),
      }));

    const thumbnail = (p.product_images || []).find((img: any) => img.is_thumbnail);
    const dbImage = thumbnail?.image_url || (p.product_images?.[0]?.image_url);
    const image = slugImageMap[p.slug] || dbImage || '/placeholder.svg';

    return {
      id: p.id,
      name: p.title,
      slug: p.slug,
      categoryId: p.category_id || '',
      subCategoryId: '',
      image,
      description: p.description || '',
      tags: p.tags || [],
      weight: p.weight || '',
      pieces: p.pieces || undefined,
      serves: p.serves || undefined,
      variants,
      ingredients: p.ingredients || undefined,
      howToUse: p.how_to_use || undefined,
      discount: p.discount || 0,
      deliveryTime: p.delivery_time || '30 mins',
    };
  });
}

export function useDbProducts() {
  return useQuery({
    queryKey: ['db-products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDbProduct(slug: string | undefined) {
  const { data: products, ...rest } = useDbProducts();
  return {
    ...rest,
    data: products?.find(p => p.slug === slug),
  };
}
