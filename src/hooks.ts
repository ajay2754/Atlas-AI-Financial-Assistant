import { useState, useEffect } from 'react';
import { Transaction, ChatMessage } from './types';

// Helper to generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('atlas_transactions');
    if (saved) return JSON.parse(saved);
    return [
      { id: generateId(), date: new Date().toISOString().split('T')[0], description: 'Initial Deposit', amount: 5000, type: 'income', category: 'Salary' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('atlas_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setTransactions((prev) => [{ ...transaction, id: generateId() }, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return { transactions, addTransaction, deleteTransaction };
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('atlas_chat');
    if (saved) return JSON.parse(saved);
    return [
      { id: generateId(), role: 'ai', content: 'Hello! I am Atlas, your personal AI financial assistant. How can I help you manage your finances today?', timestamp: Date.now() }
    ];
  });

  useEffect(() => {
    localStorage.setItem('atlas_chat', JSON.stringify(messages));
  }, [messages]);

  const addMessage = (role: 'user' | 'ai', content: string) => {
    setMessages((prev) => [...prev, { id: generateId(), role, content, timestamp: Date.now() }]);
  };

  return { messages, addMessage, setMessages };
}
