import { EMI, EMICalculation } from './types';

export function calculateEMI(principal: number, rate: number, tenure: number): number {
  const monthlyRate = rate / (12 * 100);

  if (monthlyRate === 0) {
    return Math.round(principal / tenure); // Simple equal monthly division
  }

  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
              (Math.pow(1 + monthlyRate, tenure) - 1);

  return Math.round(emi);
}


export function calculateEMIDetails(principal: number, rate: number, tenure: number): EMICalculation {
  const emi = calculateEMI(principal, rate, tenure);
  const totalPayable = emi * tenure;
  const totalInterest = totalPayable - principal;
  
  const monthlySchedule = [];
  let remainingBalance = principal;
  
  for (let month = 1; month <= tenure; month++) {
    const monthlyRate = rate / (12 * 100);
    const interestAmount = remainingBalance * monthlyRate;
    const principalAmount = emi - interestAmount;
    remainingBalance -= principalAmount;
    
    monthlySchedule.push({
      month,
      emi,
      principal: Math.round(principalAmount),
      interest: Math.round(interestAmount),
      balance: Math.max(0, Math.round(remainingBalance))
    });
  }
  
  return {
    emiAmount: emi,
    totalPayable: Math.round(totalPayable),
    totalInterest: Math.round(totalInterest),
    monthlySchedule
  };
}

export function getNextPaymentDate(startDate: string, paidInstallments: number): string {
  const start = new Date(startDate);
  const nextPayment = new Date(start);
  nextPayment.setMonth(start.getMonth() + paidInstallments + 1);
  return nextPayment.toISOString().split('T')[0];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function getMonthsRemaining(emi: EMI): number {
  return emi.tenureMonths - emi.paidInstallments;
}

export function getRemainingAmount(emi: EMI): number {
  const monthsRemaining = getMonthsRemaining(emi);
  return monthsRemaining * emi.emiAmount;
}

export function getTotalMonthlyEMI(emis: EMI[]): number {
  return emis
    .filter(emi => emi.status === 'Active')
    .reduce((total, emi) => total + emi.emiAmount, 0);
}