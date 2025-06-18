'use client';

import { useState, useEffect } from 'react';
import { EMI } from '@/lib/types';
import { loadEMIs } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { EMIChart } from '@/components/emi-chart';
import { formatCurrency, getMonthsRemaining, getRemainingAmount } from '@/lib/emi-utils';
import { 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  Calendar,
  Target,
  Clock,
  DollarSign,
  Activity
} from 'lucide-react';

export default function AnalyticsPage() {
  const [emis, setEmis] = useState<EMI[]>([]);

  useEffect(() => {
    setEmis(loadEMIs());
  }, []);

  const activeEMIs = emis.filter(emi => emi.status === 'Active');
  const completedEMIs = emis.filter(emi => emi.status === 'Completed');
  
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

  const totalMonthsRemaining = activeEMIs.reduce((sum, emi) => sum + getMonthsRemaining(emi), 0);
  const avgMonthsRemaining = activeEMIs.length > 0 ? totalMonthsRemaining / activeEMIs.length : 0;

  // Loan type distribution
  const loanTypeDistribution = emis.reduce((acc, emi) => {
    const existing = acc.find(item => item.type === emi.loanType);
    if (existing) {
      existing.amount += emi.principalAmount;
      existing.count += 1;
      existing.monthlyEMI += emi.emiAmount;
    } else {
      acc.push({
        type: emi.loanType,
        amount: emi.principalAmount,
        count: 1,
        monthlyEMI: emi.emiAmount
      });
    }
    return acc;
  }, [] as { type: string; amount: number; count: number; monthlyEMI: number }[]);

  // Monthly payment trend (simulated data for demonstration)
  const monthlyTrend = Array.from({ length: 12 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (11 - i));
    return {
      month: month.toLocaleDateString('en-US', { month: 'short' }),
      paid: Math.floor(Math.random() * 50000) + 30000,
      target: 45000
    };
  });

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Loan Amount</p>
                <p className="text-3xl font-bold">{formatCurrency(totalLoanAmount)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-600 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Amount Paid</p>
                <p className="text-3xl font-bold">{formatCurrency(totalPaidAmount)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-600 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Interest Paid</p>
                <p className="text-3xl font-bold">{formatCurrency(totalInterestPaid)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Avg. Months Left</p>
                <p className="text-3xl font-bold">{Math.round(avgMonthsRemaining)}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-lg">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <PieChart className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Trends</span>
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Breakdown</span>
          </TabsTrigger>
          <TabsTrigger value="projections" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Projections</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>Portfolio Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EMIChart emis={emis} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Payment Progress</CardTitle>
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
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{emi.paidInstallments} / {emi.tenureMonths} payments</span>
                          <span>{getMonthsRemaining(emi)} months left</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Loan Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loanTypeDistribution.map((item, index) => (
                    <div key={item.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${
                          index === 0 ? 'from-blue-500 to-blue-600' :
                          index === 1 ? 'from-green-500 to-green-600' :
                          index === 2 ? 'from-orange-500 to-orange-600' :
                          'from-purple-500 to-purple-600'
                        }`} />
                        <div>
                          <div className="font-medium text-sm">{item.type}</div>
                          <div className="text-xs text-gray-500">{item.count} loan{item.count > 1 ? 's' : ''}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm">{formatCurrency(item.amount)}</div>
                        <div className="text-xs text-gray-500">{formatCurrency(item.monthlyEMI)}/mo</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6 mt-6">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Interest vs Principal Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {emis.map((emi) => {
                  const totalPayable = emi.emiAmount * emi.tenureMonths;
                  const totalInterest = totalPayable - emi.principalAmount;
                  const interestPercentage = (totalInterest / totalPayable) * 100;
                  const principalPercentage = (emi.principalAmount / totalPayable) * 100;
                  
                  return (
                    <div key={emi.id} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-blue-100">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{emi.loanName}</h3>
                          <p className="text-sm text-gray-600">{emi.bankName} • {emi.interestRate}% interest</p>
                        </div>
                        <Badge variant="secondary">
                          {interestPercentage.toFixed(1)}% interest cost
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{formatCurrency(emi.principalAmount)}</div>
                          <div className="text-xs text-gray-600">Principal ({principalPercentage.toFixed(1)}%)</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-lg font-bold text-orange-600">{formatCurrency(totalInterest)}</div>
                          <div className="text-xs text-gray-600">Interest ({interestPercentage.toFixed(1)}%)</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-lg font-bold text-green-600">{formatCurrency(totalPayable)}</div>
                          <div className="text-xs text-gray-600">Total Payable</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Principal</span>
                          <span>Interest</span>
                        </div>
                        <div className="flex h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600" 
                            style={{ width: `${principalPercentage}%` }}
                          />
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-orange-600" 
                            style={{ width: `${interestPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projections" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-green-800">Debt-Free Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {Math.round(avgMonthsRemaining)} months
                    </div>
                    <div className="text-sm text-green-700">Average time to debt freedom</div>
                  </div>
                  
                  <div className="space-y-3">
                    {activeEMIs.slice(0, 3).map((emi) => (
                      <div key={emi.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="font-medium text-sm">{emi.loanName}</span>
                        <Badge variant="outline" className="text-green-700 border-green-300">
                          {getMonthsRemaining(emi)} months
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-blue-800">Financial Health Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">85/100</div>
                    <div className="text-sm text-blue-700">Excellent financial discipline</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Payment History</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={90} className="w-20 h-2" />
                        <span className="text-sm font-medium">90%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Debt Utilization</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={75} className="w-20 h-2" />
                        <span className="text-sm font-medium">75%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Diversification</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={85} className="w-20 h-2" />
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}