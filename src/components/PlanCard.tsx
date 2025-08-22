import React from 'react';
import { Check } from 'lucide-react';

interface PlanCardProps {
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  isAnnual: boolean;
  features: string[];
  isPopular?: boolean;
  onSelect: (plan: string, price: number, isAnnual: boolean) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  name,
  description,
  monthlyPrice,
  annualPrice,
  isAnnual,
  features,
  isPopular,
  onSelect
}) => {
  const currentPrice = isAnnual ? annualPrice : monthlyPrice;
  const savings = monthlyPrice - annualPrice;

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
      isPopular ? 'ring-2 ring-green-500 scale-105' : ''
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
            Mais Popular
          </span>
        </div>
      )}
      
      {isAnnual && savings > 0 && (
        <div className="absolute -top-3 -right-3">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Economize R$ {savings.toFixed(2)}
          </div>
        </div>
      )}

      <div className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
          
          <div className="mb-6">
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-bold text-gray-900">
                R$ {currentPrice.toFixed(2)}
              </span>
              <span className="text-gray-600 ml-1">/mês</span>
            </div>
            {isAnnual && (
              <p className="text-sm text-green-600 mt-2">
                Cobrado anualmente
              </p>
            )}
          </div>

          <button
            onClick={() => onSelect(name, currentPrice, isAnnual)}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
              isPopular
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-blue-900 hover:bg-blue-800 text-white'
            }`}
          >
            Contratar Agora
          </button>
        </div>

        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700 text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanCard;