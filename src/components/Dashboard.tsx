import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  AlertTriangle,
  Plus,
  Play,
  Settings,
  Eye,
  Edit
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useApp } from '../App';

const portfolioData = [
  { name: 'Jan', value: 10000 },
  { name: 'Feb', value: 11200 },
  { name: 'Mar', value: 10800 },
  { name: 'Apr', value: 12500 },
  { name: 'May', value: 13200 },
  { name: 'Jun', value: 12800 },
];

const strategies = [
  { name: 'RSI Momentum', status: 'Active', pnl: '+12.5%', trades: 24, winRate: '68%' },
  { name: 'Mean Reversion', status: 'Paused', pnl: '+8.2%', trades: 18, winRate: '72%' },
  { name: 'Breakout Scanner', status: 'Active', pnl: '+15.8%', trades: 31, winRate: '65%' },
  { name: 'Grid Trading', status: 'Draft', pnl: '--', trades: 0, winRate: '--' },
];

export function Dashboard() {
  const { setActiveTab, setSelectedStrategy, setShowStrategyDetail, user } = useApp();

  const handleCreateStrategy = () => {
    setActiveTab('builder');
  };

  const handleViewStrategy = (strategy: any) => {
    setSelectedStrategy(strategy);
    setShowStrategyDetail(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Welcome back, {user.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">Track your algorithmic trading performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setActiveTab('settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm" onClick={handleCreateStrategy}>
            <Plus className="h-4 w-4 mr-2" />
            New Strategy
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${user.portfolioValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              +{user.totalReturn}% total return
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Strategies</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{user.activeStrategies}</div>
            <p className="text-xs text-muted-foreground">
              {user.totalStrategies} total created
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Trades</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">73</div>
            <p className="text-xs text-muted-foreground">
              48 wins, 25 losses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Risk Score</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-yellow-600">{user.riskTolerance}</div>
            <p className="text-xs text-muted-foreground">
              Portfolio diversity: 85%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>6-month trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={portfolioData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Portfolio Value']} />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Risk Insights */}
        <Card>
          <CardHeader>
            <CardTitle>AI Risk Insights</CardTitle>
            <CardDescription>Real-time risk analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="text-sm">Market Volatility</p>
                <p className="text-xs text-muted-foreground">Currently low - good for momentum strategies</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">LOW</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div>
                <p className="text-sm">Correlation Risk</p>
                <p className="text-xs text-muted-foreground">Multiple strategies targeting similar assets</p>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">MEDIUM</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="text-sm">Liquidity Analysis</p>
                <p className="text-xs text-muted-foreground">All positions have adequate exit liquidity</p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">GOOD</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Strategies */}
      <Card>
        <CardHeader>
          <CardTitle>Strategy Overview</CardTitle>
          <CardDescription>Monitor your algorithmic trading strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strategies.map((strategy, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4>{strategy.name}</h4>
                    <Badge 
                      variant={strategy.status === 'Active' ? 'default' : 
                               strategy.status === 'Paused' ? 'secondary' : 'outline'}
                    >
                      {strategy.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>P&L: {strategy.pnl}</span>
                    <span>Trades: {strategy.trades}</span>
                    <span>Win Rate: {strategy.winRate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {strategy.status === 'Active' && (
                    <Button variant="outline" size="sm">
                      <Play className="h-3 w-3 mr-1" />
                      Pause
                    </Button>
                  )}
                  {strategy.status === 'Paused' && (
                    <Button variant="outline" size="sm">
                      <Play className="h-3 w-3 mr-1" />
                      Resume
                    </Button>
                  )}
                  {strategy.status === 'Draft' && (
                    <Button size="sm">
                      <Play className="h-3 w-3 mr-1" />
                      Deploy
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewStrategy(strategy)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}