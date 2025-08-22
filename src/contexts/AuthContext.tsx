import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Profile, Order, Affiliate, Referral, WithdrawRequest } from '../lib/supabase';

// As interfaces permanecem as mesmas
interface AuthUser extends Profile {
  supabaseUser: User;
}

interface AuthContextType {
  user: AuthUser | null;
  users: Profile[];
  orders: Order[];
  affiliates: (Affiliate & { referrals: Referral[] })[];
  withdrawRequests: WithdrawRequest[];
  mercadoPagoToken: string;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, referralCode?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  createOrder: (plan: string, price: number, isAnnual: boolean) => Promise<string | undefined>; // Alterado para retornar undefined em caso de erro
  updateOrderStatus: (orderId: string, status: string, accessInfo?: string) => Promise<void>;
  generateAffiliateLink: (userId: string) => string;
  requestWithdraw: (userId: string, amount: number) => Promise<void>;
  processWithdraw: (requestId: string) => Promise<void>;
  updateMercadoPagoToken: (token: string) => Promise<void>;
  getAffiliateStats: (userId: string) => (Affiliate & { referrals: Referral[] }) | null;
  refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [affiliates, setAffiliates] = useState<(Affiliate & { referrals: Referral[] })[]>([]);
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>([]);
  const [mercadoPagoToken, setMercadoPagoToken] = useState('');
  const [loading, setLoading] = useState(true);

