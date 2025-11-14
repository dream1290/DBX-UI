# Design Document: API Endpoint Testing Suite

## Overview

This design document outlines the implementation of a comprehensive API endpoint testing suite for the DBX System backend. The suite will use a simple, script-based approach that can be run directly with Node.js/Bun, without requiring additional testing frameworks. This approach prioritizes simplicity, clarity, and ease of execution while providing thorough coverage of all API endpoints.

## Architecture

### Testing Approach

We'll create a lightweight testing framework using TypeScript that:
1. Makes direct HTTP requests to the API using the native fetch API
2. Validates responses against expected outcomes
3. Reports results in a clear, readable format
4. Handles test data setup and cleanup
5. Supports running individual test suites or all tests

### Project Structure

```
tests/
├── api/
│   ├── auth.test.ts           # Authentication endpoint tests
│   ├── users.test.ts          # User management tests
│   ├── aircraft.test.ts       # Aircraft management tests
│   ├── analysis.test.ts       # Flight analysis tests
│   ├── reports.test.ts        # Report generation tests
│   ├── notifications.test.ts  # Notification tests
│   ├── organizations.test.ts  # Organization tests
│   ├── api-keys.test.ts       # API key management tests
│   └── system.test.ts         # System health/status tests
├── helpers/
│   ├── test-runner.ts         # Test execution framework
│   ├── api-client.ts          # HTTP client for tests
│   ├── test-data.ts           # Mock data generators
│   └── assertions.ts          # Custom assertion helpers
└── run-tests.ts               # Main test runner entry point
```

## Components and Interfaces

### Test Runner Framework

The test runner will provide a simple API for defining and executing tests:

```typescript
interface TestCase {
  name: string;
  fn: () => Promise<void>;
  skip?: boolean;
}

interface TestSuite {
  name: string;
  tests: TestCase[];
  beforeAll?: () => Promise<void>;
  afterAll?: () => Promise<void>;
  beforeEach?: () => Promise<void>;
  afterEach?: () => Promise<void>;
}

class TestRunner {
  async describe(name: string, fn: () => void): Promise<void>;
  async it(name: string, fn: () => Promise<void>): Promise<void>;
  async beforeAll(fn: () => Promise<void>): void;
  async afterAll(fn: () => Promise<void>): void;
  async run(): Promise<TestResults>;
}
```

### API Client

A simplified HTTP client for making test requests:

```typescript
class TestApiClient {
  private baseURL: string;
  private token: string | null;

  async request<T>(
    method: string,
    endpoint: string,
    options?: {
      body?: any;
      headers?: Record<string, string>;
      formData?: FormData;
    }
  ): Promise<{ status: number; data: T; headers: Headers }>;

  setToken(token: string): void;
  clearToken(): void;
}
```

### Assertion Helpers

Custom assertion functions for common test scenarios:

```typescript
function expect(actual: any): {
  toBe(expected: any): void;
  toEqual(expected: any): void;
  toContain(expected: any): void;
  toHaveProperty(property: string): void;
  toBeGreaterThan(expected: number): void;
  toBeTruthy(): void;
  toBeFalsy(): void;
};

function expectStatus(response: any, expectedStatus: number): void;
function expectSuccess(response: any): void;
function expectError(response: any, expectedStatus: number): void;
```

### Test Data Generators

Functions to generate realistic test data:

```typescript
interface TestDataGenerators {
  generateUser(): {
    email: string;
    password: string;
    full_name: string;
    organization: string;
  };
  
  generateAircraft(): {
    registration: string;
    serial_number: string;
    manufacturer: string;
    model: string;
    variant: string;
    year_manufactured: number;
    // ... other fields
  };
  
  generateReport(): {
    title: string;
    description: string;
    report_type: string;
    // ... other fields
  };
  
  generateApiKey(): {
    name: string;
    description: string;
    permissions: string[];
  };
}
```

## Data Models

### Test Result Models

