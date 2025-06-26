import { Star, Check, X, Infinity } from 'lucide-react';
import React from 'react';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  limitations: string[];
  buttonText: string;
  buttonStyle: string;
  popular: boolean;
  icon: React.ElementType;
}

interface PricingPlansProps {
  pricingPlans: Plan[];
  currentPlan: string;
  handleUpgrade: (planId: string) => void;
}

const PricingPlans: React.FC<PricingPlansProps> = ({ pricingPlans, currentPlan, handleUpgrade }) => (
  <>
    {/* Header Section */}
    <div className="text-center mb-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Choose Your Plan
      </h1>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
        Unlock the full potential of AI-powered podcast creation. From hobbyist to professional studio, 
        we have the perfect plan for your needs.
      </p>
    </div>

    {/* Current Plan Indicator */}
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
            {pricingPlans.find(p => p.id === 'basic')?.icon && React.createElement(pricingPlans.find(p => p.id === 'basic')!.icon, { className: 'w-6 h-6' })}
          </div>
          <div>
            <h3 className="text-lg font-semibold">Current Plan: Basic</h3>
            <p className="text-gray-400">You're currently on the free plan</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-400">$0</p>
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
              onClick={() => handleUpgrade(plan.id)}
              disabled={isCurrentPlan}
              className={`w-full text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 ${plan.buttonStyle}`}
            >
              {plan.buttonText}
            </button>
          </div>
        );
      })}
    </div>

    {/* Features Comparison */}
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Feature Comparison</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-4 px-4">Features</th>
              <th className="text-center py-4 px-4">Basic</th>
              <th className="text-center py-4 px-4">Basic +</th>
              <th className="text-center py-4 px-4">Pro</th>
              <th className="text-center py-4 px-4">Premium</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            <tr>
              <td className="py-4 px-4 font-medium">Daily Podcast Limit</td>
              <td className="text-center py-4 px-4">10</td>
              <td className="text-center py-4 px-4">100</td>
              <td className="text-center py-4 px-4">
                <Infinity className="w-5 h-5 mx-auto text-yellow-400" />
              </td>
            </tr>
            <tr>
              <td className="py-4 px-4 font-medium">Voice Options</td>
              <td className="text-center py-4 px-4">5</td>
              <td className="text-center py-4 px-4">15+</td>
              <td className="text-center py-4 px-4">50+</td>
            </tr>
            <tr>
              <td className="py-4 px-4 font-medium">Max Length</td>
              <td className="text-center py-4 px-4">5 min</td>
              <td className="text-center py-4 px-4">30 min</td>
              <td className="text-center py-4 px-4">
                <Infinity className="w-5 h-5 mx-auto text-yellow-400" />
              </td>
            </tr>
            <tr>
              <td className="py-4 px-4 font-medium">Audio Quality</td>
              <td className="text-center py-4 px-4">Basic</td>
              <td className="text-center py-4 px-4">High</td>
              <td className="text-center py-4 px-4">Studio</td>
            </tr>
            <tr>
              <td className="py-4 px-4 font-medium">Custom Voice Training</td>
              <td className="text-center py-4 px-4">
                <X className="w-5 h-5 mx-auto text-red-400" />
              </td>
              <td className="text-center py-4 px-4">
                <Check className="w-5 h-5 mx-auto text-green-400" />
              </td>
              <td className="text-center py-4 px-4">
                <Check className="w-5 h-5 mx-auto text-green-400" />
              </td>
            </tr>
            <tr>
              <td className="py-4 px-4 font-medium">API Access</td>
              <td className="text-center py-4 px-4">
                <X className="w-5 h-5 mx-auto text-red-400" />
              </td>
              <td className="text-center py-4 px-4">
                <X className="w-5 h-5 mx-auto text-red-400" />
              </td>
              <td className="text-center py-4 px-4">
                <Check className="w-5 h-5 mx-auto text-green-400" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
  </>
);

export default PricingPlans;
