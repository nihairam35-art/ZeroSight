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
