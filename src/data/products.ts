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

import type { Product, Category, SubCategory } from '@/types';

export const categories: Category[] = [
  { id: 'skincare', name: 'Skincare', slug: 'skincare', image: vitaminCSerum },
  { id: 'makeup', name: 'Makeup', slug: 'makeup', image: matteLipstick },
  { id: 'haircare', name: 'Haircare', slug: 'haircare', image: shampoo },
  { id: 'fragrance', name: 'Fragrance', slug: 'fragrance', image: perfume },
  { id: 'bath-body', name: 'Bath & Body', slug: 'bath-body', image: bodyLotion },
  { id: 'combos', name: 'Combos', slug: 'combos', image: lipGlossSet },
  { id: 'lip-care', name: 'Lip Care', slug: 'lip-care', image: lipBalm },
  { id: 'face-masks', name: 'Face Masks', slug: 'face-masks', image: sheetMask },
  { id: 'nail-care', name: 'Nail Care', slug: 'nail-care', image: nailPolish },
  { id: 'tools', name: 'Tools & Brushes', slug: 'tools', image: brushSet },
  { id: 'sun-care', name: 'Sun Care', slug: 'sun-care', image: sunscreen },
  { id: 'bestsellers', name: 'Bestsellers', slug: 'bestsellers', image: highlighter },
  { id: 'eye-makeup', name: 'Eye Makeup', slug: 'eye-makeup', image: eyeshadowPalette },
  { id: 'gift-sets', name: 'Gift Sets', slug: 'gift-sets', image: blush },
  { id: 'new-arrivals', name: 'New Arrivals', slug: 'new-arrivals', image: foundation },
];

export const subCategories: SubCategory[] = [
  { id: 'all-skincare', name: 'All', slug: 'all', categoryId: 'skincare', image: vitaminCSerum },
  { id: 'serums', name: 'Serums', slug: 'serums', categoryId: 'skincare', image: vitaminCSerum },
  { id: 'moisturizers', name: 'Moisturizers', slug: 'moisturizers', categoryId: 'skincare', image: faceCream },
  { id: 'cleansers', name: 'Cleansers', slug: 'cleansers', categoryId: 'skincare', image: faceWash },
  { id: 'sunscreens', name: 'Sunscreens', slug: 'sunscreens', categoryId: 'skincare', image: sunscreen },
  { id: 'masks', name: 'Masks', slug: 'masks', categoryId: 'skincare', image: sheetMask },

  { id: 'all-makeup', name: 'All', slug: 'all', categoryId: 'makeup', image: matteLipstick },
  { id: 'lips', name: 'Lips', slug: 'lips', categoryId: 'makeup', image: matteLipstick },
  { id: 'face-makeup', name: 'Face', slug: 'face', categoryId: 'makeup', image: foundation },
  { id: 'eyes', name: 'Eyes', slug: 'eyes', categoryId: 'makeup', image: mascara },
  { id: 'cheeks', name: 'Cheeks', slug: 'cheeks', categoryId: 'makeup', image: blush },
  { id: 'nails', name: 'Nails', slug: 'nails', categoryId: 'makeup', image: nailPolish },

  { id: 'all-haircare', name: 'All', slug: 'all', categoryId: 'haircare', image: shampoo },
  { id: 'shampoos', name: 'Shampoos', slug: 'shampoos', categoryId: 'haircare', image: shampoo },
  { id: 'oils', name: 'Hair Oils', slug: 'hair-oils', categoryId: 'haircare', image: hairOil },

  { id: 'all-fragrance', name: 'All', slug: 'all', categoryId: 'fragrance', image: perfume },
  { id: 'perfumes', name: 'Perfumes', slug: 'perfumes', categoryId: 'fragrance', image: perfume },

  { id: 'all-bath', name: 'All', slug: 'all', categoryId: 'bath-body', image: bodyLotion },
  { id: 'lotions', name: 'Lotions', slug: 'lotions', categoryId: 'bath-body', image: bodyLotion },
];

