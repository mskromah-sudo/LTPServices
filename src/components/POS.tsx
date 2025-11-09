import React, { useEffect, useState } from 'react';
import { Plus, Minus, X, Search, DollarSign } from 'lucide-react';
import { getProducts } from '@/services/products';
import { getCustomers } from '@/services/customers';
import { createOrder } from '@/services/orders';
import { Product, Customer, OrderItem } from '@/types';

interface CartItem extends OrderItem {
  product: Product;
}

export function POS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prods, custs] = await Promise.all([getProducts(), getCustomers()]);
      setProducts(prods);
      setCustomers(custs);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: item.subtotal + product.price }
            : item
        );
      }
      return [...prev, {
        id: '',
        order_id: '',
        product_id: product.id,
        quantity: 1,
        unit_price: product.price,
        subtotal: product.price,
        created_at: new Date().toISOString(),
        product,
      }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product_id === productId
          ? { ...item, quantity, subtotal: quantity * item.unit_price }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product_id !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleCheckout = async () => {
    if (!selectedCustomer || cart.length === 0) {
      alert('Please select a customer and add items to cart');
      return;
    }

    setLoading(true);
    try {
      await createOrder(
        {
          customer_id: selectedCustomer.id,
          status: 'completed',
          total_amount: total,
          payment_method: paymentMethod,
          payment_status: 'paid',
        } as any,
        cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.subtotal,
        }))
      );
      alert('Order created successfully!');
      setCart([]);
      setSelectedCustomer(null);
      setPaymentMethod('cash');
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Customer</label>
          <select
            value={selectedCustomer?.id || ''}
            onChange={e => {
              const customer = customers.find(c => c.id === e.target.value);
              setSelectedCustomer(customer || null);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a customer...</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - {customer.email}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex gap-2 mb-4">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.quantity_in_stock === 0}
                className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-left"
              >
                <p className="font-medium text-sm text-gray-900 truncate">{product.name}</p>
                <p className="text-xs text-gray-500">{product.sku}</p>
                <p className="text-sm font-semibold text-blue-600 mt-1">${product.price.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Stock: {product.quantity_in_stock}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm h-fit sticky top-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Shopping Cart</h2>

        <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No items in cart</p>
          ) : (
            cart.map(item => (
              <div key={item.product_id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-500">${item.unit_price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className="p-1 ml-2 hover:bg-red-100 rounded text-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="text-right text-sm font-semibold">${item.subtotal.toFixed(2)}</div>
              </div>
            ))
          )}
        </div>

        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total:</span>
            <span className="flex items-center gap-1 text-blue-600">
              <DollarSign size={20} />
              {total.toFixed(2)}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="check">Check</option>
            </select>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading || cart.length === 0 || !selectedCustomer}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Processing...' : 'Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
}
