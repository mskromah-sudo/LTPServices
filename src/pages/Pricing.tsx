import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubscriptionPlans, calculateAnnualDiscount } from '@/services/subscriptions';
import { SubscriptionPlan } from '@/types';
import { Check, X, Zap } from 'lucide-react';

export function PricingPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getSubscriptionPlans();
        setPlans(data);
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your business. Always fair, always flexible.
          </p>

          <div className="flex items-center justify-center gap-4">
            <span className={`text-lg font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-600'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                billingCycle === 'annual' ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
            <div>
              <span className={`text-lg font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-600'}`}>
                Annual
              </span>
              <span className="ml-2 inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                Save 17%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => {
            const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual || plan.priceMonthly * 12;
            const isEnterprise = plan.slug === 'enterprise';
            const discount = billingCycle === 'annual' && plan.priceAnnual ? calculateAnnualDiscount(plan.priceMonthly, plan.priceAnnual) : 0;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl transition-all duration-300 ${
                  plan.isFeatured
                    ? 'ring-2 ring-blue-600 shadow-2xl scale-105 lg:scale-100'
                    : 'border border-gray-200 shadow-lg hover:shadow-xl'
                } ${plan.isFeatured ? 'bg-gradient-to-b from-blue-50 to-white' : 'bg-white'}`}
              >
                {plan.isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Zap size={16} />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                  <div className="mb-6">
                    {isEnterprise ? (
                      <div>
                        <p className="text-gray-600">Custom pricing</p>
                        <p className="text-sm text-gray-500 mt-2">Contact sales for volume discounts and custom features</p>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">
                          {price === 0 ? 'Free' : `$${price}`}
                        </span>
                        <span className="text-gray-600">
                          {price > 0 && `/${billingCycle === 'monthly' ? 'month' : 'year'}`}
                        </span>
                      </div>
                    )}
                    {discount > 0 && billingCycle === 'annual' && (
                      <p className="text-green-600 text-sm font-medium mt-2">
                        Save ${(plan.priceMonthly * 12 - (plan.priceAnnual || 0)).toFixed(0)} per year
                      </p>
                    )}
                  </div>

                  {isEnterprise ? (
                    <button
                      onClick={() => navigate('/contact')}
                      className="w-full py-3 px-4 mb-6 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Contact Sales
                    </button>
                  ) : price === 0 ? (
                    <button
                      onClick={() => navigate('/auth/sign-up')}
                      className="w-full py-3 px-4 mb-6 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Get Started Free
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/checkout/${plan.slug}?cycle=${billingCycle}`)}
                      className={`w-full py-3 px-4 mb-6 font-semibold rounded-lg transition-colors ${
                        plan.isFeatured
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                          : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      Choose Plan
                    </button>
                  )}

                  <div className="space-y-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase">WHAT'S INCLUDED</p>
                    {plan.features.map((feature) => (
                      <div key={feature.id} className="flex items-start gap-3">
                        {feature.isIncluded ? (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${feature.isIncluded ? 'text-gray-900' : 'text-gray-500'}`}>
                          {feature.featureName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-blue-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still deciding?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Start with our Free plan and upgrade anytime. No credit card required. All plans include access to our core dashboard and basic features.
          </p>
          <button
            onClick={() => navigate('/auth/sign-up')}
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Free for 30 Days
          </button>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">30 Days</div>
            <p className="text-gray-600">Free trial on all paid plans</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <p className="text-gray-600">Customer support for all users</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
            <p className="text-gray-600">Cancel anytime, no questions asked</p>
          </div>
        </div>
      </div>
    </div>
  );
}
