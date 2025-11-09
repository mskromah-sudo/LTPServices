import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email: string })?.email || '';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendSent, setResendSent] = useState(false);

  const handleResendEmail = async () => {
    if (!email) {
      setError('Email not found');
      return;
    }

    setLoading(true);
    try {
      const { error: err } = await supabase.auth.resendEmailConfirmation(email);
      if (err) throw err;
      setResendSent(true);
      setTimeout(() => setResendSent(false), 5000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to resend email';
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
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail size={32} className="text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-gray-600">We've sent a verification link to your email</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <div>
                <p className="font-medium text-red-900">Error</p>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {resendSent && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
              <div>
                <p className="font-medium text-green-900">Email sent!</p>
                <p className="text-sm text-green-800">Check your inbox for the verification link</p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">What's next?</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Check your email inbox</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Click the verification link</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>Return here to sign in</span>
              </li>
            </ol>
          </div>

          {email && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Sent to: <strong>{email}</strong></p>
              <p className="text-xs text-gray-500">Check your spam folder if you don't see the email</p>
            </div>
          )}

          <button
            onClick={handleResendEmail}
            disabled={loading}
            className="w-full py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail size={18} />
                Resend Verification Email
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-3">
              Already verified?{' '}
              <Link to="/auth/sign-in" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
