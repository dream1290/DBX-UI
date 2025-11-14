// Notification Endpoint Tests
// Tests for /api/v2/notifications/* endpoints

import { describe, it, beforeAll, afterAll } from '../helpers/test-runner';
import { TestApiClient } from '../helpers/api-client';
import {
  expect,
  expectSuccess,
  expectUnauthorized,
  expectNotFound,
  expectValidNotification,
} from '../helpers/assertions';
import { testData } from '../helpers/test-data';

const API_URL = process.env.VITE_API_URL || 'https://dbx-system-production.up.railway.app';
const client = new TestApiClient(API_URL);

describe('Notification Tests', () => {
  let authToken: string;
  let testNotificationId: string;

  beforeAll(async () => {
    const user = testData.generateUser();
    const response = await client.post('/api/v2/auth/register', user);
    authToken = response.data.access_token;
    client.setToken(authToken);
  });

  it('GET /api/v2/notifications - Success: List all notifications', async () => {
    const response = await client.get('/api/v2/notifications');
    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
    if (response.data.length > 0) {
      expectValidNotification(response.data[0]);
      testNotificationId = response.data[0].id;
    }
  });

  it('GET /api/v2/notifications - Success: Filter by read status', async () => {
    const response = await client.get('/api/v2/notifications', {
      queryParams: { read: 'false' },
    });
    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
  });

  it('GET /api/v2/notifications - Error: Unauthenticated', async () => {
    client.clearToken();
    const response = await client.get('/api/v2/notifications');
    expectUnauthorized(response);
    client.setToken(authToken);
  });

  it('PUT /api/v2/notifications/{id}/read - Success: Mark as read', async () => {
    if (!testNotificationId) return;
    const response = await client.put(`/api/v2/notifications/${testNotificationId}/read`);
    expectSuccess(response);
  });

  it('PUT /api/v2/notifications/{id}/read - Error: Not found', async () => {
    const response = await client.put('/api/v2/notifications/99999999/read');
    expectNotFound(response);
  });

  it('POST /api/v2/notifications/mark-all-read - Success', async () => {
    const response = await client.post('/api/v2/notifications/mark-all-read');
    expectSuccess(response);
  });

  it('DELETE /api/v2/notifications/{id} - Success: Delete notification', async () => {
    if (!testNotificationId) return;
    const response = await client.delete(`/api/v2/notifications/${testNotificationId}`);
    expectSuccess(response);
  });

  it('DELETE /api/v2/notifications/{id} - Error: Not found', async () => {
    const response = await client.delete('/api/v2/notifications/99999999');
    expectNotFound(response);
  });
});
