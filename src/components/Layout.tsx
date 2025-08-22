import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Server, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-900 to-green-500 p-2 rounded-lg">
                <Server className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">VyntrixHost</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-blue-900' : 'text-gray-700 hover:text-blue-900'
                }`}
              >
                Início
              </Link>
              <Link 
                to="/plans" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/plans') ? 'text-blue-900' : 'text-gray-700 hover:text-blue-900'
                }`}
              >
                Planos
              </Link>
              <Link 
                to="/about" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/about') ? 'text-blue-900' : 'text-gray-700 hover:text-blue-900'
                }`}
              >
                Sobre Nós
              </Link>
              <Link 
                to="/contact" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/contact') ? 'text-blue-900' : 'text-gray-700 hover:text-blue-900'
                }`}
              >
                Contato
              </Link>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                    className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-900"
                  >
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </Link>
                  <button 
                    onClick={logout}
                    className="flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Entrar
                </Link>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-gray-900"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              <Link 
                to="/" 
                className={`block px-3 py-2 text-sm font-medium rounded-lg ${
                  isActive('/') ? 'bg-blue-50 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                to="/plans" 
                className={`block px-3 py-2 text-sm font-medium rounded-lg ${
                  isActive('/plans') ? 'bg-blue-50 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Planos
              </Link>
              <Link 
                to="/about" 
                className={`block px-3 py-2 text-sm font-medium rounded-lg ${
                  isActive('/about') ? 'bg-blue-50 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre Nós
              </Link>
              <Link 
                to="/contact" 
                className={`block px-3 py-2 text-sm font-medium rounded-lg ${
                  isActive('/contact') ? 'bg-blue-50 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                    className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {user.name}
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-gray-100 rounded-lg"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="block px-3 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-blue-900 to-green-500 p-2 rounded-lg">
                  <Server className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">VyntrixHost</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Hospedagem de sites rápida e confiável que impulsiona seu negócio. 
                Planos flexíveis com a velocidade que você precisa e o suporte que você merece.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Links Rápidos</h3>
              <div className="space-y-2">
                <Link to="/plans" className="block text-sm text-gray-400 hover:text-white transition-colors">
                  Planos
                </Link>
                <Link to="/about" className="block text-sm text-gray-400 hover:text-white transition-colors">
                  Sobre Nós
                </Link>
                <Link to="/contact" className="block text-sm text-gray-400 hover:text-white transition-colors">
                  Contato
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>suporte@vyntrixhost.com</p>
                <p>Suporte 24/7</p>
                <p>Backups Diários</p>
                <p>SSL Grátis</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8">
            <p className="text-center text-sm text-gray-400">
              © 2025 VyntrixHost. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;