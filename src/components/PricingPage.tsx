import React from 'react';
import { 
  ArrowLeft,
  Shield,
  Check,
  X,
  Star,
  Radio,
  Crown,
  Rocket
} from 'lucide-react';

interface PricingPageProps {
  onBack: () => void;
  onUpgrade: (planId: string) => void;
  currentPlan: string;
}

const PricingPage: React.FC<PricingPageProps> = ({ onBack, onUpgrade, currentPlan }) => {
  const pricingPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 'Free',
      period: '',
      description: 'Perfect for getting started',
      features: [
        'free 3 podcasts per month',
      ],
      limitations: [
      ],
      buttonText: 'Current Plan',
      buttonStyle: 'bg-gray-500 cursor-not-allowed',
      popular: false,
      icon: Radio
    },
    {
      id: 'basic+',
      name: 'basic+',
      price: '129฿',
      period: '',
      description: 'For beginer',
      features: [
        '500credits',
      ],
      limitations: [],
      buttonText: 'Buy now',
      buttonStyle: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      popular: true,
      icon: Radio
    },
    {
      id: 'pro',
      name: 'pro',
      price: '499฿',
      period: '',
      description: 'For professional studios',
      features: [
        '1000 credits free 100 credit',
      ],
      limitations: [],
      buttonText: 'Buy now',
      buttonStyle: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      popular: false,
      icon: Crown
    },
    {
      id: 'pro+ ',
      name: 'pro+ ',
      price: '999฿',
      period: '',
      description: 'For professional studios',
      features: [
        '2500 credits',
      ],
      limitations: [],
      buttonText: 'Buy now',
      buttonStyle: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      popular: false,
      icon: Rocket
    }
    ,
    {
      id: 'Premium',
      name: 'Premium',
      price: '1499฿',
      period: '',
      description: 'For professional studios',
      features: [
        '5000credits',
      ],
      limitations: [],
      buttonText: 'Buy now',
      buttonStyle: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      popular: false,
      icon: Rocket
    }
    ,
    {
      id: 'Elite',
      name: 'Elite',
      price: '14,999฿',
      period: '',
      description: 'For professional studios',
      features: [
        '50,000 credits',
      ],
      limitations: [],
      buttonText: 'Buy now',
      buttonStyle: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      popular: false,
      icon: Rocket
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Studio</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Radio className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Botcats
                </h1>
                <p className="text-sm text-gray-400">Pricing Plans</p>
              </div>
            </div>
            
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Choose Your package
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Unlock the full potential of AI-powered podcast creation. From hobbyist to professional studio, 
            we have the perfect package for your needs.
          </p>
        </div>

        {/* Current Plan Indicator */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Current Plan: {currentPlan === 'basic' ? 'Basic' : currentPlan === 'pro' ? 'Pro' : 'Extreme'}</h3>
                <p className="text-gray-400">
                  {currentPlan === 'basic' ? "You're currently on the free plan" : 
                   currentPlan === 'pro' ? "You're on the Pro plan" : 
                   "You're on the Extreme plan"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">
                {currentPlan === 'basic' ? '$0' : currentPlan === 'pro' ? '$19' : '$49'}
              </p>
              <p className="text-sm text-gray-400">per month</p>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan) => {
            const IconComponent = plan.icon;
            const isCurrentPlan = plan.id === currentPlan;
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? 'border-purple-500 ring-2 ring-purple-500/20' 
                    : 'border-white/20 hover:border-white/30'
                } ${isCurrentPlan ? 'ring-2 ring-green-500/50' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Current
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-center opacity-60">
                      <X className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-400 line-through">{limitation}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onUpgrade(plan.id)}
                  disabled={isCurrentPlan}
                  className={`w-full text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-400">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-400">We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Is there a free trial for paid plans?</h3>
              <p className="text-gray-400">Yes, all paid plans come with a 7-day free trial. No credit card required to start.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-400">We offer a 30-day money-back guarantee for all paid plans, no questions asked.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
