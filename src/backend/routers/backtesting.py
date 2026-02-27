"""
API endpoints for backtesting functionality
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, date
import asyncio

from database import get_db
from models import Strategy, BacktestResult, User
from auth import get_current_user
from trading_engine import TradingEngine

router = APIRouter()
trading_engine = TradingEngine()

class BacktestRequest(BaseModel):
    strategy_id: str
    start_date: date
    end_date: date
    initial_capital: float = 100000.0
    commission: float = 0.001  # 0.1%
    slippage: float = 0.0001   # 0.01%

class BacktestResponse(BaseModel):
    id: str
    strategy_id: str
    start_date: datetime
    end_date: datetime
    initial_capital: float
    status: str
    total_return: Optional[float]
    sharpe_ratio: Optional[float]
    max_drawdown: Optional[float]
    win_rate: Optional[float]
    total_trades: Optional[int]
    created_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class BacktestDetailResponse(BacktestResponse):
    equity_curve: Optional[list]
    trade_log: Optional[list]
    risk_metrics: Optional[dict]
    error_message: Optional[str]

@router.post("/", response_model=BacktestResponse)
async def start_backtest(
    backtest_request: BacktestRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Start a new backtest"""
    
    # Validate strategy exists and user has access
    strategy = db.query(Strategy).filter(Strategy.id == backtest_request.strategy_id).first()
    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    if strategy.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Validate date range
    if backtest_request.start_date >= backtest_request.end_date:
        raise HTTPException(status_code=400, detail="Start date must be before end date")
    
    # Create backtest result record
    backtest_result = BacktestResult(
        strategy_id=backtest_request.strategy_id,
        user_id=current_user.id,
        start_date=datetime.combine(backtest_request.start_date, datetime.min.time()),
        end_date=datetime.combine(backtest_request.end_date, datetime.min.time()),
        initial_capital=backtest_request.initial_capital,
        status="pending"
    )
    
    db.add(backtest_result)
    db.commit()
    db.refresh(backtest_result)
    
    # Start backtest in background
    background_tasks.add_task(
        run_backtest_task,
        backtest_result.id,
        backtest_request.strategy_id,
        datetime.combine(backtest_request.start_date, datetime.min.time()),
        datetime.combine(backtest_request.end_date, datetime.min.time()),
        backtest_request.initial_capital
    )
    
    return backtest_result

async def run_backtest_task(
    backtest_id: str,
    strategy_id: str,
    start_date: datetime,
    end_date: datetime,
    initial_capital: float
):
    """Background task to run backtest"""
    db = SessionLocal()
    try:
        # Update status to running
        backtest_result = db.query(BacktestResult).filter(BacktestResult.id == backtest_id).first()
        backtest_result.status = "running"
        db.commit()
        
        # Run backtest using trading engine
        result = await trading_engine.run_backtest(
            strategy_id=strategy_id,
            start_date=start_date,
            end_date=end_date,
            initial_capital=initial_capital
        )
        
        # Update result with backtest data
        backtest_result.total_return = result.get("total_return")
        backtest_result.sharpe_ratio = result.get("sharpe_ratio")
        backtest_result.max_drawdown = result.get("max_drawdown")
        backtest_result.total_trades = result.get("total_trades")
        backtest_result.win_rate = result.get("win_rate")
        backtest_result.status = "completed"
        backtest_result.completed_at = datetime.utcnow()
        
        # Store detailed results
        backtest_result.equity_curve = result.get("equity_curve", [])
        backtest_result.trade_log = result.get("trade_log", [])
        backtest_result.risk_metrics = result.get("risk_metrics", {})
        
        db.commit()
        
    except Exception as e:
        # Update status to failed
        backtest_result.status = "failed"
        backtest_result.error_message = str(e)
        backtest_result.completed_at = datetime.utcnow()
        db.commit()
        
    finally:
        db.close()

