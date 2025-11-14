// API Client for Tests
// Simplified HTTP client for making test requests

export interface ApiResponse<T = any> {
  status: number;
  data: T;
  headers: Headers;
}

export class TestApiClient {
  private baseURL: string;
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string): void {
    this.token = token;
  }

  setRefreshToken(refreshToken: string): void {
    this.refreshToken = refreshToken;
  }

  clearToken(): void {
    this.token = null;
    this.refreshToken = null;
  }

  async request<T = any>(
    method: string,
    endpoint: string,
    options?: {
      body?: any;
      headers?: Record<string, string>;
      formData?: FormData;
      queryParams?: Record<string, string>;
    }
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    // Add query parameters if provided
    if (options?.queryParams) {
      Object.entries(options.queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const headers: Record<string, string> = {
      ...options?.headers,
    };

    // Add authorization header if token is set
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Set content type for JSON body
    if (options?.body && !options?.formData) {
      headers['Content-Type'] = 'application/json';
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    // Add body if provided
    if (options?.formData) {
      fetchOptions.body = options.formData;
    } else if (options?.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url.toString(), fetchOptions);
      
      // Try to parse JSON response
      let data: T;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as unknown as T;
      }

      return {
        status: response.status,
        data,
        headers: response.headers,
      };
    } catch (error) {
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Convenience methods
  async get<T = any>(endpoint: string, options?: { headers?: Record<string, string>; queryParams?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, options);
  }

  async post<T = any>(endpoint: string, body?: any, options?: { headers?: Record<string, string>; formData?: FormData }): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, { body, ...options });
  }

  async put<T = any>(endpoint: string, body?: any, options?: { headers?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, { body, ...options });
  }

  async delete<T = any>(endpoint: string, options?: { headers?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, options);
  }

  // Special method for form-urlencoded login
  async loginWithForm(email: string, password: string): Promise<ApiResponse> {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${this.baseURL}/api/v2/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();

    return {
      status: response.status,
      data,
      headers: response.headers,
    };
  }
}
