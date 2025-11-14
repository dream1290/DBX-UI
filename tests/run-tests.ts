#!/usr/bin/env node
// Main Test Runner Entry Point
// Executes API endpoint tests and reports results

import { runner, TestResults } from './helpers/test-runner';

// Get command line arguments
const args = process.argv.slice(2);
const specificSuite = args.find(arg => !arg.startsWith('--'));
const verbose = args.includes('--verbose');
const noCleanup = args.includes('--no-cleanup');

// Set environment variables
if (noCleanup) {
  process.env.TEST_CLEANUP = 'false';
}

// Import all test suites
async function loadTests() {
  const suites = [
    'system',      // Run system tests first to verify API is accessible
    'auth',        // Then authentication
    'users',
    'aircraft',
    'analysis',
    'reports',
    'notifications',
    'organizations',
    'api-keys',
  ];

  // If specific suite is requested, only load that one
  const suitesToLoad = specificSuite ? [specificSuite] : suites;

  for (const suite of suitesToLoad) {
    try {
      await import(`./api/${suite}.test.ts`);
    } catch (error) {
      console.error(`Failed to load test suite: ${suite}`);
      if (verbose) {
        console.error(error);
      }
    }
  }
}

// Print test results summary
function printSummary(results: TestResults) {
  console.log('\n' + '='.repeat(50));
  console.log('Test Summary');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${results.totalPassed + results.totalFailed + results.totalSkipped}`);
  console.log(`✓ Passed: ${results.totalPassed}`);
  console.log(`✗ Failed: ${results.totalFailed}`);
  console.log(`⊘ Skipped: ${results.totalSkipped}`);
  console.log(`Duration: ${(results.totalDuration / 1000).toFixed(2)}s`);
  console.log('='.repeat(50));

  if (results.totalFailed > 0) {
    console.log('\nFailed Tests:');
    results.suites.forEach(suite => {
      suite.tests.forEach(test => {
        if (!test.passed) {
          console.log(`  - ${suite.name} > ${test.name}`);
          if (test.error && verbose) {
            console.log(`    ${test.error.message}`);
            if (test.error.stack) {
              console.log(`    ${test.error.stack}`);
            }
          }
        }
      });
    });
  }
}

// Main execution
async function main() {
  console.log('API Endpoint Tests');
  console.log('==================\n');
  console.log(`API URL: ${process.env.VITE_API_URL || 'https://dbx-system-production.up.railway.app'}`);
  
  if (specificSuite) {
    console.log(`Running suite: ${specificSuite}`);
  } else {
    console.log('Running all test suites');
  }
  
  if (noCleanup) {
    console.log('⚠️  Test cleanup disabled');
  }
  
  console.log('');

  try {
    // Load test suites
    await loadTests();

    // Run tests
    const results = await runner.run();

    // Print summary
    printSummary(results);

    // Exit with appropriate code
    process.exit(results.totalFailed > 0 ? 1 : 0);
  } catch (error) {
    console.error('\n❌ Test execution failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

export { main };
