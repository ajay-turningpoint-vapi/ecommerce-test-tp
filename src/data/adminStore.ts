// ─── Admin Dummy Data Store ───
// All data is in-memory. Changes persist only during the session.

let nextId = 1000;
function genId() { return `id-${++nextId}-${Date.now()}`; }

// ─── TYPES ───

export interface Category {
  id: string; name: string; slug: string; parentId: string | null;
  level: number; icon: string; bannerImage: string; status: 'active' | 'inactive';
}

export interface Brand {
  id: string; name: string; slug: string; logo: string;
  description: string; status: 'active' | 'inactive';
}

export interface Attribute {
  id: string; name: string; type: string; values: string[];
}

export interface AdminProduct {
  id: string; title: string; slug: string; categoryId: string;
  brandId: string; shortDescription: string; fullDescription: string;
  status: 'active' | 'draft' | 'inactive'; discount: number;
  weight: string; deliveryTime: string; createdAt: string;
  tags: string[]; specifications: { key: string; value: string }[];
}

export interface ProductVariant {
  id: string; productId: string; sku: string; name: string;
  price: number; mrp: number; discountPrice: number | null;
  barcode: string; status: 'active' | 'inactive'; isDefault: boolean;
}

export interface VariantAttributeValue {
  id: string; variantId: string; attributeId: string; value: string;
}

export interface ProductImage {
  id: string; productId: string; variantId: string | null;
  imageUrl: string; isThumbnail: boolean; position: number;
}

export interface InventoryItem {
  id: string; variantId: string; warehouseId: string;
  availableStock: number; reservedStock: number; damagedStock: number;
}

export interface Warehouse {
  id: string; name: string; city: string; state: string; pincode: string;
}

export interface Banner {
  id: string; title: string; imageUrl: string; link: string;
  position: number; status: 'active' | 'inactive';
}

export interface DummyOrder {
  id: string; orderNumber: string; customerName: string; customerEmail: string;
  phone: string; address: string; city: string; pincode: string;
  items: { productName: string; variantSku: string; qty: number; price: number }[];
  totalAmount: number; status: string; paymentStatus: string; paymentMethod: string;
  createdAt: string;
}

export interface DummyCustomer {
  id: string; name: string; email: string; phone: string;
  totalOrders: number; totalSpent: number; joinDate: string; status: 'active' | 'blocked';
}

export interface DummyShipment {
  id: string; orderNumber: string; trackingNumber: string; courier: string;
  status: string; shippedAt: string | null; estimatedDelivery: string | null;
}

export interface DummyReturn {
  id: string; orderNumber: string; productName: string; reason: string;
  status: string; requestDate: string; refundAmount: number;
}

export interface Discount {
  id: string; name: string; applyTo: 'product' | 'category' | 'brand';
  targetId: string; variantId: string | null;
  discountType: 'percentage' | 'flat'; value: number;
  minOrderValue: number | null; maxDiscount: number | null; usageLimit: number | null;
  startDate: string; endDate: string; status: 'active' | 'inactive';
}

// ─── SEED DATA ───

const categories: Category[] = [
  // Level 0 (parent)
  { id: 'cat-1', name: 'Skincare', slug: 'skincare', parentId: null, level: 0, icon: '🧴', bannerImage: '/placeholder.svg', status: 'active' },
  { id: 'cat-2', name: 'Makeup', slug: 'makeup', parentId: null, level: 0, icon: '💄', bannerImage: '/placeholder.svg', status: 'active' },
  { id: 'cat-3', name: 'Haircare', slug: 'haircare', parentId: null, level: 0, icon: '💇', bannerImage: '/placeholder.svg', status: 'active' },
  { id: 'cat-4', name: 'Fragrance', slug: 'fragrance', parentId: null, level: 0, icon: '🌸', bannerImage: '/placeholder.svg', status: 'active' },
  { id: 'cat-5', name: 'Bath & Body', slug: 'bath-body', parentId: null, level: 0, icon: '🛁', bannerImage: '/placeholder.svg', status: 'active' },
  { id: 'cat-6', name: 'Nail Care', slug: 'nail-care', parentId: null, level: 0, icon: '💅', bannerImage: '/placeholder.svg', status: 'active' },
  { id: 'cat-7', name: 'Tools & Brushes', slug: 'tools', parentId: null, level: 0, icon: '🖌️', bannerImage: '/placeholder.svg', status: 'active' },
  // Level 1 (sub)
  { id: 'cat-s1', name: 'Serums', slug: 'serums', parentId: 'cat-1', level: 1, icon: '', bannerImage: '', status: 'active' },
  { id: 'cat-s2', name: 'Moisturizers', slug: 'moisturizers', parentId: 'cat-1', level: 1, icon: '', bannerImage: '', status: 'active' },
  { id: 'cat-s3', name: 'Cleansers', slug: 'cleansers', parentId: 'cat-1', level: 1, icon: '', bannerImage: '', status: 'active' },
  { id: 'cat-s4', name: 'Sunscreens', slug: 'sunscreens', parentId: 'cat-1', level: 1, icon: '', bannerImage: '', status: 'active' },
  { id: 'cat-s5', name: 'Face Masks', slug: 'face-masks', parentId: 'cat-1', level: 1, icon: '', bannerImage: '', status: 'active' },
  { id: 'cat-s6', name: 'Lipstick', slug: 'lipstick', parentId: 'cat-2', level: 1, icon: '', bannerImage: '', status: 'active' },
  { id: 'cat-s7', name: 'Foundation', slug: 'foundation', parentId: 'cat-2', level: 1, icon: '', bannerImage: '', status: 'active' },
  { id: 'cat-s8', name: 'Highlighter', slug: 'highlighter', parentId: 'cat-2', level: 1, icon: '', bannerImage: '', status: 'active' },
  { id: 'cat-s9', name: 'Blush', slug: 'blush', parentId: 'cat-2', level: 1, icon: '', bannerImage: '', status: 'active' },
  { id: 'cat-s10', name: 'Mascara', slug: 'mascara', parentId: 'cat-2', level: 1, icon: '', bannerImage: '', status: 'active' },
  { id: 'cat-s11', name: 'Eyeliner', slug: 'eyeliner', parentId: 'cat-2', level: 1, icon: '', bannerImage: '', status: 'active' },
  { id: 'cat-s12', name: 'Eyeshadow', slug: 'eyeshadow', parentId: 'cat-2', level: 1, icon: '', bannerImage: '', status: 'active' },
  { id: 'cat-s13', name: 'Shampoos', slug: 'shampoos', parentId: 'cat-3', level: 1, icon: '', bannerImage: '', status: 'active' },
  { id: 'cat-s14', name: 'Hair Oils', slug: 'hair-oils', parentId: 'cat-3', level: 1, icon: '', bannerImage: '', status: 'active' },
  { id: 'cat-s15', name: 'Perfumes', slug: 'perfumes', parentId: 'cat-4', level: 1, icon: '', bannerImage: '', status: 'active' },
  { id: 'cat-s16', name: 'Body Lotions', slug: 'body-lotions', parentId: 'cat-5', level: 1, icon: '', bannerImage: '', status: 'active' },
  { id: 'cat-s17', name: 'Nail Polish', slug: 'nail-polish', parentId: 'cat-6', level: 1, icon: '', bannerImage: '', status: 'active' },
  { id: 'cat-s18', name: 'Lip Balm', slug: 'lip-balm', parentId: 'cat-2', level: 1, icon: '', bannerImage: '', status: 'active' },
];

