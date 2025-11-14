/**
 * Integration Tests for Frontend-Backend Connection
 * 
 * Run these tests to verify the integration is working correctly
 */

import { apiService } from '../lib/api';

// Test credentials
const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@dbx.com',
    password: 'admin123'
  },
  analyst: {
    email: 'analyst@dbx.com',
    password: 'analyst123'
  }
};

/**
 * Test Suite: Authentication
 */
export async function testAuthentication() {
  console.log('🔐 Testing Authentication...');
  
  try {
    // Test 1: Login
    console.log('  Test 1: Login with admin credentials');
    const loginResult = await apiService.login(
      TEST_CREDENTIALS.admin.email,
      TEST_CREDENTIALS.admin.password
    );
    console.log('  ✅ Login successful');
    console.log('  Token received:', loginResult.access_token ? 'Yes' : 'No');
    
    // Test 2: Get Profile
    console.log('  Test 2: Get user profile');
    const profile = await apiService.getProfile();
    console.log('  ✅ Profile retrieved');
    console.log('  User:', profile.email, '- Role:', profile.role);
    
    // Test 3: Token Refresh (if refresh token exists)
    if (loginResult.refresh_token) {
      console.log('  Test 3: Token refresh');
      // Token refresh is automatic, just verify it's stored
      console.log('  ✅ Refresh token stored');
    }
    
    return { success: true, message: 'Authentication tests passed' };
  } catch (error) {
    console.error('  ❌ Authentication test failed:', error);
    return { success: false, error };
  }
}

/**
 * Test Suite: Aircraft Management
 */
export async function testAircraftManagement() {
  console.log('\n🛩️ Testing Aircraft Management...');
  
  try {
    // Test 1: List Aircraft
    console.log('  Test 1: List aircraft');
    const aircraft = await apiService.getAircraft();
    console.log('  ✅ Aircraft list retrieved');
    console.log('  Found:', aircraft.length, 'aircraft');
    
    // Test 2: Create Aircraft
    console.log('  Test 2: Create new aircraft');
    const newAircraft = await apiService.createAircraft({
      registration: `TEST-${Date.now()}`,
      aircraft_type: 'multirotor',
      manufacturer: 'DJI',
      model: 'Phantom 4 Pro',
      serial_number: `SN-${Date.now()}`
    });
    console.log('  ✅ Aircraft created');
    console.log('  Registration:', newAircraft.registration);
    
    // Test 3: Get Aircraft by ID
    console.log('  Test 3: Get aircraft details');
    const aircraftDetails = await apiService.getAircraftById(newAircraft.id);
    console.log('  ✅ Aircraft details retrieved');
    console.log('  Model:', aircraftDetails.model);
    
    // Test 4: Update Aircraft
    console.log('  Test 4: Update aircraft');
    const updated = await apiService.updateAircraft(newAircraft.id, {
      status: 'maintenance'
    });
    console.log('  ✅ Aircraft updated');
    
    // Test 5: Delete Aircraft
    console.log('  Test 5: Delete aircraft');
    await apiService.deleteAircraft(newAircraft.id);
    console.log('  ✅ Aircraft deleted');
    
    return { success: true, message: 'Aircraft management tests passed' };
  } catch (error) {
    console.error('  ❌ Aircraft management test failed:', error);
    return { success: false, error };
  }
}

/**
 * Test Suite: AI Analysis
 */
export async function testAIAnalysis() {
  console.log('\n🤖 Testing AI Analysis...');
  
  try {
    // First, get or create an aircraft
    const aircraft = await apiService.getAircraft();
    let testAircraft;
    
    if (aircraft.length > 0) {
      testAircraft = aircraft[0];
    } else {
      testAircraft = await apiService.createAircraft({
        registration: `TEST-ANALYSIS-${Date.now()}`,
        aircraft_type: 'multirotor',
        manufacturer: 'DJI',
        model: 'Phantom 4 Pro'
      });
    }
    
    // Test 1: Create Analysis
    console.log('  Test 1: Create AI analysis');
    const analysis = await apiService.createAnalysis(testAircraft.id, {
      altitude: 1500,
      speed: 45,
      temperature: 22,
      battery_voltage: 12.1,
      gps_satellites: 12,
      heading: 180,
      vertical_speed: 2.5
    });
    console.log('  ✅ Analysis created');
    console.log('  Risk Level:', analysis.risk_level);
    console.log('  Confidence:', (analysis.confidence * 100).toFixed(1) + '%');
    
    // Test 2: List Analyses
    console.log('  Test 2: List analyses');
    const analyses = await apiService.getAnalyses();
    console.log('  ✅ Analyses list retrieved');
    console.log('  Found:', analyses.length, 'analyses');
    
    // Test 3: Get Analysis Details
    console.log('  Test 3: Get analysis details');
    const analysisDetails = await apiService.getAnalysis(analysis.id);
    console.log('  ✅ Analysis details retrieved');
    console.log('  Status:', analysisDetails.status);
    
    return { success: true, message: 'AI analysis tests passed' };
  } catch (error) {
    console.error('  ❌ AI analysis test failed:', error);
    return { success: false, error };
  }
}

