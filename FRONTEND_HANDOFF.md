# ZeroSight — Frontend-to-Backend Handoff Documentation

> **Status:** APPROVED & AUDITED FRONTEND SPECIFICATION  
> **Audience:** Backend Engineers, System Architects, DevOps, and Machine Learning Engineers  
> **Frontend Version:** 2.6.4 (Desktop-First SOC Cybersecurity Application)  
> **Brand Color System:** Primary Black `#0C0C0C` (60%), Pure White `#FFFFFF` (30%), Signature Orange `#FF6F32` (10%)  

---

## 1. Executive Project Overview

**ZeroSight** is an AI-powered enterprise Network Security Operations Center (SOC) threat detection dashboard. It is engineered to detect **zero-day attacks and behavioral anomalies** that static signature databases (CVE rules) fail to capture.

The platform provides analysts with:
1. Real-time telemetry monitoring and prioritized anomaly alerts.
2. Forensic deep-dive diagnostics with neural reconstruction signals.
3. An experiential zero-day attack simulator testing model generalization against unseen attack vectors.
4. Comprehensive model evaluation metrics, trend analysis, and printable audit reports.
5. SOC configuration management and 24/7 technical operations playbooks.

### Current Project State
- **Frontend Development:** **100% COMPLETE**. All 9 views, responsive layouts, client-side interactions, and visual presentations have been built, audited in Google Chrome, and approved.
- **Backend Development:** **NOT STARTED**. The application currently relies on local JavaScript mock state, client-side simulated data, and static fallback HTML values.
- **Handoff Scope:** This document guides backend developers on how to connect real RESTful API endpoints, WebSockets, machine learning inference engines, and database persistence to the existing frontend without altering the approved UI design, layout, or color palette.

---

## 2. Frontend Technology & Architecture

### Core Tech Stack
- **Structure:** Semantic HTML5 (`index.html`, 2,706 lines).
- **Styling:** Vanilla CSS3 (`styles.css`, 4,475 lines) utilizing CSS Custom Properties (CSS variables), CSS Grid (`minmax(0, 1fr)`), and Flexbox.
- **Scripting:** Pure Vanilla JavaScript (ES6+, `app.js`, 1,247 lines) encapsulated inside an Immediately Invoked Function Expression (`IIFE`).
- **Dependencies:** **Zero external libraries or frameworks**. No React, Vue, Angular, jQuery, or Tailwind. The platform is completely self-contained, lightweight, and loads in under 200 milliseconds.
- **Local Dev Server:** Native Node.js HTTP server (`server.js`) with zero npm package dependencies.

### SPA Layout & Navigation Architecture
ZeroSight functions as a **fixed-layout Single-Page Application (SPA)**:
1. **Window Viewport Lock:** `html, body`, and `.app-shell` are constrained to `100vh` with `overflow: hidden !important`. The browser window and document body **never** scroll vertically or horizontally.
2. **Persistent Stationary Shell:**
   - `.app-sidebar`: Pinned to the left viewport edge (`height: 100vh; flex-shrink: 0; width: 250px`).
   - `.app-stationary-header`: Pinned across the top workspace (`height: 58px; flex-shrink: 0`). Displays dynamic breadcrumbs (`ZeroSight / [Active View]`), system date, critical unread badge count, card surface switcher, and active user profile.
3. **Internal Scroll Isolation:**
   - `.app-main-content`: The **only** scrollable element in the authenticated workspace (`height: calc(100vh - 58px); overflow-y: auto`).
   - Short pages (Dashboard, Simulator, Alerts Queue, Alert Details) fit entirely onto 1080p desktop viewports without scrollbars.
   - Longer pages (Reports, Support) scroll strictly inside `.app-main-content` with custom 6px dark scrollbars.
4. **URL Hash Routing & State Transitions:**
   - Route switching is handled by `navigateTo(targetView)` in `app.js`.
   - Supported routes: `#welcome`, `#login`, `#dashboard`, `#alerts`, `#alert-details`, `#simulator`, `#reports`, `#settings`, `#support`.
   - On route change, previous views are hidden (`display: none !important`), the active view is displayed (`display: block !important`), and scroll offsets are reset (`scrollTop = 0; window.scrollTo(0, 0)`).

---

## 3. Directory & File Inventory

```
ZeroSight/
├── index.html                 # Complete DOM structure containing all 9 views and modals
├── styles.css                 # Master design system, variables, layouts, and media queries
├── app.js                     # Client controller, mock state, UI interactions, and routing
├── server.js                  # Minimalist zero-dependency local Node.js static server
├── package.json               # Project manifest and start scripts (npm start / node server.js)
├── welcome-bg.jpg             # Official approved background visual for Page 1 Welcome
├── README.md                  # Screen directory and responsive test matrix
├── FRONTEND_HANDOFF.md        # This document
├── API_CONTRACT.md            # Proposed RESTful endpoints and payload contracts
├── MOCK_DATA_INVENTORY.md     # Complete breakdown of placeholder and mock data
└── FRONTEND_INTEGRATION_GUIDE.md # Step-by-step code integration runbook for backend engineers
```

---

## 4. The 9 Frontend Pages & Their Responsibilities

