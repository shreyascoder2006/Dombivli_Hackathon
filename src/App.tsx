import React, { useState, createContext, useContext } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { StrategyBuilder } from './components/StrategyBuilder';
import { Backtesting } from './components/Backtesting';
import { RiskDashboard } from './components/RiskDashboard';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { Marketplace } from './components/Marketplace';
import { Education } from './components/Education';
import { UserProfile } from './components/UserProfile';
import { Settings } from './components/Settings';
import { StrategyDetail } from './components/StrategyDetail';
import { NotificationCenter } from './components/NotificationCenter';
import { Login } from './components/Login';
import { LiveTrading } from './components/LiveTrading';
import { Toaster } from './components/ui/sonner';
import { useAuth } from './hooks/useAuth';

// Global App Context
interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  setUser: (user: any) => void;
  selectedStrategy: any;
  setSelectedStrategy: (strategy: any) => void;
  showStrategyDetail: boolean;
  setShowStrategyDetail: (show: boolean) => void;
  notifications: any[];
  setNotifications: (notifications: any[]) => void;
  strategies: any[];
  setStrategies: (strategies: any[]) => void;
  backtests: any[];
  setBacktests: (backtests: any[]) => void;
  courses: any[];
  setCourses: (courses: any[]) => void;
  enrolledCourses: string[];
  setEnrolledCourses: (courses: string[]) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export default function App() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [showStrategyDetail, setShowStrategyDetail] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Strategy Alert',
      message: 'RSI Momentum strategy triggered a buy signal',
      type: 'info',
      timestamp: new Date(),
      read: false
    },
    {
      id: 2,
      title: 'Risk Warning',
      message: 'Portfolio drawdown approaching 10% threshold',
      type: 'warning',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    }
  ]);

  const [strategies, setStrategies] = useState([
    {
      id: '1',
      name: 'RSI Momentum',
      description: 'A momentum strategy based on RSI and moving averages',
      type: 'Momentum',
      timeframe: '1h',
      symbols: ['AAPL', 'MSFT', 'GOOGL'],
      status: 'Active',
      performance: { return: 12.5, sharpe: 1.8, maxDrawdown: -8.2 },
      created: new Date('2024-01-15'),
      lastModified: new Date('2024-01-20')
    },
    {
      id: '2',
      name: 'Mean Reversion Pro',
      description: 'Advanced mean reversion using Bollinger Bands and RSI',
      type: 'Mean Reversion',
      timeframe: '4h',
      symbols: ['SPY', 'QQQ', 'IWM'],
      status: 'Inactive',
      performance: { return: 8.7, sharpe: 1.2, maxDrawdown: -5.1 },
      created: new Date('2024-01-10'),
      lastModified: new Date('2024-01-18')
    }
  ]);

  const [backtests, setBacktests] = useState([
    {
      id: '1',
      strategyId: '1',
      strategyName: 'RSI Momentum',
      startDate: '2023-01-01',
      endDate: '2024-01-01',
      initialCapital: 100000,
      finalValue: 112500,
      totalReturn: 12.5,
      sharpeRatio: 1.8,
      maxDrawdown: -8.2,
      totalTrades: 45,
      winRate: 67,
      status: 'completed',
      created: new Date('2024-01-20')
    }
  ]);

  const [courses, setCourses] = useState([
    {
      id: 'algo-basics',
      title: 'Algorithmic Trading Fundamentals',
      description: 'Learn the basics of algorithmic trading, from strategy development to risk management',
      level: 'Beginner',
      duration: '4 hours',
      lessons: 12,
      price: 0,
      rating: 4.8,
      students: 2847,
      enrolled: 2847,
      instructor: 'Dr. Sarah Chen',
      featured: true,
      progress: 65,
      topics: ['Technical Analysis', 'Risk Management', 'Backtesting', 'Strategy Development'],
      content: [
        { id: 1, title: 'Introduction to Algorithmic Trading', duration: '15 min', type: 'video', completed: false },
        { id: 2, title: 'Market Structure and Data', duration: '20 min', type: 'video', completed: false },
        { id: 3, title: 'Strategy Development Process', duration: '25 min', type: 'video', completed: false },
        { id: 4, title: 'Backtesting Fundamentals', duration: '30 min', type: 'video', completed: false }
      ]
    },
    {
      id: 'risk-management',
      title: 'Advanced Risk Management',
      description: 'Master portfolio risk management techniques for algorithmic trading',
      level: 'Intermediate',
      duration: '6 hours',
      lessons: 18,
      price: 99,
      rating: 4.9,
      students: 1203,
      enrolled: 1203,
      instructor: 'Michael Rodriguez',
      featured: false,
      progress: 0,
      topics: ['Portfolio Theory', 'VaR Modeling', 'Stress Testing', 'Monte Carlo'],
      content: [
        { id: 1, title: 'Portfolio Risk Assessment', duration: '25 min', type: 'video', completed: false },
        { id: 2, title: 'Value at Risk (VaR) Calculations', duration: '30 min', type: 'video', completed: false },
        { id: 3, title: 'Monte Carlo Simulations', duration: '35 min', type: 'video', completed: false },
        { id: 4, title: 'Stress Testing Strategies', duration: '20 min', type: 'video', completed: false }
      ]
    },
    {
      id: 'python-trading',
      title: 'Python for Algorithmic Trading',
      description: 'Master Python programming for building and deploying trading algorithms',
      level: 'Intermediate',
      duration: '8 hours',
      lessons: 24,
      price: 149,
      rating: 4.7,
      students: 1856,
      enrolled: 1856,
      instructor: 'David Chen',
      featured: true,
      progress: 0,
      topics: ['Python', 'Pandas', 'NumPy', 'API Integration'],
      content: [
        { id: 1, title: 'Python Trading Environment Setup', duration: '20 min', type: 'video', completed: false },
        { id: 2, title: 'Working with Market Data', duration: '30 min', type: 'video', completed: false },
        { id: 3, title: 'Building Trading Signals', duration: '25 min', type: 'video', completed: false },
        { id: 4, title: 'Broker API Integration', duration: '40 min', type: 'video', completed: false }
      ]
    }
  ]);

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  
  // User state is now managed by useAuth hook

  const handleLogin = (authenticatedUser: any) => {
    // User state is automatically updated by useAuth hook
    // This callback is just for any additional login handling if needed
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'builder':
        return <StrategyBuilder />;
      case 'backtesting':
        return <Backtesting />;
      case 'risk':
        return <RiskDashboard />;
      case 'performance':
        return <PerformanceDashboard />;
      case 'marketplace':
        return <Marketplace />;
      case 'education':
        return <Education />;
      case 'live-trading':
        return <LiveTrading />;
      case 'profile':
        return <UserProfile />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Stratify...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      user,
      setUser: () => {}, // User is managed by useAuth hook
      selectedStrategy,
      setSelectedStrategy,
      showStrategyDetail,
      setShowStrategyDetail,
      notifications,
      setNotifications,
      strategies,
      setStrategies,
      backtests,
      setBacktests,
      courses,
      setCourses,
      enrolledCourses,
      setEnrolledCourses
    }}>
      <div className="flex h-screen bg-background">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onLogout={logout}
        />
        <main className="flex-1 overflow-auto relative">
          {renderContent()}
          {showStrategyDetail && <StrategyDetail />}
          <NotificationCenter />
        </main>
        <Toaster />
      </div>
    </AppContext.Provider>
  );
}