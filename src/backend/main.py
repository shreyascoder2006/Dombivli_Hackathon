"""
FastAPI Backend for Algorithmic Trading Platform
Main application entry point with CORS, WebSocket support, and API routing
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GzipMiddleware
import uvicorn
import asyncio
import json
from datetime import datetime
from typing import List, Dict, Any

from routers import strategies, backtesting, risk, performance, marketplace, auth, user
from database import engine, Base
from models import User, Strategy, BacktestResult
from websocket_manager import ConnectionManager
from market_data import MarketDataManager
from trading_engine import TradingEngine

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Stratify API",
    description="Algorithmic Trading Platform Backend",
    version="1.0.0"
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GzipMiddleware, minimum_size=1000)

# WebSocket connection manager
manager = ConnectionManager()
market_data = MarketDataManager()
trading_engine = TradingEngine()

# Include API routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(user.router, prefix="/api/user", tags=["user"])
app.include_router(strategies.router, prefix="/api/strategies", tags=["strategies"])
app.include_router(backtesting.router, prefix="/api/backtesting", tags=["backtesting"])
app.include_router(risk.router, prefix="/api/risk", tags=["risk"])
app.include_router(performance.router, prefix="/api/performance", tags=["performance"])
app.include_router(marketplace.router, prefix="/api/marketplace", tags=["marketplace"])

@app.get("/")
async def root():
    return {"message": "Stratify API", "status": "running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "database": "connected",
        "trading_engine": "active"
    }

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "subscribe_market_data":
                # Subscribe to real-time market data
                symbols = message.get("symbols", [])
                await market_data.subscribe_symbols(client_id, symbols)
            
            elif message["type"] == "strategy_signal":
                # Handle strategy signals
                await trading_engine.process_signal(message["data"])
                
    except WebSocketDisconnect:
        manager.disconnect(client_id)
        await market_data.unsubscribe_client(client_id)

# Background task for market data streaming
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(market_data.start_streaming())
    asyncio.create_task(trading_engine.start_monitoring())

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        ws_ping_interval=20,
        ws_ping_timeout=10
    )