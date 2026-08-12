import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
}

export function Dashboard({ transactions }: DashboardProps) {
  const { totalBalance, income, expenses, chartData } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    
    // Simple chronological sort for charts
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const dailyData: Record<string, { income: number; expense: number }> = {};

    sorted.forEach((t) => {
      if (t.type === 'income') {
        inc += t.amount;
      } else {
        exp += t.amount;
      }

      if (!dailyData[t.date]) {
        dailyData[t.date] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        dailyData[t.date].income += t.amount;
      } else {
        dailyData[t.date].expense += t.amount;
      }
    });

    const cData = Object.keys(dailyData).map(date => ({
      date,
      income: dailyData[date].income,
      expense: dailyData[date].expense,
    }));

    return {
      totalBalance: inc - exp,
      income: inc,
      expenses: exp,
      chartData: cData
    };
  }, [transactions]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Financial Overview</h2>
        <p className="text-neutral-500 mt-1">Track your spending and manage your wealth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-4">
            <span className="font-medium">Total Balance</span>
            <Wallet size={20} className="text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">
            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-4">
            <span className="font-medium">Total Income</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <ArrowUpRight size={18} className="text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-600">
            +${income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-4">
            <span className="font-medium">Total Expenses</span>
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
              <ArrowDownRight size={18} className="text-rose-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-rose-600">
            -${expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
        <h3 className="text-lg font-bold text-neutral-900 mb-6">Cash Flow</h3>
        <div className="h-72 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#a3a3a3' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#a3a3a3' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '14px', fontWeight: 500 }}
                  labelStyle={{ color: '#737373', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" name="Income" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" name="Expense" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              No data available to display charts.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
