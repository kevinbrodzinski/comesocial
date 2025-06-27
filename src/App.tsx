import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DataSourceToggle from "./components/dev/DataSourceToggle";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import MessagesView from "./pages/MessagesView";
import CoPlanDraftPage from "./pages/CoPlanDraftPage";
import CoPlanInviteSetupPage from "./pages/CoPlanInviteSetupPage";
import NotFound from "./pages/NotFound";
import { getFeatureFlag } from "./utils/featureFlags";

// Import iOS font fix CSS when feature flag is enabled
if (getFeatureFlag('draft_ios_nav_fix_v1')) {
  import("./styles/_ios-font-fix.css");
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <MessagesView onBack={() => window.history.back()} />
              </ProtectedRoute>
            } />
            <Route path="/planner/invite-setup/:id" element={
              <ProtectedRoute>
                <CoPlanInviteSetupPage />
              </ProtectedRoute>
            } />
            <Route path="/planner/draft/:id" element={
              <ProtectedRoute>
                <CoPlanDraftPage />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Development Data Source Toggle */}
          {process.env.NODE_ENV === 'development' && <DataSourceToggle />}
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
