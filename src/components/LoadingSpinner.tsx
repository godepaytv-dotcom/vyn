import React from 'react';
import { Server } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="bg-gradient-to-r from-blue-900 to-green-500 p-4 rounded-xl mb-4 mx-auto w-fit">
            <Server className="h-8 w-8 text-white animate-pulse" />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-900 absolute -top-2 -left-2"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">VyntrixHost</h2>
        <p className="text-gray-600">Carregando...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;