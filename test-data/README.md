# DBX Aviation Platform - Test Flight Data

This directory contains realistic flight log test data for testing the DBX Aviation Platform's analysis features.

## 📁 Test Files

### 1. `flight_log_normal.csv` ✅
**Description:** Normal, healthy flight with no anomalies
- **Duration:** 35 seconds
- **Max Altitude:** 50m
- **Battery:** Healthy discharge (100% → 83%)
- **Vibration:** Normal levels (0.1-1.4 m/s²)
- **GPS:** Strong signal (12 satellites, 78-95% strength)
- **Expected Result:** ✅ No anomalies detected

### 2. `flight_log_anomaly_battery.csv` ⚠️
**Description:** Critical battery drain anomaly
- **Duration:** 28 seconds
- **Max Altitude:** 50m
- **Battery:** CRITICAL rapid drain (100% → 0% in 27 seconds!)
- **Voltage:** Drops from 12.6V to 5.5V (dangerous)
- **Vibration:** Increases with battery stress (0.1-2.6 m/s²)
- **GPS:** Degrades as power drops (12 → 4 satellites)
- **Expected Result:** 🚨 HIGH RISK - Battery failure detected

### 3. `flight_log_anomaly_vibration.csv` ⚠️
**Description:** Severe mechanical vibration anomaly
- **Duration:** 29 seconds
- **Max Altitude:** 50m
- **Battery:** Normal (100% → 86%)
- **Vibration:** EXTREME levels (0.1 → 42.0 m/s²!)
- **Indicates:** Motor imbalance, propeller damage, or structural issue
- **GPS:** Slight degradation due to vibration interference
- **Expected Result:** 🚨 HIGH RISK - Mechanical failure detected

### 4. `flight_log_anomaly_gps.csv` ⚠️
**Description:** GPS signal loss and navigation failure
- **Duration:** 29 seconds
- **Max Altitude:** 50m
- **Battery:** Normal (100% → 86%)
- **GPS Satellites:** Drops from 12 → 0 (complete loss!)
- **Signal Strength:** Drops from 95% → 2%
- **Indicates:** GPS jamming, interference, or hardware failure
- **Expected Result:** 🚨 MEDIUM RISK - Navigation system failure

## 🧪 How to Test

### Step 1: Login to DBX Platform
```
Email: admin@dbx.com
Password: admin123
```

### Step 2: Navigate to Upload/Analysis Page
- Go to `/upload` or `/analysis` page
- Look for file upload component

### Step 3: Upload Test Files
1. Start with `flight_log_normal.csv` to verify system works
2. Then upload anomaly files one by one
3. Compare AI detection results

### Step 4: Expected AI Analysis Results

#### Normal Flight
```json
{
  "risk_level": "low",
  "anomaly_score": 0.05,
  "confidence": 0.95,
  "issues": []
}
```

#### Battery Anomaly
```json
{
  "risk_level": "high",
  "anomaly_score": 0.92,
  "confidence": 0.98,
  "issues": [
    "Critical battery voltage drop",
    "Rapid battery discharge",
    "Power system failure"
  ]
}
```

#### Vibration Anomaly
```json
{
  "risk_level": "high",
  "anomaly_score": 0.88,
  "confidence": 0.96,
  "issues": [
    "Excessive vibration detected",
    "Possible motor imbalance",
    "Structural integrity concern"
  ]
}
```

#### GPS Anomaly
```json
{
  "risk_level": "medium",
  "anomaly_score": 0.75,
  "confidence": 0.92,
  "issues": [
    "GPS signal loss",
    "Navigation system degradation",
    "Satellite connectivity failure"
  ]
}
```

## 📊 Data Format

All CSV files contain the following columns:

| Column | Description | Unit | Normal Range |
|--------|-------------|------|--------------|
| `timestamp` | ISO 8601 timestamp | - | - |
| `latitude` | GPS latitude | degrees | -90 to 90 |
| `longitude` | GPS longitude | degrees | -180 to 180 |
| `altitude_m` | Altitude above ground | meters | 0-120 |
| `speed_mps` | Ground speed | m/s | 0-25 |
| `heading_deg` | Compass heading | degrees | 0-360 |
| `battery_voltage` | Battery voltage | volts | 10.5-12.6 |
| `battery_percent` | Battery percentage | % | 0-100 |
| `temperature_c` | System temperature | °C | 15-35 |
| `vibration_x` | X-axis vibration | m/s² | 0-2 |
| `vibration_y` | Y-axis vibration | m/s² | 0-2 |
| `vibration_z` | Z-axis vibration | m/s² | 0-2 |
| `gps_satellites` | Connected satellites | count | 6-15 |
| `signal_strength` | GPS signal quality | % | 70-100 |

## 🎯 Testing Checklist

- [ ] Upload normal flight log
- [ ] Verify "No anomalies" result
- [ ] Upload battery anomaly log
- [ ] Verify "High Risk - Battery" detection
- [ ] Upload vibration anomaly log
- [ ] Verify "High Risk - Mechanical" detection
- [ ] Upload GPS anomaly log
- [ ] Verify "Medium Risk - Navigation" detection
- [ ] Check analysis history
- [ ] Export analysis reports
- [ ] Verify AI model accuracy metrics

## 🔧 Troubleshooting

### File Upload Fails
- Check file size (should be < 100MB)
- Verify CSV format is correct
- Ensure you're logged in

### No Anomalies Detected
- Check if AI models are initialized
- Verify backend is running: `https://dbx-production-3690.up.railway.app/health`
- Check browser console for errors

### Wrong Anomaly Type Detected
- This is expected during initial training
- AI models improve with more data
- Use the "Retrain Model" feature with real data

## 📝 Notes

- These are **synthetic test data** for demonstration purposes
- Real flight logs will have more noise and variability
- AI models are trained on synthetic data initially
- For production use, retrain models with real flight data
- The backend uses XGBoost (99.5% accuracy) and Random Forest (100% accuracy) models

## 🚀 Next Steps

After testing with these files:
1. Upload real flight logs from actual drones/aircraft
2. Use the "Retrain Model" feature to improve accuracy
3. Set up automated analysis pipelines
4. Configure alert thresholds
5. Generate compliance reports

---

**Backend API:** https://dbx-production-3690.up.railway.app  
**API Docs:** https://dbx-production-3690.up.railway.app/docs  
**Health Check:** https://dbx-production-3690.up.railway.app/health
