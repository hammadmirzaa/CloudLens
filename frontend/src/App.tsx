import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Compute from './pages/Compute';
import CloudRun from './pages/CloudRun';
import GKE from './pages/GKE';
import CloudSQL from './pages/CloudSQL';
import Logs from './pages/Logs';
import Billing from './pages/Billing';
import CICD from './pages/CICD';
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

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <QueryClientProvider client={queryClient}>
            <Router>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="compute" element={<Compute />} />
                  <Route path="cloud-run" element={<CloudRun />} />
                  <Route path="gke" element={<GKE />} />
                  <Route path="cloud-sql" element={<CloudSQL />} />
                  <Route path="logs" element={<Logs />} />
                  <Route path="billing" element={<Billing />} />
                  <Route path="cicd" element={<CICD />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Router>
          </QueryClientProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
