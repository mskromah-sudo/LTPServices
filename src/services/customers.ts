import { supabase } from '@/lib/supabase';
import { Customer, CustomerInteraction } from '@/types';

export async function getCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Customer[];
}

export async function getCustomerById(id: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as Customer | null;
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('customers')
    .insert([customer])
    .select()
    .single();

  if (error) throw error;
  return data as Customer;
}

export async function updateCustomer(id: string, updates: Partial<Customer>) {
  const { data, error } = await supabase
    .from('customers')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Customer;
}

export async function deleteCustomer(id: string) {
  const { error } = await supabase.from('customers').delete().eq('id', id);
  if (error) throw error;
}

export async function addInteraction(customerId: string, interaction: Omit<CustomerInteraction, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('customer_interactions')
    .insert([{ ...interaction, customer_id: customerId }])
    .select()
    .single();

  if (error) throw error;
  return data as CustomerInteraction;
}

export async function getCustomerInteractions(customerId: string) {
  const { data, error } = await supabase
    .from('customer_interactions')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as CustomerInteraction[];
}
