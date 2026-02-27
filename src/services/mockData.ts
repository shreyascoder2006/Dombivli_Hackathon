// Mock data service for simulating backend functionality

export interface MockUser {
  email: string;
  password: string;
  profile: UserProfile;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  accountType: string;
  joinDate: string;
  totalStrategies: number;
  activeStrategies: number;
  portfolioValue: number;
  totalReturn: number;
  riskTolerance: string;
  tradingExperience: string;
  preferredTimeframes: string[];
  brokerConnections: string[];
  notifications: {
    trades: boolean;
    alerts: boolean;
    educational: boolean;
    marketing: boolean;
  };
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  type: string;
  timeframe: string;
  symbols: string[];
  status: 'Active' | 'Inactive' | 'Testing';
  performance: {
    return: number;
    sharpe: number;
    maxDrawdown: number;
  };
  created: Date;
  lastModified: Date;
  blocks?: any[];
}

export interface BacktestResult {
  id: string;
  strategyId: string;
  strategyName: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalValue: number;
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalTrades: number;
  winRate: number;
  status: 'running' | 'completed' | 'failed';
  created: Date;
  results?: {
    data: Array<{ date: string; value: number; trades: number }>;
    monthlyReturns: Array<{ month: string; returns: number }>;
    trades: Array<{
      id: number;
      symbol: string;
      type: 'BUY' | 'SELL';
      price: number;
      quantity: number;
      date: string;
      pnl: number;
    }>;
  };
}

// Demo user credentials
export const DEMO_USER: MockUser = {
  email: 'demo@stratify.com',
  password: 'password123',
  profile: {
    name: 'Alex Johnson',
    email: 'demo@stratify.com',
    avatar: 'AJ',
    accountType: 'Pro',
    joinDate: '2024-01-15',
    totalStrategies: 8,
    activeStrategies: 3,
    portfolioValue: 125847,
    totalReturn: 28.5,
    riskTolerance: 'Medium',
    tradingExperience: 'Advanced',
    preferredTimeframes: ['1h', '4h', '1d'],
    brokerConnections: ['Interactive Brokers', 'Alpaca'],
    notifications: {
      trades: true,
      alerts: true,
      educational: false,
      marketing: false
    }
  }
};

// Mock strategy templates
export const STRATEGY_TEMPLATES = {
  'RSI Oversold': {
    name: 'RSI Oversold Strategy',
    description: 'Buy when RSI goes below 30, sell when above 70',
    blocks: [
      { id: 'rsi', name: 'RSI', category: 'momentum', period: 14 },
      { id: 'below', name: 'Below', category: 'comparison', threshold: 30 },
      { id: 'buy', name: 'Buy', category: 'trade' }
    ]
  },
  'Moving Average Cross': {
    name: 'MA Cross Strategy',
    description: 'Buy when fast MA crosses above slow MA',
    blocks: [
      { id: 'sma_fast', name: 'SMA Fast', category: 'trend', period: 20 },
      { id: 'sma_slow', name: 'SMA Slow', category: 'trend', period: 50 },
      { id: 'crosses', name: 'Crosses Above', category: 'signal' },
      { id: 'buy', name: 'Buy', category: 'trade' }
    ]
  },
  'Breakout Strategy': {
    name: 'Breakout Strategy',
    description: 'Buy on price breakout above resistance',
    blocks: [
      { id: 'bb', name: 'Bollinger Bands', category: 'volatility' },
      { id: 'above', name: 'Above', category: 'comparison' },
      { id: 'buy', name: 'Buy', category: 'trade' }
    ]
  }
};

