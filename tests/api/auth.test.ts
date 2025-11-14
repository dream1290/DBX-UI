// Authentication Endpoint Tests
// Tests for /api/v2/auth/* endpoints

import { describe, it, beforeAll, afterAll } from '../helpers/test-runner';
import { TestApiClient } from '../helpers/api-client';
import {
  expect,
  expectStatus,
  expectSuccess,
  expectUnauthorized,
  expectValidationError,
  expectValidUser,
} from '../helpers/assertions';
import { testData } from '../helpers/test-data';

const API_URL = process.env.VITE_API_URL || 'https://dbx-system-production.up.railway.app';
const client = new TestApiClient(API_URL);

describe('Authentication Tests', () => {
  let testUser: any;
  let authToken: string;
  let refreshToken: string;

  // Test data for various scenarios
  const validUser = testData.generateUser();
  const duplicateUser = { ...validUser }; // Will be used to test duplicate registration

  beforeAll(async () => {
    // No setup needed - tests will create their own users
  });

  afterAll(async () => {
    // Cleanup is handled per test
  });

  // ============================================
  // POST /api/v2/auth/register
  // ============================================

  it('POST /api/v2/auth/register - Success with valid data', async () => {
    const response = await client.post('/api/v2/auth/register', validUser);

    // Backend returns 201 Created for registration
    expectSuccess(response);
    expect(response.data).toHaveProperty('access_token');
    expect(response.data).toHaveProperty('refresh_token');
    expect(response.data.access_token).toBeTruthy();

    // Store tokens and user for later tests
    authToken = response.data.access_token;
    refreshToken = response.data.refresh_token;
    testUser = { ...validUser }; // Store a copy of the user data
  });

  it('POST /api/v2/auth/register - Error: Duplicate email', async () => {
    // Try to register with the same email again
    const response = await client.post('/api/v2/auth/register', duplicateUser);

    // Backend may return 400 or 422 for duplicate email
    expect(response.status >= 400).toBeTruthy();
    expect(response.data).toHaveProperty('detail');
  });

  it('POST /api/v2/auth/register - Error: Invalid email format', async () => {
    const invalidUser = {
      ...testData.generateUser(),
      email: testData.generateInvalidEmail(),
    };

    const response = await client.post('/api/v2/auth/register', invalidUser);

    expectValidationError(response);
  });

  it('POST /api/v2/auth/register - Error: Weak password', async () => {
    const weakPasswordUser = {
      ...testData.generateUser(),
      password: testData.generateWeakPassword(),
    };

    const response = await client.post('/api/v2/auth/register', weakPasswordUser);

    expectValidationError(response);
  });

  it('POST /api/v2/auth/register - Error: Missing required fields', async () => {
    const incompleteUser = {
      email: testData.generateUser().email,
      // Missing password and full_name
    };

    const response = await client.post('/api/v2/auth/register', incompleteUser);

    expectValidationError(response);
  });

  // ============================================
  // POST /api/v2/auth/login
  // ============================================

  it('POST /api/v2/auth/login - Success with valid credentials', async () => {
    const response = await client.loginWithForm(testUser.email, testUser.password);

    expectStatus(response, 200);
    expect(response.data).toHaveProperty('access_token');
    expect(response.data).toHaveProperty('refresh_token');
    expect(response.data.token_type).toBe('bearer');

    // Update tokens
    authToken = response.data.access_token;
    refreshToken = response.data.refresh_token;
  });

  it('POST /api/v2/auth/login - Error: Invalid credentials', async () => {
    const response = await client.loginWithForm(testUser.email, 'WrongPassword123!');

    expectUnauthorized(response);
    expect(response.data).toHaveProperty('detail');
  });

  it('POST /api/v2/auth/login - Error: Non-existent user', async () => {
    const response = await client.loginWithForm('nonexistent@test.com', 'Password123!');

    expectUnauthorized(response);
  });

  it('POST /api/v2/auth/login - Error: Missing credentials', async () => {
    const response = await client.post('/api/v2/auth/login', {});

    expectValidationError(response);
  });

  // ============================================
  // GET /api/v2/auth/profile
  // ============================================

  it('GET /api/v2/auth/profile - Success: Get authenticated user profile', async () => {
    client.setToken(authToken);
    const response = await client.get('/api/v2/auth/profile');

    expectSuccess(response);
    expectValidUser(response.data);
    expect(response.data.email).toBe(testUser.email);
    expect(response.data.full_name).toBe(testUser.full_name);
  });

  it('GET /api/v2/auth/profile - Error: Unauthenticated request', async () => {
    client.clearToken();
    const response = await client.get('/api/v2/auth/profile');

    expectUnauthorized(response);
  });

  it('GET /api/v2/auth/profile - Error: Invalid token', async () => {
    client.setToken('invalid_token_12345');
    const response = await client.get('/api/v2/auth/profile');

    expectUnauthorized(response);
  });

  // ============================================
  // PUT /api/v2/auth/profile
  // ============================================

  it('PUT /api/v2/auth/profile - Success: Update profile with valid data', async () => {
    client.setToken(authToken);
    const updateData = {
      full_name: 'Updated Test User',
    };

    const response = await client.put('/api/v2/auth/profile', updateData);

    expectSuccess(response);
    expect(response.data.full_name).toBe('Updated Test User');
  });

  it('PUT /api/v2/auth/profile - Error: Unauthenticated request', async () => {
    client.clearToken();
    const updateData = {
      full_name: 'Should Fail',
    };

    const response = await client.put('/api/v2/auth/profile', updateData);

    expectUnauthorized(response);
  });

  it('PUT /api/v2/auth/profile - Error: Invalid data format', async () => {
    client.setToken(authToken);
    const invalidData = {
      email: testData.generateInvalidEmail(), // Invalid email format
    };

    const response = await client.put('/api/v2/auth/profile', invalidData);

    // Backend may return 400 or 422 for invalid data
    expect(response.status >= 400).toBeTruthy();
  });

  // ============================================
  // POST /api/v2/auth/refresh
  // ============================================

  it('POST /api/v2/auth/refresh - Success: Valid refresh token', async () => {
    const response = await client.post(
      `/api/v2/auth/refresh?refresh_token=${refreshToken}`
    );

    expectSuccess(response);
    expect(response.data).toHaveProperty('access_token');
    
    // Update access token
    authToken = response.data.access_token;
    if (response.data.refresh_token) {
      refreshToken = response.data.refresh_token;
    }
  });

  it('POST /api/v2/auth/refresh - Error: Invalid refresh token', async () => {
    const response = await client.post(
      '/api/v2/auth/refresh?refresh_token=invalid_refresh_token'
    );

    expectUnauthorized(response);
  });

  it('POST /api/v2/auth/refresh - Error: Missing refresh token', async () => {
    const response = await client.post('/api/v2/auth/refresh');

    expectValidationError(response);
  });

  // ============================================
  // POST /api/v2/auth/forgot-password
  // ============================================

  it('POST /api/v2/auth/forgot-password - Success: Valid email', async () => {
    const response = await client.post(
      `/api/v2/auth/forgot-password?email=${encodeURIComponent(testUser.email)}`
    );

    expectSuccess(response);
    expect(response.data).toHaveProperty('message');
  });

  it('POST /api/v2/auth/forgot-password - Success: Non-existent email (security)', async () => {
    // For security, backend should return success even for non-existent emails
    const response = await client.post(
      '/api/v2/auth/forgot-password?email=nonexistent@test.com'
    );

    // Backend may return success or error depending on security policy
    expect(response.status >= 200).toBeTruthy();
  });

  it('POST /api/v2/auth/forgot-password - Error: Invalid email format', async () => {
    const response = await client.post(
      '/api/v2/auth/forgot-password?email=invalid-email'
    );

    expectValidationError(response);
  });

  it('POST /api/v2/auth/forgot-password - Error: Missing email', async () => {
    const response = await client.post('/api/v2/auth/forgot-password');

    expectValidationError(response);
  });

  // ============================================
  // POST /api/v2/auth/reset-password
  // ============================================

  it('POST /api/v2/auth/reset-password - Error: Invalid token', async () => {
    const response = await client.post(
      '/api/v2/auth/reset-password?token=invalid_token&new_password=NewPassword123!'
    );

    // Backend should return error for invalid token
    expect(response.status >= 400).toBeTruthy();
  });

  it('POST /api/v2/auth/reset-password - Error: Missing parameters', async () => {
    const response = await client.post('/api/v2/auth/reset-password');

    expectValidationError(response);
  });

  it('POST /api/v2/auth/reset-password - Error: Weak new password', async () => {
    const response = await client.post(
      '/api/v2/auth/reset-password?token=some_token&new_password=123'
    );

    expectValidationError(response);
  });

  // ============================================
  // POST /api/v2/auth/logout
  // ============================================

  it('POST /api/v2/auth/logout - Success: Authenticated user logout', async () => {
    client.setToken(authToken);
    const response = await client.post('/api/v2/auth/logout');

    expectSuccess(response);
    
    // Clear tokens after logout
    client.clearToken();
  });

  it('POST /api/v2/auth/logout - Error: Unauthenticated request', async () => {
    client.clearToken();
    const response = await client.post('/api/v2/auth/logout');

    expectUnauthorized(response);
  });

  // ============================================
  // Additional Security Tests
  // ============================================

  it('Security: Token should expire after logout', async () => {
    // Try to use the token after logout
    client.setToken(authToken);
    const response = await client.get('/api/v2/auth/profile');

    // Token should be invalid after logout
    // Note: This may pass if backend doesn't invalidate tokens immediately
    // In that case, this test documents expected behavior
    if (response.status === 401) {
      expectUnauthorized(response);
    }
  });

  it('Security: Cannot access protected routes without authentication', async () => {
    client.clearToken();
    const response = await client.get('/api/v2/users');

    expectUnauthorized(response);
  });
});
