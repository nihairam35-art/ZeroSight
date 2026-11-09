HEAD
# ZeroSight — Threat Detection Platform

## Official Brand Color Palette Implementation

This application implements the finalized **ZeroSight Official Brand Identity** across all screens, preserving the original UI design, page structures, layouts, and interactive workflows from the design specification.

### 1. Brand Color System (60-30-10 Rule)

| Role | Color Name | HEX Code | Distribution | Usage in ZeroSight |
|---|---|---|---|---|
| **Primary** | Primary Black | `#0C0C0C` | **60%** | Main application background, sidebars, headers, dark panels |
| **Secondary** | Pure White | `#FFFFFF` | **30%** | Dashboard cards, login card, input fields, tables, content surfaces |
| **Accent** | Signature Orange | `#FF6F32` | **10%** | Primary action buttons, active navigation, selected roles/filters, critical highlights |

### 2. Global CSS Variables

```css
:root {
  --primary-black: #0C0C0C;
  --pure-white: #FFFFFF;
  --signature-orange: #FF6F32;
}
```

### 3. Application-Style Fixed Navigation Architecture

ZeroSight operates as a professional, desktop-first SOC dashboard application rather than a long scrolling website:

1. **Stationary Persistent Shell & Header**: The navigation sidebar (`.app-sidebar`) and global top header (`.app-stationary-header`) remain completely stationary at all times during user interactions.
2. **Dedicated Route-Based Views**: Each page is an isolated view (`.content-view`). When a route is selected, the previous view is completely hidden (`display: none !important`) and only the active page is rendered in the workspace (`display: block !important`).
3. **Strict Viewport Pinning**: `html, body`, and `#app-shell` are locked to `100vh` with `overflow: hidden !important`. The browser window never scrolls vertically or horizontally.
4. **Internal Scroll Isolation**: If an individual view genuinely contains extensive data exceeding the screen height (e.g. Reports or Support), scrolling is strictly confined inside `.app-main-content` with custom sleek dark scrollbars.
5. **Zero-Offset Route Transitions**: Switching between any pages instantly resets the scroll position to the top (`scrollTop = 0; window.scrollTo(0, 0)`), preventing page jumps or layout shifting.

### 4. Backend Developer Handoff Package

Complete documentation packages are available for backend developers integrating real APIs and inference pipelines:

- 📘 **[`FRONTEND_HANDOFF.md`](./FRONTEND_HANDOFF.md)**: Architectural overview, all 9 view specifications, technology stack, and backend responsibilities.
- 📋 **[`API_CONTRACT.md`](./API_CONTRACT.md)**: 25 proposed RESTful endpoint contracts covering Auth, Dashboard, Alerts, Simulator, Reports, Settings, and Support.
- 🔍 **[`MOCK_DATA_INVENTORY.md`](./MOCK_DATA_INVENTORY.md)**: Exhaustive inventory of mock and simulated data in the frontend with replacement strategies.
- 🛠️ **[`FRONTEND_INTEGRATION_GUIDE.md`](./FRONTEND_INTEGRATION_GUIDE.md)**: Step-by-step code guide to connecting APIs into `app.js` with a centralized `api.js` client, UI states, and RBAC governance.

---

## Screen Directory & Layout Highlights

### Page 1 — Welcome / Intro Screen (`view-welcome`)
- Full-screen official background image (`welcome-bg.jpg`) with `background-size: cover` and `background-position: center`.
- Preserves the vibrant orange network connections, glowing nodes, and particle flares on the left with natural black negative space on the right.
- Directional gradient overlay ensuring strong text contrast without dimming the orange nodes.
- Content positioned comfortably towards the right side over the darker negative area.
- Prominent **ZeroSight** typography and official tagline: *"See the attack no one has seen yet."*
- Primary **Next** button in Signature Orange (`#FF6F32`) with smooth navigation to the Login screen.

### Page 2 — Login Screen (`view-login`)
- **Centered Layout**: Centered vertically and horizontally.
- **Spacious Card Dimensions**: Target height of **460–500px** (`min-height: 475px; max-height: 520px`), width: 440px.
- **Card Surface**: Pure White (`#FFFFFF`) with high-contrast text (`#0C0C0C`).
- **Interactive Inputs**: Username input with user icon; Password input with toggleable visibility eye icon.
- **Role Selection**: 3 distinct, accessible role buttons:
  - `Security Analyst` (default selected with `#FF6F32` highlight)
  - `Security Manager`
  - `Admin`
