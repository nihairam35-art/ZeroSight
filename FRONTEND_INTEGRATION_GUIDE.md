# ZeroSight — Frontend Integration Guide for Backend Developers

> **Target Audience:** Backend Developers, API Engineers, and Integrators  
> **Goal:** Step-by-step code guide to replacing frontend mock data with real backend API endpoints while preserving the existing UI design, styling, and navigation.

---

## 1. Architectural Strategy: Centralized API Service Layer

To keep the frontend codebase clean, maintainable, and free of tangled `fetch()` calls scattered across DOM listeners, **create a centralized API service module**.

### Step 1.1: Runtime Configuration Setup
Create an external configuration file or inject a global configuration object inside the `<head>` of [`index.html`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/index.html):

```html
<!-- index.html (inside <head>) -->
<script>
  window.ZEROSIGHT_CONFIG = {
    API_BASE_URL: window.location.origin.includes('localhost') 
      ? 'http://localhost:8000/api/v1' 
      : 'https://api.zerosight.corp/api/v1',
    POLL_INTERVAL_MS: 5000,
    REQUEST_TIMEOUT_MS: 10000
  };
</script>
```

> **Security Rule:** **Never** store secrets, API master keys, database passwords, or private encryption keys in `ZEROSIGHT_CONFIG` or frontend code. The frontend is fully inspectable in the user's browser.

---

### Step 1.2: Implement `api.js` (The Centralized HTTP Client)
Create a new file `api.js` and include it in `index.html` immediately before `app.js`:
```html
<script src="api.js"></script>
<script src="app.js"></script>
```

#### Complete `api.js` Implementation Template:
```javascript
/**
 * ZeroSight Centralized API Client (api.js)
 */
const ZeroSightAPI = (function () {
  'use strict';

  const BASE_URL = (window.ZEROSIGHT_CONFIG && window.ZEROSIGHT_CONFIG.API_BASE_URL) || '/api/v1';
  const TOKEN_KEY = 'zs_auth_token';

  // Token Management
  function getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  function setToken(token) {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  }

  // Core HTTP Request Handler
  async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    };

    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      // Handle Authentication Expiry (401 Unauthorized)
      if (response.status === 401) {
        setToken(null);
        if (window.location.hash !== '#login') {
          window.location.hash = '#login';
          if (window.showToast) window.showToast('Session expired. Please log in again.', 'error');
        }
        throw new Error('Authentication session expired');
      }

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        const errorMsg = (payload.error && payload.error.message) || `HTTP Error ${response.status}`;
        throw new Error(errorMsg);
      }

      return payload.data;
    } catch (err) {
      console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, err);
      throw err;
    }
  }

  return {
    // Authentication
    auth: {
      login: (username, password, role) => request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password, role })
      }),
      logout: () => request('/auth/logout', { method: 'POST' }),
      getMe: () => request('/auth/me'),
      setToken,
      getToken
    },

    // Dashboard
    dashboard: {
      getMetrics: () => request('/dashboard/metrics'),
      getAlertsOverTime: (range = 'today') => request(`/dashboard/alerts-over-time?range=${range}`),
      getRiskBreakdown: () => request('/dashboard/risk-breakdown'),
      getRecentAlerts: () => request('/dashboard/recent-alerts'),
      getQuality: () => request('/dashboard/quality')
    },

    // Threat Alerts Queue & Details
    alerts: {
      query: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return request(`/alerts?${qs}`);
      },
      getById: (id) => request(`/alerts/${id}`),
      executeMitigation: (id, stepIndex) => request(`/alerts/${id}/mitigations/${stepIndex}/execute`, { method: 'POST' }),
      markFalseAlarm: (id, isFalseAlarm, notes) => request(`/alerts/${id}/false-alarm`, {
        method: 'POST',
        body: JSON.stringify({ isFalseAlarm, notes })
      })
    },

    // Zero-Day Simulator
    simulator: {
      getStatus: () => request('/simulator/status'),
      launch: (attackType, packetCount = 50) => request('/simulator/launch', {
        method: 'POST',
        body: JSON.stringify({ attackType, packetCount })
      })
    },

    // Reports
    reports: {
      getSummary: () => request('/reports/summary'),
      getModelPerformance: () => request('/reports/model-performance'),
      getAttackAnalysis: () => request('/reports/attack-analysis'),
      getTrends: () => request('/reports/trends'),
      getIncidents: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return request(`/reports/incidents?${qs}`);
      }
    },

    // Settings
    settings: {
      get: () => request('/settings'),
      update: (payload) => request('/settings', { method: 'PUT', body: JSON.stringify(payload) }),
      testWebhook: (webhookUrl, payloadFormat) => request('/settings/webhook/test', {
        method: 'POST',
        body: JSON.stringify({ webhookUrl, payloadFormat })
      }),
      reset: () => request('/settings/reset', { method: 'POST' })
    },

    // Support & Diagnostics
    support: {
      getHealth: () => request('/support/health'),
      runDiagnostics: () => request('/support/diagnostics/run', { method: 'POST' }),
      submitTicket: (payload) => request('/support/tickets', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
    }
  };
})();
```

