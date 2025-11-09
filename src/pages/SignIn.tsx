import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FormInput } from '@/components/forms/FormInput';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail } from '@/utils/validation';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

export function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setGeneralError(null);

    if (touched[name as keyof typeof touched]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name as keyof typeof formData]);
  };

  const validateField = (fieldName: string, value: string) => {
    let error = '';

    if (fieldName === 'email') {
      error = validateEmail(value) || '';
    } else if (fieldName === 'password') {
      if (!value) error = 'Password is required';
    }

    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const isFormValid = () => {
    return !validateEmail(formData.email) && formData.password.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!isFormValid()) {
      setTouched({ email: true, password: true });
      return;
    }

    setLoading(true);
    try {
      await signIn(formData.email, formData.password);
      if (rememberMe) {
        localStorage.setItem('rememberEmail', formData.email);
      }
      navigate('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign in';
      setGeneralError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">OmniBiz Nexus</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {generalError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <div>
                <p className="font-medium text-red-900">Sign in failed</p>
                <p className="text-sm text-red-800">{generalError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email ? errors.email : ''}
              success={touched.email && !errors.email && formData.email.length > 0}
              placeholder="you@example.com"
              required
              autoComplete="email"
              disabled={loading}
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password ? errors.password : ''}
              success={touched.password && !errors.password && formData.password.length > 0}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              disabled={loading}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="remember" className="text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link
                to="/auth/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link to="/auth/sign-up" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
