/**
 * API client for Stratify backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request<{ access_token: string; token_type: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.setToken(response.access_token);
    return response;
  }

  async register(userData: {
    email: string;
    password: string;
    username: string;
    full_name?: string;
  }) {
    return this.request<{ user: any; access_token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    this.clearToken();
    return this.request('/auth/logout', { method: 'POST' });
  }

  // User management
  async getCurrentUser() {
    return this.request<any>('/user/me');
  }

  async updateUser(userData: Partial<any>) {
    return this.request<any>('/user/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Strategies
  async getStrategies(params?: { skip?: number; limit?: number; user_only?: boolean }) {
    const searchParams = new URLSearchParams();
    if (params?.skip) searchParams.set('skip', params.skip.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.user_only !== undefined) searchParams.set('user_only', params.user_only.toString());
    
    const url = `/strategies${searchParams.toString() ? `?${searchParams}` : ''}`;
    return this.request<any[]>(url);
  }

  async getStrategy(strategyId: string) {
    return this.request<any>(`/strategies/${strategyId}`);
  }

  async createStrategy(strategyData: {
    name: string;
    description?: string;
    strategy_type: string;
    timeframe: string;
    symbols: string[];
    parameters: Record<string, any>;
    entry_conditions: any[];
    exit_conditions: any[];
    risk_management: Record<string, any>;
    strategy_code?: string;
  }) {
    return this.request<any>('/strategies', {
      method: 'POST',
      body: JSON.stringify(strategyData),
    });
  }

  async updateStrategy(strategyId: string, updates: Partial<any>) {
    return this.request<any>(`/strategies/${strategyId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteStrategy(strategyId: string) {
    return this.request(`/strategies/${strategyId}`, { method: 'DELETE' });
  }

  async activateStrategy(strategyId: string) {
    return this.request(`/strategies/${strategyId}/activate`, { method: 'POST' });
  }

  async deactivateStrategy(strategyId: string) {
    return this.request(`/strategies/${strategyId}/deactivate`, { method: 'POST' });
  }

  async cloneStrategy(strategyId: string) {
    return this.request<any>(`/strategies/${strategyId}/clone`, { method: 'POST' });
  }

  async getStrategyPerformance(strategyId: string, period: string = '1M') {
    return this.request<any>(`/strategies/${strategyId}/performance?period=${period}`);
  }

  // Backtesting
  async startBacktest(backtestData: {
    strategy_id: string;
    start_date: string;
    end_date: string;
    initial_capital?: number;
    commission?: number;
    slippage?: number;
  }) {
    return this.request<any>('/backtesting', {
      method: 'POST',
      body: JSON.stringify(backtestData),
    });
  }

  async getBacktests(params?: {
    strategy_id?: string;
    status?: string;
    skip?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.strategy_id) searchParams.set('strategy_id', params.strategy_id);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.skip) searchParams.set('skip', params.skip.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    const url = `/backtesting${searchParams.toString() ? `?${searchParams}` : ''}`;
    return this.request<any[]>(url);
  }

  async getBacktest(backtestId: string) {
    return this.request<any>(`/backtesting/${backtestId}`);
  }

  async deleteBacktest(backtestId: string) {
    return this.request(`/backtesting/${backtestId}`, { method: 'DELETE' });
  }

  async compareBacktests(backtestId: string, compareWith: string[]) {
    return this.request<any>(`/backtesting/${backtestId}/compare`, {
      method: 'POST',
      body: JSON.stringify(compareWith),
    });
  }

  async getEquityCurve(backtestId: string) {
    return this.request<any>(`/backtesting/${backtestId}/equity-curve`);
  }

  async getBacktestTrades(backtestId: string) {
    return this.request<any>(`/backtesting/${backtestId}/trades`);
  }

  async batchBacktest(data: {
    strategy_ids: string[];
    start_date: string;
    end_date: string;
    initial_capital?: number;
  }) {
    return this.request<any>('/backtesting/batch', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Risk Management
  async getRiskMetrics(params?: { period?: string; strategy_id?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.set('period', params.period);
    if (params?.strategy_id) searchParams.set('strategy_id', params.strategy_id);
    
    const url = `/risk/metrics${searchParams.toString() ? `?${searchParams}` : ''}`;
    return this.request<any>(url);
  }

  async updateRiskLimits(riskData: {
    max_position_size?: number;
    max_daily_loss?: number;
    max_drawdown?: number;
    max_correlation?: number;
  }) {
    return this.request<any>('/risk/limits', {
      method: 'PUT',
      body: JSON.stringify(riskData),
    });
  }

  // Performance Analytics
  async getPerformanceMetrics(params?: { period?: string; strategy_ids?: string[] }) {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.set('period', params.period);
    if (params?.strategy_ids) {
      params.strategy_ids.forEach(id => searchParams.append('strategy_ids', id));
    }
    
    const url = `/performance/metrics${searchParams.toString() ? `?${searchParams}` : ''}`;
    return this.request<any>(url);
  }

  async getPortfolioAnalytics() {
    return this.request<any>('/performance/portfolio');
  }

  // Marketplace
  async getMarketplaceStrategies(params?: {
    category?: string;
    search?: string;
    sort_by?: string;
    skip?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.sort_by) searchParams.set('sort_by', params.sort_by);
    if (params?.skip) searchParams.set('skip', params.skip.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    const url = `/marketplace/strategies${searchParams.toString() ? `?${searchParams}` : ''}`;
    return this.request<any[]>(url);
  }

  async publishStrategy(strategyId: string, publishData: {
    price?: number;
    description?: string;
    category?: string;
    tags?: string[];
  }) {
    return this.request<any>(`/marketplace/strategies/${strategyId}/publish`, {
      method: 'POST',
      body: JSON.stringify(publishData),
    });
  }

  async purchaseStrategy(strategyId: string) {
    return this.request<any>(`/marketplace/strategies/${strategyId}/purchase`, {
      method: 'POST',
    });
  }

  // Notifications
  async getNotifications(params?: { unread_only?: boolean; skip?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.unread_only) searchParams.set('unread_only', params.unread_only.toString());
    if (params?.skip) searchParams.set('skip', params.skip.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    const url = `/notifications${searchParams.toString() ? `?${searchParams}` : ''}`;
    return this.request<any[]>(url);
  }

  async markNotificationRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, { method: 'POST' });
  }

  async markAllNotificationsRead() {
    return this.request('/notifications/read-all', { method: 'POST' });
  }

  // WebSocket for real-time data
  createWebSocket(clientId: string): WebSocket {
    const wsUrl = this.baseURL.replace('http', 'ws').replace('/api', '') + `/ws/${clientId}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return ws;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;