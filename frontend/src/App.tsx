import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Placeholder for other pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <h2 className="text-2xl font-semibold text-gray-400">{title} Page Content</h2>
  </div>
);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="compute" element={<PlaceholderPage title="Compute" />} />
            <Route path="cloud-run" element={<PlaceholderPage title="Cloud Run" />} />
            <Route path="gke" element={<PlaceholderPage title="GKE" />} />
            <Route path="cloud-sql" element={<PlaceholderPage title="Cloud SQL" />} />
            <Route path="logs" element={<PlaceholderPage title="Logs" />} />
            <Route path="billing" element={<PlaceholderPage title="Billing" />} />
            <Route path="cicd" element={<PlaceholderPage title="CI/CD" />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
