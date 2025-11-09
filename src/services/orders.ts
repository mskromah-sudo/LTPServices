import { supabase } from '@/lib/supabase';
import { Order, OrderItem } from '@/types';

export async function getOrders(status?: string) {
  let query = supabase.from('orders').select('*, customers(name, email), order_items(*, products(name, sku))').order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Order[];
}

export async function getOrderById(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, customers(*), order_items(*, products(*))')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as Order | null;
}

export async function createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>, items: Omit<OrderItem, 'id' | 'created_at'>[]) {
  const orderNumber = `ORD-${Date.now()}`;

  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([{ ...order, order_number: orderNumber }])
    .select()
    .single();

  if (orderError) throw orderError;

  const itemsWithOrderId = items.map(item => ({ ...item, order_id: orderData.id }));
  const { error: itemsError } = await supabase.from('order_items').insert(itemsWithOrderId);

  if (itemsError) throw itemsError;

  return orderData as Order;
}

export async function updateOrder(id: string, updates: Partial<Order>) {
  const { data, error } = await supabase
    .from('orders')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export async function updateOrderStatus(id: string, status: string) {
  return updateOrder(id, { status: status as any });
}

export async function deleteOrder(id: string) {
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) throw error;
}

export async function getRecentOrders(limit = 10) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, customers(name, email), order_items(*, products(name))')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Order[];
}
