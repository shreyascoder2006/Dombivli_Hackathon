import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner@2.0.3';
import { 
  Eye, 
  Download, 
  ShoppingCart, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Shield, 
  Target, 
  Users, 
  Calendar,
  MessageSquare,
  ThumbsUp,
  AlertTriangle,
  CheckCircle,
  Play,
  X,
  Code,
  LineChart
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StrategyViewerProps {
  strategy: any;
  isOpen: boolean;
  onClose: () => void;
  onPurchase?: (strategy: any) => void;
  isPurchased?: boolean;
}

export function StrategyViewer({ strategy, isOpen, onClose, onPurchase, isPurchased = false }: StrategyViewerProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!strategy) return null;

  // Mock strategy blocks for demonstration
  const strategyBlocks = [
    { id: 'rsi-1', name: 'RSI', category: 'momentum', color: 'bg-blue-100 border-blue-300', settings: { period: 14, threshold: 30 } },
    { id: 'below-1', name: 'Below', category: 'comparison', color: 'bg-red-100 border-red-300', settings: { value: 30 } },
    { id: 'buy-1', name: 'Buy', category: 'trade', color: 'bg-green-100 border-green-300', settings: { quantity: 100, type: 'market' } },
    { id: 'stop-1', name: 'Stop Loss', category: 'risk', color: 'bg-red-100 border-red-300', settings: { percentage: 2.5 } }
  ];

  // Mock performance data
  const performanceData = [
    { date: 'Jan', value: 100000, benchmark: 100000 },
    { date: 'Feb', value: 108500, benchmark: 102000 },
    { date: 'Mar', value: 104200, benchmark: 101500 },
    { date: 'Apr', value: 116800, benchmark: 105000 },
    { date: 'May', value: 123400, benchmark: 106500 },
    { date: 'Jun', value: 124500, benchmark: 108000 }
  ];

  // Mock reviews
  const reviews = [
    { id: 1, user: 'TradePro', rating: 5, comment: 'Excellent strategy! Great returns with manageable risk.', date: '2024-01-15' },
    { id: 2, user: 'AlgoTrader23', rating: 4, comment: 'Works well but requires some optimization for different market conditions.', date: '2024-01-10' },
    { id: 3, user: 'QuantMaster', rating: 5, comment: 'Clean implementation, well-documented. Highly recommended!', date: '2024-01-05' }
  ];

  const handlePurchase = () => {
    if (onPurchase) {
      onPurchase(strategy);
      toast.success(`${strategy.name} ${strategy.price === 'Free' ? 'downloaded' : 'purchased'} successfully!`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{strategy.authorAvatar}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-xl">{strategy.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  by {strategy.author}
                  {strategy.verified && <Shield className="h-4 w-4 text-blue-500" />}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-2xl font-semibold">{strategy.price}</div>
                <div className="text-sm text-muted-foreground">
                  {strategy.downloads} downloads
                </div>
              </div>
              {!isPurchased ? (
                <Button onClick={handlePurchase}>
                  {strategy.price === 'Free' ? (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Purchase
                    </>
                  )}
                </Button>
              ) : (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Owned
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="author">Author</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Strategy Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{strategy.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Key Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• RSI-based momentum detection</li>
                      <li>• Dynamic risk management</li>
                      <li>• Multi-timeframe analysis</li>
                      <li>• Automated stop-loss protection</li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {strategy.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-semibold text-green-600">{strategy.returns}</div>
                      <div className="text-sm text-muted-foreground">Total Return</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-semibold text-blue-600">{strategy.sharpe}</div>
                      <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-semibold text-red-600">{strategy.maxDD}</div>
                      <div className="text-sm text-muted-foreground">Max Drawdown</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-semibold text-purple-600">{strategy.timeframe}</div>
                      <div className="text-sm text-muted-foreground">Timeframe</div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span>Complexity Level</span>
                      <Badge variant={strategy.complexity === 'Beginner' ? 'default' : 
                                   strategy.complexity === 'Intermediate' ? 'secondary' : 'destructive'}>
                        {strategy.complexity}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Community Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-semibold">{strategy.rating}</div>
                    <div className="flex justify-center my-2">
                      {[1,2,3,4,5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= Math.floor(strategy.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">{strategy.reviews} reviews</div>
                  </div>
                  
                  <div className="space-y-2">
                    {[5,4,3,2,1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2 text-sm">
                        <span className="w-8">{stars}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full" 
                            style={{ width: `${Math.random() * 100}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground w-8">{Math.floor(Math.random() * 50)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{strategy.downloads} downloads</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>Updated 2 days ago</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="h-4 w-4" />
                      <span>24/7 support</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Strategy Components
                </CardTitle>
                <CardDescription>
                  Visual breakdown of the strategy logic and components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Strategy Flow:</h4>
                    <div className="space-y-3">
                      {strategyBlocks.map((block, index) => (
                        <div key={block.id} className={`p-4 rounded-lg border ${block.color}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {block.category === 'momentum' && <TrendingUp className="h-4 w-4" />}
                              {block.category === 'comparison' && <BarChart3 className="h-4 w-4" />}
                              {block.category === 'trade' && <Target className="h-4 w-4" />}
                              {block.category === 'risk' && <Shield className="h-4 w-4" />}
                              <span className="font-medium">{block.name}</span>
                              <Badge variant="outline">{block.category}</Badge>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          {Object.keys(block.settings).length > 0 && (
                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              {Object.entries(block.settings).map(([key, value]) => (
                                <div key={key} className="bg-white/50 p-2 rounded">
                                  <div className="text-xs text-muted-foreground capitalize">{key}</div>
                                  <div className="font-medium">{value}</div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {index < strategyBlocks.length - 1 && (
                            <div className="flex justify-center mt-2">
                              <div className="w-px h-4 bg-gray-300" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Strategy Logic:</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>1. Monitor RSI indicator with 14-period setting</p>
                      <p>2. When RSI drops below 30 (oversold condition)</p>
                      <p>3. Execute buy order for 100 shares at market price</p>
                      <p>4. Set stop-loss at 2.5% below entry price</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Historical Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#2563eb" 
                        strokeWidth={2}
                        name="Strategy"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="benchmark" 
                        stroke="#6b7280" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Benchmark"
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-semibold text-green-600">156</div>
                    <div className="text-sm text-muted-foreground">Total Trades</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-semibold text-blue-600">68.5%</div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-semibold text-purple-600">1.85</div>
                    <div className="text-sm text-muted-foreground">Profit Factor</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-lg font-semibold text-orange-600">12.3%</div>
                    <div className="text-sm text-muted-foreground">Volatility</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.user}</span>
                        <div className="flex">
                          {[1,2,3,4,5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-3 w-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Helpful
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="author" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About the Author</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">{strategy.authorAvatar}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{strategy.author}</h3>
                      {strategy.verified && (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      Professional algorithmic trader with 8+ years of experience in quantitative strategies. 
                      Specialized in momentum and mean-reversion systems.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold">12</div>
                        <div className="text-sm text-muted-foreground">Strategies</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">4.7</div>
                        <div className="text-sm text-muted-foreground">Avg Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">5.2K</div>
                        <div className="text-sm text-muted-foreground">Downloads</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">2 years</div>
                        <div className="text-sm text-muted-foreground">Member</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}