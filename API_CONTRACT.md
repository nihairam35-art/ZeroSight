# ZeroSight — RESTful API Contract Specification

> **Notice:** All endpoints documented herein are **PROPOSED ARCHITECTURAL CONTRACTS**.  
> **Implementation Status:** NOT IMPLEMENTED IN CURRENT FRONTEND.  
> **Framework Independence:** This contract defines request/response data contracts and HTTP semantics only. It does not dictate backend programming language, framework (Node.js, FastAPI, Go, Spring, Django), or persistence store (PostgreSQL, MongoDB, Redis, ClickHouse).

---

## 1. Global API Standards & Conventions

### Base URL Pattern
All endpoints are namespaced under the versioned prefix:
```
https://{host}/api/v1
```

### Authentication Header
Protected endpoints require an `Authorization` header containing a valid Bearer token:
```http
Authorization: Bearer <jwt_or_session_token>
```

### Standard Response Envelopes

#### Success Envelope
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:12:00Z",
  "data": { ... }
}
```

#### Paginated Collection Envelope
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:12:00Z",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 128,
    "totalPages": 7,
    "hasMore": true
  }
}
```

#### Standard Error Envelope
```json
{
  "success": false,
  "timestamp": "2026-11-09T09:12:00Z",
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested threat alert with ID 999 does not exist.",
    "details": [
      { "field": "id", "issue": "Alert ID 999 not found in active telemetry store" }
    ]
  }
}
```

### Standard HTTP Status Codes
- `200 OK`: Request succeeded; data returned.
- `201 Created`: Resource created successfully (e.g. support ticket, attack simulation).
- `400 Bad Request`: Validation failure or malformed payload.
- `401 Unauthorized`: Authentication token missing or expired.
- `403 Forbidden`: Insufficient role permissions for the requested action.
- `404 Not Found`: Resource ID not found.
- `422 Unprocessable Entity`: Semantic constraint failure.
- `500 Internal Server Error`: Backend pipeline or inference failure.

---

## 2. Authentication Endpoints

### 2.1 Authenticate Analyst (`POST /api/v1/auth/login`)
- **Status:** **PROPOSED**
- **Purpose:** Validate analyst credentials, verify selected role, and issue session token.
- **Headers:** `Content-Type: application/json`

#### Request Body Example
```json
{
  "username": "Alex Mercer",
  "password": "CorrectHorseBatteryStaple123!",
  "role": "Security Analyst"
}
```

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:00:00Z",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbGV4Lm1lcmNlciIsInJvbGUiOiJTZWN1cml0eSBBbmFseXN0IiwiaWF0IjoxNzg0MjA4MDAwfQ.signature",
    "expiresIn": 28800,
    "user": {
      "id": "usr-88914",
      "name": "Alex Mercer",
      "initials": "AM",
      "role": "Security Analyst",
      "email": "alex.mercer@corp.internal",
      "mfaEnforced": true,
      "sessionExpiresAt": "2026-11-09T17:00:00Z"
    }
  }
}
```

#### Error Response (`401 Unauthorized`)
```json
{
  "success": false,
  "timestamp": "2026-11-09T09:00:00Z",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid username or password provided."
  }
}
```

---

### 2.2 Terminate Session (`POST /api/v1/auth/logout`)
- **Status:** **PROPOSED**
- **Purpose:** Invalidate JWT token or destroy server-side session.
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** None

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:05:00Z",
  "data": {
    "message": "Analyst session successfully terminated."
  }
}
```

---

