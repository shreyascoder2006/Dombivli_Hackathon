import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { 
  Plus, 
  Play, 
  Save, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Timer,
  Target,
  Shield,
  Lightbulb,
  Copy,
  Settings,
  FileText,
  TestTube,
  Volume2
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useApp } from '../App';

const indicatorBlocks = [
  { id: 'rsi', name: 'RSI', category: 'momentum', icon: TrendingUp, color: 'bg-blue-100 border-blue-300' },
  { id: 'macd', name: 'MACD', category: 'momentum', icon: BarChart3, color: 'bg-green-100 border-green-300' },
  { id: 'sma', name: 'SMA', category: 'trend', icon: TrendingUp, color: 'bg-purple-100 border-purple-300' },
  { id: 'ema', name: 'EMA', category: 'trend', icon: TrendingUp, color: 'bg-orange-100 border-orange-300' },
  { id: 'bb', name: 'Bollinger Bands', category: 'volatility', icon: BarChart3, color: 'bg-pink-100 border-pink-300' },
  { id: 'stoch', name: 'Stochastic', category: 'momentum', icon: TrendingDown, color: 'bg-cyan-100 border-cyan-300' },
  { id: 'volume', name: 'Volume', category: 'volume', icon: Volume2, color: 'bg-yellow-100 border-yellow-300' },
];

const conditionBlocks = [
  { id: 'above', name: 'Above', category: 'comparison', icon: TrendingUp, color: 'bg-green-100 border-green-300' },
  { id: 'below', name: 'Below', category: 'comparison', icon: TrendingDown, color: 'bg-red-100 border-red-300' },
  { id: 'crosses', name: 'Crosses Above', category: 'signal', icon: Target, color: 'bg-yellow-100 border-yellow-300' },
  { id: 'and', name: 'AND', category: 'logic', icon: Plus, color: 'bg-gray-100 border-gray-300' },
  { id: 'or', name: 'OR', category: 'logic', icon: Plus, color: 'bg-gray-100 border-gray-300' },
];

const actionBlocks = [
  { id: 'buy', name: 'Buy', category: 'trade', icon: TrendingUp, color: 'bg-green-100 border-green-300' },
  { id: 'sell', name: 'Sell', category: 'trade', icon: TrendingDown, color: 'bg-red-100 border-red-300' },
  { id: 'stop', name: 'Stop Loss', category: 'risk', icon: Shield, color: 'bg-red-100 border-red-300' },
  { id: 'target', name: 'Take Profit', category: 'risk', icon: Target, color: 'bg-green-100 border-green-300' },
];

