'use client';

import { useState } from 'react';
import { EMI } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Calendar, 
  CreditCard, 
  TrendingUp,
  AlertTriangle,
  CheckCircle2 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { formatCurrency, getMonthsRemaining } from '@/lib/emi-utils';

interface EMIListProps {
  emis: EMI[];
  onUpdate: (id: string, updates: Partial<EMI>) => void;
  onDelete: (id: string) => void;
}

export function EMIList({ emis, onUpdate, onDelete }: EMIListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [emiToDelete, setEmiToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setEmiToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (emiToDelete) {
      onDelete(emiToDelete);
      setEmiToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleMarkPaid = (emi: EMI) => {
    const newPaidInstallments = emi.paidInstallments + 1;
    const remainingInstallments = emi.tenureMonths - newPaidInstallments;
    const remainingAmount = remainingInstallments * emi.emiAmount;
    
    onUpdate(emi.id, {
      paidInstallments: newPaidInstallments,
      remainingAmount,
      status: remainingInstallments <= 0 ? 'Completed' : 'Active',
      nextPaymentDate: remainingInstallments > 0 
        ? new Date(new Date(emi.nextPaymentDate).setMonth(new Date(emi.nextPaymentDate).getMonth() + 1)).toISOString().split('T')[0]
        : emi.nextPaymentDate
    });
  };

  const getStatusColor = (status: EMI['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Defaulted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLoanTypeIcon = (loanType: EMI['loanType']) => {
    switch (loanType) {
      case 'Home Loan': return '🏠';
      case 'Car Loan': return '🚗';
      case 'Personal Loan': return '👤';
      case 'Education Loan': return '🎓';
      case 'Business Loan': return '💼';
      default: return '💳';
    }
  };

  if (emis.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No EMIs Added Yet</h3>
        <p className="text-sm">Click "Add EMI" to start tracking your loans</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {emis.map((emi) => {
          const monthsRemaining = getMonthsRemaining(emi);
          const paymentProgress = (emi.paidInstallments / emi.tenureMonths) * 100;
          const isOverdue = new Date(emi.nextPaymentDate) < new Date() && emi.status === 'Active';
          
          return (
            <Card key={emi.id} className={`transition-all duration-200 hover:shadow-md ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getLoanTypeIcon(emi.loanType)}</div>
                    <div>
                      <CardTitle className="text-lg">{emi.loanName}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {emi.loanType}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(emi.status)}`}>
                          {emi.status}
                        </Badge>
                        {isOverdue && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Overdue
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {emi.status === 'Active' && (
                        <DropdownMenuItem onClick={() => handleMarkPaid(emi)}>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark as Paid
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(emi.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete EMI
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-semibold text-blue-600">
                      {formatCurrency(emi.emiAmount)}
                    </div>
                    <div className="text-xs text-blue-600">Monthly EMI</div>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-semibold text-green-600">
                      {formatCurrency(emi.paidInstallments * emi.emiAmount)}
                    </div>
                    <div className="text-xs text-green-600">Amount Paid</div>
                  </div>
                  
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-lg font-semibold text-orange-600">
                      {formatCurrency(emi.remainingAmount)}
                    </div>
                    <div className="text-xs text-orange-600">Remaining</div>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-semibold text-purple-600">
                      {monthsRemaining}
                    </div>
                    <div className="text-xs text-purple-600">Months Left</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Payment Progress</span>
                    <span>{paymentProgress.toFixed(1)}% Complete</span>
                  </div>
                  <Progress value={paymentProgress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{emi.paidInstallments} / {emi.tenureMonths} payments</span>
                    <span>{formatCurrency(emi.totalPayable)} total</span>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Next: {new Date(emi.nextPaymentDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{emi.interestRate}% interest</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{emi.bankName}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete EMI</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this EMI? This action cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}