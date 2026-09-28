import React, { Suspense, lazy } from 'react';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useOrderStore } from './src/components/Store';
import '@radix-ui/themes/styles.css';
import 'react-toastify/dist/ReactToastify.css';

const Home = lazy(() => import('./src/pages/Home'));
const Ordering = lazy(() => import('./src/pages/Ordering'));
const Kitchen = lazy(() => import('./src/pages/Kitchen'));
const ChefLogin = lazy(() => import('./src/pages/ChefLogin'));
const NotFound = lazy(() => import('./src/pages/NotFound'));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useOrderStore(state => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/chef/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Theme appearance="light" accentColor="crimson" radius="large">
      <Router>
        <Suspense fallback={
          <div className="flex h-screen w-full items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        }>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/order" element={<Ordering />} />
            
            {/* Staff Routes */}
            <Route path="/chef/login" element={<ChefLogin />} />
            <Route 
              path="/chef" 
              element={
                <ProtectedRoute>
                  <Kitchen />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback */}
            <Route path="/kitchen" element={<Navigate to="/chef" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <ToastContainer position="bottom-right" theme="colored" />
      </Router>
    </Theme>
  );
}

export default App;