- **Primary Login Button**: Signature Orange (`#FF6F32`) with white text (`#FFFFFF`).
- **Authentication**: Seamlessly stores and propagates the selected user and role to the SOC session profile and dashboard greeting.

### Page 3 — Dashboard (`content-dashboard`)
- **Sidebar Navigation**:
  - Logo with target/radar icon and "ZeroSight Threat detection" subtitle.
  - Quick alert search input.
  - Active nav state highlighted in Signature Orange (`#FF6F32`).
  - "Run a simulation" callout card with "Open Simulator" action.
  - Dynamic user profile footer displaying logged-in user name, role, and avatar initials.
- **Top Header**: "Good morning, [Name]", date badge "Nov 9, 2026", and unread alert count "3".
- **Top 4 Metric Cards**:
  - Total alerts: `128` (+12.5%)
  - Critical alerts: `9` (-4.7%) with orange highlight
  - Detection rate: `87%` (+2.1%)
  - False positives: `14` (-8.0%)
- **Alerts Over Time Bar Chart**:
  - Hourly bars (09:00 to 20:00).
  - Hover tooltips (defaulting to `10:00 | 24 alerts`).
- **Risk Breakdown Donut Chart**:
  - SVG donut breakdown: Critical (9 / 7.0%), High (24 / 18.8%), Medium (51 / 39.8%), Low (44 / 34.4%).
- **Recent Alerts Table**:
  - Recent alerts with severity tags. Clicking any item opens its full Alert Details page.
- **Zero-Day Test Card**:
  - 82% catch rate with trend curve.
- **Detection Quality**:
  - Precision 91%, Recall 87%, Zero-day recall 82% (orange highlight).
- **Security Insights Banner**:
  - Actionable insights summary with "View detailed report" button.

### Page 4 — Threat Alerts Queue (`content-alerts`)
- **Visual Direction**: High-contrast white table interface inside a large card container (`.card.alerts-queue-card`), adhering strictly to the official 60/30/10 brand palette (60% deep black shell, 30% clean white table card, 10% signature orange accents).
- **Header**: "Threat Alerts Queue" title, descriptive subtitle, and "Refresh Stream" action button.
- **Severity Filters**:
  - Four distinct severity quick-filter options: **Critical** (`3`), **High** (`2`), **Medium** (`3`), and **Low** (`2`).
  - Clickable filters with active highlight and toggle capability (clicking active pill resets to full queue).
- **Risk Score Sorting & Search**:
  - Sort dropdown: Default **Risk Score (High → Low)**, supporting Risk Score (Low → High), Timestamp (Newest / Oldest), and Severity Tier.
  - Live search input: Instant query filtering across Alert IDs, source IPs, and threat vectors.
- **Alerts Queue Table**:
  - Columns: Alert ID, Severity, Threat Vector, Source IP, Risk Score, Detection Time, Status, and Action.
  - Retains all 10 cyber threat detection records with accurate metadata and status badges.
  - Dedicated "Investigate →" action button navigating directly to Alert Details (Page 5).
- **Responsive Architecture**: Fits cleanly on desktop (1920px, 1440px), laptop (1366px), tablet (1024px, 768px), and mobile (375px) with responsive horizontal scrolling within `.table-responsive` and zero whole-application window scrolling.

### Page 5 — Alert Details (`content-alert-details`)
- Breadcrumbs: `Alerts / Alert 1` with `Back to alerts` navigation.
- Summary cards: Risk Score (`92 / 100`), Source IP (`192.168.1.45`), Detection Time (`09:01:12`), Attack Label (`DDoS Flood`).
- **Why was this flagged?**: Packet rate surge, Destination port entropy, Connection asymmetry with animated orange percentage bars.
- **What to do next**: Step-by-step SOC mitigation checklist with interactive action buttons that toggle to `Completed ✓` with toast notifications.
- **Chronological Incident Timeline**: Step-by-step forensic progression (Ingress Spike → Autoencoder Loss Divergence → Neural Risk Scoring → Autonomous Firewall Quarantine).
- **Other alerts from host**: Correlated attack history for the active IP.
- **False Alarm Action**: Interactive "Mark as false alarm" action with feedback state connected to the model retraining feedback loop.

