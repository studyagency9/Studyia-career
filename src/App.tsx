import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { I18nProvider, useTranslation } from "@/i18n/i18nContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SkipToContent } from "@/components/SkipToContent";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AssociateAuthProvider, useAssociateAuth } from "@/contexts/AssociateAuthContext";
import { useReferralTracking } from "@/hooks/useReferralTracking";

// Lazy loading des pages pour améliorer les performances
const Index = lazy(() => import("./pages/Index"));
const BuilderPage = lazy(() => import("./pages/BuilderPage"));
const UploadPage = lazy(() => import("./pages/UploadPage"));
const PartnerInfoPage = lazy(() => import("./pages/PartnerInfoPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Partner pages
const LoginPage = lazy(() => import("./pages/partner/LoginPage"));
const SignupPage = lazy(() => import("./pages/partner/SignupPage"));
const RequestSentPage = lazy(() => import("./pages/partner/RequestSentPage"));
const DashboardPage = lazy(() => import("./pages/partner/DashboardPage"));
const CVsPage = lazy(() => import("./pages/partner/CVsPage"));
const CreateCVPage = lazy(() => import("./pages/partner/CreateCVPage"));
const UploadCVPage = lazy(() => import("./pages/partner/UploadCVPage"));
const PartnerBuilderPage = lazy(() => import("./pages/partner/PartnerBuilderPage"));
const PricingPage = lazy(() => import("./pages/partner/PricingPage"));

// Associate pages (Associés)
const AssociateSignupPage = lazy(() => import("./pages/associate/SignupPage"));
const AssociateLoginPage = lazy(() => import("./pages/associate/LoginPage"));
const AssociateDashboardPage = lazy(() => import("./pages/associate/DashboardPage"));
const AssociateSalesPage = lazy(() => import("./pages/associate/SalesPage"));
const AssociateWithdrawPage = lazy(() => import("./pages/associate/WithdrawPage"));
// Import direct du ProfilePage
const AssociateProfilePage = lazy(() => import("./pages/associate/ProfilePage"));

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

// Protected Route Component for Partners
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/partner/login" replace />;
};

// Protected Route Component for Associates
const ProtectedAssociateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAssociateAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/associate/login" replace />;
};

// Composant de tracking de parrainage
const ReferralTracker = () => {
  useReferralTracking();
  return null;
};

// Composant interne avec accès au contexte i18n
const AppRoutes = () => (
  <QueryClientProvider client={new QueryClient()}>
    <TooltipProvider>
      <SkipToContent />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ReferralTracker />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/builder" element={<BuilderPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/partner-info" element={<PartnerInfoPage />} />
            
            {/* Partner authentication routes */}
            <Route path="/partner/login" element={<LoginPage />} />
            <Route path="/partner/signup" element={<SignupPage />} />
            <Route path="/partner/request-sent" element={<RequestSentPage />} />
            
            {/* Protected partner routes */}
            <Route path="/partner/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/partner/cvs" element={<ProtectedRoute><CVsPage /></ProtectedRoute>} />
            <Route path="/partner/create" element={<ProtectedRoute><CreateCVPage /></ProtectedRoute>} />
            <Route path="/partner/upload" element={<ProtectedRoute><UploadCVPage /></ProtectedRoute>} />
            <Route path="/partner/builder/:id" element={<ProtectedRoute><PartnerBuilderPage /></ProtectedRoute>} />
            <Route path="/partner/pricing" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
            
            {/* Associate authentication routes */}
            <Route path="/associate/signup" element={<AssociateSignupPage />} />
            <Route path="/associate/login" element={<AssociateLoginPage />} />
            
            {/* Protected associate routes */}
            <Route path="/associate/dashboard" element={<ProtectedAssociateRoute><AssociateDashboardPage /></ProtectedAssociateRoute>} />
            <Route path="/associate/sales" element={<ProtectedAssociateRoute><AssociateSalesPage /></ProtectedAssociateRoute>} />
            <Route path="/associate/withdraw" element={<ProtectedAssociateRoute><AssociateWithdrawPage /></ProtectedAssociateRoute>} />
            <Route path="/associate/profile" element={<ProtectedAssociateRoute><AssociateProfilePage /></ProtectedAssociateRoute>} />
            
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
      <AuthProvider>
        <AssociateAuthProvider>
          <AppRoutes />
        </AssociateAuthProvider>
      </AuthProvider>
    </I18nProvider>
  </ErrorBoundary>
);

export default App;
