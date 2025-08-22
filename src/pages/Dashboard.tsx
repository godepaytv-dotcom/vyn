import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  User, 
  Server, 
  CreditCard, 
  Link as LinkIcon, 
  Copy, 
  DollarSign, 
  Users, 
  Eye, 
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PlanCard from '../components/PlanCard';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnnual, setIsAnnual] = useState(false);
  const { user, generateAffiliateLink, getAffiliateStats, requestWithdraw, createOrder, orders, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle payment return from Mercado Pago
  React.useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const paymentStatus = urlParams.get('payment');
    const orderId = urlParams.get('order');
    
    if (paymentStatus && orderId) {
      let message = '';
      let alertType = '';
      
      switch (paymentStatus) {
        case 'success':
          message = '✅ Pagamento aprovado! Seu pedido está sendo processado.';
          alertType = 'success';
          break;
        case 'pending':
          message = '⏳ Pagamento pendente. Aguarde a confirmação.';
          alertType = 'warning';
          break;
        case 'failure':
          message = '❌ Pagamento não foi aprovado. Tente novamente.';
          alertType = 'error';
          break;
      }
      
      if (message) {
        // Show notification
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
          alertType === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
          alertType === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
          'bg-red-100 text-red-800 border border-red-200'
        }`;
        notification.innerHTML = `
          <div class="flex items-center space-x-2">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-gray-500 hover:text-gray-700">×</button>
          </div>
        `;
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
          if (notification.parentElement) {
            notification.remove();
          }
        }, 5000);
        
        // Clean URL
        window.history.replaceState({}, document.title, '/dashboard');
      }
    }
  }, [location.search]);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-900"></div>
      </div>
    );
  }

  const affiliateStats = getAffiliateStats(user.id);
  const affiliateLink = generateAffiliateLink(user.id);
  const userOrders = orders.filter(order => order.user_id === user.id);

  const plans = [
    {
      name: 'Bronze',
      description: 'Ideal para começar',
      monthlyPrice: 20.00,
      annualPrice: 15.00,
      features: [
        'Até 10 sites',
        '10GB de armazenamento SSD',
        'Certificado SSL grátis',
        'Suporte por email',
        'Backup semanal',
        'Painel de controle cPanel'
      ]
    },
    {
      name: 'Prata',
      description: 'Perfeito para crescer',
      monthlyPrice: 30.00,
      annualPrice: 25.00,
      features: [
        'Até 50 sites',
        '50GB de armazenamento SSD',
        'Certificado SSL grátis',
        'Suporte 24/7',
        'Backup diário',
        'Painel de controle cPanel',
        'CDN gratuito',
        'E-mail profissional'
      ],
      isPopular: true
    },
    {
      name: 'Ouro',
      description: 'Para projetos robustos',
      monthlyPrice: 39.90,
      annualPrice: 34.90,
      features: [
        'Sites ilimitados',
        '100GB de armazenamento SSD',
        'Certificado SSL grátis',
        'Suporte 24/7 prioritário',
        'Backup diário automático',
        'Painel de controle cPanel',
        'CDN gratuito',
        'E-mail profissional ilimitado',
        'Migração gratuita',
        'Garantia de uptime 99.9%'
      ]
    }
  ];

  const handleSelectPlan = async (plan: string, price: number, isAnnual: boolean) => {
    try {
      await createOrder(plan, price, isAnnual);
      // The createOrder function will handle the redirect to Mercado Pago
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Erro ao processar o pedido. Tente novamente.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Link copiado para a área de transferência!');
  };

  const handleRequestWithdraw = () => {
    if (!affiliateStats || affiliateStats.balance < 50) {
      alert('Saldo mínimo de R$ 50,00 para solicitar saque.');
      return;
    }
    
    requestWithdraw(user.id, affiliateStats.balance);
    alert('Solicitação de saque enviada! Nossa equipe processará em até 48 horas.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'paid':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'paid':
        return <CreditCard className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Ativo';
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Área do Cliente</h1>
          <p className="text-gray-600 mt-2">Bem-vindo, {user.name}!</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'overview', label: 'Visão Geral', icon: User },
              { id: 'services', label: 'Meus Serviços', icon: Server },
              { id: 'plans', label: 'Contratar Planos', icon: Package },
              { id: 'affiliate', label: 'Programa de Afiliados', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Info */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações da Conta</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nome</label>
                      <p className="text-gray-900">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tipo de Conta</label>
                      <p className="text-gray-900 capitalize">{user.role}</p>
                    </div>
                    {affiliateStats && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Código de Afiliado</label>
                        <p className="text-blue-600 font-mono">{affiliateStats.code}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-900 to-green-500 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Serviços Ativos</p>
                      <p className="text-2xl font-bold">{userOrders.filter(o => o.status === 'completed').length}</p>
                    </div>
                    <Server className="h-8 w-8 text-blue-200" />
                  </div>
                </div>

                {affiliateStats && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Ganhos como Afiliado</h3>
                      <DollarSign className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Saldo:</span>
                        <span className="font-semibold text-green-600">R$ {affiliateStats.balance.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Conversões:</span>
                        <span className="font-semibold">{affiliateStats.conversions}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Meus Serviços</h2>
                
                {userOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Server className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Você ainda não possui serviços contratados</p>
                    <button
                      onClick={() => setActiveTab('plans')}
                      className="bg-gradient-to-r from-blue-900 to-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
                    >
                      Ver Planos Disponíveis
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{order.plan}</h3>
                            <p className="text-sm text-gray-500">
                              Contratado em {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                            <p className="text-sm font-medium text-gray-700 mt-1">
                              R$ {order.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span>{getStatusText(order.status)}</span>
                            </span>
                            {order.status === 'completed' && order.accessInfo && (
                              <div className="mt-2">
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                  Ver Detalhes de Acesso
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        {order.accessInfo && (
                          <div className="mt-4 p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-700 font-medium mb-2">
                              ✅ Informações de Acesso:
                            </p>
                            <p className="text-sm text-green-600 whitespace-pre-wrap">
                              {order.accessInfo}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Plans Tab */}
          {activeTab === 'plans' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Contratar Novos Planos</h2>
                <p className="text-xl text-gray-600 mb-8">Escolha o plano ideal para suas necessidades</p>
                
                {/* Billing Toggle */}
                <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-sm">
                  <button
                    onClick={() => setIsAnnual(false)}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                      !isAnnual
                        ? 'bg-blue-900 text-white'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    Mensal
                  </button>
                  <button
                    onClick={() => setIsAnnual(true)}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                      isAnnual
                        ? 'bg-blue-900 text-white'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    Anual
                    <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                      Economize
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan, index) => (
                  <PlanCard
                    key={index}
                    name={plan.name}
                    description={plan.description}
                    monthlyPrice={plan.monthlyPrice}
                    annualPrice={plan.annualPrice}
                    isAnnual={isAnnual}
                    features={plan.features}
                    isPopular={plan.isPopular}
                    onSelect={handleSelectPlan}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Affiliate Tab */}
          {activeTab === 'affiliate' && affiliateStats && (
            <div className="space-y-6">
              {/* Affiliate Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <Eye className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{affiliateStats.clicks}</p>
                  <p className="text-sm text-gray-500">Cliques</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{affiliateStats.conversions}</p>
                  <p className="text-sm text-gray-500">Conversões</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {affiliateStats.clicks > 0 ? ((affiliateStats.conversions / affiliateStats.clicks) * 100).toFixed(1) : 0}%
                  </p>
                  <p className="text-sm text-gray-500">Taxa de Conversão</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <DollarSign className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">R$ {affiliateStats.balance.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Saldo</p>
                </div>
              </div>

              {/* Affiliate Link */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Seu Link de Afiliado</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={affiliateLink}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                  <button
                    onClick={() => copyToClipboard(affiliateLink)}
                    className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copiar</span>
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Compartilhe este link e ganhe 25% de comissão sobre a primeira compra de cada referido!
                </p>
              </div>

              {/* Withdraw Section */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Saque de Comissões</h3>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-green-600">R$ {affiliateStats.balance.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Saldo disponível</p>
                  </div>
                  <button
                    onClick={handleRequestWithdraw}
                    disabled={affiliateStats.balance < 50}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                      affiliateStats.balance >= 50
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Solicitar Saque
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  * Saque mínimo de R$ 50,00. Processamento em até 48 horas úteis.
                </p>
              </div>

              {/* Referrals List */}
              {affiliateStats.referrals.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Indicações</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Cliente</th>
                          <th className="px-4 py-2 text-left">Plano</th>
                          <th className="px-4 py-2 text-left">Comissão</th>
                          <th className="px-4 py-2 text-left">Data</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {affiliateStats.referrals.map((referral) => (
                          <tr key={referral.id}>
                            <td className="px-4 py-2 font-medium">{referral.referredName}</td>
                            <td className="px-4 py-2">{referral.plan}</td>
                            <td className="px-4 py-2 text-green-600">R$ {referral.commission.toFixed(2)}</td>
                            <td className="px-4 py-2 text-gray-500">
                              {new Date(referral.date).toLocaleDateString('pt-BR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;