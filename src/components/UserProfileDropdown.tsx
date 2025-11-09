import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';

export function UserProfileDropdown() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth/sign-in');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  if (!user) return null;

  const initials = user.user_metadata?.full_name
    ?.split(' ')
    .map((name: string) => name.charAt(0))
    .join('')
    .toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
          {initials}
        </div>
        <span className="hidden sm:inline text-gray-700 font-medium text-sm">
          {user.user_metadata?.full_name?.split(' ')[0] || 'User'}
        </span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">{user.user_metadata?.full_name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          <button
            onClick={() => {
              navigate('/profile');
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
          >
            <User size={16} className="text-gray-500" />
            View Profile
          </button>

          <button
            onClick={() => {
              navigate('/settings');
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
          >
            <Settings size={16} className="text-gray-500" />
            Settings
          </button>

          <div className="border-t border-gray-200 mt-2 pt-2">
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign Out?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to sign out? You'll need to sign in again to access your account.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