const brands: Brand[] = [
  { id: 'br-1', name: 'Lakmé', slug: 'lakme', logo: '/placeholder.svg', description: 'India\'s No. 1 cosmetics brand', status: 'active' },
  { id: 'br-2', name: 'Maybelline', slug: 'maybelline', logo: '/placeholder.svg', description: 'Maybe she\'s born with it', status: 'active' },
  { id: 'br-3', name: 'L\'Oréal Paris', slug: 'loreal', logo: '/placeholder.svg', description: 'Because You\'re Worth It', status: 'active' },
  { id: 'br-4', name: 'Nykaa', slug: 'nykaa', logo: '/placeholder.svg', description: 'India\'s premier beauty brand', status: 'active' },
  { id: 'br-5', name: 'MAC', slug: 'mac', logo: '/placeholder.svg', description: 'Professional makeup artistry', status: 'active' },
  { id: 'br-6', name: 'Forest Essentials', slug: 'forest-essentials', logo: '/placeholder.svg', description: 'Luxurious Ayurveda', status: 'active' },
  { id: 'br-7', name: 'Biotique', slug: 'biotique', logo: '/placeholder.svg', description: 'Advanced Ayurveda since 1992', status: 'active' },
  { id: 'br-8', name: 'Sugar Cosmetics', slug: 'sugar', logo: '/placeholder.svg', description: 'Bold makeup for bold women', status: 'active' },
];

