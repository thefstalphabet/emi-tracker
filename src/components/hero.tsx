"use client"

import { ArrowRight, Play, TrendingUp, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="pt-24 pb-16 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-teal-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-teal-950/20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center glass dark:glass-dark px-4 py-2 rounded-full text-sm font-medium mb-6 border"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              Trusted by 50,000+ users
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Take Control of Your
              <span className="gradient-text block"> EMI Payments</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Never miss another EMI payment. Track all your loans, monitor monthly payouts, 
              and get smart alerts to stay on top of your financial commitments.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button variant="gradient" size="xl" className="group">
                Start Free Trial
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" size="xl" className="group">
                <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8 pt-8 border-t border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold gradient-text">₹2.5Cr+</div>
                <div className="text-sm text-muted-foreground">EMIs Tracked</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold gradient-text">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold gradient-text">4.9★</div>
                <div className="text-sm text-muted-foreground">User Rating</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="glass dark:glass-dark border-2 border-white/20 dark:border-white/10 transform rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl">
              <CardContent className="p-8">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-semibold text-lg">Monthly Overview</h3>
                </div>
                
                <div className="space-y-4">
                  <motion.div 
                    className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div>
                      <div className="font-medium">Home Loan</div>
                      <div className="text-sm text-muted-foreground">143 months left</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">₹45,000</div>
                      <div className="text-xs text-muted-foreground">Due: 15th Jan</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div>
                      <div className="font-medium">Car Loan</div>
                      <div className="text-sm text-muted-foreground">18 months left</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">₹12,500</div>
                      <div className="text-xs text-muted-foreground">Due: 20th Jan</div>
                    </div>
                  </motion.div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Monthly EMI</span>
                      <span className="text-xl font-bold gradient-text">₹57,500</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Floating elements */}
            <motion.div 
              className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-full shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-xs font-semibold">Alert On!</div>
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-4 -left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-lg shadow-lg"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <div className="text-xs font-semibold">Next Due: 2 days</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}