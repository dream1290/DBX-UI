# File Upload Error Fix

## 🐛 Issue
File upload showing "0 MB" and "error" status when uploading flight log CSV files.

## ✅ Fixes Applied

### 1. Enhanced Error Handling in UploadData Component
**File:** `src/pages/UploadData.tsx`

**Changes:**
- Fixed TypeError by adding default empty array for recentFlights
- Added array validation in useEffect to prevent map errors
- Added file validation before processing
- Added detailed console logging for debugging
- Improved file size calculation precision (2 decimal places)
- Better error messages in catch blocks
- Removed unused imports

```typescript
// Fix TypeError by providing default empty array
const { data: recentFlights = [] } = useFlights({ limit: 10 });

// Add array validation in useEffect
useEffect(() => {
  if (recentFlights && Array.isArray(recentFlights) && recentFlights.length > 0) {
    const jobs: AnalysisJob[] = recentFlights.map((flight: any) => ({
      // ... mapping logic
    }));
    setAnalysisJobs(jobs);
  }
}, [recentFlights]);

// Validate file
if (!file || file.size === 0) {
  console.error('Invalid or empty file:', file);
  continue;
}

// Better file size calculation
const fileSizeMB = file.size / 1024 / 1024;
const newJob: AnalysisJob = {
  id: jobId,
  filename: file.name,
  fileSize: Number(fileSizeMB.toFixed(2)), // 2 decimal places
  status: "queued",
  progress: 0,
};
```

### 2. Improved API Service Error Handling
**File:** `src/lib/api.ts`

**Changes:**
- Added file validation in `analyzeFlightLog` method
- Added comprehensive logging throughout the process
- Better error messages for debugging

```typescript
async analyzeFlightLog(file: File, metadata?: any) {
  try {
    // Validate file
    if (!file || file.size === 0) {
      throw new Error('Invalid or empty file');
    }
    
    // Log file details
    console.log('Reading file:', file.name, 'Size:', file.size, 'bytes');
    const text = await file.text();
    console.log('File content length:', text.length, 'characters');
    
    if (!text || text.trim().length === 0) {
      throw new Error('File is empty');
    }
    
    const telemetryData = this.parseCSVToTelemetry(text);
    console.log('Parsed telemetry data:', telemetryData.total_points, 'data points');
    
    // Send to analysis endpoint
    return this.createAnalysis({
      aircraft_id: metadata?.aircraft_id || null,
      telemetry_data: telemetryData,
      metadata: metadata || {}
    });
  } catch (error) {
    console.error('analyzeFlightLog error:', error);
    throw error;
  }
}
```

### 3. Enhanced CSV Parsing
**File:** `src/lib/api.ts`

**Changes:**
- Better handling of empty lines
- Improved error messages
- Added validation for headers and data rows
- Comprehensive logging

```typescript
private parseCSVToTelemetry(csvText: string): any {
  try {
    // Filter out empty lines
    const lines = csvText.trim().split('\n').filter(line => line.trim().length > 0);
    
    if (lines.length < 2) {
      throw new Error('Invalid CSV: File must have at least a header row and one data row');
    }

    // Parse and validate headers
    const headers = lines[0].split(',').map(h => h.trim());
    if (headers.length === 0) {
      throw new Error('Invalid CSV: No headers found');
    }
    
    console.log('CSV headers:', headers);
    
    // Parse data rows with null handling
    const dataPoints = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines
      
      const values = line.split(',');
      const point: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index]?.trim();
        if (!value) {
          point[header] = null;
          return;
        }
        
        // Convert numeric values
        if (!isNaN(Number(value))) {
          point[header] = Number(value);
        } else {
          point[header] = value;
        }
      });
      
      dataPoints.push(point);
    }

    if (dataPoints.length === 0) {
      throw new Error('Invalid CSV: No valid data rows found');
    }

    console.log('Parsed', dataPoints.length, 'data points');

    return {
      data_points: dataPoints,
      total_points: dataPoints.length,
      duration_seconds: dataPoints.length,
      source: 'csv_upload'
    };
  } catch (error) {
    console.error('CSV parsing error:', error);
    throw new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
```

