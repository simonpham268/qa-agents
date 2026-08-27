import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { ApiResponse } from './api.response';
import { API_CONFIG } from '../config/api.config';
import { requireEnv } from '../../utils/env';

type Headers = Record<string, string>;

export class ApiClient {
  private request: APIRequestContext;
  private baseURL: string;
  private headers: Headers = {};

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseURL = requireEnv('BASE_URL');
  }

  setBaseURL(baseURL: string): this {
    this.baseURL = baseURL;
    return this;
  }

  setHeader(key: string, value: string): this {
    this.headers[key] = value;
    return this;
  }

  setHeaders(headers: Headers): this {
    Object.assign(this.headers, headers);
    return this;
  }

  async get<T>(endpoint: string, options?: { headers?: Headers }): Promise<ApiResponse<T>> {
    return this.send<T>('get', endpoint, options);
  }

  async post<T>(endpoint: string, options?: { data?: unknown; headers?: Headers }): Promise<ApiResponse<T>> {
    return this.send<T>('post', endpoint, options);
  }

  async put<T>(endpoint: string, options?: { data?: unknown; headers?: Headers }): Promise<ApiResponse<T>> {
    return this.send<T>('put', endpoint, options);
  }

  async delete<T>(endpoint: string, options?: { headers?: Headers }): Promise<ApiResponse<T>> {
    return this.send<T>('delete', endpoint, options);
  }

  private async send<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    endpoint: string,
    options?: { data?: unknown; headers?: Headers },
  ): Promise<ApiResponse<T>> {
    const response = await this.request[method](this.url(endpoint), {
      data: options?.data,
      headers: this.mergeHeaders(options?.headers),
    });
    return this.parseResponse<T>(response);
  }

  private url(endpoint: string): string {
    return `${this.baseURL}${endpoint}`;
  }

  private mergeHeaders(perCall?: Headers): Headers {
    return { ...API_CONFIG.defaultHeaders, ...this.headers, ...perCall };
  }

  private async parseResponse<T>(response: APIResponse): Promise<ApiResponse<T>> {
    let body: T | null = null;
    try {
      body = await response.json() as T;
    } catch {
      // not JSON
    }
    if (!response.ok()) {
      const detail = body ?? await response.text().catch(() => '');
      console.warn(`[API ${response.status()}] ${response.url()}:`, detail);
    }
    return {
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      body,
      ok: response.ok(),
    };
  }
}
