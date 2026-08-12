/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { ChatAssistant } from './components/ChatAssistant';
import { useTransactions } from './hooks';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'chat'>('dashboard');
  const { transactions, addTransaction, deleteTransaction } = useTransactions();

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard transactions={transactions} />}
      {activeTab === 'transactions' && (
        <Transactions 
          transactions={transactions} 
          addTransaction={addTransaction} 
          deleteTransaction={deleteTransaction} 
        />
      )}
      {activeTab === 'chat' && <ChatAssistant transactions={transactions} />}
    </Layout>
  );
}