const attributes: Attribute[] = [
  { id: 'attr-1', name: 'Color', type: 'text', values: ['Red', 'Pink', 'Nude', 'Berry', 'Coral', 'Mauve', 'Brown', 'Peach', 'Rose Gold', 'Champagne', 'Jet Black', 'Deep'] },
  { id: 'attr-2', name: 'Size', type: 'text', values: ['30ml', '50ml', '100ml', '150ml', '200ml', '250ml', '300ml', '500ml'] },
  { id: 'attr-3', name: 'Finish', type: 'text', values: ['Matte', 'Glossy', 'Shimmer', 'Satin', 'Cream', 'Dewy'] },
  { id: 'attr-4', name: 'Coverage', type: 'text', values: ['Light', 'Medium', 'Full', 'Buildable'] },
  { id: 'attr-5', name: 'Skin Type', type: 'text', values: ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive', 'All'] },
  { id: 'attr-6', name: 'SPF Level', type: 'text', values: ['SPF 15', 'SPF 30', 'SPF 50', 'SPF 50+'] },
];

const d = { tags: [] as string[], specifications: [] as { key: string; value: string }[] };
const products: AdminProduct[] = [
  { ...d, id: 'prod-1', title: 'Lakmé Absolute Matte Lipstick', slug: 'lakme-matte-lipstick', categoryId: 'cat-s6', brandId: 'br-1', shortDescription: 'Long-lasting matte finish lipstick', fullDescription: 'Enriched with argan oil, this lipstick provides intense color with a comfortable matte finish that lasts up to 12 hours.', status: 'active', discount: 15, weight: '4.5g', deliveryTime: '2-3 days', createdAt: '2025-12-01', tags: ['Lipstick','Matte','Long-lasting'], ingredients: 'Argan Oil, Jojoba Oil, Vitamin E, Beeswax' },
  { ...d, id: 'prod-2', title: 'Vitamin C Brightening Serum', slug: 'vitamin-c-serum', categoryId: 'cat-s1', brandId: 'br-4', shortDescription: 'Brightening vitamin C face serum', fullDescription: 'A potent vitamin C serum that brightens, evens skin tone and reduces dark spots for a radiant complexion.', status: 'active', discount: 10, weight: '30ml', deliveryTime: '2-3 days', createdAt: '2025-12-05', tags: ['Serum','Brightening','Vitamin C'], ingredients: 'Vitamin C 15%, Hyaluronic Acid, Niacinamide', howToUse: 'Apply 3-4 drops on clean face. Gently pat until absorbed. Use morning and night.' },
  { ...d, id: 'prod-3', title: 'Silk Finish Foundation', slug: 'silk-foundation', categoryId: 'cat-s7', brandId: 'br-3', shortDescription: 'Smooth finish liquid foundation', fullDescription: 'A medium-to-full coverage foundation with a silk-smooth finish. Blends seamlessly for flawless skin.', status: 'active', discount: 20, weight: '30ml', deliveryTime: '2-3 days', createdAt: '2025-12-10', tags: ['Foundation','Full Coverage'] },
  { ...d, id: 'prod-4', title: 'Rose Gold Highlighter', slug: 'rose-gold-highlighter', categoryId: 'cat-s8', brandId: 'br-5', shortDescription: 'Illuminating powder highlighter', fullDescription: 'A finely milled highlighter that gives a natural, luminous glow. Perfect for cheekbones, brow bones and nose bridge.', status: 'active', discount: 0, weight: '8g', deliveryTime: '3-5 days', createdAt: '2025-12-15', tags: ['Highlighter','Shimmer'] },
  { ...d, id: 'prod-5', title: 'Volumizing Mascara', slug: 'volumizing-mascara', categoryId: 'cat-s10', brandId: 'br-2', shortDescription: 'Volume boosting waterproof mascara', fullDescription: 'The unique brush design lifts and volumizes each lash for a dramatic, clump-free look. Waterproof formula lasts all day.', status: 'active', discount: 5, weight: '10ml', deliveryTime: '2-3 days', createdAt: '2025-12-18', tags: ['Mascara','Waterproof','Volume'] },
  { ...d, id: 'prod-6', title: 'Hydrating Face Cream', slug: 'hydrating-face-cream', categoryId: 'cat-s2', brandId: 'br-6', shortDescription: 'Deep hydrating face cream', fullDescription: 'An Ayurvedic face cream enriched with saffron and almond oil for intense hydration and a youthful glow.', status: 'active', discount: 12, weight: '50g', deliveryTime: '3-5 days', createdAt: '2026-01-02', tags: ['Moisturizer','Ayurvedic'], ingredients: 'Saffron, Almond Oil, Shea Butter', serves: '60 days' },
  { ...d, id: 'prod-7', title: 'Gentle Foam Cleanser', slug: 'gentle-foam-cleanser', categoryId: 'cat-s3', brandId: 'br-7', shortDescription: 'Mild foam face cleanser', fullDescription: 'A gentle foam cleanser suitable for all skin types. Removes impurities without stripping natural oils.', status: 'active', discount: 0, weight: '150ml', deliveryTime: '2-3 days', createdAt: '2026-01-10', tags: ['Cleanser','Gentle'] },
  { ...d, id: 'prod-8', title: 'SPF 50 Sunscreen', slug: 'spf50-sunscreen', categoryId: 'cat-s4', brandId: 'br-4', shortDescription: 'Broad spectrum SPF 50 sunscreen', fullDescription: 'Ultra-light, non-greasy sunscreen with SPF 50 PA+++ for complete UV protection. Suitable for daily use.', status: 'active', discount: 8, weight: '50ml', deliveryTime: '2-3 days', createdAt: '2026-01-15', tags: ['Sunscreen','SPF 50'], howToUse: 'Apply generously 15 mins before sun exposure. Reapply every 2 hours.' },
  { ...d, id: 'prod-9', title: 'Argan Hair Oil', slug: 'argan-hair-oil', categoryId: 'cat-s14', brandId: 'br-6', shortDescription: 'Nourishing argan oil for hair', fullDescription: 'Pure argan oil enriched with vitamin E for deep nourishment, frizz control and natural shine.', status: 'active', discount: 10, weight: '100ml', deliveryTime: '3-5 days', createdAt: '2026-01-20', tags: ['Hair Oil','Argan'] },
  { ...d, id: 'prod-10', title: 'Luxury Eau de Parfum', slug: 'luxury-parfum', categoryId: 'cat-s15', brandId: 'br-6', shortDescription: 'Premium long-lasting fragrance', fullDescription: 'An exquisite blend of floral and woody notes. Long-lasting fragrance that evolves beautifully throughout the day.', status: 'active', discount: 0, weight: '50ml', deliveryTime: '3-5 days', createdAt: '2026-02-01', tags: ['Perfume','Luxury'] },
  { ...d, id: 'prod-11', title: 'Warm Eyeshadow Palette', slug: 'warm-eyeshadow-palette', categoryId: 'cat-s12', brandId: 'br-8', shortDescription: '12-shade warm tone palette', fullDescription: 'A curated palette of 12 warm-toned eyeshadows with matte, shimmer and metallic finishes.', status: 'active', discount: 25, weight: '18g', deliveryTime: '2-3 days', createdAt: '2026-02-05', tags: ['Eyeshadow','Palette'], pieces: '12 shades' },
  { ...d, id: 'prod-12', title: 'Soft Petal Blush', slug: 'soft-petal-blush', categoryId: 'cat-s9', brandId: 'br-1', shortDescription: 'Silky smooth powder blush', fullDescription: 'A silky powder blush with buildable color for a natural flush. Available in petal-soft shades.', status: 'active', discount: 10, weight: '6g', deliveryTime: '2-3 days', createdAt: '2026-02-10', tags: ['Blush','Buildable'] },
  { ...d, id: 'prod-13', title: 'Precision Eyeliner', slug: 'precision-eyeliner', categoryId: 'cat-s11', brandId: 'br-2', shortDescription: 'Ultra-fine tip liquid eyeliner', fullDescription: 'A precision liquid eyeliner with an ultra-fine felt tip for effortless lines. Waterproof and smudge-proof.', status: 'active', discount: 0, weight: '1ml', deliveryTime: '2-3 days', createdAt: '2026-02-15', tags: ['Eyeliner','Waterproof'] },
  { ...d, id: 'prod-14', title: 'Botanical Shampoo', slug: 'botanical-shampoo', categoryId: 'cat-s13', brandId: 'br-7', shortDescription: 'Herbal shampoo for all hair types', fullDescription: 'A gentle herbal shampoo enriched with neem and tulsi for clean, healthy and shiny hair.', status: 'active', discount: 15, weight: '300ml', deliveryTime: '2-3 days', createdAt: '2026-02-20', tags: ['Shampoo','Herbal'], ingredients: 'Neem, Tulsi, Aloe Vera' },
  { ...d, id: 'prod-15', title: 'Tinted Lip Balm', slug: 'tinted-lip-balm', categoryId: 'cat-s18', brandId: 'br-4', shortDescription: 'Moisturizing tinted lip balm', fullDescription: 'A nourishing lip balm with a hint of color. Enriched with shea butter and vitamin E for soft, supple lips.', status: 'active', discount: 0, weight: '4.5g', deliveryTime: '2-3 days', createdAt: '2026-03-01', tags: ['Lip Balm','Tinted'], ingredients: 'Shea Butter, Vitamin E, Coconut Oil' },
  { ...d, id: 'prod-16', title: 'Nail Polish Collection', slug: 'nail-polish-collection', categoryId: 'cat-s17', brandId: 'br-4', shortDescription: 'Long-wear nail lacquer', fullDescription: 'Chip-resistant nail polish with glossy finish. Available in a range of classic and trendy colors.', status: 'active', discount: 10, weight: '12ml', deliveryTime: '2-3 days', createdAt: '2026-03-05', tags: ['Nail Polish','Glossy'] },
  { ...d, id: 'prod-17', title: 'Hydra Body Lotion', slug: 'hydra-body-lotion', categoryId: 'cat-s16', brandId: 'br-7', shortDescription: 'Deep moisture body lotion', fullDescription: 'A lightweight body lotion for 48-hour hydration. Enriched with cocoa butter and almond milk.', status: 'active', discount: 5, weight: '250ml', deliveryTime: '2-3 days', createdAt: '2026-03-10', tags: ['Body Lotion','Hydrating'], ingredients: 'Cocoa Butter, Almond Milk, Glycerin' },
  { ...d, id: 'prod-18', title: 'Pro Brush Set', slug: 'pro-brush-set', categoryId: 'cat-7', brandId: 'br-5', shortDescription: '12-piece professional makeup brush set', fullDescription: 'A complete set of 12 professional-grade brushes with synthetic bristles for flawless makeup application.', status: 'active', discount: 20, weight: '350g', deliveryTime: '3-5 days', createdAt: '2026-03-15', tags: ['Brushes','Professional'], pieces: '12 brushes' },
  { ...d, id: 'prod-19', title: 'Lip Gloss Set', slug: 'lip-gloss-set', categoryId: 'cat-s6', brandId: 'br-8', shortDescription: 'High-shine lip gloss trio', fullDescription: 'A set of 3 high-shine, non-sticky lip glosses in versatile shades for every occasion.', status: 'draft', discount: 0, weight: '15ml', deliveryTime: '2-3 days', createdAt: '2026-03-20', tags: ['Lip Gloss','Set'], pieces: '3 glosses' },
  { ...d, id: 'prod-20', title: 'Hyaluronic Sheet Mask', slug: 'hyaluronic-sheet-mask', categoryId: 'cat-s5', brandId: 'br-4', shortDescription: 'Intensely hydrating sheet mask', fullDescription: 'A bio-cellulose sheet mask infused with hyaluronic acid for deep hydration and a plump, dewy complexion.', status: 'active', discount: 0, weight: '25g', deliveryTime: '2-3 days', createdAt: '2026-03-25', tags: ['Sheet Mask','Hydrating'], pieces: '1 mask' },
];

const variants: ProductVariant[] = [
  // Lipstick variants
  { id: 'var-1', productId: 'prod-1', sku: 'LKM-RED-MATTE', name: 'Ruby Red', price: 499, mrp: 599, discountPrice: 424, barcode: '8901234567001', status: 'active', isDefault: true },
  { id: 'var-2', productId: 'prod-1', sku: 'LKM-PINK-MATTE', name: 'Nude Pink', price: 499, mrp: 599, discountPrice: 424, barcode: '8901234567002', status: 'active', isDefault: false },
  { id: 'var-3', productId: 'prod-1', sku: 'LKM-BERRY-MATTE', name: 'Berry Wine', price: 549, mrp: 649, discountPrice: 467, barcode: '8901234567003', status: 'active', isDefault: false },
  // Vitamin C Serum
  { id: 'var-4', productId: 'prod-2', sku: 'VCS-30ML', name: '30ml', price: 799, mrp: 899, discountPrice: 719, barcode: '8901234567004', status: 'active', isDefault: true },
  { id: 'var-5', productId: 'prod-2', sku: 'VCS-50ML', name: '50ml', price: 1299, mrp: 1499, discountPrice: 1169, barcode: '8901234567005', status: 'active', isDefault: false },
  // Foundation
  { id: 'var-6', productId: 'prod-3', sku: 'SFF-FAIR', name: 'Fair', price: 875, mrp: 1099, discountPrice: 700, barcode: '8901234567006', status: 'active', isDefault: true },
  { id: 'var-7', productId: 'prod-3', sku: 'SFF-MEDIUM', name: 'Medium', price: 875, mrp: 1099, discountPrice: 700, barcode: '8901234567007', status: 'active', isDefault: false },
  { id: 'var-8', productId: 'prod-3', sku: 'SFF-DEEP', name: 'Deep', price: 875, mrp: 1099, discountPrice: 700, barcode: '8901234567008', status: 'active', isDefault: false },
  // Highlighter
  { id: 'var-9', productId: 'prod-4', sku: 'HL-ROSEGOLD', name: 'Rose Gold', price: 600, mrp: 600, discountPrice: null, barcode: '8901234567009', status: 'active', isDefault: true },
  { id: 'var-10', productId: 'prod-4', sku: 'HL-CHAMPAGNE', name: 'Champagne', price: 600, mrp: 600, discountPrice: null, barcode: '8901234567010', status: 'active', isDefault: false },
  // Mascara
  { id: 'var-11', productId: 'prod-5', sku: 'VM-BLACK', name: 'Jet Black', price: 499, mrp: 525, discountPrice: 474, barcode: '8901234567011', status: 'active', isDefault: true },
  // Hydrating Face Cream
  { id: 'var-12', productId: 'prod-6', sku: 'HFC-50G', name: '50g', price: 449, mrp: 510, discountPrice: 395, barcode: '8901234567012', status: 'active', isDefault: true },
  { id: 'var-13', productId: 'prod-6', sku: 'HFC-100G', name: '100g', price: 799, mrp: 910, discountPrice: 703, barcode: '8901234567013', status: 'active', isDefault: false },
  // Cleanser
  { id: 'var-14', productId: 'prod-7', sku: 'GFC-150ML', name: '150ml', price: 225, mrp: 225, discountPrice: null, barcode: '8901234567014', status: 'active', isDefault: true },
  { id: 'var-15', productId: 'prod-7', sku: 'GFC-250ML', name: '250ml', price: 349, mrp: 349, discountPrice: null, barcode: '8901234567015', status: 'active', isDefault: false },
  // Sunscreen
  { id: 'var-16', productId: 'prod-8', sku: 'SS-50ML', name: '50ml', price: 299, mrp: 325, discountPrice: 275, barcode: '8901234567016', status: 'active', isDefault: true },
  { id: 'var-17', productId: 'prod-8', sku: 'SS-100ML', name: '100ml', price: 499, mrp: 545, discountPrice: 459, barcode: '8901234567017', status: 'active', isDefault: false },
  // Argan Oil
  { id: 'var-18', productId: 'prod-9', sku: 'AHO-100ML', name: '100ml', price: 675, mrp: 750, discountPrice: 608, barcode: '8901234567018', status: 'active', isDefault: true },
  { id: 'var-19', productId: 'prod-9', sku: 'AHO-200ML', name: '200ml', price: 1100, mrp: 1250, discountPrice: 990, barcode: '8901234567019', status: 'active', isDefault: false },
  // Parfum
  { id: 'var-20', productId: 'prod-10', sku: 'LEP-50ML', name: '50ml', price: 1250, mrp: 1250, discountPrice: null, barcode: '8901234567020', status: 'active', isDefault: true },
  { id: 'var-21', productId: 'prod-10', sku: 'LEP-100ML', name: '100ml', price: 1800, mrp: 1800, discountPrice: null, barcode: '8901234567021', status: 'active', isDefault: false },
  // Eyeshadow
  { id: 'var-22', productId: 'prod-11', sku: 'WEP-1', name: 'Warm Neutrals', price: 850, mrp: 1150, discountPrice: 638, barcode: '8901234567022', status: 'active', isDefault: true },
  // Blush
  { id: 'var-23', productId: 'prod-12', sku: 'SPB-PEACH', name: 'Peach Petal', price: 390, mrp: 435, discountPrice: 351, barcode: '8901234567023', status: 'active', isDefault: true },
  { id: 'var-24', productId: 'prod-12', sku: 'SPB-ROSE', name: 'Rose Petal', price: 390, mrp: 435, discountPrice: 351, barcode: '8901234567024', status: 'active', isDefault: false },
  // Eyeliner
  { id: 'var-25', productId: 'prod-13', sku: 'PLE-BLACK', name: 'Jet Black', price: 350, mrp: 350, discountPrice: null, barcode: '8901234567025', status: 'active', isDefault: true },
  { id: 'var-26', productId: 'prod-13', sku: 'PLE-BROWN', name: 'Brown', price: 350, mrp: 350, discountPrice: null, barcode: '8901234567026', status: 'active', isDefault: false },
  // Shampoo
  { id: 'var-27', productId: 'prod-14', sku: 'BRS-300ML', name: '300ml', price: 285, mrp: 335, discountPrice: 242, barcode: '8901234567027', status: 'active', isDefault: true },
  // Lip Balm
  { id: 'var-28', productId: 'prod-15', sku: 'TLB-BERRY', name: 'Berry', price: 249, mrp: 249, discountPrice: null, barcode: '8901234567028', status: 'active', isDefault: true },
  { id: 'var-29', productId: 'prod-15', sku: 'TLB-ROSE', name: 'Rose', price: 249, mrp: 249, discountPrice: null, barcode: '8901234567029', status: 'active', isDefault: false },
  // Nail Polish
  { id: 'var-30', productId: 'prod-16', sku: 'NPC-CLASSIC', name: 'Classic Red', price: 199, mrp: 225, discountPrice: 179, barcode: '8901234567030', status: 'active', isDefault: true },
  { id: 'var-31', productId: 'prod-16', sku: 'NPC-NUDE', name: 'Nude Blush', price: 199, mrp: 225, discountPrice: 179, barcode: '8901234567031', status: 'active', isDefault: false },
  // Body Lotion
  { id: 'var-32', productId: 'prod-17', sku: 'HBL-250ML', name: '250ml', price: 325, mrp: 345, discountPrice: 309, barcode: '8901234567032', status: 'active', isDefault: true },
  { id: 'var-33', productId: 'prod-17', sku: 'HBL-500ML', name: '500ml', price: 550, mrp: 580, discountPrice: 523, barcode: '8901234567033', status: 'active', isDefault: false },
  // Brush Set
  { id: 'var-34', productId: 'prod-18', sku: 'PBS-12', name: '12-Piece Set', price: 1200, mrp: 1500, discountPrice: 960, barcode: '8901234567034', status: 'active', isDefault: true },
  // Lip Gloss Set
  { id: 'var-35', productId: 'prod-19', sku: 'LGS-NUDE', name: 'Nude Collection', price: 599, mrp: 599, discountPrice: null, barcode: '8901234567035', status: 'active', isDefault: true },
  { id: 'var-36', productId: 'prod-19', sku: 'LGS-BERRY', name: 'Berry Collection', price: 599, mrp: 599, discountPrice: null, barcode: '8901234567036', status: 'active', isDefault: false },
  // Sheet Mask
  { id: 'var-37', productId: 'prod-20', sku: 'HASM-1', name: 'Single', price: 149, mrp: 149, discountPrice: null, barcode: '8901234567037', status: 'active', isDefault: true },
  { id: 'var-38', productId: 'prod-20', sku: 'HASM-5', name: 'Pack of 5', price: 649, mrp: 745, discountPrice: null, barcode: '8901234567038', status: 'active', isDefault: false },
];

const variantAttributes: VariantAttributeValue[] = [
  // Lipstick - Color & Finish
  { id: 'va-1', variantId: 'var-1', attributeId: 'attr-1', value: 'Red' },
  { id: 'va-2', variantId: 'var-1', attributeId: 'attr-3', value: 'Matte' },
  { id: 'va-3', variantId: 'var-2', attributeId: 'attr-1', value: 'Pink' },
  { id: 'va-4', variantId: 'var-2', attributeId: 'attr-3', value: 'Matte' },
  { id: 'va-5', variantId: 'var-3', attributeId: 'attr-1', value: 'Berry' },
  { id: 'va-6', variantId: 'var-3', attributeId: 'attr-3', value: 'Matte' },
  // Foundation - Color & Coverage
  { id: 'va-7', variantId: 'var-6', attributeId: 'attr-1', value: 'Nude' },
  { id: 'va-8', variantId: 'var-6', attributeId: 'attr-4', value: 'Medium' },
  { id: 'va-9', variantId: 'var-7', attributeId: 'attr-1', value: 'Brown' },
  { id: 'va-10', variantId: 'var-7', attributeId: 'attr-4', value: 'Medium' },
  { id: 'va-11', variantId: 'var-8', attributeId: 'attr-1', value: 'Deep' },
  { id: 'va-12', variantId: 'var-8', attributeId: 'attr-4', value: 'Full' },
  // Highlighter - Color & Finish
  { id: 'va-13', variantId: 'var-9', attributeId: 'attr-1', value: 'Rose Gold' },
  { id: 'va-14', variantId: 'var-9', attributeId: 'attr-3', value: 'Shimmer' },
  { id: 'va-15', variantId: 'var-10', attributeId: 'attr-1', value: 'Champagne' },
  { id: 'va-16', variantId: 'var-10', attributeId: 'attr-3', value: 'Shimmer' },
  // Sunscreen - SPF
  { id: 'va-17', variantId: 'var-16', attributeId: 'attr-6', value: 'SPF 50' },
  { id: 'va-18', variantId: 'var-17', attributeId: 'attr-6', value: 'SPF 50' },
  // Blush - Color
  { id: 'va-19', variantId: 'var-23', attributeId: 'attr-1', value: 'Peach' },
  { id: 'va-20', variantId: 'var-24', attributeId: 'attr-1', value: 'Rose Gold' },
  // Eyeliner
  { id: 'va-21', variantId: 'var-25', attributeId: 'attr-1', value: 'Jet Black' },
  { id: 'va-22', variantId: 'var-26', attributeId: 'attr-1', value: 'Brown' },
];

const productImages: ProductImage[] = [
  { id: 'img-1', productId: 'prod-1', variantId: null, imageUrl: '/placeholder.svg', isThumbnail: true, position: 0 },
  { id: 'img-2', productId: 'prod-1', variantId: 'var-1', imageUrl: '/placeholder.svg', isThumbnail: false, position: 1 },
  { id: 'img-3', productId: 'prod-2', variantId: null, imageUrl: '/placeholder.svg', isThumbnail: true, position: 0 },
  { id: 'img-4', productId: 'prod-3', variantId: null, imageUrl: '/placeholder.svg', isThumbnail: true, position: 0 },
  { id: 'img-5', productId: 'prod-4', variantId: null, imageUrl: '/placeholder.svg', isThumbnail: true, position: 0 },
  { id: 'img-6', productId: 'prod-5', variantId: null, imageUrl: '/placeholder.svg', isThumbnail: true, position: 0 },
  { id: 'img-7', productId: 'prod-6', variantId: null, imageUrl: '/placeholder.svg', isThumbnail: true, position: 0 },
  { id: 'img-8', productId: 'prod-7', variantId: null, imageUrl: '/placeholder.svg', isThumbnail: true, position: 0 },
  { id: 'img-9', productId: 'prod-8', variantId: null, imageUrl: '/placeholder.svg', isThumbnail: true, position: 0 },
  { id: 'img-10', productId: 'prod-9', variantId: null, imageUrl: '/placeholder.svg', isThumbnail: true, position: 0 },
  { id: 'img-11', productId: 'prod-10', variantId: null, imageUrl: '/placeholder.svg', isThumbnail: true, position: 0 },
  { id: 'img-12', productId: 'prod-11', variantId: null, imageUrl: '/placeholder.svg', isThumbnail: true, position: 0 },
  { id: 'img-13', productId: 'prod-12', variantId: null, imageUrl: '/placeholder.svg', isThumbnail: true, position: 0 },
  { id: 'img-14', productId: 'prod-13', variantId: null, imageUrl: '/placeholder.svg', isThumbnail: true, position: 0 },
  { id: 'img-15', productId: 'prod-14', variantId: null, imageUrl: '/placeholder.svg', isThumbnail: true, position: 0 },
  { id: 'img-16', productId: 'prod-15', variantId: null, imageUrl: '/placeholder.svg', isThumbnail: true, position: 0 },
  { id: 'img-17', productId: 'prod-16', variantId: null, imageUrl: '/placeholder.svg', isThumbnail: true, position: 0 },
  { id: 'img-18', productId: 'prod-17', variantId: null, imageUrl: '/placeholder.svg', isThumbnail: true, position: 0 },
  { id: 'img-19', productId: 'prod-18', variantId: null, imageUrl: '/placeholder.svg', isThumbnail: true, position: 0 },
  { id: 'img-20', productId: 'prod-19', variantId: null, imageUrl: '/placeholder.svg', isThumbnail: true, position: 0 },
];

const warehouses: Warehouse[] = [
  { id: 'wh-1', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
  { id: 'wh-2', name: 'Delhi NCR Hub', city: 'New Delhi', state: 'Delhi', pincode: '110001' },
  { id: 'wh-3', name: 'Bangalore South', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
];

const inventory: InventoryItem[] = variants.map((v, i) => ({
  id: `inv-${i + 1}`,
  variantId: v.id,
  warehouseId: warehouses[i % 3].id,
  availableStock: [150, 80, 45, 200, 120, 5, 0, 300, 60, 25, 90, 175, 8, 50, 110, 3, 95, 140, 65, 200, 35, 180, 70, 15, 220, 100, 55, 130, 85, 40, 160, 190, 75, 210, 12, 145, 30, 250][i] ?? 100,
  reservedStock: [10, 5, 3, 15, 8, 2, 0, 20, 4, 2, 6, 12, 1, 3, 7, 1, 5, 9, 4, 14, 2, 11, 5, 1, 16, 6, 3, 8, 5, 2, 10, 13, 4, 15, 1, 9, 2, 18][i] ?? 5,
  damagedStock: [0, 1, 0, 2, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 2, 0, 0, 0, 1][i] ?? 0,
}));

const banners: Banner[] = [
  { id: 'ban-1', title: 'Summer Sale - Up to 50% Off', imageUrl: '/placeholder.svg', link: '/category/skincare', position: 1, status: 'active' },
  { id: 'ban-2', title: 'New Arrivals - Lakmé Collection', imageUrl: '/placeholder.svg', link: '/category/makeup', position: 2, status: 'active' },
  { id: 'ban-3', title: 'Buy 2 Get 1 Free on Lip Care', imageUrl: '/placeholder.svg', link: '/category/lip-care', position: 3, status: 'active' },
  { id: 'ban-4', title: 'Monsoon Skincare Essentials', imageUrl: '/placeholder.svg', link: '/category/skincare', position: 4, status: 'inactive' },
];

const customerNames = ['Priya Sharma', 'Rahul Verma', 'Anita Patel', 'Vikram Singh', 'Meera Joshi', 'Arjun Reddy', 'Sneha Gupta', 'Karan Malhotra', 'Divya Nair', 'Ravi Kumar', 'Pooja Mehta', 'Amit Desai', 'Nisha Agarwal', 'Sanjay Kapoor', 'Rekha Iyer'];
const statuses = ['ORDER_PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED'];
const paymentMethods = ['UPI', 'Card', 'COD', 'NetBanking'];

function randomItem<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const orders: DummyOrder[] = Array.from({ length: 30 }, (_, i) => {
  const v = variants[i % variants.length];
  const p = products.find(pr => pr.id === v.productId)!;
  const qty = randomInt(1, 3);
  const daysAgo = randomInt(0, 30);
  const name = customerNames[i % customerNames.length];
  const status = statuses[i % statuses.length];
  return {
    id: `ord-${i + 1}`, orderNumber: `SB${10001 + i}`,
    customerName: name, customerEmail: `${name.toLowerCase().replace(/\s/g, '.')}@email.com`,
    phone: `+91 ${randomInt(7000000000, 9999999999)}`,
    address: `${randomInt(1, 99)} ${['Rose Apt', 'Green Park', 'Lake View', 'Royal Garden', 'Lotus Colony'][i % 5]}`,
    city: ['Mumbai', 'Delhi', 'Bangalore', 'Jaipur', 'Pune'][i % 5], pincode: `${randomInt(100000, 999999)}`,
    items: [{ productName: p.title, variantSku: v.sku, qty, price: v.price }],
    totalAmount: v.price * qty + (v.price * qty > 500 ? 0 : 40),
    status, paymentStatus: status === 'CANCELLED' ? 'REFUNDED' : 'PAID',
    paymentMethod: randomItem(paymentMethods),
    createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
  };
});

const customers: DummyCustomer[] = customerNames.map((name, i) => ({
  id: `cust-${i + 1}`, name, email: `${name.toLowerCase().replace(/\s/g, '.')}@email.com`,
  phone: `+91 ${randomInt(7000000000, 9999999999)}`,
  totalOrders: randomInt(1, 20), totalSpent: randomInt(500, 25000),
  joinDate: new Date(Date.now() - randomInt(30, 365) * 86400000).toISOString(),
  status: i === 9 ? 'blocked' : 'active',
}));

const shipments: DummyShipment[] = orders
  .filter(o => ['SHIPPED', 'DELIVERED', 'RETURN_REQUESTED'].includes(o.status))
  .map((o, i) => ({
    id: `ship-${i + 1}`, orderNumber: o.orderNumber,
    trackingNumber: `TRK${randomInt(100000, 999999)}`,
    courier: ['Delhivery', 'BlueDart', 'Ekart', 'DTDC'][i % 4],
    status: o.status === 'DELIVERED' ? 'DELIVERED' : o.status === 'RETURN_REQUESTED' ? 'RETURN_PICKUP' : 'IN_TRANSIT',
    shippedAt: new Date(new Date(o.createdAt).getTime() + 86400000).toISOString(),
    estimatedDelivery: new Date(new Date(o.createdAt).getTime() + 5 * 86400000).toISOString(),
  }));

const returns: DummyReturn[] = orders
  .filter(o => o.status === 'RETURN_REQUESTED')
  .map((o, i) => ({
    id: `ret-${i + 1}`, orderNumber: o.orderNumber,
    productName: o.items[0].productName,
    reason: ['Damaged product', 'Wrong item received', 'Quality not as expected', 'Changed mind'][i % 4],
    status: ['REQUESTED', 'APPROVED', 'PICKED', 'REFUNDED'][i % 4],
    requestDate: new Date(new Date(o.createdAt).getTime() + 2 * 86400000).toISOString(),
    refundAmount: o.totalAmount,
  }));

const discounts: Discount[] = [
  { id: 'disc-1', name: 'Lipstick Mega Sale', applyTo: 'category', targetId: 'cat-s6', variantId: null, discountType: 'percentage', value: 20, minOrderValue: 500, maxDiscount: 200, usageLimit: 1000, startDate: '2026-05-01', endDate: '2026-05-10', status: 'active' },
  { id: 'disc-2', name: 'Lakmé Brand Offer', applyTo: 'brand', targetId: 'br-1', variantId: null, discountType: 'percentage', value: 15, minOrderValue: null, maxDiscount: null, usageLimit: null, startDate: '2026-04-01', endDate: '2026-04-30', status: 'active' },
  { id: 'disc-3', name: 'Serum Flat ₹100 Off', applyTo: 'product', targetId: 'prod-2', variantId: null, discountType: 'flat', value: 100, minOrderValue: 799, maxDiscount: null, usageLimit: 500, startDate: '2026-04-10', endDate: '2026-04-20', status: 'inactive' },
];

// ─── STORE (mutable in-memory) ───

export const store = {
  categories: [...categories],
  brands: [...brands],
  attributes: [...attributes],
  products: [...products],
  variants: [...variants],
  variantAttributes: [...variantAttributes],
  productImages: [...productImages],
  inventory: [...inventory],
  warehouses: [...warehouses],
  banners: [...banners],
  orders: [...orders],
  customers: [...customers],
  shipments: [...shipments],
  returns: [...returns],
  discounts: [...discounts],
};

// ─── CRUD HELPERS ───

export function addItem<T extends { id: string }>(list: T[], item: Omit<T, 'id'>): T {
  const newItem = { ...item, id: genId() } as T;
  list.push(newItem);
  return newItem;
}

export function updateItem<T extends { id: string }>(list: T[], id: string, updates: Partial<T>): T | null {
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates };
  return list[idx];
}

export function deleteItem<T extends { id: string }>(list: T[], id: string): boolean {
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return false;
  list.splice(idx, 1);
  return true;
}

// ─── LOOKUP HELPERS ───

export function getCategoryName(id: string): string {
  return store.categories.find(c => c.id === id)?.name || '—';
}

export function getBrandName(id: string): string {
  return store.brands.find(b => b.id === id)?.name || '—';
}

export function getProductVariants(productId: string): ProductVariant[] {
  return store.variants.filter(v => v.productId === productId);
}

export function getVariantAttributes(variantId: string): (VariantAttributeValue & { attributeName: string })[] {
  return store.variantAttributes
    .filter(va => va.variantId === variantId)
    .map(va => ({ ...va, attributeName: store.attributes.find(a => a.id === va.attributeId)?.name || '—' }));
}

export function getProductImages(productId: string): ProductImage[] {
  return store.productImages.filter(img => img.productId === productId);
}

export function getVariantInventory(variantId: string): (InventoryItem & { warehouseName: string })[] {
  return store.inventory
    .filter(inv => inv.variantId === variantId)
    .map(inv => ({ ...inv, warehouseName: store.warehouses.find(w => w.id === inv.warehouseId)?.name || '—' }));
}
