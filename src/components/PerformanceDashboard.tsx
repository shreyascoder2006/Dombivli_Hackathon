import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity, 
  DollarSign,
  Calendar,
  Award,
  Target,
  Download,
  Filter
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter
} from 'recharts';

const performanceData = [
  { date: 'Jan', portfolio: 10000, benchmark: 10000, strategy1: 10000, strategy2: 10000, strategy3: 10000 },
  { date: 'Feb', portfolio: 11200, benchmark: 10300, strategy1: 11800, strategy2: 10900, strategy3: 10650 },
  { date: 'Mar', portfolio: 10850, benchmark: 10100, strategy1: 11200, strategy2: 10400, strategy3: 11100 },
  { date: 'Apr', portfolio: 12500, benchmark: 10800, strategy1: 13200, strategy2: 11600, strategy3: 12800 },
  { date: 'May', portfolio: 13200, benchmark: 11200, strategy1: 14100, strategy2: 12100, strategy3: 13500 },
  { date: 'Jun', portfolio: 12850, benchmark: 10900, strategy1: 13600, strategy2: 11800, strategy3: 13200 },
];

const monthlyReturns = [
  { month: 'Jan', returns: 8.5, benchmark: 3.0 },
  { month: 'Feb', returns: -4.1, benchmark: -2.0 },
  { month: 'Mar', returns: 12.1, benchmark: 5.5 },
  { month: 'Apr', returns: 5.6, benchmark: 3.2 },
  { month: 'May', returns: -3.2, benchmark: -1.8 },
  { month: 'Jun', returns: 7.8, benchmark: 4.1 },
];

const riskReturnData = [
  { strategy: 'RSI Momentum', return: 19.5, risk: 12.3, sharpe: 1.58 },
  { strategy: 'Mean Reversion', return: 15.2, risk: 8.9, sharpe: 1.71 },
  { strategy: 'Breakout Scanner', return: 22.1, risk: 16.4, sharpe: 1.35 },
  { strategy: 'Portfolio', return: 18.3, risk: 11.2, sharpe: 1.63 },
  { strategy: 'Benchmark', return: 12.8, risk: 14.1, sharpe: 0.91 },
];

const strategyMetrics = [
  {
    name: 'RSI Momentum',
    return: '+19.5%',
    sharpe: '1.58',
    maxDD: '-6.2%',
    winRate: '68%',
    trades: 45,
    status: 'active',
    color: 'bg-green-100 text-green-800'
  },
  {
    name: 'Mean Reversion',
    return: '+15.2%',
    sharpe: '1.71',
    maxDD: '-4.8%',
    winRate: '72%',
    trades: 32,
    status: 'active',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    name: 'Breakout Scanner',
    return: '+22.1%',
    sharpe: '1.35',
    maxDD: '-9.1%',
    winRate: '64%',
    trades: 28,
    status: 'paused',
    color: 'bg-purple-100 text-purple-800'
  },
];

