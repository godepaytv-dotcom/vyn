import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação das variáveis de ambiente
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variáveis de ambiente do Supabase não configuradas. ' +
    'Verifique se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas no arquivo .env'
  );
}

console.log('✅ Supabase configurado:', { 
  url: supabaseUrl, 
  hasAnonKey: !!supabaseAnonKey,
  anonKeyLength: supabaseAnonKey.length 
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin';
  affiliate_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  plan: string;
  price: number;
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
  payment_id?: string;
  access_info?: string;
  created_at: string;
}

export interface Affiliate {
  id: string;
  user_id: string;
  user_name: string;
  code: string;
  clicks: number;
  conversions: number;
  balance: number;
  created_at: string;
}

export interface Referral {
  id: string;
  affiliate_id: string;
  referred_name: string;
  plan: string;
  commission: number;
  order_id: string;
  created_at: string;
}

export interface WithdrawRequest {
  id: string;
  user_id: string;
  user_name: string;
  amount: number;
  status: 'pending' | 'paid';
  request_date: string;
  paid_date?: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}