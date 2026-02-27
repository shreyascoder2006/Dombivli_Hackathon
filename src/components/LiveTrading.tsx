import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import { 
  Play, 
  Pause, 
  Square, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Activity,
  Target,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Circle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Settings,
  Eye,
  Users
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock live trading data
const generateLiveData = () => ({
  totalPnL: (Math.random() - 0.4) * 10000,
  dayPnL: (Math.random() - 0.4) * 2000,
  totalValue: 125000 + (Math.random() - 0.4) * 20000,
  availableCash: 25000 + (Math.random() - 0.5) * 10000,
  marginUsed: Math.random() * 50000,
  positions: [
    {
      symbol: 'AAPL',
      quantity: 100,
      avgPrice: 175.50,
      currentPrice: 175.50 + (Math.random() - 0.5) * 10,
      strategy: 'RSI Momentum',
      side: 'LONG',
      unrealizedPnL: (Math.random() - 0.4) * 500,
      time: '09:34:22'
    },
    {
      symbol: 'MSFT',
      quantity: 75,
      avgPrice: 420.25,
      currentPrice: 420.25 + (Math.random() - 0.5) * 15,
      strategy: 'Mean Reversion Pro',
      side: 'LONG',
      unrealizedPnL: (Math.random() - 0.4) * 800,
      time: '10:15:45'
    },
    {
      symbol: 'GOOGL',
      quantity: -50,
      avgPrice: 142.80,
      currentPrice: 142.80 + (Math.random() - 0.5) * 8,
      strategy: 'Breakout Momentum',
      side: 'SHORT',
      unrealizedPnL: (Math.random() - 0.4) * 300,
      time: '11:22:18'
    }
  ],
  recentTrades: [
    {
      id: 1,
      symbol: 'TSLA',
      side: 'BUY',
      quantity: 25,
      price: 245.60,
      time: '12:45:30',
      strategy: 'AI Sentiment Trader',
      status: 'FILLED',
      pnl: 125.50
    },
    {
      id: 2,
      symbol: 'NVDA',
      side: 'SELL',
      quantity: 40,
      price: 875.20,
      time: '12:38:15',
      strategy: 'RSI Momentum',
      status: 'FILLED',
      pnl: -89.20
    },
    {
      id: 3,
      symbol: 'META',
      side: 'BUY',
      quantity: 60,
      price: 485.75,
      time: '12:32:08',
      strategy: 'Grid Trading Bot',
      status: 'PARTIAL',
      pnl: 0
    }
  ],
  activeStrategies: [
    { name: 'RSI Momentum', status: 'RUNNING', pnl: 1245.60, trades: 8, lastTrade: '12:45:30' },
    { name: 'Mean Reversion Pro', status: 'RUNNING', pnl: -234.50, trades: 5, lastTrade: '12:38:15' },
    { name: 'Breakout Momentum', status: 'PAUSED', pnl: 567.80, trades: 3, lastTrade: '11:22:18' },
    { name: 'AI Sentiment Trader', status: 'RUNNING', pnl: 789.25, trades: 12, lastTrade: '12:32:08' }
  ]
});

export function LiveTrading() {
  const [liveData, setLiveData] = useState(generateLiveData());
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [timeframe, setTimeframe] = useState('1m');

  // Generate P&L chart data
  const pnlChartData = Array.from({ length: 20 }, (_, i) => ({
    time: `${String(9 + Math.floor(i / 4)).padStart(2, '0')}:${String((i % 4) * 15).padStart(2, '0')}`,
    pnl: (Math.random() - 0.3) * 2000 + i * 50
  }));

  // Portfolio allocation data
  const allocationData = [
    { name: 'Equity Positions', value: 75000, color: '#2563eb' },
    { name: 'Cash', value: 25000, color: '#10b981' },
    { name: 'Options', value: 15000, color: '#f59e0b' },
    { name: 'Crypto', value: 10000, color: '#8b5cf6' }
  ];

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setLiveData(generateLiveData());
      setLastUpdate(new Date());
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const toggleLiveUpdates = () => {
    setIsLive(!isLive);
    toast.success(isLive ? 'Live updates paused' : 'Live updates resumed');
  };

  const handleStrategyAction = (strategyName: string, action: 'pause' | 'resume' | 'stop') => {
    toast.success(`${strategyName} ${action}d successfully`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING': return 'text-green-600 bg-green-100';
      case 'PAUSED': return 'text-yellow-600 bg-yellow-100';
      case 'STOPPED': return 'text-red-600 bg-red-100';
      case 'FILLED': return 'text-green-600 bg-green-100';
      case 'PARTIAL': return 'text-yellow-600 bg-yellow-100';
      case 'PENDING': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Live Trading Dashboard</h1>
          <p className="text-muted-foreground">Real-time P&L, positions, and algorithmic trading activity</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={isLive ? "default" : "outline"} 
            size="sm"
            onClick={toggleLiveUpdates}
          >
            {isLive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isLive ? 'Pause Live' : 'Resume Live'}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Live Status Banner */}
      <Card className={`border-2 ${isLive ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
              <span className="font-medium">
                {isLive ? 'Live Trading Active' : 'Live Updates Paused'}
              </span>
              <span className="text-sm text-muted-foreground">
                Last update: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total P&L</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl ${liveData.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(liveData.totalPnL)}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {liveData.totalPnL >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600" />
              )}
              {((liveData.totalPnL / liveData.totalValue) * 100).toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Day P&L</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl ${liveData.dayPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(liveData.dayPnL)}
            </div>
            <p className="text-xs text-muted-foreground">Since market open</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Portfolio Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{formatCurrency(liveData.totalValue)}</div>
            <p className="text-xs text-muted-foreground">Total equity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Available Cash</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{formatCurrency(liveData.availableCash)}</div>
            <p className="text-xs text-muted-foreground">Buying power</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="positions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="trades">Recent Trades</TabsTrigger>
          <TabsTrigger value="strategies">Active Strategies</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Positions</CardTitle>
              <CardDescription>Live positions with real-time P&L</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {liveData.positions.map((position, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{position.symbol}</span>
                          <Badge 
                            variant="outline" 
                            className={position.side === 'LONG' ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}
                          >
                            {position.side}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Math.abs(position.quantity)} shares @ {formatCurrency(position.avgPrice)}
                        </div>
                      </div>
                      <div className="text-sm">
                        <div>Current: {formatCurrency(position.currentPrice)}</div>
                        <div className="text-muted-foreground">via {position.strategy}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-semibold ${position.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(position.unrealizedPnL)}
                      </div>
                      <div className="text-sm text-muted-foreground">{position.time}</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Square className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
              <CardDescription>Latest algorithmic trading activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {liveData.recentTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${trade.side === 'BUY' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{trade.symbol}</span>
                          <Badge variant="outline" className={getStatusColor(trade.status)}>
                            {trade.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {trade.side} {trade.quantity} @ {formatCurrency(trade.price)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">{trade.strategy}</div>
                      <div className="text-sm">{trade.time}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-medium ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trade.pnl !== 0 ? formatCurrency(trade.pnl) : '--'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Strategies</CardTitle>
              <CardDescription>Real-time strategy performance and controls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {liveData.activeStrategies.map((strategy, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        strategy.status === 'RUNNING' ? 'bg-green-500 animate-pulse' : 
                        strategy.status === 'PAUSED' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{strategy.name}</span>
                          <Badge variant="outline" className={getStatusColor(strategy.status)}>
                            {strategy.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {strategy.trades} trades • Last: {strategy.lastTrade}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-semibold ${strategy.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(strategy.pnl)}
                      </div>
                      <div className="text-sm text-muted-foreground">P&L Today</div>
                    </div>
                    
                    <div className="flex gap-2">
                      {strategy.status === 'RUNNING' ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStrategyAction(strategy.name, 'pause')}
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStrategyAction(strategy.name, 'resume')}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStrategyAction(strategy.name, 'stop')}
                      >
                        <Square className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Live P&L Chart
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">1m</SelectItem>
                      <SelectItem value="5m">5m</SelectItem>
                      <SelectItem value="15m">15m</SelectItem>
                      <SelectItem value="1h">1h</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={pnlChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="pnl" 
                        stroke="#2563eb" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {allocationData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}