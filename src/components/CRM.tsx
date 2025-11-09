import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Phone, Mail } from 'lucide-react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, addInteraction, getCustomerInteractions } from '@/services/customers';
import { Customer, CustomerInteraction } from '@/types';

export function CRM() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [interactions, setInteractions] = useState<CustomerInteraction[]>([]);
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [interactionData, setInteractionData] = useState({
    interaction_type: 'call' as const,
    notes: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, formData);
      } else {
        await createCustomer(formData as any);
      }
      setShowForm(false);
      setEditingCustomer(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
      });
      fetchCustomers();
    } catch (error) {
      console.error('Failed to save customer:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        fetchCustomers();
      } catch (error) {
        console.error('Failed to delete customer:', error);
      }
    }
  };

  const handleViewCustomer = async (customer: Customer) => {
    setSelectedCustomer(customer);
    try {
      const crmInteractions = await getCustomerInteractions(customer.id);
      setInteractions(crmInteractions);
    } catch (error) {
      console.error('Failed to fetch interactions:', error);
    }
  };

  const handleAddInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    try {
      await addInteraction(selectedCustomer.id, interactionData);
      setInteractionData({ interaction_type: 'call', notes: '' });
      setShowInteractionForm(false);
      const crmInteractions = await getCustomerInteractions(selectedCustomer.id);
      setInteractions(crmInteractions);
    } catch (error) {
      console.error('Failed to add interaction:', error);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      zip_code: customer.zip_code || '',
      country: customer.country || '',
    });
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading customers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Total Customers: {customers.length}</h2>
        <button
          onClick={() => {
            setEditingCustomer(null);
            setFormData({
              name: '',
              email: '',
              phone: '',
              address: '',
              city: '',
              state: '',
              zip_code: '',
              country: '',
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                  <input
                    type="text"
                    value={formData.zip_code}
                    onChange={e => setFormData({ ...formData, zip_code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-6 border-t">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Customer
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map(customer => (
          <div key={customer.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewCustomer(customer)}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <Mail size={14} /> {customer.email}
                </p>
                {customer.phone && <p className="text-sm text-gray-600 flex items-center gap-1"><Phone size={14} /> {customer.phone}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleEdit(customer);
                  }}
                  className="p-1 hover:bg-blue-100 rounded text-blue-600"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete(customer.id);
                  }}
                  className="p-1 hover:bg-red-100 rounded text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1 mb-3">
              <p>Orders: {customer.total_orders}</p>
              <p>Total Spent: ${customer.total_spent.toFixed(2)}</p>
            </div>
            <div className="text-xs text-gray-500 border-t pt-2">
              Joined: {new Date(customer.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                <p className="text-gray-600">{selectedCustomer.email}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setShowInteractionForm(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-6 pb-6 border-b space-y-2">
              <p className="text-sm text-gray-600">Phone: {selectedCustomer.phone || 'N/A'}</p>
              <p className="text-sm text-gray-600">Address: {selectedCustomer.address || 'N/A'}</p>
              <p className="text-sm text-gray-600">Total Orders: {selectedCustomer.total_orders}</p>
              <p className="text-sm text-gray-600">Total Spent: ${selectedCustomer.total_spent.toFixed(2)}</p>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
              Interactions
              <button
                onClick={() => setShowInteractionForm(!showInteractionForm)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                + Add
              </button>
            </h3>

            {showInteractionForm && (
              <form onSubmit={handleAddInteraction} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={interactionData.interaction_type}
                      onChange={e => setInteractionData({ ...interactionData, interaction_type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="call">Call</option>
                      <option value="email">Email</option>
                      <option value="meeting">Meeting</option>
                      <option value="note">Note</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={interactionData.notes}
                    onChange={e => setInteractionData({ ...interactionData, notes: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Interaction
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInteractionForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {interactions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No interactions yet</p>
              ) : (
                interactions.map(interaction => (
                  <div key={interaction.id} className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded font-medium">
                        {interaction.interaction_type}
                      </span>
                      <p className="text-xs text-gray-500">
                        {new Date(interaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-900">{interaction.notes}</p>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => {
                setSelectedCustomer(null);
                setShowInteractionForm(false);
              }}
              className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
