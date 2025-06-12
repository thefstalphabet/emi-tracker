import { EMI, Payment } from './types';

const EMI_STORAGE_KEY = 'emi-tracker-emis';
const PAYMENTS_STORAGE_KEY = 'emi-tracker-payments';

export function saveEMIs(emis: EMI[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(EMI_STORAGE_KEY, JSON.stringify(emis));
  }
}

export function loadEMIs(): EMI[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(EMI_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  return [];
}

export function savePayments(payments: Payment[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
  }
}

export function loadPayments(): Payment[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  return [];
}

// Sample data for demonstration
export function initializeSampleData(): void {
  const existingEMIs = loadEMIs();
  if (existingEMIs.length === 0) {
    const sampleEMIs: EMI[] = [
      {
        id: '1',
        loanName: 'Dream Home Loan',
        loanType: 'Home Loan',
        principalAmount: 2500000,
        interestRate: 8.5,
        tenureMonths: 240,
        emiAmount: 25093,
        startDate: '2023-01-01',
        status: 'Active',
        paidInstallments: 12,
        remainingAmount: 2400000,
        totalPayable: 6022320,
        nextPaymentDate: '2024-01-01',
        bankName: 'HDFC Bank',
        accountNumber: 'XXXX1234'
      },
      {
        id: '2',
        loanName: 'Car Loan - Honda City',
        loanType: 'Car Loan',
        principalAmount: 800000,
        interestRate: 10.5,
        tenureMonths: 60,
        emiAmount: 17124,
        startDate: '2023-06-01',
        status: 'Active',
        paidInstallments: 6,
        remainingAmount: 750000,
        totalPayable: 1027440,
        nextPaymentDate: '2023-12-01',
        bankName: 'ICICI Bank',
        accountNumber: 'XXXX5678'
      },
      {
        id: '3',
        loanName: 'Business Expansion',
        loanType: 'Business Loan',
        principalAmount: 500000,
        interestRate: 12.0,
        tenureMonths: 36,
        emiAmount: 16607,
        startDate: '2023-03-01',
        status: 'Active',
        paidInstallments: 9,
        remainingAmount: 400000,
        totalPayable: 597852,
        nextPaymentDate: '2023-12-01',
        bankName: 'Axis Bank',
        accountNumber: 'XXXX9012'
      }
    ];
    saveEMIs(sampleEMIs);
  }
}