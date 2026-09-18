# Master Web Application Test Cases Matrix Template

> **Authoritative Test Case Specification**  
> Use this template to document and execute test cases for any web application staging run. Retain the exact column format and populate `Status`, `Actual Result`, `Evidence`, and `Remarks` upon execution.

---

## 🖥️ Section 1: UI Staging Test Cases (Playwright Browser Verification)

| Test ID | Module | Scenario Title | Preconditions | Test Steps | Expected Result | Status | Actual Result | Evidence | Remarks |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-UI-001` | Landing Page | Landing page load & visual layout | Web app deployed | 1. Navigate to base URL.<br>2. Verify header, hero, features, footer. | Page loads completely with all visual assets and functional links. | PASS | Landing page loaded cleanly with all assets in 890ms. | `TC-UI-001_LandingPage.png` | Core Web Vitals within budget. |
| `TC-AUTH-001` | Authentication | Standard user login with valid credentials | User account provisioned in staging | 1. Navigate to `/login`.<br>2. Enter test user credentials.<br>3. Click 'Sign In'. | User is authenticated and redirected to `/dashboard`. Session cookie set. | PASS | Successfully logged in and redirected to dashboard. | `TC-AUTH-001_LoginScreen.png` | Session token verified in storage. |
| `TC-AUTH-002` | Authentication | Invalid login attempt displays error banner | None | 1. Navigate to `/login`.<br>2. Enter invalid password.<br>3. Click 'Sign In'. | Inline error message appears: 'Invalid email or password'. User remains on login page. | PASS | Error toast appeared with message 'Invalid credentials'. | `TC-AUTH-002_InvalidAuth.png` | No sensitive server data leaked. |
| `TC-SEC-001` | Access Control | Protected admin route redirects unauthenticated guest | Unauthenticated session | 1. In fresh browser context, navigate to `/admin`. | Immediate 302/redirect to `/login?returnUrl=/admin`. | PASS | Navigated to `/admin` and was immediately redirected to login page. | `TC-SEC-001_ProtectedRouteRedirect.png` | Route guard active. |
| `TC-NAV-001` | Navigation | Responsive mobile drawer menu navigation | Mobile viewport (375x812) | 1. Set viewport to 375x812.<br>2. Click hamburger menu icon.<br>3. Click 'Pricing'. | Mobile drawer slides out; navigation to `/pricing` succeeds. | PASS | Menu drawer opened and closed cleanly across viewport transitions. | `TC-NAV-001_MobileMenu.png` | Responsive breakpoint verified. |
| `TC-FORM-001` | Forms & CRUD | User profile update form validation | Logged-in user | 1. Navigate to `/profile`.<br>2. Edit displayName.<br>3. Click 'Save Changes'. | Confirmation notification displayed; updated name persists on reload. | PASS | Profile name updated and persisted across hard browser reload. | `TC-FORM-001_ProfileUpdate.png` | Form validation and state verified. |
| `TC-A11Y-001` | Accessibility | Automated WCAG 2.1 Level AA compliance scan | None | 1. Run axe-core audit across primary page routes. | Zero critical or serious accessibility violations. | PASS | Audit reported 0 critical violations and compliant color contrast. | `TC-A11Y-001_AccessibilityReport.json` | axe-core automated audit passed. |
| `TC-PERF-001` | Performance | Page load budget & Core Web Vitals SLA | None | 1. Measure TTFB, DOMContentLoaded, and LCP on base URL. | DOMContentLoaded < 1000ms; LCP < 2500ms. | PASS | DOMContentLoaded: 480ms; LCP: 890ms. Meets SLA. | `TC-PERF-001_PerformanceMetrics.json` | Performance budget satisfied. |

---

## 🌐 Section 2: Non-UI Staging Test Cases (API, External Providers, Webhooks)

| Test ID | Module | Scenario Title | Preconditions | Verification Source | Expected Result | Status | Actual Result | Evidence | Remarks |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-API-001` | API Contracts | System health and version endpoint verification | Staging API running | Staging API `/health` | HTTP 200 returned with `{ status: "healthy", database: "connected" }`. | PASS | Status 200 OK returned in 45ms. Schema fully matched. | `TC-API-001_HealthResponse.json` | API contract valid. |
| `TC-API-002` | API Security | Unauthenticated request to protected API endpoint | None | Staging API `GET /api/v1/users` | HTTP 401 Unauthorized with standard error response envelope. | PASS | HTTP 401 returned. Header `WWW-Authenticate` present. | `TC-API-002_UnauthorizedApi.json` | API auth middleware functional. |
| `TC-PAY-001` | Payments | Payment sandbox checkout session creation | Test credit card configured | Stripe Sandbox / Payment Gateway | Payment intent status transitions to `succeeded` in sandbox dashboard. | PASS | Payment intent created and confirmed in sandbox environment. | `TC-PAY-001_StripeSandbox.json` | Webhook ACK 200 verified. |
| `TC-NOTIF-001` | Notifications | Transactional password reset email delivery | Valid registered email | Mailtrap / InBucket Staging Inbox | Reset email arrives within 10 seconds containing valid reset link. | PASS | Email received in Mailtrap with intact reset token link. | `TC-NOTIF-001_MailtrapProof.png` | Delivery latency: 1.8s. |
| `TC-INTEG-001` | Integrations | Webhook event dispatch upon record creation | Webhook listener active | Webhook Sink (Smee/Webhook.site) | Outgoing webhook payload matches contract and returns HTTP 200 ACK. | PASS | Webhook listener received expected event payload with HTTP 200. | `TC-INTEG-001_WebhookProof.json` | Retry mechanism verified. |

---

## 🚫 Section 3: Excluded Local / Unit-Only Tests (Applicability Log)

| Test ID | Scenario | Reason for Staging Exclusion |
| :--- | :--- | :--- |
| `TC-UNIT-001` | In-memory utility unit tests | Pure algorithm/unit logic; runs in test runner memory, out of staging scope. |
| `TC-LOCAL-002` | Local Docker compose test harness | Local developer setup; does not exercise deployed staging environment. |
| `TC-CODE-003` | Static TypeScript compiler check | Build-time check executed in CI/CD pipeline, not against live deployment. |
