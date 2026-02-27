import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  TrendingDown, 
  Activity, 
  DollarSign,
  Target,
  Clock,
  BarChart3,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';

const riskMetrics = [
  { name: 'Portfolio VaR', value: 2.3, threshold: 5.0, status: 'good' },
  { name: 'Max Drawdown', value: 8.2, threshold: 15.0, status: 'warning' },
  { name: 'Correlation Risk', value: 0.72, threshold: 0.8, status: 'good' },
  { name: 'Leverage Ratio', value: 1.5, threshold: 3.0, status: 'good' },
];

const portfolioAllocation = [
  { name: 'Equities', value: 45, color: '#3b82f6' },
  { name: 'Bonds', value: 25, color: '#10b981' },
  { name: 'Commodities', value: 15, color: '#f59e0b' },
  { name: 'Cash', value: 10, color: '#6b7280' },
  { name: 'Crypto', value: 5, color: '#8b5cf6' },
];

const drawdownData = [
  { date: 'Jan', drawdown: -2.1 },
  { date: 'Feb', drawdown: -1.5 },
  { date: 'Mar', drawdown: -4.2 },
  { date: 'Apr', drawdown: -1.8 },
  { date: 'May', drawdown: -8.2 },
  { date: 'Jun', drawdown: -3.1 },
];

const correlationMatrix = [
  { strategy: 'RSI Momentum', corr1: 1.0, corr2: 0.65, corr3: 0.42 },
  { strategy: 'Mean Reversion', corr1: 0.65, corr2: 1.0, corr3: 0.38 },
  { strategy: 'Breakout Scanner', corr1: 0.42, corr2: 0.38, corr3: 1.0 },
];

const riskAlerts = [
  {
    type: 'high',
    title: 'High Correlation Detected',
    description: 'RSI Momentum and Mean Reversion strategies showing 65% correlation',
    icon: AlertTriangle,
    color: 'destructive'
  },
  {
    type: 'medium',
    title: 'Drawdown Approaching Limit',
    description: 'Current drawdown at 8.2%, approaching 15% limit',
    icon: TrendingDown,
    color: 'warning'
  },
  {
    type: 'low',
    title: 'VaR Within Limits',
    description: 'Portfolio Value at Risk well within acceptable range',
    icon: CheckCircle,
    color: 'default'
  },
];

export function RiskDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Risk Management Dashboard</h1>
          <p className="text-muted-foreground">Monitor and control portfolio risk exposure</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
            <Shield className="h-3 w-3 mr-1" />
            Protected
          </Badge>
        </div>
      </div>

      {/* Risk Alerts */}
      <div className="space-y-3">
        {riskAlerts.map((alert, index) => {
          const Icon = alert.icon;
          return (
            <Alert key={index} className={alert.type === 'high' ? 'border-red-200 bg-red-50' : 
                                         alert.type === 'medium' ? 'border-yellow-200 bg-yellow-50' : 
                                         'border-green-200 bg-green-50'}>
              <Icon className="h-4 w-4" />
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </Alert>
          );
        })}
      </div>

      {/* Key Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {riskMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{metric.name}</CardTitle>
              {metric.status === 'good' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {metric.name === 'Correlation Risk' ? metric.value.toFixed(2) : 
                 metric.name === 'Leverage Ratio' ? `${metric.value}x` : `${metric.value}%`}
              </div>
              <div className="mt-2">
                <Progress 
                  value={(metric.value / metric.threshold) * 100} 
                  className="h-2"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Limit: {metric.name === 'Correlation Risk' ? metric.threshold.toFixed(1) : 
                        metric.name === 'Leverage Ratio' ? `${metric.threshold}x` : `${metric.threshold}%`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
            <CardDescription>Asset class distribution and concentration risk</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={portfolioAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {portfolioAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-2">
                {portfolioAllocation.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drawdown Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Drawdown Analysis</CardTitle>
            <CardDescription>Historical drawdown patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={drawdownData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Drawdown']} />
                <Area 
                  type="monotone" 
                  dataKey="drawdown" 
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Current</p>
                <p className="text-lg text-red-600">-3.1%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Max (6M)</p>
                <p className="text-lg text-red-600">-8.2%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg</p>
                <p className="text-lg">-3.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategy Correlation Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Strategy Correlation Matrix</CardTitle>
          <CardDescription>Cross-correlation between active strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2">Strategy</th>
                  <th className="text-center p-2">RSI Momentum</th>
                  <th className="text-center p-2">Mean Reversion</th>
                  <th className="text-center p-2">Breakout Scanner</th>
                </tr>
              </thead>
              <tbody>
                {correlationMatrix.map((row, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2 text-sm">{row.strategy}</td>
                    <td className="p-2 text-center">
                      <Badge 
                        variant={row.corr1 === 1.0 ? "default" : row.corr1 > 0.6 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {row.corr1.toFixed(2)}
                      </Badge>
                    </td>
                    <td className="p-2 text-center">
                      <Badge 
                        variant={row.corr2 === 1.0 ? "default" : row.corr2 > 0.6 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {row.corr2.toFixed(2)}
                      </Badge>
                    </td>
                    <td className="p-2 text-center">
                      <Badge 
                        variant={row.corr3 === 1.0 ? "default" : row.corr3 > 0.6 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {row.corr3.toFixed(2)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">Low (0-0.6)</Badge>
              <span>Good diversification</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="text-xs">High (0.6+)</Badge>
              <span>Risk concentration</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Position Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Max position size</span>
              <Badge variant="outline">5%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Max sector exposure</span>
              <Badge variant="outline">20%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Cash requirement</span>
              <Badge variant="outline">10%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Stop Loss Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Strategy stop loss</span>
              <Badge variant="destructive">-15%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Portfolio stop loss</span>
              <Badge variant="destructive">-20%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Daily VaR limit</span>
              <Badge variant="destructive">-5%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Trading hours</span>
              <Badge variant="outline">9:30-16:00</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Max hold period</span>
              <Badge variant="outline">30 days</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Cool-down period</span>
              <Badge variant="outline">1 hour</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}