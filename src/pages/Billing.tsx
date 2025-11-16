import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, CreditCard, Download, Edit, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function BillingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentModule, setCurrentModule] = useState('dashboard');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showUpdatePayment, setShowUpdatePayment] = useState(false);

  const subscription = {
    id: '1',
    planName: 'Professional',
    status: 'active',
    billingCycle: 'monthly',
    price: 99,
    currentPeriodStart: '2024-11-16',
    currentPeriodEnd: '2024-12-16',
    nextBillingDate: '2024-12-16',
    autoRenew: true,
  };

  const billingInfo = {
    cardBrand: 'Visa',
    cardLastFour: '4242',
    expiryMonth: 12,
    expiryYear: 2026,
    billingName: 'John Doe',
    billingEmail: user?.email || 'user@example.com',
    billingAddress: '123 Main Street, New York, NY 10001',
  };

  const invoices = [
    {
      id: '1',
      date: '2024-11-16',
      amount: 99,
      status: 'paid',
      pdfUrl: '#',
    },
    {
      id: '2',
      date: '2024-10-16',
      amount: 99,
      status: 'paid',
      pdfUrl: '#',
    },
    {
      id: '3',
      date: '2024-09-16',
      amount: 99,
      status: 'paid',
      pdfUrl: '#',
    },
  ];

  const daysUntilRenewal = Math.ceil((new Date(subscription.nextBillingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Layout currentModule={currentModule} onModuleChange={setCurrentModule}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscriptions</h1>
          <p className="text-gray-600">Manage your subscription, billing information, and payment methods</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-8 border-l-4 border-blue-600">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-gray-600 text-sm font-medium">Current Plan</p>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">{subscription.planName}</h2>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                Active
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <Zap size={18} className="text-blue-600" />
                <div>
                  <p className="text-gray-600 text-sm">Billing Cycle</p>
                  <p className="font-semibold text-gray-900 capitalize">{subscription.billingCycle}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-blue-600" />
                <div>
                  <p className="text-gray-600 text-sm">Next Billing Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(subscription.nextBillingDate).toLocaleDateString()} ({daysUntilRenewal} days)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard size={18} className="text-blue-600" />
                <div>
                  <p className="text-gray-600 text-sm">Monthly Price</p>
                  <p className="font-semibold text-gray-900">${subscription.price}/month</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/pricing')}
                className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upgrade Plan
              </button>
              <button
                onClick={() => setShowCancelDialog(true)}
                className="flex-1 py-2 px-4 border border-red-600 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Method</h3>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                    <CreditCard size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{billingInfo.cardBrand}</p>
                    <p className="text-sm text-gray-600">•••• {billingInfo.cardLastFour}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-600">
                  Expires {billingInfo.expiryMonth}/{billingInfo.expiryYear}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowUpdatePayment(true)}
              className="w-full py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Edit size={16} />
              Update Payment Method
            </button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                Your payment method is secure and encrypted with Stripe. No card details are stored on our servers.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Billing Information</h3>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="font-medium text-gray-900">{billingInfo.billingName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-medium text-gray-900">{billingInfo.billingEmail}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 mb-1">Address</p>
              <p className="font-medium text-gray-900">{billingInfo.billingAddress}</p>
            </div>
          </div>

          <button className="py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Edit size={16} />
            Edit Billing Information
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Invoice History</h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">${invoice.amount}.00</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 ml-auto">
                        <Download size={16} />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Cancel Subscription?</h2>
            </div>

            <p className="text-gray-600 mb-6">
              We're sorry to see you go. When you cancel, you'll lose access to all premium features at the end of your current billing period.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-900">
                <strong>Your access ends:</strong> {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="w-full py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={() => setShowCancelDialog(false)}
                className="w-full py-3 border border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdatePayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Payment Method</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setShowUpdatePayment(false)}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Payment Method
              </button>
              <button
                onClick={() => setShowUpdatePayment(false)}
                className="w-full py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
