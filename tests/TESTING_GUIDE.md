# API Testing Guide - Quick Start

## Running Tests

```bash
# Run all tests
npm run test:api

# Run specific test suite
npm run test:api auth
npm run test:api users
npm run test:api aircraft
npm run test:api analysis
npm run test:api reports
npm run test:api notifications
npm run test:api organizations
npm run test:api api-keys
npm run test:api system

# Run with verbose output
npm run test:api:verbose

# Run without cleanup (for debugging)
npm run test:api:no-cleanup
```

## Test Coverage Summary

| Domain | Test File | Test Count | Coverage |
|--------|-----------|------------|----------|
| Authentication | `auth.test.ts` | 28 tests | Login, Register, Profile, Password Reset, Logout |
| User Management | `users.test.ts` | 30 tests | CRUD operations, Roles, Permissions |
| Aircraft | `aircraft.test.ts` | 35 tests | CRUD, Types, Status transitions |
| Flight Analysis | `analysis.test.ts` | 35 tests | Upload, Analyze, Batch, Export |
| Reports | `reports.test.ts` | 11 tests | Generate, Export (PDF/CSV) |
| Notifications | `notifications.test.ts` | 9 tests | List, Mark as read, Delete |
| Organizations | `organizations.test.ts` | 7 tests | CRUD operations |
| API Keys | `api-keys.test.ts` | 6 tests | CRUD operations |
| System | `system.test.ts` | 4 tests | Health checks, Status |

**Total: 165+ comprehensive API endpoint tests**

## Environment Setup

Create a `.env` file or set environment variables:

```bash
VITE_API_URL=https://dbx-system-production.up.railway.app
TEST_TIMEOUT=30000
TEST_CLEANUP=true
```

## Test Structure

Each test suite follows this pattern:

1. **Setup** (`beforeAll`) - Create test users and authenticate
2. **Tests** - Execute API calls and validate responses
3. **Cleanup** (`afterAll`) - Remove test data

## Key Features

✅ Comprehensive coverage of all API endpoints  
✅ Tests for both success and error scenarios  
✅ Authentication and authorization testing  
✅ Data validation and integrity checks  
✅ Automatic test data cleanup  
✅ Clear, readable test output  
✅ Performance metrics for large operations  

## Example Test Output

```
API Endpoint Tests
==================

System Tests
  ✓ GET /health - Success: Health check (45ms)
  ✓ GET /api/v2/status - Success: System status (52ms)

Authentication Tests
  ✓ POST /api/v2/auth/register - Success with valid data (234ms)
  ✓ POST /api/v2/auth/login - Success with valid credentials (189ms)
  ...

Summary
-------
Total: 165 tests
✓ Passed: 163
✗ Failed: 2
Duration: 45.2s
```

## Troubleshooting

**Connection Errors:**
- Verify `VITE_API_URL` is correct
- Check backend is running
- Test with: `npm run test:api system`

**Authentication Failures:**
- Check user creation in test setup
- Verify token handling
- Review backend auth requirements

**Test Data Conflicts:**
- Enable cleanup: `TEST_CLEANUP=true`
- Use unique timestamps in test data
- Run with: `npm run test:api:no-cleanup` to debug

## Next Steps

1. Run system tests first: `npm run test:api system`
2. Run auth tests: `npm run test:api auth`
3. Run full suite: `npm run test:api`
4. Review failures and adjust as needed
5. Integrate into CI/CD pipeline

For detailed documentation, see `tests/README.md`
