import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner@2.0.3';
import { 
  Search, 
  Star, 
  Download, 
  Eye, 
  TrendingUp, 
  TrendingDown,
  Filter,
  Upload,
  DollarSign,
  Clock,
  Users,
  Award,
  Shield,
  Heart,
  MessageSquare,
  BarChart3,
  ShoppingCart,
  CheckCircle
} from 'lucide-react';
import { useApp } from '../App';
import { StrategyViewer } from './StrategyViewer';

const strategies = [
  {
    id: 1,
    name: 'RSI Divergence Pro',
    author: 'TradeMaster_AI',
    authorAvatar: 'TM',
    description: 'Advanced RSI divergence strategy with dynamic risk management',
    category: 'Momentum',
    price: 'Free',
    rating: 4.8,
    reviews: 234,
    downloads: 1520,
    returns: '+24.5%',
    sharpe: '1.92',
    maxDD: '-6.2%',
    timeframe: '15m',
    complexity: 'Intermediate',
    tags: ['RSI', 'Divergence', 'Risk Management'],
    verified: true,
    featured: true
  },
  {
    id: 2,
    name: 'Mean Reversion Scalper',
    author: 'QuickProfit',
    authorAvatar: 'QP',
    description: 'High-frequency mean reversion strategy for volatile markets',
    category: 'Scalping',
    price: '$29',
    rating: 4.6,
    reviews: 189,
    downloads: 892,
    returns: '+18.3%',
    sharpe: '1.45',
    maxDD: '-8.1%',
    timeframe: '1m',
    complexity: 'Advanced',
    tags: ['Mean Reversion', 'Scalping', 'High Frequency'],
    verified: true,
    featured: false
  },
  {
    id: 3,
    name: 'Breakout Momentum',
    author: 'BreakoutKing',
    authorAvatar: 'BK',
    description: 'Captures momentum breakouts with volume confirmation',
    category: 'Breakout',
    price: '$15',
    rating: 4.4,
    reviews: 156,
    downloads: 673,
    returns: '+31.2%',
    sharpe: '1.78',
    maxDD: '-12.4%',
    timeframe: '4h',
    complexity: 'Beginner',
    tags: ['Breakout', 'Volume', 'Momentum'],
    verified: false,
    featured: true
  },
  {
    id: 4,
    name: 'Grid Trading Bot',
    author: 'GridExpert',
    authorAvatar: 'GE',
    description: 'Automated grid trading system for sideways markets',
    category: 'Grid',
    price: '$45',
    rating: 4.2,
    reviews: 98,
    downloads: 445,
    returns: '+12.8%',
    sharpe: '1.23',
    maxDD: '-5.6%',
    timeframe: '1h',
    complexity: 'Intermediate',
    tags: ['Grid Trading', 'Sideways', 'Automation'],
    verified: true,
    featured: false
  },
  {
    id: 5,
    name: 'AI Sentiment Trader',
    author: 'SentimentBot',
    authorAvatar: 'SB',
    description: 'Uses AI to analyze market sentiment and news impact',
    category: 'AI/ML',
    price: '$99',
    rating: 4.9,
    reviews: 312,
    downloads: 1876,
    returns: '+42.1%',
    sharpe: '2.15',
    maxDD: '-9.8%',
    timeframe: '1d',
    complexity: 'Advanced',
    tags: ['AI', 'Sentiment', 'News Analysis'],
    verified: true,
    featured: true
  }
];

const categories = ['All', 'Momentum', 'Mean Reversion', 'Breakout', 'Scalping', 'Grid', 'AI/ML', 'Arbitrage'];
const complexityLevels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const priceRanges = ['All', 'Free', '$1-$20', '$21-$50', '$50+'];

