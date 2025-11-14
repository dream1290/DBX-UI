# API Endpoint Tests

Comprehensive test suite for the DBX System backend API endpoints.

## Overview

This test suite validates all API endpoints documented at https://dbx-system-production.up.railway.app/api/v2/docs, ensuring proper functionality, error handling, and data validation.

## Test Coverage

The test suite covers the following API domains:

- **Authentication** (`auth.test.ts`) - Login, register, logout, profile, password reset
- **User Management** (`users.test.ts`) - CRUD operations, password reset
- **Aircraft Management** (`aircraft.test.ts`) - CRUD operations, types
- **Flight Analysis** (`analysis.test.ts`) - Upload, analyze, batch analyze, export
- **Reports** (`reports.test.ts`) - Generate, retrieve, export, delete
- **Notifications** (`notifications.test.ts`) - Retrieve, mark as read, delete
- **Organizations** (`organizations.test.ts`) - CRUD operations
- **API Keys** (`api-keys.test.ts`) - CRUD operations
- **System** (`system.test.ts`) - Health checks, status, metrics

## Running Tests

### Run All Tests

```bash
npm run test:api
```

### Run Specific Test Suite

```bash
npm run test:api auth
npm run test:api users
npm run test:api aircraft
# ... etc
```

### Run with Verbose Output

```bash
npm run test:api:verbose
```

### Run Without Cleanup (for debugging)

```bash
npm run test:api:no-cleanup
```

## Environment Configuration

Tests use the following environment variables:

