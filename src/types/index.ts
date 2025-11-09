export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  total_orders: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  contact_person?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  payment_terms?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  category_id?: string;
  vendor_id?: string;
  price: number;
  cost?: number;
  quantity_in_stock: number;
  reorder_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  vendor?: Vendor;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total_amount: number;
  payment_method?: string;
  payment_status: 'unpaid' | 'paid' | 'refunded';
  notes?: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
  product?: Product;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  customer_id: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
}

export interface CustomerInteraction {
  id: string;
  customer_id: string;
  interaction_type: 'call' | 'email' | 'meeting' | 'note';
  notes: string;
  created_at: string;
}

export interface PurchaseHistory {
  id: string;
  vendor_id: string;
  product_id: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  purchase_date: string;
  created_at: string;
  vendor?: Vendor;
  product?: Product;
}

export interface InventoryTransaction {
  id: string;
  product_id: string;
  transaction_type: 'purchase' | 'sale' | 'adjustment' | 'damage';
  quantity_change: number;
  reference_id?: string;
  notes?: string;
  created_at: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockProducts: number;
  recentOrders: Order[];
  recentTickets: SupportTicket[];
  topProducts: Product[];
  salesTrend: { date: string; amount: number }[];
}
