'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EMI } from '@/lib/types';
import { calculateEMI, getNextPaymentDate } from '@/lib/emi-utils';
import { loadEMIs, saveEMIs } from '@/lib/storage';
import { ArrowLeft, Calculator, Save } from 'lucide-react';
import Link from 'next/link';

export default function AddEMIPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    loanName: '',
    loanType: 'Personal Loan' as EMI['loanType'],
    principalAmount: '',
    interestRate: '',
    tenureMonths: '',
    startDate: '',
    bankName: '',
    accountNumber: '',
    paidInstallments: '0'
  });

  const [calculatedEMI, setCalculatedEMI] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Calculate EMI automatically when all required fields are filled
    if (newFormData.principalAmount && newFormData.interestRate && newFormData.tenureMonths) {
      const emi = calculateEMI(
        parseFloat(newFormData.principalAmount),
        parseFloat(newFormData.interestRate),
        parseInt(newFormData.tenureMonths)
      );
      setCalculatedEMI(emi);
    } else {
      setCalculatedEMI(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!calculatedEMI || !formData.loanName || !formData.startDate) return;

    setIsSubmitting(true);

    try {
      const principalAmount = parseFloat(formData.principalAmount);
      const interestRate = parseFloat(formData.interestRate);
      const tenureMonths = parseInt(formData.tenureMonths);
      const paidInstallments = parseInt(formData.paidInstallments);
      
      const totalPayable = calculatedEMI * tenureMonths;
      const remainingInstallments = tenureMonths - paidInstallments;
      const remainingAmount = remainingInstallments * calculatedEMI;

      const newEMI: EMI = {
        id: Date.now().toString(),
        loanName: formData.loanName,
        loanType: formData.loanType,
        principalAmount,
        interestRate,
        tenureMonths,
        emiAmount: calculatedEMI,
        startDate: formData.startDate,
        status: remainingInstallments > 0 ? 'Active' : 'Completed',
        paidInstallments,
        remainingAmount,
        totalPayable,
        nextPaymentDate: getNextPaymentDate(formData.startDate, paidInstallments),
        bankName: formData.bankName,
        accountNumber: formData.accountNumber
      };

      const existingEMIs = loadEMIs();
      const updatedEMIs = [...existingEMIs, newEMI];
      saveEMIs(updatedEMIs);

      // Redirect to EMIs page
      router.push('/dashboard/emis');
    } catch (error) {
      console.error('Error adding EMI:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/emis">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to EMIs
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New EMI</h1>
          <p className="text-gray-600">Enter your loan details to start tracking</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loanName">Loan Name *</Label>
                <Input
                  id="loanName"
                  value={formData.loanName}
                  onChange={(e) => handleInputChange('loanName', e.target.value)}
                  placeholder="e.g., Home Loan - Dream House"
                  required
                />
              </div>
              <div>
                <Label htmlFor="loanType">Loan Type</Label>
                <Select 
                  value={formData.loanType} 
                  onValueChange={(value) => handleInputChange('loanType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home Loan">Home Loan</SelectItem>
                    <SelectItem value="Car Loan">Car Loan</SelectItem>
                    <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                    <SelectItem value="Education Loan">Education Loan</SelectItem>
                    <SelectItem value="Business Loan">Business Loan</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  placeholder="e.g., HDFC Bank"
                />
              </div>
              <div>
                <Label htmlFor="accountNumber">Account Number (Optional)</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  placeholder="Last 4 digits for reference"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Details */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Financial Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="principalAmount">Principal Amount (₹) *</Label>
                <Input
                  id="principalAmount"
                  type="number"
                  value={formData.principalAmount}
                  onChange={(e) => handleInputChange('principalAmount', e.target.value)}
                  placeholder="e.g., 500000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="interestRate">Interest Rate (% p.a.) *</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={(e) => handleInputChange('interestRate', e.target.value)}
                  placeholder="e.g., 8.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="tenureMonths">Tenure (Months) *</Label>
                <Input
                  id="tenureMonths"
                  type="number"
                  value={formData.tenureMonths}
                  onChange={(e) => handleInputChange('tenureMonths', e.target.value)}
                  placeholder="e.g., 240"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Loan Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="paidInstallments">Installments Already Paid</Label>
                <Input
                  id="paidInstallments"
                  type="number"
                  value={formData.paidInstallments}
                  onChange={(e) => handleInputChange('paidInstallments', e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* EMI Preview */}
        {calculatedEMI && (
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800 flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>EMI Calculation Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-blue-600">
                    ₹{calculatedEMI.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-600 mt-1">Monthly EMI</div>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-green-600">
                    ₹{(calculatedEMI * parseInt(formData.tenureMonths || '0')).toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600 mt-1">Total Payable</div>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-orange-600">
                    ₹{((calculatedEMI * parseInt(formData.tenureMonths || '0')) - parseFloat(formData.principalAmount || '0')).toLocaleString()}
                  </div>
                  <div className="text-sm text-orange-600 mt-1">Total Interest</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white/70 rounded-xl">
                <h3 className="font-semibold mb-2 text-gray-800">Summary:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>Principal Amount: ₹{parseFloat(formData.principalAmount || '0').toLocaleString()}</div>
                  <div>Interest Rate: {formData.interestRate}% per annum</div>
                  <div>Loan Tenure: {formData.tenureMonths} months ({Math.round(parseInt(formData.tenureMonths || '0') / 12)} years)</div>
                  <div>Interest to Principal Ratio: {calculatedEMI && formData.principalAmount ? (((calculatedEMI * parseInt(formData.tenureMonths || '0')) - parseFloat(formData.principalAmount)) / parseFloat(formData.principalAmount) * 100).toFixed(1) : 0}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <Link href="/dashboard/emis">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button 
            type="submit" 
            disabled={!calculatedEMI || !formData.loanName || !formData.startDate || isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Adding EMI...' : 'Add EMI'}
          </Button>
        </div>
      </form>
    </div>
  );
}