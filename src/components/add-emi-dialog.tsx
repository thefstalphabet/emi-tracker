'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EMI } from '@/lib/types';
import { calculateEMI, getNextPaymentDate } from '@/lib/emi-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AddEMIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (emi: Omit<EMI, 'id'>) => void;
}

export function AddEMIDialog({ open, onOpenChange, onAdd }: AddEMIDialogProps) {
  
  const [formData, setFormData] = useState({
    loanName: '',
    loanType: 'Personal Loan' as EMI['loanType'],
    principalAmount: '',
    interestRate: '0',
    tenureMonths: '',
    startDate: '',
    bankName: '',
    accountNumber: '',
    paidInstallments: '0'
  });
  
  console.log(formData);
  const [calculatedEMI, setCalculatedEMI] = useState<number | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!calculatedEMI || !formData.loanName || !formData.startDate) return;

    const principalAmount = parseFloat(formData.principalAmount);
    const interestRate = parseFloat(formData.interestRate);
    const tenureMonths = parseInt(formData.tenureMonths);
    const paidInstallments = parseInt(formData.paidInstallments);
    
    const totalPayable = calculatedEMI * tenureMonths;
    const remainingInstallments = tenureMonths - paidInstallments;
    const remainingAmount = remainingInstallments * calculatedEMI;

    const newEMI: Omit<EMI, 'id'> = {
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

    onAdd(newEMI);
    
    // Reset form
    setFormData({
      loanName: '',
      loanType: 'Personal Loan',
      principalAmount: '',
      interestRate: '',
      tenureMonths: '',
      startDate: '',
      bankName: '',
      accountNumber: '',
      paidInstallments: '0'
    });
    setCalculatedEMI(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New EMI/Loan</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
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
          <Card>
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
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">EMI Calculation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      ₹{calculatedEMI.toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-600">Monthly EMI</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      ₹{(calculatedEMI * parseInt(formData.tenureMonths || '0')).toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600">Total Payable</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      ₹{((calculatedEMI * parseInt(formData.tenureMonths || '0')) - parseFloat(formData.principalAmount || '0')).toLocaleString()}
                    </div>
                    <div className="text-sm text-orange-600">Total Interest</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!calculatedEMI || !formData.loanName || !formData.startDate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add EMI
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}