```typescript
interface TestResult {
  name: string;
  passed: boolean;
  error?: Error;
  duration: number;
}

interface SuiteResult {
  name: string;
  tests: TestResult[];
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
}

interface TestResults {
  suites: SuiteResult[];
  totalPassed: number;
  totalFailed: number;
  totalSkipped: number;
  totalDuration: number;
}
```

## Test Coverage

### Authentication Endpoints

1. **POST /api/v2/auth/register**
   - Success: Valid registration data
   - Error: Duplicate email
   - Error: Invalid email format
   - Error: Weak password

2. **POST /api/v2/auth/login**
   - Success: Valid credentials
   - Error: Invalid credentials
   - Error: Missing fields

3. **POST /api/v2/auth/logout**
   - Success: Authenticated user logout
   - Error: Unauthenticated request

4. **POST /api/v2/auth/refresh**
   - Success: Valid refresh token
   - Error: Invalid refresh token
   - Error: Expired refresh token

5. **GET /api/v2/auth/profile**
   - Success: Get authenticated user profile
   - Error: Unauthenticated request

6. **PUT /api/v2/auth/profile**
   - Success: Update profile with valid data
   - Error: Invalid data format

7. **POST /api/v2/auth/forgot-password**
   - Success: Valid email
   - Error: Non-existent email

8. **POST /api/v2/auth/reset-password**
   - Success: Valid token and password
   - Error: Invalid token

### User Management Endpoints

1. **GET /api/v2/users**
   - Success: List all users (admin only)
   - Error: Unauthorized access (non-admin)

2. **POST /api/v2/users**
   - Success: Create user with valid data
   - Error: Duplicate email
   - Error: Invalid role

3. **GET /api/v2/users/{id}**
   - Success: Get user by ID
   - Error: User not found

4. **PUT /api/v2/users/{id}**
   - Success: Update user
   - Error: Invalid data

5. **DELETE /api/v2/users/{id}**
   - Success: Delete user
   - Error: Cannot delete self

6. **POST /api/v2/users/{id}/reset-password**
   - Success: Reset user password
   - Error: User not found

### Aircraft Management Endpoints

1. **GET /api/v2/aircraft/types**
   - Success: List all aircraft types

2. **GET /api/v2/aircraft**
   - Success: List all aircraft
   - Success: Filter by status
   - Success: Pagination

3. **POST /api/v2/aircraft**
   - Success: Create aircraft with valid data
   - Error: Duplicate registration
   - Error: Invalid data

4. **GET /api/v2/aircraft/{id}**
   - Success: Get aircraft by ID
   - Error: Aircraft not found

5. **PUT /api/v2/aircraft/{id}**
   - Success: Update aircraft
   - Error: Invalid data

6. **DELETE /api/v2/aircraft/{id}**
   - Success: Delete aircraft
   - Error: Aircraft not found

### Flight Analysis Endpoints

1. **POST /api/v2/analyze**
   - Success: Upload and analyze flight log
   - Error: Invalid file format
   - Error: Missing file

2. **GET /api/v2/analyses**
   - Success: List all analyses
   - Success: Filter by date range

3. **GET /api/v2/analyses/{id}**
   - Success: Get analysis by ID
   - Error: Analysis not found

4. **DELETE /api/v2/analyses/{id}**
   - Success: Delete analysis
   - Error: Analysis not found

5. **GET /api/v2/analyses/export**
   - Success: Export as CSV
   - Success: Export as JSON

6. **POST /api/v2/batch-analyze**
   - Success: Batch upload multiple files
   - Error: Invalid files

### Report Endpoints

1. **GET /api/v2/reports**
   - Success: List all reports
   - Success: Filter by type

2. **POST /api/v2/reports**
   - Success: Generate report
   - Error: Invalid parameters

3. **GET /api/v2/reports/{id}**
   - Success: Get report by ID
   - Error: Report not found

4. **GET /api/v2/reports/{id}/pdf**
   - Success: Export report as PDF

5. **GET /api/v2/reports/{id}/csv**
   - Success: Export report as CSV

6. **DELETE /api/v2/reports/{id}**
   - Success: Delete report

### Notification Endpoints

