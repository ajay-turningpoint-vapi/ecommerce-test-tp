import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { lazy, Suspense } from "react";
import ScrollToTop from "@/components/ScrollToTop";
import { Skeleton } from "@/components/ui/skeleton";

const Index = lazy(() => import("./pages/Index"));
const Category = lazy(() => import("./pages/Category"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const OrderManagement = lazy(() => import("./pages/admin/OrderManagement"));
const ProductManagement = lazy(() => import("./pages/admin/ProductManagement"));
const CategoryManagement = lazy(() => import("./pages/admin/CategoryManagement"));
const BrandManagement = lazy(() => import("./pages/admin/BrandManagement"));
const AttributeManagement = lazy(() => import("./pages/admin/AttributeManagement"));
const StockManagement = lazy(() => import("./pages/admin/StockManagement"));
const CustomerManagement = lazy(() => import("./pages/admin/CustomerManagement"));
const ShippingManagement = lazy(() => import("./pages/admin/ShippingManagement"));
const ReturnsManagement = lazy(() => import("./pages/admin/ReturnsManagement"));
const BannerManagement = lazy(() => import("./pages/admin/BannerManagement"));
const Reports = lazy(() => import("./pages/admin/Reports"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="min-h-screen bg-background">
    <div className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 flex-1 max-w-lg rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </div>
    <div className="container mx-auto px-4 py-6 space-y-6">
      <Skeleton className="h-48 md:h-64 w-full rounded-xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card overflow-hidden">
            <Skeleton className="w-full aspect-square" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdminAuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageFallback />}>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/category/:slug" element={<Category />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order/:id" element={<OrderConfirmation />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Profile />} />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="orders" element={<OrderManagement />} />
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="categories" element={<CategoryManagement />} />
                    <Route path="brands" element={<BrandManagement />} />
                    <Route path="attributes" element={<AttributeManagement />} />
                    <Route path="stock" element={<StockManagement />} />
                    <Route path="customers" element={<CustomerManagement />} />
                    <Route path="shipping" element={<ShippingManagement />} />
                    <Route path="returns" element={<ReturnsManagement />} />
                    <Route path="banners" element={<BannerManagement />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AdminAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
