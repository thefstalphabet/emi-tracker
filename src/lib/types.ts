export interface EMI {
  id: string;
  loanName: string;
  loanType: 'Home Loan' | 'Car Loan' | 'Personal Loan' | 'Education Loan' | 'Business Loan' | 'Other';
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  emiAmount: number;
  startDate: string;
  status: 'Active' | 'Completed' | 'Defaulted';
  paidInstallments: number;
  remainingAmount: number;
  totalPayable: number;
  nextPaymentDate: string;
  bankName: string;
  accountNumber?: string;
}

export interface Payment {
  id: string;
  emiId: string;
  amount: number;
  paymentDate: string;
  principalAmount: number;
  interestAmount: number;
  remainingBalance: number;
}

export interface EMICalculation {
  emiAmount: number;
  totalPayable: number;
  totalInterest: number;
  monthlySchedule: {
    month: number;
    emi: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}