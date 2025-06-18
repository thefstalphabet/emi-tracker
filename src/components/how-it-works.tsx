"use client"

import { UserPlus, Plus, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const steps = [
  {
    icon: UserPlus,
    title: 'Sign Up & Connect',
    description: 'Create your account and securely connect your bank accounts or manually add your loan details.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Plus,
    title: 'Add Your EMIs',
    description: 'Input your loan information including principal amount, interest rate, and tenure for accurate tracking.',
    color: 'from-teal-500 to-teal-600'
  },
  {
    icon: BarChart3,
    title: 'Track & Manage',
    description: 'Monitor your payments, receive alerts, and get insights to optimize your loan management strategy.',
    color: 'from-purple-500 to-purple-600'
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-transparent to-muted/30" />
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl" />
      
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
            Get Started in 
            <span className="gradient-text"> 3 Simple Steps</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Setting up your EMI tracking is quick and straightforward. Start managing your loans better today.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent transform translate-x-4 z-0"></div>
              )}
              
              <Card className="glass dark:glass-dark border-2 border-white/10 dark:border-white/5 hover:border-primary/20 transition-all duration-300 relative z-10 group hover:scale-105">
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {index + 1}
                </div>
                
                <CardHeader>
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Demo section */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="glass dark:glass-dark border-2 border-white/10 dark:border-white/5">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                See Installo in Action
              </h3>
              <p className="text-muted-foreground mb-6">
                Watch our 2-minute demo to see how easy it is to manage all your EMIs in one place.
              </p>
              <div className="bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg h-64 flex items-center justify-center mb-6 border">
                <motion.div 
                  className="bg-card rounded-full p-6 shadow-lg cursor-pointer border"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-0 h-0 border-l-8 border-l-primary border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1"></div>
                </motion.div>
              </div>
              <Button variant="gradient" size="xl">
                Watch Full Demo
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}