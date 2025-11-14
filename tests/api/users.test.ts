// User Management Endpoint Tests
// Tests for /api/v2/users/* endpoints

import { describe, it, beforeAll, afterAll } from '../helpers/test-runner';
import { TestApiClient } from '../helpers/api-client';
import {
  expect,
  expectStatus,
  expectSuccess,
  expectUnauthorized,
  expectForbidden,
  expectNotFound,
  expectValidationError,
  expectValidUser,
} from '../helpers/assertions';
import { testData } from '../helpers/test-data';

const API_URL = process.env.VITE_API_URL || 'https://dbx-system-production.up.railway.app';
const client = new TestApiClient(API_URL);

describe('User Management Tests', () => {
  let adminToken: string;
  let regularUserToken: string;
  let testUserId: string;
  let createdUserIds: string[] = [];

  beforeAll(async () => {
    // Create admin user
    const adminUser = testData.generateAdminUser();
    const adminResponse = await client.post('/api/v2/auth/register', adminUser);
    adminToken = adminResponse.data.access_token;

    // Create regular user
    const regularUser = testData.generateUser();
    const userResponse = await client.post('/api/v2/auth/register', regularUser);
    regularUserToken = userResponse.data.access_token;
  });

  afterAll(async () => {
    // Cleanup created users
    if (process.env.TEST_CLEANUP !== 'false') {
      client.setToken(adminToken);
      for (const userId of createdUserIds) {
        try {
          await client.delete(`/api/v2/users/${userId}`);
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    }
  });

  // ============================================
  // GET /api/v2/users
  // ============================================

  it('GET /api/v2/users - Success: List all users (admin)', async () => {
    client.setToken(adminToken);
    const response = await client.get('/api/v2/users');

    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
    
    if (response.data.length > 0) {
      expectValidUser(response.data[0]);
    }
  });

  it('GET /api/v2/users - Error: Unauthorized access (non-admin)', async () => {
    client.setToken(regularUserToken);
    const response = await client.get('/api/v2/users');

    // Backend may return 403 (Forbidden) or 401 (Unauthorized) for non-admin
    expect(response.status === 401 || response.status === 403).toBeTruthy();
  });

  it('GET /api/v2/users - Error: Unauthenticated request', async () => {
    client.clearToken();
    const response = await client.get('/api/v2/users');

    expectUnauthorized(response);
  });

  // ============================================
  // POST /api/v2/users
  // ============================================

  it('POST /api/v2/users - Success: Create user with valid data', async () => {
    client.setToken(adminToken);
    const newUser = testData.generateUser();

    const response = await client.post('/api/v2/users', {
      email: newUser.email,
      password: newUser.password,
      full_name: newUser.full_name,
      role: 'user',
    });

    expectSuccess(response);
    expectValidUser(response.data);
    expect(response.data.email).toBe(newUser.email);
    expect(response.data.full_name).toBe(newUser.full_name);

    // Store for cleanup
    testUserId = response.data.id;
    createdUserIds.push(response.data.id);
  });

  it('POST /api/v2/users - Error: Duplicate email', async () => {
    client.setToken(adminToken);
    const duplicateUser = testData.generateUser();

    // Create first user
    await client.post('/api/v2/users', {
      email: duplicateUser.email,
      password: duplicateUser.password,
      full_name: duplicateUser.full_name,
      role: 'user',
    });

    // Try to create duplicate
    const response = await client.post('/api/v2/users', {
      email: duplicateUser.email,
      password: 'DifferentPassword123!',
      full_name: 'Different Name',
      role: 'user',
    });

    // Backend may return 400 or 422 for duplicate
    expect(response.status >= 400).toBeTruthy();
  });

  it('POST /api/v2/users - Error: Invalid role', async () => {
    client.setToken(adminToken);
    const newUser = testData.generateUser();

    const response = await client.post('/api/v2/users', {
      email: newUser.email,
      password: newUser.password,
      full_name: newUser.full_name,
      role: 'invalid_role',
    });

    expectValidationError(response);
  });

  it('POST /api/v2/users - Error: Missing required fields', async () => {
    client.setToken(adminToken);

    const response = await client.post('/api/v2/users', {
      email: testData.generateUser().email,
      // Missing password and full_name
    });

    expectValidationError(response);
  });

  it('POST /api/v2/users - Error: Unauthorized (non-admin)', async () => {
    client.setToken(regularUserToken);
    const newUser = testData.generateUser();

    const response = await client.post('/api/v2/users', {
      email: newUser.email,
      password: newUser.password,
      full_name: newUser.full_name,
      role: 'user',
    });

    // Backend may return 403 (Forbidden) or 401 (Unauthorized)
    expect(response.status === 401 || response.status === 403).toBeTruthy();
  });

  // ============================================
  // GET /api/v2/users/{id}
  // ============================================

  it('GET /api/v2/users/{id} - Success: Get user by ID', async () => {
    client.setToken(adminToken);
    const response = await client.get(`/api/v2/users/${testUserId}`);

    expectSuccess(response);
    expectValidUser(response.data);
    expect(response.data.id).toBe(testUserId);
  });

  it('GET /api/v2/users/{id} - Error: User not found', async () => {
    client.setToken(adminToken);
    const response = await client.get('/api/v2/users/99999999');

    expectNotFound(response);
  });

  it('GET /api/v2/users/{id} - Error: Invalid user ID format', async () => {
    client.setToken(adminToken);
    const response = await client.get('/api/v2/users/invalid-id');

    expectValidationError(response);
  });

  it('GET /api/v2/users/{id} - Error: Unauthorized access', async () => {
    client.clearToken();
    const response = await client.get(`/api/v2/users/${testUserId}`);

    expectUnauthorized(response);
  });

  // ============================================
  // PUT /api/v2/users/{id}
  // ============================================

  it('PUT /api/v2/users/{id} - Success: Update user', async () => {
    client.setToken(adminToken);
    const updateData = {
      full_name: 'Updated User Name',
    };

    const response = await client.put(`/api/v2/users/${testUserId}`, updateData);

    expectSuccess(response);
    expect(response.data.full_name).toBe('Updated User Name');
  });

  it('PUT /api/v2/users/{id} - Success: Update user role', async () => {
    client.setToken(adminToken);
    const updateData = {
      role: 'analyst',
    };

    const response = await client.put(`/api/v2/users/${testUserId}`, updateData);

    expectSuccess(response);
    expect(response.data.role).toBe('analyst');
  });

  it('PUT /api/v2/users/{id} - Error: Invalid data', async () => {
    client.setToken(adminToken);
    const invalidData = {
      email: testData.generateInvalidEmail(),
    };

    const response = await client.put(`/api/v2/users/${testUserId}`, invalidData);

    expectValidationError(response);
  });

  it('PUT /api/v2/users/{id} - Error: User not found', async () => {
    client.setToken(adminToken);
    const updateData = {
      full_name: 'Should Fail',
    };

    const response = await client.put('/api/v2/users/99999999', updateData);

    expectNotFound(response);
  });

  it('PUT /api/v2/users/{id} - Error: Unauthorized (non-admin)', async () => {
    client.setToken(regularUserToken);
    const updateData = {
      full_name: 'Should Fail',
    };

    const response = await client.put(`/api/v2/users/${testUserId}`, updateData);

    expect(response.status === 401 || response.status === 403).toBeTruthy();
  });

  // ============================================
  // DELETE /api/v2/users/{id}
  // ============================================

  it('DELETE /api/v2/users/{id} - Success: Delete user', async () => {
    // Create a user to delete
    client.setToken(adminToken);
    const userToDelete = testData.generateUser();
    const createResponse = await client.post('/api/v2/users', {
      email: userToDelete.email,
      password: userToDelete.password,
      full_name: userToDelete.full_name,
      role: 'user',
    });

    const userId = createResponse.data.id;

    // Delete the user
    const response = await client.delete(`/api/v2/users/${userId}`);

    expectSuccess(response);

    // Verify user is deleted
    const getResponse = await client.get(`/api/v2/users/${userId}`);
    expectNotFound(getResponse);
  });

  it('DELETE /api/v2/users/{id} - Error: User not found', async () => {
    client.setToken(adminToken);
    const response = await client.delete('/api/v2/users/99999999');

    expectNotFound(response);
  });

  it('DELETE /api/v2/users/{id} - Error: Cannot delete self', async () => {
    // Get current user ID
    client.setToken(adminToken);
    const profileResponse = await client.get('/api/v2/auth/profile');
    const currentUserId = profileResponse.data.id;

    // Try to delete self
    const response = await client.delete(`/api/v2/users/${currentUserId}`);

    // Backend should prevent self-deletion
    expect(response.status >= 400).toBeTruthy();
  });

  it('DELETE /api/v2/users/{id} - Error: Unauthorized (non-admin)', async () => {
    client.setToken(regularUserToken);
    const response = await client.delete(`/api/v2/users/${testUserId}`);

    expect(response.status === 401 || response.status === 403).toBeTruthy();
  });

  // ============================================
  // POST /api/v2/users/{id}/reset-password
  // ============================================

  it('POST /api/v2/users/{id}/reset-password - Success: Reset user password', async () => {
    client.setToken(adminToken);
    const response = await client.post(`/api/v2/users/${testUserId}/reset-password`);

    expectSuccess(response);
    expect(response.data).toHaveProperty('message');
  });

  it('POST /api/v2/users/{id}/reset-password - Error: User not found', async () => {
    client.setToken(adminToken);
    const response = await client.post('/api/v2/users/99999999/reset-password');

    expectNotFound(response);
  });

  it('POST /api/v2/users/{id}/reset-password - Error: Unauthorized (non-admin)', async () => {
    client.setToken(regularUserToken);
    const response = await client.post(`/api/v2/users/${testUserId}/reset-password`);

    expect(response.status === 401 || response.status === 403).toBeTruthy();
  });

  it('POST /api/v2/users/{id}/reset-password - Error: Unauthenticated', async () => {
    client.clearToken();
    const response = await client.post(`/api/v2/users/${testUserId}/reset-password`);

    expectUnauthorized(response);
  });

  // ============================================
  // Additional User Management Tests
  // ============================================

  it('Pagination: GET /api/v2/users with limit and offset', async () => {
    client.setToken(adminToken);
    const response = await client.get('/api/v2/users', {
      queryParams: { limit: '10', offset: '0' },
    });

    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
    expect(response.data.length).toBeLessThan(11);
  });

  it('Filtering: GET /api/v2/users by role', async () => {
    client.setToken(adminToken);
    const response = await client.get('/api/v2/users', {
      queryParams: { role: 'admin' },
    });

    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
    
    // All returned users should have admin role
    if (response.data.length > 0) {
      response.data.forEach((user: any) => {
        expect(user.role).toBe('admin');
      });
    }
  });

  it('Security: Regular user cannot escalate privileges', async () => {
    client.setToken(regularUserToken);
    
    // Get current user profile
    const profileResponse = await client.get('/api/v2/auth/profile');
    const userId = profileResponse.data.id;

    // Try to update own role to admin
    const response = await client.put(`/api/v2/users/${userId}`, {
      role: 'admin',
    });

    // Should be forbidden or unauthorized
    expect(response.status === 401 || response.status === 403).toBeTruthy();
  });
});