---

## 2. Event Handlers & Functions in `app.js` Requiring API Integration

The following table maps existing event handlers and functions in [`app.js`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js) to their corresponding backend API integrations:

| Function / Listener in `app.js` | Line Target | Current Mock Behavior | Integration Action Required |
|---|---|---|---|
| `formLogin.addEventListener('submit')` | [`app.js:469-490`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L469-L490) | Reads input values into memory and calls `navigateTo('dashboard')`. | Call `await ZeroSightAPI.auth.login()`, store returned JWT token, and update user state. |
| `btnLogout.addEventListener('click')` | [`app.js:524-530`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L524-L530) | Sets `isLoggedIn = false` and navigates to `#login`. | Call `await ZeroSightAPI.auth.logout()`, clear token, and route to `#login`. |
| `navigateTo('dashboard')` | [`app.js:346-348`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L346-L348) | Displays static HTML metric numbers. | Call `ZeroSightAPI.dashboard.getMetrics()` and render dynamic numbers and sparklines. |
| `navigateTo('alerts')` | [`app.js:348-350`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L348-L350) | Displays 4 static rows in table. | Call `ZeroSightAPI.alerts.query()` and render dynamic `<tr>` elements into `#alerts-queue-tbody`. |
| `filterPills.forEach(...)` | [`app.js:553-568`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L553-L568) | Client-side row display toggle. | Call `ZeroSightAPI.alerts.query({ severity })` and re-render table. |
| `inputAlertsFilter.addEventListener('input')` | [`app.js:570-588`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L570-L588) | Client-side string matching. | Implement debounced (300ms) call to `ZeroSightAPI.alerts.query({ q: query })`. |
| `renderAlertDetails()` | [`app.js:376-420`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L376-L420) | Reads from local `state.alerts` array. | Call `await ZeroSightAPI.alerts.getById(state.selectedAlertId)` and render signals and steps. |
| `btnMarkFalseAlarm.addEventListener('click')` | [`app.js:640-655`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L640-L655) | Toggles button text and shows toast. | Call `await ZeroSightAPI.alerts.markFalseAlarm(alertId, true)`. |
| `btnLaunchAttack.addEventListener('click')` | [`app.js:680-770`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L680-L770) | Increments numbers with `setTimeout`. | Call `await ZeroSightAPI.simulator.launch(attackType)` and render returned alert and totals. |
| `navigateTo('reports')` | [`app.js:355-357`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L355-L357) | Displays static HTML report tables. | Fetch summary, model metrics, attack analysis, and incidents concurrently via `Promise.all`. |
| `btnSaveSettings.addEventListener('click')` | [`app.js:840-855`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L840-L855) | Shows toast notification only. | Serialize form inputs and call `await ZeroSightAPI.settings.update(payload)`. |
| `btnTestWebhook.addEventListener('click')` | [`app.js:860-875`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L860-L875) | Shows simulated success toast. | Call `await ZeroSightAPI.settings.testWebhook(url, format)` and show real delivery latency. |
| `btnRunDiagnostics.addEventListener('click')` | [`app.js:1120-1170`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L1120-L1170) | Fixed 5-step timer animation. | Call `await ZeroSightAPI.support.runDiagnostics()` and print real server probe results. |
| `formSupportTicket.addEventListener('submit')` | [`app.js:1175-1195`](file:///c:/Users/Ume%20Niha%20Iram/OneDrive/Documents/Desktop/ZeroSight/app.js#L1175-L1195) | Generates random ticket ID. | Call `await ZeroSightAPI.support.submitTicket(formData)` and display returned ticket ID. |

---

## 3. UI State Management (Loading, Empty, Error, Success)

The backend integration must provide seamless visual feedback during network operations.

### 3.1 Loading State Pattern
When initiating an asynchronous network call:
```javascript
function setElementLoading(element, isLoading, loadingText = 'Loading...') {
  if (!element) return;
  if (isLoading) {
    element.dataset.originalHtml = element.innerHTML;
    element.disabled = true;
    element.innerHTML = `<span class="loading-spinner"></span> <span>${loadingText}</span>`;
  } else {
    element.disabled = false;
    element.innerHTML = element.dataset.originalHtml || element.innerHTML;
  }
}
```

### 3.2 Empty State Pattern for Tables
When an API query returns an empty list (`data: []`), insert an empty state placeholder rather than leaving a blank container:
```javascript
function renderEmptyTable(tbodyElement, message = 'No threat alerts found matching the current filters.') {
  tbodyElement.innerHTML = `
    <tr>
      <td colspan="8" class="text-center py-8 text-muted">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto mb-2 opacity-50">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <p>${message}</p>
      </td>
    </tr>
  `;
}
```

### 3.3 Error Notification Pattern
Use the existing toast notification system in `app.js` (`showToast(message, type)`):
```javascript
try {
  const alerts = await ZeroSightAPI.alerts.query();
  renderAlerts(alerts);
} catch (err) {
  showToast(`Failed to load threat alerts: ${err.message}`, 'error');
}
```

---

## 4. Role-Based Access Control (RBAC) in Frontend

ZeroSight supports 3 distinct analyst roles:
1. `Security Analyst`: Standard triage operator (can view alerts, investigate, launch simulator, submit tickets).
2. `Security Manager`: Operational lead (can approve mitigations, mark false alarms, export audit reports).
3. `Admin`: Full system administrator (can adjust detection sensitivity thresholds, change neural inference engines, configure SIEM webhooks, and reset system configurations).

### Implementation Pattern in `app.js`:
```javascript
function applyRolePermissions(userRole) {
  const isAdmin = userRole === 'Admin';
  const isManagerOrAdmin = userRole === 'Admin' || userRole === 'Security Manager';

  // Restrict sensitive settings inputs to Admin only
  if (el.sliderThreshold) el.sliderThreshold.disabled = !isAdmin;
  if (el.selectModelEngine) el.selectModelEngine.disabled = !isAdmin;
  if (el.inputWebhookUrl) el.inputWebhookUrl.disabled = !isAdmin;
  if (el.btnSaveSettings) el.btnSaveSettings.disabled = !isAdmin;

  // Restrict False Alarm marking to Security Manager and Admin
  if (el.btnMarkFalseAlarm) {
    el.btnMarkFalseAlarm.disabled = !isManagerOrAdmin;
    if (!isManagerOrAdmin) {
      el.btnMarkFalseAlarm.title = 'Requires Security Manager or Admin privileges';
    }
  }
}
```

---

## 5. Security & Deployment Best Practices

1. **CORS Configuration:**
   - Configure backend CORS middleware to accept requests from the frontend origin (e.g. `http://localhost:3000` or production domain).
   - Allowed Headers: `Content-Type`, `Authorization`, `X-Requested-With`.
   - Allowed Methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`.
2. **CSRF & Cookies:**
   - If using HTTP-only session cookies instead of Bearer tokens in `sessionStorage`, ensure `SameSite=Lax` or `SameSite=Strict` and `Secure=true`.
3. **Payload Sanitization:**
   - Always sanitize inputs on the backend before executing shell mitigations or database queries. Never trust client-submitted IP strings or attack labels.

