import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  X, 
  Play, 
  Pause, 
  Edit, 
  Copy, 
  Share2, 
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Clock,
  DollarSign,
  Activity,
  Settings,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../App';

const performanceData = [
  { date: '2024-01', value: 10000 },
  { date: '2024-02', value: 11200 },
  { date: '2024-03', value: 10800 },
  { date: '2024-04', value: 12500 },
  { date: '2024-05', value: 13200 },
  { date: '2024-06', value: 12800 },
];

const trades = [
  { symbol: 'AAPL', type: 'BUY', quantity: 100, price: 150.25, date: '2024-06-15', pnl: '+2.1%' },
  { symbol: 'MSFT', type: 'SELL', quantity: 50, price: 245.80, date: '2024-06-14', pnl: '+1.8%' },
  { symbol: 'TSLA', type: 'BUY', quantity: 25, price: 180.50, date: '2024-06-13', pnl: '-1.2%' },
  { symbol: 'NVDA', type: 'SELL', quantity: 30, price: 425.75, date: '2024-06-12', pnl: '+3.5%' },
];

export function StrategyDetail() {
  const { selectedStrategy, setShowStrategyDetail } = useApp();

  // Mock strategy data if none selected
  const strategy = selectedStrategy || {
    name: 'RSI Momentum Pro',
    description: 'Advanced RSI-based momentum strategy with dynamic position sizing',
    status: 'Active',
    createdDate: '2024-03-15',
    lastModified: '2024-06-10',
    totalReturn: '+18.5%',
    sharpeRatio: '1.67',
    maxDrawdown: '-6.2%',
    winRate: '68%',
    totalTrades: 42,
    avgTrade: '+1.2%',
    capitalAllocated: 25000,
    riskLevel: 'Medium',
    timeframe: '1h',
    author: 'Alex Johnson',
    tags: ['RSI', 'Momentum', 'Risk Management'],
    complexity: 'Intermediate'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl">{strategy.name}</h2>
            <p className="text-sm text-muted-foreground">{strategy.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={strategy.status === 'Active' ? 'default' : 'secondary'}>
              {strategy.status}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setShowStrategyDetail(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button size="sm">
                <Play className="h-4 w-4 mr-2" />
                Run Strategy
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Clone
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Return</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-green-600">{strategy.totalReturn}</div>
                  <p className="text-xs text-muted-foreground">Since inception</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Sharpe Ratio</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{strategy.sharpeRatio}</div>
                  <p className="text-xs text-muted-foreground">Risk-adjusted return</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Max Drawdown</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-red-600">{strategy.maxDrawdown}</div>
                  <p className="text-xs text-muted-foreground">Largest loss</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Win Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{strategy.winRate}</div>
                  <p className="text-xs text-muted-foreground">{strategy.totalTrades} total trades</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="trades">Trades</TabsTrigger>
                <TabsTrigger value="configuration">Configuration</TabsTrigger>
                <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Strategy Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Created</p>
                          <p>{new Date(strategy.createdDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Modified</p>
                          <p>{new Date(strategy.lastModified).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Author</p>
                          <p>{strategy.author}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Complexity</p>
                          <Badge variant="outline">{strategy.complexity}</Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Timeframe</p>
                          <p>{strategy.timeframe}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Risk Level</p>
                          <Badge variant="secondary">{strategy.riskLevel}</Badge>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-muted-foreground text-sm mb-2">Tags</p>
                        <div className="flex flex-wrap gap-1">
                          {strategy.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Capital Allocation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Allocated Capital</span>
                          <span className="text-sm">${strategy.capitalAllocated.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Current Value</span>
                          <span className="text-sm">${(strategy.capitalAllocated * 1.185).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Unrealized P&L</span>
                          <span className="text-sm text-green-600">+${(strategy.capitalAllocated * 0.185).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Available Cash</span>
                          <span className="text-sm">${(strategy.capitalAllocated * 0.15).toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Chart</CardTitle>
                    <CardDescription>Strategy equity curve over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Portfolio Value']} />
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
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Return</span>
                        <span className="text-sm text-green-600">{strategy.totalReturn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Annualized Return</span>
                        <span className="text-sm">24.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Volatility</span>
                        <span className="text-sm">14.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Sharpe Ratio</span>
                        <span className="text-sm">{strategy.sharpeRatio}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Sortino Ratio</span>
                        <span className="text-sm">2.31</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Calmar Ratio</span>
                        <span className="text-sm">3.90</span>
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
                        <span className="text-sm">{strategy.totalTrades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Win Rate</span>
                        <span className="text-sm">{strategy.winRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg Win</span>
                        <span className="text-sm text-green-600">+2.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg Loss</span>
                        <span className="text-sm text-red-600">-1.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Profit Factor</span>
                        <span className="text-sm">1.89</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg Trade</span>
                        <span className="text-sm">{strategy.avgTrade}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Risk Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Max Drawdown</span>
                        <span className="text-sm text-red-600">{strategy.maxDrawdown}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg Drawdown</span>
                        <span className="text-sm">-2.1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">VaR (95%)</span>
                        <span className="text-sm">-3.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Beta</span>
                        <span className="text-sm">0.78</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Alpha</span>
                        <span className="text-sm">8.4%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Correlation</span>
                        <span className="text-sm">0.65</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="trades" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Trades</CardTitle>
                    <CardDescription>Latest executed trades for this strategy</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {trades.map((trade, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <Badge variant={trade.type === 'BUY' ? 'default' : 'destructive'}>
                              {trade.type}
                            </Badge>
                            <span className="text-sm">{trade.symbol}</span>
                            <span className="text-sm text-muted-foreground">{trade.quantity} shares</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">${trade.price}</p>
                            <p className="text-xs text-muted-foreground">{trade.date}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm ${trade.pnl.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                              {trade.pnl}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="configuration" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Strategy Configuration</CardTitle>
                    <CardDescription>Current strategy parameters and settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm mb-2">Entry Conditions</h4>
                          <div className="space-y-2 text-sm">
                            <div className="p-3 bg-blue-50 rounded border border-blue-200">
                              RSI(14) crosses below 30 (oversold)
                            </div>
                            <div className="p-3 bg-green-50 rounded border border-green-200">
                              Volume &gt; 1.5x average volume
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm mb-2">Exit Conditions</h4>
                          <div className="space-y-2 text-sm">
                            <div className="p-3 bg-purple-50 rounded border border-purple-200">
                              RSI(14) crosses above 70 (overbought)
                            </div>
                            <div className="p-3 bg-red-50 rounded border border-red-200">
                              Stop loss: 3% below entry price
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm mb-2">Risk Management</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Position Size</span>
                              <span>2% of portfolio</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Max Positions</span>
                              <span>5 concurrent</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Stop Loss</span>
                              <span>3% trailing</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Take Profit</span>
                              <span>6% target</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm mb-2">Execution Settings</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Order Type</span>
                              <span>Market</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Slippage</span>
                              <span>0.05%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Commission</span>
                              <span>$0.005/share</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risk" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Analysis</CardTitle>
                    <CardDescription>Comprehensive risk assessment for this strategy</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-900">Low Risk Profile</span>
                          </div>
                          <p className="text-xs text-green-700">
                            Strategy shows consistent performance with manageable drawdowns
                          </p>
                        </div>
                        
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm text-yellow-900">Market Dependency</span>
                          </div>
                          <p className="text-xs text-yellow-700">
                            Performance may be correlated with overall market conditions
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="text-sm">Risk Metrics</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Portfolio Risk Score</span>
                            <Badge variant="secondary">Medium</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Concentration Risk</span>
                            <Badge variant="outline">Low</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Liquidity Risk</span>
                            <Badge variant="outline">Low</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Model Risk</span>
                            <Badge variant="secondary">Medium</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}