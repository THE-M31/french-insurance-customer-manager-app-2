
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import CustomerForm from '@/pages/CustomerForm';
import CustomerDetail from '@/pages/CustomerDetail';
import ClaimsPage from '@/pages/ClaimsPage';
import ClaimForm from '@/pages/ClaimForm';
import ClaimDetail from '@/pages/ClaimDetail';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/new"
            element={
              <ProtectedRoute>
                <CustomerForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/:id"
            element={
              <ProtectedRoute>
                <CustomerDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/claims"
            element={
              <ProtectedRoute>
                <ClaimsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/claims/new"
            element={
              <ProtectedRoute>
                <ClaimForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/claims/:id"
            element={
              <ProtectedRoute>
                <ClaimDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/claims/:id/edit"
            element={
              <ProtectedRoute>
                <ClaimForm />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;