export function Marketplace() {
  const { setSelectedStrategy, setShowStrategyDetail } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedComplexity, setSelectedComplexity] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [purchasedStrategies, setPurchasedStrategies] = useState<number[]>([]);
  const [viewingStrategy, setViewingStrategy] = useState<any>(null);
  const [showStrategyViewer, setShowStrategyViewer] = useState(false);

  const filteredStrategies = strategies.filter(strategy => {
    const matchesSearch = strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strategy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || strategy.category === selectedCategory;
    const matchesComplexity = selectedComplexity === 'All' || strategy.complexity === selectedComplexity;
    const matchesPrice = selectedPriceRange === 'All' || 
                        (selectedPriceRange === 'Free' && strategy.price === 'Free') ||
                        (selectedPriceRange === '$1-$20' && strategy.price !== 'Free' && parseInt(strategy.price.replace('$', '')) <= 20) ||
                        (selectedPriceRange === '$21-$50' && parseInt(strategy.price.replace('$', '')) > 20 && parseInt(strategy.price.replace('$', '')) <= 50) ||
                        (selectedPriceRange === '$50+' && parseInt(strategy.price.replace('$', '')) > 50);
    
    return matchesSearch && matchesCategory && matchesComplexity && matchesPrice;
  });

  const handleStrategyClick = (strategy: any) => {
    setViewingStrategy(strategy);
    setShowStrategyViewer(true);
  };

  const handleCloseViewer = () => {
    setShowStrategyViewer(false);
    setViewingStrategy(null);
  };

  const handleFavorite = (strategyId: number) => {
    setFavorites(prev => 
      prev.includes(strategyId) 
        ? prev.filter(id => id !== strategyId)
        : [...prev, strategyId]
    );
    toast.success(
      favorites.includes(strategyId) 
        ? 'Removed from favorites' 
        : 'Added to favorites'
    );
  };

  const handlePurchase = (strategy: any) => {
    if (strategy.price === 'Free') {
      setPurchasedStrategies(prev => [...prev, strategy.id]);
      toast.success(`${strategy.name} downloaded successfully!`);
    } else {
      setPurchasedStrategies(prev => [...prev, strategy.id]);
      toast.success(`${strategy.name} purchased successfully!`);
    }
  };

  return (
    <>
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Strategy Marketplace</h1>
          <p className="text-muted-foreground">Discover, share, and monetize trading strategies</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Strategy
          </Button>
          <Button size="sm">
            <DollarSign className="h-4 w-4 mr-2" />
            Sell Strategy
          </Button>
        </div>
      </div>

      {/* Featured Strategies Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-900">Featured Strategies</CardTitle>
          </div>
          <CardDescription className="text-blue-700">
            Hand-picked strategies with proven track records and community approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {strategies.filter(s => s.featured).slice(0, 3).map((strategy) => (
              <div key={strategy.id} className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm">{strategy.name}</h4>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{strategy.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600">{strategy.returns}</span>
                  <span className="text-blue-600">{strategy.price}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search strategies, authors, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Complexity" />
              </SelectTrigger>
              <SelectContent>
                {complexityLevels.map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range} value={range}>{range}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="downloads">Downloads</SelectItem>
                <SelectItem value="returns">Returns</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">Browse All</TabsTrigger>
          <TabsTrigger value="purchased">My Strategies</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredStrategies.length} strategies found
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStrategies.map((strategy) => (
              <Card 
                key={strategy.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleStrategyClick(strategy)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{strategy.authorAvatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-sm hover:text-primary transition-colors">{strategy.name}</h3>
                        <p className="text-xs text-muted-foreground">by {strategy.author}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {strategy.verified && (
                        <Shield className="h-4 w-4 text-blue-500" />
                      )}
                      {strategy.featured && (
                        <Star className="h-4 w-4 text-yellow-500" />
                      )}
                      {purchasedStrategies.includes(strategy.id) && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {strategy.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <p className="text-muted-foreground">Return</p>
                      <p className="text-green-600">{strategy.returns}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sharpe</p>
                      <p>{strategy.sharpe}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Max DD</p>
                      <p className="text-red-600">{strategy.maxDD}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{strategy.rating}</span>
                      <span>({strategy.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      <span>{strategy.downloads}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">{strategy.category}</Badge>
                    <Badge variant="outline">{strategy.complexity}</Badge>
                    <Badge variant="outline">{strategy.timeframe}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavorite(strategy.id);
                        }}
                        className={favorites.includes(strategy.id) ? 'text-red-500' : ''}
                      >
                        <Heart className={`h-4 w-4 ${favorites.includes(strategy.id) ? 'fill-current' : ''}`} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStrategyClick(strategy);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{strategy.price}</span>
                      {purchasedStrategies.includes(strategy.id) ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Owned
                        </Badge>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePurchase(strategy);
                          }}
                        >
                          {strategy.price === 'Free' ? (
                            <>
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Purchase
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="purchased">
          <Card>
            <CardHeader>
              <CardTitle>My Purchased Strategies</CardTitle>
              <CardDescription>Strategies you own and can deploy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg mb-2">No purchased strategies yet</h3>
                <p className="text-muted-foreground mb-4">
                  Browse the marketplace to find strategies that match your trading style
                </p>
                <Button>Browse Marketplace</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Strategies</CardTitle>
              <CardDescription>Strategies you've bookmarked for later</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-4">
                  Click the heart icon on strategies to add them to your favorites
                </p>
                <Button>Browse Strategies</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Downloads</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">1,247</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">$3,450</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Avg Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">4.6</div>
                <p className="text-xs text-muted-foreground">Based on 234 reviews</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">892</div>
                <p className="text-xs text-muted-foreground">Currently using strategies</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Marketplace Trends</CardTitle>
              <CardDescription>Popular categories and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm mb-3">Popular Categories</h4>
                    <div className="space-y-2">
                      {['Momentum', 'AI/ML', 'Breakout', 'Mean Reversion'].map((category, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{category}</span>
                          <Badge variant="outline">{Math.floor(Math.random() * 100) + 50} strategies</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm mb-3">Top Performers</h4>
                    <div className="space-y-2">
                      {strategies.slice(0, 4).map((strategy, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{strategy.name}</span>
                          <span className="text-sm text-green-600">{strategy.returns}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>

    <StrategyViewer
      strategy={viewingStrategy}
      isOpen={showStrategyViewer}
      onClose={handleCloseViewer}
      onPurchase={handlePurchase}
      isPurchased={viewingStrategy ? purchasedStrategies.includes(viewingStrategy.id) : false}
    />
    </>
  );
}