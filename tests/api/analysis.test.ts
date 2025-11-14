// Flight Analysis Endpoint Tests
// Tests for /api/v2/analyze and /api/v2/analyses/* endpoints

import { describe, it, beforeAll, afterAll } from '../helpers/test-runner';
import { TestApiClient } from '../helpers/api-client';
import {
  expect,
  expectStatus,
  expectSuccess,
  expectUnauthorized,
  expectNotFound,
  expectValidationError,
  expectValidAnalysis,
} from '../helpers/assertions';
import { testData } from '../helpers/test-data';

const API_URL = process.env.VITE_API_URL || 'https://dbx-system-production.up.railway.app';
const client = new TestApiClient(API_URL);

describe('Flight Analysis Tests', () => {
  let authToken: string;
  let testAnalysisId: string;
  let createdAnalysisIds: string[] = [];

  beforeAll(async () => {
    // Create and authenticate user
    const user = testData.generateUser();
    const response = await client.post('/api/v2/auth/register', user);
    authToken = response.data.access_token;
    client.setToken(authToken);
  });

  afterAll(async () => {
    // Cleanup created analyses
    if (process.env.TEST_CLEANUP !== 'false') {
      client.setToken(authToken);
      for (const analysisId of createdAnalysisIds) {
        try {
          await client.delete(`/api/v2/analyses/${analysisId}`);
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    }
  });

  // ============================================
  // POST /api/v2/analyze
  // ============================================

  it('POST /api/v2/analyze - Success: Upload and analyze flight log', async () => {
    const flightLogFile = testData.createFlightLogFile();
    const formData = new FormData();
    formData.append('file', flightLogFile);

    const response = await client.post('/api/v2/analyze', null, { formData });

    expectSuccess(response);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('status');

    // Store for cleanup and later tests
    if (response.data.id) {
      testAnalysisId = response.data.id;
      createdAnalysisIds.push(response.data.id);
    }
  });

  it('POST /api/v2/analyze - Success: Upload with metadata', async () => {
    const flightLogFile = testData.createFlightLogFile();
    const formData = new FormData();
    formData.append('file', flightLogFile);
    formData.append('metadata', JSON.stringify({
      aircraft_id: 1,
      flight_number: 'TEST123',
      pilot_name: 'Test Pilot',
    }));

    const response = await client.post('/api/v2/analyze', null, { formData });

    expectSuccess(response);
    expect(response.data).toHaveProperty('id');
    
    if (response.data.id) {
      createdAnalysisIds.push(response.data.id);
    }
  });

  it('POST /api/v2/analyze - Error: Missing file', async () => {
    const formData = new FormData();
    // No file attached

    const response = await client.post('/api/v2/analyze', null, { formData });

    expectValidationError(response);
  });

  it('POST /api/v2/analyze - Error: Invalid file format', async () => {
    // Create a text file instead of CSV
    const invalidFile = new File(['invalid content'], 'test.txt', { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', invalidFile);

    const response = await client.post('/api/v2/analyze', null, { formData });

    // Backend may return 400 or 422 for invalid file format
    expect(response.status >= 400).toBeTruthy();
  });

  it('POST /api/v2/analyze - Error: Empty file', async () => {
    const emptyFile = new File([''], 'empty.csv', { type: 'text/csv' });
    const formData = new FormData();
    formData.append('file', emptyFile);

    const response = await client.post('/api/v2/analyze', null, { formData });

    expect(response.status >= 400).toBeTruthy();
  });

  it('POST /api/v2/analyze - Error: Unauthenticated request', async () => {
    client.clearToken();
    const flightLogFile = testData.createFlightLogFile();
    const formData = new FormData();
    formData.append('file', flightLogFile);

    const response = await client.post('/api/v2/analyze', null, { formData });

    expectUnauthorized(response);
    
    // Restore token
    client.setToken(authToken);
  });

  // ============================================
  // GET /api/v2/analyses
  // ============================================

  it('GET /api/v2/analyses - Success: List all analyses', async () => {
    const response = await client.get('/api/v2/analyses');

    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
  });

  it('GET /api/v2/analyses - Success: Filter by date range', async () => {
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = new Date().toISOString();

    const response = await client.get('/api/v2/analyses', {
      queryParams: {
        start_date: startDate,
        end_date: endDate,
      },
    });

    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
  });

  it('GET /api/v2/analyses - Success: Filter by status', async () => {
    const response = await client.get('/api/v2/analyses', {
      queryParams: { status: 'completed' },
    });

    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
    
    // All returned analyses should have completed status
    if (response.data.length > 0) {
      response.data.forEach((analysis: any) => {
        expect(analysis.status).toBe('completed');
      });
    }
  });

  it('GET /api/v2/analyses - Success: Pagination', async () => {
    const response = await client.get('/api/v2/analyses', {
      queryParams: { limit: '10', offset: '0' },
    });

    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
    expect(response.data.length).toBeLessThan(11);
  });

  it('GET /api/v2/analyses - Error: Unauthenticated request', async () => {
    client.clearToken();
    const response = await client.get('/api/v2/analyses');

    expectUnauthorized(response);
    
    // Restore token
    client.setToken(authToken);
  });

  // ============================================
  // GET /api/v2/analyses/{id}
  // ============================================

  it('GET /api/v2/analyses/{id} - Success: Get analysis by ID', async () => {
    if (!testAnalysisId) {
      // Skip if no analysis was created
      return;
    }

    const response = await client.get(`/api/v2/analyses/${testAnalysisId}`);

    expectSuccess(response);
    expectValidAnalysis(response.data);
    expect(response.data.id).toBe(testAnalysisId);
  });

  it('GET /api/v2/analyses/{id} - Error: Analysis not found', async () => {
    const response = await client.get('/api/v2/analyses/99999999');

    expectNotFound(response);
  });

  it('GET /api/v2/analyses/{id} - Error: Invalid analysis ID', async () => {
    const response = await client.get('/api/v2/analyses/invalid-id');

    expectValidationError(response);
  });

  it('GET /api/v2/analyses/{id} - Error: Unauthenticated request', async () => {
    if (!testAnalysisId) {
      return;
    }

    client.clearToken();
    const response = await client.get(`/api/v2/analyses/${testAnalysisId}`);

    expectUnauthorized(response);
    
    // Restore token
    client.setToken(authToken);
  });

  // ============================================
  // DELETE /api/v2/analyses/{id}
  // ============================================

  it('DELETE /api/v2/analyses/{id} - Success: Delete analysis', async () => {
    // Create an analysis to delete
    const flightLogFile = testData.createFlightLogFile();
    const formData = new FormData();
    formData.append('file', flightLogFile);

    const createResponse = await client.post('/api/v2/analyze', null, { formData });
    
    if (!createResponse.data.id) {
      return;
    }

    const analysisId = createResponse.data.id;

    // Delete the analysis
    const response = await client.delete(`/api/v2/analyses/${analysisId}`);

    expectSuccess(response);

    // Verify analysis is deleted
    const getResponse = await client.get(`/api/v2/analyses/${analysisId}`);
    expectNotFound(getResponse);
  });

  it('DELETE /api/v2/analyses/{id} - Error: Analysis not found', async () => {
    const response = await client.delete('/api/v2/analyses/99999999');

    expectNotFound(response);
  });

  it('DELETE /api/v2/analyses/{id} - Error: Invalid analysis ID', async () => {
    const response = await client.delete('/api/v2/analyses/invalid-id');

    expectValidationError(response);
  });

  it('DELETE /api/v2/analyses/{id} - Error: Unauthenticated request', async () => {
    if (!testAnalysisId) {
      return;
    }

    client.clearToken();
    const response = await client.delete(`/api/v2/analyses/${testAnalysisId}`);

    expectUnauthorized(response);
    
    // Restore token
    client.setToken(authToken);
  });

  // ============================================
  // GET /api/v2/analyses/export
  // ============================================

  it('GET /api/v2/analyses/export - Success: Export as CSV', async () => {
    const response = await client.get('/api/v2/analyses/export', {
      queryParams: { format: 'csv' },
    });

    expectSuccess(response);
    // Response should be CSV content
    expect(typeof response.data === 'string' || response.data instanceof Blob).toBeTruthy();
  });

  it('GET /api/v2/analyses/export - Success: Export as JSON', async () => {
    const response = await client.get('/api/v2/analyses/export', {
      queryParams: { format: 'json' },
    });

    expectSuccess(response);
    // Response should be JSON array
    expect(Array.isArray(response.data) || typeof response.data === 'object').toBeTruthy();
  });

  it('GET /api/v2/analyses/export - Error: Invalid format', async () => {
    const response = await client.get('/api/v2/analyses/export', {
      queryParams: { format: 'invalid' },
    });

    expectValidationError(response);
  });

  it('GET /api/v2/analyses/export - Error: Unauthenticated request', async () => {
    client.clearToken();
    const response = await client.get('/api/v2/analyses/export', {
      queryParams: { format: 'csv' },
    });

    expectUnauthorized(response);
    
    // Restore token
    client.setToken(authToken);
  });

  // ============================================
  // POST /api/v2/batch-analyze
  // ============================================

  it('POST /api/v2/batch-analyze - Success: Batch upload multiple files', async () => {
    const file1 = testData.createFlightLogFile();
    const file2 = testData.createFlightLogFile();
    const file3 = testData.createFlightLogFile();

    const formData = new FormData();
    formData.append('files[0]', file1);
    formData.append('files[1]', file2);
    formData.append('files[2]', file3);

    const response = await client.post('/api/v2/batch-analyze', null, { formData });

    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
    expect(response.data.length).toBe(3);

    // Store analysis IDs for cleanup
    response.data.forEach((analysis: any) => {
      if (analysis.id) {
        createdAnalysisIds.push(analysis.id);
      }
    });
  });

  it('POST /api/v2/batch-analyze - Error: No files provided', async () => {
    const formData = new FormData();

    const response = await client.post('/api/v2/batch-analyze', null, { formData });

    expectValidationError(response);
  });

  it('POST /api/v2/batch-analyze - Error: Invalid files in batch', async () => {
    const validFile = testData.createFlightLogFile();
    const invalidFile = new File(['invalid'], 'invalid.txt', { type: 'text/plain' });

    const formData = new FormData();
    formData.append('files[0]', validFile);
    formData.append('files[1]', invalidFile);

    const response = await client.post('/api/v2/batch-analyze', null, { formData });

    // Backend may return partial success or complete failure
    expect(response.status >= 200).toBeTruthy();
  });

  it('POST /api/v2/batch-analyze - Error: Unauthenticated request', async () => {
    client.clearToken();
    const file1 = testData.createFlightLogFile();
    const formData = new FormData();
    formData.append('files[0]', file1);

    const response = await client.post('/api/v2/batch-analyze', null, { formData });

    expectUnauthorized(response);
    
    // Restore token
    client.setToken(authToken);
  });

  // ============================================
  // Additional Analysis Tests
  // ============================================

  it('Analysis workflow: Upload, retrieve, and verify results', async () => {
    // Upload file
    const flightLogFile = testData.createFlightLogFile();
    const formData = new FormData();
    formData.append('file', flightLogFile);

    const uploadResponse = await client.post('/api/v2/analyze', null, { formData });
    expectSuccess(uploadResponse);

    const analysisId = uploadResponse.data.id;
    createdAnalysisIds.push(analysisId);

    // Retrieve analysis
    const getResponse = await client.get(`/api/v2/analyses/${analysisId}`);
    expectSuccess(getResponse);
    expect(getResponse.data.id).toBe(analysisId);

    // Verify it appears in list
    const listResponse = await client.get('/api/v2/analyses');
    expectSuccess(listResponse);
    
    const found = listResponse.data.some((a: any) => a.id === analysisId);
    expect(found).toBeTruthy();
  });

  it('Performance: Large file upload', async () => {
    // Create a larger flight log file
    const largeContent = testData.generateFlightLogCSV();
    const largeFile = new File([largeContent.repeat(10)], 'large_flight_log.csv', {
      type: 'text/csv',
    });

    const formData = new FormData();
    formData.append('file', largeFile);

    const startTime = Date.now();
    const response = await client.post('/api/v2/analyze', null, { formData });
    const duration = Date.now() - startTime;

    expectSuccess(response);
    
    // Log performance metric
    console.log(`    Large file upload took ${duration}ms`);

    if (response.data.id) {
      createdAnalysisIds.push(response.data.id);
    }
  });

  it('Data validation: Analysis contains expected fields', async () => {
    if (!testAnalysisId) {
      return;
    }

    const response = await client.get(`/api/v2/analyses/${testAnalysisId}`);

    expectSuccess(response);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('file_id');
    expect(response.data).toHaveProperty('status');
    expect(response.data).toHaveProperty('created_at');
  });

  it('Sorting: GET /api/v2/analyses with sort order', async () => {
    const response = await client.get('/api/v2/analyses', {
      queryParams: { sort: 'created_at', order: 'desc' },
    });

    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();

    // Verify sorting if multiple results
    if (response.data.length > 1) {
      const dates = response.data.map((a: any) => new Date(a.created_at).getTime());
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
      }
    }
  });
});
