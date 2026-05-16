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
  {
    id: '22', name: 'Dewy Glow Foundation', slug: 'dewy-glow-foundation',
    categoryId: 'makeup', subCategoryId: 'face-makeup', image: foundation,
    description: 'Lightweight liquid foundation with a luminous dewy finish. Buildable medium coverage available across 12 inclusive shades for every skin tone.',
    tags: ['Dewy', 'Buildable', 'Foundation'], weight: '30ml', discount: 18,
    deliveryTime: '30 mins',
    ingredients: 'Hyaluronic Acid, Niacinamide, Squalane, Vitamin E',
    howToUse: 'Apply 2-3 drops on cleansed, moisturized skin. Blend with brush, sponge or fingertips.',
    variants: [
      { id: 'v22-1', name: 'Porcelain 100', size: '30ml', price: 749, mrp: 912 },
      { id: 'v22-2', name: 'Ivory 110', size: '30ml', price: 749, mrp: 912 },
      { id: 'v22-3', name: 'Vanilla 120', size: '30ml', price: 749, mrp: 912 },
      { id: 'v22-4', name: 'Beige 200', size: '30ml', price: 749, mrp: 912 },
      { id: 'v22-5', name: 'Sand 210', size: '30ml', price: 749, mrp: 912 },
      { id: 'v22-6', name: 'Honey 300', size: '30ml', price: 749, mrp: 912 },
      { id: 'v22-7', name: 'Caramel 310', size: '30ml', price: 749, mrp: 912 },
      { id: 'v22-8', name: 'Toffee 400', size: '30ml', price: 749, mrp: 912 },
      { id: 'v22-9', name: 'Almond 410', size: '30ml', price: 749, mrp: 912 },
      { id: 'v22-10', name: 'Mocha 500', size: '30ml', price: 749, mrp: 912 },
      { id: 'v22-11', name: 'Espresso 510', size: '30ml', price: 749, mrp: 912 },
      { id: 'v22-12', name: 'Ebony 600', size: '30ml', price: 749, mrp: 912 },
    ],
  },
  {
    id: '23', name: 'Matte Stay Foundation Stick', slug: 'matte-foundation-stick',
    categoryId: 'makeup', subCategoryId: 'face-makeup', image: foundation,
    description: 'Full coverage foundation stick with a soft matte finish. Easy to blend, transfer-resistant, lasts 14 hours. Available in 10 shades.',
    tags: ['Matte', 'Full Coverage', 'Stick'], weight: '9g', discount: 12,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v23-1', name: 'Light 01', size: '9g', price: 599, mrp: 680 },
      { id: 'v23-2', name: 'Light 02', size: '9g', price: 599, mrp: 680 },
      { id: 'v23-3', name: 'Light Medium 03', size: '9g', price: 599, mrp: 680 },
      { id: 'v23-4', name: 'Medium 04', size: '9g', price: 599, mrp: 680 },
      { id: 'v23-5', name: 'Medium 05', size: '9g', price: 599, mrp: 680 },
      { id: 'v23-6', name: 'Tan 06', size: '9g', price: 599, mrp: 680 },
      { id: 'v23-7', name: 'Tan 07', size: '9g', price: 599, mrp: 680 },
      { id: 'v23-8', name: 'Deep 08', size: '9g', price: 599, mrp: 680 },
      { id: 'v23-9', name: 'Deep 09', size: '9g', price: 599, mrp: 680 },
      { id: 'v23-10', name: 'Rich 10', size: '9g', price: 599, mrp: 680 },
    ],
  },
  {
    id: '24', name: 'Radiant Liquid Concealer', slug: 'radiant-concealer',
    categoryId: 'makeup', subCategoryId: 'face-makeup', image: foundation,
    description: 'Crease-free liquid concealer that brightens under-eyes and covers blemishes. 8 shades to match every undertone.',
    tags: ['Concealer', 'Brightening', 'Crease-free'], weight: '6ml', discount: 10,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v24-1', name: 'Fair Cool', size: '6ml', price: 449, mrp: 499 },
      { id: 'v24-2', name: 'Fair Warm', size: '6ml', price: 449, mrp: 499 },
      { id: 'v24-3', name: 'Light Neutral', size: '6ml', price: 449, mrp: 499 },
      { id: 'v24-4', name: 'Medium Cool', size: '6ml', price: 449, mrp: 499 },
      { id: 'v24-5', name: 'Medium Warm', size: '6ml', price: 449, mrp: 499 },
      { id: 'v24-6', name: 'Tan Neutral', size: '6ml', price: 449, mrp: 499 },
      { id: 'v24-7', name: 'Deep Warm', size: '6ml', price: 449, mrp: 499 },
      { id: 'v24-8', name: 'Rich Neutral', size: '6ml', price: 449, mrp: 499 },
    ],
  },
  {
    id: '25', name: 'Creamy Matte Lipstick Collection', slug: 'creamy-matte-lipstick-collection',
    categoryId: 'makeup', subCategoryId: 'lips', image: matteLipstick,
    description: 'Buttery matte lipstick with rich pigment in 10 wearable shades from soft nudes to bold reds. Comfortable, non-drying formula.',
    tags: ['Matte', 'Pigmented', 'Lipstick'], weight: '4g', discount: 18,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v25-1', name: 'Bare Nude', size: '4g', price: 379, mrp: 462 },
      { id: 'v25-2', name: 'Pink Sand', size: '4g', price: 379, mrp: 462 },
      { id: 'v25-3', name: 'Rose Mauve', size: '4g', price: 379, mrp: 462 },
      { id: 'v25-4', name: 'Coral Crush', size: '4g', price: 379, mrp: 462 },
      { id: 'v25-5', name: 'Brick Red', size: '4g', price: 379, mrp: 462 },
      { id: 'v25-6', name: 'Classic Red', size: '4g', price: 379, mrp: 462 },
      { id: 'v25-7', name: 'Cherry Pop', size: '4g', price: 379, mrp: 462 },
      { id: 'v25-8', name: 'Berry Wine', size: '4g', price: 379, mrp: 462 },
      { id: 'v25-9', name: 'Plum Noir', size: '4g', price: 379, mrp: 462 },
      { id: 'v25-10', name: 'Chocolate Brown', size: '4g', price: 379, mrp: 462 },
    ],
  },
  {
    id: '26', name: 'Glass Shine Lip Gloss', slug: 'glass-shine-lip-gloss',
    categoryId: 'makeup', subCategoryId: 'lips', image: lipGlossSet,
    description: 'High-shine, non-sticky lip gloss with plumping peptides. 8 sheer-to-medium shades for a juicy glass-lip finish.',
    tags: ['Glossy', 'Plumping', 'Gloss'], weight: '5ml', discount: 15,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v26-1', name: 'Clear', size: '5ml', price: 299, mrp: 352 },
      { id: 'v26-2', name: 'Peach Fizz', size: '5ml', price: 299, mrp: 352 },
      { id: 'v26-3', name: 'Pink Shimmer', size: '5ml', price: 299, mrp: 352 },
      { id: 'v26-4', name: 'Rose Glow', size: '5ml', price: 299, mrp: 352 },
      { id: 'v26-5', name: 'Mauve Mist', size: '5ml', price: 299, mrp: 352 },
      { id: 'v26-6', name: 'Cherry Tint', size: '5ml', price: 299, mrp: 352 },
      { id: 'v26-7', name: 'Berry Shine', size: '5ml', price: 299, mrp: 352 },
      { id: 'v26-8', name: 'Bronze Beam', size: '5ml', price: 299, mrp: 352 },
    ],
  },
  {
    id: '27', name: 'Silky Powder Blush Duo', slug: 'silky-powder-blush-duo',
    categoryId: 'makeup', subCategoryId: 'cheeks', image: blush,
    description: 'Finely milled powder blush with a silky satin finish. 6 flattering shades for every skin tone.',
    tags: ['Powder', 'Satin', 'Blush'], weight: '6g', discount: 12,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v27-1', name: 'Soft Peach', size: '6g', price: 429, mrp: 488 },
      { id: 'v27-2', name: 'Petal Pink', size: '6g', price: 429, mrp: 488 },
      { id: 'v27-3', name: 'Rose Bloom', size: '6g', price: 429, mrp: 488 },
      { id: 'v27-4', name: 'Coral Sunset', size: '6g', price: 429, mrp: 488 },
      { id: 'v27-5', name: 'Berry Flush', size: '6g', price: 429, mrp: 488 },
      { id: 'v27-6', name: 'Terracotta', size: '6g', price: 429, mrp: 488 },
    ],
  },
  {
    id: '28', name: 'Strobe Liquid Highlighter', slug: 'strobe-liquid-highlighter',
    categoryId: 'makeup', subCategoryId: 'cheeks', image: highlighter,
    description: 'Liquid highlighter with multidimensional pearl pigments. Use alone for a wet glow or mix with foundation. 5 shades.',
    tags: ['Liquid', 'Glow', 'Highlighter'], weight: '15ml', discount: 20,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v28-1', name: 'Moonstone', size: '15ml', price: 549, mrp: 686 },
      { id: 'v28-2', name: 'Champagne', size: '15ml', price: 549, mrp: 686 },
      { id: 'v28-3', name: 'Rose Gold', size: '15ml', price: 549, mrp: 686 },
      { id: 'v28-4', name: 'Bronze', size: '15ml', price: 549, mrp: 686 },
      { id: 'v28-5', name: 'Copper Glow', size: '15ml', price: 549, mrp: 686 },
    ],
  },
  {
    id: '29', name: 'Smokey Nights Eyeshadow Palette', slug: 'smokey-nights-eyeshadow',
    categoryId: 'makeup', subCategoryId: 'eyes', image: eyeshadowPalette,
    description: 'A 12-pan palette in 3 colour stories — Smokey, Sunset and Mauve — to take your look from day to night.',
    tags: ['Palette', 'Smokey', 'Eyeshadow'], weight: '15g', discount: 25,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v29-1', name: 'Smokey', size: '12 shades', price: 999, mrp: 1332 },
      { id: 'v29-2', name: 'Sunset', size: '12 shades', price: 999, mrp: 1332 },
      { id: 'v29-3', name: 'Mauve Dream', size: '12 shades', price: 999, mrp: 1332 },
    ],
  },
  {
    id: '30', name: 'Long-Wear Kohl Kajal', slug: 'longwear-kohl-kajal',
    categoryId: 'makeup', subCategoryId: 'eyes', image: eyeliner,
    description: 'Smudge-proof, waterproof kohl kajal with intense colour payoff. Glides on smoothly. 5 shades.',
    tags: ['Waterproof', 'Kajal', 'Eye'], weight: '0.35g', discount: 10,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v30-1', name: 'Jet Black', size: '0.35g', price: 249, mrp: 277 },
      { id: 'v30-2', name: 'Espresso Brown', size: '0.35g', price: 249, mrp: 277 },
      { id: 'v30-3', name: 'Smoke Grey', size: '0.35g', price: 249, mrp: 277 },
      { id: 'v30-4', name: 'Forest Green', size: '0.35g', price: 249, mrp: 277 },
      { id: 'v30-5', name: 'Midnight Blue', size: '0.35g', price: 249, mrp: 277 },
    ],
  },
  {
    id: '31', name: 'Salon Shine Nail Polish', slug: 'salon-shine-nail-polish',
    categoryId: 'makeup', subCategoryId: 'nails', image: nailPolish,
    description: 'Chip-resistant, high-gloss nail polish with a 10-day wear. Available in 12 trending shades.',
    tags: ['Glossy', 'Long-wear', 'Nail Polish'], weight: '10ml', discount: 15,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v31-1', name: 'Milky White', size: '10ml', price: 199, mrp: 235 },
      { id: 'v31-2', name: 'Ballet Pink', size: '10ml', price: 199, mrp: 235 },
      { id: 'v31-3', name: 'Hot Pink', size: '10ml', price: 199, mrp: 235 },
      { id: 'v31-4', name: 'Coral Reef', size: '10ml', price: 199, mrp: 235 },
      { id: 'v31-5', name: 'Classic Red', size: '10ml', price: 199, mrp: 235 },
      { id: 'v31-6', name: 'Burgundy Wine', size: '10ml', price: 199, mrp: 235 },
      { id: 'v31-7', name: 'Plum', size: '10ml', price: 199, mrp: 235 },
      { id: 'v31-8', name: 'Lavender', size: '10ml', price: 199, mrp: 235 },
      { id: 'v31-9', name: 'Sky Blue', size: '10ml', price: 199, mrp: 235 },
      { id: 'v31-10', name: 'Mint Green', size: '10ml', price: 199, mrp: 235 },
      { id: 'v31-11', name: 'Charcoal', size: '10ml', price: 199, mrp: 235 },
      { id: 'v31-12', name: 'Jet Black', size: '10ml', price: 199, mrp: 235 },
    ],
  },
  {
    id: '32', name: 'Velvet Tinted Lip Balm', slug: 'velvet-tinted-lip-balm',
    categoryId: 'lip-care', subCategoryId: 'all-lip', image: lipBalm,
    description: 'Hydrating tinted lip balm with shea butter and vitamin E. 6 buildable shades for everyday wear.',
    tags: ['Tinted', 'Hydrating', 'Lip Balm'], weight: '4g', discount: 8,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v32-1', name: 'Bare', size: '4g', price: 229, mrp: 249 },
      { id: 'v32-2', name: 'Peach', size: '4g', price: 229, mrp: 249 },
      { id: 'v32-3', name: 'Pink', size: '4g', price: 229, mrp: 249 },
      { id: 'v32-4', name: 'Rose', size: '4g', price: 229, mrp: 249 },
      { id: 'v32-5', name: 'Berry', size: '4g', price: 229, mrp: 249 },
      { id: 'v32-6', name: 'Cherry', size: '4g', price: 229, mrp: 249 },
    ],
  },
  {
    id: '33', name: 'Midnight Bloom Eau de Parfum', slug: 'midnight-bloom-edp',
    categoryId: 'fragrance', subCategoryId: 'perfumes', image: perfume,
    description: 'A sensual fragrance with notes of black orchid, oud and amber. Available in 3 sizes.',
    tags: ['Floral', 'Long-lasting', 'Perfume'], weight: '50ml', discount: 14,
    deliveryTime: '30 mins',
    variants: [
      { id: 'v33-1', name: '30ml', size: '30ml', price: 899, mrp: 1045 },
      { id: 'v33-2', name: '50ml', size: '50ml', price: 1399, mrp: 1627 },
      { id: 'v33-3', name: '100ml', size: '100ml', price: 2199, mrp: 2557 },
    ],
  },
];
