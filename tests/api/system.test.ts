// System Endpoint Tests
// Tests for system health and status endpoints

import { describe, it } from '../helpers/test-runner';
import { TestApiClient } from '../helpers/api-client';
import { expect, expectSuccess } from '../helpers/assertions';

const API_URL = process.env.VITE_API_URL || 'https://dbx-system-production.up.railway.app';
const client = new TestApiClient(API_URL);

describe('System Tests', () => {
  it('GET /health - Success: Health check', async () => {
    const response = await client.get('/health');
    expectSuccess(response);
    expect(response.data).toHaveProperty('status');
  });

  it('GET /api/v2/status - Success: System status', async () => {
    const response = await client.get('/api/v2/status');
    expectSuccess(response);
    expect(response.data).toHaveProperty('status');
  });

  it('GET /api/v2/system/health-detailed - Success: Detailed health', async () => {
    const response = await client.get('/api/v2/system/health-detailed');
    expectSuccess(response);
  });

  it('GET /api/v2/model/info - Success: ML model info', async () => {
    const response = await client.get('/api/v2/model/info');
    expectSuccess(response);
  });
});