// Generate mock backtest results based on strategy
export const generateBacktestResults = (strategy: Strategy, config: any): BacktestResult => {
  const startDate = new Date(config.startDate || '2024-01-01');
  const endDate = new Date(config.endDate || '2024-06-30');
  const initialCapital = config.initialCapital || 100000;
  
  // Different performance profiles based on strategy type
  const performanceProfiles: { [key: string]: any } = {
    'Momentum': {
      multipliers: [1.0, 1.085, 1.042, 1.168, 1.234, 1.195],
      monthlyReturns: [8.5, -4.1, 12.1, 5.6, -3.2, 7.8],
      winRate: 68.5,
      sharpe: 1.85,
      maxDrawdown: -8.2,
      trades: 137
    },
    'Mean Reversion': {
      multipliers: [1.0, 1.045, 1.092, 1.067, 1.123, 1.134],
      monthlyReturns: [4.5, 9.2, -6.7, 12.3, -2.1, 1.1],
      winRate: 72.3,
      sharpe: 1.42,
      maxDrawdown: -5.1,
      trades: 89
    },
    'Custom': {
      multipliers: [1.0, 1.065, 1.078, 1.145, 1.189, 1.167],
      monthlyReturns: [6.5, 1.2, 6.7, 4.4, -2.2, -1.8],
      winRate: 65.2,
      sharpe: 1.23,
      maxDrawdown: -6.8,
      trades: 112
    }
  };

  const profile = performanceProfiles[strategy.type] || performanceProfiles['Custom'];
  const finalValue = Math.round(initialCapital * profile.multipliers[profile.multipliers.length - 1]);
  const totalReturn = ((finalValue - initialCapital) / initialCapital) * 100;

  // Generate time series data
  const data = profile.multipliers.map((mult: number, index: number) => ({
    date: `2024-${String(index + 1).padStart(2, '0')}`,
    value: Math.round(initialCapital * mult),
    trades: Math.floor(Math.random() * 10) + 15
  }));

  // Generate monthly returns
  const monthlyReturns = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => ({
    month,
    returns: profile.monthlyReturns[index]
  }));

  // Generate sample trades
  const trades = Array.from({ length: Math.min(profile.trades, 20) }, (_, index) => ({
    id: index + 1,
    symbol: strategy.symbols[Math.floor(Math.random() * strategy.symbols.length)],
    type: Math.random() > 0.5 ? 'BUY' as const : 'SELL' as const,
    price: Math.round((Math.random() * 100 + 50) * 100) / 100,
    quantity: Math.floor(Math.random() * 500) + 100,
    date: `2024-${String(Math.floor(Math.random() * 6) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    pnl: Math.round((Math.random() - 0.3) * 1000 * 100) / 100
  }));

  return {
    id: Date.now().toString(),
    strategyId: strategy.id,
    strategyName: strategy.name,
    startDate: config.startDate || '2024-01-01',
    endDate: config.endDate || '2024-06-30',
    initialCapital,
    finalValue,
    totalReturn: Math.round(totalReturn * 100) / 100,
    sharpeRatio: profile.sharpe,
    maxDrawdown: profile.maxDrawdown,
    totalTrades: profile.trades,
    winRate: profile.winRate,
    status: 'completed',
    created: new Date(),
    results: {
      data,
      monthlyReturns,
      trades
    }
  };
};

// Mock AI suggestions generator
export const generateAISuggestions = (strategy: Strategy, blocks: any[]) => {
  const suggestions = [
    {
      id: 1,
      text: 'Consider adding a stop-loss condition to limit downside risk',
      priority: 'high',
      category: 'risk_management',
      implementation: 'Add a stop-loss block with 2-3% threshold'
    },
    {
      id: 2,
      text: 'Volume confirmation could reduce false signals',
      priority: 'medium',
      category: 'signal_quality',
      implementation: 'Add volume indicator above average'
    },
    {
      id: 3,
      text: 'Consider time-based filters to avoid low liquidity periods',
      priority: 'low',
      category: 'timing',
      implementation: 'Add time filter for market hours'
    },
    {
      id: 4,
      text: 'Correlation with market indices could improve timing',
      priority: 'medium',
      category: 'market_conditions',
      implementation: 'Add SPY correlation check'
    }
  ];

  // Return random subset based on current blocks
  const numSuggestions = Math.min(3, Math.floor(Math.random() * 4) + 1);
  return suggestions
    .sort(() => Math.random() - 0.5)
    .slice(0, numSuggestions);
};

// Authentication helpers
export const AuthService = {
  login: async (email: string, password: string): Promise<UserProfile | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userProfile', JSON.stringify(DEMO_USER.profile));
      return DEMO_USER.profile;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userProfile');
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem('isLoggedIn') === 'true';
  },

  getCurrentUser: (): UserProfile | null => {
    const userStr = localStorage.getItem('userProfile');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// Market data simulation
export const MarketDataService = {
  getPortfolioData: () => [
    { name: 'Jan', value: 100000, benchmark: 98000 },
    { name: 'Feb', value: 108500, benchmark: 99500 },
    { name: 'Mar', value: 104200, benchmark: 97800 },
    { name: 'Apr', value: 116800, benchmark: 102300 },
    { name: 'May', value: 123400, benchmark: 104800 },
    { name: 'Jun', value: 125847, benchmark: 106200 }
  ],

  getRiskMetrics: () => ({
    portfolioVar: -2.3,
    sharpeRatio: 1.85,
    beta: 0.85,
    correlation: 0.72,
    volatility: 12.3,
    maxDrawdown: -8.2
  }),

  getMarketAlerts: () => [
    {
      id: 1,
      type: 'opportunity',
      title: 'Breakout Signal Detected',
      message: 'AAPL showing strong momentum above resistance',
      severity: 'medium',
      timestamp: new Date()
    },
    {
      id: 2,
      type: 'risk',
      title: 'Correlation Risk',
      message: 'High correlation detected between portfolio positions',
      severity: 'high',
      timestamp: new Date(Date.now() - 1800000)
    }
  ]
};