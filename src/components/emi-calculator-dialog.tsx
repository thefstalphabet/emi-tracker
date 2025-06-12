'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateEMIDetails } from '@/lib/emi-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EMICalculatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EMICalculatorDialog({ open, onOpenChange }: EMICalculatorDialogProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>EMI Calculator</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="calc-principal">Principal Amount (₹)</Label>
                  <Input
                    id="calc-principal"
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                    placeholder="e.g., 500000"
                  />
                </div>
                <div>
                  <Label htmlFor="calc-rate">Interest Rate (% p.a.)</Label>
                  <Input
                    id="calc-rate"
                    type="number"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="e.g., 8.5"
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
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button 
                  onClick={handleCalculate}
                  disabled={!principal || !rate || !tenure}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Calculate EMI
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {result && (
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="schedule">Payment Schedule</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">EMI Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600">
                          ₹{result.emiAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-blue-600 mt-1">Monthly EMI</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-3xl font-bold text-green-600">
                          ₹{result.totalPayable.toLocaleString()}
                        </div>
                        <div className="text-sm text-green-600 mt-1">Total Amount</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-3xl font-bold text-orange-600">
                          ₹{result.totalInterest.toLocaleString()}
                        </div>
                        <div className="text-sm text-orange-600 mt-1">Total Interest</div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Breakdown:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>Principal Amount: ₹{parseFloat(principal).toLocaleString()}</div>
                        <div>Interest Rate: {rate}% per annum</div>
                        <div>Loan Tenure: {tenure} months ({Math.round(parseInt(tenure) / 12)} years)</div>
                        <div>Interest to Principal Ratio: {((result.totalInterest / parseFloat(principal)) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="schedule">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Schedule (First 12 months)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Month</th>
                            <th className="text-right p-2">EMI</th>
                            <th className="text-right p-2">Principal</th>
                            <th className="text-right p-2">Interest</th>
                            <th className="text-right p-2">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.monthlySchedule.slice(0, 12).map((month) => (
                            <tr key={month.month} className="border-b">
                              <td className="p-2">{month.month}</td>
                              <td className="text-right p-2">₹{month.emi.toLocaleString()}</td>
                              <td className="text-right p-2">₹{month.principal.toLocaleString()}</td>
                              <td className="text-right p-2">₹{month.interest.toLocaleString()}</td>
                              <td className="text-right p-2">₹{month.balance.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {result.monthlySchedule.length > 12 && (
                      <div className="text-center mt-4 text-sm text-gray-500">
                        Showing first 12 months of {result.monthlySchedule.length} total payments
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}