# ZeroSight — Mock & Simulated Data Inventory

> **Audience:** Backend Developers, ML Engineers, and Data Architects  
> **Purpose:** Exhaustive catalog of all hardcoded, simulated, placeholder, and demonstration data in the ZeroSight frontend.  
> **Critical Requirement:** Sample evaluation metrics must **never** be misrepresented as real production model results. Real backend services and live inference outputs must replace each item per the replacement strategies below.

---

## 1. Summary of Mock Data Categories

| Category | Description | Primary Files | Replacement Priority |
|---|---|---|:---:|
| **A. Identity & Authentication** | Hardcoded analyst name, role, initials, and session flags. | `app.js`, `index.html` | **P0 (Immediate)** |
| **B. Operational Telemetry** | Headline counters, hourly histogram bars, severity donut. | `index.html`, `app.js` | **P0 (Immediate)** |
| **C. Incident Ledger** | Static alert records, forensic signals, mitigation steps. | `app.js`, `index.html` | **P0 (Immediate)** |
| **D. Synthetic Simulation** | Client-side packet incrementer, synthetic IP generation. | `app.js` | **P1 (Core Feature)** |
| **E. Model Evaluation Benchmarks** | Sample accuracy, precision, recall, F1, confusion matrix. | `index.html` | **P1 (Core Feature)** |
| **F. Configuration & Settings** | Default sliders, preset values, SIEM webhook URL. | `app.js`, `index.html` | **P2 (Operational)** |
| **G. Operational Health & Support** | System telemetry banner, mock diagnostic logs, random ticket IDs. | `app.js`, `index.html` | **P2 (Operational)** |

---

## 2. Exhaustive Data Inventory by Location

### Category A: Identity & Authentication Mock Data

#### Item A.1: Default Analyst Profile
- **Source Location:** [`app.js:16-20`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L16-L20)
- **Current Hardcoded Values:**
  ```javascript
  user: {
    name: 'Alex Mercer',
    role: 'Security Analyst',
    initials: 'AM',
    isLoggedIn: false
  }
  ```
- **Where Used in UI:** Sidebar user footer (`#user-display-name`, `#user-display-role`, `#user-avatar`), stationary header (`#topbar-user-avatar`, `.dyn-user-name`), dashboard greeting (`#dashboard-user-name`), and settings identity badge.
- **Replacement Strategy:** Replace with `data.user` payload returned from `POST /api/v1/auth/login` and `GET /api/v1/auth/me`. Initials must be derived dynamically from `user.name`.

---

### Category B: Dashboard Operational Metrics Mock Data

