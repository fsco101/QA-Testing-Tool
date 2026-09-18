# Web Application QA Context & System Specification Template

> **Authoritative QA Specification & System Configuration**  
> This document defines the Application Under Test (AUT) profile, target system endpoints, authentication credentials, architecture, critical user journeys, and verification standards for QA and automation test suites.

---

## 🎯 1. Target Web Application System Configuration & Links

Configure this section with your target web application's environments, URLs, and documentation. All automated test runners and QA agents reference these values.

| Parameter | Configuration / URL | Notes / Instructions |
| :--- | :--- | :--- |
| **Primary Staging URL** | `https://staging.yourwebapp.com` | Primary target for automated & manual staging execution. |
| **Production / Reference URL** | `https://app.yourwebapp.com` | Read-only reference for expected baseline behavior. |
| **Public Landing / Marketing URL**| `https://yourwebapp.com` | Marketing pages, public registration, pricing tables. |
| **Authentication / Login URL** | `https://staging.yourwebapp.com/login` | Direct entry point for user and administrator login. |
| **API Base URL** | `https://api-staging.yourwebapp.com/v1` | Direct endpoint for API and non-UI integration tests. |
| **API Documentation / Swagger** | `https://api-staging.yourwebapp.com/docs` | OpenAPI / Swagger / Postman schema specifications. |
| **Source Code Repository** | `https://github.com/organization/web-app-repo` | Reference repository for sprint issues and pull requests. |
| **Issue Tracker / Sprint Board** | `https://github.com/organization/web-app-repo/issues` | Tracking GitHub Issues, sprint backlogs, and bug tickets. |
| **Target Environment** | `Staging (v2.x / Sprint Current)` | Target build version, release tag, or commit hash. |

> [!TIP]
> **Matching Test Automation to Your Web App:**  
> Update the URLs above and in your local `.env` file (`WEB_APP_BASE_URL`, `API_BASE_URL`). The automated runners in `scripts/` will automatically read and target your deployed application.

---

## 👥 2. Role-Based Access Control (RBAC) & Test Accounts Matrix

Define all user personas, permission tiers, and dedicated test accounts. **Never use personal or production credentials for QA testing.**

| Role | Username / Test Email | Permission Tier | Scope & Critical Workflows |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `qa-admin@example.com` | Full Administrative Access | System settings, user provisioning, role assignment, audit logs, billing management. |
| **Manager / Organizer** | `qa-manager@example.com` | Department / Organization Scope | Resource creation, team member management, report downloads, project approvals. |
| **Standard User / Member** | `qa-user1@example.com` | Standard Functional User | End-to-end user workflows, profile editing, form submission, transactional actions. |
| **Secondary User** | `qa-user2@example.com` | Multi-User Collaboration | Multi-tenant isolation testing, concurrent edits, peer invitations, permissions boundaries. |
| **Guest / Unauthenticated** | N/A (Anonymous Session) | Public / Read-Only Access | Landing page, public search, login redirects, 401/403 unauthorized route guarding. |

> [!IMPORTANT]
> **Credential Security Notice:**  
> Passwords, API tokens, and secrets must be populated in the local `.env` file (e.g. `TEST_PASSWORD_ADMIN`, `TEST_PASSWORD_USER`). Never commit plaintext credentials to version control.

---

## 🏗️ 3. Application Architecture & Technology Stack

| Component | Technology / Framework | QA Verification Scope |
| :--- | :--- | :--- |
| **Frontend UI** | Modern Web SPA / SSR (React, Next.js, Vue, or Angular) | Responsive layouts, DOM rendering, form validation, dynamic state transitions, modal handling. |
| **Styling & Design System** | Tailwind CSS / CSS Modules / Design System | Cross-browser visual consistency, component states (hover, focus, disabled), typography, responsive breakpoints (Desktop, Tablet, Mobile). |
| **API & Backend Layer** | RESTful / GraphQL API | HTTP status codes, JSON payload contracts, authentication headers, error messages, rate limiting. |
| **Authentication & Session** | JWT / Bearer Tokens / HTTP-Only Cookies / OAuth 2.0 | Session expiration, token refresh, cross-tab synchronization, logout invalidation, CSRF defense. |
| **Database & Persistence** | Relational / NoSQL / Cache (PostgreSQL, MySQL, Redis) | Data persistence across reloads, optimistic locking, idempotent operations. |
| **Background Workers** | Message Queue / Cron Schedulers | Asynchronous job completion, email dispatch, notification delivery, webhook triggers. |

---

## ⚡ 4. Critical User Journeys (CUJs) & Testing Scope

### CUJ-01: Authentication & Access Control
- User login with valid credentials (redirect to intended dashboard).
- User login with invalid credentials (appropriate error message displayed, no credentials leakage).
- Password reset and email confirmation flow.
- Protected route redirection (attempting to access `/admin` or `/dashboard` without session redirects to `/login`).
- Session logout (clears cookies/storage, prevents back-navigation caching).