## 🔍 Debugging Steps

### 1. Check Browser Console
Open the browser developer tools (F12) and check the Console tab for:
- File upload logs: "Reading file: [filename] Size: [bytes] bytes"
- CSV parsing logs: "CSV headers: [...]" and "Parsed [n] data points"
- Any error messages

### 2. Check Network Tab
In the Network tab, look for:
- POST request to `/api/v2/analyses/`
- Check the request payload to see if telemetry_data is being sent
- Check the response status code and error message

### 3. Common Issues and Solutions

#### Issue: File shows 0 MB
**Possible Causes:**
- File is actually empty
- File object is not being passed correctly
- Browser file API issue

**Solution:**
- Check console logs for "Invalid or empty file" message
- Verify the file has content
- Try a different browser

#### Issue: "Invalid CSV" error
**Possible Causes:**
- CSV file doesn't have headers
- CSV file has only headers, no data
- File encoding issues

**Solution:**
- Verify CSV has at least 2 rows (header + data)
- Check CSV format matches expected format (see below)
- Ensure file is UTF-8 encoded

#### Issue: "Analysis failed" error
**Possible Causes:**
- Backend API is down
- Authentication token expired
- Backend AI models not initialized

**Solution:**
- Check if backend is running
- Try logging out and back in
- Check backend logs for model initialization errors

## 📋 Expected CSV Format

```csv
timestamp,latitude,longitude,altitude_m,speed_mps,heading_deg,battery_voltage,battery_percent,temperature_c,vibration_x,vibration_y,vibration_z,gps_satellites,signal_strength
2024-11-14T10:00:00Z,37.7749,-122.4194,0,0,0,12.6,100,22.5,0.1,0.1,0.1,12,95
2024-11-14T10:00:01Z,37.7749,-122.4194,2,1.5,45,12.6,99,22.6,0.2,0.2,0.2,12,95
...
```

**Required:**
- First row must be headers
- At least one data row
- Comma-separated values
- No empty lines between data rows (will be filtered out automatically)

## 🧪 Testing

### Test with Sample File
Use the provided test files in `dbxui/test-data/`:
- `flight_log_normal.csv` - Normal flight data
- `flight_log_anomaly_battery.csv` - Battery anomaly
- `flight_log_anomaly_gps.csv` - GPS anomaly
- `flight_log_anomaly_vibration.csv` - Vibration anomaly

### Manual Test Steps
1. Navigate to Upload Data page
2. Open browser console (F12)
3. Upload a test CSV file
4. Watch console logs for:
   - "Reading file: [filename]"
   - "File content length: [n] characters"
   - "CSV headers: [...]"
   - "Parsed [n] data points"
5. Check if analysis job shows correct file size
6. Wait for analysis to complete or check for error messages

## 🚀 Next Steps

If the issue persists after these fixes:

1. **Check Backend Logs:**
   ```bash
   cd dbx-mpv
   # Check if backend is running
   # Look for errors in the logs
   ```

2. **Verify Backend API:**
   - Test the `/api/v2/analyses/` endpoint directly
   - Check if AI models are initialized
   - Verify database connection

3. **Test with Minimal CSV:**
   Create a minimal test file:
   ```csv
   timestamp,altitude_m
   2024-11-14T10:00:00Z,10
   2024-11-14T10:00:01Z,20
   ```

4. **Check Authentication:**
   - Verify user is logged in
   - Check if access token is valid
   - Try logging out and back in

## 📝 Summary

The fixes add comprehensive error handling and logging throughout the file upload and analysis pipeline. This will help identify exactly where the process is failing and provide better error messages to users.

**Key Improvements:**
- ✅ File validation before processing
- ✅ Detailed console logging for debugging
- ✅ Better error messages
- ✅ Improved CSV parsing with edge case handling
- ✅ Null value handling in CSV data
- ✅ Empty line filtering

The next time you upload a file, check the browser console for detailed logs that will help identify the exact issue.