### Page 6 — Zero-Day Simulator (`content-simulator`)
- Attack type selector: `DDoS`, `WebAttack`, `PortScan`, `Infiltration`, `Botnet`.
- Dynamic model status indicator ("The model has never seen DDoS").
- `Launch unseen attack` button triggers a real-time attack simulation with dynamic metric increases, live SVG donut chart updates, and animated log additions.
- `Reset Baseline` button (`#btn-sim-reset`): Restores initial baseline metrics (`500` launched, `410` caught, `82%`).
- **Simulation Run History Table**: Audited log table capturing each injection run (Timestamp, Scenario, Packets Injected, Intercepted, Catch Rate, Verdict), stored persistently in `localStorage`.
- Live alert feed table and Caught vs. Missed visualization.

### Page 7 — Threat & Evaluation Reports (`content-reports`)
- **1. Security Overview**:
  - Compact top summary row featuring live telemetry metric cards:
    - **Total Alerts**: `10` active intrusion events.
    - **Critical Alerts**: `3` high-priority threats requiring isolation.
    - **Detection Rate**: `82.4%` zero-day benchmark generalization rate.
- **2. Threat Severity Distribution**:
  - Clean SVG Donut Chart dynamically computing segment arc ratios for all 4 severity tiers:
    - **Critical**: 3 alerts (`30%`)
    - **High**: 2 alerts (`20%`)
    - **Medium**: 3 alerts (`30%`)
    - **Low**: 2 alerts (`20%`)
  - Integrated center total counter and color-coded severity legend.
- **3. Detection Trends**:
  - Area/Line chart with gradient fill and readable timestamps (08:00 to Now).
  - Prominent spike annotation marking the 09:21 UTC UDP Amplification volumetric anomaly (`Spike: 38 pkts/s`).
- **4. Model Evaluation & Category Breakdown**:
  - **Model Evaluation Rings**: Circular progress rings displaying verified detection performance metrics:
    - **Precision**: `94.2%`
    - **Recall**: `91.5%`
    - **False Positive Rate**: `0.17%`
    - **Zero-Day Recall**: `82.4%`
  - **Attack Category Breakdown**: Compact horizontal bar comparison chart across evaluated threat vectors (DDoS, WebAttack, PortScan, Infiltration, Benign).
- **5. Recent Incident Activity**:
  - Streamlined incident table displaying verified detections from `state.alerts` with search input and live "Inspect &rarr;" buttons routing directly to the forensic Alert Details view.
- **6. Export Suite**:
  - **Export PDF Report**: Opens the formal Executive Audit Report modal with printable letterhead and print support.
  - **Export JSON**: Generates and downloads the `ZeroSight_Threat_Report_Nov9_2026.json` data blob.

### Page 8 — SOC Settings & Configuration (`content-settings`)
- **Layout Overflow Fixed**: Horizontal clipping completely resolved using responsive grid containers (`minmax(0, 1fr)`) that collapse gracefully across all device widths.
- **Detection Threshold & Sensitivity**:
  - Interactive range slider (50–99) with live sensitivity value display.
  - Three quick-select presets: `Conservative (75)`, `Balanced (85)`, and `Aggressive (95)` with automatic indicator synchronization.
  - Auto-quarantine switch for critical anomalies (>90 score).
- **Model Configuration**:
  - Primary Inference Engine selector (`Hybrid Autoencoder + XGBoost`, `Isolation Forest`, `Deep Packet Transformer v2`).
  - Read-only SLA targets: `< 5.0ms per flow` latency and `38 Flow Vectors` feature dimension.
  - Stream ingestion mode (`Kernel Bypass DPDK`, `AF_PACKET Ring Buffer`, `PCAP Replay`).
- **Alert Preferences**:
  - Automated containment policy dropdown (`Isolate Host on Critical`, `Isolate on High/Critical`, `Analyst Approval Required`, `Passive Audit Mode`).
  - Audible Critical Alert chime toggle.
  - Feedback calibration loop toggle (retraining weights on false alarm verification).
- **Notification Settings & SIEM Integration**:
  - SIEM Webhook URL input with functional "Test Webhook" trigger and feedback toast.
  - Payload format selector (`Structured JSON`, `CEF`, `Syslog RFC 5424`).
  - Channel toggles: Splunk HEC, PagerDuty Tier 3, Daily Executive Digest.
- **Security & Session Governance**:
  - Active analyst identity badge (`Alex Mercer`, FIDO2 MFA Enforced).
  - Inactivity timeout dropdown (`15m`, `30m`, `1h`, `4h`).
  - Audit log retention selector (`90 Days`, `180 Days`, `1 Year`).