1. **GET /api/v2/notifications**
   - Success: List all notifications
   - Success: Filter by read status

2. **PUT /api/v2/notifications/{id}/read**
   - Success: Mark notification as read
   - Error: Notification not found

3. **DELETE /api/v2/notifications/{id}**
   - Success: Delete notification

4. **POST /api/v2/notifications/mark-all-read**
   - Success: Mark all as read

### Organization Endpoints

1. **GET /api/v2/organizations**
   - Success: List all organizations

2. **POST /api/v2/organizations**
   - Success: Create organization
   - Error: Duplicate name

3. **GET /api/v2/organizations/{id}**
   - Success: Get organization by ID
   - Error: Organization not found

4. **PUT /api/v2/organizations/{id}**
   - Success: Update organization

5. **DELETE /api/v2/organizations/{id}**
   - Success: Delete organization

### API Key Endpoints

1. **GET /api/v2/api-keys**
   - Success: List all API keys

2. **POST /api/v2/api-keys**
   - Success: Create API key
   - Error: Invalid permissions

3. **PUT /api/v2/api-keys/{id}**
   - Success: Update API key

4. **DELETE /api/v2/api-keys/{id}**
   - Success: Delete API key

### System Endpoints

1. **GET /health**
   - Success: Health check

2. **GET /api/v2/status**
   - Success: System status

3. **GET /api/v2/system/health-detailed**
   - Success: Detailed health information

4. **GET /api/v2/model/info**
   - Success: ML model information

## Error Handling

### Test Execution Errors

- **Network Errors**: Catch and report connection failures
- **Timeout Errors**: Set reasonable timeouts for API calls
- **Assertion Errors**: Clearly report what was expected vs actual
- **Setup/Teardown Errors**: Handle test data creation/cleanup failures

### Error Reporting

Test results will include:
- Test name and suite
- Pass/fail status
- Error message and stack trace for failures
- Duration for each test
- Summary statistics

## Testing Strategy

### Test Execution Order

1. **System Health Tests**: Verify API is accessible
2. **Authentication Tests**: Create test users and obtain tokens
3. **Domain Tests**: Run tests for each domain (users, aircraft, etc.)
4. **Cleanup**: Remove test data

### Test Data Management

- Generate unique test data for each test run using timestamps
- Store test entity IDs for cleanup
- Clean up test data in afterAll hooks
- Handle cleanup failures gracefully

### Authentication Strategy

- Create a test admin user during setup
- Create a test regular user during setup
- Use appropriate user tokens for permission tests
- Test both authenticated and unauthenticated scenarios

## Implementation Notes

### Environment Configuration

Tests will read configuration from environment variables:
- `VITE_API_URL`: Backend API base URL
- `TEST_TIMEOUT`: Maximum time for each test (default: 30s)
- `TEST_CLEANUP`: Whether to clean up test data (default: true)

### Running Tests

```bash
# Run all tests
npm run test:api

# Run specific suite
npm run test:api -- auth

# Run with verbose output
npm run test:api -- --verbose

# Skip cleanup (for debugging)
npm run test:api -- --no-cleanup
```

### Output Format

```
API Endpoint Tests
==================

Authentication Tests
  ✓ POST /api/v2/auth/register - Success (245ms)
  ✓ POST /api/v2/auth/register - Duplicate email error (123ms)
  ✓ POST /api/v2/auth/login - Success (189ms)
  ✓ POST /api/v2/auth/login - Invalid credentials (156ms)
  ...

User Management Tests
  ✓ GET /api/v2/users - List users (98ms)
  ✗ POST /api/v2/users - Create user (234ms)
    Expected status 201, got 422
    Response: { detail: "Email already exists" }
  ...

Summary
-------
Total: 87 tests
Passed: 85
Failed: 2
Skipped: 0
Duration: 12.4s
```

## Future Enhancements

- Integration with CI/CD pipeline
- Performance testing (response time benchmarks)
- Load testing capabilities
- Test coverage reporting
- Automated test generation from OpenAPI spec
- Visual test result dashboard
