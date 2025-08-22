import React, { useState } from 'react';
import { Check } from 'lucide-react';
import PlanCard from '../components/PlanCard';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Plans = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { user, createOrder } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Bronze',
      description: 'Ideal para começar',
      monthlyPrice: 20.00,
      annualPrice: 15.00,
      features: [
        'Até 10 sites',
        '10GB de armazenamento SSD',
        'Transferência ilimitada',
        'Certificado SSL grátis',
        'Suporte por email',
        'Backup semanal',
        'Painel de controle cPanel',
        '1 conta de email',
        'Garantia de 30 dias'
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
        'Transferência ilimitada',
        'Certificado SSL grátis',
        'Suporte 24/7',
        'Backup diário',
        'Painel de controle cPanel',
        'CDN gratuito',
        '10 contas de email',
        'E-mail profissional',
        'Garantia de 30 dias',
        'WordPress otimizado'
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
        'Transferência ilimitada',
        'Certificado SSL grátis',
        'Suporte 24/7 prioritário',
        'Backup diário automático',
        'Painel de controle cPanel',
        'CDN gratuito',
        'E-mail profissional ilimitado',
        'Migração gratuita',
        'Garantia de uptime 99.9%',
        'WordPress otimizado',
        'Staging environment',
        'Malware scanner'
      ]
    }
  ];

  const handleSelectPlan = async (plan: string, price: number, isAnnual: boolean) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await createOrder(plan, price, isAnnual);
      // The createOrder function will handle the redirect to Mercado Pago
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Erro ao processar o pedido. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Nossos Planos de Hospedagem
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Escolha o plano perfeito para suas necessidades. Todos incluem recursos essenciais 
            para o sucesso do seu site.
          </p>

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
                Economize até 25%
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

        {/* Comparison Table */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Comparação Detalhada
          </h2>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Recursos
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Bronze
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Prata
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Ouro
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    ['Número de sites', '10', '50', 'Ilimitados'],
                    ['Armazenamento SSD', '10GB', '50GB', '100GB'],
                    ['Transferência', 'Ilimitada', 'Ilimitada', 'Ilimitada'],
                    ['Contas de email', '1', '10', 'Ilimitadas'],
                    ['Certificado SSL', '✓', '✓', '✓'],
                    ['Backup', 'Semanal', 'Diário', 'Diário automático'],
                    ['CDN gratuito', '✗', '✓', '✓'],
                    ['Suporte', 'Email', '24/7', '24/7 Prioritário'],
                    ['Migração gratuita', '✗', '✗', '✓'],
                    ['Uptime garantido', '99.5%', '99.9%', '99.9%']
                  ].map(([feature, bronze, silver, gold], index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {feature}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">
                        {bronze === '✓' ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : bronze === '✗' ? (
                          <span className="text-gray-400">—</span>
                        ) : (
                          bronze
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">
                        {silver === '✓' ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : silver === '✗' ? (
                          <span className="text-gray-400">—</span>
                        ) : (
                          silver
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">
                        {gold === '✓' ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : gold === '✗' ? (
                          <span className="text-gray-400">—</span>
                        ) : (
                          gold
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Perguntas Frequentes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: 'Posso trocar de plano a qualquer momento?',
                answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento através do seu painel de controle.'
              },
              {
                question: 'Existe garantia de devolução?',
                answer: 'Oferecemos garantia de 30 dias. Se não estiver satisfeito, devolvemos seu dinheiro integral.'
              },
              {
                question: 'Como funciona o suporte 24/7?',
                answer: 'Nosso suporte está disponível via chat, email e telefone 24 horas por dia, 7 dias por semana.'
              },
              {
                question: 'Vocês fazem migração gratuita?',
                answer: 'Sim, no plano Ouro a migração é gratuita. Nos outros planos, cobramos uma taxa simbólica de R$ 50.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;