/**
 * ZeroSight Threat Detection Platform
 * Frontend Interactive Controller & Routing
 * Official Brand Color Palette:
 *   #0C0C0C (60% Black) | #FFFFFF (30% White) | #FF6F32 (10% Orange)
 */

(function () {
  'use strict';

  // Comprehensive Threat Alerts Repository (10 Realistic Enterprise Incidents)
  const ALERTS_DATA = [
    {
      id: 1,
      type: 'DDoS Flood',
      category: 'DDoS',
      ip: '192.168.1.45',
      timestamp: 'Nov 9, 09:01',
      timeExact: '09:01:12',
      score: 92,
      severity: 'Critical',
      status: 'Blocked & Quarantined',
      signals: [
        { name: 'Packet rate surge', desc: '40x above rolling baseline (85,000 pkts/sec)', pct: 95 },
        { name: 'Destination port entropy', desc: 'Single target UDP 53 DNS query flood', pct: 88 },
        { name: 'Connection asymmetry', desc: 'Zero ACK return handshake ratio (unidirectional)', pct: 78 }
      ],
      steps: [
        'Apply perimeter rate-limit filter on Border Router 01.',
        'Deploy autonomous IP block on edge firewall (192.168.1.45).',
        'Isolate internal host subnet 192.168.1.0/24 from DMZ.',
        'Export pcap capture archive for forensic validation.'
      ],
      timeline: [
        { time: '09:00:58', event: 'Ingress traffic surge detected', desc: 'Interface eth0 exceeded 10Gbps ingress burst threshold.' },
        { time: '09:01:02', event: 'Autoencoder divergence threshold breached', desc: 'Anomaly reconstruction loss reached 0.892 (threshold 0.75).' },
        { time: '09:01:08', event: 'Neural risk scoring complete', desc: 'Composite risk evaluated at 92/100 (Critical threat priority).' },
        { time: '09:01:12', event: 'Autonomous quarantine deployed', desc: 'BGP FlowSpec null route broadcasted; perimeter drop active.' }
      ],
      relatedAlerts: [
        { type: 'DDoS Flood', ip: '192.168.1.45', time: 'Nov 9, 08:58', score: 88, severity: 'Critical' },
        { type: 'DDoS Flood', ip: '192.168.1.45', time: 'Nov 9, 08:52', score: 74, severity: 'High' },
        { type: 'PortScan Sweep', ip: '192.168.1.45', time: 'Nov 9, 08:41', score: 61, severity: 'Medium' }
      ],
      isFalseAlarm: false
    },
    {
      id: 2,
      type: 'WebAttack SQLi',
      category: 'WebAttack',
      ip: '172.16.4.9',
      timestamp: 'Nov 9, 09:05',
      timeExact: '09:05:40',
      score: 81,
      severity: 'High',
      status: 'WAF Intercept',
      signals: [
        { name: 'Payload token divergence', desc: 'SQL UNION SELECT syntax tree anomaly', pct: 88 },
        { name: 'HTTP Header inspection', desc: 'Tampered User-Agent & sqlmap signature fingerprint', pct: 76 },
        { name: 'Request frequency', desc: 'Bursts of 120 req/s on /api/v1/auth', pct: 68 }
      ],
      steps: [
        'Block source IP at Cloudflare / AWS WAF edge.',
        'Sanitize vulnerable authentication endpoint parameters.',
        'Invalidate active session tokens generated in the last 15m.',
        'Inspect application database audit query logs.'
      ],
      timeline: [
        { time: '09:05:22', event: 'WAF heuristic anomaly flagged', desc: 'Unusual query param string length detected on /api/v1/auth.' },
        { time: '09:05:29', event: 'Deep payload inspection match', desc: 'Trained neural tokenizer flagged SQL syntax tree injection.' },
        { time: '09:05:35', event: 'Risk assessment assigned 81/100', desc: 'High risk classification triggered immediate WAF challenge.' },
        { time: '09:05:40', event: 'WAF rule block enacted', desc: 'HTTP 403 Forbidden enforced; source IP jailed for 24 hours.' }
      ],
      relatedAlerts: [
        { type: 'WebAttack SQLi', ip: '172.16.4.9', time: 'Nov 9, 08:59', score: 79, severity: 'High' },
        { type: 'WebAttack XSS', ip: '172.16.4.9', time: 'Nov 9, 08:45', score: 62, severity: 'Medium' }
      ],
      isFalseAlarm: false
    },
    {
      id: 3,
      type: 'PortScan Sweep',
      category: 'PortScan',
      ip: '10.0.0.17',
      timestamp: 'Nov 9, 09:03',
      timeExact: '09:03:22',
      score: 64,
      severity: 'Medium',
      status: 'Rate Limited',
      signals: [
        { name: 'Sequential port sweep', desc: 'Targeting ports 20-1024 consecutively', pct: 72 },
        { name: 'TCP SYN packet half-open', desc: '98% incomplete connection handshakes', pct: 64 },
        { name: 'Subnet traversal attempt', desc: 'Traversing across internal VLAN 4 boundary', pct: 50 }
      ],
      steps: [
        'Throttle host TCP connection creation rate to 5/sec.',
        'Audit local listening ports on internal service mesh.',
        'Notify local subnet administrator of rogue host.'
      ],
      timeline: [
        { time: '09:03:10', event: 'SYN half-open threshold reached', desc: '1,200 incomplete handshakes in 2 seconds on host 10.0.0.17.' },
        { time: '09:03:16', event: 'Port sweep heuristic verified', desc: 'Automated horizontal port reconnaissance pattern detected.' },
        { time: '09:03:20', event: 'Risk score evaluated at 64/100', desc: 'Medium priority alert generated with auto-throttling rule.' },
        { time: '09:03:22', event: 'Rate-limiting active', desc: 'SYN packets restricted to 5/s via host iptables policy.' }
      ],
      relatedAlerts: [
        { type: 'PortScan Sweep', ip: '10.0.0.17', time: 'Nov 9, 08:30', score: 55, severity: 'Medium' }
      ],
      isFalseAlarm: false
    },
    {
      id: 4,
      type: 'Benign Flow',
      category: 'Benign',
      ip: '192.168.1.60',
      timestamp: 'Nov 9, 09:07',
      timeExact: '09:07:05',
      score: 47,
      severity: 'Low',
      status: 'Baseline Anomaly',
      signals: [
        { name: 'Scheduled backup burst', desc: 'NAS rsync automated synchronization', pct: 44 },
        { name: 'Internal CA signature verified', desc: 'Valid TLS mutual authentication cert', pct: 18 },
        { name: 'Known host communication', desc: 'Matching weekly enterprise backup schedule', pct: 12 }
      ],
      steps: [
        'Verify backup schedule with infrastructure engineering.',
        'Whitelist NAS rsync profile in baseline anomaly filter.',
        'Keep alert active in monitoring mode without blocking.'
      ],
      timeline: [
        { time: '09:06:50', event: 'Unusual throughput on storage port', desc: 'Port 873 (rsync) sudden upload surge to 800MB/s.' },
        { time: '09:06:58', event: 'Mutual TLS certificate validated', desc: 'Host presented verified enterprise root CA certificate.' },
        { time: '09:07:02', event: 'Score normalized to 47/100', desc: 'Volume anomaly mitigated by valid authentication credentials.' },
        { time: '09:07:05', event: 'Monitored without intervention', desc: 'Traffic flow permitted under supervised telemetry.' }
      ],
      relatedAlerts: [
        { type: 'Benign Flow', ip: '192.168.1.60', time: 'Nov 2, 09:00', score: 42, severity: 'Low' }
      ],
      isFalseAlarm: false
    },
    {
      id: 5,
      type: 'Infiltration Kerberos',
      category: 'Infiltration',
      ip: '10.0.2.14',
      timestamp: 'Nov 9, 09:10',
      timeExact: '09:10:18',
      score: 88,
      severity: 'High',
      status: 'Blocked & Quarantined',
      signals: [
        { name: 'Kerberoasting ticket anomaly', desc: 'Abnormal SPN ticket requests across 40 accounts', pct: 89 },
        { name: 'Privilege escalation attempt', desc: 'Divergence from normal workstation behavioral graph', pct: 82 },
        { name: 'LSASS memory read attempt', desc: 'Process injection hook detected on endpoint agent', pct: 75 }
      ],
      steps: [
        'Revoke Kerberos TGT and force password reset for affected SPNs.',
        'Isolate workstation 10.0.2.14 from Active Directory domain.',
        'Preserve memory dump on endpoint for forensic incident response.',
        'Check domain controller event log ID 4769.'
      ],
      timeline: [
        { time: '09:09:45', event: 'Abnormal TGS ticket request burst', desc: '40 Kerberos ticket requests within 8 seconds from workstation 10.0.2.14.' },
        { time: '09:09:55', event: 'Autoencoder divergence spike', desc: 'Reconstruction error reached 0.840 for credential access vector.' },
        { time: '09:10:10', event: 'High risk rating assigned (88/100)', desc: 'Credential theft signature identified with high confidence.' },
        { time: '09:10:18', event: 'Host containment enforced', desc: 'Active Directory account locked; endpoint network quarantined.' }
      ],
      relatedAlerts: [
        { type: 'Infiltration Kerberos', ip: '10.0.2.14', time: 'Nov 8, 17:34', score: 72, severity: 'High' }
      ],
      isFalseAlarm: false
    },
    {
      id: 6,
      type: 'Botnet C2 Beacon',
      category: 'Botnet',
      ip: '203.0.113.195',
      timestamp: 'Nov 9, 09:12',
      timeExact: '09:12:44',
      score: 94,
      severity: 'Critical',
      status: 'Blocked & Quarantined',
      signals: [
        { name: 'Periodic beaconing jitter', desc: 'Outbound TCP connection every 60s ± 2.5s jitter', pct: 96 },
        { name: 'DNS fast-flux resolution', desc: '14 rapid IP rotations for destination domain', pct: 91 },
        { name: 'Encrypted payload entropy', desc: 'High Shannon entropy without TLS handshake', pct: 84 }
      ],
      steps: [
        'Block remote C2 destination IP and all resolved fast-flux IPs.',
        'Quarantine infected internal host initiating outbound beacons.',
        'Sinkhole C2 domain at internal DNS recursive resolvers.',
        'Trigger full malware scan across infected host VLAN.'
      ],
      timeline: [
        { time: '09:12:12', event: 'Beaconing rhythm identified', desc: 'Fourier transform detected repeating 60-second connection pulse.' },
        { time: '09:12:28', event: 'DNS fast-flux correlation', desc: 'Threat intelligence feed confirmed active Mirai/Mozi variant C2 domain.' },
        { time: '09:12:38', event: 'Critical score 94/100 computed', desc: 'Active botnet telemetry matched autonomous quarantine trigger.' },
        { time: '09:12:44', event: 'Outbound egress blocked', desc: 'Firewall egress drop applied; internal infected host isolated.' }
      ],
      relatedAlerts: [
        { type: 'Botnet C2 Beacon', ip: '203.0.113.195', time: 'Nov 9, 09:00', score: 91, severity: 'Critical' }
      ],
      isFalseAlarm: false
    },
    {
      id: 7,
      type: 'WebAttack XSS Evasion',
      category: 'WebAttack',
      ip: '198.51.100.82',
      timestamp: 'Nov 9, 09:15',
      timeExact: '09:15:30',
      score: 62,
      severity: 'Medium',
      status: 'WAF Intercept',
      signals: [
        { name: 'Base64 obfuscated script tag', desc: 'Divergent DOM script injection payload', pct: 70 },
        { name: 'Uncommon character encoding', desc: 'Double URL-encoding detected in form param', pct: 64 },
        { name: 'Form submission velocity', desc: 'Exceeding standard user typing velocity', pct: 52 }
      ],
      steps: [
        'Sanitize user feedback form input field filters.',
        'Deploy strict Content Security Policy (CSP) headers.',
        'Add source IP to 24-hour rate-limiting jail.'
      ],
      timeline: [
        { time: '09:15:15', event: 'Double URL-encoding detected', desc: 'Payload decoding revealed embedded script execution tags.' },
        { time: '09:15:22', event: 'Neural risk scoring', desc: 'Score calculated at 62/100 (Medium severity evasion attempt).' },
        { time: '09:15:28', event: 'WAF policy rule match', desc: 'Cross-Site Scripting input signature matched OWASP CRS tier 2.' },
        { time: '09:15:30', event: 'WAF filter drop', desc: 'Request blocked at ingress with 400 Bad Request response.' }
      ],
      relatedAlerts: [],
      isFalseAlarm: false
    },
    {
      id: 8,
      type: 'PortScan Stealth SYN',
      category: 'PortScan',
      ip: '172.16.8.99',
      timestamp: 'Nov 9, 09:18',
      timeExact: '09:18:02',
      score: 58,
      severity: 'Medium',
      status: 'Rate Limited',
      signals: [
        { name: 'Randomized port probe', desc: 'Non-sequential high-port exploration', pct: 60 },
        { name: 'Slow-rate SYN transmission', desc: '1 packet per 4 seconds avoiding burst threshold', pct: 55 },
        { name: 'TCP window size variation', desc: 'Anomalous TCP header fingerprint', pct: 48 }
      ],
      steps: [
        'Monitor host IP for secondary exploitation attempts.',
        'Throttle connection rate from subnet 172.16.8.0/24.',
        'Log suspicious TCP SYN packets in forensic archive.'
      ],
      timeline: [
        { time: '09:17:40', event: 'Slow scan pattern recognized', desc: 'Sliding window anomaly detector flagged stealth probe.' },
        { time: '09:17:48', event: 'Half-open SYN counter alert', desc: 'Internal firewall tracked 15 unanswered SYN packets across subnet.' },
        { time: '09:17:55', event: 'Risk assessment complete', desc: 'Assigned score 58/100 (Medium threat tier).' },
        { time: '09:18:02', event: 'Adaptive throttle applied', desc: 'Connection handshake latency deliberately extended.' }
      ],
      relatedAlerts: [],
      isFalseAlarm: false
    },
    {
      id: 9,
      type: 'DDoS UDP Amp',
      category: 'DDoS',
      ip: '192.0.2.44',
      timestamp: 'Nov 9, 09:21',
      timeExact: '09:21:19',
      score: 96,
      severity: 'Critical',
      status: 'Blocked & Quarantined',
      signals: [
        { name: 'NTP reflection amplification', desc: 'Amplification ratio estimated at 556x', pct: 98 },
        { name: 'Volumetric pipe saturation', desc: 'Ingress bandwidth spiked to 14.2 Gbps', pct: 94 },
        { name: 'Spoofed source address distribution', desc: 'Randomized public subnet headers', pct: 88 }
      ],
      steps: [
        'Engage upstream ISP BGP Anycast DDoS mitigation scrubber.',
        'Drop all NTP monlist (UDP port 123) ingress at border routers.',
        'Blackhole destination IP prefix temporarily.',
        'Validate SLA availability on critical customer APIs.'
      ],
      timeline: [
        { time: '09:21:05', event: 'Border interface saturation alert', desc: 'Interface TenGig0/0/1 packet drops exceeding 8%.' },
        { time: '09:21:10', event: 'UDP amplification signature verified', desc: 'Autoencoder loss spiked to 0.965; risk classified at 96/100.' },
        { time: '09:21:15', event: 'ISP scrub redirection initiated', desc: 'BGP community signal transmitted to upstream Tier 1 transit.' },
        { time: '09:21:19', event: 'Traffic scrubbing active', desc: 'Clean traffic restored; malicious UDP packets null-routed.' }
      ],
      relatedAlerts: [
        { type: 'DDoS UDP Amp', ip: '192.0.2.44', time: 'Nov 9, 09:15', score: 92, severity: 'Critical' }
      ],
      isFalseAlarm: false
    },
    {
      id: 10,
      type: 'Benign Scheduled Backup',
      category: 'Benign',
      ip: '10.0.0.5',
      timestamp: 'Nov 9, 09:24',
      timeExact: '09:24:50',
      score: 35,
      severity: 'Low',
      status: 'Baseline Anomaly',
      signals: [
        { name: 'Off-hours database replication', desc: 'PostgreSQL WAL transfer burst', pct: 35 },
        { name: 'Encrypted TLS 1.3 channel', desc: 'Authorized internal cluster certificate', pct: 15 },
        { name: 'Standard database protocol', desc: 'Port 5432 known replication stream', pct: 10 }
      ],
      steps: [
        'Confirm scheduled database snapshot with DBA team.',
        'Update baseline replication model to avoid future triggers.',
        'Maintain benign classification in training archive.'
      ],
      timeline: [
        { time: '09:24:35', event: 'WAL replication spike', desc: 'Burst of 2GB database log files over port 5432.' },
        { time: '09:24:42', event: 'Certificate authentication verified', desc: 'Internal mTLS handshake matched DB cluster worker 05.' },
        { time: '09:24:48', event: 'Risk classified as Low (35/100)', desc: 'Confirmed normal operations.' },
        { time: '09:24:50', event: 'Logged without blocking', desc: 'Recorded in benign training dataset.' }
      ],
      relatedAlerts: [],
      isFalseAlarm: false
    }
  ];

  // Default Simulation History (Initial audited log)
  const DEFAULT_SIM_HISTORY = [
    { timestamp: '09:12:04', scenario: 'DDoS Flood', injected: 50, intercepted: 41, rate: '82%', verdict: 'Caught (82%)', statusClass: 'verdict-caught' },
    { timestamp: '08:45:12', scenario: 'WebAttack SQLi', injected: 30, intercepted: 26, rate: '87%', verdict: 'Caught (87%)', statusClass: 'verdict-caught' },
    { timestamp: '08:15:30', scenario: 'PortScan Recon', injected: 40, intercepted: 30, rate: '75%', verdict: 'Caught (75%)', statusClass: 'verdict-caught' }
  ];

  // Default Support Tickets (Initial demonstration tickets)
  const DEFAULT_TICKETS = [
    { refId: 'ZS-TICKET-89241', date: 'Nov 9, 08:30:15', category: 'Detection Engine', priority: 'High', subject: 'Reconstruction threshold tuning for DMZ gateway', status: 'In Review' },
    { refId: 'ZS-TICKET-76412', date: 'Nov 8, 16:12:40', category: 'SIEM Integration', priority: 'Medium', subject: 'Splunk HEC webhook payload verification', status: 'Resolved' }
  ];

  // State Management
  const state = {
    currentView: 'welcome',
    cardStyle: 'white',
    user: {
      name: 'Alex Mercer',
      role: 'Security Analyst',
      initials: 'AM',
      isLoggedIn: false
    },
    alerts: ALERTS_DATA,
    selectedAlertId: 1,
    alertsFilter: {
      severity: 'all',
      category: 'all',
      status: 'all',
      query: '',
      sortBy: 'risk-desc'
    },
    simulator: {
      attackType: 'DDoS',
      launched: 500,
      caught: 410,
      rate: 82,
      isSimulating: false,
      scenarios: {
        DDoS: { name: 'DDoS Flood', pkts: 50, caught: 41, score: 95, reason: 'Volumetric packet rate 40x above baseline' },
        WebAttack: { name: 'WebAttack SQLi', pkts: 30, caught: 26, score: 88, reason: 'SQL syntax tree token divergence in POST payload' },
        PortScan: { name: 'PortScan Sweep', pkts: 40, caught: 30, score: 65, reason: 'Sequential SYN sweep across closed ports 20-1024' },
        Infiltration: { name: 'Infiltration Kerberos', pkts: 25, caught: 17, score: 79, reason: 'Abnormal Kerberos ticket request rate from workstation' },
        Botnet: { name: 'Botnet C2 Beacon', pkts: 35, caught: 30, score: 85, reason: 'Periodic C2 jitter beaconing rhythm on outbound port 443' }
      }
    },
    simHistory: [],
    tickets: []
  };

  // DOM Elements Cache
  const el = {
    app: document.getElementById('app'),
    viewWelcome: document.getElementById('view-welcome'),
    viewLogin: document.getElementById('view-login'),
    appShell: document.getElementById('app-shell'),
    appSidebar: document.getElementById('app-sidebar'),
    sidebarBackdrop: document.getElementById('sidebar-backdrop'),
    btnMobileMenu: document.getElementById('btn-mobile-menu'),
    btnSidebarClose: document.getElementById('btn-sidebar-close'),
    appMainContent: document.getElementById('app-main-content'),
    topbarActivePage: document.getElementById('topbar-active-page'),
    btnTopbarAlerts: document.getElementById('btn-topbar-alerts'),
    topbarUserAvatar: document.getElementById('topbar-user-avatar'),

    // Welcome
    btnWelcomeNext: document.getElementById('btn-welcome-next'),

    // Login
    formLogin: document.getElementById('form-login'),
    inputUsername: document.getElementById('input-username'),
    inputPassword: document.getElementById('input-password'),
    btnTogglePassword: document.getElementById('btn-toggle-password'),
    iconEye: document.getElementById('icon-eye'),
    iconEyeOff: document.getElementById('icon-eye-off'),
    roleButtons: document.querySelectorAll('.role-option-btn'),

    // User Display
    userAvatar: document.getElementById('user-avatar'),
    userDisplayName: document.getElementById('user-display-name'),
    userDisplayRole: document.getElementById('user-display-role'),
    dynUserName: document.querySelectorAll('.dyn-user-name'),
    btnLogout: document.getElementById('btn-logout'),

    // Navigation items
    navItems: document.querySelectorAll('.nav-item'),
    sidebarSearchInput: document.getElementById('sidebar-search-input'),
    btnSidebarSimulator: document.getElementById('btn-sidebar-simulator'),

    // Content Views
    contentDashboard: document.getElementById('content-dashboard'),
    contentAlerts: document.getElementById('content-alerts'),
    contentAlertDetails: document.getElementById('content-alert-details'),
    contentSimulator: document.getElementById('content-simulator'),
    contentReports: document.getElementById('content-reports'),
    contentSettings: document.getElementById('content-settings'),
    contentSupport: document.getElementById('content-support'),

    // Dashboard Time-Range Controls
    selectChartTimeRange: document.getElementById('select-chart-timerange'),
    selectRiskTimeRange: document.getElementById('select-risk-timerange'),
    dashboardTotalAlerts: document.getElementById('dashboard-total-alerts'),
    donutCenterTotalAlerts: document.getElementById('donut-center-total-alerts'),
    donutSegLow: document.getElementById('donut-seg-low'),
    donutSegMed: document.getElementById('donut-seg-med'),
    donutSegHigh: document.getElementById('donut-seg-high'),
    donutSegCrit: document.getElementById('donut-seg-crit'),
    donutCritCnt: document.getElementById('donut-crit-cnt'),
    donutCritPct: document.getElementById('donut-crit-pct'),
    donutHighCnt: document.getElementById('donut-high-cnt'),
    donutHighPct: document.getElementById('donut-high-pct'),
    donutMedCnt: document.getElementById('donut-med-cnt'),
    donutMedPct: document.getElementById('donut-med-pct'),
    donutLowCnt: document.getElementById('donut-low-cnt'),
    donutLowPct: document.getElementById('donut-low-pct'),
    btnToggleCardStyle: document.getElementById('btn-toggle-card-style'),
    toggleCardLabel: document.getElementById('toggle-card-label'),
    linkViewAllAlerts: document.getElementById('link-view-all-alerts'),
    linkViewAllQuality: document.getElementById('link-view-all-quality'),
    btnInsightsReport: document.getElementById('btn-insights-report'),
    chartBars: document.querySelectorAll('.bar-col'),
    chartTooltip: document.getElementById('chartTooltip'),

    // Alerts Queue Specifics
    btnRefreshAlerts: document.getElementById('btn-refresh-alerts'),
    inputAlertsFilter: document.getElementById('input-alerts-filter'),
    alertsQueueTbody: document.getElementById('alerts-queue-tbody'),
    filterPills: document.querySelectorAll('.filter-pill'),
    selectCategoryFilter: document.getElementById('select-category-filter'),
    selectStatusFilter: document.getElementById('select-status-filter'),
    selectSortAlerts: document.getElementById('select-sort-alerts'),
    pillCntAll: document.getElementById('pill-cnt-all'),
    pillCntCritical: document.getElementById('pill-cnt-critical'),
    pillCntHigh: document.getElementById('pill-cnt-high'),
    pillCntMedium: document.getElementById('pill-cnt-medium'),
    pillCntLow: document.getElementById('pill-cnt-low'),

    // Alert Details
    btnBackToDashboard: document.getElementById('btn-back-to-dashboard'),
    crumbAlertsRoot: document.getElementById('crumb-alerts-root'),
    btnMarkFalseAlarm: document.getElementById('btn-mark-false-alarm'),
    alertSignalsContainer: document.getElementById('alert-signals-container'),
    alertStepsContainer: document.getElementById('alert-steps-container'),
    alertIncidentTimeline: document.getElementById('alert-incident-timeline'),
    otherAlertsTitle: document.getElementById('other-alerts-title'),
    otherAlertsList: document.getElementById('other-alerts-list'),

    // Simulator
    selectAttackType: document.getElementById('select-attack-type'),
    btnLaunchAttack: document.getElementById('btn-launch-attack'),
    btnSimReset: document.getElementById('btn-sim-reset'),
    simulatorModelStatus: document.getElementById('simulator-model-status'),
    statAttacksLaunched: document.getElementById('stat-attacks-launched'),
    statAttacksCaught: document.getElementById('stat-attacks-caught'),
    statCaughtRate: document.getElementById('stat-caught-rate'),
    simTableBody: document.getElementById('sim-table-body'),
    simDonutCaught: document.getElementById('sim-donut-caught'),
    simDonutMissed: document.getElementById('sim-donut-missed'),
    simDonutCenterNum: document.getElementById('sim-donut-center-num'),
    simLegendCaughtCnt: document.getElementById('sim-legend-caught-cnt'),
    simLegendCaughtPct: document.getElementById('sim-legend-caught-pct'),
    simLegendMissedCnt: document.getElementById('sim-legend-missed-cnt'),
    simLegendMissedPct: document.getElementById('sim-legend-missed-pct'),
    simBannerTitle: document.getElementById('sim-banner-title'),
    simBannerDesc: document.getElementById('sim-banner-desc'),
    btnSimReport: document.getElementById('btn-sim-report'),
    feedCountBadge: document.getElementById('feed-count-badge'),
    simHistoryTbody: document.getElementById('sim-history-tbody'),
    btnClearSimHistory: document.getElementById('btn-clear-sim-history'),

    // Settings
    btnThemeWhite: document.getElementById('btn-theme-white'),
    btnThemeDark: document.getElementById('btn-theme-dark'),
    sliderThreshold: document.getElementById('slider-threshold'),
    valThreshold: document.getElementById('val-threshold'),
    btnSaveSettings: document.getElementById('btn-save-settings'),
    btnResetSettings: document.getElementById('btn-reset-settings'),
    presetButtons: document.querySelectorAll('.btn-preset'),
    settingPresetLabel: document.getElementById('setting-preset-label'),
    switchAutoQuarantine: document.getElementById('switch-auto-quarantine'),
    selectModelEngine: document.getElementById('select-model-engine'),
    selectContainmentPolicy: document.getElementById('select-containment-policy'),
    switchSound: document.getElementById('switch-sound'),
    switchFeedback: document.getElementById('switch-feedback'),
    inputWebhookUrl: document.getElementById('input-webhook-url'),
    btnTestWebhook: document.getElementById('btn-test-webhook'),
    selectLogFormat: document.getElementById('select-log-format'),
    chkChanSplunk: document.getElementById('chk-chan-splunk'),
    chkChanPagerduty: document.getElementById('chk-chan-pagerduty'),
    chkChanEmail: document.getElementById('chk-chan-email'),
    selectTimeout: document.getElementById('select-timeout'),
    selectRetention: document.getElementById('select-retention'),

    // Reports
    btnExportReport: document.getElementById('btn-export-report'),
    btnExportJson: document.getElementById('btn-export-json'),
    inputAuditSearch: document.getElementById('input-audit-search'),
    auditTableBody: document.getElementById('audit-table-body'),

    // Support
    btnHeaderContactScroll: document.getElementById('btn-header-contact-scroll'),
    btnReadGuides: document.querySelectorAll('.btn-read-guide'),
    faqItems: document.querySelectorAll('.faq-item'),
    btnRunDiagnostics: document.getElementById('btn-run-diagnostics'),
    diagnosticsTerminal: document.getElementById('diagnostics-terminal'),
    formSupportTicket: document.getElementById('form-support-ticket'),
    ticketSubject: document.getElementById('ticket-subject'),
    ticketCategory: document.getElementById('ticket-category'),
    ticketPriority: document.getElementById('ticket-priority'),
    ticketDesc: document.getElementById('ticket-desc'),
    ticketSuccessPanel: document.getElementById('ticket-success-panel'),
    ticketRefId: document.getElementById('ticket-ref-id'),
    btnTicketCreateAnother: document.getElementById('btn-ticket-create-another'),
    ticketHistoryTbody: document.getElementById('ticket-history-tbody'),
    btnClearTickets: document.getElementById('btn-clear-tickets'),

    // Modals
    modalReportExport: document.getElementById('modal-report-export'),
    btnModalReportClose: document.getElementById('btn-modal-report-close'),
    btnModalPrint: document.getElementById('btn-modal-print'),
    btnModalDlJson: document.getElementById('btn-modal-dl-json'),
    modalDocViewer: document.getElementById('modal-doc-viewer'),
    btnModalDocClose: document.getElementById('btn-modal-doc-close'),
    docModalTitle: document.getElementById('doc-modal-title'),
    docModalSubtitle: document.getElementById('doc-modal-subtitle'),
    docModalBody: document.getElementById('doc-modal-body'),

    // Toast
    toastContainer: document.getElementById('toast-container')
  };

  // Toast Notification System
  function showToast(message, type = 'info') {
    if (!el.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <div class="toast-message">${message}</div>
    `;
    el.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }

  // Card Theme Surface Toggle (30% White vs Dark Panels)
  function setCardStyle(style) {
    state.cardStyle = style;
    document.body.setAttribute('data-card-style', style);

    if (el.toggleCardLabel) {
      el.toggleCardLabel.textContent = style === 'white' ? '30% White Cards' : 'Dark Stealth Panels';
    }

    if (el.btnThemeWhite && el.btnThemeDark) {
      if (style === 'white') {
        el.btnThemeWhite.classList.add('active-theme-choice');
        el.btnThemeDark.classList.remove('active-theme-choice');
      } else {
        el.btnThemeDark.classList.add('active-theme-choice');
        el.btnThemeWhite.classList.remove('active-theme-choice');
      }
    }
  }

  // Navigation Controller
  function navigateTo(targetView) {
    state.currentView = targetView;

    // Synchronize URL hash for deep-linking
    if (window.location.hash.replace('#', '') !== targetView) {
      try {
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', '#' + targetView);
        } else {
          window.location.hash = targetView;
        }
      } catch (e) {}
    }

    // Reset window scroll position
    window.scrollTo(0, 0);

    // Screens management
    if (targetView === 'welcome') {
      el.viewWelcome.classList.add('active');
      el.viewLogin.classList.remove('active');
      el.appShell.classList.add('hidden');
      return;
    }

    if (targetView === 'login') {
      el.viewWelcome.classList.remove('active');
      el.viewLogin.classList.add('active');
      el.appShell.classList.add('hidden');
      return;
    }

    // Authenticated Views
    el.viewWelcome.classList.remove('active');
    el.viewLogin.classList.remove('active');
    el.appShell.classList.remove('hidden');

    // Close mobile sidebar if open
    closeMobileSidebar();

    // Hide all content views
    const allViews = [
      el.contentDashboard,
      el.contentAlerts,
      el.contentAlertDetails,
      el.contentSimulator,
      el.contentReports,
      el.contentSettings,
      el.contentSupport
    ];
    allViews.forEach(v => {
      if (v) v.classList.remove('active');
    });

    // Update active nav button
    el.navItems.forEach(item => {
      const navTarget = item.getAttribute('data-nav');
      if (navTarget === targetView || (targetView === 'alert-details' && navTarget === 'alerts')) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update Stationary Header Breadcrumb
    const PAGE_TITLES = {
      dashboard: 'Dashboard',
      alerts: 'Threat Alerts',
      'alert-details': 'Alert Details',
      simulator: 'Zero-Day Simulator',
      reports: 'Threat & Evaluation Reports',
      settings: 'System Settings',
      support: 'SOC Support & Operations'
    };
    if (el.topbarActivePage && PAGE_TITLES[targetView]) {
      el.topbarActivePage.textContent = PAGE_TITLES[targetView];
    }

    // Show target content view & render dynamic state
    if (targetView === 'dashboard' && el.contentDashboard) {
      el.contentDashboard.classList.add('active');
    } else if (targetView === 'alerts' && el.contentAlerts) {
      renderAlertsQueue();
      el.contentAlerts.classList.add('active');
    } else if (targetView === 'alert-details' && el.contentAlertDetails) {
      renderAlertDetails();
      el.contentAlertDetails.classList.add('active');
    } else if (targetView === 'simulator' && el.contentSimulator) {
      renderSimulator();
      renderSimHistory();
      el.contentSimulator.classList.add('active');
    } else if (targetView === 'reports' && el.contentReports) {
      el.contentReports.classList.add('active');
    } else if (targetView === 'settings' && el.contentSettings) {
      el.contentSettings.classList.add('active');
    } else if (targetView === 'support' && el.contentSupport) {
      renderTicketsHistory();
      el.contentSupport.classList.add('active');
    }

    // Scroll ONLY the main content area back to top on page navigation
    if (el.appMainContent) {
      el.appMainContent.scrollTop = 0;
    }
  }

  // Mobile sidebar controls
  function openMobileSidebar() {
    el.appSidebar.classList.add('open');
    el.sidebarBackdrop.classList.add('active');
  }

  function closeMobileSidebar() {
    el.appSidebar.classList.remove('open');
    el.sidebarBackdrop.classList.remove('active');
  }

  // =========================================================================
  // PAGE 4: THREAT ALERTS QUEUE ENGINE
  // =========================================================================
  function renderAlertsQueue() {
    if (!el.alertsQueueTbody) return;

    // 1. Calculate and update pill count numbers
    const total = state.alerts.length;
    const critCount = state.alerts.filter(a => a.severity.toLowerCase() === 'critical').length;
    const highCount = state.alerts.filter(a => a.severity.toLowerCase() === 'high').length;
    const medCount = state.alerts.filter(a => a.severity.toLowerCase() === 'medium').length;
    const lowCount = state.alerts.filter(a => a.severity.toLowerCase() === 'low').length;

    if (el.pillCntAll) el.pillCntAll.textContent = total;
    if (el.pillCntCritical) el.pillCntCritical.textContent = critCount;
    if (el.pillCntHigh) el.pillCntHigh.textContent = highCount;
    if (el.pillCntMedium) el.pillCntMedium.textContent = medCount;
    if (el.pillCntLow) el.pillCntLow.textContent = lowCount;

    // 2. Filter alerts
    let filtered = state.alerts.filter(alert => {
      // Severity Pill filter
      if (state.alertsFilter.severity !== 'all') {
        if (alert.severity.toLowerCase() !== state.alertsFilter.severity) return false;
      }
      // Threat Category filter
      if (state.alertsFilter.category !== 'all') {
        if (alert.category !== state.alertsFilter.category) return false;
      }
      // Status filter
      if (state.alertsFilter.status !== 'all') {
        if (alert.status !== state.alertsFilter.status) return false;
      }
      // Query text search
      if (state.alertsFilter.query) {
        const q = state.alertsFilter.query.toLowerCase();
        const match =
          alert.ip.toLowerCase().includes(q) ||
          alert.type.toLowerCase().includes(q) ||
          alert.category.toLowerCase().includes(q) ||
          alert.status.toLowerCase().includes(q) ||
          `alert ${alert.id}`.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });

    // 3. Sort alerts
    filtered.sort((a, b) => {
      switch (state.alertsFilter.sortBy) {
        case 'risk-desc':
          return b.score - a.score;
        case 'risk-asc':
          return a.score - b.score;
        case 'time-desc':
          return b.id - a.id;
        case 'time-asc':
          return a.id - b.id;
        case 'severity': {
          const rank = { Critical: 4, High: 3, Medium: 2, Low: 1 };
          return (rank[b.severity] || 0) - (rank[a.severity] || 0);
        }
        default:
          return b.score - a.score;
      }
    });

    // 4. Render Table HTML
    if (filtered.length === 0) {
      el.alertsQueueTbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 40px; color: var(--card-text-muted);">
            <div style="font-size: 16px; font-weight: 700; margin-bottom: 6px; color: var(--card-text-primary);">No threat alerts match your filter criteria</div>
            <p style="font-size: 13px; margin: 0;">Try adjusting your severity pills, threat vector dropdown, or search query.</p>
          </td>
        </tr>
      `;
      return;
    }

    const categoryBadgeClass = {
      DDoS: 'badge-ddos',
      WebAttack: 'badge-web',
      PortScan: 'badge-scan',
      Infiltration: 'badge-ddos',
      Botnet: 'badge-scan',
      Benign: 'badge-benign'
    };

    const statusPillClass = {
      'Blocked & Quarantined': 'status-quarantined',
      'WAF Intercept': 'status-quarantined',
      'Rate Limited': 'status-ratelimited',
      'Baseline Anomaly': 'status-baseline'
    };

    el.alertsQueueTbody.innerHTML = filtered.map(alert => {
      const badgeCls = categoryBadgeClass[alert.category] || 'badge-ddos';
      const statusCls = statusPillClass[alert.status] || 'status-quarantined';
      const sevLower = alert.severity.toLowerCase();

      return `
        <tr data-severity="${sevLower}">
          <td class="font-mono text-bold">Alert ${alert.id}</td>
          <td><span class="severity-tag tag-${sevLower}">${alert.severity}</span></td>
          <td><span class="attack-badge ${badgeCls}">${alert.type}</span></td>
          <td class="font-mono">${alert.ip}</td>
          <td><span class="font-mono font-bold ${alert.score >= 80 ? 'text-orange' : ''}">${alert.score}</span> / 100</td>
          <td class="text-muted">${alert.timestamp}:${alert.timeExact.split(':')[2]}</td>
          <td><span class="status-pill ${statusCls}">${alert.status}</span></td>
          <td class="text-right">
            <button class="btn btn-sm btn-primary btn-queue-investigate" data-alert-id="${alert.id}">Investigate →</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // =========================================================================
  // PAGE 5: ALERT DETAILS ENGINE
  // =========================================================================
  function renderAlertDetails() {
    const alert = state.alerts.find(a => a.id === state.selectedAlertId) || state.alerts[0];

    // 1. Breadcrumb & Title
    const currentCrumb = document.querySelector('.breadcrumb-current');
    if (currentCrumb) currentCrumb.textContent = `Alert ${alert.id}`;

    const titleEl = document.querySelector('.alert-details-title');
    if (titleEl) titleEl.textContent = `Alert ${alert.id}`;

    const severityTag = document.querySelector('.alert-title-bar .severity-tag');
    if (severityTag) {
      severityTag.className = `severity-tag tag-${alert.severity.toLowerCase()} tag-lg`;
      severityTag.textContent = alert.severity;
    }

    // 2. 4 Stat Cards
    const statsGrid = document.querySelector('.alert-stats-grid');
    if (statsGrid) {
      const riskVal = statsGrid.querySelector('.alert-stat-card:nth-child(1) .stat-card-value');
      if (riskVal) riskVal.innerHTML = `${alert.score} <span class="stat-denominator">/ 100</span>`;

      const ipVal = statsGrid.querySelector('.alert-stat-card:nth-child(2) .stat-card-value');
      if (ipVal) ipVal.textContent = alert.ip;

      const timeVal = statsGrid.querySelector('.alert-stat-card:nth-child(3) .stat-card-value');
      if (timeVal) timeVal.textContent = alert.timeExact;

      const attackVal = statsGrid.querySelector('.alert-stat-card:nth-child(4) .stat-card-value');
      if (attackVal) attackVal.textContent = alert.type;
    }

    // 3. Why was this flagged? Signals Breakdown
    if (el.alertSignalsContainer) {
      el.alertSignalsContainer.innerHTML = alert.signals.map(sig => `
        <div class="signal-item">
          <div class="signal-info">
            <span class="signal-name">${sig.name}</span>
            <span class="signal-desc ${sig.pct >= 75 ? 'text-orange' : ''}">${sig.desc}</span>
          </div>
          <div class="signal-bar-track">
            <div class="signal-bar-fill fill-orange" style="width: ${sig.pct}%;"></div>
          </div>
        </div>
      `).join('');
    }

    // 4. What to do next: Recommended Mitigation Checklist
    if (el.alertStepsContainer) {
      el.alertStepsContainer.innerHTML = alert.steps.map((step, idx) => `
        <li class="step-item">
          <span class="step-num">${idx + 1}</span>
          <div class="step-content">
            <span class="step-text">${step}</span>
            <button type="button" class="btn-step-action" data-step-idx="${idx}">Execute</button>
          </div>
        </li>
      `).join('');

      // Wire execution toggles
      const stepBtns = el.alertStepsContainer.querySelectorAll('.btn-step-action');
      stepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const isDone = btn.classList.contains('completed');
          if (!isDone) {
            btn.classList.add('completed');
            btn.textContent = 'Completed ✓';
            showToast(`Mitigation playbook step ${parseInt(btn.getAttribute('data-step-idx'), 10) + 1} executed successfully.`);
          } else {
            btn.classList.remove('completed');
            btn.textContent = 'Execute';
          }
        });
      });
    }

    // 5. Chronological Incident Timeline
    if (el.alertIncidentTimeline) {
      el.alertIncidentTimeline.innerHTML = alert.timeline.map(item => `
        <div class="timeline-step">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <div class="timeline-header-row">
              <span class="timeline-title">${item.event}</span>
              <span class="timeline-time">${item.time}</span>
            </div>
            <p class="timeline-desc">${item.desc}</p>
          </div>
        </div>
      `).join('');
    }

    // 6. Other alerts from the same IP
    if (el.otherAlertsTitle) {
      el.otherAlertsTitle.textContent = `Other alerts from ${alert.ip}`;
    }
    if (el.otherAlertsList) {
      if (!alert.relatedAlerts || alert.relatedAlerts.length === 0) {
        el.otherAlertsList.innerHTML = `
          <div style="padding: 18px; color: var(--card-text-muted); font-size: 13px; text-align: center;">
            No additional correlation events logged for host ${alert.ip} in the last 24 hours.
          </div>
        `;
      } else {
        el.otherAlertsList.innerHTML = alert.relatedAlerts.map(rel => `
          <div class="other-alert-row">
            <div class="other-alert-left">
              <span class="other-type">${rel.type}</span>
              <span class="other-time">${rel.time}</span>
            </div>
            <div class="other-alert-right">
              <span class="other-score ${rel.score >= 80 ? 'text-orange font-bold' : ''}">${rel.score}</span>
              <span class="severity-tag tag-${rel.severity.toLowerCase()}">${rel.severity}</span>
            </div>
          </div>
        `).join('');
      }
    }

    // 7. False alarm button state
    if (el.btnMarkFalseAlarm) {
      if (alert.isFalseAlarm) {
        el.btnMarkFalseAlarm.textContent = 'Marked as False Alarm ✓';
        el.btnMarkFalseAlarm.classList.add('btn-primary');
        el.btnMarkFalseAlarm.classList.remove('btn-outline-danger');
      } else {
        el.btnMarkFalseAlarm.textContent = 'Mark as false alarm';
        el.btnMarkFalseAlarm.classList.remove('btn-primary');
        el.btnMarkFalseAlarm.classList.add('btn-outline-danger');
      }
    }
  }

  // =========================================================================
  // PAGE 6: ZERO-DAY SIMULATOR ENGINE
  // =========================================================================
  function renderSimulator() {
    if (el.statAttacksLaunched) el.statAttacksLaunched.textContent = state.simulator.launched;
    if (el.statAttacksCaught) el.statAttacksCaught.textContent = state.simulator.caught;
    if (el.statCaughtRate) el.statCaughtRate.textContent = `${state.simulator.rate}%`;

    const missedCnt = state.simulator.launched - state.simulator.caught;
    const missedPct = 100 - state.simulator.rate;

    if (el.simDonutCenterNum) el.simDonutCenterNum.textContent = state.simulator.launched;
    if (el.simLegendCaughtCnt) el.simLegendCaughtCnt.textContent = state.simulator.caught;
    if (el.simLegendCaughtPct) el.simLegendCaughtPct.textContent = `${state.simulator.rate}%`;
    if (el.simLegendMissedCnt) el.simLegendMissedCnt.textContent = missedCnt;
    if (el.simLegendMissedPct) el.simLegendMissedPct.textContent = `${missedPct}%`;

    // SVG Donut calculation (circumference 390)
    const caughtCirc = Math.round((state.simulator.rate / 100) * 390);
    const missedCirc = 390 - caughtCirc;
    if (el.simDonutCaught) {
      el.simDonutCaught.setAttribute('stroke-dasharray', `${caughtCirc} 390`);
      el.simDonutCaught.setAttribute('stroke-dashoffset', `-${missedCirc}`);
    }
    if (el.simDonutMissed) {
      el.simDonutMissed.setAttribute('stroke-dasharray', `${missedCirc} 390`);
    }

    if (el.simBannerTitle) {
      el.simBannerTitle.textContent = `Caught ${state.simulator.rate}% of an attack the model never saw.`;
    }
    if (el.simBannerDesc) {
      el.simBannerDesc.textContent = `The model was trained without any ${state.simulator.attackType} traffic.`;
    }
  }

  function renderSimHistory() {
    if (!el.simHistoryTbody) return;
    if (state.simHistory.length === 0) {
      el.simHistoryTbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 24px; color: var(--card-text-muted);">
            No simulation runs recorded yet. Launch an attack above to log a trial.
          </td>
        </tr>
      `;
      return;
    }

    el.simHistoryTbody.innerHTML = state.simHistory.map(item => `
      <tr>
        <td class="font-mono text-muted">${item.timestamp}</td>
        <td><span class="attack-badge badge-ddos">${item.scenario}</span></td>
        <td class="font-mono">${item.injected} packets</td>
        <td class="font-mono font-bold text-orange">${item.intercepted} intercepted</td>
        <td class="font-mono font-bold">${item.rate}</td>
        <td><span class="verdict-tag ${item.statusClass}">${item.verdict}</span></td>
      </tr>
    `).join('');
  }

  // =========================================================================
  // PAGE 3: DASHBOARD TIME-RANGE SELECTORS ENGINE
  // =========================================================================
  const DASHBOARD_CHARTS_DATA = {
    today: {
      total: 128,
      bars: [
        { hour: '09', val: 12, height: 38 },
        { hour: '10', val: 18, height: 56 },
        { hour: '11', val: 24, height: 88, active: true },
        { hour: '12', val: 14, height: 44 },
        { hour: '13', val: 8, height: 25 },
        { hour: '14', val: 16, height: 50 },
        { hour: '15', val: 22, height: 69 },
        { hour: '16', val: 10, height: 31 },
        { hour: '17', val: 7, height: 22 },
        { hour: '18', val: 11, height: 34 },
        { hour: '19', val: 15, height: 47 },
        { hour: '20', val: 9, height: 28 }
      ],
      donut: {
        total: 128,
        critCnt: 9, critPct: '7.0%', critCirc: 28,
        highCnt: 24, highPct: '18.8%', highCirc: 73,
        medCnt: 51, medPct: '39.8%', medCirc: 155,
        lowCnt: 44, lowPct: '34.4%', lowCirc: 134
      }
    },
    yesterday: {
      total: 142,
      bars: [
        { hour: '09', val: 15, height: 45 },
        { hour: '10', val: 21, height: 62 },
        { hour: '11', val: 28, height: 85, active: true },
        { hour: '12', val: 19, height: 58 },
        { hour: '13', val: 11, height: 33 },
        { hour: '14', val: 14, height: 42 },
        { hour: '15', val: 18, height: 54 },
        { hour: '16', val: 12, height: 36 },
        { hour: '17', val: 9, height: 27 },
        { hour: '18', val: 16, height: 48 },
        { hour: '19', val: 13, height: 39 },
        { hour: '20', val: 6, height: 18 }
      ],
      donut: {
        total: 142,
        critCnt: 12, critPct: '8.5%', critCirc: 33,
        highCnt: 27, highPct: '19.0%', highCirc: 74,
        medCnt: 54, medPct: '38.0%', medCirc: 148,
        lowCnt: 49, lowPct: '34.5%', lowCirc: 135
      }
    },
    '7d': {
      total: 964,
      bars: [
        { hour: 'Mon', val: 132, height: 65 },
        { hour: 'Tue', val: 144, height: 72 },
        { hour: 'Wed', val: 182, height: 92, active: true },
        { hour: 'Thu', val: 128, height: 62 },
        { hour: 'Fri', val: 165, height: 81 },
        { hour: 'Sat', val: 98, height: 48 },
        { hour: 'Sun', val: 115, height: 56 },
        { hour: 'Avg', val: 138, height: 68 },
        { hour: 'Pk1', val: 190, height: 95 },
        { hour: 'Pk2', val: 174, height: 86 },
        { hour: 'Wk1', val: 104, height: 51 },
        { hour: 'Wk2', val: 122, height: 60 }
      ],
      donut: {
        total: 964,
        critCnt: 68, critPct: '7.1%', critCirc: 28,
        highCnt: 181, highPct: '18.8%', highCirc: 73,
        medCnt: 386, medPct: '40.0%', medCirc: 156,
        lowCnt: 329, lowPct: '34.1%', lowCirc: 133
      }
    }
  };

  function updateDashboardCharts(timeRangeKey) {
    const data = DASHBOARD_CHARTS_DATA[timeRangeKey] || DASHBOARD_CHARTS_DATA.today;
    if (el.dashboardTotalAlerts) el.dashboardTotalAlerts.textContent = data.total;

    const barsWrap = document.querySelector('.chart-bars-flex');
    if (barsWrap) {
      barsWrap.innerHTML = data.bars.map(b => `
        <div class="bar-col ${b.active ? 'active-bar' : ''}" data-hour="${b.hour}" data-val="${b.val}">
          <div class="bar-fill" style="height: ${b.height}%;"></div>
          <span class="bar-label">${b.hour}</span>
        </div>
      `).join('');

      // Re-attach tooltip events
      const newBars = barsWrap.querySelectorAll('.bar-col');
      newBars.forEach(bar => {
        bar.addEventListener('mouseenter', () => {
          newBars.forEach(b => b.classList.remove('active-bar'));
          bar.classList.add('active-bar');
          const hour = bar.getAttribute('data-hour');
          const val = bar.getAttribute('data-val');
          if (el.chartTooltip) {
            el.chartTooltip.textContent = `${hour}:00 | ${val} alerts`;
            const offsetLeft = bar.offsetLeft + (bar.offsetWidth / 2);
            el.chartTooltip.style.left = `${offsetLeft}px`;
          }
        });
      });
    }
  }

  function updateDashboardDonut(timeRangeKey) {
    const data = (DASHBOARD_CHARTS_DATA[timeRangeKey] || DASHBOARD_CHARTS_DATA.today).donut;

    if (el.donutCenterTotalAlerts) el.donutCenterTotalAlerts.textContent = data.total;

    if (el.donutCritCnt) el.donutCritCnt.textContent = data.critCnt;
    if (el.donutCritPct) el.donutCritPct.textContent = data.critPct;
    if (el.donutHighCnt) el.donutHighCnt.textContent = data.highCnt;
    if (el.donutHighPct) el.donutHighPct.textContent = data.highPct;
    if (el.donutMedCnt) el.donutMedCnt.textContent = data.medCnt;
    if (el.donutMedPct) el.donutMedPct.textContent = data.medPct;
    if (el.donutLowCnt) el.donutLowCnt.textContent = data.lowCnt;
    if (el.donutLowPct) el.donutLowPct.textContent = data.lowPct;

    if (el.donutSegLow) {
      el.donutSegLow.setAttribute('stroke-dasharray', `${data.lowCirc} 390`);
      el.donutSegLow.setAttribute('stroke-dashoffset', '0');
    }
    if (el.donutSegMed) {
      el.donutSegMed.setAttribute('stroke-dasharray', `${data.medCirc} 390`);
      el.donutSegMed.setAttribute('stroke-dashoffset', `-${data.lowCirc}`);
    }
    if (el.donutSegHigh) {
      el.donutSegHigh.setAttribute('stroke-dasharray', `${data.highCirc} 390`);
      el.donutSegHigh.setAttribute('stroke-dashoffset', `-${data.lowCirc + data.medCirc}`);
    }
    if (el.donutSegCrit) {
      el.donutSegCrit.setAttribute('stroke-dasharray', `${data.critCirc} 390`);
      el.donutSegCrit.setAttribute('stroke-dashoffset', `-${data.lowCirc + data.medCirc + data.highCirc}`);
    }
  }

  // =========================================================================
  // PAGE 8: SETTINGS LOCALSTORAGE PERSISTENCE ENGINE
  // =========================================================================
  const SETTINGS_STORAGE_KEY = 'zerosight_settings';

  function saveSettingsToStorage() {
    const settings = {
      threshold: el.sliderThreshold ? el.sliderThreshold.value : '85',
      presetLabel: el.settingPresetLabel ? el.settingPresetLabel.textContent : 'Balanced Baseline',
      autoQuarantine: el.switchAutoQuarantine ? el.switchAutoQuarantine.checked : true,
      modelEngine: el.selectModelEngine ? el.selectModelEngine.value : 'autoencoder',
      containmentPolicy: el.selectContainmentPolicy ? el.selectContainmentPolicy.value : 'contain-critical',
      soundChime: el.switchSound ? el.switchSound.checked : true,
      feedbackLoop: el.switchFeedback ? el.switchFeedback.checked : true,
      webhookUrl: el.inputWebhookUrl ? el.inputWebhookUrl.value.trim() : 'https://siem.internal.corp/api/v2/zeroday-events',
      logFormat: el.selectLogFormat ? el.selectLogFormat.value : 'json',
      chanSplunk: el.chkChanSplunk ? el.chkChanSplunk.checked : true,
      chanPagerduty: el.chkChanPagerduty ? el.chkChanPagerduty.checked : true,
      chanEmail: el.chkChanEmail ? el.chkChanEmail.checked : true,
      timeout: el.selectTimeout ? el.selectTimeout.value : '30',
      retention: el.selectRetention ? el.selectRetention.value : '90',
      cardStyle: state.cardStyle
    };

    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      showToast(`Configuration saved successfully to local persistent state! Threshold: ${settings.threshold} | Engine: ${settings.modelEngine}`);
    } catch (e) {
      showToast('Configuration applied for active session.');
    }
  }

  function loadSettingsFromStorage() {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!saved) return;
      const s = JSON.parse(saved);

      if (s.threshold && el.sliderThreshold) {
        el.sliderThreshold.value = s.threshold;
        if (el.valThreshold) el.valThreshold.textContent = s.threshold;
        if (el.settingPresetLabel && s.presetLabel) el.settingPresetLabel.textContent = s.presetLabel;

        if (el.presetButtons) {
          el.presetButtons.forEach(btn => {
            if (btn.getAttribute('data-preset') === s.threshold) {
              btn.classList.add('active-preset');
            } else {
              btn.classList.remove('active-preset');
            }
          });
        }
      }

      if (el.switchAutoQuarantine && typeof s.autoQuarantine === 'boolean') {
        el.switchAutoQuarantine.checked = s.autoQuarantine;
      }
      if (el.selectModelEngine && s.modelEngine) {
        el.selectModelEngine.value = s.modelEngine;
      }
      if (el.selectContainmentPolicy && s.containmentPolicy) {
        el.selectContainmentPolicy.value = s.containmentPolicy;
      }
      if (el.switchSound && typeof s.soundChime === 'boolean') {
        el.switchSound.checked = s.soundChime;
      }
      if (el.switchFeedback && typeof s.feedbackLoop === 'boolean') {
        el.switchFeedback.checked = s.feedbackLoop;
      }
      if (el.inputWebhookUrl && s.webhookUrl) {
        el.inputWebhookUrl.value = s.webhookUrl;
      }
      if (el.selectLogFormat && s.logFormat) {
        el.selectLogFormat.value = s.logFormat;
      }
      if (el.selectTimeout && s.timeout) {
        el.selectTimeout.value = s.timeout;
      }
      if (el.selectRetention && s.retention) {
        el.selectRetention.value = s.retention;
      }
      if (s.cardStyle) {
        setCardStyle(s.cardStyle);
      }
    } catch (e) {}
  }

  function resetSettingsToDefault() {
    try {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
    } catch (e) {}

    if (el.sliderThreshold) {
      el.sliderThreshold.value = '85';
      el.sliderThreshold.dispatchEvent(new Event('input'));
    }
    if (el.switchAutoQuarantine) el.switchAutoQuarantine.checked = true;
    if (el.selectModelEngine) el.selectModelEngine.value = 'autoencoder';
    if (el.selectContainmentPolicy) el.selectContainmentPolicy.value = 'contain-critical';
    if (el.switchSound) el.switchSound.checked = true;
    if (el.switchFeedback) el.switchFeedback.checked = true;
    if (el.inputWebhookUrl) el.inputWebhookUrl.value = 'https://siem.internal.corp/api/v2/zeroday-events';
    if (el.selectLogFormat) el.selectLogFormat.value = 'json';
    if (el.selectTimeout) el.selectTimeout.value = '30';
    if (el.selectRetention) el.selectRetention.value = '90';
    setCardStyle('white');

    showToast('Settings restored to ZeroSight SOC default parameters.');
  }

  // =========================================================================
  // PAGE 9: SUPPORT TICKETS ENGINE
  // =========================================================================
  const TICKETS_STORAGE_KEY = 'zerosight_tickets';
  const SIM_HISTORY_STORAGE_KEY = 'zerosight_sim_history';

  function loadTicketsFromStorage() {
    try {
      const saved = localStorage.getItem(TICKETS_STORAGE_KEY);
      if (saved) {
        state.tickets = JSON.parse(saved);
      } else {
        state.tickets = [...DEFAULT_TICKETS];
      }
    } catch (e) {
      state.tickets = [...DEFAULT_TICKETS];
    }
  }

  function loadSimHistoryFromStorage() {
    try {
      const saved = localStorage.getItem(SIM_HISTORY_STORAGE_KEY);
      if (saved) {
        state.simHistory = JSON.parse(saved);
      } else {
        state.simHistory = [...DEFAULT_SIM_HISTORY];
      }
    } catch (e) {
      state.simHistory = [...DEFAULT_SIM_HISTORY];
    }
  }

  function renderTicketsHistory() {
    if (!el.ticketHistoryTbody) return;
    if (state.tickets.length === 0) {
      el.ticketHistoryTbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 24px; color: var(--card-text-muted);">
            No demonstration support tickets submitted yet.
          </td>
        </tr>
      `;
      return;
    }

    el.ticketHistoryTbody.innerHTML = state.tickets.map(ticket => `
      <tr>
        <td class="font-mono text-bold text-orange">${ticket.refId}</td>
        <td class="text-muted">${ticket.date}</td>
        <td>${ticket.category}</td>
        <td><span class="severity-tag tag-${ticket.priority.toLowerCase()}">${ticket.priority}</span></td>
        <td><strong>${ticket.subject}</strong></td>
        <td><span class="status-pill status-quarantined">${ticket.status}</span></td>
      </tr>
    `).join('');
  }

  // =========================================================================
  // INITIALIZE EVENT LISTENERS
  // =========================================================================
  function initEvents() {
    // 1. Welcome Screen -> Login Screen
    if (el.btnWelcomeNext) {
      el.btnWelcomeNext.addEventListener('click', () => {
        navigateTo('login');
      });
    }

    // 2. Login Screen
    // Password visibility toggle
    if (el.btnTogglePassword) {
      el.btnTogglePassword.addEventListener('click', () => {
        const isPassword = el.inputPassword.type === 'password';
        el.inputPassword.type = isPassword ? 'text' : 'password';
        el.iconEye.classList.toggle('hidden', isPassword);
        el.iconEyeOff.classList.toggle('hidden', !isPassword);
      });
    }

    // Role selection options
    el.roleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        el.roleButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        state.user.role = btn.getAttribute('data-role');
      });

      btn.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          btn.click();
        }
      });
    });

    // Form submission
    if (el.formLogin) {
      el.formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameVal = el.inputUsername.value.trim() || 'Alex Mercer';
        state.user.name = usernameVal;
        state.user.isLoggedIn = true;

        // Compute initials
        const parts = usernameVal.split(' ').filter(Boolean);
        state.user.initials = parts.length > 1
          ? (parts[0][0] + parts[1][0]).toUpperCase()
          : (parts[0] ? parts[0].substring(0, 2).toUpperCase() : 'AM');

        // Update displays
        if (el.userDisplayName) el.userDisplayName.textContent = state.user.name;
        if (el.userDisplayRole) el.userDisplayRole.textContent = state.user.role;
        if (el.userAvatar) el.userAvatar.textContent = state.user.initials;
        if (el.topbarUserAvatar) el.topbarUserAvatar.textContent = state.user.initials;
        el.dynUserName.forEach(elem => elem.textContent = state.user.name);

        showToast(`Authenticated as ${state.user.role}: ${state.user.name}`);
        navigateTo('dashboard');
      });
    }

    // 3. Navigation
    el.navItems.forEach(item => {
      item.addEventListener('click', () => {
        const dest = item.getAttribute('data-nav');
        if (dest) navigateTo(dest);
      });
    });

    if (el.btnSidebarSimulator) {
      el.btnSidebarSimulator.addEventListener('click', () => {
        navigateTo('simulator');
      });
    }

    if (el.btnLogout) {
      el.btnLogout.addEventListener('click', () => {
        state.user.isLoggedIn = false;
        showToast('Signed out of ZeroSight SOC session.');
        navigateTo('login');
      });
    }

    // Mobile Hamburger
    if (el.btnMobileMenu) el.btnMobileMenu.addEventListener('click', openMobileSidebar);
    if (el.btnSidebarClose) el.btnSidebarClose.addEventListener('click', closeMobileSidebar);
    if (el.sidebarBackdrop) el.sidebarBackdrop.addEventListener('click', closeMobileSidebar);

    // Stationary Header Alert Button
    if (el.btnTopbarAlerts) {
      el.btnTopbarAlerts.addEventListener('click', () => {
        navigateTo('alerts');
      });
    }

    // Card style toggle button (Top bar)
    if (el.btnToggleCardStyle) {
      el.btnToggleCardStyle.addEventListener('click', () => {
        const nextStyle = state.cardStyle === 'white' ? 'dark' : 'white';
        setCardStyle(nextStyle);
        showToast(`Switched card theme to: ${nextStyle === 'white' ? '30% Pure White' : 'Dark Stealth'}`);
      });
    }

    // Settings Theme Buttons
    if (el.btnThemeWhite) {
      el.btnThemeWhite.addEventListener('click', () => {
        setCardStyle('white');
        showToast('Active Theme: 30% Pure White Cards');
      });
    }

    if (el.btnThemeDark) {
      el.btnThemeDark.addEventListener('click', () => {
        setCardStyle('dark');
        showToast('Active Theme: Dark Stealth Panels');
      });
    }

    // Dashboard Time-Range Event Listeners
    if (el.selectChartTimeRange) {
      el.selectChartTimeRange.addEventListener('change', (e) => {
        updateDashboardCharts(e.target.value);
        showToast(`Alerts Over Time updated for: ${e.target.options[e.target.selectedIndex].text}`);
      });
    }

    if (el.selectRiskTimeRange) {
      el.selectRiskTimeRange.addEventListener('change', (e) => {
        updateDashboardDonut(e.target.value);
        showToast(`Risk Breakdown updated for: ${e.target.options[e.target.selectedIndex].text}`);
      });
    }

    // Dashboard Links
    if (el.linkViewAllAlerts) {
      el.linkViewAllAlerts.addEventListener('click', () => navigateTo('alerts'));
    }

    if (el.linkViewAllQuality) {
      el.linkViewAllQuality.addEventListener('click', () => navigateTo('reports'));
    }

    if (el.btnInsightsReport) {
      el.btnInsightsReport.addEventListener('click', () => navigateTo('reports'));
    }

    // 4. Alerts Queue Controls & Filters
    if (el.filterPills) {
      el.filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
          el.filterPills.forEach(p => p.classList.remove('active-pill'));
          pill.classList.add('active-pill');
          state.alertsFilter.severity = pill.getAttribute('data-severity') || 'all';
          renderAlertsQueue();
        });
      });
    }

    if (el.selectCategoryFilter) {
      el.selectCategoryFilter.addEventListener('change', (e) => {
        state.alertsFilter.category = e.target.value;
        renderAlertsQueue();
      });
    }

    if (el.selectStatusFilter) {
      el.selectStatusFilter.addEventListener('change', (e) => {
        state.alertsFilter.status = e.target.value;
        renderAlertsQueue();
      });
    }

    if (el.selectSortAlerts) {
      el.selectSortAlerts.addEventListener('change', (e) => {
        state.alertsFilter.sortBy = e.target.value;
        renderAlertsQueue();
      });
    }

    if (el.inputAlertsFilter) {
      el.inputAlertsFilter.addEventListener('input', (e) => {
        state.alertsFilter.query = e.target.value.trim();
        renderAlertsQueue();
      });
    }

    if (el.btnRefreshAlerts) {
      el.btnRefreshAlerts.addEventListener('click', () => {
        renderAlertsQueue();
        showToast(`Synchronized threat alerts queue (${state.alerts.length} neural anomalies verified).`);
      });
    }

    // Investigate button on Alerts Queue Table
    document.addEventListener('click', (e) => {
      const btnQueue = e.target.closest('.btn-queue-investigate');
      if (btnQueue) {
        const alertId = parseInt(btnQueue.getAttribute('data-alert-id') || '1', 10);
        state.selectedAlertId = alertId;
        navigateTo('alert-details');
      }
    });

    // Recent alert items in Dashboard
    const alertItems = document.querySelectorAll('.alert-list-item');
    alertItems.forEach(item => {
      item.addEventListener('click', () => {
        const id = parseInt(item.getAttribute('data-alert-id'), 10);
        if (id) {
          state.selectedAlertId = id;
          navigateTo('alert-details');
        }
      });
    });

    // Bar chart hover
    el.chartBars.forEach(bar => {
      bar.addEventListener('mouseenter', () => {
        el.chartBars.forEach(b => b.classList.remove('active-bar'));
        bar.classList.add('active-bar');

        const hour = bar.getAttribute('data-hour');
        const val = bar.getAttribute('data-val');
        if (el.chartTooltip) {
          el.chartTooltip.textContent = `${hour}:00 | ${val} alerts`;
          const offsetLeft = bar.offsetLeft + (bar.offsetWidth / 2);
          el.chartTooltip.style.left = `${offsetLeft}px`;
        }
      });
    });

    // 5. Alert Details
    if (el.btnBackToDashboard) {
      el.btnBackToDashboard.addEventListener('click', () => navigateTo('alerts'));
    }

    if (el.crumbAlertsRoot) {
      el.crumbAlertsRoot.addEventListener('click', () => navigateTo('alerts'));
    }

    if (el.btnMarkFalseAlarm) {
      el.btnMarkFalseAlarm.addEventListener('click', () => {
        const alert = state.alerts.find(a => a.id === state.selectedAlertId);
        if (alert) {
          alert.isFalseAlarm = !alert.isFalseAlarm;
          renderAlertDetails();
          showToast(alert.isFalseAlarm
            ? `Alert ${alert.id} flagged as False Alarm. Logged to model retraining feedback loop.`
            : `False alarm flag removed from Alert ${alert.id}.`
          );
        }
      });
    }

    // 6. Zero-Day Simulator
    if (el.selectAttackType) {
      el.selectAttackType.addEventListener('change', (e) => {
        state.simulator.attackType = e.target.value;
        const scenario = state.simulator.scenarios[state.simulator.attackType] || { name: state.simulator.attackType };
        if (el.simulatorModelStatus) {
          el.simulatorModelStatus.textContent = `The model has never seen ${scenario.name}.`;
        }
        if (el.simBannerDesc) {
          el.simBannerDesc.textContent = `The model was trained without any ${scenario.name} traffic.`;
        }
      });
    }

    if (el.btnLaunchAttack) {
      el.btnLaunchAttack.addEventListener('click', () => {
        if (state.simulator.isSimulating) return;
        state.simulator.isSimulating = true;

        const currentScenario = state.simulator.scenarios[state.simulator.attackType] || {
          name: state.simulator.attackType,
          pkts: 40,
          caught: 32,
          score: 85,
          reason: 'Unseen zero-day behavioral anomaly'
        };

        el.btnLaunchAttack.disabled = true;
        el.btnLaunchAttack.innerHTML = `
          <svg class="radar-spin" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.3"></circle>
            <path d="M12 2a10 10 0 0 1 10 10"></path>
          </svg>
          <span>Injecting ${currentScenario.name}...</span>
        `;

        showToast(`Injecting synthetic unseen ${currentScenario.name} packets into DPDK pipeline...`);

        setTimeout(() => {
          state.simulator.launched += currentScenario.pkts;
          state.simulator.caught += currentScenario.caught;
          state.simulator.rate = Math.round((state.simulator.caught / state.simulator.launched) * 100);

          renderSimulator();

          // Prepend a live simulated alert to the feed table
          const now = new Date();
          const timeStr = now.toTimeString().split(' ')[0];
          const randomOctet = Math.floor(Math.random() * 200) + 10;
          const fakeIp = `198.51.${randomOctet}.${Math.floor(Math.random() * 250) + 2}`;

          const newRow = document.createElement('tr');
          newRow.style.backgroundColor = 'rgba(255, 111, 50, 0.15)';
          newRow.innerHTML = `
            <td class="code-font">${timeStr}</td>
            <td class="code-font">${fakeIp}</td>
            <td><span class="table-score">${currentScenario.score}</span></td>
            <td><span class="severity-tag ${currentScenario.score >= 80 ? 'tag-critical' : 'tag-high'}">${currentScenario.score >= 80 ? 'Critical' : 'High'}</span></td>
            <td class="table-reason">${currentScenario.reason}</td>
          `;

          if (el.simTableBody) {
            el.simTableBody.insertBefore(newRow, el.simTableBody.firstChild);
            setTimeout(() => {
              newRow.style.backgroundColor = '';
              newRow.style.transition = 'background-color 1.5s ease';
            }, 1000);
          }

          if (el.feedCountBadge && el.simTableBody) {
            el.feedCountBadge.textContent = `${el.simTableBody.children.length} recent detections`;
          }

          // Record run into history
          const trialCatchRate = Math.round((currentScenario.caught / currentScenario.pkts) * 100);
          const historyEntry = {
            timestamp: timeStr,
            scenario: currentScenario.name,
            injected: currentScenario.pkts,
            intercepted: currentScenario.caught,
            rate: `${trialCatchRate}%`,
            verdict: `Caught (${trialCatchRate}%)`,
            statusClass: 'verdict-caught'
          };
          state.simHistory.unshift(historyEntry);
          try {
            localStorage.setItem(SIM_HISTORY_STORAGE_KEY, JSON.stringify(state.simHistory));
          } catch (e) {}
          renderSimHistory();

          // Reset button
          el.btnLaunchAttack.disabled = false;
          el.btnLaunchAttack.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>Launch unseen attack</span>
          `;
          state.simulator.isSimulating = false;

          showToast(`Simulation trial complete! ZeroSight caught ${currentScenario.caught}/${currentScenario.pkts} (${trialCatchRate}%) unseen ${currentScenario.name} probes.`);
        }, 1200);
      });
    }

    if (el.btnSimReset) {
      el.btnSimReset.addEventListener('click', () => {
        state.simulator.launched = 500;
        state.simulator.caught = 410;
        state.simulator.rate = 82;
        renderSimulator();
        showToast('Simulator restored to baseline parameters (500 launched, 82% caught).');
      });
    }

    if (el.btnClearSimHistory) {
      el.btnClearSimHistory.addEventListener('click', () => {
        state.simHistory = [];
        try {
          localStorage.removeItem(SIM_HISTORY_STORAGE_KEY);
        } catch (e) {}
        renderSimHistory();
        showToast('Simulation trial history cleared.');
      });
    }

    if (el.btnSimReport) {
      el.btnSimReport.addEventListener('click', () => navigateTo('reports'));
    }

    // 7. Settings Controls
    if (el.sliderThreshold && el.valThreshold) {
      el.sliderThreshold.addEventListener('input', (e) => {
        const val = e.target.value;
        el.valThreshold.textContent = val;

        if (el.presetButtons) {
          el.presetButtons.forEach(btn => {
            if (btn.getAttribute('data-preset') === val) {
              btn.classList.add('active-preset');
            } else {
              btn.classList.remove('active-preset');
            }
          });
        }

        if (el.settingPresetLabel) {
          if (val === '75') el.settingPresetLabel.textContent = 'Conservative';
          else if (val === '85') el.settingPresetLabel.textContent = 'Standard';
          else if (val === '95') el.settingPresetLabel.textContent = 'Aggressive';
          else el.settingPresetLabel.textContent = 'Custom';
        }
      });
    }

    if (el.presetButtons) {
      el.presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const pVal = btn.getAttribute('data-preset');
          if (el.sliderThreshold) {
            el.sliderThreshold.value = pVal;
            el.sliderThreshold.dispatchEvent(new Event('input'));
          }
          el.presetButtons.forEach(b => b.classList.remove('active-preset'));
          btn.classList.add('active-preset');
        });
      });
    }

    if (el.btnTestWebhook) {
      el.btnTestWebhook.addEventListener('click', () => {
        const url = el.inputWebhookUrl ? el.inputWebhookUrl.value.trim() : '';
        if (!url) {
          showToast('Please enter a valid SIEM Webhook URL.');
          return;
        }
        el.btnTestWebhook.textContent = 'Pinging...';
        el.btnTestWebhook.disabled = true;

        setTimeout(() => {
          el.btnTestWebhook.textContent = 'Test Webhook';
          el.btnTestWebhook.disabled = false;
          showToast(`SIEM Webhook OK: 200 Received (Latency 14ms) from ${url.substring(0, 32)}...`);
        }, 800);
      });
    }

    if (el.btnSaveSettings) {
      el.btnSaveSettings.addEventListener('click', saveSettingsToStorage);
    }

    if (el.btnResetSettings) {
      el.btnResetSettings.addEventListener('click', resetSettingsToDefault);
    }

    // 8. Reports Export & Search
    if (el.btnExportReport) {
      el.btnExportReport.addEventListener('click', () => {
        if (el.modalReportExport) {
          el.modalReportExport.classList.add('active');
          el.modalReportExport.setAttribute('aria-hidden', 'false');
        }
      });
    }

    if (el.btnModalReportClose) {
      el.btnModalReportClose.addEventListener('click', () => {
        if (el.modalReportExport) {
          el.modalReportExport.classList.remove('active');
          el.modalReportExport.setAttribute('aria-hidden', 'true');
        }
      });
    }

    if (el.modalReportExport) {
      el.modalReportExport.addEventListener('click', (e) => {
        if (e.target === el.modalReportExport) {
          el.modalReportExport.classList.remove('active');
          el.modalReportExport.setAttribute('aria-hidden', 'true');
        }
      });
    }

    if (el.btnModalPrint) {
      el.btnModalPrint.addEventListener('click', () => {
        window.print();
      });
    }

    function downloadReportJson() {
      const reportData = {
        platform: 'ZeroSight Enterprise Threat Detection',
        reportDate: new Date().toISOString(),
        auditor: state.user.name,
        role: state.user.role,
        summary: {
          zeroDayCatchRate: '82.4%',
          meanTimeToDetect: '4.2s',
          autonomousMitigations: '9/9 (100%)',
          accuracy: '96.8%',
          precision: '94.2%',
          recall: '91.5%',
          f1Score: '92.8%',
          rocAuc: 0.978
        },
        attackDetectionAnalysis: [
          { vector: 'DDoS Flood', tested: 500, caught: 410, catchRate: '82.4%', avgRisk: 92, latency: '3.8ms', status: 'High Generalization' },
          { vector: 'WebAttack SQLi', tested: 200, caught: 177, catchRate: '88.5%', avgRisk: 81, latency: '4.1ms', status: 'Confirmed Pattern' },
          { vector: 'PortScan Recon', tested: 500, caught: 370, catchRate: '74.0%', avgRisk: 64, latency: '2.9ms', status: 'Active Containment' },
          { vector: 'Benign Traffic', tested: 14300, caught: 14210, catchRate: '99.4%', avgRisk: 8, latency: '1.8ms', status: 'Baseline Stable' }
        ],
        alertsAudited: state.alerts.map(a => ({
          id: `Alert ${a.id}`,
          vector: a.type,
          ip: a.ip,
          score: a.score,
          status: a.status
        }))
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ZeroSight_Threat_Report_Nov9_2026.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('ZeroSight threat audit report downloaded as JSON.');
    }

    if (el.btnExportJson) el.btnExportJson.addEventListener('click', downloadReportJson);
    if (el.btnModalDlJson) el.btnModalDlJson.addEventListener('click', downloadReportJson);

    if (el.inputAuditSearch && el.auditTableBody) {
      el.inputAuditSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const rows = el.auditTableBody.querySelectorAll('tr');
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(query) ? '' : 'none';
        });
      });
    }

    document.addEventListener('click', (e) => {
      const btnInspect = e.target.closest('.btn-audit-inspect');
      if (btnInspect) {
        const alertId = parseInt(btnInspect.getAttribute('data-alert-id') || '1', 10);
        state.selectedAlertId = alertId;
        navigateTo('alert-details');
      }
    });

    // 9. Support Center Controls
    if (el.btnHeaderContactScroll) {
      el.btnHeaderContactScroll.addEventListener('click', () => {
        const secContact = document.getElementById('section-contact-support');
        if (secContact) {
          secContact.scrollIntoView({ behavior: 'smooth' });
          if (el.ticketSubject) setTimeout(() => el.ticketSubject.focus(), 400);
        }
      });
    }

    if (el.faqItems) {
      el.faqItems.forEach(item => {
        const qBtn = item.querySelector('.faq-question');
        if (qBtn) {
          qBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            el.faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
          });
        }
      });
    }

    // Diagnostic Self-Check
    if (el.btnRunDiagnostics && el.diagnosticsTerminal) {
      el.btnRunDiagnostics.addEventListener('click', () => {
        el.btnRunDiagnostics.disabled = true;
        el.btnRunDiagnostics.innerHTML = `<span>Checking...</span>`;
        el.diagnosticsTerminal.innerHTML = `
          <div class="term-line term-highlight">[+] ZeroSight Diagnostic Subsystem v2.6.4 initialized...</div>
        `;

        const steps = [
          { text: '[✓] Subsystem 1/5: Ingress Packet Pipeline (DPDK 10Gbps line-rate) -> NOMINAL (0 dropped packets)', delay: 400, cls: 'term-success' },
          { text: '[✓] Subsystem 2/5: Deep Autoencoder Generalizer -> 3.2ms latency (Within <5ms SLA)', delay: 900, cls: 'term-success' },
          { text: '[✓] Subsystem 3/5: SIEM HTTPS Webhook Endpoint -> 200 OK (14ms roundtrip)', delay: 1400, cls: 'term-success' },
          { text: '[✓] Subsystem 4/5: Neural Feature Store & Circular Buffer -> 2.1GB / 16GB allocated', delay: 1900, cls: 'term-success' },
          { text: '[✓] Subsystem 5/5: Model Weights Signature -> SHA256 VALIDATED [7f8a92b1...e450]', delay: 2400, cls: 'term-success' },
          { text: '[★] HEALTH VERDICT: ALL SYSTEMS OPTIMAL (0 errors, 0 warnings)', delay: 2800, cls: 'term-highlight' }
        ];

        steps.forEach(step => {
          setTimeout(() => {
            const line = document.createElement('div');
            line.className = `term-line ${step.cls}`;
            line.textContent = step.text;
            el.diagnosticsTerminal.appendChild(line);
            el.diagnosticsTerminal.scrollTop = el.diagnosticsTerminal.scrollHeight;
          }, step.delay);
        });

        setTimeout(() => {
          el.btnRunDiagnostics.disabled = false;
          el.btnRunDiagnostics.innerHTML = `
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            <span>Run Diagnostics</span>
          `;
          showToast('Diagnostic self-check complete: All systems operational.');
        }, 3000);
      });
    }

    // Support Form Submission & Validation
    if (el.formSupportTicket) {
      el.formSupportTicket.addEventListener('submit', (e) => {
        e.preventDefault();
        const subject = el.ticketSubject ? el.ticketSubject.value.trim() : '';
        const desc = el.ticketDesc ? el.ticketDesc.value.trim() : '';
        const category = el.ticketCategory ? el.ticketCategory.options[el.ticketCategory.selectedIndex].text : 'General';
        const priority = el.ticketPriority ? el.ticketPriority.value : 'medium';

        // Client-side Validation
        if (!subject || subject.length < 5) {
          showToast('Please provide a descriptive subject (at least 5 characters).', 'warning');
          if (el.ticketSubject) el.ticketSubject.focus();
          return;
        }

        if (!desc || desc.length < 10) {
          showToast('Please detail the steps and observations in the description (at least 10 characters).', 'warning');
          if (el.ticketDesc) el.ticketDesc.focus();
          return;
        }

        const now = new Date();
        const dateStr = `Nov 9, ${now.toTimeString().split(' ')[0]}`;
        const refId = `ZS-TICKET-${Math.floor(10000 + Math.random() * 90000)}`;

        const newTicket = {
          refId: refId,
          date: dateStr,
          category: category,
          priority: priority.charAt(0).toUpperCase() + priority.slice(1),
          subject: subject,
          status: 'Open - Under Investigation'
        };

        state.tickets.unshift(newTicket);
        try {
          localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(state.tickets));
        } catch (e) {}

        if (el.ticketRefId) el.ticketRefId.textContent = refId;
        if (el.ticketSuccessPanel) el.ticketSuccessPanel.classList.remove('hidden');
        el.formSupportTicket.style.display = 'none';

        renderTicketsHistory();
        showToast(`Support Ticket ${refId} created! Priority: ${priority.toUpperCase()}`);
      });
    }

    if (el.btnTicketCreateAnother) {
      el.btnTicketCreateAnother.addEventListener('click', () => {
        if (el.formSupportTicket) {
          el.formSupportTicket.reset();
          el.formSupportTicket.style.display = '';
        }
        if (el.ticketSuccessPanel) el.ticketSuccessPanel.classList.add('hidden');
      });
    }

    if (el.btnClearTickets) {
      el.btnClearTickets.addEventListener('click', () => {
        state.tickets = [];
        try {
          localStorage.removeItem(TICKETS_STORAGE_KEY);
        } catch (e) {}
        renderTicketsHistory();
        showToast('Support ticket demonstration history cleared.');
      });
    }

    // Documentation Modal Playbooks
    const documentationPlaybooks = {
      'getting-started': {
        title: 'Getting Started with ZeroSight SOC',
        subtitle: 'Operational Guide • Layout & Triage Fundamentals',
        content: `
          <h4 style="font-size:14px; font-weight:800; margin-bottom:8px; color:var(--primary-black);">1. Workspace Architecture & Layout</h4>
          <p style="font-size:13px; color:#444; line-height:1.6; margin-bottom:14px;">ZeroSight is structured using the official <strong>60-30-10 Brand Layout</strong>: 60% Primary Black (<code>#0C0C0C</code>) background, 30% Pure White (<code>#FFFFFF</code>) contrast dashboard cards, and 10% Signature Orange (<code>#FF6F32</code>) action indicators. Use the sidebar to navigate between Dashboard, Alerts, Simulator, Reports, Settings, and Support.</p>
          <h4 style="font-size:14px; font-weight:800; margin-bottom:8px; color:var(--primary-black);">2. Live Alert Triaging</h4>
          <p style="font-size:13px; color:#444; line-height:1.6; margin-bottom:14px;">The SOC Dashboard surfaces critical anomalies immediately. Alerts are ordered by severity (Critical &ge; 80, High &ge; 60, Medium &ge; 40). Clicking any alert row opens the forensic breakdown showing root-cause signals and step-by-step mitigation playbooks.</p>
          <h4 style="font-size:14px; font-weight:800; margin-bottom:8px; color:var(--primary-black);">3. Unseen Attack Simulator</h4>
          <p style="font-size:13px; color:#444; line-height:1.6;">To validate detector efficacy before adversarial attacks occur, use the built-in Simulator to stream synthetic zero-day payloads directly across your network taps.</p>
        `
      },
      'threat-alerts': {
        title: 'Understanding Threat Alerts & Risk Scores',
        subtitle: 'Forensic Guide • Anomaly Root Cause & Signal Decomposition',
        content: `
          <h4 style="font-size:14px; font-weight:800; margin-bottom:8px; color:var(--primary-black);">1. The ZeroSight 0–100 Risk Score</h4>
          <p style="font-size:13px; color:#444; line-height:1.6; margin-bottom:14px;">Unlike conventional binary rule matches, ZeroSight computes a probabilistic anomaly confidence metric scaled 0 to 100. Any score exceeding <strong>80</strong> indicates severe structural deviation consistent with an active intrusion.</p>
          <h4 style="font-size:14px; font-weight:800; margin-bottom:8px; color:var(--primary-black);">2. Neural Signal Contributions</h4>
          <p style="font-size:13px; color:#444; line-height:1.6; margin-bottom:14px;">Every alert decomposes composite risk into explainable dimensions:</p>
          <ul style="font-size:13px; color:#444; line-height:1.6; margin-left:20px; margin-bottom:14px;">
            <li><strong>Packet Rate Anomaly:</strong> Instantaneous surge against rolling 15-minute host baselines (e.g., 40x volume spikes).</li>
            <li><strong>Destination Port Entropy:</strong> Unusual target socket transitions or reconnaissance probing.</li>
            <li><strong>Connection Symmetry:</strong> Short, asymmetric burst patterns typical of automated botnets or exploit runners.</li>
          </ul>
          <h4 style="font-size:14px; font-weight:800; margin-bottom:8px; color:var(--primary-black);">3. Immediate Containment</h4>
          <p style="font-size:13px; color:#444; line-height:1.6;">Automated playbooks enforce perimeter drops, host isolation, and forensic packet logging with a single click.</p>
        `
      },
      'simulator': {
        title: 'Using the Zero-Day Attack Simulator',
        subtitle: 'Validation Guide • Synthetic Stress-Testing & Neural Generalization',
        content: `
          <h4 style="font-size:14px; font-weight:800; margin-bottom:8px; color:var(--primary-black);">1. Why Simulate Unseen Attacks?</h4>
          <p style="font-size:13px; color:#444; line-height:1.6; margin-bottom:14px;">Machine learning models often overfit to known attack signatures. ZeroSight's neural architecture is built for <em>unsupervised generalization</em>—catching attack patterns that were completely absent from its training corpus.</p>
          <h4 style="font-size:14px; font-weight:800; margin-bottom:8px; color:var(--primary-black);">2. Running an Attack Injection</h4>
          <ol style="font-size:13px; color:#444; line-height:1.6; margin-left:20px; margin-bottom:14px;">
            <li>Navigate to the <strong>Simulator</strong> in the sidebar.</li>
            <li>Select the target threat vector: <code>DDoS</code>, <code>WebAttack</code>, or <code>PortScan</code>.</li>
            <li>Click <strong>Launch unseen attack</strong> to transmit a burst of synthetic probe packets.</li>
            <li>Inspect the live detection table and SVG donut chart as the model intercepts the stream in real time.</li>
          </ol>
          <h4 style="font-size:14px; font-weight:800; margin-bottom:8px; color:var(--primary-black);">3. Interpreting the Catch Rate</h4>
          <p style="font-size:13px; color:#444; line-height:1.6;">A catch rate above 80% on completely unseen attack topologies demonstrates state-of-the-art anomaly generalizability.</p>
        `
      },
      'metrics': {
        title: 'Understanding Detection Metrics',
        subtitle: 'Statistical Reference • Evaluating AI in Cybersecurity',
        content: `
          <h4 style="font-size:14px; font-weight:800; margin-bottom:8px; color:var(--primary-black);">1. Precision vs. Recall in SOC Operations</h4>
          <p style="font-size:13px; color:#444; line-height:1.6; margin-bottom:14px;">In cybersecurity AI, optimizing one metric at the expense of another creates critical vulnerabilities:</p>
          <ul style="font-size:13px; color:#444; line-height:1.6; margin-left:20px; margin-bottom:14px;">
            <li><strong>High Recall (91.5% in ZeroSight):</strong> Ensures genuine attacks are intercepted before lateral movement occurs.</li>
            <li><strong>High Precision (94.2% in ZeroSight):</strong> Ensures analysts are not flooded with benign false alarms.</li>
            <li><strong>F1 Score (92.8%):</strong> The harmonic mean reflecting optimal operational balance.</li>
          </ul>
          <h4 style="font-size:14px; font-weight:800; margin-bottom:8px; color:var(--primary-black);">2. Mean Time to Detect (MTTD)</h4>
          <p style="font-size:13px; color:#444; line-height:1.6; margin-bottom:14px;">ZeroSight achieves an average MTTD of <strong>4.2 seconds</strong>, providing sub-second anomaly recognition and real-time containment triggering.</p>
          <h4 style="font-size:14px; font-weight:800; margin-bottom:8px; color:var(--primary-black);">3. ROC-AUC (0.978)</h4>
          <p style="font-size:13px; color:#444; line-height:1.6;">The Area Under the Receiver Operating Characteristic curve demonstrates near-perfect discrimination between anomalous intrusion patterns and standard business traffic.</p>
        `
      }
    };

    if (el.btnReadGuides) {
      el.btnReadGuides.forEach(btn => {
        btn.addEventListener('click', () => {
          const guideKey = btn.getAttribute('data-guide');
          const playbook = documentationPlaybooks[guideKey];
          if (playbook && el.modalDocViewer) {
            if (el.docModalTitle) el.docModalTitle.textContent = playbook.title;
            if (el.docModalSubtitle) el.docModalSubtitle.textContent = playbook.subtitle;
            if (el.docModalBody) el.docModalBody.innerHTML = playbook.content;
            el.modalDocViewer.classList.add('active');
            el.modalDocViewer.setAttribute('aria-hidden', 'false');
          }
        });
      });
    }

    if (el.btnModalDocClose) {
      el.btnModalDocClose.addEventListener('click', () => {
        if (el.modalDocViewer) {
          el.modalDocViewer.classList.remove('active');
          el.modalDocViewer.setAttribute('aria-hidden', 'true');
        }
      });
    }

    if (el.modalDocViewer) {
      el.modalDocViewer.addEventListener('click', (e) => {
        if (e.target === el.modalDocViewer) {
          el.modalDocViewer.classList.remove('active');
          el.modalDocViewer.setAttribute('aria-hidden', 'true');
        }
      });
    }

    // Sidebar search
    if (el.sidebarSearchInput) {
      el.sidebarSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const q = el.sidebarSearchInput.value.trim();
          if (q) {
            state.alertsFilter.query = q;
            if (el.inputAlertsFilter) el.inputAlertsFilter.value = q;
            showToast(`Searching threat alerts matching: "${q}"`);
            navigateTo('alerts');
          }
        }
      });
    }
  }

  // Application Lifecycle Startup
  document.addEventListener('DOMContentLoaded', () => {
    loadSettingsFromStorage();
    loadTicketsFromStorage();
    loadSimHistoryFromStorage();
    initEvents();

    // Default to 30% Pure White Cards if not already loaded from storage
    if (!state.cardStyle) {
      setCardStyle('white');
    }

    // Initial Render of data tables
    renderAlertsQueue();
    renderSimulator();
    renderSimHistory();
    renderTicketsHistory();

    // Route according to URL hash
    const hash = window.location.hash.replace('#', '').trim();
    const validViews = ['welcome', 'login', 'dashboard', 'alerts', 'alert-details', 'simulator', 'reports', 'settings', 'support'];
    if (hash && validViews.includes(hash)) {
      navigateTo(hash);
    } else {
      navigateTo('welcome'); // Starts at Page 1 (Welcome Screen)
    }
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '').trim();
    const validViews = ['welcome', 'login', 'dashboard', 'alerts', 'alert-details', 'simulator', 'reports', 'settings', 'support'];
    if (hash && validViews.includes(hash) && state.currentView !== hash) {
      navigateTo(hash);
    }
  });

})();