- **Brand Theme Surface Switch**:
  - Instant toggle between high-contrast 30% Pure White cards and Dark SOC stealth panels.
- **Functional Action Bar & Persistence**:
  - "Save Configuration" with persistent `localStorage` storage and notification toast.
  - "Reset Defaults" restoring the standard SOC operational baseline.
  - Persistent state restoration across browser refreshes.

### Page 9 — Support & Knowledge Base (`content-support`)
- **Support Overview & Health Banner**:
  - Welcome heading, enterprise description, and pulsing green status indicator (*All Systems Operational*).
  - Live engine telemetry: 99.98% uptime, 3.2ms latency, 0 dropped frames.
- **Technical Documentation & Playbooks**:
  - 4 quick-start playbook cards:
    1. *Getting Started with ZeroSight SOC*
    2. *Understanding Threat Alerts & Risk Scores*
    3. *Using the Zero-Day Attack Simulator*
    4. *Understanding Detection Metrics*
  - Interactive "Read Playbook" buttons that open a modal reader with full technical guides.
- **Frequently Asked Questions**:
  - Interactive accordion featuring detailed explanations for:
    1. *How does zero-day detection work?*
    2. *How are risk scores calculated?*
    3. *How do I run an unseen attack simulation?*
    4. *What do precision and recall mean?*
- **Troubleshooting & Live Diagnostics**:
  - Solutions for Detection Engine issues, Model configuration issues, Missing alerts, and Simulator errors.
  - **Live Diagnostic Self-Check**: Interactive terminal runner that executes 5 automated checks (Ingress Pipeline, Deep Autoencoder, SIEM Webhook, Feature Store, Model Weights SHA-256) with animated green PASS logs and health verdict.
- **System Information**:
  - Specification card with Application Version (`v2.6.4-prod`), PID (`4192`), Neural Architecture (`PyTorch/ONNX Generalizer v4.1`), Model Weights Hash, and License status.
- **Contact Support Ticket Form**:
  - Input fields: Subject, Category, Priority, Analyst ID, Description, and Telemetry Attachment checkbox.
  - **Client-Side Validation**: Ensures Subject and Description are filled out before submission; triggers focused toast errors on blank submissions.
  - Functional submission generating a unique ticket reference ID (`ZS-TICKET-XXXXX`), confirmation state, and feedback toast.
  - "Create Another Ticket" workflow.
- **My Demonstration Tickets Table**:
  - Persistent local browser ledger logging all submitted support tickets with Ticket ID, Date, Category, Priority, Subject, and Status.
  - "Clear Ticket History" action.

---

## Responsive Design & Viewport Matrix

ZeroSight has been audited across all standard screen sizes with zero horizontal overflow:

| Device Category | Target Viewport | Layout Behavior |
|---|---|---|
| **Ultra-Wide / Desktop** | `1920px` | 4-column metric grid, 2-column analytics, expansive dashboard |
| **Standard Laptop** | `1440px` | Full desktop layout, 4-column metrics, side-by-side alert panels |
| **Common Laptop** | `1366px` | Proportional card scaling with sidebar pinned, zero clipping |
| **Tablet Landscape** | `1024px` | 2x2 metric cards, stacked alert split panels, pinned sidebar |
| **Tablet Portrait** | `768px` | Mobile topbar with off-canvas sidebar drawer, 2-column metrics |
| **Mobile Phone** | `375px` | 1-column stacked flow, responsive scroll containers, zero overflow |

---

## How to Run

ZeroSight has zero external runtime dependencies and runs cleanly on any modern browser.

### Option 1: Direct File Opening
Double-click `index.html` or open it directly in Google Chrome, Microsoft Edge, or Firefox.

### Option 2: Local Node.js Server
Run the built-in HTTP server:

```powershell
node server.js
```
or:
```powershell
npm start
```
Then open `http://localhost:3000` in your web browser.

=======
# ZeroSight: Zero-Day Threat Detection & Security Monitoring System

> See the attack no one has seen yet.  
> An intelligent cybersecurity monitoring platform designed to visualize security threats, investigate suspicious activities, simulate zero-day attacks and analyze threat detection performance.

---

## Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Node.js (development server, where configured)

### Backend

- Backend framework: To be confirmed
- Programming language: To be confirmed
- REST API integration
- Threat detection and alert processing: To be confirmed

### Database & Storage

- Database: To be confirmed
- Data storage: To be confirmed

### AI / Threat Detection Engine

