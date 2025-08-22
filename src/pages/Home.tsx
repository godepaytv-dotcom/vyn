import React, { useState } from 'react';
import { ArrowRight, Shield, Clock, HardDrive, Headphones, Zap, Star } from 'lucide-react';
import PlanCard from '../components/PlanCard';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
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
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-green-500/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Hospedagem de Sites{' '}
              <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                Rápida e Confiável
              </span>{' '}
              que Impulsiona seu Negócio
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Planos flexíveis com a velocidade que você precisa e o suporte que você merece.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105"
              >
                <span>Ver Planos</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="border-2 border-white hover:bg-white hover:text-blue-900 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
              >
                Fale Conosco
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Por que escolher a VyntrixHost?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Oferecemos a infraestrutura e o suporte que seu site precisa para crescer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Headphones,
              title: 'Suporte 24/7',
              description: 'Equipe especializada disponível sempre que você precisar'
            },
            {
              icon: Shield,
              title: 'SSL Grátis',
              description: 'Certificados de segurança incluídos em todos os planos'
            },
            {
              icon: HardDrive,
              title: 'Backups Diários',
              description: 'Seus dados protegidos com backups automáticos'
            },
            {
              icon: Zap,
              title: 'Instalador 1-Click',
              description: 'WordPress e outras plataformas em poucos segundos'
            }
          ].map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-900 to-green-500 rounded-full mb-4">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Escolha o plano ideal para você
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Planos flexíveis que crescem junto com seu negócio
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
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            O que nossos clientes dizem
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Maria Silva',
              role: 'E-commerce',
              content: 'Migrei minha loja online para a VyntrixHost e a diferença na velocidade foi incrível. Suporte sempre disponível!'
            },
            {
              name: 'João Santos',
              role: 'Desenvolvedor',
              content: 'Uso a VyntrixHost para todos os meus projetos. A facilidade do painel e os backups automáticos são essenciais.'
            },
            {
              name: 'Ana Costa',
              role: 'Blogueira',
              content: 'Preço justo, qualidade excelente. Meu blog nunca ficou fora do ar desde que mudei para cá.'
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
              <div>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              Pronto para começar?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de clientes satisfeitos que confiam na VyntrixHost
            </p>
            <button
              onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Escolher Plano
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;