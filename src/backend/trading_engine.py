"""
Trading Engine using Backtrader for strategy execution and backtesting
"""

import backtrader as bt
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import asyncio
import json
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import yfinance as yf
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Strategy, BacktestResult, Trade, MarketData

@dataclass
class TradingSignal:
    strategy_id: str
    symbol: str
    action: str  # 'buy', 'sell', 'hold'
    quantity: float
    price: float
    timestamp: datetime
    confidence: float
    reason: str

class StratifyStrategy(bt.Strategy):
    """Base strategy class that wraps user-defined strategies"""
    
    params = (
        ('strategy_config', {}),
        ('risk_config', {}),
    )
    
    def __init__(self):
        self.strategy_config = self.params.strategy_config
        self.risk_config = self.params.risk_config
        self.signals = []
        
        # Initialize indicators based on strategy config
        self.setup_indicators()
    
    def setup_indicators(self):
        """Setup indicators based on strategy configuration"""
        indicators = self.strategy_config.get('indicators', {})
        
        # Common indicators
        if 'sma' in indicators:
            self.sma = bt.indicators.SimpleMovingAverage(
                self.data.close, period=indicators['sma']['period']
            )
        
        if 'rsi' in indicators:
            self.rsi = bt.indicators.RSI(
                self.data.close, period=indicators['rsi']['period']
            )
        
        if 'macd' in indicators:
            self.macd = bt.indicators.MACD(self.data.close)
        
        if 'bollinger' in indicators:
            self.bollinger = bt.indicators.BollingerBands(
                self.data.close, period=indicators['bollinger']['period']
            )
    
    def next(self):
        """Main strategy logic called on each bar"""
        try:
            # Execute user-defined strategy logic
            signal = self.evaluate_strategy()
            
            if signal:
                self.execute_signal(signal)
                
        except Exception as e:
            self.log(f'Strategy error: {str(e)}')
    
    def evaluate_strategy(self) -> Optional[TradingSignal]:
        """Evaluate strategy conditions and generate signals"""
        entry_conditions = self.strategy_config.get('entry_conditions', [])
        exit_conditions = self.strategy_config.get('exit_conditions', [])
        
        # Check entry conditions
        if not self.position and self.check_conditions(entry_conditions):
            return TradingSignal(
                strategy_id=self.strategy_config['id'],
                symbol=self.data._name,
                action='buy',
                quantity=self.calculate_position_size(),
                price=self.data.close[0],
                timestamp=self.data.datetime.datetime(0),
                confidence=0.8,
                reason='Entry conditions met'
            )
        
        # Check exit conditions
        if self.position and self.check_conditions(exit_conditions):
            return TradingSignal(
                strategy_id=self.strategy_config['id'],
                symbol=self.data._name,
                action='sell',
                quantity=abs(self.position.size),
                price=self.data.close[0],
                timestamp=self.data.datetime.datetime(0),
                confidence=0.9,
                reason='Exit conditions met'
            )
        
        return None
    
    def check_conditions(self, conditions: List[Dict]) -> bool:
        """Check if a list of conditions are met"""
        for condition in conditions:
            if not self.evaluate_condition(condition):
                return False
        return True
    
    def evaluate_condition(self, condition: Dict) -> bool:
        """Evaluate a single condition"""
        indicator = condition['indicator']
        operator = condition['operator']
        value = condition['value']
        
        if indicator == 'rsi':
            current_value = self.rsi[0]
        elif indicator == 'sma':
            current_value = self.sma[0]
        elif indicator == 'price':
            current_value = self.data.close[0]
        else:
            return False
        
        if operator == '>':
            return current_value > value
        elif operator == '<':
            return current_value < value
        elif operator == '>=':
            return current_value >= value
        elif operator == '<=':
            return current_value <= value
        elif operator == '==':
            return abs(current_value - value) < 0.01
        
        return False
    
    def calculate_position_size(self) -> float:
        """Calculate position size based on risk management rules"""
        risk_config = self.risk_config
        portfolio_value = self.broker.getvalue()
        
        # Risk per trade (default 2% of portfolio)
        risk_per_trade = risk_config.get('risk_per_trade', 0.02)
        max_position_size = risk_config.get('max_position_size', 0.1)
        
        # Calculate position size
        risk_amount = portfolio_value * risk_per_trade
        position_value = min(risk_amount / 0.02, portfolio_value * max_position_size)
        
        return position_value / self.data.close[0]
    
    def execute_signal(self, signal: TradingSignal):
        """Execute trading signal"""
        if signal.action == 'buy':
            self.buy(size=signal.quantity)
        elif signal.action == 'sell':
            self.sell(size=signal.quantity)
        
        self.signals.append(signal)
    
    def log(self, txt, dt=None):
        """Logging function"""
        dt = dt or self.datas[0].datetime.date(0)
        print(f'{dt.isoformat()}: {txt}')