- Zero-day threat detection: Backend implementation
- Machine learning integration: To be confirmed
- Threat analysis and risk scoring: Backend implementation

### Authentication & Security

- Authentication: Backend implementation
- Role-based access control: To be confirmed
- Secure API communication

---

## Quick Start Guide

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd ZeroSight
```

### 2. Frontend Setup

Navigate to the project directory:

```bash
npm install
```

Start the frontend development server using the configured project command.

If `package.json` contains a start script:

```bash
npm start
```

Alternatively, if the project uses `server.js` directly:

```bash
node server.js
```

Open the local URL displayed in the terminal.

### 3. Backend Setup

The backend setup instructions will be added once the backend implementation and framework are finalized.

The backend will provide the APIs required for authentication, threat alerts, detection results, simulator operations and reporting.

### 4. Frontend–Backend Integration

The frontend and backend communicate through API endpoints.

The API contract and integration requirements are documented in:

- `API_CONTRACT.md`
- `FRONTEND_INTEGRATION_GUIDE.md`
- `FRONTEND_HANDOFF.md`

---

## Application Modules

| Module | Description |
|---|---|
| Welcome | Introduces the ZeroSight platform |
| Login | User authentication interface |
| Dashboard | Centralized security monitoring overview |
| Threat Alerts | Searchable and filterable security alert queue |
| Alert Details | Detailed threat investigation and risk information |
| Zero-Day Simulator | Interactive attack scenario simulation |
| Reports | Threat analytics and detection performance reports |
| Settings | Application preferences and configuration |
| Support | Help documentation and support interface |

---

## Core Features

- **Security Monitoring Dashboard:** Centralized overview of security events, alerts and threat statistics.
- **Threat Alert Management:** View, search, filter and investigate detected threats.
- **Threat Investigation:** Examine alert details, severity, source IP addresses and incident timelines.
- **Zero-Day Attack Simulation:** Demonstrate attack scenarios and simulated detection outcomes.
- **Threat Analytics:** Visualize detection performance and security trends.
- **Reporting:** Present detection metrics and incident summaries.
- **Authentication:** Login interface designed for integration with backend authentication.
- **API Integration:** Connect frontend modules with backend services.

---

## Threat Detection Workflow

```text
       ┌──────────────────────┐
       │   Incoming Activity  │
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │  Backend Processing  │
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │ Threat Detection     │
       │ Engine               │
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │ Threat Classification│
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │ Alert Generation     │
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │ ZeroSight Dashboard  │
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │ Investigation and    │
       │ Reporting            │
       └──────────────────────┘
```

*This represents the intended system workflow; actual processing depends on the implemented backend and detection engine.*

---

## Project Structure

```text
ZeroSight/
│
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── welcome-bg.jpg
│
├── backend/
│   └── Backend implementation
│
├── scratch/
│   └── Testing scripts
│
├── README.md
├── API_CONTRACT.md
├── FRONTEND_HANDOFF.md
├── FRONTEND_INTEGRATION_GUIDE.md
└── MOCK_DATA_INVENTORY.md
```

*The backend directory structure will be updated to reflect the actual implementation.*

---

## Testing & Validation

The frontend has undergone automated and browser-based verification.

Reported verification includes:

- Unit and structure tests.
- Navigation and page-switching tests.
- HTML and CSS structural validation.
- JavaScript syntax validation.
- Responsive layout testing.
- Real-browser visual verification.

Backend testing will cover the implemented API endpoints, authentication, threat detection processing, data validation and integration.

---

## Design System

ZeroSight uses a consistent cybersecurity-inspired visual identity.

| Color | Hex Code | Usage |
|---|---|---|
| Black | `#0C0C0C` | Primary backgrounds |
| White | `#FFFFFF` | Content surfaces |
| Orange | `#FF6F32` | Highlights and important actions |

**Color distribution:** 60% Black, 30% White and 10% Orange.

---

## Project Documentation

| Document | Purpose |
|---|---|
| `API_CONTRACT.md` | API endpoints and data requirements |
| `FRONTEND_HANDOFF.md` | Frontend architecture and handoff details |
| `FRONTEND_INTEGRATION_GUIDE.md` | Frontend and backend integration instructions |
| `MOCK_DATA_INVENTORY.md` | Inventory of demonstration data |

---

## Team

**Project:** ZeroSight  
**Domain:** Cybersecurity / Zero-Day Threat Detection  
**Development:** Frontend and Backend

---

*ZeroSight — See the attack no one has seen yet.*
>>>>>>> origin/main
