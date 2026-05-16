// Prefetch lazy route chunks in the background after the app is idle,
// so navigating between pages feels instant (no Suspense fallback flash).

type Importer = () => Promise<unknown>;

const importers: Importer[] = [
  () => import('@/pages/Index'),
  () => import('@/pages/Category'),
  () => import('@/pages/Categories'),
  () => import('@/pages/ProductDetail'),
  () => import('@/pages/Cart'),
  () => import('@/pages/Checkout'),
  () => import('@/pages/Search'),
  () => import('@/pages/Profile'),
  () => import('@/pages/Login'),
];

let started = false;

export function prefetchRoutes() {
  if (started || typeof window === 'undefined') return;
  started = true;

  const run = () => {
    importers.forEach((imp, i) => {
      // Stagger so we don't saturate the network
      setTimeout(() => { imp().catch(() => {}); }, i * 120);
    });
  };

  const ric = (window as any).requestIdleCallback as
    | ((cb: () => void, opts?: { timeout: number }) => number)
    | undefined;

  if (ric) ric(run, { timeout: 2000 });
  else setTimeout(run, 1200);
}
