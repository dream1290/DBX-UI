// Report Endpoint Tests
// Tests for /api/v2/reports/* endpoints

import { describe, it, beforeAll, afterAll } from '../helpers/test-runner';
import { TestApiClient } from '../helpers/api-client';
import {
  expect,
  expectStatus,
  expectSuccess,
  expectUnauthorized,
  expectNotFound,
  expectValidationError,
  expectValidReport,
} from '../helpers/assertions';
import { testData } from '../helpers/test-data';

const API_URL = process.env.VITE_API_URL || 'https://dbx-system-production.up.railway.app';
const client = new TestApiClient(API_URL);

describe('Report Tests', () => {
  let authToken: string;
  let testReportId: string;
  let createdReportIds: string[] = [];

  beforeAll(async () => {
    const user = testData.generateUser();
    const response = await client.post('/api/v2/auth/register', user);
    authToken = response.data.access_token;
    client.setToken(authToken);
  });

  afterAll(async () => {
    if (process.env.TEST_CLEANUP !== 'false') {
      client.setToken(authToken);
      for (const reportId of createdReportIds) {
        try {
          await client.delete(`/api/v2/reports/${reportId}`);
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    }
  });

  it('GET /api/v2/reports - Success: List all reports', async () => {
    const response = await client.get('/api/v2/reports');
    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
  });

  it('GET /api/v2/reports - Success: Filter by type', async () => {
    const response = await client.get('/api/v2/reports', {
      queryParams: { type: 'flight_analysis' },
    });
    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
  });

  it('POST /api/v2/reports - Success: Generate report', async () => {
    const reportData = testData.generateReport();
    const response = await client.post('/api/v2/reports', reportData);
    expectSuccess(response);
    expectValidReport(response.data);
    testReportId = response.data.id;
    createdReportIds.push(response.data.id);
  });

  it('POST /api/v2/reports - Error: Invalid parameters', async () => {
    const response = await client.post('/api/v2/reports', {});
    expectValidationError(response);
  });

  it('GET /api/v2/reports/{id} - Success: Get report by ID', async () => {
    const response = await client.get(`/api/v2/reports/${testReportId}`);
    expectSuccess(response);
    expectValidReport(response.data);
  });

  it('GET /api/v2/reports/{id} - Error: Report not found', async () => {
    const response = await client.get('/api/v2/reports/99999999');
    expectNotFound(response);
  });

  it('GET /api/v2/reports/{id}/pdf - Success: Export report as PDF', async () => {
    const response = await client.get(`/api/v2/reports/${testReportId}/pdf`);
    expectSuccess(response);
  });

  it('GET /api/v2/reports/{id}/csv - Success: Export report as CSV', async () => {
    const response = await client.get(`/api/v2/reports/${testReportId}/csv`);
    expectSuccess(response);
  });

  it('DELETE /api/v2/reports/{id} - Success: Delete report', async () => {
    const reportData = testData.generateReport();
    const createResponse = await client.post('/api/v2/reports', reportData);
    const reportId = createResponse.data.id;
    const response = await client.delete(`/api/v2/reports/${reportId}`);
    expectSuccess(response);
  });

  it('DELETE /api/v2/reports/{id} - Error: Report not found', async () => {
    const response = await client.delete('/api/v2/reports/99999999');
    expectNotFound(response);
  });
});
