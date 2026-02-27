import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { useApp } from '../App';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  DollarSign,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Strategy-specific backtest results
const getBacktestResults = (strategyName: string) => {
  const baseResults = [
    { date: '2024-01', trades: 8 },
    { date: '2024-02', trades: 12 },
    { date: '2024-03', trades: 15 },
    { date: '2024-04', trades: 18 },
    { date: '2024-05', trades: 22 },
    { date: '2024-06', trades: 19 },
  ];

  // Different performance based on strategy
  const strategyMultipliers: { [key: string]: number[] } = {
    'RSI Momentum': [1.0, 1.085, 1.042, 1.168, 1.234, 1.195],
    'Mean Reversion Pro': [1.0, 1.045, 1.092, 1.067, 1.123, 1.134],
    'Breakout Scanner': [1.0, 1.125, 1.089, 1.234, 1.198, 1.267],
    'Grid Trading': [1.0, 1.032, 1.028, 1.067, 1.089, 1.078],
  };

  const multipliers = strategyMultipliers[strategyName] || strategyMultipliers['RSI Momentum'];
  
  return baseResults.map((result, index) => ({
    ...result,
    value: Math.round(10000 * multipliers[index])
  }));
};

const getMonthlyReturns = (strategyName: string) => {
  const baseReturns = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  const strategyReturns: { [key: string]: number[] } = {
    'RSI Momentum': [8.5, -4.1, 12.1, 5.6, -3.2, 7.8],
    'Mean Reversion Pro': [4.5, 9.2, -6.7, 12.3, -2.1, 1.1],
    'Breakout Scanner': [12.5, -11.0, 23.4, -8.1, 26.7, 5.9],
    'Grid Trading': [3.2, -2.8, 6.7, -8.9, 7.8, -1.2],
  };

  const returns = strategyReturns[strategyName] || strategyReturns['RSI Momentum'];
  
  return baseReturns.map((month, index) => ({
    month,
    returns: returns[index]
  }));
};

const getStrategyMetrics = (strategyName: string) => {
  const metrics: { [key: string]: any } = {
    'RSI Momentum': {
      totalReturn: 19.5,
      sharpe: 1.85,
      maxDrawdown: -8.2,
      winRate: 68.5,
      totalTrades: 137,
      profitFactor: 1.89,
      riskLevel: 'Medium'
    },
    'Mean Reversion Pro': {
      totalReturn: 13.4,
      sharpe: 1.42,
      maxDrawdown: -5.1,
      winRate: 72.3,
      totalTrades: 89,
      profitFactor: 2.1,
      riskLevel: 'Low'
    },
    'Breakout Scanner': {
      totalReturn: 26.7,
      sharpe: 1.23,
      maxDrawdown: -15.3,
      winRate: 58.9,
      totalTrades: 203,
      profitFactor: 1.67,
      riskLevel: 'High'
    },
    'Grid Trading': {
      totalReturn: 7.8,
      sharpe: 0.89,
      maxDrawdown: -3.2,
      winRate: 85.4,
      totalTrades: 456,
      profitFactor: 1.12,
      riskLevel: 'Very Low'
    }
  };

  return metrics[strategyName] || metrics['RSI Momentum'];
};

