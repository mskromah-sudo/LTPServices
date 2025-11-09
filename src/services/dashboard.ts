import { supabase } from '@/lib/supabase';
import { DashboardStats, Order, SupportTicket, Product } from '@/types';

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [ordersRes, customersRes, productsRes, ticketsRes, recentOrdersRes] = await Promise.all([
      supabase.from('orders').select('total_amount', { count: 'exact' }).eq('status', 'completed'),
      supabase.from('customers').select('id', { count: 'exact' }),
      supabase.from('products').select('id').lt('quantity_in_stock', 'reorder_level'),
      supabase.from('support_tickets').select('id', { count: 'exact' }).eq('status', 'open'),
      supabase.from('orders').select('id, order_number, status, total_amount, customer_id, created_at, customers(name)').order('created_at', { ascending: false }).limit(5),
    ]);

    const totalRevenue = ordersRes.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
    const totalOrders = ordersRes.count || 0;
    const totalCustomers = customersRes.count || 0;
    const lowStockProducts = productsRes.data?.length || 0;
    const openTickets = ticketsRes.count || 0;

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      lowStockProducts,
      recentOrders: (recentOrdersRes.data || []) as any[],
      recentTickets: [],
      topProducts: [],
      salesTrend: generateSalesTrend(),
    };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    throw error;
  }
}

function generateSalesTrend() {
  const trend = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    trend.push({
      date: date.toISOString().split('T')[0],
      amount: Math.floor(Math.random() * 5000) + 2000,
    });
  }
  return trend;
}
