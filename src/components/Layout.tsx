import React, { useState } from 'react';
import { Menu, X, LayoutDashboard, Package, ShoppingCart, TrendingUp, Users, Headphones, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentModule: string;
  onModuleChange: (module: string) => void;
}

export function Layout({ children, currentModule, onModuleChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const modules = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'vendors', label: 'Vendors', icon: Users },
    { id: 'crm', label: 'CRM', icon: Users },
    { id: 'support', label: 'Support', icon: Headphones },
  ];

  return (
    <div className="flex h-screen bg-gray-900">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300 overflow-y-auto`}>
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-2xl font-bold">LTP Services</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-8 space-y-2 px-3">
          {modules.map(module => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => onModuleChange(module.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentModule === module.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{module.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {modules.find(m => m.id === currentModule)?.label || 'LTP Services'}
          </h2>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Settings size={20} className="text-gray-600" />
          </button>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
