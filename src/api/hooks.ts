/**
 * React hooks for API integration
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from './client';

// Generic hook for API calls with loading and error states
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Strategies hooks
export function useStrategies(userOnly: boolean = true) {
  return useApi(
    () => apiClient.getStrategies({ user_only: userOnly }),
    [userOnly]
  );
}

export function useStrategy(strategyId: string) {
  return useApi(
    () => apiClient.getStrategy(strategyId),
    [strategyId]
  );
}

export function useStrategyPerformance(strategyId: string, period: string = '1M') {
  return useApi(
    () => apiClient.getStrategyPerformance(strategyId, period),
    [strategyId, period]
  );
}

// Backtesting hooks
export function useBacktests(strategyId?: string, status?: string) {
  return useApi(
    () => apiClient.getBacktests({ strategy_id: strategyId, status }),
    [strategyId, status]
  );
}

export function useBacktest(backtestId: string) {
  return useApi(
    () => apiClient.getBacktest(backtestId),
    [backtestId]
  );
}

// User hooks
export function useCurrentUser() {
  return useApi(() => apiClient.getCurrentUser());
}

// Performance hooks
export function usePerformanceMetrics(period: string = '1M', strategyIds?: string[]) {
  return useApi(
    () => apiClient.getPerformanceMetrics({ period, strategy_ids: strategyIds }),
    [period, strategyIds]
  );
}

export function usePortfolioAnalytics() {
  return useApi(() => apiClient.getPortfolioAnalytics());
}

// Risk management hooks
export function useRiskMetrics(period: string = '1M', strategyId?: string) {
  return useApi(
    () => apiClient.getRiskMetrics({ period, strategy_id: strategyId }),
    [period, strategyId]
  );
}

// Marketplace hooks
export function useMarketplaceStrategies(
  category?: string,
  search?: string,
  sortBy?: string
) {
  return useApi(
    () => apiClient.getMarketplaceStrategies({
      category,
      search,
      sort_by: sortBy,
      limit: 50
    }),
    [category, search, sortBy]
  );
}

// Notifications hooks
export function useNotifications(unreadOnly: boolean = false) {
  return useApi(
    () => apiClient.getNotifications({ unread_only: unreadOnly }),
    [unreadOnly]
  );
}

// Custom hook for mutations (create, update, delete operations)
export function useMutation<T, P>(
  mutationFn: (params: P) => Promise<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn(params);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [mutationFn]);

  return { mutate, loading, error };
}

// Strategy mutations
export function useCreateStrategy() {
  return useMutation(apiClient.createStrategy.bind(apiClient));
}

export function useUpdateStrategy() {
  return useMutation(({ strategyId, updates }: { strategyId: string; updates: any }) =>
    apiClient.updateStrategy(strategyId, updates)
  );
}

export function useDeleteStrategy() {
  return useMutation((strategyId: string) =>
    apiClient.deleteStrategy(strategyId)
  );
}

export function useActivateStrategy() {
  return useMutation((strategyId: string) =>
    apiClient.activateStrategy(strategyId)
  );
}

export function useDeactivateStrategy() {
  return useMutation((strategyId: string) =>
    apiClient.deactivateStrategy(strategyId)
  );
}

export function useCloneStrategy() {
  return useMutation((strategyId: string) =>
    apiClient.cloneStrategy(strategyId)
  );
}

// Backtest mutations
export function useStartBacktest() {
  return useMutation(apiClient.startBacktest.bind(apiClient));
}

export function useDeleteBacktest() {
  return useMutation((backtestId: string) =>
    apiClient.deleteBacktest(backtestId)
  );
}

// Authentication mutations
export function useLogin() {
  return useMutation(({ email, password }: { email: string; password: string }) =>
    apiClient.login(email, password)
  );
}

export function useRegister() {
  return useMutation(apiClient.register.bind(apiClient));
}

// WebSocket hook for real-time data
export function useWebSocket(clientId: string, onMessage?: (data: any) => void) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = apiClient.createWebSocket(clientId);
    
    ws.onopen = () => {
      setConnected(true);
      console.log('WebSocket connected');
    };
    
    ws.onclose = () => {
      setConnected(false);
      console.log('WebSocket disconnected');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage?.(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    setSocket(ws);
    
    return () => {
      ws.close();
    };
  }, [clientId, onMessage]);

  const sendMessage = useCallback((message: any) => {
    if (socket && connected) {
      socket.send(JSON.stringify(message));
    }
  }, [socket, connected]);

  return { socket, connected, sendMessage };
}

// Real-time market data hook
export function useMarketData(symbols: string[]) {
  const [marketData, setMarketData] = useState<Record<string, any>>({});
  
  const handleMessage = useCallback((data: any) => {
    if (data.type === 'market_data') {
      setMarketData(prev => ({
        ...prev,
        [data.symbol]: data.data
      }));
    }
  }, []);

  const { connected, sendMessage } = useWebSocket('market-data', handleMessage);

  useEffect(() => {
    if (connected && symbols.length > 0) {
      sendMessage({
        type: 'subscribe_market_data',
        symbols
      });
    }
  }, [connected, symbols, sendMessage]);

  return { marketData, connected };
}