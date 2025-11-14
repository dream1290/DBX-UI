// Test Runner Framework
// Provides a simple API for defining and executing tests

export interface TestCase {
  name: string;
  fn: () => Promise<void>;
  skip?: boolean;
}

export interface TestResult {
  name: string;
  passed: boolean;
  error?: Error;
  duration: number;
}

export interface SuiteResult {
  name: string;
  tests: TestResult[];
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
}

export interface TestResults {
  suites: SuiteResult[];
  totalPassed: number;
  totalFailed: number;
  totalSkipped: number;
  totalDuration: number;
}

class TestRunner {
  private currentSuite: string = '';
  private tests: Map<string, TestCase[]> = new Map();
  private beforeAllHooks: Map<string, (() => Promise<void>)[]> = new Map();
  private afterAllHooks: Map<string, (() => Promise<void>)[]> = new Map();
  private beforeEachHooks: Map<string, (() => Promise<void>)[]> = new Map();
  private afterEachHooks: Map<string, (() => Promise<void>)[]> = new Map();

  describe(name: string, fn: () => void): void {
    this.currentSuite = name;
    if (!this.tests.has(name)) {
      this.tests.set(name, []);
      this.beforeAllHooks.set(name, []);
      this.afterAllHooks.set(name, []);
      this.beforeEachHooks.set(name, []);
      this.afterEachHooks.set(name, []);
    }
    fn();
  }

  it(name: string, fn: () => Promise<void>, skip: boolean = false): void {
    if (!this.currentSuite) {
      throw new Error('Test must be inside a describe block');
    }
    const tests = this.tests.get(this.currentSuite)!;
    tests.push({ name, fn, skip });
  }

  beforeAll(fn: () => Promise<void>): void {
    if (!this.currentSuite) {
      throw new Error('beforeAll must be inside a describe block');
    }
    const hooks = this.beforeAllHooks.get(this.currentSuite)!;
    hooks.push(fn);
  }

  afterAll(fn: () => Promise<void>): void {
    if (!this.currentSuite) {
      throw new Error('afterAll must be inside a describe block');
    }
    const hooks = this.afterAllHooks.get(this.currentSuite)!;
    hooks.push(fn);
  }

  beforeEach(fn: () => Promise<void>): void {
    if (!this.currentSuite) {
      throw new Error('beforeEach must be inside a describe block');
    }
    const hooks = this.beforeEachHooks.get(this.currentSuite)!;
    hooks.push(fn);
  }

  afterEach(fn: () => Promise<void>): void {
    if (!this.currentSuite) {
      throw new Error('afterEach must be inside a describe block');
    }
    const hooks = this.afterEachHooks.get(this.currentSuite)!;
    hooks.push(fn);
  }

  async run(): Promise<TestResults> {
    const results: TestResults = {
      suites: [],
      totalPassed: 0,
      totalFailed: 0,
      totalSkipped: 0,
      totalDuration: 0,
    };

    for (const [suiteName, tests] of this.tests.entries()) {
      const suiteStart = Date.now();
      const suiteResult: SuiteResult = {
        name: suiteName,
        tests: [],
        passed: 0,
        failed: 0,
        skipped: 0,
        duration: 0,
      };

      console.log(`\n${suiteName}`);

      // Run beforeAll hooks
      const beforeAllHooks = this.beforeAllHooks.get(suiteName) || [];
      for (const hook of beforeAllHooks) {
        try {
          await hook();
        } catch (error) {
          console.error(`  ✗ beforeAll hook failed: ${error}`);
        }
      }

      // Run tests
      for (const test of tests) {
        if (test.skip) {
          console.log(`  ⊘ ${test.name} (skipped)`);
          suiteResult.skipped++;
          results.totalSkipped++;
          continue;
        }

        const testStart = Date.now();
        const beforeEachHooks = this.beforeEachHooks.get(suiteName) || [];
        const afterEachHooks = this.afterEachHooks.get(suiteName) || [];

        try {
          // Run beforeEach hooks
          for (const hook of beforeEachHooks) {
            await hook();
          }

          // Run test
          await test.fn();

          // Run afterEach hooks
          for (const hook of afterEachHooks) {
            await hook();
          }

          const duration = Date.now() - testStart;
          console.log(`  ✓ ${test.name} (${duration}ms)`);
          suiteResult.tests.push({ name: test.name, passed: true, duration });
          suiteResult.passed++;
          results.totalPassed++;
        } catch (error) {
          const duration = Date.now() - testStart;
          console.log(`  ✗ ${test.name} (${duration}ms)`);
          if (error instanceof Error) {
            console.log(`    ${error.message}`);
          }
          suiteResult.tests.push({
            name: test.name,
            passed: false,
            error: error as Error,
            duration,
          });
          suiteResult.failed++;
          results.totalFailed++;
        }
      }

      // Run afterAll hooks
      const afterAllHooks = this.afterAllHooks.get(suiteName) || [];
      for (const hook of afterAllHooks) {
        try {
          await hook();
        } catch (error) {
          console.error(`  ✗ afterAll hook failed: ${error}`);
        }
      }

      suiteResult.duration = Date.now() - suiteStart;
      results.suites.push(suiteResult);
      results.totalDuration += suiteResult.duration;
    }

    return results;
  }
}

// Global test runner instance
export const runner = new TestRunner();

// Export convenience functions
export const describe = runner.describe.bind(runner);
export const it = runner.it.bind(runner);
export const beforeAll = runner.beforeAll.bind(runner);
export const afterAll = runner.afterAll.bind(runner);
export const beforeEach = runner.beforeEach.bind(runner);
export const afterEach = runner.afterEach.bind(runner);