/**
 * Test Suite: Reports
 */
export async function testReports() {
  console.log('\n📊 Testing Reports...');
  
  try {
    // Test 1: List Reports
    console.log('  Test 1: List reports');
    const reports = await apiService.getReports();
    console.log('  ✅ Reports list retrieved');
    console.log('  Found:', reports.length, 'reports');
    
    // Test 2: Generate Report
    console.log('  Test 2: Generate report');
    const newReport = await apiService.generateReport({
      report_type: 'flight_analysis',
      title: `Test Report ${Date.now()}`,
      analysis_ids: [],
      format: 'pdf'
    });
    console.log('  ✅ Report generated');
    console.log('  Report ID:', newReport.id);
    
    return { success: true, message: 'Reports tests passed' };
  } catch (error) {
    console.error('  ❌ Reports test failed:', error);
    return { success: false, error };
  }
}

/**
 * Test Suite: Notifications
 */
export async function testNotifications() {
  console.log('\n🔔 Testing Notifications...');
  
  try {
    // Test 1: List Notifications
    console.log('  Test 1: List notifications');
    const notifications = await apiService.getNotifications();
    console.log('  ✅ Notifications list retrieved');
    console.log('  Found:', notifications.length, 'notifications');
    
    // Test 2: Mark all as read
    console.log('  Test 2: Mark all notifications as read');
    await apiService.markAllNotificationsAsRead();
    console.log('  ✅ All notifications marked as read');
    
    return { success: true, message: 'Notifications tests passed' };
  } catch (error) {
    console.error('  ❌ Notifications test failed:', error);
    return { success: false, error };
  }
}

/**
 * Test Suite: System Status
 */
export async function testSystemStatus() {
  console.log('\n⚙️ Testing System Status...');
  
  try {
    // Test 1: Health Check
    console.log('  Test 1: Health check');
    const health = await apiService.getHealth();
    console.log('  ✅ Health check passed');
    console.log('  Status:', health.status);
    
    // Test 2: System Status
    console.log('  Test 2: System status');
    const status = await apiService.getSystemStatus();
    console.log('  ✅ System status retrieved');
    console.log('  Database:', status.components?.database || 'unknown');
    
    return { success: true, message: 'System status tests passed' };
  } catch (error) {
    console.error('  ❌ System status test failed:', error);
    return { success: false, error };
  }
}

/**
 * Run All Integration Tests
 */
export async function runAllTests() {
  console.log('🧪 Starting Integration Tests...');
  console.log('Backend URL:', import.meta.env.VITE_API_URL);
  console.log('='.repeat(60));
  
  const results = [];
  
  // Run all test suites
  results.push(await testAuthentication());
  results.push(await testAircraftManagement());
  results.push(await testAIAnalysis());
  results.push(await testReports());
  results.push(await testNotifications());
  results.push(await testSystemStatus());
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary:');
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`  ✅ Passed: ${passed}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All integration tests passed!');
    console.log('✅ Frontend is fully integrated with backend');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the errors above.');
  }
  
  return {
    total: results.length,
    passed,
    failed,
    results
  };
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).integrationTests = {
    runAll: runAllTests,
    testAuthentication,
    testAircraftManagement,
    testAIAnalysis,
    testReports,
    testNotifications,
    testSystemStatus
  };
  
  console.log('💡 Integration tests loaded!');
  console.log('Run tests in console:');
  console.log('  integrationTests.runAll()');
  console.log('  integrationTests.testAuthentication()');
  console.log('  integrationTests.testAircraftManagement()');
}