### 2.3 Retrieve Current Identity (`GET /api/v1/auth/me`)
- **Status:** **PROPOSED**
- **Purpose:** Restore authenticated state on browser reload.
- **Headers:** `Authorization: Bearer <token>`

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:06:00Z",
  "data": {
    "id": "usr-88914",
    "name": "Alex Mercer",
    "initials": "AM",
    "role": "Security Analyst",
    "email": "alex.mercer@corp.internal"
  }
}
```

---

## 3. Dashboard Endpoints

### 3.1 Get Dashboard Metric Cards (`GET /api/v1/dashboard/metrics`)
- **Status:** **PROPOSED**
- **Purpose:** Retrieve the 4 headline operational numbers displayed at the top of Page 3.
- **Headers:** `Authorization: Bearer <token>`

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:10:00Z",
  "data": {
    "totalAlerts": {
      "value": 128,
      "deltaPercent": 12.5,
      "deltaDirection": "increase",
      "sparkline": [98, 104, 112, 118, 122, 128]
    },
    "criticalAlerts": {
      "value": 9,
      "deltaPercent": -4.7,
      "deltaDirection": "decrease",
      "sparkline": [12, 11, 10, 9, 8, 9]
    },
    "detectionRate": {
      "value": 87.0,
      "deltaPercent": 2.1,
      "deltaDirection": "increase",
      "sparkline": [82, 84, 85, 86, 86, 87]
    },
    "falsePositives": {
      "value": 14,
      "deltaPercent": -8.0,
      "deltaDirection": "decrease",
      "sparkline": [22, 19, 18, 16, 15, 14]
    }
  }
}
```

---

### 3.2 Get Alerts Over Time Histogram (`GET /api/v1/dashboard/alerts-over-time`)
- **Status:** **PROPOSED**
- **Purpose:** Return hourly alert count distribution for the 12-bar chart.
- **Parameters:** `range=today` (default: `today`)

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:10:00Z",
  "data": {
    "range": "today",
    "total": 128,
    "peakHour": "11:00",
    "peakCount": 24,
    "buckets": [
      { "hour": "09:00", "count": 12 },
      { "hour": "10:00", "count": 18 },
      { "hour": "11:00", "count": 24 },
      { "hour": "12:00", "count": 14 },
      { "hour": "13:00", "count": 8 },
      { "hour": "14:00", "count": 16 },
      { "hour": "15:00", "count": 20 },
      { "hour": "16:00", "count": 11 },
      { "hour": "17:00", "count": 7 },
      { "hour": "18:00", "count": 13 },
      { "hour": "19:00", "count": 19 },
      { "hour": "20:00", "count": 10 }
    ]
  }
}
```

---

### 3.3 Get Risk Breakdown Donut (`GET /api/v1/dashboard/risk-breakdown`)
- **Status:** **PROPOSED**
- **Purpose:** Return severity segment breakdown for the SVG donut visualization.

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:10:00Z",
  "data": {
    "total": 128,
    "breakdown": [
      { "severity": "Critical", "count": 9, "percentage": 7.0, "colorHex": "#FF6F32" },
      { "severity": "High", "count": 24, "percentage": 18.8, "colorHex": "#888888" },
      { "severity": "Medium", "count": 51, "percentage": 39.8, "colorHex": "#CCCCCC" },
      { "severity": "Low", "count": 44, "percentage": 34.4, "colorHex": "#EEEEEE" }
    ]
  }
}
```

---

