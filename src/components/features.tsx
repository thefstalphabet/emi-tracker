"use client"

import { 
  Calculator, 
  Bell, 
  BarChart3, 
  Calendar, 
  Shield, 
  Smartphone 
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Calculator,
    title: 'Monthly EMI Tracking',
    description: 'Get a complete overview of your monthly EMI obligations with detailed breakdowns and total calculations.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: BarChart3,
    title: 'Remaining Balance Monitor',
    description: 'Track how much you still owe on each loan with visual progress indicators and detailed analytics.',
    color: 'from-teal-500 to-teal-600'
  },
  {
    icon: Calendar,
    title: 'Loan Duration Insights',
    description: 'See exactly how many months are left for each loan with projected completion dates.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Bell,
    title: 'Smart Reminder Alerts',
    description: 'Never miss a payment with customizable alerts sent via email, SMS, and push notifications.',
    color: 'from-orange-500 to-orange-600'
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Your financial data is protected with enterprise-level encryption and security protocols.',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Access your EMI dashboard anywhere with our responsive design and mobile app.',
    color: 'from-pink-500 to-pink-600'
  }
]

export default function Features() {
  return (
    <section id="features" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
      
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
            Everything You Need to 
            <span className="gradient-text"> Manage EMIs</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive tools designed to give you complete control over your loan payments and financial planning.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full glass dark:glass-dark border-2 border-white/10 dark:border-white/5 hover:border-primary/20 transition-all duration-300 group">
                <CardHeader>
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
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
                Ready to Take Control of Your EMIs?
              </h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of users who have simplified their loan management with Installo.
              </p>
              <Button variant="gradient" size="xl">
                Start Your Free Trial
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}