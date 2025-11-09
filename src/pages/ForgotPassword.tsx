import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormInput } from '@/components/forms/FormInput';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail } from '@/utils/validation';
import { AlertCircle, CheckCircle, Loader, Mail } from 'lucide-react';

type ForgotPasswordStep = 'email' | 'confirmation';

export function ForgotPassword() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [step, setStep] = useState<ForgotPasswordStep>('email');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const emailError = validateEmail(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (emailError) {
      setTouched(true);
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setStep('confirmation');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset link';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">
              {step === 'email' ? 'Enter your email to receive a reset link' : 'Check your email'}
            </p>
          </div>

          {step === 'email' ? (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium text-red-900">Error</p>
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched ? emailError : ''}
                  success={touched && !emailError && email.length > 0}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail size={18} />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-8 p-6 bg-blue-50 rounded-xl">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={32} className="text-blue-600" />
                  </div>
                </div>
                <p className="text-center text-gray-900 font-medium mb-2">Check your email</p>
                <p className="text-center text-gray-600 text-sm">
                  We've sent a password reset link to <strong>{email}</strong>. Click the link in the email to reset your password.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg mb-6">
                <p className="text-sm text-gray-600">
                  <strong>Didn't receive an email?</strong> Check your spam folder or <button
                    onClick={() => {
                      setStep('email');
                      setEmail('');
                      setError(null);
                      setTouched(false);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    try another email address
                  </button>
                </p>
              </div>

              <Link
                to="/auth/sign-in"
                className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all text-center block"
              >
                Back to Sign In
              </Link>
            </>
          )}

          <div className="mt-6 text-center">
            <Link to="/auth/sign-in" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
