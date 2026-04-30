import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';

import Layout from './components/Layout';
import AuthLayout from './components/AuthLayout';
import Dashboard from './pages/Dashboard';
import Compute from './pages/Compute';
import CloudRun from './pages/CloudRun';
import GKE from './pages/GKE';
import CloudSQL from './pages/CloudSQL';
import Logs from './pages/Logs';
import Billing from './pages/Billing';
import CICD from './pages/CICD';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <Router>
                <Routes>
                  {/* Public Auth Routes */}
                  <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                  </Route>

                  {/* Protected Dashboard Routes */}
                  <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="compute" element={<Compute />} />
                    <Route path="cloud-run" element={<CloudRun />} />
                    <Route path="gke" element={<GKE />} />
                    <Route path="cloud-sql" element={<CloudSQL />} />
                    <Route path="logs" element={<Logs />} />
                    <Route path="billing" element={<Billing />} />
                    <Route path="cicd" element={<CICD />} />
                  </Route>
                  
                  {/* Catch all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
            </AuthProvider>
          </QueryClientProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
