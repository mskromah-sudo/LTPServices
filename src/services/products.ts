import { supabase } from '@/lib/supabase';
import { Product } from '@/types';

export async function getProducts(categoryId?: string) {
  let query = supabase.from('products').select('*, categories(name), vendors(name)').eq('is_active', true);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Product[];
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*), vendors(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as Product | null;
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function getLowStockProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name), vendors(name)')
    .lt('quantity_in_stock', 'reorder_level')
    .eq('is_active', true);

  if (error) throw error;
  return data as Product[];
}