### 3.4 Get Dashboard Recent Alerts (`GET /api/v1/dashboard/recent-alerts`)
- **Status:** **PROPOSED**
- **Purpose:** Return top 4 most recent incidents for the dashboard tri-grid card.

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:10:00Z",
  "data": [
    {
      "id": 1,
      "type": "DDoS",
      "sourceIp": "192.168.1.45",
      "timestamp": "Nov 9, 09:01",
      "score": 92,
      "severity": "Critical"
    },
    {
      "id": 2,
      "type": "WebAttack",
      "sourceIp": "172.16.4.9",
      "timestamp": "Nov 9, 09:05",
      "score": 81,
      "severity": "High"
    },
    {
      "id": 3,
      "type": "PortScan",
      "sourceIp": "10.0.0.17",
      "timestamp": "Nov 9, 09:03",
      "score": 64,
      "severity": "Medium"
    },
    {
      "id": 4,
      "type": "Benign",
      "sourceIp": "192.168.1.60",
      "timestamp": "Nov 9, 09:07",
      "score": 47,
      "severity": "Low"
    }
  ]
}
```

---

## 4. Threat Alerts Queue & Detail Endpoints

### 4.1 Query Alerts Queue & Live Stream (`GET /api/v1/alerts`)
- **Status:** **PROPOSED**
- **Purpose:** Powers Page 4 (Threat Intelligence Center / Dark SOC Command Center) Active Threat Stream, summary metrics, and multi-parameter filtering.
- **Query Parameters:**
  - `severity`: Optional enum (`all`, `critical`, `high`, `medium`, `low`). Default `all`.
  - `category`: Optional threat category (`all`, `DDoS`, `WebAttack`, `PortScan`, `Infiltration`, `Botnet`, `Benign`). Default `all`.
  - `status`: Optional mitigation status (`all`, `Blocked & Quarantined`, `WAF Intercept`, `Rate Limited`, `Baseline Anomaly`). Default `all`.
  - `q`: Optional free-text search string (matches IP, threat vector, or alert ID).
  - `page`: Integer (default: `1`).
  - `limit`: Integer (default: `20`, max: `100`).
  - `sortBy`: String (`risk-desc`, `risk-asc`, `time-desc`, `time-asc`, `severity`). Default `risk-desc`.

#### Example Request
```http
GET /api/v1/alerts?severity=critical&category=all&status=all&sortBy=risk-desc HTTP/1.1
Authorization: Bearer <token>
```

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:11:00Z",
  "summary": {
    "totalAlerts": 10,
    "criticalThreats": 3,
    "highRiskAlerts": 2,
    "highestRiskScore": {
      "score": 96,
      "maxScore": 100,
      "threatVector": "DDoS UDP Amp",
      "sourceIp": "192.0.2.44"
    }
  },
  "data": [
    {
      "id": 1,
      "severity": "Critical",
      "threatVector": "DDoS Flood",
      "category": "DDoS",
      "sourceIp": "192.168.1.45",
      "riskScore": 92,
      "maxScore": 100,
      "detectionTime": "2026-11-09T09:01:12Z",
      "detectionTimeFormatted": "Nov 9, 09:01:12",
      "status": "Blocked & Quarantined",
      "statusCode": "quarantined",
      "isZeroDay": true,
      "topSignal": {
        "name": "Volumetric packet surge",
        "description": "UDP packet rate exceeded baseline by 1,420%"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasMore": false
  }
}
```

---

### 4.2 Get Alert Forensic Details (`GET /api/v1/alerts/{id}`)
- **Status:** **PROPOSED**
- **Purpose:** Powers Page 5 (Alert Details forensic deep-dive).
- **Parameters:** `id` (integer or UUID).

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:12:00Z",
  "data": {
    "id": 1,
    "severity": "Critical",
    "threatVector": "DDoS Flood",
    "attackLabel": "DDoS",
    "riskScore": 92,
    "sourceIp": "192.168.1.45",
    "timeExact": "09:01:12",
    "timestampFormatted": "Nov 9, 09:01:12",
    "isFalseAlarm": false,
    "signals": [
      {
        "name": "Packet rate",
        "description": "40 times above normal",
        "anomalyPercentage": 95,
        "isCritical": true
      },
      {
        "name": "Destination port",
        "description": "Rarely used",
        "anomalyPercentage": 80,
        "isCritical": false
      },
      {
        "name": "Connection pattern",
        "description": "Many short connections",
        "anomalyPercentage": 72,
        "isCritical": false
      }
    ],
    "mitigationSteps": [
      {
        "index": 1,
        "action": "Block 192.168.1.45 at the firewall.",
        "buttonLabel": "Execute",
        "status": "pending"
      },
      {
        "index": 2,
        "action": "Isolate the affected host.",
        "buttonLabel": "Execute",
        "status": "pending"
      },
      {
        "index": 3,
        "action": "Save the logs as evidence.",
        "buttonLabel": "Save",
        "status": "completed"
      },
      {
        "index": 4,
        "action": "Review the last hour of traffic.",
        "buttonLabel": "Review",
        "status": "pending"
      }
    ],
    "correlatedHistory": [
      { "attackType": "DDoS", "timestamp": "Nov 9, 08:58", "score": 88, "severity": "Critical" },
      { "attackType": "DDoS", "timestamp": "Nov 9, 08:52", "score": 74, "severity": "High" },
      { "attackType": "PortScan", "timestamp": "Nov 9, 08:41", "score": 61, "severity": "Medium" }
    ]
  }
}
```

---

### 4.3 Execute Mitigation Step (`POST /api/v1/alerts/{id}/mitigations/{stepIndex}/execute`)
- **Status:** **PROPOSED**
- **Purpose:** Trigger automated firewall block, host isolation, or forensic log export.
- **Parameters:** `id` (alert ID), `stepIndex` (step integer, e.g. `1`).

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:12:30Z",
  "data": {
    "alertId": 1,
    "stepIndex": 1,
    "action": "Block 192.168.1.45 at the firewall.",
    "executionStatus": "completed",
    "gatewayReference": "FW-RULE-ADD-SUCCESS-819",
    "executedBy": "Alex Mercer"
  }
}
```

