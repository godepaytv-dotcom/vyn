import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    alert('Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Entre em Contato
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Precisa de ajuda ou tem alguma dúvida? Nossa equipe está pronta para ajudá-lo. 
            Entre em contato através dos canais abaixo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Como podemos ajudar?
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    icon: Mail,
                    title: 'Email',
                    info: 'suporte@vyntrixhost.com',
                    description: 'Resposta em até 2 horas'
                  },
                  {
                    icon: MessageSquare,
                    title: 'Chat Online',
                    info: 'Disponível no site',
                    description: 'Resposta imediata'
                  },
                  {
                    icon: Phone,
                    title: 'Telefone',
                    info: '(11) 99999-9999',
                    description: 'Seg - Sex: 8h às 22h'
                  },
                  {
                    icon: MapPin,
                    title: 'Localização',
                    info: 'São Paulo, SP',
                    description: 'Brasil'
                  }
                ].map((contact, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-900 to-green-500 rounded-lg flex items-center justify-center">
                        <contact.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{contact.title}</h3>
                      <p className="text-blue-600 font-medium">{contact.info}</p>
                      <p className="text-sm text-gray-600">{contact.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Hours */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="h-6 w-6 text-blue-900" />
                <h3 className="text-xl font-semibold text-gray-900">Horário de Atendimento</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Segunda - Sexta:</span>
                  <span className="font-medium">8h às 22h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sábado:</span>
                  <span className="font-medium">9h às 18h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Domingo:</span>
                  <span className="font-medium">10h às 16h</span>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700 font-medium">
                    ⚡ Suporte de emergência 24/7 para clientes dos planos Prata e Ouro
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Envie uma Mensagem
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Selecione um assunto</option>
                  <option value="duvida-planos">Dúvidas sobre planos</option>
                  <option value="suporte-tecnico">Suporte técnico</option>
                  <option value="faturamento">Faturamento</option>
                  <option value="migracao">Migração de site</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Descreva sua dúvida ou solicitação..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-900 to-green-500 hover:from-blue-800 hover:to-green-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105"
              >
                <Send className="h-5 w-5" />
                <span>Enviar Mensagem</span>
              </button>
            </form>
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
                question: 'Qual o prazo para ativação da hospedagem?',
                answer: 'A ativação é instantânea após a confirmação do pagamento. Em alguns casos, pode levar até 24 horas.'
              },
              {
                question: 'Vocês oferecem migração gratuita?',
                answer: 'Sim! A migração é gratuita no plano Ouro. Nos outros planos, cobramos uma taxa de R$ 50.'
              },
              {
                question: 'Como faço backup do meu site?',
                answer: 'Fazemos backups automáticos diários. Você também pode fazer backups manuais pelo painel de controle.'
              },
              {
                question: 'Posso trocar de plano depois?',
                answer: 'Sim! Você pode fazer upgrade ou downgrade a qualquer momento através do seu painel.'
              },
              {
                question: 'Qual a garantia de uptime?',
                answer: 'Garantimos 99.9% de uptime nos planos Prata e Ouro, e 99.5% no plano Bronze.'
              },
              {
                question: 'Como funciona o suporte técnico?',
                answer: 'Oferecemos suporte via email, chat e telefone. Planos Prata e Ouro têm suporte 24/7.'
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

export default Contact;