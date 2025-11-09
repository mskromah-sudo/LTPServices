import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { useState } from 'react';

export function ProfilePage() {
  const { user } = useAuth();
  const [currentModule, setCurrentModule] = useState('dashboard');

  return (
    <Layout currentModule={currentModule} onModuleChange={setCurrentModule}>
      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <p className="text-gray-900">{user?.user_metadata?.full_name || 'Not set'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <p className="text-gray-900">{user?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Created</label>
              <p className="text-gray-900">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
              </p>
            </div>

            <div className="border-t pt-6">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
