// API Configuration and Base Service
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dbx-production-3690.up.railway.app';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public detail?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// User-friendly error messages by status code
const ERROR_MESSAGES: Record<number, string> = {
  400: 'Please check your input and try again',
  401: 'Your session has expired. Please log in again',
  403: "You don't have permission to perform this action",
  404: 'The requested resource was not found',
  422: 'Please check your input and try again',
  500: 'Something went wrong. Please try again later',
  503: 'Service temporarily unavailable. Please try again later',
};

// Get user-friendly error message
function getUserFriendlyError(status: number, detail?: any): string {
  // If detail has specific validation errors, use those
  if (detail && typeof detail === 'object') {
    if (detail.detail && typeof detail.detail === 'string') {
      return detail.detail;
    }
    if (Array.isArray(detail.detail)) {
      return detail.detail.map((err: any) => err.msg || err.message).join(', ');
    }
  }
  
  return ERROR_MESSAGES[status] || 'An unexpected error occurred';
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<string> | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Check for new token key first, then fall back to old key for migration
    this.token = localStorage.getItem('access_token') || localStorage.getItem('auth_token');
    this.refreshToken = localStorage.getItem('refresh_token');
    
    // Migrate old token key if present
    if (localStorage.getItem('auth_token') && !localStorage.getItem('access_token')) {
      const oldToken = localStorage.getItem('auth_token');
      if (oldToken) {
        localStorage.setItem('access_token', oldToken);
        localStorage.removeItem('auth_token');
      }
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('access_token', token);
      // Remove old key if it exists
      localStorage.removeItem('auth_token');
    } else {
      localStorage.removeItem('access_token');
      localStorage.removeItem('auth_token');
    }
  }

  setRefreshToken(refreshToken: string | null) {
    this.refreshToken = refreshToken;
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    } else {
      localStorage.removeItem('refresh_token');
    }
  }

  private async handleTokenRefresh(): Promise<string> {
    // Prevent duplicate simultaneous refresh requests
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        if (!this.refreshToken) {
          throw new Error('No refresh token available');
        }

        // CRITICAL: Refresh token must be sent as query parameter, not in body or headers
        const response = await fetch(
          `${this.baseURL}/api/v2/auth/refresh?refresh_token=${this.refreshToken}`,
          { method: 'POST' }
        );

        if (!response.ok) {
          throw new Error('Token refresh failed');
        }

        const data = await response.json();
        
        // Update both access and refresh tokens
        this.setToken(data.access_token);
        if (data.refresh_token) {
          this.setRefreshToken(data.refresh_token);
        }

        return data.access_token;
      } catch (error) {
        // Clear tokens on refresh failure
        this.setToken(null);
        this.setRefreshToken(null);

        // Trigger logout event
        window.dispatchEvent(new CustomEvent('auth:logout'));

        throw error;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && retryCount === 0 && this.refreshToken) {
        try {
          await this.handleTokenRefresh();
          // Retry the request with new token
          return this.request<T>(endpoint, options, retryCount + 1);
        } catch (refreshError) {
          // Refresh failed, throw original error
          throw new ApiError(401, 'Authentication required');
        }
      }

      if (!response.ok) {
        // Try to parse error response
        let errorDetail;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            errorDetail = await response.json();
          }
        } catch (e) {
          // Ignore parse errors
        }

        const userMessage = getUserFriendlyError(response.status, errorDetail);
        
        // Log detailed error in development
        if (import.meta.env.DEV) {
          console.error('API Error:', {
            status: response.status,
            endpoint,
            detail: errorDetail,
          });
        }

        throw new ApiError(response.status, userMessage, errorDetail);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return response.text() as unknown as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network error
      const networkError = new ApiError(
        0,
        'Network error. Please check your connection and try again.',
        error
      );
      
      if (import.meta.env.DEV) {
        console.error('Network Error:', error);
      }
      
      throw networkError;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    // CRITICAL: Login endpoint requires form-data with 'username' field (not JSON with 'email')
    const formData = new URLSearchParams();
    formData.append('username', email);  // Backend expects 'username' not 'email'
    formData.append('password', password);

    const response = await fetch(`${this.baseURL}/api/v2/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new ApiError(response.status, error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Store both tokens
    this.setToken(data.access_token);
    if (data.refresh_token) {
      this.setRefreshToken(data.refresh_token);
    }

    return data;
  }

  async register(email: string, password: string, fullName: string, organizationId?: string) {
    // Build request body - only include organization_id if it's provided and not empty
    const requestBody: any = {
      email,
      password,
      full_name: fullName,  // Backend expects 'full_name' not 'name'
    };
    
    // Only add organization_id if it's a valid non-empty string
    if (organizationId && organizationId.trim() !== '') {
      requestBody.organization_id = organizationId;
    }
    
    const response = await this.request<any>('/api/v2/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    // WORKAROUND: Backend bug - it returns only user object without tokens
    // Check if response has tokens, if not, login to get them
    if (!response.access_token || !response.refresh_token) {
      console.warn('Backend returned user without tokens, logging in to get tokens...');
      
      // Login to get tokens
      const loginResponse = await this.login(email, password);
      
      // Return combined response
      return {
        access_token: loginResponse.access_token,
        refresh_token: loginResponse.refresh_token,
        token_type: loginResponse.token_type || 'bearer',
        user: response  // The user object from registration
      };
    }

    // Normal flow: Store both tokens
    this.setToken(response.access_token);
    if (response.refresh_token) {
      this.setRefreshToken(response.refresh_token);
    }

    return response;
  }

  async logout() {
    try {
      return await this.request('/api/v2/auth/logout', { method: 'POST' });
    } finally {
      // Always clear tokens on logout
      this.setToken(null);
      this.setRefreshToken(null);
    }
  }

  async refreshAccessToken() {
    return this.request<{ access_token: string }>('/api/v2/auth/refresh', { method: 'POST' });
  }

  async getProfile() {
    return this.request<any>('/api/v2/auth/profile');
  }

  async updateProfile(data: any) {
    return this.request<any>('/api/v2/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async forgotPassword(email: string) {
    // Email must be sent as query parameter, not in body
    const response = await fetch(
      `${this.baseURL}/api/v2/auth/forgot-password?email=${encodeURIComponent(email)}`,
      { method: 'POST' }
    );

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  async resetPassword(token: string, newPassword: string) {
    // Both token and password must be sent as query parameters, not in body
    const response = await fetch(
      `${this.baseURL}/api/v2/auth/reset-password?token=${token}&new_password=${encodeURIComponent(newPassword)}`,
      { method: 'POST' }
    );

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  // Users methods
  async getUsers() {
    try {
      return this.request<any[]>('/api/v2/users');
    } catch (error) {
      console.warn('Users endpoint not available, returning empty array');
      return [];
    }
  }

  async getUserActivity(limit?: number) {
    // Backend doesn't have this endpoint yet
    try {
      const query = limit ? `?limit=${limit}` : '';
      return this.request<any[]>(`/api/v2/users/activity${query}`);
    } catch (error) {
      console.warn('User activity endpoint not available, returning empty array');
      return [];
    }
  }

  async createUser(data: any) {
    return this.request<any>('/api/v2/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUser(id: string) {
    return this.request<any>(`/api/v2/users/${id}`);
  }

  async updateUser(id: string, data: any) {
    return this.request<any>(`/api/v2/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/api/v2/users/${id}`, { method: 'DELETE' });
  }

  async resetUserPassword(id: string) {
    return this.request(`/api/v2/users/${id}/reset-password`, { method: 'POST' });
  }

  // Aircraft methods
  async getAircraftTypes() {
    // Fixed: Backend has /api/v2/aircraft/types not /api/v2/aircraft-types
    return this.request<any[]>('/api/v2/aircraft/types');
  }

  async getAircraft() {
    return this.request<any[]>('/api/v2/aircraft');
  }

  async createAircraft(data: any) {
    // Transform data to match backend schema
    const backendData = {
      registration: data.registration || data.registration_number,
      serial_number: data.serial_number,
      manufacturer: data.manufacturer,
      model: data.model,
      variant: data.variant,
      year_manufactured: data.year_manufactured,
      max_passengers: data.max_passengers,
      max_cargo_kg: data.max_cargo_kg,
      fuel_capacity_liters: data.fuel_capacity_liters,
      cruise_speed_knots: data.cruise_speed_knots,
      range_nm: data.range_nm,
      service_ceiling_ft: data.service_ceiling_ft,
      operational_status: data.operational_status || 'active',
      org_id: data.org_id || 1
    };
    
    return this.request<any>('/api/v2/aircraft', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  }

  async getAircraftById(id: string) {
    return this.request<any>(`/api/v2/aircraft/${id}`);
  }

  async updateAircraft(id: string, data: any) {
    return this.request<any>(`/api/v2/aircraft/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAircraft(id: string) {
    return this.request(`/api/v2/aircraft/${id}`, { method: 'DELETE' });
  }

  // Analysis methods
  async analyzeFlightLog(file: File, metadata?: any) {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    return this.request<any>('/api/v2/analyze', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async getAnalyses(skip: number = 0, limit: number = 50) {
    try {
      return this.request<any[]>(`/api/v2/analyses/?skip=${skip}&limit=${limit}`);
    } catch (error) {
      console.warn('Analyses endpoint not available, returning empty array');
      return [];
    }
  }

  async createAnalysis(data: any) {
    return this.request<any>('/api/v2/analyses/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAnalysis(id: string) {
    return this.request<any>(`/api/v2/analyses/${id}`);
  }

  async deleteAnalysis(id: string) {
    return this.request(`/api/v2/analyses/${id}`, { method: 'DELETE' });
  }

  async exportAnalyses(format: 'csv' | 'json' = 'csv') {
    const response = await fetch(`${this.baseURL}/api/v2/analyses/export?format=${format}`, {
      method: 'GET',
      headers: {
        'Authorization': this.token ? `Bearer ${this.token}` : '',
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, `Export failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flight-analyses-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async batchAnalyze(files: File[]) {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    return this.request<any>('/api/v2/batch-analyze', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }

  async retrainModel() {
    return this.request('/api/v2/retrain', { method: 'POST' });
  }

  async getModelInfo() {
    return this.request<any>('/api/v2/model/info');
  }

  // Files methods
  async getFiles() {
    return this.request<any[]>('/api/v2/files');
  }

  async deleteFile(id: string) {
    return this.request(`/api/v2/files/${id}`, { method: 'DELETE' });
  }

  async downloadFile(id: string) {
    return this.request(`/api/v2/files/${id}/download`);
  }

  async getFileMetadata(id: string) {
    return this.request<any>(`/api/v2/files/${id}/metadata`);
  }

  // System methods
  async getSystemStatus() {
    // Use /api/v2/status which exists in backend
    return this.request<any>('/api/v2/status');
  }

  async getDatabaseStatus() {
    // Backend doesn't have this specific endpoint, use health check
    try {
      return this.request<any>('/api/v2/system/database-status');
    } catch (error) {
      console.warn('Database status endpoint not available');
      return { status: 'unknown' };
    }
  }

  async getSystemMetrics() {
    // Backend has /api/v2/status not /api/v2/system/metrics
    // Map the response to expected format
    try {
      const status = await this.request<any>('/api/v2/status');
      return {
        active_flights: 0,
        total_analyses: 0,
        risk_alerts: 0,
        fleet_health: 100,
        fleet_availability: 100,
        ...status
      };
    } catch (error) {
      console.warn('System metrics not available, returning defaults');
      return {
        active_flights: 0,
        total_analyses: 0,
        risk_alerts: 0,
        fleet_health: 100,
        fleet_availability: 100
      };
    }
  }

  async getSystemLogs() {
    return this.request<any>('/api/v2/system/logs');
  }

  async createBackup() {
    return this.request('/api/v2/system/backup', { method: 'POST' });
  }

  async getDetailedHealth() {
    return this.request<any>('/api/v2/system/health-detailed');
  }

  async getHealth() {
    return this.request<any>('/health');
  }

  async getSystemSettings() {
    return this.request<any>('/api/v2/system/settings');
  }

  async updateSystemSettings(settings: any) {
    return this.request<any>('/api/v2/system/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Organizations methods
  async getOrganizations() {
    return this.request<any[]>('/api/v2/organizations');
  }

  async createOrganization(data: any) {
    return this.request<any>('/api/v2/organizations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOrganization(id: string) {
    return this.request<any>(`/api/v2/organizations/${id}`);
  }

  async updateOrganization(id: string, data: any) {
    return this.request<any>(`/api/v2/organizations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteOrganization(id: string) {
    return this.request(`/api/v2/organizations/${id}`, { method: 'DELETE' });
  }

  // Reports methods
  async getReports() {
    return this.request<any[]>('/api/v2/reports/');  // Trailing slash required
  }

  async generateReport(data: any) {
    return this.request<any>('/api/v2/reports/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getReport(id: string) {
    return this.request<any>(`/api/v2/reports/${id}`);
  }

  async exportReportPDF(id: string) {
    const response = await fetch(`${this.baseURL}/api/v2/reports/${id}/download/pdf`, {
      method: 'GET',
      headers: {
        'Authorization': this.token ? `Bearer ${this.token}` : '',
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, `PDF download failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async exportReportCSV(id: string) {
    const response = await fetch(`${this.baseURL}/api/v2/reports/${id}/download/csv`, {
      method: 'GET',
      headers: {
        'Authorization': this.token ? `Bearer ${this.token}` : '',
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, `CSV download failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${id}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async deleteReport(id: string) {
    return this.request(`/api/v2/reports/${id}`, { method: 'DELETE' });
  }

  // Notifications methods
  async getNotifications() {
    return this.request<any[]>('/api/v2/notifications/');  // Trailing slash required
  }

  async markNotificationAsRead(id: string) {
    return this.request(`/api/v2/notifications/${id}/read`, { method: 'PUT' });
  }

  async deleteNotification(id: string) {
    return this.request(`/api/v2/notifications/${id}`, { method: 'DELETE' });
  }

  async markAllNotificationsAsRead() {
    return this.request('/api/v2/notifications/mark-all-read', { method: 'POST' });
  }

  // API Keys methods
  async getApiKeys() {
    return this.request<any[]>('/api/v2/api-keys/');  // Trailing slash required
  }

  async createApiKey(data: any) {
    return this.request<any>('/api/v2/api-keys/', {  // Trailing slash required
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateApiKey(id: string, data: any) {
    return this.request<any>(`/api/v2/api-keys/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteApiKey(id: string) {
    return this.request(`/api/v2/api-keys/${id}`, { method: 'DELETE' });
  }

  async getApiKeyStats() {
    return this.request<any>('/api/v2/api-keys/stats');
  }

  // Alerts methods
  async getAlerts(skip: number = 0, limit: number = 50) {
    return this.request<any[]>(`/api/v2/alerts/?skip=${skip}&limit=${limit}`);
  }

  async acknowledgeAlert(id: string) {
    return this.request(`/api/v2/alerts/${id}/acknowledge`, { method: 'PUT' });
  }

  async resolveAlert(id: string) {
    return this.request(`/api/v2/alerts/${id}/resolve`, { method: 'PUT' });
  }

  async getAlertStats() {
    return this.request<any>('/api/v2/alerts/stats');
  }
}

export const apiService = new ApiService(API_BASE_URL);
export { ApiError };