"""
SQLAlchemy models for the trading platform
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    account_type = Column(String, default="Basic")  # Basic, Pro, Enterprise
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Profile information
    trading_experience = Column(String)  # Beginner, Intermediate, Advanced
    risk_tolerance = Column(String)  # Low, Medium, High
    preferred_timeframes = Column(JSON)  # ["1h", "4h", "1d"]
    broker_connections = Column(JSON)  # ["Interactive Brokers", "Alpaca"]
    notification_settings = Column(JSON)
    
    # Portfolio metrics
    portfolio_value = Column(Float, default=0.0)
    total_return = Column(Float, default=0.0)
    
    # Relationships
    strategies = relationship("Strategy", back_populates="owner")
    backtest_results = relationship("BacktestResult", back_populates="user")
    risk_profiles = relationship("RiskProfile", back_populates="user")

class Strategy(Base):
    __tablename__ = "strategies"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(Text)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    # Strategy configuration
    strategy_type = Column(String)  # momentum, mean_reversion, arbitrage, etc.
    timeframe = Column(String)  # 1m, 5m, 1h, 4h, 1d
    symbols = Column(JSON)  # ["AAPL", "MSFT", "GOOGL"]
    parameters = Column(JSON)  # Strategy-specific parameters
    
    # Strategy code/logic
    strategy_code = Column(Text)  # Python code for the strategy
    entry_conditions = Column(JSON)
    exit_conditions = Column(JSON)
    risk_management = Column(JSON)
    
    # Status and performance
    is_active = Column(Boolean, default=False)
    is_public = Column(Boolean, default=False)
    performance_metrics = Column(JSON)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="strategies")
    backtest_results = relationship("BacktestResult", back_populates="strategy")

class BacktestResult(Base):
    __tablename__ = "backtest_results"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    strategy_id = Column(String, ForeignKey("strategies.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    # Backtest configuration
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    initial_capital = Column(Float, nullable=False)
    
    # Performance metrics
    total_return = Column(Float)
    sharpe_ratio = Column(Float)
    max_drawdown = Column(Float)
    win_rate = Column(Float)
    profit_factor = Column(Float)
    total_trades = Column(Integer)
    
    # Detailed results
    equity_curve = Column(JSON)  # Time series data
    trade_log = Column(JSON)  # Individual trade details
    risk_metrics = Column(JSON)
    
    # Status
    status = Column(String, default="pending")  # pending, running, completed, failed
    error_message = Column(Text)
    
    created_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime)
    
    # Relationships
    strategy = relationship("Strategy", back_populates="backtest_results")
    user = relationship("User", back_populates="backtest_results")

class RiskProfile(Base):
    __tablename__ = "risk_profiles"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    strategy_id = Column(String, ForeignKey("strategies.id"))
    
    # Risk limits
    max_position_size = Column(Float)  # Maximum position size as % of portfolio
    max_daily_loss = Column(Float)  # Maximum daily loss limit
    max_drawdown = Column(Float)  # Maximum allowed drawdown
    max_correlation = Column(Float)  # Maximum correlation between positions
    
    # Risk metrics
    var_95 = Column(Float)  # Value at Risk at 95% confidence
    expected_shortfall = Column(Float)
    beta = Column(Float)
    volatility = Column(Float)
    
    # Risk events
    risk_events = Column(JSON)  # Historical risk events
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="risk_profiles")

class MarketData(Base):
    __tablename__ = "market_data"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    symbol = Column(String, nullable=False, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    timeframe = Column(String, nullable=False)  # 1m, 5m, 1h, 1d
    
    # OHLCV data
    open = Column(Float, nullable=False)
    high = Column(Float, nullable=False)
    low = Column(Float, nullable=False)
    close = Column(Float, nullable=False)
    volume = Column(Float, nullable=False)
    
    # Additional data
    vwap = Column(Float)
    rsi = Column(Float)
    macd = Column(Float)
    bollinger_upper = Column(Float)
    bollinger_lower = Column(Float)
    
    created_at = Column(DateTime, server_default=func.now())

class Trade(Base):
    __tablename__ = "trades"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    strategy_id = Column(String, ForeignKey("strategies.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    # Trade details
    symbol = Column(String, nullable=False)
    side = Column(String, nullable=False)  # buy, sell
    quantity = Column(Float, nullable=False)
    entry_price = Column(Float)
    exit_price = Column(Float)
    
    # Timestamps
    entry_time = Column(DateTime)
    exit_time = Column(DateTime)
    
    # P&L
    realized_pnl = Column(Float)
    unrealized_pnl = Column(Float)
    commission = Column(Float)
    
    # Status
    status = Column(String, default="pending")  # pending, filled, partial, cancelled
    
    # Metadata
    trade_reason = Column(String)  # Signal that triggered the trade
    risk_metrics = Column(JSON)
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, nullable=False)  # info, warning, error, success
    is_read = Column(Boolean, default=False)
    
    # Optional metadata
    related_strategy_id = Column(String, ForeignKey("strategies.id"))
    related_trade_id = Column(String, ForeignKey("trades.id"))
    action_url = Column(String)
    
    created_at = Column(DateTime, server_default=func.now())
    read_at = Column(DateTime)