- `VITE_API_URL` - Backend API base URL (default: https://dbx-system-production.up.railway.app)
- `TEST_TIMEOUT` - Maximum time for each test in milliseconds (default: 30000)
- `TEST_CLEANUP` - Whether to clean up test data after execution (default: true)

You can set these in your `.env` file or pass them directly:

```bash
VITE_API_URL=http://localhost:8000 npm run test:api
```

## Test Structure

Each test file follows this structure:

```typescript
import { describe, it, beforeAll, afterAll } from '../helpers/test-runner';
import { TestApiClient } from '../helpers/api-client';
import { expect, expectStatus } from '../helpers/assertions';
import { testData } from '../helpers/test-data';

const API_URL = process.env.VITE_API_URL || 'https://dbx-system-production.up.railway.app';
const client = new TestApiClient(API_URL);

describe('Domain Tests', () => {
  let testUser: any;
  let authToken: string;

  beforeAll(async () => {
    // Setup: Create test data
    testUser = testData.generateUser();
    const response = await client.post('/api/v2/auth/register', testUser);
    authToken = response.data.access_token;
    client.setToken(authToken);
  });

  afterAll(async () => {
    // Cleanup: Remove test data
    if (process.env.TEST_CLEANUP !== 'false') {
      // Clean up test data
    }
  });

  it('should test something', async () => {
    const response = await client.get('/api/v2/endpoint');
    expectStatus(response, 200);
    expect(response.data).toHaveProperty('id');
  });
});
```

## Test Helpers

### Test Runner (`helpers/test-runner.ts`)

Provides test execution framework:
- `describe(name, fn)` - Define a test suite
- `it(name, fn)` - Define a test case
- `beforeAll(fn)` - Run before all tests in suite
- `afterAll(fn)` - Run after all tests in suite
- `beforeEach(fn)` - Run before each test
- `afterEach(fn)` - Run after each test

### API Client (`helpers/api-client.ts`)

HTTP client for making test requests:
- `client.get(endpoint, options)` - GET request
- `client.post(endpoint, body, options)` - POST request
- `client.put(endpoint, body, options)` - PUT request
- `client.delete(endpoint, options)` - DELETE request
- `client.setToken(token)` - Set auth token
- `client.clearToken()` - Clear auth token

### Assertions (`helpers/assertions.ts`)

Custom assertion functions:
- `expect(value).toBe(expected)` - Strict equality
- `expect(value).toEqual(expected)` - Deep equality
- `expect(value).toHaveProperty(prop)` - Property existence
- `expectStatus(response, status)` - HTTP status code
- `expectSuccess(response)` - 2xx status code
- `expectError(response, status)` - Error status code
- `expectUnauthorized(response)` - 401 status
- `expectForbidden(response)` - 403 status
- `expectNotFound(response)` - 404 status
- `expectValidationError(response)` - 422 status

### Test Data (`helpers/test-data.ts`)

Realistic test data generators:
- `testData.generateUser()` - Generate user data
- `testData.generateAircraft()` - Generate aircraft data
- `testData.generateReport()` - Generate report data
- `testData.generateApiKey()` - Generate API key data
- `testData.generateOrganization()` - Generate org data
- `testData.createFlightLogFile()` - Generate flight log file

## Writing New Tests

1. Create a new test file in `tests/api/` directory
2. Import test helpers
3. Define test suite with `describe()`
4. Add setup/teardown with `beforeAll()`/`afterAll()`
5. Write test cases with `it()`
6. Use assertions to validate responses
7. Clean up test data in `afterAll()`

Example:

```typescript
import { describe, it, beforeAll, afterAll } from '../helpers/test-runner';
import { TestApiClient } from '../helpers/api-client';
import { expect, expectStatus, expectSuccess } from '../helpers/assertions';
import { testData } from '../helpers/test-data';

const API_URL = process.env.VITE_API_URL || 'https://dbx-system-production.up.railway.app';
const client = new TestApiClient(API_URL);

describe('New Feature Tests', () => {
  let authToken: string;
  let testEntityId: string;

  beforeAll(async () => {
    // Create test user and authenticate
    const user = testData.generateUser();
    const response = await client.post('/api/v2/auth/register', user);
    authToken = response.data.access_token;
    client.setToken(authToken);
  });

  afterAll(async () => {
    // Clean up test data
    if (testEntityId && process.env.TEST_CLEANUP !== 'false') {
      await client.delete(`/api/v2/entities/${testEntityId}`);
    }
  });

  it('should create a new entity', async () => {
    const entityData = { name: 'Test Entity' };
    const response = await client.post('/api/v2/entities', entityData);
    
    expectStatus(response, 201);
    expect(response.data).toHaveProperty('id');
    expect(response.data.name).toBe('Test Entity');
    
    testEntityId = response.data.id;
  });

  it('should retrieve the entity', async () => {
    const response = await client.get(`/api/v2/entities/${testEntityId}`);
    
    expectSuccess(response);
    expect(response.data.id).toBe(testEntityId);
  });
});
```

## Troubleshooting

### Tests Failing to Connect

- Verify `VITE_API_URL` is set correctly
- Check that the backend API is running and accessible
- Ensure network connectivity

### Authentication Errors

- Check that test user creation is successful
- Verify token is being set correctly with `client.setToken()`
- Ensure endpoints require correct authentication

### Test Data Conflicts

- Use unique test data with timestamps
- Enable cleanup with `TEST_CLEANUP=true`
- Manually clean up test data if needed

### Timeout Errors

- Increase `TEST_TIMEOUT` environment variable
- Check for slow API responses
- Verify network latency

## Best Practices

1. **Always clean up test data** - Use `afterAll()` to remove test entities
2. **Use unique test data** - Generate unique IDs with timestamps
3. **Test both success and error cases** - Validate proper error handling
4. **Keep tests independent** - Each test should work in isolation
5. **Use descriptive test names** - Clearly indicate what is being tested
6. **Handle async operations** - Always use `async/await`
7. **Validate response structure** - Check for expected properties
8. **Test authentication** - Verify both authenticated and unauthenticated scenarios

## CI/CD Integration

To integrate with CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run API Tests
  run: npm run test:api
  env:
    VITE_API_URL: ${{ secrets.API_URL }}
```

## Future Enhancements

- Performance benchmarking
- Load testing capabilities
- Test coverage reporting
- Automated test generation from OpenAPI spec
- Visual test result dashboard
- Integration with monitoring tools
