
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Agreement from "./pages/Agreement";
import ProfileInfo from "./pages/ProfileInfo";
import DocumentUpload from "./pages/DocumentUpload";
import ApplicationStatus from "./pages/ApplicationStatus";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            
            {/* Auth routes - accessible only when not logged in */}
            <Route element={<ProtectedRoute requireAuth={false} />}>
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
            </Route>
            
            {/* Protected routes with specific step requirements */}
            <Route element={<ProtectedRoute requireAuth={true} requiredStep="agreement" />}>
              <Route path="/agreement" element={<Agreement />} />
            </Route>
            
            <Route element={<ProtectedRoute requireAuth={true} requiredStep="profile-info" />}>
              <Route path="/profile-info" element={<ProfileInfo />} />
            </Route>
            
            <Route element={<ProtectedRoute requireAuth={true} requiredStep="document-upload" />}>
              <Route path="/document-upload" element={<DocumentUpload />} />
            </Route>
            
            <Route element={<ProtectedRoute requireAuth={true} requiredStep="application-status" />}>
              <Route path="/application-status" element={<ApplicationStatus />} />
            </Route>
            
            {/* Protected routes - for completed onboarding */}
            <Route element={<ProtectedRoute requireAuth={true} requiredStep="completed" />}>
              <Route path="/user-dashboard" element={<UserDashboard />} />
            </Route>
            
            {/* Admin routes */}
            <Route element={<ProtectedRoute requireAuth={true} requireAdmin={true} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>
            
            {/* Not found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
