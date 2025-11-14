import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MainLayout } from "./components/layout/MainLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ROUTE_PERMISSIONS } from "./config/roles";
import { queryClient } from "./lib/queryClient";
import ScrollToTop from "./components/ScrollToTop";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import FlightAnalysis from "./pages/FlightAnalysis";
import FleetManagement from "./pages/FleetManagement";
import UploadData from "./pages/UploadData";
import Reports from "./pages/Reports";
import UserManagement from "./pages/UserManagement";
import SystemAdmin from "./pages/SystemAdmin";
import Security from "./pages/Security";
import Organizations from "./pages/Organizations";
import Notifications from "./pages/Notifications";
import ApiKeys from "./pages/ApiKeys";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Resources from "./pages/Resources";
import About from "./pages/About";
import Blog from "./pages/Blog";

const AppContent = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
            {/* Public Routes */}
            <Route index element={<Landing />} />
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.DASHBOARD}>
                  <MainLayout>
                    <Index />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analysis" 
              element={
                <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.FLIGHT_ANALYSIS}>
                  <MainLayout>
                    <FlightAnalysis />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/fleet" 
              element={
                <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.FLEET_MANAGEMENT}>
                  <MainLayout>
                    <FleetManagement />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/upload" 
              element={
                <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.UPLOAD_DATA}>
                  <MainLayout>
                    <UploadData />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.REPORTS}>
                  <MainLayout>
                    <Reports />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.USER_MANAGEMENT}>
                  <MainLayout>
                    <UserManagement />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.SYSTEM_ADMIN}>
                  <MainLayout>
                    <SystemAdmin />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/security" 
              element={
                <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.SECURITY}>
                  <MainLayout>
                    <Security />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/organizations" 
              element={
                <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.ORGANIZATIONS}>
                  <MainLayout>
                    <Organizations />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.NOTIFICATIONS}>
                  <MainLayout>
                    <Notifications />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/api-keys" 
              element={
                <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.API_KEYS}>
                  <MainLayout>
                    <ApiKeys />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.PROFILE}>
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />

            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