class TradingEngine:
    """Main trading engine for backtesting and live trading"""
    
    def __init__(self):
        self.active_strategies: Dict[str, bt.Cerebro] = {}
        self.data_feeds: Dict[str, bt.feeds.PandasData] = {}
        
    async def start_monitoring(self):
        """Start monitoring active strategies"""
        while True:
            try:
                await self.check_active_strategies()
                await asyncio.sleep(60)  # Check every minute
            except Exception as e:
                print(f"Error in strategy monitoring: {e}")
                await asyncio.sleep(60)
    
    async def check_active_strategies(self):
        """Check and update active strategies"""
        db = SessionLocal()
        try:
            active_strategies = db.query(Strategy).filter(Strategy.is_active == True).all()
            
            for strategy in active_strategies:
                if strategy.id not in self.active_strategies:
                    await self.start_strategy(strategy)
                    
        finally:
            db.close()
    
    async def start_strategy(self, strategy: Strategy):
        """Start a strategy for live trading"""
        try:
            cerebro = bt.Cerebro()
            
            # Add strategy
            cerebro.addstrategy(
                StratifyStrategy,
                strategy_config=strategy.parameters,
                risk_config=strategy.risk_management
            )
            
            # Add data feeds for strategy symbols
            for symbol in strategy.symbols:
                data_feed = await self.get_data_feed(symbol, strategy.timeframe)
                cerebro.adddata(data_feed, name=symbol)
            
            # Set initial capital
            cerebro.broker.setcash(100000.0)
            
            # Add analyzers
            cerebro.addanalyzer(bt.analyzers.SharpeRatio, _name='sharpe')
            cerebro.addanalyzer(bt.analyzers.DrawDown, _name='drawdown')
            cerebro.addanalyzer(bt.analyzers.Returns, _name='returns')
            
            self.active_strategies[strategy.id] = cerebro
            
        except Exception as e:
            print(f"Error starting strategy {strategy.id}: {e}")
    
    async def get_data_feed(self, symbol: str, timeframe: str) -> bt.feeds.PandasData:
        """Get data feed for a symbol"""
        if f"{symbol}_{timeframe}" in self.data_feeds:
            return self.data_feeds[f"{symbol}_{timeframe}"]
        
        # Download data using yfinance
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)
        
        data = yf.download(symbol, start=start_date, end=end_date, interval=timeframe)
        
        # Create Backtrader data feed
        data_feed = bt.feeds.PandasData(
            dataname=data,
            datetime=None,
            open='Open',
            high='High',
            low='Low',
            close='Close',
            volume='Volume',
            openinterest=None
        )
        
        self.data_feeds[f"{symbol}_{timeframe}"] = data_feed
        return data_feed
    
    async def run_backtest(self, strategy_id: str, start_date: datetime, end_date: datetime, initial_capital: float) -> Dict[str, Any]:
        """Run a backtest for a strategy"""
        db = SessionLocal()
        try:
            strategy = db.query(Strategy).filter(Strategy.id == strategy_id).first()
            if not strategy:
                raise ValueError(f"Strategy {strategy_id} not found")
            
            # Create backtest result record
            backtest_result = BacktestResult(
                strategy_id=strategy_id,
                user_id=strategy.owner_id,
                start_date=start_date,
                end_date=end_date,
                initial_capital=initial_capital,
                status="running"
            )
            db.add(backtest_result)
            db.commit()
            
            # Run backtest
            cerebro = bt.Cerebro()
            
            # Add strategy
            cerebro.addstrategy(
                TradeCraftStrategy,
                strategy_config=strategy.parameters,
                risk_config=strategy.risk_management
            )
            
            # Add data feeds
            for symbol in strategy.symbols:
                data = await self.get_historical_data(symbol, start_date, end_date, strategy.timeframe)
                data_feed = bt.feeds.PandasData(dataname=data)
                cerebro.adddata(data_feed, name=symbol)
            
            # Set initial capital
            cerebro.broker.setcash(initial_capital)
            
            # Add analyzers
            cerebro.addanalyzer(bt.analyzers.SharpeRatio, _name='sharpe')
            cerebro.addanalyzer(bt.analyzers.DrawDown, _name='drawdown')
            cerebro.addanalyzer(bt.analyzers.Returns, _name='returns')
            cerebro.addanalyzer(bt.analyzers.TradeAnalyzer, _name='trades')
            
            # Run backtest
            results = cerebro.run()
            final_value = cerebro.broker.getvalue()
            
            # Extract performance metrics
            strategy_instance = results[0]
            sharpe = strategy_instance.analyzers.sharpe.get_analysis()
            drawdown = strategy_instance.analyzers.drawdown.get_analysis()
            returns = strategy_instance.analyzers.returns.get_analysis()
            trades = strategy_instance.analyzers.trades.get_analysis()
            
            # Update backtest result
            backtest_result.total_return = ((final_value - initial_capital) / initial_capital) * 100
            backtest_result.sharpe_ratio = sharpe.get('sharperatio', 0)
            backtest_result.max_drawdown = drawdown.get('max', {}).get('drawdown', 0)
            backtest_result.total_trades = trades.get('total', {}).get('total', 0)
            backtest_result.win_rate = trades.get('won', {}).get('total', 0) / max(trades.get('total', {}).get('total', 1), 1) * 100
            backtest_result.status = "completed"
            backtest_result.completed_at = datetime.utcnow()
            
            db.commit()
            
            return {
                "backtest_id": backtest_result.id,
                "total_return": backtest_result.total_return,
                "sharpe_ratio": backtest_result.sharpe_ratio,
                "max_drawdown": backtest_result.max_drawdown,
                "total_trades": backtest_result.total_trades,
                "win_rate": backtest_result.win_rate,
                "final_value": final_value,
                "initial_capital": initial_capital
            }
            
        except Exception as e:
            if 'backtest_result' in locals():
                backtest_result.status = "failed"
                backtest_result.error_message = str(e)
                db.commit()
            raise e
        finally:
            db.close()
    
    async def get_historical_data(self, symbol: str, start_date: datetime, end_date: datetime, timeframe: str) -> pd.DataFrame:
        """Get historical data for backtesting"""
        # Map timeframe to yfinance interval
        interval_map = {
            '1m': '1m',
            '5m': '5m',
            '15m': '15m',
            '1h': '1h',
            '4h': '4h',
            '1d': '1d'
        }
        
        interval = interval_map.get(timeframe, '1d')
        data = yf.download(symbol, start=start_date, end=end_date, interval=interval)
        
        return data
    
    async def process_signal(self, signal_data: Dict[str, Any]):
        """Process incoming trading signals"""
        try:
            signal = TradingSignal(**signal_data)
            
            # Validate signal
            if not await self.validate_signal(signal):
                return
            
            # Execute signal in live trading (if enabled)
            await self.execute_live_signal(signal)
            
        except Exception as e:
            print(f"Error processing signal: {e}")
    
    async def validate_signal(self, signal: TradingSignal) -> bool:
        """Validate trading signal against risk rules"""
        # Add risk validation logic here
        return True
    
    async def execute_live_signal(self, signal: TradingSignal):
        """Execute signal in live trading environment"""
        # This would integrate with broker APIs (Interactive Brokers, Alpaca, etc.)
        # For now, just log the signal
        print(f"Live Signal: {signal.action} {signal.quantity} {signal.symbol} at {signal.price}")
        
        # Store trade in database
        db = SessionLocal()
        try:
            trade = Trade(
                strategy_id=signal.strategy_id,
                user_id="user_id",  # Get from signal context
                symbol=signal.symbol,
                side=signal.action,
                quantity=signal.quantity,
                entry_price=signal.price,
                entry_time=signal.timestamp,
                status="pending",
                trade_reason=signal.reason
            )
            db.add(trade)
            db.commit()
        finally:
            db.close()