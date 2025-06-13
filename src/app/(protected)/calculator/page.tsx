'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { calculateEMIDetails } from '@/lib/emi-utils';
import { Calculator, RotateCcw, TrendingUp, PieChart } from 'lucide-react';

export default function CalculatorPage() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calculateEMIDetails> | null>(null);

  const handleCalculate = () => {
    if (!principal || !rate || !tenure) return;
    
    const calculation = calculateEMIDetails(
      parseFloat(principal),
      parseFloat(rate),
      parseInt(tenure)
    );
    setResult(calculation);
  };

  const handleReset = () => {
    setPrincipal('');
    setRate('');
    setTenure('');
    setResult(null);
  };

  // Preset loan scenarios
  const presets = [
    { name: 'Home Loan', principal: '2500000', rate: '8.5', tenure: '240' },
    { name: 'Car Loan', principal: '800000', rate: '10.5', tenure: '60' },
    { name: 'Personal Loan', principal: '300000', rate: '14.0', tenure: '36' },
    { name: 'Education Loan', principal: '1000000', rate: '9.5', tenure: '120' }
  ];

  const handlePreset = (preset: typeof presets[0]) => {
    setPrincipal(preset.principal);
    setRate(preset.rate);
    setTenure(preset.tenure);
    setResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">EMI Calculator</h1>
        <p className="text-gray-600">Calculate your loan EMI and get detailed payment breakdown</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Input */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Loan Parameters</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="calc-principal">Principal Amount (₹)</Label>
                <Input
                  id="calc-principal"
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="e.g., 500000"
                  className="text-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="calc-rate">Interest Rate (% per annum)</Label>
                <Input
                  id="calc-rate"
                  type="number"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="e.g., 8.5"
                  className="text-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="calc-tenure">Tenure (Months)</Label>
                <Input
                  id="calc-tenure"
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  placeholder="e.g., 240"
                  className="text-lg"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {tenure && `${Math.round(parseInt(tenure) / 12)} years`}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button 
                  onClick={handleCalculate}
                  disabled={!principal || !rate || !tenure}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate EMI
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preset Scenarios */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="text-purple-800">Quick Presets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {presets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    onClick={() => handlePreset(preset)}
                    className="h-auto p-3 flex flex-col items-start border-purple-200 hover:bg-purple-100"
                  >
                    <div className="font-medium text-sm">{preset.name}</div>
                    <div className="text-xs text-gray-600">
                      ₹{parseInt(preset.principal).toLocaleString()} @ {preset.rate}%
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-4">
                <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold mb-2">
                      ₹{result.emiAmount.toLocaleString()}
                    </div>
                    <div className="text-blue-100">Monthly EMI</div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">
                        ₹{result.totalPayable.toLocaleString()}
                      </div>
                      <div className="text-green-100 text-sm">Total Amount</div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">
                        ₹{result.totalInterest.toLocaleString()}
                      </div>
                      <div className="text-orange-100 text-sm">Total Interest</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Detailed Analysis */}
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary">
                  <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <PieChart className="h-5 w-5" />
                        <span>Loan Breakdown</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-gray-600">Principal Amount</div>
                          <div className="font-semibold text-lg">₹{parseFloat(principal).toLocaleString()}</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="text-gray-600">Interest Rate</div>
                          <div className="font-semibold text-lg">{rate}% p.a.</div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <div className="text-gray-600">Loan Tenure</div>
                          <div className="font-semibold text-lg">{tenure} months</div>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <div className="text-gray-600">Interest Ratio</div>
                          <div className="font-semibold text-lg">
                            {((result.totalInterest / parseFloat(principal)) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Principal vs Interest</span>
                          <span className="text-sm text-gray-600">
                            {((parseFloat(principal) / result.totalPayable) * 100).toFixed(1)}% : {((result.totalInterest / result.totalPayable) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600" 
                            style={{ width: `${(parseFloat(principal) / result.totalPayable) * 100}%` }}
                          />
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-red-500" 
                            style={{ width: `${(result.totalInterest / result.totalPayable) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Principal: ₹{parseFloat(principal).toLocaleString()}</span>
                          <span>Interest: ₹{result.totalInterest.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="schedule">
                  <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>Payment Schedule</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="text-left p-3 font-medium">Month</th>
                              <th className="text-right p-3 font-medium">EMI</th>
                              <th className="text-right p-3 font-medium">Principal</th>
                              <th className="text-right p-3 font-medium">Interest</th>
                              <th className="text-right p-3 font-medium">Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.monthlySchedule.slice(0, 12).map((month) => (
                              <tr key={month.month} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{month.month}</td>
                                <td className="text-right p-3">₹{month.emi.toLocaleString()}</td>
                                <td className="text-right p-3 text-blue-600">₹{month.principal.toLocaleString()}</td>
                                <td className="text-right p-3 text-orange-600">₹{month.interest.toLocaleString()}</td>
                                <td className="text-right p-3 text-gray-600">₹{month.balance.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {result.monthlySchedule.length > 12 && (
                        <div className="text-center mt-4 text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                          Showing first 12 months of {result.monthlySchedule.length} total payments
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-50 to-blue-50">
              <CardContent className="p-12 text-center">
                <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to Calculate</h3>
                <p className="text-gray-500">Enter your loan details to see EMI breakdown and payment schedule</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}