// Organization Endpoint Tests
// Tests for /api/v2/organizations/* endpoints

import { describe, it, beforeAll, afterAll } from '../helpers/test-runner';
import { TestApiClient } from '../helpers/api-client';
import {
  expect,
  expectSuccess,
  expectUnauthorized,
  expectNotFound,
  expectValidationError,
  expectValidOrganization,
} from '../helpers/assertions';
import { testData } from '../helpers/test-data';

const API_URL = process.env.VITE_API_URL || 'https://dbx-system-production.up.railway.app';
const client = new TestApiClient(API_URL);

describe('Organization Tests', () => {
  let authToken: string;
  let testOrgId: string;
  let createdOrgIds: string[] = [];

  beforeAll(async () => {
    const user = testData.generateUser();
    const response = await client.post('/api/v2/auth/register', user);
    authToken = response.data.access_token;
    client.setToken(authToken);
  });

  afterAll(async () => {
    if (process.env.TEST_CLEANUP !== 'false') {
      for (const orgId of createdOrgIds) {
        try {
          await client.delete(`/api/v2/organizations/${orgId}`);
        } catch (error) {
          // Ignore
        }
      }
    }
  });

  it('GET /api/v2/organizations - Success: List all', async () => {
    const response = await client.get('/api/v2/organizations');
    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
  });

  it('POST /api/v2/organizations - Success: Create organization', async () => {
    const orgData = testData.generateOrganization();
    const response = await client.post('/api/v2/organizations', orgData);
    expectSuccess(response);
    expectValidOrganization(response.data);
    testOrgId = response.data.id;
    createdOrgIds.push(response.data.id);
  });

  it('POST /api/v2/organizations - Error: Duplicate name', async () => {
    const orgData = testData.generateOrganization();
    await client.post('/api/v2/organizations', orgData);
    const response = await client.post('/api/v2/organizations', orgData);
    expect(response.status >= 400).toBeTruthy();
  });

  it('GET /api/v2/organizations/{id} - Success', async () => {
    const response = await client.get(`/api/v2/organizations/${testOrgId}`);
    expectSuccess(response);
    expectValidOrganization(response.data);
  });

  it('GET /api/v2/organizations/{id} - Error: Not found', async () => {
    const response = await client.get('/api/v2/organizations/99999999');
    expectNotFound(response);
  });

  it('PUT /api/v2/organizations/{id} - Success: Update', async () => {
    const response = await client.put(`/api/v2/organizations/${testOrgId}`, {
      name: 'Updated Org Name',
    });
    expectSuccess(response);
  });

  it('DELETE /api/v2/organizations/{id} - Success', async () => {
    const orgData = testData.generateOrganization();
    const createResponse = await client.post('/api/v2/organizations', orgData);
    const response = await client.delete(`/api/v2/organizations/${createResponse.data.id}`);
    expectSuccess(response);
  });
});
