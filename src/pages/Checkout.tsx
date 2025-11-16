import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getSubscriptionPlanBySlug } from '@/services/subscriptions';
import { SubscriptionPlan } from '@/types';
import { Loader, AlertCircle, CheckCircle, ArrowLeft, Lock } from 'lucide-react';

type CheckoutStep = 'summary' | 'payment' | 'success';

export function CheckoutPage() {
  const { planSlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const billingCycle = (searchParams.get('cycle') || 'monthly') as 'monthly' | 'annual';

  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<CheckoutStep>('summary');
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    billingName: '',
    billingEmail: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: 'United States',
    vatNumber: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  useEffect(() => {
    const fetchPlan = async () => {
      if (!planSlug) return;
      try {
        const data = await getSubscriptionPlanBySlug(planSlug);
        if (data) {
          setPlan(data);
        } else {
          setError('Plan not found');
        }
      } catch (err) {
        setError('Failed to load plan details');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planSlug]);

  const price = plan
    ? billingCycle === 'monthly'
      ? plan.priceMonthly
      : plan.priceAnnual || plan.priceMonthly * 12
    : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length >= 2) {
      return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`;
    }
    return digitsOnly;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setFormData(prev => ({ ...prev, cardNumber: formatted }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.length <= 5) {
      setFormData(prev => ({ ...prev, cardExpiry: formatted }));
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setFormData(prev => ({ ...prev, cardCvc: value }));
    }
  };

  const validateForm = () => {
    if (!formData.billingName.trim()) {
      setError('Billing name is required');
      return false;
    }
    if (!formData.billingEmail.includes('@')) {
      setError('Valid email is required');
      return false;
    }
    if (!formData.billingAddress.trim()) {
      setError('Billing address is required');
      return false;
    }
    if (step === 'payment') {
      if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
        setError('Card number must be 16 digits');
        return false;
      }
      if (!formData.cardExpiry.match(/^\d{2}\/\d{2}$/)) {
        setError('Card expiry must be MM/YY format');
        return false;
      }
      if (formData.cardCvc.length !== 3) {
        setError('CVC must be 3 digits');
        return false;
      }
    }
    return true;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setStep('payment');
      setError(null);
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep('success');
    } catch (err) {
      setError('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="mx-auto text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Plan Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'Unable to load plan details'}</p>
          <button
            onClick={() => navigate('/pricing')}
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Pricing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate('/pricing')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium"
        >
          <ArrowLeft size={18} />
          Back to Plans
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {step === 'summary' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
                <p className="text-gray-600 mb-8">Review your order and enter your billing details</p>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                    <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                    <p className="text-red-900">{error}</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          name="billingName"
                          value={formData.billingName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          name="billingEmail"
                          value={formData.billingEmail}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <input
                      type="text"
                      name="billingAddress"
                      value={formData.billingAddress}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="billingCity"
                        value={formData.billingCity}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        name="billingState"
                        value={formData.billingState}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="NY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                      <input
                        type="text"
                        name="billingZip"
                        value={formData.billingZip}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                      name="billingCountry"
                      value={formData.billingCountry}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">VAT Number (Optional)</label>
                    <input
                      type="text"
                      name="vatNumber"
                      value={formData.vatNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VAT123456"
                    />
                  </div>

                  <button
                    onClick={handleContinue}
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Details</h1>
                <p className="text-gray-600 mb-8">Your payment information is secure and encrypted</p>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                    <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                    <p className="text-red-900">{error}</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
                    <Lock size={18} className="text-blue-600" />
                    <p className="text-sm text-blue-900">Your payment details are secure and encrypted with Stripe</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-1">Test card: 4242 4242 4242 4242</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleExpiryChange}
                        maxLength={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={formData.cardCvc}
                        onChange={handleCvcChange}
                        maxLength={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      `Pay $${price.toFixed(2)}`
                    )}
                  </button>

                  <button
                    onClick={() => setStep('summary')}
                    disabled={processing}
                    className="w-full py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                <p className="text-gray-600 mb-8">
                  Your subscription to <strong>{plan.name}</strong> is now active
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                  <h3 className="font-semibold text-gray-900 mb-4">What's next?</h3>
                  <ol className="space-y-3 text-sm text-gray-700">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <span>A confirmation email has been sent to {formData.billingEmail}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      <span>Access all premium features immediately in your dashboard</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                      <span>Manage your subscription anytime from Account Settings</span>
                    </li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/account/billing')}
                    className="w-full py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View Subscription
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>

              <div className="space-y-4 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-gray-600 text-sm">Plan</p>
                  <p className="text-lg font-semibold text-gray-900">{plan.name}</p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Billing Cycle</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{billingCycle}</p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Description</p>
                  <p className="text-gray-900">{plan.description}</p>
                </div>
              </div>

              <div className="space-y-3 py-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">${price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">$0.00</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">${price.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Your {billingCycle} subscription will renew automatically
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
