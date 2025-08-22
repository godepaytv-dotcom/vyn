import React, { useState } from 'react';
import { 
  Users, 
  ShoppingCart, 
  Settings, 
  DollarSign, 
  TrendingUp, 
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [accessInfo, setAccessInfo] = useState<{[key: string]: string}>({});
  const [newMercadoPagoToken, setNewMercadoPagoToken] = useState('');
  const { 
    user,
    loading,
    users, 
    orders, 
    affiliates, 
    withdrawRequests, 
    mercadoPagoToken, 
    updateOrderStatus,
    processWithdraw,
    updateMercadoPagoToken
  } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-900"></div>
      </div>
    );
  }

  const handleCompleteOrder = (orderId: string) => {
    const info = accessInfo[orderId];
    if (!info || info.trim() === '') {
      alert('Por favor, insira as informações de acesso antes de completar o pedido.');
      return;
    }

    updateOrderStatus(orderId, 'completed', info).then(() => {
      alert('Pedido completado e cliente notificado!');
    }).catch((error) => {
      console.error('Error completing order:', error);
      alert('Erro ao completar pedido. Tente novamente.');
    });
    
    setAccessInfo(prev => ({ ...prev, [orderId]: '' }));
  };

  const handleProcessWithdraw = (requestId: string) => {
    if (window.confirm('Confirma que o saque foi processado?')) {
      processWithdraw(requestId).then(() => {
        alert('Saque processado com sucesso!');
      }).catch((error) => {
        console.error('Error processing withdraw:', error);
        alert('Erro ao processar saque. Tente novamente.');
      });
    }
  };

  const handleUpdateMercadoPagoToken = () => {
    if (!newMercadoPagoToken.trim()) {
      alert('Por favor, insira um token válido.');
      return;
    }
    
    updateMercadoPagoToken(newMercadoPagoToken).then(() => {
      setNewMercadoPagoToken('');
      alert('Token do Mercado Pago atualizado com sucesso!');
    }).catch((error) => {
      console.error('Error updating token:', error);
      alert('Erro ao atualizar token. Tente novamente.');
    });
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

  const totalRevenue = orders
    .filter(order => order.status === 'paid' || order.status === 'completed')
    .reduce((sum, order) => sum + order.price, 0);

  const totalCommissions = affiliates.reduce((sum, affiliate) => sum + affiliate.balance, 0);
  const pendingWithdraws = withdrawRequests
    .filter(req => req.status === 'pending')
    .reduce((sum, req) => sum + req.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-gray-600 mt-2">Gestão completa da VyntrixHost</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total de Usuários</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pedidos Totais</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">R$ {totalRevenue.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Afiliados Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{affiliates.length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'overview', label: 'Visão Geral', icon: Eye },
              { id: 'users', label: 'Usuários', icon: Users },
              { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
              { id: 'affiliates', label: 'Afiliados', icon: UserCheck },
              { id: 'withdraws', label: 'Saques', icon: DollarSign },
              { id: 'settings', label: 'Configurações', icon: Settings }
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Receita Total:</span>
                    <span className="font-semibold text-green-600">R$ {totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Comissões Pendentes:</span>
                    <span className="font-semibold text-yellow-600">R$ {totalCommissions.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saques Pendentes:</span>
                    <span className="font-semibold text-red-600">R$ {pendingWithdraws.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-900 font-semibold">Lucro Líquido:</span>
                    <span className="font-bold text-blue-600">
                      R$ {(totalRevenue - totalCommissions).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Pendentes</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pedidos Pendentes:</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                      {orders.filter(o => o.status === 'pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pedidos Pagos:</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                      {orders.filter(o => o.status === 'paid').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Saques Solicitados:</span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                      {withdrawRequests.filter(w => w.status === 'pending').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Usuários Cadastrados</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código Afiliado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((userItem) => (
                      <tr key={userItem.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {userItem.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {userItem.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            userItem.role === 'admin' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {userItem.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {userItem.affiliateCode || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Gestão de Pedidos</h2>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhum pedido encontrado.</p>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{order.plan}</h3>
                            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="capitalize">{order.status}</span>
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">Cliente: {order.userName} ({order.userEmail})</p>
                          <p className="text-sm text-gray-600">
                            Valor: R$ {order.price.toFixed(2)} | 
                            Data: {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>

                        {order.status === 'paid' && (
                          <div className="ml-4 min-w-0 flex-1 max-w-md">
                            <div className="space-y-2">
                              <textarea
                                placeholder="Informações de acesso (login, senha, cPanel, etc.)"
                                value={accessInfo[order.id] || ''}
                                onChange={(e) => setAccessInfo(prev => ({ ...prev, [order.id]: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                                rows={3}
                              />
                              <button
                                onClick={() => handleCompleteOrder(order.id)}
                                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                Completar Pedido
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {order.accessInfo && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-700 font-medium mb-1">
                            ✅ Informações enviadas ao cliente:
                          </p>
                          <p className="text-sm text-green-600 whitespace-pre-wrap">
                            {order.accessInfo}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Affiliates Tab */}
          {activeTab === 'affiliates' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Programa de Afiliados</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Afiliado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliques</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversões</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {affiliates.map((affiliate) => (
                      <tr key={affiliate.userId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {affiliate.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {affiliate.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {affiliate.clicks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {affiliate.conversions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          R$ {affiliate.balance.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Detailed Referrals */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico Detalhado de Indicações</h3>
                <div className="space-y-4">
                  {affiliates.flatMap(affiliate => 
                    affiliate.referrals.map(referral => ({
                      ...referral,
                      affiliateName: affiliate.userName,
                      affiliateCode: affiliate.code
                    }))
                  ).length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Nenhuma indicação encontrada.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">Afiliado</th>
                            <th className="px-4 py-2 text-left">Cliente Indicado</th>
                            <th className="px-4 py-2 text-left">Plano</th>
                            <th className="px-4 py-2 text-left">Comissão</th>
                            <th className="px-4 py-2 text-left">Data</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {affiliates.flatMap(affiliate => 
                            affiliate.referrals.map(referral => ({
                              ...referral,
                              affiliateName: affiliate.userName,
                              affiliateCode: affiliate.code
                            }))
                          ).map((referral) => (
                            <tr key={`${referral.affiliateCode}-${referral.id}`}>
                              <td className="px-4 py-2 font-medium">{referral.affiliateName}</td>
                              <td className="px-4 py-2">{referral.referredName}</td>
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
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Withdraws Tab */}
          {activeTab === 'withdraws' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Solicitações de Saque</h2>
              <div className="space-y-4">
                {withdrawRequests.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhuma solicitação de saque encontrada.</p>
                ) : (
                  withdrawRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.userName}</h3>
                          <p className="text-sm text-gray-600">
                            Valor: R$ {request.amount.toFixed(2)} | 
                            Solicitado em: {new Date(request.requestDate).toLocaleDateString('pt-BR')}
                          </p>
                          {request.paidDate && (
                            <p className="text-sm text-green-600">
                              Pago em: {new Date(request.paidDate).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            request.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.status === 'paid' ? 'Pago' : 'Pendente'}
                          </span>
                          {request.status === 'pending' && (
                            <button
                              onClick={() => handleProcessWithdraw(request.id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Marcar como Pago
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Integração de Pagamento</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mercado Pago - Access Token
                    </label>
                    <div className="flex space-x-3">
                      <input
                        type="password"
                        value={newMercadoPagoToken}
                        onChange={(e) => setNewMercadoPagoToken(e.target.value)}
                        placeholder="Cole seu Access Token aqui"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleUpdateMercadoPagoToken}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Atualizar
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {mercadoPagoToken ? 
                        `✅ Token configurado: ${mercadoPagoToken.substring(0, 20)}... A integração está ativa.` : 
                        '❌ Token não configurado. Configure para ativar os pagamentos automáticos.'
                      }
                    </p>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Webhook Configuration</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">
                        Configure este webhook no seu painel do Mercado Pago:
                      </p>
                      <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm font-mono">
                        {window.location.origin}/api/mercadopago/webhook
                      </code>
                      <p className="text-xs text-gray-500 mt-2">
                        Este webhook atualizará automaticamente o status dos pedidos quando os pagamentos forem aprovados.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Configurações do Sistema</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">Comissão de Afiliados</h3>
                      <p className="text-sm text-gray-500">Taxa atual aplicada às indicações</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      25%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">Saque Mínimo</h3>
                      <p className="text-sm text-gray-500">Valor mínimo para solicitar saque</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      R$ 50,00
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">Prazo do Cookie</h3>
                      <p className="text-sm text-gray-500">Tempo para conversão de afiliados</p>
                    </div>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      30 dias
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;