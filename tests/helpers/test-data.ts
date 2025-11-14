// Test Data Generators
// Functions to generate realistic test data

export class TestDataGenerator {
  private static counter = 0;

  static generateUniqueId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 7);
    this.counter++;
    return `${timestamp}_${random}_${this.counter}`;
  }

  static generateUser() {
    const id = this.generateUniqueId();
    return {
      email: `test.user.${id}@dbxtest.com`,
      password: 'TestPassword123!',
      full_name: `Test User ${id}`,
      organization: `TestOrg_${id}`,
    };
  }

  static generateAdminUser() {
    const id = this.generateUniqueId();
    return {
      email: `admin.${id}@dbxtest.com`,
      password: 'AdminPassword123!',
      full_name: `Admin User ${id}`,
      organization: `AdminOrg_${id}`,
      role: 'admin',
    };
  }

  static generateAircraft() {
    const id = this.generateUniqueId();
    const manufacturers = ['Boeing', 'Airbus', 'Cessna', 'Bombardier', 'Embraer'];
    const models = ['737', '747', 'A320', 'A380', '172', 'Citation', 'E190'];
    
    const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
    const model = models[Math.floor(Math.random() * models.length)];
    
    return {
      registration: `N${id.substring(0, 5).toUpperCase()}`,
      serial_number: `SN${id}`,
      manufacturer,
      model,
      variant: 'Standard',
      year_manufactured: 2020 + Math.floor(Math.random() * 5),
      max_passengers: 150 + Math.floor(Math.random() * 200),
      max_cargo_kg: 10000 + Math.floor(Math.random() * 20000),
      fuel_capacity_liters: 20000 + Math.floor(Math.random() * 100000),
      cruise_speed_knots: 400 + Math.floor(Math.random() * 200),
      range_nm: 2000 + Math.floor(Math.random() * 8000),
      service_ceiling_ft: 35000 + Math.floor(Math.random() * 10000),
      operational_status: 'active',
    };
  }

  static generateReport() {
    const id = this.generateUniqueId();
    const types = ['flight_analysis', 'maintenance', 'safety', 'performance'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
      title: `Test Report ${id}`,
      description: `This is a test report generated for testing purposes - ${id}`,
      report_type: type,
      start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date().toISOString(),
    };
  }

  static generateApiKey() {
    const id = this.generateUniqueId();
    return {
      name: `Test API Key ${id}`,
      description: `Test API key for automated testing - ${id}`,
      permissions: ['read', 'write'],
    };
  }

  static generateOrganization() {
    const id = this.generateUniqueId();
    return {
      name: `Test Organization ${id}`,
      description: `Test organization for automated testing - ${id}`,
      contact_email: `contact.${id}@dbxtest.com`,
      contact_phone: '+1-555-0100',
    };
  }

  static generateNotification() {
    const id = this.generateUniqueId();
    const types = ['info', 'warning', 'error', 'success'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
      message: `Test notification ${id}`,
      type,
      read: false,
    };
  }

  // Generate a simple CSV file content for flight log testing
  static generateFlightLogCSV(): string {
    const headers = 'timestamp,altitude,speed,latitude,longitude,heading\n';
    const rows: string[] = [];
    
    for (let i = 0; i < 100; i++) {
      const timestamp = new Date(Date.now() - (100 - i) * 1000).toISOString();
      const altitude = 10000 + Math.random() * 5000;
      const speed = 400 + Math.random() * 100;
      const latitude = 40 + Math.random() * 10;
      const longitude = -120 + Math.random() * 10;
      const heading = Math.random() * 360;
      
      rows.push(`${timestamp},${altitude},${speed},${latitude},${longitude},${heading}`);
    }
    
    return headers + rows.join('\n');
  }

  // Create a File object from CSV content
  static createFlightLogFile(): File {
    const content = this.generateFlightLogCSV();
    const blob = new Blob([content], { type: 'text/csv' });
    const id = this.generateUniqueId();
    return new File([blob], `flight_log_${id}.csv`, { type: 'text/csv' });
  }

  // Generate invalid data for error testing
  static generateInvalidEmail(): string {
    return 'invalid-email-format';
  }

  static generateWeakPassword(): string {
    return '123';
  }

  static generateInvalidAircraft() {
    return {
      // Missing required fields
      manufacturer: 'Boeing',
    };
  }
}

// Export singleton instance
export const testData = TestDataGenerator;