---

### 4.4 Mark Alert As False Alarm (`POST /api/v1/alerts/{id}/false-alarm`)
- **Status:** **PROPOSED**
- **Purpose:** Flag false alarm for analyst feedback calibration and baseline model retraining.
- **Request Body:**
```json
{
  "isFalseAlarm": true,
  "analystNotes": "Verified internal vulnerability scanner cron job."
}
```

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:13:00Z",
  "data": {
    "alertId": 1,
    "isFalseAlarm": true,
    "feedbackLogged": true,
    "modelCalibrationScheduled": true
  }
}
```

---

## 5. Zero-Day Attack Simulator Endpoints

### 5.1 Get Simulator Status (`GET /api/v1/simulator/status`)
- **Status:** **PROPOSED**
- **Purpose:** Return model awareness and current simulation statistics.

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:14:00Z",
  "data": {
    "availableAttackTypes": ["DDoS", "WebAttack", "PortScan", "Infiltration", "Botnet"],
    "modelKnowledgeStatus": {
      "DDoS": "Unseen (0 training samples)",
      "WebAttack": "Unseen (0 training samples)",
      "PortScan": "Unseen (0 training samples)",
      "Infiltration": "Unseen (0 training samples)",
      "Botnet": "Unseen (0 training samples)"
    },
    "currentStats": {
      "attacksLaunched": 500,
      "attacksCaught": 410,
      "caughtRate": 82.0
    }
  }
}
```

---

### 5.2 Launch Unseen Attack Simulation (`POST /api/v1/simulator/launch`)
- **Status:** **PROPOSED**
- **Purpose:** Inject synthetic zero-day packet flow and execute real-time model detection inference.
- **Request Body:**
```json
{
  "attackType": "DDoS",
  "packetCount": 50
}
```

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:14:30Z",
  "data": {
    "attackType": "DDoS",
    "batchLaunched": 50,
    "batchCaught": 41,
    "newTotals": {
      "attacksLaunched": 550,
      "attacksCaught": 451,
      "caughtRate": 82.0
    },
    "generatedAlert": {
      "time": "09:14:30",
      "sourceIp": "203.0.113.8",
      "score": 95,
      "risk": "Critical",
      "reason": "Packet rate 40x above normal"
    }
  }
}
```

---

## 6. Threat & Evaluation Reports Endpoints

### 6.1 Get Executive Threat Summary (`GET /api/v1/reports/summary`)
- **Status:** **PROPOSED**
- **Purpose:** Powers Executive Threat Summary card on Page 7.

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:15:00Z",
  "data": {
    "evaluationDate": "Nov 9, 2026",
    "zeroDayCatchRate": {
      "value": 82.4,
      "baselineSignatureCatchRate": 54.0,
      "gainPercent": 28.4
    },
    "meanTimeToDetectSeconds": 4.2,
    "autonomousMitigations": {
      "executed": 9,
      "required": 9,
      "percentage": 100.0
    }
  }
}
```

---

