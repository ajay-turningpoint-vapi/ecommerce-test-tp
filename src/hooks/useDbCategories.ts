import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Category, SubCategory } from '@/types';

// Import local images for fallback
import vitaminCSerum from '@/assets/products/vitamin-c-serum.jpg';
import matteLipstick from '@/assets/products/matte-lipstick.jpg';
import shampoo from '@/assets/products/shampoo.jpg';
import perfume from '@/assets/products/perfume.jpg';
import bodyLotion from '@/assets/products/body-lotion.jpg';
import lipGlossSet from '@/assets/products/lip-gloss-set.jpg';
import lipBalm from '@/assets/products/lip-balm.jpg';
import sheetMask from '@/assets/products/sheet-mask.jpg';
import nailPolish from '@/assets/products/nail-polish.jpg';
import brushSet from '@/assets/products/brush-set.jpg';
import sunscreen from '@/assets/products/sunscreen.jpg';
import highlighter from '@/assets/products/highlighter.jpg';
import eyeshadowPalette from '@/assets/products/eyeshadow-palette.jpg';
import blush from '@/assets/products/blush.jpg';
import foundation from '@/assets/products/foundation.jpg';
import faceCream from '@/assets/products/face-cream.jpg';
import faceWash from '@/assets/products/face-wash.jpg';

const slugImageMap: Record<string, string> = {
  'skincare': vitaminCSerum,
  'makeup': matteLipstick,
  'haircare': shampoo,
  'fragrance': perfume,
  'bath-body': bodyLotion,
  'combos': lipGlossSet,
  'lip-care': lipBalm,
  'face-masks': sheetMask,
  'nail-care': nailPolish,
  'tools': brushSet,
  'sun-care': sunscreen,
  'bestsellers': highlighter,
  'eye-makeup': eyeshadowPalette,
  'gift-sets': blush,
  'new-arrivals': foundation,
  'serums': vitaminCSerum,
  'moisturizers': faceCream,
  'cleansers': faceWash,
  'sunscreens': sunscreen,
  'masks': sheetMask,
  'lips': matteLipstick,
  'face': foundation,
  'eyes': eyeshadowPalette,
  'cheeks': blush,
  'nails': nailPolish,
  'shampoos': shampoo,
  'hair-oils': shampoo,
  'perfumes': perfume,
  'lotions': bodyLotion,
};

interface DbCategory {
  id: string;
  name: string;
  slug: string;
  level: number;
  parent_id: string | null;
  icon: string | null;
  banner_image: string | null;
  status: string;
}

async function fetchCategories(): Promise<{ categories: Category[]; subCategories: SubCategory[] }> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('status', 'active')
    .order('name');

  if (error) throw error;

  const rows = (data || []) as DbCategory[];
  const categories: Category[] = rows
    .filter(c => c.level === 0)
    .map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: slugImageMap[c.slug] || c.icon || '/placeholder.svg',
    }));

  const subCategories: SubCategory[] = rows
    .filter(c => c.level === 1 && c.parent_id)
    .map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      categoryId: c.parent_id!,
      image: slugImageMap[c.slug] || c.icon || '/placeholder.svg',
    }));

  return { categories, subCategories };
}

export function useDbCategories() {
  return useQuery({
    queryKey: ['db-categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
  });
}