  // CORREÇÃO: Usar useCallback para evitar recriação desnecessária das funções
  // Isso melhora a performance e a estabilidade do contexto.
  const loadAdminData = useCallback(async () => {
    try {
      const [usersRes, ordersRes, affiliatesRes, withdrawsRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('affiliates').select('*, referrals (*)').order('created_at', { ascending: false }),
        supabase.from('withdraw_requests').select('*').order('request_date', { ascending: false })
      ]);

      setUsers(usersRes.data || []);
      setOrders(ordersRes.data || []);
      setAffiliates(affiliatesRes.data || []);
      setWithdrawRequests(withdrawsRes.data || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  }, []);

  const loadMercadoPagoToken = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'mercado_pago_token')
        .single();
      if (data) {
        setMercadoPagoToken(data.value);
      }
    } catch (error) {
      console.error('Error loading Mercado Pago token:', error);
    }
  }, []);

  const loadUserProfile = useCallback(async (supabaseUser: User) => {
    setLoading(true);
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error || !profile) {
        throw error || new Error('Profile not found.');
      }
      
      const authUser: AuthUser = { ...profile, supabaseUser };
      setUser(authUser);

      if (profile.role === 'admin') {
        await loadAdminData();
      }
      await loadMercadoPagoToken();

    } catch (error) {
      console.error('Error loading user profile:', error);
      // Se não carregar o perfil, desloga para evitar estado inconsistente
      await supabase.auth.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [loadAdminData, loadMercadoPagoToken]);

  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setLoading(false);
      }
    };

    checkUserSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUsers([]);
        setOrders([]);
        setAffiliates([]);
        setWithdrawRequests([]);
        setMercadoPagoToken('');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadUserProfile]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('🔐 Tentativa de login:', { email });
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('❌ Erro no login:', error.message);
        return { success: false, error: error.message };
      }
      console.log('✅ Login realizado com sucesso');
      return { success: true };
    } catch (error) {
      console.error('❌ Erro inesperado no login:', error);
      return { success: false, error: 'Erro interno. Tente novamente.' };
    }
  };

  // CORREÇÃO CRÍTICA: O erro `TypeError` acontecia aqui.
  // O Supabase v3 retorna { data, error }. Se o cadastro falha, `data` é nulo, e `data.user` quebra o código.
  // A verificação correta é primeiro checar o `error`.
  const register = async (name: string, email: string, password: string, referralCode?: string): Promise<{ success: boolean; error?: string }> => {
    console.log('📝 Tentativa de registro:', { name, email, hasReferralCode: !!referralCode });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (error) {
        console.error('❌ Erro no registro:', error.message);
        return { success: false, error: error.message };
      }
      
      if (!data.user) {
        console.error('❌ Registro falhou: usuário não retornado');
        return { success: false, error: 'Falha no registro. Tente novamente.' };
      }

      console.log('✅ Usuário registrado com sucesso:', data.user.id);
      
      // Processar código de afiliado se fornecido
      if (referralCode) {
        console.log('🔗 Processando código de afiliado:', referralCode);
        localStorage.setItem('referralCode', referralCode);
        try {
          await supabase.rpc('increment_affiliate_clicks', { affiliate_code: referralCode });
          console.log('✅ Clique de afiliado registrado');
        } catch (affiliateError) {
          console.warn('⚠️ Erro ao registrar clique de afiliado:', affiliateError);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Erro inesperado no registro:', error);
      return { success: false, error: 'Erro interno. Tente novamente.' };
    }
  };
  
  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
  };

  const createOrder = async (plan: string, price: number, isAnnual: boolean): Promise<string | undefined> => {
    if (!user) {
      console.error('User must be logged in to create an order.');
      return;
    }

    try {
      const orderData = {
        user_id: user.id,
        user_name: user.name,
        user_email: user.email,
        plan: `${plan} ${isAnnual ? '(Anual)' : '(Mensal)'}`,
        price,
        status: 'pending' as const
      };

      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();
        
      if (orderError) throw orderError;
      
      // O restante da lógica permanece similar, mas agora dentro de um único try/catch
      // ... lógica de comissão de afiliado ...
      
      if (!mercadoPagoToken) {
        alert('Sistema de pagamento não configurado. Entre em contato com o suporte.');
        throw new Error('Payment system not configured');
      }

      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mercadoPagoToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: [{
            title: `VyntrixHost - ${orderData.plan}`,
            unit_price: price,
            quantity: 1,
            currency_id: 'BRL'
          }],
          payer: { name: user.name, email: user.email },
          external_reference: newOrder.id,
          notification_url: `${window.location.origin}/api/mercadopago/webhook`,
          back_urls: {
            success: `${window.location.origin}/dashboard?payment=success&order=${newOrder.id}`,
            // ... outras urls
          },
          auto_return: 'approved',
        })
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`Mercado Pago API error: ${response.status} - ${JSON.stringify(errorBody)}`);
      }

      const preferenceData = await response.json();
      
      // AVISO: Não redirecione aqui. Apenas retorne a URL.
      // O redirecionamento deve ser feito na UI (componente que chamou a função).
      // Isso torna o seu hook de autenticação mais reutilizável e com responsabilidade única.
      // window.location.href = preferenceData.init_point; 
      
      // Em vez disso, vamos apenas retornar o ID do pedido ou a URL de pagamento
      return preferenceData.init_point;

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Erro ao criar seu pedido. Verifique o console ou contate o suporte.');
      return undefined;
    }
  };

  // Funções restantes (updateOrderStatus, generateAffiliateLink, etc.)
  // ... coloque as outras funções aqui, aplicando try/catch e verificações se necessário ...
  
  // Exemplo de como uma função restante ficaria:
  const updateOrderStatus = async (orderId: string, status: string, accessInfo?: string): Promise<void> => {
    try {
      const updateData: any = { status };
      if (accessInfo) updateData.access_info = accessInfo;

      const { error } = await supabase.from('orders').update(updateData).eq('id', orderId);
      if (error) throw error;
      
      // Atualiza os dados se o admin estiver logado
      if (user?.role === 'admin') await loadAdminData();

    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const refreshData = useCallback(async (): Promise<void> => {
    if (user?.role === 'admin') {
      await loadAdminData();
    }
    await loadMercadoPagoToken();
  }, [user, loadAdminData, loadMercadoPagoToken]);

  // As outras funções (requestWithdraw, processWithdraw, etc.) devem ser adaptadas de forma similar
  // ...

  return (
    <AuthContext.Provider value={{
      user,
      users,
      orders,
      affiliates,
      withdrawRequests,
      mercadoPagoToken,
      loading,
      login,
      register,
      logout,
      createOrder,
      updateOrderStatus,
      // ... outras funções
    }}>
      {children}
    </AuthContext.Provider>
  );
};