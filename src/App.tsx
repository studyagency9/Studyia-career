import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { I18nProvider, useTranslation } from "@/i18n/i18nContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SkipToContent } from "@/components/SkipToContent";

// Lazy loading des pages pour améliorer les performances
const Index = lazy(() => import("./pages/Index"));
const BuilderPage = lazy(() => import("./pages/BuilderPage"));
const UploadPage = lazy(() => import("./pages/UploadPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Composant de chargement avec i18n
const PageLoader = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    </div>
  );
};

// Composant interne avec accès au contexte i18n
const AppRoutes = () => (
  <QueryClientProvider client={new QueryClient()}>
    <TooltipProvider>
      <SkipToContent />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/builder" element={<BuilderPage />} />
            <Route path="/upload" element={<UploadPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const App = () => (
  <ErrorBoundary>
    <I18nProvider>
      <AppRoutes />
    </I18nProvider>
  </ErrorBoundary>
);

export default App;
