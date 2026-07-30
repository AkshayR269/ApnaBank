import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { TransferModal } from './components/TransferModal';
import { DepositModal } from './components/DepositModal';
import { TransactionHistory } from './components/TransactionHistory';
import { CardManager } from './components/CardManager';
import { bankApi } from './api/bankApi';

const MainContent = () => {
  const { isAuthenticated } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [card, setCard] = useState(null);

  const fetchData = async () => {
    if (!isAuthenticated) return;
    try {
      const accs = await bankApi.getAccounts();
      setAccounts(accs);

      if (accs.length > 0) {
        const txns = await bankApi.getTransactions(accs[0].id);
        setTransactions(txns);

        const cardData = await bankApi.getCard(accs[0].id);
        setCard(cardData);
      }
    } catch (err) {
      console.error('Data load error:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen pb-16">
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isAuthenticated ? (
          /* Public Bank Landing Page when logged out */
          <LandingPage onOpenAuth={() => setIsAuthOpen(true)} />
        ) : (
          /* Personal Customer Financial Dashboard when logged in */
          <div className="space-y-8">
            <Dashboard
              accounts={accounts}
              onOpenTransfer={() => setIsTransferOpen(true)}
              onOpenDeposit={() => setIsDepositOpen(true)}
              onRefresh={fetchData}
            />

            <div className="grid grid-cols-1 gap-8">
              <CardManager card={card} onCardUpdate={(updatedCard) => setCard(updatedCard)} />
              <TransactionHistory transactions={transactions} />
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {isAuthenticated && (
        <>
          <TransferModal
            isOpen={isTransferOpen}
            onClose={() => setIsTransferOpen(false)}
            accounts={accounts}
            onSuccess={fetchData}
          />

          <DepositModal
            isOpen={isDepositOpen}
            onClose={() => setIsDepositOpen(false)}
            accounts={accounts}
            onSuccess={fetchData}
          />
        </>
      )}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;