@router.get("/", response_model=List[BacktestResponse])
async def get_backtests(
    strategy_id: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's backtest results"""
    query = db.query(BacktestResult).filter(BacktestResult.user_id == current_user.id)
    
    if strategy_id:
        query = query.filter(BacktestResult.strategy_id == strategy_id)
    
    if status:
        query = query.filter(BacktestResult.status == status)
    
    backtests = query.order_by(BacktestResult.created_at.desc()).offset(skip).limit(limit).all()
    return backtests

@router.get("/{backtest_id}", response_model=BacktestDetailResponse)
async def get_backtest(
    backtest_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get detailed backtest results"""
    backtest = db.query(BacktestResult).filter(BacktestResult.id == backtest_id).first()
    
    if not backtest:
        raise HTTPException(status_code=404, detail="Backtest not found")
    
    if backtest.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return backtest

@router.delete("/{backtest_id}")
async def delete_backtest(
    backtest_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a backtest result"""
    backtest = db.query(BacktestResult).filter(BacktestResult.id == backtest_id).first()
    
    if not backtest:
        raise HTTPException(status_code=404, detail="Backtest not found")
    
    if backtest.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    db.delete(backtest)
    db.commit()
    
    return {"message": "Backtest deleted successfully"}

@router.post("/{backtest_id}/compare")
async def compare_backtests(
    backtest_id: str,
    compare_with: List[str],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Compare multiple backtest results"""
    
    # Get main backtest
    main_backtest = db.query(BacktestResult).filter(BacktestResult.id == backtest_id).first()
    if not main_backtest or main_backtest.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Backtest not found")
    
    # Get comparison backtests
    comparison_backtests = db.query(BacktestResult).filter(
        BacktestResult.id.in_(compare_with),
        BacktestResult.user_id == current_user.id
    ).all()
    
    if len(comparison_backtests) != len(compare_with):
        raise HTTPException(status_code=404, detail="One or more comparison backtests not found")
    
    # Create comparison data
    comparison_data = {
        "main_backtest": {
            "id": main_backtest.id,
            "strategy_name": main_backtest.strategy.name,
            "total_return": main_backtest.total_return,
            "sharpe_ratio": main_backtest.sharpe_ratio,
            "max_drawdown": main_backtest.max_drawdown,
            "win_rate": main_backtest.win_rate,
            "total_trades": main_backtest.total_trades
        },
        "comparisons": []
    }
    
    for bt in comparison_backtests:
        comparison_data["comparisons"].append({
            "id": bt.id,
            "strategy_name": bt.strategy.name,
            "total_return": bt.total_return,
            "sharpe_ratio": bt.sharpe_ratio,
            "max_drawdown": bt.max_drawdown,
            "win_rate": bt.win_rate,
            "total_trades": bt.total_trades
        })
    
    return comparison_data

@router.get("/{backtest_id}/equity-curve")
async def get_equity_curve(
    backtest_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get equity curve data for a backtest"""
    backtest = db.query(BacktestResult).filter(BacktestResult.id == backtest_id).first()
    
    if not backtest:
        raise HTTPException(status_code=404, detail="Backtest not found")
    
    if backtest.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if not backtest.equity_curve:
        raise HTTPException(status_code=404, detail="Equity curve data not available")
    
    return {
        "backtest_id": backtest_id,
        "equity_curve": backtest.equity_curve
    }

@router.get("/{backtest_id}/trades")
async def get_backtest_trades(
    backtest_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get trade log for a backtest"""
    backtest = db.query(BacktestResult).filter(BacktestResult.id == backtest_id).first()
    
    if not backtest:
        raise HTTPException(status_code=404, detail="Backtest not found")
    
    if backtest.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if not backtest.trade_log:
        raise HTTPException(status_code=404, detail="Trade log not available")
    
    return {
        "backtest_id": backtest_id,
        "trades": backtest.trade_log
    }

@router.post("/batch")
async def batch_backtest(
    strategy_ids: List[str],
    start_date: date,
    end_date: date,
    initial_capital: float = 100000.0,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Run backtests for multiple strategies"""
    
    # Validate all strategies exist and user has access
    strategies = db.query(Strategy).filter(
        Strategy.id.in_(strategy_ids),
        Strategy.owner_id == current_user.id
    ).all()
    
    if len(strategies) != len(strategy_ids):
        raise HTTPException(status_code=404, detail="One or more strategies not found")
    
    backtest_ids = []
    
    for strategy in strategies:
        # Create backtest result record
        backtest_result = BacktestResult(
            strategy_id=strategy.id,
            user_id=current_user.id,
            start_date=datetime.combine(start_date, datetime.min.time()),
            end_date=datetime.combine(end_date, datetime.min.time()),
            initial_capital=initial_capital,
            status="pending"
        )
        
        db.add(backtest_result)
        db.commit()
        db.refresh(backtest_result)
        
        backtest_ids.append(backtest_result.id)
        
        # Start backtest in background
        background_tasks.add_task(
            run_backtest_task,
            backtest_result.id,
            strategy.id,
            datetime.combine(start_date, datetime.min.time()),
            datetime.combine(end_date, datetime.min.time()),
            initial_capital
        )
    
    return {
        "message": f"Started {len(backtest_ids)} backtests",
        "backtest_ids": backtest_ids
    }