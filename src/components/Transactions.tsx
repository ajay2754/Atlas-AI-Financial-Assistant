import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { Plus, Trash2, ReceiptText } from 'lucide-react';
import { cn } from './Layout';

interface TransactionsProps {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
}

export function Transactions({ transactions, addTransaction, deleteTransaction }: TransactionsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) return;
    
    addTransaction({
      description,
      amount: parseFloat(amount),
      type,
      category,
      date
    });
    
    // Reset
    setDescription('');
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsAdding(false);
  };

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Transactions</h2>
          <p className="text-neutral-500 mt-1">View and manage your recent activity.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
        >
          <Plus size={18} />
          <span>Add Transaction</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">New Transaction</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700">Type</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setType('expense'); setCategory(''); }} className={cn("flex-1 py-2 rounded-lg font-medium transition-colors border", type === 'expense' ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-white border-neutral-200 text-neutral-500")}>Expense</button>
                  <button type="button" onClick={() => { setType('income'); setCategory(''); }} className={cn("flex-1 py-2 rounded-lg font-medium transition-colors border", type === 'income' ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-neutral-200 text-neutral-500")}>Income</button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700">Amount ($)</label>
                <input required type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-neutral-50/50" placeholder="0.00" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700">Description</label>
                <input required type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-neutral-50/50" placeholder="e.g. Groceries, Salary" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700">Category</label>
                <select 
                  required 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-neutral-50/50 appearance-none"
                >
                  <option value="" disabled>Select category</option>
                  {type === 'expense' ? (
                    <>
                      <option value="Food & Dining">Food & Dining</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Housing & Utilities">Housing & Utilities</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Health & Fitness">Health & Fitness</option>
                      <option value="Other Expense">Other Expense</option>
                    </>
                  ) : (
                    <>
                      <option value="Salary & Wages">Salary & Wages</option>
                      <option value="Investments">Investments</option>
                      <option value="Gifts & Grants">Gifts & Grants</option>
                      <option value="Refunds">Refunds</option>
                      <option value="Other Income">Other Income</option>
                    </>
                  )}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700">Date</label>
                <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-neutral-50/50" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-2.5 rounded-xl font-medium text-neutral-600 hover:bg-neutral-100 transition-colors">Cancel</button>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors">Save Transaction</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        {sortedTransactions.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {sortedTransactions.map((tx) => (
              <div key={tx.id} className="p-4 sm:px-6 hover:bg-neutral-50/50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600')}>
                    <span className="font-bold text-lg">{tx.description.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">{tx.description}</h4>
                    <div className="flex items-center gap-2 text-sm text-neutral-500 mt-0.5">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-xs font-medium">{tx.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={cn("font-semibold", tx.type === 'income' ? "text-emerald-600" : "text-neutral-900")}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <button onClick={() => deleteTransaction(tx.id)} className="text-neutral-400 hover:text-rose-600 transition-colors p-2 rounded-lg hover:bg-rose-50 flex items-center justify-center">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
              <ReceiptText size={24} />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-1">No transactions yet</h3>
            <p className="text-neutral-500 mb-6">Add your first transaction to get started tracking your finances.</p>
            <button onClick={() => setIsAdding(true)} className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2 rounded-xl font-medium transition-colors">
              <Plus size={18} />
              <span>Add Transaction</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
