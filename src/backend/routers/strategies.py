"""
API endpoints for strategy management
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import json

from database import get_db
from models import Strategy, User
from auth import get_current_user

router = APIRouter()

class StrategyCreate(BaseModel):
    name: str
    description: Optional[str] = None
    strategy_type: str
    timeframe: str
    symbols: List[str]
    parameters: dict
    entry_conditions: List[dict]
    exit_conditions: List[dict]
    risk_management: dict
    strategy_code: Optional[str] = None

class StrategyUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    timeframe: Optional[str] = None
    symbols: Optional[List[str]] = None
    parameters: Optional[dict] = None
    entry_conditions: Optional[List[dict]] = None
    exit_conditions: Optional[List[dict]] = None
    risk_management: Optional[dict] = None
    strategy_code: Optional[str] = None
    is_active: Optional[bool] = None
    is_public: Optional[bool] = None

class StrategyResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    strategy_type: str
    timeframe: str
    symbols: List[str]
    is_active: bool
    is_public: bool
    performance_metrics: Optional[dict]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[StrategyResponse])
async def get_strategies(
    skip: int = 0,
    limit: int = 100,
    user_only: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get strategies (user's own or public strategies)"""
    query = db.query(Strategy)
    
    if user_only:
        query = query.filter(Strategy.owner_id == current_user.id)
    else:
        # Get public strategies or user's own strategies
        query = query.filter(
            (Strategy.is_public == True) | (Strategy.owner_id == current_user.id)
        )
    
    strategies = query.offset(skip).limit(limit).all()
    return strategies

@router.get("/{strategy_id}", response_model=StrategyResponse)
async def get_strategy(
    strategy_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific strategy"""
    strategy = db.query(Strategy).filter(Strategy.id == strategy_id).first()
    
    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    # Check if user has access to this strategy
    if strategy.owner_id != current_user.id and not strategy.is_public:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return strategy

@router.post("/", response_model=StrategyResponse)
async def create_strategy(
    strategy: StrategyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new strategy"""
    
    # Validate strategy configuration
    if not strategy.symbols:
        raise HTTPException(status_code=400, detail="At least one symbol is required")
    
    if not strategy.entry_conditions:
        raise HTTPException(status_code=400, detail="Entry conditions are required")
    
    # Create strategy
    db_strategy = Strategy(
        name=strategy.name,
        description=strategy.description,
        owner_id=current_user.id,
        strategy_type=strategy.strategy_type,
        timeframe=strategy.timeframe,
        symbols=strategy.symbols,
        parameters=strategy.parameters,
        entry_conditions=strategy.entry_conditions,
        exit_conditions=strategy.exit_conditions,
        risk_management=strategy.risk_management,
        strategy_code=strategy.strategy_code,
        performance_metrics={}
    )
    
    db.add(db_strategy)
    db.commit()
    db.refresh(db_strategy)
    
    return db_strategy

@router.put("/{strategy_id}", response_model=StrategyResponse)
async def update_strategy(
    strategy_id: str,
    strategy_update: StrategyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a strategy"""
    strategy = db.query(Strategy).filter(Strategy.id == strategy_id).first()
    
    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    if strategy.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Update fields
    update_data = strategy_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(strategy, field, value)
    
    strategy.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(strategy)
    
    return strategy

@router.delete("/{strategy_id}")
async def delete_strategy(
    strategy_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a strategy"""
    strategy = db.query(Strategy).filter(Strategy.id == strategy_id).first()
    
    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    if strategy.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    db.delete(strategy)
    db.commit()
    
    return {"message": "Strategy deleted successfully"}

@router.post("/{strategy_id}/activate")
async def activate_strategy(
    strategy_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Activate a strategy for live trading"""
    strategy = db.query(Strategy).filter(Strategy.id == strategy_id).first()
    
    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    if strategy.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Validate strategy before activation
    if not strategy.entry_conditions or not strategy.exit_conditions:
        raise HTTPException(status_code=400, detail="Strategy must have entry and exit conditions")
    
    strategy.is_active = True
    strategy.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Strategy activated successfully"}

@router.post("/{strategy_id}/deactivate")
async def deactivate_strategy(
    strategy_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Deactivate a strategy"""
    strategy = db.query(Strategy).filter(Strategy.id == strategy_id).first()
    
    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    if strategy.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    strategy.is_active = False
    strategy.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Strategy deactivated successfully"}

@router.post("/{strategy_id}/clone", response_model=StrategyResponse)
async def clone_strategy(
    strategy_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Clone a strategy"""
    original_strategy = db.query(Strategy).filter(Strategy.id == strategy_id).first()
    
    if not original_strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    # Check if user has access to clone this strategy
    if original_strategy.owner_id != current_user.id and not original_strategy.is_public:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Create cloned strategy
    cloned_strategy = Strategy(
        name=f"{original_strategy.name} (Copy)",
        description=original_strategy.description,
        owner_id=current_user.id,
        strategy_type=original_strategy.strategy_type,
        timeframe=original_strategy.timeframe,
        symbols=original_strategy.symbols.copy(),
        parameters=original_strategy.parameters.copy(),
        entry_conditions=original_strategy.entry_conditions.copy(),
        exit_conditions=original_strategy.exit_conditions.copy(),
        risk_management=original_strategy.risk_management.copy(),
        strategy_code=original_strategy.strategy_code,
        is_active=False,
        is_public=False,
        performance_metrics={}
    )
    
    db.add(cloned_strategy)
    db.commit()
    db.refresh(cloned_strategy)
    
    return cloned_strategy

@router.get("/{strategy_id}/performance")
async def get_strategy_performance(
    strategy_id: str,
    period: str = "1M",  # 1D, 1W, 1M, 3M, 1Y
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get strategy performance metrics"""
    strategy = db.query(Strategy).filter(Strategy.id == strategy_id).first()
    
    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    if strategy.owner_id != current_user.id and not strategy.is_public:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Calculate performance metrics based on period
    # This would typically query trade data and calculate metrics
    performance_data = {
        "strategy_id": strategy_id,
        "period": period,
        "total_return": 12.5,
        "sharpe_ratio": 1.8,
        "max_drawdown": -8.2,
        "win_rate": 65.4,
        "total_trades": 87,
        "profit_factor": 1.4,
        "equity_curve": [
            {"date": "2024-01-01", "value": 100000},
            {"date": "2024-01-02", "value": 101200},
            {"date": "2024-01-03", "value": 99800},
            # ... more data points
        ]
    }
    
    return performance_data