export function PerformanceDashboard() {
  const [timeframe, setTimeframe] = useState('6M');
  const [selectedMetric, setSelectedMetric] = useState('portfolio');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Performance Analytics</h1>
          <p className="text-muted-foreground">Comprehensive performance analysis and benchmarking</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="6M">6 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
              <SelectItem value="All">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">+28.5%</div>
            <p className="text-xs text-muted-foreground">vs benchmark: +9.0%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Sharpe Ratio</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">1.63</div>
            <p className="text-xs text-muted-foreground">vs benchmark: 0.91</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Alpha</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">+19.5%</div>
            <p className="text-xs text-muted-foreground">Outperforming market</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Beta</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">0.85</div>
            <p className="text-xs text-muted-foreground">Lower volatility</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Max Drawdown</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-600">-8.2%</div>
            <p className="text-xs text-muted-foreground">Within tolerance</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Cumulative returns vs benchmark</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, '']} />
                    <Line 
                      type="monotone" 
                      dataKey="portfolio" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      name="Portfolio"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="benchmark" 
                      stroke="#6b7280" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Benchmark"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Returns */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Returns</CardTitle>
                <CardDescription>Month-over-month performance breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, '']} />
                    <Bar dataKey="returns" fill="#3b82f6" name="Portfolio" />
                    <Bar dataKey="benchmark" fill="#e5e7eb" name="Benchmark" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance Attribution */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Attribution</CardTitle>
              <CardDescription>Contribution by strategy to overall performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strategyMetrics.map((strategy, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-full text-sm ${strategy.color}`}>
                        {strategy.name}
                      </div>
                      <Badge variant={strategy.status === 'active' ? 'default' : 'secondary'}>
                        {strategy.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground">Return</p>
                        <p className={`${strategy.return.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {strategy.return}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Sharpe</p>
                        <p>{strategy.sharpe}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Max DD</p>
                        <p className="text-red-600">{strategy.maxDD}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Win Rate</p>
                        <p>{strategy.winRate}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Trades</p>
                        <p>{strategy.trades}</p>
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
              <CardTitle>Strategy Performance Comparison</CardTitle>
              <CardDescription>Individual strategy performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, '']} />
                  <Line type="monotone" dataKey="strategy1" stroke="#ef4444" strokeWidth={2} name="RSI Momentum" />
                  <Line type="monotone" dataKey="strategy2" stroke="#3b82f6" strokeWidth={2} name="Mean Reversion" />
                  <Line type="monotone" dataKey="strategy3" stroke="#8b5cf6" strokeWidth={2} name="Breakout Scanner" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {strategyMetrics.map((strategy, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">{strategy.name}</CardTitle>
                  <CardDescription>
                    <Badge variant={strategy.status === 'active' ? 'default' : 'secondary'}>
                      {strategy.status}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Return</span>
                    <span className={`text-sm ${strategy.return.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {strategy.return}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                    <span className="text-sm">{strategy.sharpe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Max Drawdown</span>
                    <span className="text-sm text-red-600">{strategy.maxDD}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Win Rate</span>
                    <span className="text-sm">{strategy.winRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Trades</span>
                    <span className="text-sm">{strategy.trades}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attribution">
          <Card>
            <CardHeader>
              <CardTitle>Risk-Return Analysis</CardTitle>
              <CardDescription>Risk-adjusted performance visualization</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={riskReturnData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="risk" 
                    name="Risk (Volatility %)" 
                    label={{ value: 'Risk (Volatility %)', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    dataKey="return" 
                    name="Return %" 
                    label={{ value: 'Return %', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'return' ? `${value}%` : `${value}%`,
                      name === 'return' ? 'Return' : 'Risk'
                    ]}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.strategy || ''}
                  />
                  <Scatter 
                    dataKey="return" 
                    fill="#3b82f6"
                    shape={(props: any) => {
                      const { cx, cy, payload } = props;
                      const size = payload.sharpe * 10; // Size based on Sharpe ratio
                      return <circle cx={cx} cy={cy} r={size} fill="#3b82f6" fillOpacity={0.6} />;
                    }}
                  />
                </ScatterChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground mt-2">
                Bubble size represents Sharpe ratio. Ideal position: top-left (high return, low risk)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Benchmark Comparison</CardTitle>
              <CardDescription>Performance vs market benchmarks and indices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">vs S&P 500</p>
                    <p className="text-xl text-green-600">+15.7%</p>
                    <p className="text-xs">Outperforming</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">vs NASDAQ</p>
                    <p className="text-xl text-green-600">+12.3%</p>
                    <p className="text-xs">Outperforming</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">vs Russell 2000</p>
                    <p className="text-xl text-green-600">+8.9%</p>
                    <p className="text-xs">Outperforming</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">vs Bonds</p>
                    <p className="text-xl text-green-600">+23.1%</p>
                    <p className="text-xs">Significantly better</p>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, '']} />
                    <Area 
                      type="monotone" 
                      dataKey="portfolio" 
                      stackId="1"
                      stroke="#22c55e" 
                      fill="#22c55e"
                      fillOpacity={0.3}
                      name="Portfolio"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="benchmark" 
                      stackId="2"
                      stroke="#6b7280" 
                      fill="#6b7280"
                      fillOpacity={0.1}
                      name="Benchmark"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}