export function Backtesting() {
  const { strategies, backtests, setBacktests } = useApp();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]?.name || 'RSI Momentum');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-06-30');
  const [initialCapital, setInitialCapital] = useState('10000');
  const [timeframe, setTimeframe] = useState('1h');
  const [commission, setCommission] = useState('0.1');
  const [slippage, setSlippage] = useState('0.05');
  const [currentResults, setCurrentResults] = useState<any[]>([]);
  const [currentReturns, setCurrentReturns] = useState<any[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<any>({});
  const [hasRunBacktest, setHasRunBacktest] = useState(false);
  const [lastSettings, setLastSettings] = useState({
    strategy: selectedStrategy,
    startDate,
    endDate,
    initialCapital,
    timeframe,
    commission,
    slippage
  });

  // Helper function to generate modified results based on settings changes
  const getModifiedResults = (strategy: string, settingsHash: string) => {
    const baseResults = getBacktestResults(strategy);
    const baseReturns = getMonthlyReturns(strategy);
    const baseMetrics = getStrategyMetrics(strategy);
    
    // Create a simple hash from settings to determine modification factor
    const hash = settingsHash.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const modifier = 0.85 + (hash % 30) / 100; // Range from 0.85 to 1.15
    
    const modifiedResults = baseResults.map(result => ({
      ...result,
      value: Math.round(result.value * modifier)
    }));
    
    const modifiedReturns = baseReturns.map(ret => ({
      ...ret,
      returns: Number((ret.returns * modifier).toFixed(1))
    }));
    
    const modifiedMetrics = {
      ...baseMetrics,
      totalReturn: Number((baseMetrics.totalReturn * modifier).toFixed(1)),
      sharpe: Number((baseMetrics.sharpe * (modifier > 1 ? 1.05 : 0.95)).toFixed(2)),
      maxDrawdown: Number((baseMetrics.maxDrawdown * (modifier > 1 ? 0.95 : 1.05)).toFixed(1)),
      winRate: Number((baseMetrics.winRate * (modifier > 1 ? 1.02 : 0.98)).toFixed(1)),
      profitFactor: Number((baseMetrics.profitFactor * modifier).toFixed(2))
    };
    
    return { modifiedResults, modifiedReturns, modifiedMetrics };
  };

  // Check for settings changes and notify user
  useEffect(() => {
    const currentSettings = {
      strategy: selectedStrategy,
      startDate,
      endDate,
      initialCapital,
      timeframe,
      commission,
      slippage
    };
    
    if (hasRunBacktest && JSON.stringify(currentSettings) !== JSON.stringify(lastSettings)) {
      const settingsHash = JSON.stringify(currentSettings);
      const { modifiedResults, modifiedReturns, modifiedMetrics } = getModifiedResults(selectedStrategy, settingsHash);
      
      // Calculate return difference
      const oldReturn = currentMetrics.totalReturn || 0;
      const newReturn = modifiedMetrics.totalReturn;
      const returnDiff = newReturn - oldReturn;
      
      // Update results
      setCurrentResults(modifiedResults);
      setCurrentReturns(modifiedReturns);
      setCurrentMetrics(modifiedMetrics);
      
      // Show notification
      const message = returnDiff > 0 
        ? `Settings updated! Expected return increased by ${returnDiff.toFixed(1)}% to ${newReturn}%` 
        : `Settings updated! Expected return decreased by ${Math.abs(returnDiff).toFixed(1)}% to ${newReturn}%`;
      
      if (returnDiff > 0) {
        toast.success(message);
      } else {
        toast.info(message);
      }
      
      setLastSettings(currentSettings);
    }
  }, [selectedStrategy, startDate, endDate, initialCapital, timeframe, commission, slippage, hasRunBacktest, currentMetrics.totalReturn, lastSettings]);

  const startBacktest = () => {
    if (!selectedStrategy) {
      toast.error('Please select a strategy');
      return;
    }

    setIsRunning(true);
    setProgress(0);
    toast.info('Starting backtest simulation...');
    
    // Simulate realistic backtest timing with 2-3 second delay
    const totalDuration = 2500 + Math.random() * 500; // 2.5-3 seconds
    const intervalTime = 100; // Update every 100ms
    const totalSteps = totalDuration / intervalTime;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      const newProgress = (currentStep / totalSteps) * 100;
      
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(interval);
        setIsRunning(false);
        
        // Update results with new data based on selected strategy
        const newResults = getBacktestResults(selectedStrategy);
        const newReturns = getMonthlyReturns(selectedStrategy);
        const newMetrics = getStrategyMetrics(selectedStrategy);
        
        setCurrentResults(newResults);
        setCurrentReturns(newReturns);
        setCurrentMetrics(newMetrics);
        setHasRunBacktest(true);
        
        // Update last settings
        setLastSettings({
          strategy: selectedStrategy,
          startDate,
          endDate,
          initialCapital,
          timeframe,
          commission,
          slippage
        });
        
        // Create new backtest record
        const newBacktest = {
          id: Date.now().toString(),
          strategyId: strategies.find(s => s.name === selectedStrategy)?.id || '1',
          strategyName: selectedStrategy,
          startDate,
          endDate,
          initialCapital: parseInt(initialCapital) || 10000,
          finalValue: newResults[newResults.length - 1].value,
          totalReturn: newMetrics.totalReturn,
          sharpeRatio: newMetrics.sharpe,
          maxDrawdown: newMetrics.maxDrawdown,
          totalTrades: newMetrics.totalTrades,
          winRate: newMetrics.winRate,
          status: 'completed' as const,
          created: new Date()
        };
        
        setBacktests(prev => [newBacktest, ...prev]);
        toast.success(`Backtest completed! Total return: ${newMetrics.totalReturn}%`);
        setProgress(100);
      }
    }, intervalTime);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Strategy Backtesting</h1>
          <p className="text-muted-foreground">Test your strategies against historical market data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Backtest Configuration */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configuration</CardTitle>
              <CardDescription>Set up your backtest parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="strategy">Strategy</Label>
                <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    {strategies.map((strategy) => (
                      <SelectItem key={strategy.id} value={strategy.name}>
                        {strategy.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">1 Minute</SelectItem>
                    <SelectItem value="5m">5 Minutes</SelectItem>
                    <SelectItem value="15m">15 Minutes</SelectItem>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="4h">4 Hours</SelectItem>
                    <SelectItem value="1d">1 Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input 
                    id="start-date" 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input 
                    id="end-date" 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capital">Initial Capital</Label>
                <Input 
                  id="capital" 
                  placeholder="$10,000" 
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(e.target.value)}
                  className="h-9" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commission">Commission (%)</Label>
                <Input 
                  id="commission" 
                  placeholder="0.1" 
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                  className="h-9" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slippage">Slippage (%)</Label>
                <Input 
                  id="slippage" 
                  placeholder="0.05" 
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className="h-9" 
                />
              </div>

              <Button 
                className="w-full" 
                onClick={startBacktest} 
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Backtest
                  </>
                )}
              </Button>

              {isRunning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Backtests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {strategies.map((strategy) => (
                  <div key={strategy.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm">{strategy.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Created: {strategy.created.toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedStrategy(strategy.name);
                        startBacktest();
                      }}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Dashboard */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="trades">Trades</TabsTrigger>
              <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Key Metrics */}
              {hasRunBacktest ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm">Total Return</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl text-green-600">+{currentMetrics.totalReturn}%</div>
                        <p className="text-xs text-muted-foreground">vs benchmark: +12.8%</p>
                      </CardContent>
                    </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm">Sharpe Ratio</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl">{currentMetrics.sharpe}</div>
                    <p className="text-xs text-muted-foreground">Good risk-adjusted return</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm">Max Drawdown</CardTitle>
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl text-red-600">{currentMetrics.maxDrawdown}%</div>
                    <p className="text-xs text-muted-foreground">Within acceptable range</p>
                  </CardContent>
                </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm">Win Rate</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl">{currentMetrics.winRate}%</div>
                        <p className="text-xs text-muted-foreground">94 wins, 43 losses</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Equity Curve */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Equity Curve</CardTitle>
                      <CardDescription>Portfolio value over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={currentResults}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value}`, 'Portfolio Value']} />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#22c55e" 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                    <Play className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg mb-2">No Backtest Results</h3>
                  <p className="text-muted-foreground mb-4">
                    Configure your strategy parameters and click "Start Backtest" to view results
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              {hasRunBacktest ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Returns</CardTitle>
                      <CardDescription>Performance breakdown by month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={currentReturns}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value}%`, 'Returns']} />
                          <Bar 
                            dataKey="returns" 
                            fill={(entry: any) => entry.returns > 0 ? '#22c55e' : '#ef4444'}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Annual Return</span>
                      <span className="text-sm">{currentMetrics.totalReturn}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Volatility</span>
                      <span className="text-sm">12.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Calmar Ratio</span>
                      <span className="text-sm">2.38</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Sortino Ratio</span>
                      <span className="text-sm">2.65</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Beta</span>
                      <span className="text-sm">0.85</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Trade Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Trades</span>
                      <span className="text-sm">{currentMetrics.totalTrades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Trade Duration</span>
                      <span className="text-sm">2.3 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Win</span>
                      <span className="text-sm text-green-600">+3.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Loss</span>
                      <span className="text-sm text-red-600">-1.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Profit Factor</span>
                      <span className="text-sm">{currentMetrics.profitFactor}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg mb-2">No Performance Data</h3>
              <p className="text-muted-foreground">
                Run a backtest to view detailed performance metrics
              </p>
            </div>
          )}
            </TabsContent>

            <TabsContent value="trades">
              {hasRunBacktest ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Trade History</CardTitle>
                    <CardDescription>Detailed list of all executed trades</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((trade) => (
                        <div key={trade} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <Badge variant={trade % 2 === 0 ? "default" : "destructive"}>
                              {trade % 2 === 0 ? "BUY" : "SELL"}
                            </Badge>
                            <span className="text-sm">AAPL</span>
                            <span className="text-sm text-muted-foreground">100 shares</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">$150.25</p>
                            <p className={`text-xs ${trade % 3 === 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {trade % 3 === 0 ? '+2.1%' : '-1.5%'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                    <Activity className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg mb-2">No Trade Data</h3>
                  <p className="text-muted-foreground">
                    Run a backtest to view trade execution history
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="risk">
              {hasRunBacktest ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm">VaR (95%)</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl text-orange-600">-2.3%</div>
                        <p className="text-xs text-muted-foreground">Daily value at risk</p>
                      </CardContent>
                    </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm">Beta</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl">0.85</div>
                      <p className="text-xs text-muted-foreground">Market correlation</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm">Correlation</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl">0.72</div>
                      <p className="text-xs text-muted-foreground">Strategy correlation</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Assessment</CardTitle>
                    <CardDescription>AI-powered risk analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Low Risk Profile</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Strategy shows consistent performance with manageable drawdowns
                      </p>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Concentration Risk</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Consider diversifying across more asset classes
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Volatility Analysis</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Volatility within expected range for this strategy type
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg mb-2">No Risk Analysis</h3>
                <p className="text-muted-foreground">
                  Run a backtest to view detailed risk metrics and analysis
                </p>
              </div>
            )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}