"use client"

import { Check, Star, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const plans = [
  {
    name: 'Basic',
    price: '0',
    period: 'Forever',
    description: 'Perfect for individuals with a few EMIs',
    features: [
      'Track up to 3 EMIs',
      'Basic alerts',
      'Monthly overview',
      'Mobile app access',
      'Email support'
    ],
    cta: 'Get Started Free',
    popular: false,
    color: 'from-gray-500 to-gray-600'
  },
  {
    name: 'Pro',
    price: '299',
    period: 'per month',
    description: 'Ideal for families with multiple loans',
    features: [
      'Unlimited EMI tracking',
      'Advanced analytics',
      'Smart notifications',
      'Budget planning tools',
      'Priority support',
      'Bank integration',
      'Export reports'
    ],
    cta: 'Start Free Trial',
    popular: true,
    color: 'from-blue-600 to-teal-600'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For businesses and financial advisors',
    features: [
      'Multi-client management',
      'White-label solution',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'Advanced security',
      'Custom reporting'
    ],
    cta: 'Contact Sales',
    popular: false,
    color: 'from-purple-600 to-purple-700'
  }
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Choose Your
            <span className="gradient-text"> Perfect Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start free and upgrade as your needs grow. All plans include our core EMI tracking features.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className={`relative ${plan.popular ? 'scale-105' : ''}`}
            >
              <Card className={`h-full glass dark:glass-dark border-2 transition-all duration-300 ${
                plan.popular 
                  ? 'border-primary/50 shadow-2xl shadow-primary/20' 
                  : 'border-white/10 dark:border-white/5 hover:border-primary/20'
              }`}>
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center shadow-lg">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold gradient-text">₹{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground ml-2">{plan.period}</span>}
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>

                <CardContent>
                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <div className={`flex-shrink-0 w-5 h-5 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center mt-0.5`}>
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="ml-3 text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    variant={plan.popular ? "gradient" : "outline"}
                    size="xl"
                    className="w-full group"
                  >
                    {plan.cta}
                    {plan.popular && <Zap className="h-4 w-4 ml-2 group-hover:scale-110 transition-transform" />}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="glass dark:glass-dark border-2 border-white/10 dark:border-white/5">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                30-Day Money-Back Guarantee
              </h3>
              <p className="text-muted-foreground mb-6">
                Try EMI Tracker risk-free. If you're not completely satisfied, we'll refund your money within 30 days.
              </p>
              <div className="flex justify-center items-center space-x-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-sm text-muted-foreground">No Risk</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-sm text-muted-foreground">Cancel Anytime</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-sm text-muted-foreground">Full Refund</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}