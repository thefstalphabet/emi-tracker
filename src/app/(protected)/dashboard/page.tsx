'use client';

import { useState, useEffect } from 'react';
import { Plus, TrendingUp, CreditCard, AlertCircle, CheckCircle2, DollarSign, Target, Clock, Activity, Zap, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EMI } from '@/lib/types';
import { loadEMIs } from '@/lib/storage';
import { formatCurrency, getTotalMonthlyEMI, getMonthsRemaining, getRemainingAmount } from '@/lib/emi-utils';
import Link from 'next/link';

export default function DashboardOverview() {
  const [emis, setEmis] = useState<EMI[]>([]);
  const [hideAmounts, setHideAmounts] = useState(false);

  useEffect(() => {
    setEmis(loadEMIs());
  }, []);

  const activeEMIs = emis.filter(emi => emi.status === 'Active');
  const totalMonthlyEMI = getTotalMonthlyEMI(emis);
  const totalRemainingAmount = emis.reduce((sum, emi) => sum + getRemainingAmount(emi), 0);
  const totalPaidThisMonth = activeEMIs.reduce((sum, emi) => {
    const today = new Date();
    const paymentDate = new Date(emi.nextPaymentDate);
    const isThisMonth = paymentDate.getMonth() === today.getMonth() && 
                       paymentDate.getFullYear() === today.getFullYear();
    return sum + (isThisMonth ? emi.emiAmount : 0);
  }, 0);

  const upcomingPayments = activeEMIs
    .map(emi => ({
      ...emi,
      daysUntilPayment: Math.ceil(
        (new Date(emi.nextPaymentDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
    }))
    .sort((a, b) => a.daysUntilPayment - b.daysUntilPayment)
    .slice(0, 3);

  const formatAmount = (amount: number) => {
    return hideAmounts ? '₹ ****' : formatCurrency(amount);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
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
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, John! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's your financial overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
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
          <Link href="/dashboard/add-emi">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Add EMI
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div className="text-sm opacity-75">
              {activeEMIs.length} active loan{activeEMIs.length !== 1 ? 's' : ''}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium opacity-90">Paid This Month</CardTitle>
              <CheckCircle2 className="h-5 w-5 opacity-75" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold mb-1">{formatAmount(totalPaidThisMonth)}</div>
            <div className="text-sm opacity-75">Current month payments</div>
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
            <div className="text-sm opacity-75">Total outstanding</div>
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Upcoming EMIs */}
        <div className="xl:col-span-2">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Upcoming EMI Payments</span>
                </CardTitle>
                <Link href="/dashboard/emis">
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingPayments.length > 0 ? (
                upcomingPayments.map((emi) => (
                  <div key={emi.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{emi.loanName}</div>
                        <div className="text-sm text-gray-600">{emi.bankName}</div>
                        <div className="text-sm font-medium text-blue-600">{formatAmount(emi.emiAmount)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={emi.daysUntilPayment <= 3 ? "destructive" : emi.daysUntilPayment <= 7 ? "default" : "secondary"}>
                        {emi.daysUntilPayment <= 0 ? 'Due Now' : `${emi.daysUntilPayment} days`}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(emi.nextPaymentDate).toLocaleDateString()}
                      </div>
                      <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Mark Paid
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No Upcoming Payments</p>
                  <p>All your EMIs are up to date!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Insights */}
        <div className="space-y-6">
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
                <Progress value={paymentHealthScore} className="h-3" />
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
                  <div className="text-lg font-bold text-blue-600">
                    {Math.round(activeEMIs.reduce((sum, emi) => sum + getMonthsRemaining(emi), 0) / Math.max(activeEMIs.length, 1))}
                  </div>
                  <div className="text-xs text-gray-600">Avg Months Left</div>
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
              <Link href="/dashboard/add-emi">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New EMI
                </Button>
              </Link>
              <Link href="/dashboard/calculator">
                <Button variant="outline" className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  EMI Calculator
                </Button>
              </Link>
              <Link href="/dashboard/analytics">
                <Button variant="outline" className="w-full">
                  <Activity className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-50 to-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-800">
                <AlertCircle className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-white rounded-lg border border-amber-200">
                <div className="text-sm font-medium text-amber-800">Payment Reminder</div>
                <div className="text-xs text-amber-600 mt-1">Car Loan EMI due in 2 days</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-800">Tip</div>
                <div className="text-xs text-blue-600 mt-1">Consider prepaying high-interest loans first</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}