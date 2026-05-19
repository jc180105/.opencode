/**
 * API Client - Integrates with Backend endpoints
 * Endpoints: /api/users, /api/orders (with JWT auth)
 */

import { User, Order, Cart, ApiError } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options;
    const headers = {
      ...this.defaultHeaders,
      ...(options.headers || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = {
        code: `HTTP_${response.status}`,
        message: `API request failed: ${response.statusText}`,
        statusCode: response.status,
        timestamp: new Date().toISOString(),
      };
      throw error;
    }

    return response.json() as Promise<T>;
  }

  // Users endpoints
  async getUser(userId: string, token: string): Promise<User> {
    return this.request<User>(`/users/${userId}`, { token });
  }

  async updateUser(userId: string, data: Partial<User>, token: string): Promise<User> {
    return this.request<User>(`/users/${userId}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify(data),
    });
  }

  // Orders endpoints
  async getOrders(userId: string, token: string): Promise<Order[]> {
    return this.request<Order[]>(`/orders?userId=${userId}`, { token });
  }

  async getOrder(orderId: string, token: string): Promise<Order> {
    return this.request<Order>(`/orders/${orderId}`, { token });
  }

  async createOrder(data: Partial<Order>, token: string): Promise<Order> {
    return this.request<Order>('/orders', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    });
  }

  async updateOrder(orderId: string, data: Partial<Order>, token: string): Promise<Order> {
    return this.request<Order>(`/orders/${orderId}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify(data),
    });
  }

  // Cart endpoints (assuming Backend provides these)
  async getCart(userId: string, token: string): Promise<Cart> {
    return this.request<Cart>(`/cart/${userId}`, { token });
  }

  async updateCart(userId: string, items: any, token: string): Promise<Cart> {
    return this.request<Cart>(`/cart/${userId}`, {
      method: 'PUT',
      token,
      body: JSON.stringify({ items }),
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
