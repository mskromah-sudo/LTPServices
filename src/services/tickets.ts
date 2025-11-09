import { supabase } from '@/lib/supabase';
import { SupportTicket } from '@/types';

export async function getTickets(status?: string) {
  let query = supabase.from('support_tickets').select('*, customers(name, email)').order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as SupportTicket[];
}

export async function getTicketById(id: string) {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*, customers(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as SupportTicket | null;
}

export async function createTicket(ticket: Omit<SupportTicket, 'id' | 'created_at' | 'updated_at'>) {
  const ticketNumber = `TKT-${Date.now()}`;

  const { data, error } = await supabase
    .from('support_tickets')
    .insert([{ ...ticket, ticket_number: ticketNumber }])
    .select()
    .single();

  if (error) throw error;
  return data as SupportTicket;
}

export async function updateTicket(id: string, updates: Partial<SupportTicket>) {
  const { data, error } = await supabase
    .from('support_tickets')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as SupportTicket;
}

export async function updateTicketStatus(id: string, status: string) {
  return updateTicket(id, { status: status as any });
}

export async function deleteTicket(id: string) {
  const { error } = await supabase.from('support_tickets').delete().eq('id', id);
  if (error) throw error;
}

export async function getOpenTickets() {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*, customers(name, email)')
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as SupportTicket[];
}

export async function getUrgentTickets() {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*, customers(name, email)')
    .eq('priority', 'urgent')
    .neq('status', 'closed')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as SupportTicket[];
}
