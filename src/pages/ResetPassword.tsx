import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '@/components/forms/FormInput';
import { useAuth } from '@/contexts/AuthContext';
import {
  validatePassword,
  validatePasswordMatch,
  getPasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
} from '@/utils/validation';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

export function ResetPassword() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordStrengthLabel = getPasswordStrengthLabel(passwordStrength);

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

    if (fieldName === 'password') {
      error = validatePassword(value) || '';
    } else if (fieldName === 'confirmPassword') {
      error = validatePasswordMatch(formData.password, value) || '';
    }

    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const isFormValid = () => {
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validatePasswordMatch(formData.password, formData.confirmPassword);

    return !passwordError && !confirmPasswordError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!isFormValid()) {
      setTouched({ password: true, confirmPassword: true });
      return;
    }

    setLoading(true);
    try {
      await updatePassword(formData.password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/auth/sign-in');
      }, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reset password';
      setGeneralError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Password</h1>
            <p className="text-gray-600">Enter your new password below</p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
              <div>
                <p className="font-medium text-green-900">Password reset successful!</p>
                <p className="text-sm text-green-800">Redirecting to sign in...</p>
              </div>
            </div>
          )}

          {generalError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <div>
                <p className="font-medium text-red-900">Error</p>
                <p className="text-sm text-red-800">{generalError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
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
                autoComplete="new-password"
                disabled={loading || success}
              />

              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">Password Strength</span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength < 30 ? 'text-red-600' :
                      passwordStrength < 60 ? 'text-yellow-600' :
                      passwordStrength < 80 ? 'text-blue-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrengthLabel}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getPasswordStrengthColor(passwordStrength)}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-600 space-y-1">
                    <p className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                      ✓ At least 8 characters
                    </p>
                    <p className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                      ✓ Contains uppercase letter
                    </p>
                    <p className={/[a-z]/.test(formData.password) ? 'text-green-600' : ''}>
                      ✓ Contains lowercase letter
                    </p>
                    <p className={/[0-9]/.test(formData.password) ? 'text-green-600' : ''}>
                      ✓ Contains number
                    </p>
                    <p className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-green-600' : ''}>
                      ✓ Contains special character
                    </p>
                  </div>
                </div>
              )}
            </div>

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
                formData.confirmPassword.length > 0 &&
                formData.password === formData.confirmPassword
              }
              placeholder="••••••••"
              required
              autoComplete="new-password"
              disabled={loading || success}
            />

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Resetting password...
                </>
              ) : success ? (
                <>
                  <CheckCircle size={18} />
                  Password reset!
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
