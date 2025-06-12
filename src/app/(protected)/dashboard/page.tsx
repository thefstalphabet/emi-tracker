'use client';

import { useState, useEffect } from 'react';
import { Plus, Calculator, TrendingUp, Calendar, CreditCard, AlertCircle, CheckCircle2, DollarSign, Target, Clock, PieChart, BarChart3, Activity, Zap, Bell, Settings, Filter, Download, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EMI } from '../../../lib/types';
import { loadEMIs, saveEMIs } from '@/lib/storage';
import { formatCurrency, getTotalMonthlyEMI, getMonthsRemaining, getRemainingAmount } from '@/lib/emi-utils';
import { AddEMIDialog } from '@/components/add-emi-dialog';
import { EMICalculatorDialog } from '@/components/emi-calculator-dialog';
import { EMIChart } from '@/components/emi-chart';
import { EMIList } from '@/components/emi-list';
import { Navbar } from '@/components/navbar';

export default function Dashboard() {
  const [emis, setEmis] = useState<EMI[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCalculatorDialog, setShowCalculatorDialog] = useState(false);
  const [hideAmounts, setHideAmounts] = useState(false);

  useEffect(() => {
    setEmis(loadEMIs());
  }, []);

  const activeEMIs = emis.filter(emi => emi.status === 'Active');
  const completedEMIs = emis.filter(emi => emi.status === 'Completed');
  const totalMonthlyEMI = getTotalMonthlyEMI(emis);
  const totalLoanAmount = emis.reduce((sum, emi) => sum + emi.principalAmount, 0);
  const totalPaidAmount = emis.reduce((sum, emi) => sum + (emi.paidInstallments * emi.emiAmount), 0);
  const totalRemainingAmount = emis.reduce((sum, emi) => sum + getRemainingAmount(emi), 0);
  const totalInterestPaid = emis.reduce((sum, emi) => {
    const monthlyRate = emi.interestRate / (12 * 100);
    let remainingPrincipal = emi.principalAmount;
    let interestPaid = 0;
    
    for (let i = 0; i < emi.paidInstallments; i++) {
      const interestForMonth = remainingPrincipal * monthlyRate;
      const principalForMonth = emi.emiAmount - interestForMonth;
      interestPaid += interestForMonth;
      remainingPrincipal -= principalForMonth;
    }
    
    return sum + interestPaid;
  }, 0);

  const avgInterestRate = emis.length > 0 
    ? emis.reduce((sum, emi) => sum + emi.interestRate, 0) / emis.length 
    : 0;

  const handleAddEMI = (newEMI: Omit<EMI, 'id'>) => {
    const emi: EMI = {
      ...newEMI,
      id: Date.now().toString()
    };
    const updatedEMIs = [...emis, emi];
    setEmis(updatedEMIs);
    saveEMIs(updatedEMIs);
    setShowAddDialog(false);
  };

  const handleUpdateEMI = (id: string, updates: Partial<EMI>) => {
    const updatedEMIs = emis.map(emi => 
      emi.id === id ? { ...emi, ...updates } : emi
    );
    setEmis(updatedEMIs);
    saveEMIs(updatedEMIs);
  };

  const handleDeleteEMI = (id: string) => {
    const updatedEMIs = emis.filter(emi => emi.id !== id);
    setEmis(updatedEMIs);
    saveEMIs(updatedEMIs);
  };

  const upcomingPayments = activeEMIs
    .map(emi => ({
      ...emi,
      daysUntilPayment: Math.ceil(
        (new Date(emi.nextPaymentDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
    }))
    .sort((a, b) => a.daysUntilPayment - b.daysUntilPayment)
    .slice(0, 5);

  const formatAmount = (amount: number) => {
    return hideAmounts ? '₹ ****' : formatCurrency(amount);
  };

  const getPaymentHealthScore = () => {
    if (emis.length === 0) return 0;
    
    const onTimePayments = emis.reduce((sum, emi) => sum + emi.paidInstallments, 0);
    const totalPayments = emis.reduce((sum, emi) => sum + emi.tenureMonths, 0);
    const overduePayments = upcomingPayments.filter(p => p.daysUntilPayment < 0).length;
    
    const baseScore = (onTimePayments / totalPayments) * 100;
    const penaltyScore = overduePayments * 5;
    
    return Math.max(0, Math.min(100, baseScore - penaltyScore));
  };

  const paymentHealthScore = getPaymentHealthScore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <Navbar/>
      {/* <header className="border-b bg-white/90 backdrop-blur-xl shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  EMI Dashboard
                </h1>
                <p className="text-sm text-gray-600">Complete loan management solution</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setHideAmounts(!hideAmounts)}
                className="text-gray-600 hover:text-gray-900"
              >
                {hideAmounts ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCalculatorDialog(true)}
                className="flex items-center space-x-2 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Calculator className="h-4 w-4" />
                <span>Calculator</span>
              </Button>
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center space-x-2 shadow-lg"
              >
                <Plus className="h-4 w-4" />
                <span>Add EMI</span>
              </Button>
            </div>
          </div>
        </div>
      </header> */}

      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Monthly EMI</CardTitle>
                <DollarSign className="h-5 w-5 opacity-75" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold mb-1">{formatAmount(totalMonthlyEMI)}</div>
              <div className="text-sm opacity-75 flex items-center space-x-2">
                <span>{activeEMIs.length} active loan{activeEMIs.length !== 1 ? 's' : ''}</span>
                <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                  {((totalMonthlyEMI / totalLoanAmount) * 100).toFixed(1)}% of principal
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Amount Paid</CardTitle>
                <CheckCircle2 className="h-5 w-5 opacity-75" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold mb-1">{formatAmount(totalPaidAmount)}</div>
              <div className="text-sm opacity-75">
                {((totalPaidAmount / (totalPaidAmount + totalRemainingAmount)) * 100).toFixed(1)}% completed
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Remaining</CardTitle>
                <Target className="h-5 w-5 opacity-75" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold mb-1">{formatAmount(totalRemainingAmount)}</div>
              <div className="text-sm opacity-75">
                {Math.round(activeEMIs.reduce((sum, emi) => sum + getMonthsRemaining(emi), 0) / Math.max(activeEMIs.length, 1))} months avg
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Health Score</CardTitle>
                <Activity className="h-5 w-5 opacity-75" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold mb-1">{paymentHealthScore.toFixed(0)}/100</div>
              <div className="text-sm opacity-75">
                {paymentHealthScore >= 80 ? 'Excellent' : paymentHealthScore >= 60 ? 'Good' : 'Needs Attention'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{formatAmount(totalInterestPaid)}</div>
              <div className="text-sm text-gray-600">Interest Paid</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{avgInterestRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Avg Interest Rate</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{completedEMIs.length}</div>
              <div className="text-sm text-gray-600">Completed Loans</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatAmount(totalLoanAmount + totalInterestPaid)}
              </div>
              <div className="text-sm text-gray-600">Total Payable</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Enhanced Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-lg">
                <TabsTrigger value="overview" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="loans" className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Loans</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Calendar</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <PieChart className="h-5 w-5" />
                        <span>Portfolio Overview</span>
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <EMIChart emis={emis} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Payment Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {emis.map((emi) => {
                          const progress = (emi.paidInstallments / emi.tenureMonths) * 100;
                          return (
                            <div key={emi.id} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium">{emi.loanName}</span>
                                <span>{progress.toFixed(1)}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Interest vs Principal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {emis.map((emi) => {
                          const totalPayable = emi.emiAmount * emi.tenureMonths;
                          const totalInterest = totalPayable - emi.principalAmount;
                          const interestPercentage = (totalInterest / totalPayable) * 100;
                          
                          return (
                            <div key={emi.id} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-sm">{emi.loanName}</span>
                                <span className="text-sm text-gray-600">{interestPercentage.toFixed(1)}% interest</span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <div className="text-gray-600">Principal</div>
                                  <div className="font-semibold">{formatAmount(emi.principalAmount)}</div>
                                </div>
                                <div>
                                  <div className="text-gray-600">Interest</div>
                                  <div className="font-semibold">{formatAmount(totalInterest)}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="loans" className="mt-6">
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Loan Management</CardTitle>
                      <Badge variant="secondary">{emis.length} total loans</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <EMIList 
                      emis={emis} 
                      onUpdate={handleUpdateEMI}
                      onDelete={handleDeleteEMI}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="calendar" className="mt-6">
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Payment Calendar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Payment Calendar</p>
                      <p>Visual calendar view coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Payments */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Upcoming Payments</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingPayments.length > 0 ? (
                  upcomingPayments.map((emi) => (
                    <div key={emi.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-blue-100">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{emi.loanName}</div>
                        <div className="text-xs text-gray-500">{formatAmount(emi.emiAmount)}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant={emi.daysUntilPayment <= 3 ? "destructive" : emi.daysUntilPayment <= 7 ? "default" : "secondary"}>
                          {emi.daysUntilPayment <= 0 ? 'Due Now' : `${emi.daysUntilPayment}d`}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(emi.nextPaymentDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No upcoming payments</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Health */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <Zap className="h-5 w-5" />
                  <span>Financial Health</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Payment Score</span>
                    <span className="font-semibold">{paymentHealthScore.toFixed(0)}/100</span>
                  </div>
                  <Progress 
                    value={paymentHealthScore} 
                    className="h-3"
                  />
                  <div className="text-xs text-gray-600">
                    {paymentHealthScore >= 80 ? '🎉 Excellent payment history!' : 
                     paymentHealthScore >= 60 ? '👍 Good payment discipline' : 
                     '⚠️ Consider improving payment timing'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{activeEMIs.length}</div>
                    <div className="text-xs text-gray-600">Active Loans</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{completedEMIs.length}</div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New EMI
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCalculatorDialog(true)}
                  className="w-full"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  EMI Calculator
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddEMIDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onAdd={handleAddEMI}
      />
      
      <EMICalculatorDialog 
        open={showCalculatorDialog}
        onOpenChange={setShowCalculatorDialog}
      />
    </div>
  );
}