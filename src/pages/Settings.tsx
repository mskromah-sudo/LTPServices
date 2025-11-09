import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { FormInput } from '@/components/forms/FormInput';
import { validatePassword, validatePasswordMatch } from '@/utils/validation';
import { Loader, CheckCircle, AlertCircle } from 'lucide-react';

export function SettingsPage() {
  const { updatePassword } = useAuth();
  const [currentModule, setCurrentModule] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

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

    if (fieldName === 'password') {
      error = validatePassword(value) || '';
    } else if (fieldName === 'confirmPassword') {
      error = validatePasswordMatch(formData.password, value) || '';
    }

    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const isFormValid = () => {
    return !validatePassword(formData.password) && !validatePasswordMatch(formData.password, formData.confirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!isFormValid()) {
      setTouched({ password: true, confirmPassword: true });
      return;
    }

    setLoading(true);
    try {
      await updatePassword(formData.password);
      setSuccess(true);
      setFormData({ password: '', confirmPassword: '' });
      setTouched({ password: false, confirmPassword: false });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update password';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout currentModule={currentModule} onModuleChange={setCurrentModule}>
      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium text-green-900">Password updated successfully</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium text-red-900">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <FormInput
                  label="New Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password ? errors.password : ''}
                  success={touched.password && !errors.password && formData.password.length > 0}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />

                <FormInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword ? errors.confirmPassword : ''}
                  success={
                    touched.confirmPassword &&
                    !errors.confirmPassword &&
                    formData.confirmPassword.length > 0
                  }
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={loading || !isFormValid()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