### 6.2 Get Model Performance & Confusion Matrix (`GET /api/v1/reports/model-performance`)
- **Status:** **PROPOSED**
- **Purpose:** Powers Section A model performance metrics and confusion matrix.

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:15:00Z",
  "data": {
    "dataset": "CIC-IDS2017 & Live Telemetry",
    "sampleCount": 15000,
    "metrics": {
      "accuracy": 96.8,
      "precision": 94.2,
      "recall": 91.5,
      "f1Score": 92.8,
      "rocAuc": 0.978
    },
    "confusionMatrix": {
      "truePositives": 410,
      "falsePositives": 25,
      "trueNegatives": 14527,
      "falseNegatives": 38
    }
  }
}
```

---

### 6.3 Get Attack Detection Analysis (`GET /api/v1/reports/attack-analysis`)
- **Status:** **PROPOSED**
- **Purpose:** Powers Section B attack category breakdown table.

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:15:00Z",
  "data": [
    {
      "category": "DDoS",
      "title": "Distributed Denial of Service",
      "description": "SYN flood, UDP amp, volumetric anomalies",
      "testedPackets": 500,
      "detectedCaught": 410,
      "catchRate": 82.4,
      "averageRisk": 92,
      "severity": "Critical",
      "meanLatencyMs": 3.8,
      "generalizationStatus": "High Generalization"
    },
    {
      "category": "WebAttack",
      "title": "Web Application Attack",
      "description": "SQL injection, XSS bypass, malformed headers",
      "testedPackets": 200,
      "detectedCaught": 177,
      "catchRate": 88.5,
      "averageRisk": 81,
      "severity": "High",
      "meanLatencyMs": 4.1,
      "generalizationStatus": "Confirmed Pattern"
    },
    {
      "category": "PortScan",
      "title": "PortScan Reconnaissance",
      "description": "Horizontal & vertical port sweeps, stealth SYN probes",
      "testedPackets": 500,
      "detectedCaught": 370,
      "catchRate": 74.0,
      "averageRisk": 64,
      "severity": "Medium",
      "meanLatencyMs": 2.9,
      "generalizationStatus": "Active Containment"
    },
    {
      "category": "Benign",
      "title": "Benign Network Traffic Baseline",
      "description": "Normal enterprise traffic flows, legitimate TLS/HTTPS packets",
      "testedPackets": 14300,
      "detectedCaught": 14210,
      "catchRate": 99.4,
      "averageRisk": 8,
      "severity": "Low",
      "meanLatencyMs": 1.8,
      "generalizationStatus": "Baseline Stable"
    }
  ]
}
```

---

### 6.4 Get 7-Day Detection Trends (`GET /api/v1/reports/trends`)
- **Status:** **PROPOSED**
- **Purpose:** Powers Section C SVG trend lines.

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:15:00Z",
  "data": [
    { "date": "Nov 3", "catchRate": 78.5, "falsePositiveRate": 1.4, "falseNegativeRate": 5.2 },
    { "date": "Nov 4", "catchRate": 79.2, "falsePositiveRate": 1.1, "falseNegativeRate": 4.8 },
    { "date": "Nov 5", "catchRate": 80.1, "falsePositiveRate": 0.9, "falseNegativeRate": 4.5 },
    { "date": "Nov 6", "catchRate": 81.0, "falsePositiveRate": 0.8, "falseNegativeRate": 4.0 },
    { "date": "Nov 7", "catchRate": 81.8, "falsePositiveRate": 0.6, "falseNegativeRate": 3.7 },
    { "date": "Nov 8", "catchRate": 82.1, "falsePositiveRate": 0.5, "falseNegativeRate": 3.4 },
    { "date": "Nov 9", "catchRate": 82.4, "falsePositiveRate": 0.5, "falseNegativeRate": 3.2 }
  ]
}
```

---

### 6.5 Query Incident Audit Ledger (`GET /api/v1/reports/incidents`)
- **Status:** **PROPOSED**
- **Purpose:** Powers Section D Incident Audit searchable ledger.
- **Parameters:** `q` (search term), `page`, `limit`.

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:15:00Z",
  "data": [
    {
      "incidentId": "INC-9481",
      "threatVector": "DDoS SynFlood",
      "sourceIp": "192.168.1.45",
      "riskScore": 92,
      "severity": "Critical",
      "timestamp": "Nov 9, 09:01:12",
      "status": "Quarantined",
      "alertId": 1
    },
    {
      "incidentId": "INC-9482",
      "threatVector": "WebAttack SQLi",
      "sourceIp": "172.16.4.9",
      "riskScore": 81,
      "severity": "High",
      "timestamp": "Nov 9, 09:05:40",
      "status": "WAF Intercept",
      "alertId": 2
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 24, "totalPages": 3, "hasMore": true }
}
```

---

## 7. System Settings Endpoints

