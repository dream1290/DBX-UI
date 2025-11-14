// Assertion Helpers
// Custom assertion functions for common test scenarios

import { ApiResponse } from './api-client';

export class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AssertionError';
  }
}

export function expect(actual: any) {
  return {
    toBe(expected: any): void {
      if (actual !== expected) {
        throw new AssertionError(`Expected ${actual} to be ${expected}`);
      }
    },

    toEqual(expected: any): void {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new AssertionError(
          `Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`
        );
      }
    },

    toContain(expected: any): void {
      if (Array.isArray(actual)) {
        if (!actual.includes(expected)) {
          throw new AssertionError(`Expected array to contain ${expected}`);
        }
      } else if (typeof actual === 'string') {
        if (!actual.includes(expected)) {
          throw new AssertionError(`Expected string to contain "${expected}"`);
        }
      } else {
        throw new AssertionError('toContain can only be used with arrays or strings');
      }
    },

    toHaveProperty(property: string): void {
      if (!(property in actual)) {
        throw new AssertionError(`Expected object to have property "${property}"`);
      }
    },

    toBeGreaterThan(expected: number): void {
      if (typeof actual !== 'number') {
        throw new AssertionError('toBeGreaterThan can only be used with numbers');
      }
      if (actual <= expected) {
        throw new AssertionError(`Expected ${actual} to be greater than ${expected}`);
      }
    },

    toBeLessThan(expected: number): void {
      if (typeof actual !== 'number') {
        throw new AssertionError('toBeLessThan can only be used with numbers');
      }
      if (actual >= expected) {
        throw new AssertionError(`Expected ${actual} to be less than ${expected}`);
      }
    },

    toBeGreaterThanOrEqual(expected: number): void {
      if (typeof actual !== 'number') {
        throw new AssertionError('toBeGreaterThanOrEqual can only be used with numbers');
      }
      if (actual < expected) {
        throw new AssertionError(`Expected ${actual} to be greater than or equal to ${expected}`);
      }
    },

    toBeTruthy(): void {
      if (!actual) {
        throw new AssertionError(`Expected ${actual} to be truthy`);
      }
    },

    toBeFalsy(): void {
      if (actual) {
        throw new AssertionError(`Expected ${actual} to be falsy`);
      }
    },

    toBeNull(): void {
      if (actual !== null) {
        throw new AssertionError(`Expected ${actual} to be null`);
      }
    },

    toBeUndefined(): void {
      if (actual !== undefined) {
        throw new AssertionError(`Expected ${actual} to be undefined`);
      }
    },

    toBeInstanceOf(expectedClass: any): void {
      if (!(actual instanceof expectedClass)) {
        throw new AssertionError(
          `Expected ${actual} to be instance of ${expectedClass.name}`
        );
      }
    },

    toMatch(pattern: RegExp): void {
      if (typeof actual !== 'string') {
        throw new AssertionError('toMatch can only be used with strings');
      }
      if (!pattern.test(actual)) {
        throw new AssertionError(`Expected "${actual}" to match pattern ${pattern}`);
      }
    },

    toHaveLength(expected: number): void {
      if (!('length' in actual)) {
        throw new AssertionError('toHaveLength can only be used with arrays or strings');
      }
      if (actual.length !== expected) {
        throw new AssertionError(
          `Expected length ${actual.length} to be ${expected}`
        );
      }
    },
  };
}

// HTTP Response Assertions
export function expectStatus(response: ApiResponse, expectedStatus: number): void {
  if (response.status !== expectedStatus) {
    throw new AssertionError(
      `Expected status ${expectedStatus}, got ${response.status}\nResponse: ${JSON.stringify(response.data, null, 2)}`
    );
  }
}

export function expectSuccess(response: ApiResponse): void {
  if (response.status < 200 || response.status >= 300) {
    throw new AssertionError(
      `Expected successful status (2xx), got ${response.status}\nResponse: ${JSON.stringify(response.data, null, 2)}`
    );
  }
}

export function expectError(response: ApiResponse, expectedStatus: number): void {
  if (response.status !== expectedStatus) {
    throw new AssertionError(
      `Expected error status ${expectedStatus}, got ${response.status}\nResponse: ${JSON.stringify(response.data, null, 2)}`
    );
  }
}

export function expectUnauthorized(response: ApiResponse): void {
  expectError(response, 401);
}

export function expectForbidden(response: ApiResponse): void {
  expectError(response, 403);
}

export function expectNotFound(response: ApiResponse): void {
  expectError(response, 404);
}

export function expectValidationError(response: ApiResponse): void {
  expectError(response, 422);
}

// Data Validation Assertions
export function expectValidUser(user: any): void {
  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('email');
  expect(user).toHaveProperty('full_name');
  expect(user).toHaveProperty('role');
}

export function expectValidAircraft(aircraft: any): void {
  expect(aircraft).toHaveProperty('id');
  expect(aircraft).toHaveProperty('registration');
  expect(aircraft).toHaveProperty('manufacturer');
  expect(aircraft).toHaveProperty('model');
}

export function expectValidAnalysis(analysis: any): void {
  expect(analysis).toHaveProperty('id');
  expect(analysis).toHaveProperty('file_id');
  expect(analysis).toHaveProperty('status');
}

export function expectValidReport(report: any): void {
  expect(report).toHaveProperty('id');
  expect(report).toHaveProperty('title');
  expect(report).toHaveProperty('report_type');
}

export function expectValidNotification(notification: any): void {
  expect(notification).toHaveProperty('id');
  expect(notification).toHaveProperty('message');
  expect(notification).toHaveProperty('read');
}

export function expectValidOrganization(org: any): void {
  expect(org).toHaveProperty('id');
  expect(org).toHaveProperty('name');
}

export function expectValidApiKey(apiKey: any): void {
  expect(apiKey).toHaveProperty('id');
  expect(apiKey).toHaveProperty('name');
  expect(apiKey).toHaveProperty('key');
}