#### Item B.1: Headline Metric Cards
- **Source Location:** [`index.html:390-450`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/index.html#L390-L450)
- **Current Static Values:**
  - Total alerts: `128` (`+12.5% from yesterday`)
  - Critical alerts: `9` (`+4.7% from yesterday`)
  - Detection rate: `87%` (`+2.1% from yesterday`)
  - False positives: `14` (`-8.0% from yesterday`)
- **Nature of Data:** Static demonstration numbers.
- **Replacement Strategy:** Dynamically populate cards via `GET /api/v1/dashboard/metrics`. Calculate percentages from past 24-hour telemetry window.

#### Item B.2: Alerts Over Time Bar Chart (12 Hourly Buckets)
- **Source Location:** [`index.html:470-550`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/index.html#L470-L550), [`app.js:170`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L170)
- **Current Static Values:** 12 inline `style="height: XX%"` columns from 09:00 to 20:00 with default active tooltip at `10:00 | 24 alerts`.
- **Nature of Data:** Hardcoded CSS percentage heights.
- **Replacement Strategy:** Query `GET /api/v1/dashboard/alerts-over-time`. Compute `height: (count / maxCount) * 100%` and inject into DOM bar columns.

#### Item B.3: Risk Breakdown Donut Chart
- **Source Location:** [`index.html:560-625`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/index.html#L560-L625)
- **Current Static Values:** Total `128` alerts, Critical `9` (7.0%), High `24` (18.8%), Medium `51` (39.8%), Low `44` (34.4%).
- **Nature of Data:** Hardcoded SVG `stroke-dasharray` and legend counts.
- **Replacement Strategy:** Fetch `GET /api/v1/dashboard/risk-breakdown`. Calculate SVG circle circumference arc lengths (`2 * π * r`) dynamically based on real counts.

#### Item B.4: Zero-Day Test & Quality Cards
- **Source Location:** [`index.html:735-800`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/index.html#L735-L800)
- **Current Static Values:** Zero-Day Catch Rate `82%`, Precision `91%`, Recall `87%`, Zero-day recall `82%`.
- **Nature of Data:** Static display placeholder.
- **Replacement Strategy:** Fetch from `GET /api/v1/dashboard/quality`.

---

### Category C: Threat Alerts & Incident Ledger Mock Data

#### Item C.1: In-Memory Alerts Array
- **Source Location:** [`app.js:28-110`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L28-L110)
- **Current Hardcoded Records:**
  1. `Alert 1`: DDoS, IP `192.168.1.45`, Score `92` (Critical), Signals: Packet rate 40x above normal (95%), Destination port rarely used (80%), Connection pattern short (72%).
  2. `Alert 2`: WebAttack, IP `172.16.4.9`, Score `81` (High), Signals: Payload SQLi (88%), Header tampered (76%), Frequency 120 req/s (68%).
  3. `Alert 3`: PortScan, IP `10.0.0.17`, Score `64` (Medium), Signals: Port sweep 20-1024 (65%), SYN packets (58%), Subnet traversal (50%).
  4. `Alert 4`: Benign, IP `192.168.1.60`, Score `47` (Low), Signals: Routine backup (40%), Verified cert (20%), NAS pattern (15%).
- **Where Used in UI:**
  - Dashboard recent alerts card ([`index.html:630-730`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/index.html#L630-L730)).
  - Threat Alerts Queue table ([`index.html:880-930`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/index.html#L880-L930)).
  - Alert Details dynamic view ([`app.js:375-420`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L375-L420)).
- **Replacement Strategy:** Replace with database-backed query from `GET /api/v1/alerts` and `GET /api/v1/alerts/{id}`. Neural signals must be populated from the machine learning inference engine feature contribution vector.

---

### Category D: Zero-Day Simulator Synthetic Data

#### Item D.1: Simulator In-Memory Counter State
- **Source Location:** [`app.js:21-27`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L21-L27)
- **Current Hardcoded Values:** `launched: 500`, `caught: 410`, `rate: 82%`.
- **Item D.2: Client-Side Simulation Packet Injection:**
  - Source Location: [`app.js:680-770`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L680-L770)
  - Current Behavior: Clicking "Launch unseen attack" runs a client-side `setTimeout` that artificially adds `+50` to launched, `+41` to caught, generates fake IPs (`203.0.113.8`, `198.51.100.4`), and prepends an HTML row.
- **Distinction from Real Predictions:**
  - **CRITICAL:** This simulation is **purely synthetic client-side demonstration code**. It does NOT execute real packet synthesis, network interface injection, or actual neural net inference.
- **Replacement Strategy:** Connect button to `POST /api/v1/simulator/launch`. The backend test runner must inject real synthetic PCAP flow traces into the detection pipeline and return the real model inference outcome.

---

### Category E: Model Performance & Reports Mock Data

#### Item E.1: Executive Threat Summary
- **Source Location:** [`index.html:1450-1500`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/index.html#L1450-L1500)
- **Current Static Values:** Zero-Day Catch Rate `82.4%` (baseline signature 54.0%, +28.4% gain), Mean Time to Detect `4.2s`, Autonomous Mitigations `9 / 9` (100%).
- **Nature of Data:** Offline benchmark demonstration values.
- **Replacement Strategy:** Compute dynamically from `GET /api/v1/reports/summary`.

#### Item E.2: Section A: Model Performance & Confusion Matrix
- **Source Location:** [`index.html:1510-1650`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/index.html#L1510-L1650)
- **Current Static Values:**
  - Accuracy: `96.8%`
  - Precision: `94.2%`
  - Recall: `91.5%`
  - F1 Score: `92.8%`
  - Confusion Matrix: True Positives `410`, False Positives `25`, True Negatives `14,527`, False Negatives `38`
  - ROC-AUC: `0.978`
- **Dataset Label:** Marked in UI as *"Standardized validation metrics computed on 15,000 real-world flow sequences (CIC-IDS2017 & Live Telemetry)"*.
- **MANDATORY NOTICE:** These values represent **sample benchmark results from a reference test dataset**. They must NEVER be claimed as live production telemetry results until the model is formally evaluated against real enterprise traffic.
- **Replacement Strategy:** Populate from `GET /api/v1/reports/model-performance`.

#### Item E.3: Section B: Attack Detection Analysis Table
- **Source Location:** [`index.html:1670-1780`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/index.html#L1670-L1780)
- **Current Static Values:**
  - DDoS Flood: 82.4% catch rate, 410/500 caught, 92 Critical, 3.8ms latency.
  - WebAttack SQLi: 88.5% catch rate, 177/200 caught, 81 High, 4.1ms latency.
  - PortScan Recon: 74.0% catch rate, 370/500 caught, 64 Medium, 2.9ms latency.
  - Benign Baseline: 99.4% accuracy, 14,210/14,300 passed, 8 Low, 1.8ms latency.
- **Replacement Strategy:** Populate from `GET /api/v1/reports/attack-analysis`.

#### Item E.4: Section C: 7-Day Detection Trends
- **Source Location:** [`index.html:1800-1920`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/index.html#L1800-L1920)
- **Current Static Values:** Hardcoded SVG `<polyline>` point coordinates (`points="40,95 130,88 220,78..."`).
- **Replacement Strategy:** Fetch daily averages from `GET /api/v1/reports/trends` and dynamically construct SVG polyline `points` attributes.

#### Item E.5: Section D: Incident Audit Ledger
- **Source Location:** [`index.html:1950-2050`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/index.html#L1950-L2050)
- **Current Static Values:** 6 static table rows: `INC-9481`, `INC-9482`, `INC-9483`, `INC-9484`, `INC-9485`, `INC-9486`.
- **Replacement Strategy:** Dynamically populate table rows from `GET /api/v1/reports/incidents`.

---

### Category F: System Settings Mock Data

#### Item F.1: Default Sliders & SIEM Configurations
- **Source Location:** [`index.html:2090-2300`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/index.html#L2090-L2300), [`app.js:199-213`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L199-L213)
- **Current Static Values:**
  - Anomaly Threshold: `85`
  - SIEM Webhook URL: `https://siem.internal.corp/api/v2/zeroday-events`
  - Model Engine: `Hybrid Autoencoder + XGBoost`
  - Containment Policy: `Isolate Host on Critical (Score >= 80)`
- **Replacement Strategy:** Retrieve saved tenant configuration on boot via `GET /api/v1/settings` and persist via `PUT /api/v1/settings`.

---

### Category G: Operational Health & Support Mock Data

#### Item G.1: Operational Health Banner
- **Source Location:** [`index.html:2325-2360`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/index.html#L2325-L2360)
- **Current Static Values:** `Online`, Inference Latency `3.2 ms`, Dropped Packets `0 (0.0%)`.
- **Replacement Strategy:** Query live DPDK/kernel stream health from `GET /api/v1/support/health`.

#### Item G.2: Diagnostic Self-Check Terminal Output
- **Source Location:** [`app.js:1120-1170`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L1120-L1170)
- **Current Behavior:** Clicking "Run Diagnostics" executes a client-side timer animation printing 5 hardcoded green `[ PASS ]` lines.
- **Replacement Strategy:** Replace timer simulation with real probe execution via `POST /api/v1/support/diagnostics/run`.

#### Item G.3: Support Ticket ID Generator
- **Source Location:** [`app.js:1180`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L1180)
- **Current Behavior:** Generates `ZS-TICKET-${Math.floor(10000 + Math.random() * 90000)}` locally in memory.
- **Replacement Strategy:** Submit form to `POST /api/v1/support/tickets` and display database-generated ticket ID returned by the API.

