// API Key Endpoint Tests
// Tests for /api/v2/api-keys/* endpoints

import { describe, it, beforeAll, afterAll } from '../helpers/test-runner';
import { TestApiClient } from '../helpers/api-client';
import {
  expect,
  expectSuccess,
  expectUnauthorized,
  expectNotFound,
  expectValidationError,
  expectValidApiKey,
} from '../helpers/assertions';
import { testData } from '../helpers/test-data';

const API_URL = process.env.VITE_API_URL || 'https://dbx-system-production.up.railway.app';
const client = new TestApiClient(API_URL);

describe('API Key Tests', () => {
  let authToken: string;
  let testApiKeyId: string;
  let createdApiKeyIds: string[] = [];

  beforeAll(async () => {
    const user = testData.generateUser();
    const response = await client.post('/api/v2/auth/register', user);
    authToken = response.data.access_token;
    client.setToken(authToken);
  });

  afterAll(async () => {
    if (process.env.TEST_CLEANUP !== 'false') {
      for (const keyId of createdApiKeyIds) {
        try {
          await client.delete(`/api/v2/api-keys/${keyId}`);
        } catch (error) {
          // Ignore
        }
      }
    }
  });

  it('GET /api/v2/api-keys - Success: List all', async () => {
    const response = await client.get('/api/v2/api-keys');
    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
  });

  it('POST /api/v2/api-keys - Success: Create API key', async () => {
    const keyData = testData.generateApiKey();
    const response = await client.post('/api/v2/api-keys', keyData);
    expectSuccess(response);
    expectValidApiKey(response.data);
    testApiKeyId = response.data.id;
    createdApiKeyIds.push(response.data.id);
  });

  it('POST /api/v2/api-keys - Error: Invalid permissions', async () => {
    const response = await client.post('/api/v2/api-keys', {
      name: 'Test Key',
      permissions: ['invalid_permission'],
    });
    expectValidationError(response);
  });

  it('PUT /api/v2/api-keys/{id} - Success: Update', async () => {
    const response = await client.put(`/api/v2/api-keys/${testApiKeyId}`, {
      name: 'Updated Key Name',
    });
    expectSuccess(response);
  });

  it('DELETE /api/v2/api-keys/{id} - Success', async () => {
    const keyData = testData.generateApiKey();
    const createResponse = await client.post('/api/v2/api-keys', keyData);
    const response = await client.delete(`/api/v2/api-keys/${createResponse.data.id}`);
    expectSuccess(response);
  });

  it('DELETE /api/v2/api-keys/{id} - Error: Not found', async () => {
    const response = await client.delete('/api/v2/api-keys/99999999');
    expectNotFound(response);
  });
});
