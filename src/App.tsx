
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ServiceProvider } from "@/providers/ServiceProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { Suspense, lazy } from "react";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

// Lazy load admin components
const Admin = lazy(() => import("./pages/Admin"));
const AdminReviews = lazy(() => import("./pages/AdminReviews"));
const AdminPartners = lazy(() => import("./pages/AdminPartners"));
const AdminContent = lazy(() => import("./pages/AdminContent"));
const AdminContacts = lazy(() => import("./pages/AdminContacts"));
const AdminAdvanced = lazy(() => import("./pages/AdminAdvanced"));

const queryClient = new QueryClient();

const AdminSuspense = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  }>
    {children}
  </Suspense>
);

const AppContent = () => {
  return (
    <div className="min-h-screen">
      <Toaster />
      <Sonner />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout><Index /></Layout>} />
        <Route path="/services" element={<Layout><Services /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<AdminSuspense><Admin /></AdminSuspense>} />
        <Route path="/admin/reviews" element={<AdminSuspense><AdminReviews /></AdminSuspense>} />
        <Route path="/admin/partners" element={<AdminSuspense><AdminPartners /></AdminSuspense>} />
        <Route path="/admin/content" element={<AdminSuspense><AdminContent /></AdminSuspense>} />
        <Route path="/admin/contacts" element={<AdminSuspense><AdminContacts /></AdminSuspense>} />
        <Route path="/admin/advanced" element={<AdminSuspense><AdminAdvanced /></AdminSuspense>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ServiceProvider>
        <AuthProvider>
          <TooltipProvider>
            <AppContent />
          </TooltipProvider>
        </AuthProvider>
      </ServiceProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