export const products: Product[] = [
  {
    id: '1', name: 'Vitamin C Brightening Serum', slug: 'vitamin-c-serum',
    categoryId: 'skincare', subCategoryId: 'serums', image: vitaminCSerum,
    description: 'A powerful antioxidant serum that brightens skin, reduces dark spots, and promotes a radiant, even-toned complexion. Enriched with 15% Vitamin C and Hyaluronic Acid.',
    tags: ['Brightening', 'Anti-aging', 'Serum'], weight: '30ml', discount: 16,
    deliveryTime: '30 mins',
    ingredients: 'Vitamin C (15%), Hyaluronic Acid, Vitamin E, Ferulic Acid, Niacinamide',
    howToUse: 'Apply 3-4 drops on cleansed face. Follow with moisturizer and sunscreen.',
    variants: [
      { id: 'v1-1', name: '30ml', size: '30ml', price: 499, mrp: 599 },
      { id: 'v1-2', name: '50ml', size: '50ml', price: 799, mrp: 949 },
    ],
  },
  {
    id: '2', name: 'Velvet Matte Lipstick – Ruby Red', slug: 'matte-lipstick-ruby',
    categoryId: 'makeup', subCategoryId: 'lips', image: matteLipstick,
    description: 'Long-lasting matte finish lipstick with intense color payoff. Enriched with Vitamin E for moisturized lips all day.',
    tags: ['Matte', 'Long-lasting', 'Lipstick'], weight: '4.5g', discount: 15,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v2-1', name: 'Ruby Red', size: '4.5g', price: 349, mrp: 412 },
      { id: 'v2-2', name: 'Nude Pink', size: '4.5g', price: 349, mrp: 412 },
      { id: 'v2-3', name: 'Berry Wine', size: '4.5g', price: 349, mrp: 412 },
    ],
  },
  {
    id: '3', name: 'Hydrating Face Moisturizer', slug: 'hydrating-face-cream',
    categoryId: 'skincare', subCategoryId: 'moisturizers', image: faceCream,
    description: 'Ultra-hydrating face cream with ceramides and peptides. Locks in moisture for 48 hours. Suitable for all skin types.',
    tags: ['Hydrating', 'Daily Care', 'Moisturizer'], weight: '50g', discount: 12,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v3-1', name: '50g', size: '50g', price: 399, mrp: 455 },
      { id: 'v3-2', name: '100g', size: '100g', price: 699, mrp: 799 },
    ],
  },
  {
    id: '4', name: 'Gentle Foam Cleanser', slug: 'gentle-foam-cleanser',
    categoryId: 'skincare', subCategoryId: 'cleansers', image: faceWash,
    description: 'pH-balanced foam cleanser that gently removes impurities without stripping natural moisture. With Aloe Vera and Green Tea extracts.',
    tags: ['Gentle', 'Daily Use', 'Cleanser'], weight: '150ml', discount: 7,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v4-1', name: '150ml', size: '150ml', price: 279, mrp: 299 },
      { id: 'v4-2', name: '250ml', size: '250ml', price: 449, mrp: 499 },
    ],
  },
  {
    id: '5', name: 'Volumizing Mascara – Jet Black', slug: 'volumizing-mascara',
    categoryId: 'makeup', subCategoryId: 'eyes', image: mascara,
    description: 'Buildable volume mascara with smudge-proof formula. Creates dramatic lashes that last all day without clumping.',
    tags: ['Volumizing', 'Smudge-proof', 'Mascara'], weight: '10ml', discount: 10,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v5-1', name: 'Jet Black', size: '10ml', price: 449, mrp: 499 },
    ],
  },
  {
    id: '6', name: 'Rose Gold Shimmer Highlighter', slug: 'rose-gold-highlighter',
    categoryId: 'makeup', subCategoryId: 'cheeks', image: highlighter,
    description: 'Buttery-smooth highlighter with a gorgeous rose gold shimmer. Buildable formula for subtle glow to blinding highlight.',
    tags: ['Shimmer', 'Glow', 'Highlighter'], weight: '8g', discount: 20,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v6-1', name: 'Rose Gold', size: '8g', price: 599, mrp: 749 },
      { id: 'v6-2', name: 'Champagne', size: '8g', price: 599, mrp: 749 },
    ],
  },
  {
    id: '7', name: 'Nourishing Argan Hair Oil', slug: 'argan-hair-oil',
    categoryId: 'haircare', subCategoryId: 'oils', image: hairOil,
    description: 'Pure argan oil infused with biotin and keratin. Strengthens hair, reduces frizz, and adds shine.',
    tags: ['Nourishing', 'Anti-frizz', 'Hair Oil'], weight: '100ml', discount: 18,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v7-1', name: '100ml', size: '100ml', price: 549, mrp: 669 },
      { id: 'v7-2', name: '200ml', size: '200ml', price: 899, mrp: 1099 },
    ],
  },
  {
    id: '8', name: 'Hyaluronic Acid Sheet Mask', slug: 'hyaluronic-sheet-mask',
    categoryId: 'skincare', subCategoryId: 'masks', image: sheetMask,
    description: 'Deeply hydrating sheet mask infused with triple hyaluronic acid. Plumps and revitalizes tired skin in just 15 minutes.',
    tags: ['Hydrating', 'Sheet Mask', 'Quick Fix'], weight: '25ml', discount: 0,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v8-1', name: 'Single', size: '25ml', price: 149, mrp: 149 },
      { id: 'v8-2', name: 'Pack of 5', size: '5x25ml', price: 649, mrp: 745 },
    ],
  },
  {
    id: '9', name: 'Makeup Setting Spray', slug: 'setting-spray',
    categoryId: 'makeup', subCategoryId: 'face-makeup', image: settingSpray,
    description: 'Lightweight setting spray that locks makeup in place for up to 16 hours. Controls oil and adds a natural dewy finish.',
    tags: ['Long-lasting', 'Setting', 'Spray'], weight: '100ml', discount: 8,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v9-1', name: '100ml', size: '100ml', price: 399, mrp: 435 },
    ],
  },
  {
    id: '10', name: 'Glossy Lip Gloss Set – 4 Shades', slug: 'lip-gloss-set',
    categoryId: 'makeup', subCategoryId: 'lips', image: lipGlossSet,
    description: 'Collection of 4 high-shine lip glosses in versatile everyday shades. Non-sticky formula with vitamin E.',
    tags: ['Glossy', 'Set', 'Lip Gloss'], weight: '4x5ml', discount: 25,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v10-1', name: 'Nude Collection', size: '4x5ml', price: 599, mrp: 799 },
      { id: 'v10-2', name: 'Berry Collection', size: '4x5ml', price: 599, mrp: 799 },
    ],
  },
  {
    id: '11', name: 'SPF 50+ Sunscreen Lotion', slug: 'spf50-sunscreen',
    categoryId: 'skincare', subCategoryId: 'sunscreens', image: sunscreen,
    description: 'Broad spectrum SPF 50+ sunscreen with PA++++. Lightweight, non-greasy formula. No white cast.',
    tags: ['SPF 50+', 'Lightweight', 'Sunscreen'], weight: '50ml', discount: 10,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v11-1', name: '50ml', size: '50ml', price: 449, mrp: 499 },
      { id: 'v11-2', name: '100ml', size: '100ml', price: 799, mrp: 899 },
    ],
  },
  {
    id: '12', name: 'Silk Finish Foundation', slug: 'silk-finish-foundation',
    categoryId: 'makeup', subCategoryId: 'face-makeup', image: foundation,
    description: 'Medium-to-full coverage foundation with a natural silk finish. Blends seamlessly for a flawless complexion.',
    tags: ['Full Coverage', 'Silk Finish', 'Foundation'], weight: '30ml', discount: 14,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v12-1', name: 'Fair', size: '30ml', price: 699, mrp: 812 },
      { id: 'v12-2', name: 'Medium', size: '30ml', price: 699, mrp: 812 },
      { id: 'v12-3', name: 'Deep', size: '30ml', price: 699, mrp: 812 },
    ],
  },
  {
    id: '13', name: 'Warm Neutrals Eyeshadow Palette', slug: 'warm-eyeshadow-palette',
    categoryId: 'makeup', subCategoryId: 'eyes', image: eyeshadowPalette,
    description: '18-shade eyeshadow palette with mattes and shimmers. Highly pigmented, blendable formula.',
    tags: ['Palette', 'Pigmented', 'Eyeshadow'], weight: '20g', discount: 22,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v13-1', name: 'Warm Neutrals', size: '18 shades', price: 899, mrp: 1149 },
    ],
  },
  {
    id: '14', name: 'Soft Petal Blush', slug: 'soft-petal-blush',
    categoryId: 'makeup', subCategoryId: 'cheeks', image: blush,
    description: 'Silky powder blush that gives a natural flush of color. Buildable and long-wearing.',
    tags: ['Natural', 'Buildable', 'Blush'], weight: '6g', discount: 15,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v14-1', name: 'Peach Petal', size: '6g', price: 399, mrp: 469 },
      { id: 'v14-2', name: 'Rose Petal', size: '6g', price: 399, mrp: 469 },
    ],
  },
  {
    id: '15', name: 'Luxury Eau de Parfum', slug: 'luxury-eau-de-parfum',
    categoryId: 'fragrance', subCategoryId: 'perfumes', image: perfume,
    description: 'An enchanting blend of jasmine, vanilla, and sandalwood. Long-lasting scent that evolves beautifully throughout the day.',
    tags: ['Long-lasting', 'Floral', 'Perfume'], weight: '50ml', discount: 12,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v15-1', name: '50ml', size: '50ml', price: 1299, mrp: 1475 },
      { id: 'v15-2', name: '100ml', size: '100ml', price: 1999, mrp: 2275 },
    ],
  },
  {
    id: '16', name: 'Classic Nail Polish Collection', slug: 'nail-polish-collection',
    categoryId: 'makeup', subCategoryId: 'nails', image: nailPolish,
    description: 'Set of 5 chip-resistant nail polishes in classic shades. Quick-dry formula with high-shine finish.',
    tags: ['Quick-dry', 'Set', 'Nail Polish'], weight: '5x10ml', discount: 20,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v16-1', name: 'Classic Set', size: '5x10ml', price: 499, mrp: 625 },
    ],
  },
  {
    id: '17', name: 'Hydra Body Lotion', slug: 'hydra-body-lotion',
    categoryId: 'bath-body', subCategoryId: 'lotions', image: bodyLotion,
    description: 'Deeply nourishing body lotion with shea butter and coconut oil. 72-hour hydration with a luxurious scent.',
    tags: ['Hydrating', 'Nourishing', 'Body Lotion'], weight: '250ml', discount: 10,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v17-1', name: '250ml', size: '250ml', price: 349, mrp: 389 },
      { id: 'v17-2', name: '500ml', size: '500ml', price: 599, mrp: 669 },
    ],
  },
  {
    id: '18', name: 'Botanical Repair Shampoo', slug: 'botanical-shampoo',
    categoryId: 'haircare', subCategoryId: 'shampoos', image: shampoo,
    description: 'Sulfate-free shampoo with botanical extracts. Repairs damaged hair while gently cleansing.',
    tags: ['Sulfate-free', 'Repair', 'Shampoo'], weight: '300ml', discount: 8,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v18-1', name: '300ml', size: '300ml', price: 449, mrp: 489 },
    ],
  },
  {
    id: '19', name: 'Professional Brush Set – 12 Pcs', slug: 'pro-brush-set',
    categoryId: 'tools', subCategoryId: 'all-tools', image: brushSet,
    description: 'Complete set of 12 professional makeup brushes with soft synthetic bristles. Includes face, eye, and lip brushes.',
    tags: ['Professional', 'Complete Set', 'Brushes'], weight: '12 pieces', discount: 30,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v19-1', name: '12-Piece Set', size: '12 pcs', price: 799, mrp: 1142 },
    ],
  },
  {
    id: '20', name: 'Precision Liquid Eyeliner', slug: 'precision-eyeliner',
    categoryId: 'makeup', subCategoryId: 'eyes', image: eyeliner,
    description: 'Ultra-fine tip liquid eyeliner for precise lines. Waterproof and smudge-proof formula lasts up to 24 hours.',
    tags: ['Precision', 'Waterproof', 'Eyeliner'], weight: '1ml', discount: 5,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v20-1', name: 'Jet Black', size: '1ml', price: 299, mrp: 315 },
      { id: 'v20-2', name: 'Brown', size: '1ml', price: 299, mrp: 315 },
    ],
  },
  {
    id: '21', name: 'Berry Tinted Lip Balm', slug: 'tinted-lip-balm',
    categoryId: 'lip-care', subCategoryId: 'all-lip', image: lipBalm,
    description: 'Moisturizing lip balm with a hint of berry color. Enriched with beeswax, coconut oil, and vitamin E.',
    tags: ['Tinted', 'Moisturizing', 'Lip Balm'], weight: '10g', discount: 0,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v21-1', name: 'Berry', size: '10g', price: 199, mrp: 199 },
      { id: 'v21-2', name: 'Rose', size: '10g', price: 199, mrp: 199 },
    ],
  },
];
