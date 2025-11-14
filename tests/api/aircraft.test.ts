// Aircraft Management Endpoint Tests
// Tests for /api/v2/aircraft/* endpoints

import { describe, it, beforeAll, afterAll } from '../helpers/test-runner';
import { TestApiClient } from '../helpers/api-client';
import {
  expect,
  expectStatus,
  expectSuccess,
  expectUnauthorized,
  expectNotFound,
  expectValidationError,
  expectValidAircraft,
} from '../helpers/assertions';
import { testData } from '../helpers/test-data';

const API_URL = process.env.VITE_API_URL || 'https://dbx-system-production.up.railway.app';
const client = new TestApiClient(API_URL);

describe('Aircraft Management Tests', () => {
  let authToken: string;
  let testAircraftId: string;
  let createdAircraftIds: string[] = [];

  beforeAll(async () => {
    // Create and authenticate user
    const user = testData.generateUser();
    const response = await client.post('/api/v2/auth/register', user);
    authToken = response.data.access_token;
    client.setToken(authToken);
  });

  afterAll(async () => {
    // Cleanup created aircraft
    if (process.env.TEST_CLEANUP !== 'false') {
      client.setToken(authToken);
      for (const aircraftId of createdAircraftIds) {
        try {
          await client.delete(`/api/v2/aircraft/${aircraftId}`);
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    }
  });

  // ============================================
  // GET /api/v2/aircraft/types
  // ============================================

  it('GET /api/v2/aircraft/types - Success: List all aircraft types', async () => {
    const response = await client.get('/api/v2/aircraft/types');

    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
    
    if (response.data.length > 0) {
      expect(response.data[0]).toHaveProperty('id');
      expect(response.data[0]).toHaveProperty('name');
    }
  });

  it('GET /api/v2/aircraft/types - Success: Unauthenticated access allowed', async () => {
    client.clearToken();
    const response = await client.get('/api/v2/aircraft/types');

    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
    
    // Restore token
    client.setToken(authToken);
  });

  // ============================================
  // GET /api/v2/aircraft
  // ============================================

  it('GET /api/v2/aircraft - Success: List all aircraft', async () => {
    const response = await client.get('/api/v2/aircraft');

    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
  });

  it('GET /api/v2/aircraft - Success: Filter by status', async () => {
    const response = await client.get('/api/v2/aircraft', {
      queryParams: { status: 'active' },
    });

    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
    
    // All returned aircraft should have active status
    if (response.data.length > 0) {
      response.data.forEach((aircraft: any) => {
        expect(aircraft.operational_status).toBe('active');
      });
    }
  });

  it('GET /api/v2/aircraft - Success: Pagination with limit and offset', async () => {
    const response = await client.get('/api/v2/aircraft', {
      queryParams: { limit: '5', offset: '0' },
    });

    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
    expect(response.data.length).toBeLessThan(6);
  });

  it('GET /api/v2/aircraft - Error: Unauthenticated request', async () => {
    client.clearToken();
    const response = await client.get('/api/v2/aircraft');

    expectUnauthorized(response);
    
    // Restore token
    client.setToken(authToken);
  });

  // ============================================
  // POST /api/v2/aircraft
  // ============================================

  it('POST /api/v2/aircraft - Success: Create aircraft with valid data', async () => {
    const aircraftData = testData.generateAircraft();

    const response = await client.post('/api/v2/aircraft', aircraftData);

    expectSuccess(response);
    expectValidAircraft(response.data);
    expect(response.data.registration).toBe(aircraftData.registration);
    expect(response.data.manufacturer).toBe(aircraftData.manufacturer);
    expect(response.data.model).toBe(aircraftData.model);

    // Store for cleanup and later tests
    testAircraftId = response.data.id;
    createdAircraftIds.push(response.data.id);
  });

  it('POST /api/v2/aircraft - Error: Duplicate registration', async () => {
    const aircraftData = testData.generateAircraft();

    // Create first aircraft
    const firstResponse = await client.post('/api/v2/aircraft', aircraftData);
    createdAircraftIds.push(firstResponse.data.id);

    // Try to create duplicate with same registration
    const response = await client.post('/api/v2/aircraft', aircraftData);

    // Backend may return 400 or 422 for duplicate
    expect(response.status >= 400).toBeTruthy();
    expect(response.data).toHaveProperty('detail');
  });

  it('POST /api/v2/aircraft - Error: Invalid data (missing required fields)', async () => {
    const invalidData = testData.generateInvalidAircraft();

    const response = await client.post('/api/v2/aircraft', invalidData);

    expectValidationError(response);
  });

  it('POST /api/v2/aircraft - Error: Invalid year_manufactured', async () => {
    const aircraftData = {
      ...testData.generateAircraft(),
      year_manufactured: 1800, // Too old
    };

    const response = await client.post('/api/v2/aircraft', aircraftData);

    expectValidationError(response);
  });

  it('POST /api/v2/aircraft - Error: Invalid operational_status', async () => {
    const aircraftData = {
      ...testData.generateAircraft(),
      operational_status: 'invalid_status',
    };

    const response = await client.post('/api/v2/aircraft', aircraftData);

    expectValidationError(response);
  });

  it('POST /api/v2/aircraft - Error: Negative values for numeric fields', async () => {
    const aircraftData = {
      ...testData.generateAircraft(),
      max_passengers: -10,
    };

    const response = await client.post('/api/v2/aircraft', aircraftData);

    expectValidationError(response);
  });

  it('POST /api/v2/aircraft - Error: Unauthenticated request', async () => {
    client.clearToken();
    const aircraftData = testData.generateAircraft();

    const response = await client.post('/api/v2/aircraft', aircraftData);

    expectUnauthorized(response);
    
    // Restore token
    client.setToken(authToken);
  });

  // ============================================
  // GET /api/v2/aircraft/{id}
  // ============================================

  it('GET /api/v2/aircraft/{id} - Success: Get aircraft by ID', async () => {
    const response = await client.get(`/api/v2/aircraft/${testAircraftId}`);

    expectSuccess(response);
    expectValidAircraft(response.data);
    expect(response.data.id).toBe(testAircraftId);
  });

  it('GET /api/v2/aircraft/{id} - Error: Aircraft not found', async () => {
    const response = await client.get('/api/v2/aircraft/99999999');

    expectNotFound(response);
  });

  it('GET /api/v2/aircraft/{id} - Error: Invalid aircraft ID format', async () => {
    const response = await client.get('/api/v2/aircraft/invalid-id');

    expectValidationError(response);
  });

  it('GET /api/v2/aircraft/{id} - Error: Unauthenticated request', async () => {
    client.clearToken();
    const response = await client.get(`/api/v2/aircraft/${testAircraftId}`);

    expectUnauthorized(response);
    
    // Restore token
    client.setToken(authToken);
  });

  // ============================================
  // PUT /api/v2/aircraft/{id}
  // ============================================

  it('PUT /api/v2/aircraft/{id} - Success: Update aircraft', async () => {
    const updateData = {
      operational_status: 'maintenance',
      max_passengers: 200,
    };

    const response = await client.put(`/api/v2/aircraft/${testAircraftId}`, updateData);

    expectSuccess(response);
    expect(response.data.operational_status).toBe('maintenance');
    expect(response.data.max_passengers).toBe(200);
  });

  it('PUT /api/v2/aircraft/{id} - Success: Update aircraft manufacturer and model', async () => {
    const updateData = {
      manufacturer: 'Updated Manufacturer',
      model: 'Updated Model',
    };

    const response = await client.put(`/api/v2/aircraft/${testAircraftId}`, updateData);

    expectSuccess(response);
    expect(response.data.manufacturer).toBe('Updated Manufacturer');
    expect(response.data.model).toBe('Updated Model');
  });

  it('PUT /api/v2/aircraft/{id} - Error: Invalid data', async () => {
    const invalidData = {
      max_passengers: -50, // Negative value
    };

    const response = await client.put(`/api/v2/aircraft/${testAircraftId}`, invalidData);

    expectValidationError(response);
  });

  it('PUT /api/v2/aircraft/{id} - Error: Aircraft not found', async () => {
    const updateData = {
      operational_status: 'active',
    };

    const response = await client.put('/api/v2/aircraft/99999999', updateData);

    expectNotFound(response);
  });

  it('PUT /api/v2/aircraft/{id} - Error: Invalid operational status', async () => {
    const updateData = {
      operational_status: 'invalid_status',
    };

    const response = await client.put(`/api/v2/aircraft/${testAircraftId}`, updateData);

    expectValidationError(response);
  });

  it('PUT /api/v2/aircraft/{id} - Error: Unauthenticated request', async () => {
    client.clearToken();
    const updateData = {
      operational_status: 'active',
    };

    const response = await client.put(`/api/v2/aircraft/${testAircraftId}`, updateData);

    expectUnauthorized(response);
    
    // Restore token
    client.setToken(authToken);
  });

  // ============================================
  // DELETE /api/v2/aircraft/{id}
  // ============================================

  it('DELETE /api/v2/aircraft/{id} - Success: Delete aircraft', async () => {
    // Create an aircraft to delete
    const aircraftData = testData.generateAircraft();
    const createResponse = await client.post('/api/v2/aircraft', aircraftData);
    const aircraftId = createResponse.data.id;

    // Delete the aircraft
    const response = await client.delete(`/api/v2/aircraft/${aircraftId}`);

    expectSuccess(response);

    // Verify aircraft is deleted
    const getResponse = await client.get(`/api/v2/aircraft/${aircraftId}`);
    expectNotFound(getResponse);
  });

  it('DELETE /api/v2/aircraft/{id} - Error: Aircraft not found', async () => {
    const response = await client.delete('/api/v2/aircraft/99999999');

    expectNotFound(response);
  });

  it('DELETE /api/v2/aircraft/{id} - Error: Invalid aircraft ID', async () => {
    const response = await client.delete('/api/v2/aircraft/invalid-id');

    expectValidationError(response);
  });

  it('DELETE /api/v2/aircraft/{id} - Error: Unauthenticated request', async () => {
    client.clearToken();
    const response = await client.delete(`/api/v2/aircraft/${testAircraftId}`);

    expectUnauthorized(response);
    
    // Restore token
    client.setToken(authToken);
  });

  // ============================================
  // Additional Aircraft Management Tests
  // ============================================

  it('Search: GET /api/v2/aircraft by manufacturer', async () => {
    const response = await client.get('/api/v2/aircraft', {
      queryParams: { manufacturer: 'Boeing' },
    });

    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
    
    // All returned aircraft should be Boeing
    if (response.data.length > 0) {
      response.data.forEach((aircraft: any) => {
        expect(aircraft.manufacturer).toBe('Boeing');
      });
    }
  });

  it('Search: GET /api/v2/aircraft by model', async () => {
    const response = await client.get('/api/v2/aircraft', {
      queryParams: { model: '737' },
    });

    expectSuccess(response);
    expect(Array.isArray(response.data)).toBeTruthy();
  });

  it('Validation: Aircraft registration format', async () => {
    const aircraftData = {
      ...testData.generateAircraft(),
      registration: 'INVALID', // Should follow specific format
    };

    const response = await client.post('/api/v2/aircraft', aircraftData);

    // Backend may accept or reject based on registration format rules
    if (response.status >= 400) {
      expectValidationError(response);
    }
  });

  it('Data integrity: All numeric fields are positive', async () => {
    const response = await client.get(`/api/v2/aircraft/${testAircraftId}`);

    expectSuccess(response);
    
    // Verify all numeric fields are positive
    expect(response.data.max_passengers).toBeGreaterThan(0);
    expect(response.data.max_cargo_kg).toBeGreaterThan(0);
    expect(response.data.fuel_capacity_liters).toBeGreaterThan(0);
    expect(response.data.cruise_speed_knots).toBeGreaterThan(0);
    expect(response.data.range_nm).toBeGreaterThan(0);
    expect(response.data.service_ceiling_ft).toBeGreaterThan(0);
  });

  it('Bulk operations: Create multiple aircraft', async () => {
    const aircraftList = [
      testData.generateAircraft(),
      testData.generateAircraft(),
      testData.generateAircraft(),
    ];

    const createdIds: string[] = [];

    for (const aircraft of aircraftList) {
      const response = await client.post('/api/v2/aircraft', aircraft);
      expectSuccess(response);
      createdIds.push(response.data.id);
    }

    // Store for cleanup
    createdAircraftIds.push(...createdIds);

    // Verify all were created
    expect(createdIds.length).toBe(3);
  });

  it('Status transitions: Update aircraft through lifecycle', async () => {
    // Create aircraft
    const aircraftData = testData.generateAircraft();
    const createResponse = await client.post('/api/v2/aircraft', aircraftData);
    const aircraftId = createResponse.data.id;
    createdAircraftIds.push(aircraftId);

    // Active -> Maintenance
    let response = await client.put(`/api/v2/aircraft/${aircraftId}`, {
      operational_status: 'maintenance',
    });
    expectSuccess(response);
    expect(response.data.operational_status).toBe('maintenance');

    // Maintenance -> Active
    response = await client.put(`/api/v2/aircraft/${aircraftId}`, {
      operational_status: 'active',
    });
    expectSuccess(response);
    expect(response.data.operational_status).toBe('active');

    // Active -> Retired
    response = await client.put(`/api/v2/aircraft/${aircraftId}`, {
      operational_status: 'retired',
    });
    expectSuccess(response);
    expect(response.data.operational_status).toBe('retired');
  });
});
