import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { useState } from 'react';

export function DashboardPage() {
  const { user } = useAuth();
  const [currentModule, setCurrentModule] = useState('dashboard');

  return (
    <Layout currentModule={currentModule} onModuleChange={setCurrentModule}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-gray-600 mb-8">Here's what's happening with your business today.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Revenue', value: '$45,231', change: '+12.5%' },
            { label: 'Orders Today', value: '24', change: '+8.2%' },
            { label: 'Active Customers', value: '1,234', change: '+3.1%' },
            { label: 'Pending Tasks', value: '12', change: '-2.4%' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <p className={`text-xs mt-2 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from last week
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
