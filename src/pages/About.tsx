import React from 'react';
import { Shield, Zap, Users, Award, Server, HeartHandshake } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Sobre a VyntrixHost
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Somos uma empresa brasileira dedicada a fornecer soluções de hospedagem 
            de alta qualidade, com foco na velocidade, segurança e suporte excepcional.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Nossa Missão
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Democratizar o acesso a hospedagem web de qualidade, oferecendo infraestrutura 
              robusta e suporte especializado para que empresas de todos os tamanhos possam 
              prosperar online.
            </p>
            <p className="text-lg text-gray-600">
              Acreditamos que todo projeto merece uma base sólida na internet, e é isso 
              que construímos todos os dias: a fundação para o seu sucesso digital.
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-900 to-green-500 p-8 rounded-2xl text-white">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">99.9%</div>
                <div className="text-sm opacity-90">Uptime Garantido</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-sm opacity-90">Suporte Técnico</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">5000+</div>
                <div className="text-sm opacity-90">Clientes Ativos</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">3</div>
                <div className="text-sm opacity-90">Anos no Mercado</div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Nossos Valores
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Segurança',
                description: 'Protegemos seus dados com as melhores práticas de segurança do mercado'
              },
              {
                icon: Zap,
                title: 'Performance',
                description: 'Infraestrutura otimizada para garantir a máxima velocidade do seu site'
              },
              {
                icon: HeartHandshake,
                title: 'Confiabilidade',
                description: 'Relacionamento transparente e duradouro com nossos clientes'
              }
            ].map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-900 to-green-500 rounded-full mb-6">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Por que nos escolher?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Server,
                title: 'Infraestrutura de Ponta',
                description: 'Servidores SSD de alta performance em datacenters certificados'
              },
              {
                icon: Users,
                title: 'Suporte Especializado',
                description: 'Equipe técnica brasileira com anos de experiência'
              },
              {
                icon: Award,
                title: 'Preços Justos',
                description: 'Qualidade premium com preços acessíveis para todos'
              },
              {
                icon: Shield,
                title: 'Backups Automáticos',
                description: 'Seus dados sempre seguros com backups diários'
              }
            ].map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-900 to-green-500 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-20 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Nossa Equipe
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Profissionais apaixonados por tecnologia, dedicados a oferecer 
            a melhor experiência em hospedagem web do Brasil.
          </p>
          
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-12 text-white">
            <h3 className="text-2xl font-bold mb-4">Junte-se aos nossos clientes satisfeitos</h3>
            <p className="text-blue-100 mb-8 text-lg">
              Milhares de empresas confiam na VyntrixHost para hospedar seus projetos
            </p>
            <button 
              onClick={() => window.location.href = '/#plans'}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Começar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;