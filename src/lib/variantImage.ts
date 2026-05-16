// Generates a distinctive SVG swatch image (as data URI) for a product variant
// when no real photo exists for that shade/size. Used so the gallery updates
// with a visually different image for every variant (e.g. foundation shades).

const COLOR_HEX: Record<string, string> = {
  red: '#EF4444', ruby: '#E11D48', rose: '#F43F5E', pink: '#EC4899', fuchsia: '#D946EF',
  purple: '#A855F7', violet: '#8B5CF6', indigo: '#6366F1', blue: '#3B82F6', sky: '#0EA5E9',
  cyan: '#06B6D4', teal: '#14B8A6', emerald: '#10B981', green: '#22C55E', lime: '#84CC16',
  yellow: '#EAB308', amber: '#F59E0B', orange: '#F97316', brown: '#92400E', chocolate: '#7B3F00',
  beige: '#F5F5DC', ivory: '#F3E2C7', cream: '#FFFDD0', gold: '#FFD700', silver: '#C0C0C0',
  black: '#1F2937', white: '#F9FAFB', grey: '#6B7280', gray: '#6B7280', nude: '#E8C4A8',
  coral: '#FF7F50', peach: '#FFCBA4', maroon: '#800000', burgundy: '#800020', navy: '#1E3A5F',
  mauve: '#C8A2C8', lavender: '#B497D6', mint: '#9FE2BF', olive: '#808000', charcoal: '#36454F',
  'rose gold': '#B76E79', copper: '#B87333', bronze: '#CD7F32', taupe: '#483C32',
  porcelain: '#F5DCC4', vanilla: '#F3E2B7', sand: '#D9B382', honey: '#C68E5A',
  caramel: '#B07750', toffee: '#8E5B3B', almond: '#7C4A2B', mocha: '#5C3722',
  espresso: '#3E2412', ebony: '#2A1A12', tan: '#C99A6E', deep: '#5A3622', rich: '#3A2014',
  light: '#E6BFA0', medium: '#C68E5A', fair: '#F0D2B5', plum: '#673147', cherry: '#A60C2F',
  berry: '#8A1538', wine: '#722F37', terracotta: '#C56542', champagne: '#E6D2A8',
  moonstone: '#E8E4DA', smoke: '#7B7D7D', forest: '#1F3A1F', midnight: '#1A2A4A',
  brick: '#9C3A2F',
};

function pickColor(name: string): string {
  const lower = name.toLowerCase();
  // longest match wins
  let best: { key: string; hex: string } | null = null;
  for (const [key, hex] of Object.entries(COLOR_HEX)) {
    if (lower.includes(key) && (!best || key.length > best.key.length)) {
      best = { key, hex };
    }
  }
  if (best) return best.hex;
  // deterministic hash fallback
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  return `hsl(${hue} 55% 55%)`;
}

function lighten(hex: string, amt = 0.25): string {
  if (!hex.startsWith('#')) return hex;
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 255) + Math.round(255 * amt));
  const g = Math.min(255, ((n >> 8) & 255) + Math.round(255 * amt));
  const b = Math.min(255, (n & 255) + Math.round(255 * amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function darken(hex: string, amt = 0.25): string {
  if (!hex.startsWith('#')) return hex;
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 255) - Math.round(255 * amt));
  const g = Math.max(0, ((n >> 8) & 255) - Math.round(255 * amt));
  const b = Math.max(0, (n & 255) - Math.round(255 * amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function generateVariantSwatch(variantName: string, productName = ''): string {
  const base = pickColor(variantName);
  const light = lighten(base, 0.2);
  const dark = darken(base, 0.2);
  const safeName = variantName.replace(/[<>&"']/g, '');
  const safeProduct = productName.replace(/[<>&"']/g, '');
  const textColor = base.startsWith('#') && parseInt(base.slice(1), 16) > 0x999999 ? '#1a1a1a' : '#ffffff';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <defs>
      <radialGradient id="g" cx="35%" cy="30%" r="80%">
        <stop offset="0%" stop-color="${light}"/>
        <stop offset="60%" stop-color="${base}"/>
        <stop offset="100%" stop-color="${dark}"/>
      </radialGradient>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fafafa"/>
        <stop offset="100%" stop-color="#ececec"/>
      </linearGradient>
    </defs>
    <rect width="800" height="800" fill="url(#bg)"/>
    <circle cx="400" cy="380" r="260" fill="url(#g)"/>
    <ellipse cx="320" cy="280" rx="90" ry="50" fill="${light}" opacity="0.55"/>
    <text x="400" y="690" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="44" font-weight="700" fill="#222">${safeName}</text>
    ${safeProduct ? `<text x="400" y="740" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="24" fill="#666">${safeProduct}</text>` : ''}
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
