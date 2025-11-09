import { Routes, Route, Navigate } from 'react-router-dom';
import { SignUp } from './pages/SignUp';
import { SignIn } from './pages/SignIn';
import { ForgotPassword } from './pages/ForgotPassword';
import { VerifyEmail } from './pages/VerifyEmail';
import { ResetPassword } from './pages/ResetPassword';
import { DashboardPage } from './pages/Dashboard';
import { ProfilePage } from './pages/Profile';
import { SettingsPage } from './pages/Settings';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth/sign-up" element={<SignUp />} />
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/verify-email" element={<VerifyEmail />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth/sign-in" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