| # | View ID | Page Title | Route | Core Responsibilities & Interactive Features |
|---|---|---|---|---|
| **1** | `#view-welcome` | Welcome / Intro | `#welcome` | Fullscreen cinematic welcome page with approved neural network background. Displays tagline and primary orange action button routing to Login. |
| **2** | `#view-login` | Analyst Login | `#login` | Centered 460–500px pure white authentication card. Captures username, password (with show/hide eye toggle), and SOC role radio pills (`Security Analyst`, `Security Manager`, `Admin`). |
| **3** | `#content-dashboard` | Threat Dashboard | `#dashboard` | Central SOC command center. Displays 4 top metric cards, 12-hour Alerts Over Time bar chart with interactive hover tooltips, SVG Risk Breakdown donut chart, 4-item Recent Alerts queue, Zero-Day Test curve (82%), and Detection Quality bars. |
| **4** | `#content-alerts` | Threat Intelligence Center (Dark SOC Command Center) | `#alerts` | High-fidelity dark SOC operations center. Features 4 top metric cards (Total, Critical, High-Risk, Highest Score), live anomaly ingress indicator, severity pills, vector/status/sorting dropdowns, real-time search, vertical active threat stream cards, and a dedicated right-hand Selected Alert Investigation Panel with neural signal progress bars and playbook checklist. |
| **5** | `#content-alert-details` | Alert Forensic Deep-Dive | `#alert-details` | Full forensic ledger for a selected incident. Displays Risk Score (0-100), Source IP, Detection Time, Attack Label, "Why was this flagged?" neural anomaly signals, "What to do next" interactive mitigation checklist, correlated historical alerts, and "Mark as false alarm" action. |
| **6** | `#content-simulator` | Zero-Day Simulator | `#simulator` | Experimental lab testing model generalization against unseen attack vectors. Select attack type (`DDoS`, `WebAttack`, `PortScan`, `Infiltration`, `Botnet`), view model awareness status, and click "Launch unseen attack" to trigger real-time metric updates, live table feed additions, and SVG donut recalculations. |
| **7** | `#content-reports` | Threat & Evaluation Reports | `#reports` | Formal model verification ledger. Displays Executive Summary (Catch Rate, MTTD, Mitigations), Section A Model Performance (Accuracy, Precision, Recall, F1, confusion matrix, ROC-AUC), Section B per-vector breakdown table, Section C 7-day trend line charts, Section D searchable incident audit table, and functional Export PDF / JSON modals. |
| **8** | `#content-settings` | SOC Settings & Configuration | `#settings` | Comprehensive SOC engine configuration. Includes sensitivity threshold slider (50–99) with presets (`Conservative 75`, `Balanced 85`, `Aggressive 95`), auto-quarantine toggle, inference engine selector, SIEM webhook integration with functional test trigger, inactivity timeout, and white/dark card style switcher. |
| **9** | `#content-support` | Support & Operations | `#support` | Operational knowledge base. Displays live engine telemetry banner (uptime, latency, drop rate), 4 clickable playbook cards opening modal documentation, FAQ accordion, automated 5-step diagnostic terminal runner, system specifications, and functional support ticket submission form. |

---

## 5. Backend Developer Integration Responsibilities

To make ZeroSight fully operational in a production environment, the backend developer is responsible for:

1. **Authentication & Session Management (`POST /api/v1/auth/login`, `GET /api/v1/auth/me`):**
   - Authenticate analyst credentials against enterprise identity stores (LDAP, Active Directory, OAuth2/OIDC, or DB).
   - Issue secure JWT or HTTP-only session cookies.
   - Enforce Role-Based Access Control (`Security Analyst`, `Security Manager`, `Admin`).
2. **Real-Time Telemetry & Metric Ingestion (`GET /api/v1/dashboard/metrics`):**
   - Aggregate network flow counters into hourly bucket aggregates for the Alerts Over Time chart.
   - Stream live alerts into the Threat Alerts Queue.
3. **Machine Learning Model Inference Integration:**
   - Connect the deep autoencoder / isolation forest / XGBoost inference pipeline.
   - Populate `score` (0–100), `signals` (reconstruction errors, frequency spikes), and severity ratings.
4. **Autonomous Mitigations & SOC Playbooks (`POST /api/v1/alerts/{id}/mitigations/{stepIndex}/execute`):**
   - Connect firewall API (e.g. Palo Alto, Fortinet, iptables/nftables) and EDR host isolation APIs (CrowdStrike, SentinelOne).
5. **SIEM Webhook Forwarding (`POST /api/v1/settings/webhook/test`):**
   - Implement background forwarder streaming CEF/Syslog/JSON anomaly events to external SIEM endpoints (Splunk, Elastic, Sentinel).
6. **Support Ticket Persistence (`POST /api/v1/support/tickets`):**
   - Store support tickets in database and forward to Jira / ServiceNow / Zendesk APIs.

---

## 6. How to Set Up & Run the Frontend

ZeroSight requires zero build steps, bundlers, or package installations.

### Method 1: Built-In Node.js Server (Recommended)
```powershell
# From the project root:
node server.js
```
The server starts immediately on port 3000:
```
========================================
  ZeroSight Threat Detection Platform  
  Server running at: http://localhost:3000
========================================
```
Open **`http://localhost:3000`** in Google Chrome, Microsoft Edge, or Mozilla Firefox.

### Method 2: Direct File Opening
Double-click `index.html` or drag it directly into any modern web browser.

---

## 7. Next Steps for Backend Developers

1. Review **[`API_CONTRACT.md`](./API_CONTRACT.md)** for exact endpoint signatures, request structures, and JSON response envelopes.
2. Review **[`MOCK_DATA_INVENTORY.md`](./MOCK_DATA_INVENTORY.md)** to understand which client-side objects must be replaced by API calls.
3. Follow **[`FRONTEND_INTEGRATION_GUIDE.md`](./FRONTEND_INTEGRATION_GUIDE.md)** for instructions on plugging API services into `app.js` without breaking existing UI bindings.

