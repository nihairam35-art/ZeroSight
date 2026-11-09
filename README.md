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

### Page 4 — Threat Alerts Queue / Dark SOC Command Center (`content-alerts`)
- **Visual Direction**: Premium Dark SOC Command Center interface built with dark charcoal surfaces (`#141414`), subtle borders (`#262626`), high-contrast typography, and Signature Orange (`#FF6F32`) accents adhering strictly to the official brand palette.
- **Header**: "Threat Intelligence Center" title, descriptive subtitle, pulsing live anomaly ingress pill, and "Refresh Stream" action.
- **Compact Threat Summary Grid**:
  - Total Alerts (`10`) — active neural telemetry stream.
  - Critical Threats (`3`) — autonomous containment tier with orange accent.
  - High-Risk Alerts (`2`) — priority investigation queue.
  - Highest Risk Score (`96 / 100`) with dynamic threat metadata (`DDoS UDP Amp · 192.0.2.44`).
- **Dark SOC Filter & Search Bar**:
  - Severity quick-filter pills: `All Alerts (10)`, `Critical (3)`, `High (2)`, `Medium (2)`, `Low (3)` with live count badges.
  - Threat Vector Dropdown: Filter by DDoS, WebAttack, PortScan, Infiltration, Botnet, or Benign flows.
  - Mitigation Status Dropdown: Filter by Blocked & Quarantined, WAF Intercept, Rate Limited, or Baseline Anomaly.
  - Sort Dropdown: Sort by Risk Score (High → Low, Low → High), Timestamp (Newest / Oldest), or Severity Tier.
  - Live Text Search: Real-time search bar filtering across alert IDs, threat vectors, source IPs, and mitigation statuses.
- **Active Threat Stream**:
  - Replaces generic white tables with a vertical stream of dark charcoal cards (`#141414`).
  - Severity indicator left borders (Critical: `#FF6F32`, High: `#8E8E93`, Medium: `#48484A`, Low: `#2C2C2E`).
  - Each card displays Alert ID, Threat vector, Category badge, Severity tag, Monospaced risk score (`/ 100`), Source IP, Detection time, Mitigation status pill, Top neural anomaly summary, and Quick Inspect / Full Details actions.
  - Selected state features glowing orange borders and focused background elevation.
- **Dedicated Selected Alert Investigation Panel**:
  - Sticky right-side desktop panel (~420px width) displaying deep forensic telemetry for the active alert.
  - 2x2 Telemetry Grid: Composite Risk, Severity Tier, Source Host, and Mitigation Status.
  - Neural Detection Signals: Visual progress bars filled in Signature Orange (`#FF6F32`) with anomaly percentages.
  - Recommended Response Playbook: Interactive SOP checklist items with execution toggle buttons.
  - Correlated Host Incidents: Past 24h threat history associated with the source IP.
  - Primary CTA Button: "Launch Full Alert Details View →" linking directly to Page 5.
- **Responsive Architecture**: Adapts seamlessly from 2-column desktop (1920px, 1440px) to laptop (1366px), tablet (1024px, 768px), and stacked mobile stream (375px) with zero horizontal overflow and no whole-window scrolling.

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
- **Executive Threat Summary**:
  - Nov 9, 2026 evaluation period with verified attack vectors badge.
  - Zero-Day Catch Rate: `82.4%` (vs baseline signature-only 54.0%, +28.4% gain).
  - Mean Time to Detect (MTTD): `4.2s` (sub-second anomaly alert).
  - Autonomous Mitigations: `9 / 9` (100% critical threat vectors contained).
- **Section A: Model Performance**:
  - Accuracy: `96.8%` (Validation dataset of 15,000 flows).
  - Precision: `94.2%` (True zero-day attack ratio vs benign noise).
  - Recall: `91.5%` (Threat capture sensitivity preventing lateral movement).
  - F1 Score: `92.8%` (Harmonic balance of precision and recall).
  - Confusion Matrix & Statistical Breakdown: TP (`410`), FP (`25`), TN (`14,527`), FN (`38`), and ROC-AUC (`0.978`).
- **Section B: Attack Detection Analysis**:
  - DDoS Flood: 82.4% catch rate, 410/500 caught, 92 Critical, 3.8ms latency, High Generalization status.
  - WebAttack SQLi: 88.5% catch rate, 177/200 caught, 81 High, 4.1ms latency, Confirmed Pattern status.
  - PortScan Recon: 74.0% catch rate, 370/500 caught, 64 Medium, 2.9ms latency, Active Containment status.
  - Benign Traffic: 99.4% accuracy, 14,210/14,300 passed, 8 Low, 1.8ms latency, Baseline Stable status.
- **Section C: Detection Trends (Past 7 Days)**:
  - Interactive SVG line chart plotting daily progression (Nov 3 to Nov 9) of Catch Rate (78.5% -> 82.4%), False Positives (1.4% -> 0.5%), and False Negatives (5.2% -> 3.2%).
- **Section D: Incident Audit**:
  - Live filterable table with search bar by incident ID, attack type, or IP.
  - Telemetry source disclosure identifying combined live simulation telemetry and benchmark audit logs.
  - Interactive "Inspect" button on every incident that links directly into the forensic Alert Details view.
- **Section E: Functional Export Suite**:
  - **Export PDF Report**: Opens the formal Executive Audit Report modal with printable letterhead, performance tables, analyst signoff, and `@media print` support (`window.print()`).
  - **Export JSON**: Generates and downloads a complete `ZeroSight_Threat_Report_Nov9_2026.json` data blob.

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