### CUJ-02: User Onboarding & Profile Management
- New user registration / signup with input validation.
- Profile information updates (avatar upload, name, email, preferences).
- Password change and security settings.

### CUJ-03: Core Business Workflows & Data CRUD
- Creation of core domain entities (forms, projects, orders, or tickets).
- Form field validation (required fields, email format, numeric bounds, file size/type restrictions).
- Reading / viewing data in tables, cards, or dashboards with sorting, filtering, and pagination.
- Editing existing records with immediate UI feedback and persistence verification.
- Deletion / archiving with mandatory confirmation dialogs.

### CUJ-04: Non-UI Integrations & External Verifications
- **Payment & Checkout:** Transaction submission, order receipt generation, external payment provider sandbox verification (e.g. Stripe Test mode).
- **Transactional Communications:** Automated delivery of confirmation emails or SMS alerts (verified via sandbox inbox such as Mailtrap).
- **Webhooks & Notifications:** Outgoing webhooks triggered upon entity state changes (verified via webhook testing sink or server logs).

---

## 🔍 5. Non-UI Staging Verification Sources

Staging testing encompasses both browser UI actions and external verification of system side-effects:

| External Service / Source | Endpoint / Tool | Verification Purpose |
| :--- | :--- | :--- |
| **Staging API Health & Swagger** | `https://api-staging.yourwebapp.com/health` | Verifying direct API responses, JSON schemas, and backend status. |
| **Payment Provider Sandbox** | Stripe Dashboard (Test Mode) / Sandbox | Verifying payment intents, charge events, customer IDs, refund records. |
| **Transactional Email Sandbox** | Mailtrap / InBucket / MailSlurp | Verifying receipt of activation emails, password reset tokens, receipts. |
| **Webhook Sink / Event Bus** | Webhook.site / Smee.io / Staging logs | Verifying webhook delivery payload, HTTP 200 acknowledgment, retry logic. |
| **Staging Telemetry & Logs** | Datadog / CloudWatch / Papertrail (Staging) | Verifying error logs, backend exception stack traces, event emission. |

---

## 📜 6. QA Execution Standards & Test Classifications

Every test case in this suite must be classified according to the following execution guidelines:

### A. UI Testing (Playwright / Browser Automation)
- Tests executed against the live deployed staging web application.
- Exercises user-facing elements, forms, navigation, buttons, and state changes.
- Requires timestamped UI screenshot evidence saved in `Evidence/UI/`.

### B. Non-UI Staging Testing
- Tests verifying external consequences generated by staging actions.
- Sources include sandbox APIs, email inboxes, webhook event logs, and payment gateways.
- Requires evidence saved in `Evidence/Non_UI/` (JSON payload, API response screenshot, or external dashboard capture).

### C. Local / Unit-Only (Excluded from Staging Run)
- Tests targeting unit functions, local test harnesses, or localhost databases.
- **Strictly excluded** from staging test runs; documented in the Applicability Record.

---

## 🚦 7. Defect Severity & Priority Classification Matrix

| Severity Level | Definition & Business Impact | Examples | Target SLA |
| :--- | :--- | :--- | :--- |
| **P0 — Blocker / Critical** | Complete system crash, data loss, security vulnerability, broken authentication, blocking all users. | Login entirely broken (500 error); data corruption on save; public exposure of sensitive customer PII. | Immediate (< 4 hours) |
| **P1 — Major / High** | Core business workflow blocked; significant feature unusable with no reasonable workaround. | Checkout payment failure; inability to create or submit primary form; broken role permissions. | Same Sprint (< 24 hours) |
| **P2 — Minor / Medium** | Feature works partially; cosmetic defect impacting user experience; reasonable workaround exists. | Filter dropdown fails to reset; visual layout misalignment on tablet; misleading validation message. | Next Sprint |
| **P3 — Trivial / Low** | Minor cosmetic defect, typos, minor styling inconsistency, non-blocking edge case. | Typo in tooltip; minor margin spacing inconsistency; non-standard button color. | Backlog |

---

## 📁 8. Standard Testing Run & Evidence Structure

Every test execution run outputs a dedicated folder structured as follows:

```text
Staging_Test_{YYYY-MM-DD}_Run_{NN}/
├── Updated_Staging_Test_Cases.xlsx   # Populated test matrix with Status, Actual Results, Remarks, Evidence
├── Applicability_Record.md          # Log of included UI/Non-UI tests and excluded local-only tests
├── Defects_Report.md                # Triage table of identified defects with repro steps
└── Evidence/
    ├── UI/                          # UI screenshots named: TC-{MODULE}-{ID}_{INDEX}.png
    │   ├── TC-AUTH-001_01.png
    │   └── TC-DASH-002_01.png
    └── Non_UI/                      # Non-UI evidence named: TC-{MODULE}-{ID}_{SOURCE}_{INDEX}.*
        ├── TC-API-005_Health_01.json
        └── TC-PAY-010_Stripe_01.png
```
