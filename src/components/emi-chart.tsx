'use client';

import { EMI } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface EMIChartProps {
  emis: EMI[];
}

export function EMIChart({ emis }: EMIChartProps) {
  // Data for loan type distribution
  const loanTypeData = emis.reduce((acc, emi) => {
    const existing = acc.find(item => item.name === emi.loanType);
    if (existing) {
      existing.value += emi.emiAmount;
      existing.count += 1;
    } else {
      acc.push({
        name: emi.loanType,
        value: emi.emiAmount,
        count: 1
      });
    }
    return acc;
  }, [] as { name: string; value: number; count: number }[]);

  // Data for monthly EMI comparison
  const monthlyEMIData = emis.map(emi => ({
    name: emi.loanName.length > 15 ? emi.loanName.substring(0, 15) + '...' : emi.loanName,
    emi: emi.emiAmount,
    remaining: emi.remainingAmount,
    paid: emi.paidInstallments * emi.emiAmount
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: ₹{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (emis.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-4">📊</div>
        <p>No EMI data to display</p>
        <p className="text-sm mt-2">Add your first loan to see analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Loan Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 text-center">EMI by Loan Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={loanTypeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {loanTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Monthly EMI']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Monthly EMI Comparison */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 text-center">Monthly EMI Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyEMIData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="emi" fill="#3B82F6" name="Monthly EMI" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Payment Progress */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-center">Payment Progress by Loan</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyEMIData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={12}
            />
            <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="paid" fill="#10B981" name="Amount Paid" />
            <Bar dataKey="remaining" fill="#F59E0B" name="Remaining Amount" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}