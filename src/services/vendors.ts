import { supabase } from '@/lib/supabase';
import { Vendor, PurchaseHistory } from '@/types';

export async function getVendors() {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Vendor[];
}

export async function getVendorById(id: string) {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as Vendor | null;
}

export async function createVendor(vendor: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('vendors')
    .insert([vendor])
    .select()
    .single();

  if (error) throw error;
  return data as Vendor;
}

export async function updateVendor(id: string, updates: Partial<Vendor>) {
  const { data, error } = await supabase
    .from('vendors')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Vendor;
}

export async function deleteVendor(id: string) {
  const { error } = await supabase.from('vendors').delete().eq('id', id);
  if (error) throw error;
}

export async function getVendorPurchaseHistory(vendorId: string) {
  const { data, error } = await supabase
    .from('purchase_history')
    .select('*, products(name, sku)')
    .eq('vendor_id', vendorId)
    .order('purchase_date', { ascending: false });

  if (error) throw error;
  return data as PurchaseHistory[];
}

export async function addPurchaseRecord(purchase: Omit<PurchaseHistory, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('purchase_history')
    .insert([purchase])
    .select()
    .single();

  if (error) throw error;
  return data as PurchaseHistory;
}