interface DraggableBlockProps {
  block: any;
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({ block }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'block',
    item: { ...block },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const Icon = block.icon;

  return (
    <div
      ref={drag}
      className={`p-3 rounded-lg border-2 border-dashed cursor-move transition-all hover:shadow-md ${
        block.color
      } ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span className="text-sm">{block.name}</span>
      </div>
    </div>
  );
};

interface DroppableCanvasProps {
  droppedBlocks: any[];
  onDrop: (item: any) => void;
  onRemoveBlock: (blockId: string) => void;
  onUpdateBlock: (blockId: string, updates: any) => void;
}

const DroppableCanvas: React.FC<DroppableCanvasProps> = ({ 
  droppedBlocks, 
  onDrop, 
  onRemoveBlock, 
  onUpdateBlock 
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'block',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const updateBlockValue = (blockId: string, field: string, value: string) => {
    onUpdateBlock(blockId, { [field]: value });
  };

  const renderBlockInputs = (block: any) => {
    switch (block.id.split('-')[0]) {
      case 'rsi':
        return (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor={`${block.id}-period`} className="text-xs">Period</Label>
              <Input 
                id={`${block.id}-period`} 
                type="number"
                placeholder="14" 
                className="h-8"
                value={block.period || ''}
                onChange={(e) => updateBlockValue(block.id, 'period', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`${block.id}-threshold`} className="text-xs">Threshold</Label>
              <Input 
                id={`${block.id}-threshold`} 
                type="number"
                placeholder="70" 
                className="h-8"
                value={block.threshold || ''}
                onChange={(e) => updateBlockValue(block.id, 'threshold', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'sma':
      case 'ema':
        return (
          <div className="mt-3">
            <Label htmlFor={`${block.id}-period`} className="text-xs">Period</Label>
            <Input 
              id={`${block.id}-period`} 
              type="number"
              placeholder="20" 
              className="h-8"
              value={block.period || ''}
              onChange={(e) => updateBlockValue(block.id, 'period', e.target.value)}
            />
          </div>
        );
      
      case 'above':
      case 'below':
        return (
          <div className="mt-3">
            <Label htmlFor={`${block.id}-value`} className="text-xs">Comparison Value</Label>
            <Input 
              id={`${block.id}-value`} 
              type="number"
              step="0.01"
              placeholder="Enter value" 
              className="h-8"
              value={block.value || ''}
              onChange={(e) => updateBlockValue(block.id, 'value', e.target.value)}
            />
          </div>
        );
      
      case 'buy':
      case 'sell':
        return (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor={`${block.id}-quantity`} className="text-xs">Quantity</Label>
              <Input 
                id={`${block.id}-quantity`} 
                type="number"
                placeholder="100" 
                className="h-8"
                value={block.quantity || ''}
                onChange={(e) => updateBlockValue(block.id, 'quantity', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`${block.id}-price`} className="text-xs">Price ($)</Label>
              <Input 
                id={`${block.id}-price`} 
                type="number"
                step="0.01"
                placeholder="Market" 
                className="h-8"
                value={block.price || ''}
                onChange={(e) => updateBlockValue(block.id, 'price', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'stop':
        return (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor={`${block.id}-percentage`} className="text-xs">Stop Loss %</Label>
              <Input 
                id={`${block.id}-percentage`} 
                type="number"
                step="0.1"
                placeholder="2.0" 
                className="h-8"
                value={block.percentage || ''}
                onChange={(e) => updateBlockValue(block.id, 'percentage', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`${block.id}-price`} className="text-xs">Price ($)</Label>
              <Input 
                id={`${block.id}-price`} 
                type="number"
                step="0.01"
                placeholder="Optional" 
                className="h-8"
                value={block.price || ''}
                onChange={(e) => updateBlockValue(block.id, 'price', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'target':
        return (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor={`${block.id}-percentage`} className="text-xs">Take Profit %</Label>
              <Input 
                id={`${block.id}-percentage`} 
                type="number"
                step="0.1"
                placeholder="5.0" 
                className="h-8"
                value={block.percentage || ''}
                onChange={(e) => updateBlockValue(block.id, 'percentage', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`${block.id}-price`} className="text-xs">Price ($)</Label>
              <Input 
                id={`${block.id}-price`} 
                type="number"
                step="0.01"
                placeholder="Optional" 
                className="h-8"
                value={block.price || ''}
                onChange={(e) => updateBlockValue(block.id, 'price', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'bb':
        return (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor={`${block.id}-period`} className="text-xs">Period</Label>
              <Input 
                id={`${block.id}-period`} 
                type="number"
                placeholder="20" 
                className="h-8"
                value={block.period || ''}
                onChange={(e) => updateBlockValue(block.id, 'period', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`${block.id}-deviation`} className="text-xs">Std Dev</Label>
              <Input 
                id={`${block.id}-deviation`} 
                type="number"
                step="0.1"
                placeholder="2.0" 
                className="h-8"
                value={block.deviation || ''}
                onChange={(e) => updateBlockValue(block.id, 'deviation', e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={drop}
      className={`min-h-96 p-6 border-2 border-dashed rounded-lg transition-colors ${
        isOver ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'
      }`}
    >
      {droppedBlocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Plus className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg text-muted-foreground">Drag blocks here to build your strategy</h3>
          <p className="text-sm text-muted-foreground">Start with indicators, add conditions, then define actions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {droppedBlocks.map((block, index) => {
            const Icon = block.icon;
            return (
              <div key={block.id} className={`p-4 rounded-lg border ${block.color}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{block.name}</span>
                    <Badge variant="outline">{block.category}</Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onRemoveBlock(block.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                {renderBlockInputs(block)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export function StrategyBuilder() {
  const { setActiveTab, strategies, setStrategies } = useApp();
  const [droppedBlocks, setDroppedBlocks] = useState<any[]>([]);
  const [strategyName, setStrategyName] = useState('');
  const [strategyDescription, setStrategyDescription] = useState('');
  const [timeframe, setTimeframe] = useState('1h');
  const [symbols, setSymbols] = useState('AAPL,MSFT,GOOGL');
  const [aiSuggestions, setAiSuggestions] = useState([
    {
      id: 1,
      text: 'Consider adding a stop-loss condition for risk management',
      blocks: [{ id: 'stop', name: 'Stop Loss', category: 'risk', icon: Shield, color: 'bg-red-100 border-red-300' }]
    },
    {
      id: 2,
      text: 'RSI divergence could improve entry signals',
      blocks: [{ id: 'rsi', name: 'RSI', category: 'momentum', icon: TrendingUp, color: 'bg-blue-100 border-blue-300' }]
    },
    {
      id: 3,
      text: 'Volume confirmation might reduce false signals',
      blocks: [{ id: 'volume', name: 'Volume', category: 'volume', icon: Volume2, color: 'bg-yellow-100 border-yellow-300' }]
    }
  ]);

  const handleDrop = (item: any) => {
    const newBlock = { ...item, id: `${item.id}-${Date.now()}` };
    setDroppedBlocks(prev => [...prev, newBlock]);
    toast.success(`Added ${item.name} to strategy`);
    
    // Update AI suggestions based on added block
    updateAISuggestions(newBlock);
  };

  const updateAISuggestions = (newBlock: any) => {
    const currentBlockTypes = droppedBlocks.map(b => b.id.split('-')[0]);
    const newBlockType = newBlock.id.split('-')[0];
    
    // Generate contextual suggestions
    const contextualSuggestions = [];
    
    if (newBlockType === 'rsi' && !currentBlockTypes.includes('stop')) {
      contextualSuggestions.push({
        id: Date.now() + 1,
        text: 'Add stop-loss protection for your RSI strategy',
        blocks: [{ id: 'stop', name: 'Stop Loss', category: 'risk', icon: Shield, color: 'bg-red-100 border-red-300' }]
      });
    }
    
    if ((newBlockType === 'buy' || newBlockType === 'sell') && !currentBlockTypes.includes('target')) {
      contextualSuggestions.push({
        id: Date.now() + 2,
        text: 'Consider adding take-profit levels',
        blocks: [{ id: 'target', name: 'Take Profit', category: 'risk', icon: Target, color: 'bg-green-100 border-green-300' }]
      });
    }
    
    if (contextualSuggestions.length > 0) {
      setAiSuggestions(prev => [...contextualSuggestions, ...prev.slice(0, 2)]);
    }
  };

  const clearCanvas = () => {
    setDroppedBlocks([]);
    toast.info('Strategy canvas cleared');
  };

  const removeBlock = (blockId: string) => {
    setDroppedBlocks(prev => prev.filter(block => block.id !== blockId));
    toast.info('Block removed from strategy');
  };

  const updateBlock = (blockId: string, updates: any) => {
    setDroppedBlocks(prev => 
      prev.map(block => 
        block.id === blockId ? { ...block, ...updates } : block
      )
    );
  };

  const saveStrategy = () => {
    if (!strategyName.trim()) {
      toast.error('Please enter a strategy name');
      return;
    }
    if (droppedBlocks.length === 0) {
      toast.error('Please add some blocks to your strategy');
      return;
    }
    
    const newStrategy = {
      id: Date.now().toString(),
      name: strategyName,
      description: strategyDescription,
      type: droppedBlocks.find(b => b.category === 'momentum') ? 'Momentum' : 'Custom',
      timeframe: timeframe,
      symbols: symbols.split(',').map(s => s.trim()),
      status: 'Inactive' as const,
      performance: { return: 0, sharpe: 0, maxDrawdown: 0 },
      created: new Date(),
      lastModified: new Date(),
      blocks: droppedBlocks
    };
    
    setStrategies(prev => [...prev, newStrategy]);
    toast.success('Strategy saved successfully!');
    
    // Clear form
    setStrategyName('');
    setStrategyDescription('');
    setDroppedBlocks([]);
  };

  const runBacktest = () => {
    if (droppedBlocks.length === 0) {
      toast.error('Please build your strategy first');
      return;
    }
    toast.success('Starting backtest...');
    setActiveTab('backtesting');
  };

  const applySuggestion = (suggestion: any) => {
    suggestion.blocks.forEach((block: any) => {
      const newBlock = { ...block, id: `${block.id}-${Date.now()}` };
      setDroppedBlocks(prev => [...prev, newBlock]);
    });
    
    // Remove applied suggestion
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    toast.success('AI suggestion applied!');
  };

  const loadTemplate = (templateName: string) => {
    setDroppedBlocks([]);
    
    if (templateName === 'RSI Oversold') {
      const rsiBlock = { ...indicatorBlocks[0], id: `rsi-${Date.now()}`, period: '14', threshold: '30' };
      const belowBlock = { ...conditionBlocks[1], id: `below-${Date.now()}`, value: '30' };
      const buyBlock = { ...actionBlocks[0], id: `buy-${Date.now()}`, quantity: '100' };
      setDroppedBlocks([rsiBlock, belowBlock, buyBlock]);
      setStrategyName('RSI Oversold Strategy');
      setStrategyDescription('Buy when RSI goes below 30');
    } else if (templateName === 'Moving Average Cross') {
      const smaBlock = { ...indicatorBlocks[2], id: `sma-${Date.now()}`, period: '50' };
      const emaBlock = { ...indicatorBlocks[3], id: `ema-${Date.now()}`, period: '20' };
      const crossBlock = { ...conditionBlocks[2], id: `cross-${Date.now()}` };
      const buyBlock = { ...actionBlocks[0], id: `buy-${Date.now()}`, quantity: '100' };
      setDroppedBlocks([smaBlock, emaBlock, crossBlock, buyBlock]);
      setStrategyName('MA Cross Strategy');
      setStrategyDescription('Buy when fast MA crosses above slow MA');
    }
    
    toast.success(`${templateName} template loaded!`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1>Strategy Builder</h1>
            <p className="text-muted-foreground">Build algorithmic trading strategies with drag & drop</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearCanvas}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button variant="outline" size="sm" onClick={saveStrategy}>
              <Save className="h-4 w-4 mr-2" />
              Save Strategy
            </Button>
            <Button size="sm" onClick={runBacktest}>
              <TestTube className="h-4 w-4 mr-2" />
              Backtest
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Block Library */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Indicators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {indicatorBlocks.map((block) => (
                  <DraggableBlock key={block.id} block={block} />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {conditionBlocks.map((block) => (
                  <DraggableBlock key={block.id} block={block} />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {actionBlocks.map((block) => (
                  <DraggableBlock key={block.id} block={block} />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Strategy Canvas */}
          <div className="lg:col-span-2 space-y-4">
            {/* Strategy Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Strategy Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="strategy-name">Strategy Name</Label>
                    <Input
                      id="strategy-name"
                      placeholder="My RSI Strategy"
                      value={strategyName}
                      onChange={(e) => setStrategyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeframe">Timeframe</Label>
                    <select 
                      id="timeframe"
                      className="w-full p-2 border rounded-md"
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                    >
                      <option value="1m">1 Minute</option>
                      <option value="5m">5 Minutes</option>
                      <option value="15m">15 Minutes</option>
                      <option value="1h">1 Hour</option>
                      <option value="4h">4 Hours</option>
                      <option value="1d">1 Day</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="strategy-description">Description</Label>
                  <Input
                    id="strategy-description"
                    placeholder="Describe your strategy..."
                    value={strategyDescription}
                    onChange={(e) => setStrategyDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symbols">Symbols (comma separated)</Label>
                  <Input
                    id="symbols"
                    placeholder="AAPL,MSFT,GOOGL"
                    value={symbols}
                    onChange={(e) => setSymbols(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Canvas */}
            <Card>
              <CardHeader>
                <CardTitle>Strategy Canvas</CardTitle>
                <CardDescription>Drag blocks from the left panel to build your strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <DroppableCanvas 
                  droppedBlocks={droppedBlocks} 
                  onDrop={handleDrop}
                  onRemoveBlock={removeBlock}
                  onUpdateBlock={updateBlock}
                />
              </CardContent>
            </Card>
          </div>

          {/* AI Suggestions & Templates */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-3 border rounded-lg">
                    <p className="text-sm mb-2">{suggestion.text}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => applySuggestion(suggestion)}
                      className="w-full"
                    >
                      Apply
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Copy className="h-5 w-5" />
                  Quick Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => loadTemplate('RSI Oversold')}
                >
                  RSI Oversold
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => loadTemplate('Moving Average Cross')}
                >
                  MA Cross
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => {
                    toast.info('More templates coming soon!');
                  }}
                >
                  Breakout Strategy
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}