### 7.1 Get System Settings (`GET /api/v1/settings`)
- **Status:** **PROPOSED**
- **Purpose:** Populate all configuration controls on Page 8.

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:16:00Z",
  "data": {
    "detectionThreshold": 85,
    "activePreset": "balanced",
    "autoQuarantine": true,
    "primaryModelEngine": "hybrid_autoencoder_xgboost",
    "streamIngestionMode": "dpdk_bypass",
    "containmentPolicy": "isolate_on_critical",
    "audibleAlertChime": true,
    "feedbackCalibration": true,
    "siemWebhookUrl": "https://siem.internal.corp/api/v2/zeroday-events",
    "payloadFormat": "json_zeroday_v2",
    "channels": {
      "splunk": true,
      "pagerduty": true,
      "executiveDigest": true
    },
    "inactivityTimeoutMinutes": 30,
    "auditRetentionDays": 180,
    "cardSurfaceStyle": "white"
  }
}
```

---

### 7.2 Update System Settings (`PUT /api/v1/settings`)
- **Status:** **PROPOSED**
- **Purpose:** Persist analyst changes when "Save Configuration" is clicked.
- **Request Body:** Partial or complete settings object matching `7.1`.

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:16:30Z",
  "data": {
    "message": "Configuration successfully saved and applied to active SOC engine pipeline."
  }
}
```

---

### 7.3 Test SIEM Webhook (`POST /api/v1/settings/webhook/test`)
- **Status:** **PROPOSED**
- **Purpose:** Triggers immediate dry-run dispatch to test webhook endpoint connectivity.
- **Request Body:**
```json
{
  "webhookUrl": "https://siem.internal.corp/api/v2/zeroday-events",
  "payloadFormat": "json_zeroday_v2"
}
```

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:17:00Z",
  "data": {
    "status": "delivered",
    "httpStatus": 200,
    "latencyMs": 42.1,
    "remoteEndpoint": "https://siem.internal.corp/api/v2/zeroday-events"
  }
}
```

---

## 8. Support & Diagnostics Endpoints

### 8.1 Get Operational Health (`GET /api/v1/support/health`)
- **Status:** **PROPOSED**
- **Purpose:** Populate Page 9 health telemetry banner.

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:18:00Z",
  "data": {
    "status": "operational",
    "engineOnline": true,
    "uptimePercentage": 99.98,
    "inferenceLatencyMs": 3.2,
    "droppedPackets": 0,
    "droppedPacketsPercentage": 0.0
  }
}
```

---

### 8.2 Run Automated Diagnostics (`POST /api/v1/support/diagnostics/run`)
- **Status:** **PROPOSED**
- **Purpose:** Executes the 5-step hardware and model self-diagnostic suite.

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:18:30Z",
  "data": {
    "overallStatus": "ALL_SYSTEMS_PASS",
    "checks": [
      { "name": "Ingress Pipeline DPDK Line-Rate Stream", "latencyMs": 0.4, "status": "PASS" },
      { "name": "Deep Autoencoder Latent Space Normalization", "latencyMs": 1.1, "status": "PASS" },
      { "name": "SIEM Webhook Collector Connectivity", "latencyMs": 18.2, "status": "PASS" },
      { "name": "38 Flow Vector Real-Time Feature Store", "latencyMs": 0.8, "status": "PASS" },
      { "name": "Inference Model Weights SHA-256 Integrity", "latencyMs": 0.2, "status": "PASS" }
    ]
  }
}
```

---

### 8.3 Submit Support Ticket (`POST /api/v1/support/tickets`)
- **Status:** **PROPOSED**
- **Purpose:** Persist support ticket and notify Tier 3 SOC response team.
- **Request Body:**
```json
{
  "subject": "False positive calibration on PortScan sweep",
  "category": "false_positive",
  "priority": "high",
  "analystId": "AM-8914",
  "description": "PortScan alert triggered by internal Nessus vulnerability scanner.",
  "includeTelemetry": true
}
```

#### Successful Response (`201 Created`)
```json
{
  "success": true,
  "timestamp": "2026-11-09T09:19:00Z",
  "data": {
    "ticketId": "ZS-TICKET-89241",
    "referenceCode": "ZS-TICKET-89241",
    "status": "DISPATCHED",
    "assignedTier": "Tier 3 Systems Engineer",
    "expectedResponseTimeMinutes": 15,
    "createdAt": "2026-11-09T09:19:00Z"
  }
}
```

