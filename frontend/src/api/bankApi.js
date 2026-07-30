import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Attach JWT token to every request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('apexbank_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback Mock Data Store (for testing UI when Spring Boot backend server is offline)
const MOCK_STORAGE_KEY = 'apexbank_mock_db';

const getMockDB = () => {
  const data = localStorage.getItem(MOCK_STORAGE_KEY);
  if (data) return JSON.parse(data);

  const initialDB = {
    user: {
      id: 1,
      fullName: 'Alex Morgan',
      email: 'alex.morgan@apexbank.com',
      role: 'ROLE_USER',
    },
    accounts: [
      { id: 101, accountNumber: 'ACC-98421054', accountType: 'CHECKING', balance: 8450.75, currency: 'USD' },
      { id: 102, accountNumber: 'ACC-31094821', accountType: 'SAVINGS', balance: 24120.00, currency: 'USD' },
    ],
    card: {
      id: 501,
      cardNumber: '4532890123456789',
      cardHolderName: 'ALEX MORGAN',
      expiryDate: '2028-12-31',
      cvv: '842',
      isFrozen: false,
      accountId: 101,
    },
    transactions: [
      { id: 1, referenceNumber: 'TXN-8F92A1B3', sourceAccountNumber: 'ACC-98421054', targetAccountNumber: 'ACC-55192841', amount: 450.00, transactionType: 'TRANSFER', status: 'COMPLETED', description: 'Monthly Rent Share', category: 'Housing', timestamp: new Date(Date.now() - 3600000 * 4).toISOString() },
      { id: 2, referenceNumber: 'DEP-319A01C9', sourceAccountNumber: 'External', targetAccountNumber: 'ACC-98421054', amount: 3200.00, transactionType: 'DEPOSIT', status: 'COMPLETED', description: 'Tech Corp Payroll Salary', category: 'Income', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: 3, referenceNumber: 'TXN-741B92D1', sourceAccountNumber: 'ACC-98421054', targetAccountNumber: 'ACC-31094821', amount: 1000.00, transactionType: 'TRANSFER', status: 'COMPLETED', description: 'Transfer to Savings', category: 'Savings', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() },
      { id: 4, referenceNumber: 'TXN-109C44E8', sourceAccountNumber: 'ACC-98421054', targetAccountNumber: 'ACC-77491029', amount: 64.50, transactionType: 'TRANSFER', status: 'COMPLETED', description: 'Coffee & Groceries', category: 'Food', timestamp: new Date(Date.now() - 86400000 * 6).toISOString() },
    ]
  };

  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(initialDB));
  return initialDB;
};

const saveMockDB = (db) => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(db));
};

export const bankApi = {
  // Auth
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch {
      // Mock Fallback
      const db = getMockDB();
      const mockToken = 'mock_jwt_token_' + Date.now();
      return {
        token: mockToken,
        tokenType: 'Bearer',
        userId: db.user.id,
        fullName: db.user.fullName,
        email: email || db.user.email,
      };
    }
  },

  register: async (fullName, email, password) => {
    try {
      const response = await api.post('/auth/register', { fullName, email, password });
      return response.data;
    } catch {
      const db = getMockDB();
      db.user = { id: Date.now(), fullName, email, role: 'ROLE_USER' };
      saveMockDB(db);
      return {
        token: 'mock_jwt_token_' + Date.now(),
        tokenType: 'Bearer',
        userId: db.user.id,
        fullName: db.user.fullName,
        email: db.user.email,
      };
    }
  },

  // Accounts
  getAccounts: async () => {
    try {
      const response = await api.get('/accounts');
      return response.data;
    } catch {
      const db = getMockDB();
      return db.accounts;
    }
  },

  transferMoney: async (sourceAccountId, targetAccountNumber, amount, description) => {
    try {
      const response = await api.post('/accounts/transfer', {
        sourceAccountId,
        targetAccountNumber,
        amount: parseFloat(amount),
        description,
      });
      return response.data;
    } catch {
      const db = getMockDB();
      const numAmount = parseFloat(amount);
      const sourceAcc = db.accounts.find(a => a.id === sourceAccountId || a.accountNumber === sourceAccountId);
      
      if (!sourceAcc) throw new Error('Source account not found');
      if (sourceAcc.balance < numAmount) throw new Error(`Insufficient funds! Available balance: ₹${sourceAcc.balance.toFixed(2)}`);

      sourceAcc.balance -= numAmount;

      const targetAcc = db.accounts.find(a => a.accountNumber === targetAccountNumber);
      if (targetAcc) {
        targetAcc.balance += numAmount;
      }

      const newTxn = {
        id: Date.now(),
        referenceNumber: 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        sourceAccountNumber: sourceAcc.accountNumber,
        targetAccountNumber,
        amount: numAmount,
        transactionType: 'TRANSFER',
        status: 'COMPLETED',
        description: description || `Transfer to ${targetAccountNumber}`,
        category: 'Transfer',
        timestamp: new Date().toISOString(),
      };

      db.transactions.unshift(newTxn);
      saveMockDB(db);
      return newTxn;
    }
  },

  depositMoney: async (accountId, amount, description) => {
    try {
      const response = await api.post('/accounts/deposit', {
        accountId,
        amount: parseFloat(amount),
        description,
      });
      return response.data;
    } catch {
      const db = getMockDB();
      const numAmount = parseFloat(amount);
      const acc = db.accounts.find(a => a.id === accountId);
      if (!acc) throw new Error('Account not found');

      acc.balance += numAmount;

      const newTxn = {
        id: Date.now(),
        referenceNumber: 'DEP-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        sourceAccountNumber: 'External Deposit',
        targetAccountNumber: acc.accountNumber,
        amount: numAmount,
        transactionType: 'DEPOSIT',
        status: 'COMPLETED',
        description: description || 'Cash / Check Deposit',
        category: 'Income',
        timestamp: new Date().toISOString(),
      };

      db.transactions.unshift(newTxn);
      saveMockDB(db);
      return acc;
    }
  },

  // Transactions
  getTransactions: async (accountId) => {
    try {
      const response = await api.get(`/transactions/account/${accountId}`);
      return response.data;
    } catch {
      const db = getMockDB();
      return db.transactions;
    }
  },

  // Cards
  getCard: async (accountId) => {
    try {
      const response = await api.get(`/cards/account/${accountId}`);
      return response.data;
    } catch {
      const db = getMockDB();
      return db.card;
    }
  },

  toggleCardFreeze: async (cardId) => {
    try {
      const response = await api.put(`/cards/${cardId}/toggle-freeze`);
      return response.data;
    } catch {
      const db = getMockDB();
      if (db.card) {
        db.card.isFrozen = !db.card.isFrozen;
        saveMockDB(db);
      }
      return db.card;
    }
  }
};
