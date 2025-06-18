'use client';

import { useState, useEffect } from 'react';
import { EMI } from '@/lib/types';
import { loadEMIs, saveEMIs } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Download } from 'lucide-react';
import Link from 'next/link';
import { EMIList } from '@/components/ui/emi-list';

export default function MyEMIsPage() {
  const [emis, setEmis] = useState<EMI[]>([]);
  const [filteredEMIs, setFilteredEMIs] = useState<EMI[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('nextPayment');

  useEffect(() => {
    const loadedEMIs = loadEMIs();
    setEmis(loadedEMIs);
    setFilteredEMIs(loadedEMIs);
  }, []);

  useEffect(() => {
    let filtered = [...emis];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(emi => 
        emi.loanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emi.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emi.loanType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(emi => emi.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(emi => emi.loanType === typeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'nextPayment':
          return new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime();
        case 'emiAmount':
          return b.emiAmount - a.emiAmount;
        case 'remainingAmount':
          return b.remainingAmount - a.remainingAmount;
        case 'loanName':
          return a.loanName.localeCompare(b.loanName);
        default:
          return 0;
      }
    });

    setFilteredEMIs(filtered);
  }, [emis, searchTerm, statusFilter, typeFilter, sortBy]);

  const handleUpdateEMI = (id: string, updates: Partial<EMI>) => {
    const updatedEMIs = emis.map(emi => 
      emi.id === id ? { ...emi, ...updates } : emi
    );
    setEmis(updatedEMIs);
    saveEMIs(updatedEMIs);
  };

  const handleDeleteEMI = (id: string) => {
    const updatedEMIs = emis.filter(emi => emi.id !== id);
    setEmis(updatedEMIs);
    saveEMIs(updatedEMIs);
  };

  const activeEMIs = emis.filter(emi => emi.status === 'Active');
  const completedEMIs = emis.filter(emi => emi.status === 'Completed');
  const totalMonthlyEMI = activeEMIs.reduce((sum, emi) => sum + emi.emiAmount, 0);

  const loanTypes = [...new Set(emis.map(emi => emi.loanType))];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{emis.length}</div>
            <div className="text-sm text-blue-600">Total EMIs</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{activeEMIs.length}</div>
            <div className="text-sm text-green-600">Active EMIs</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{completedEMIs.length}</div>
            <div className="text-sm text-purple-600">Completed</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              ₹{totalMonthlyEMI.toLocaleString()}
            </div>
            <div className="text-sm text-orange-600">Monthly Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <span>Manage EMIs</span>
              <Badge variant="secondary">{filteredEMIs.length} of {emis.length}</Badge>
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Link href="/dashboard/add-emi">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add EMI
                </Button>
              </Link>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search EMIs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Defaulted">Defaulted</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Loan Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {loanTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nextPayment">Next Payment</SelectItem>
                <SelectItem value="emiAmount">EMI Amount</SelectItem>
                <SelectItem value="remainingAmount">Remaining Amount</SelectItem>
                <SelectItem value="loanName">Loan Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* EMI List */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <EMIList 
            emis={filteredEMIs} 
            onUpdate={handleUpdateEMI}
            onDelete={handleDeleteEMI}
          />
        </CardContent>
      </Card>
    </div>
  );
}