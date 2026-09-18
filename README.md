# Universal Web Application QA & Test Automation Framework

> **Enterprise-Grade Quality Assurance, E2E Browser Automation, API Contract Validation, and Audit-Ready Reporting for Modern Web Applications.**

---

## 📌 1. Purpose of this System

The **Universal Web Application QA & Test Automation Framework** is an end-to-end testing, verification, and defect-reporting platform designed to evaluate any web application deployed to staging, UAT, preview, or production environments. 

### Why this Framework Exists
Modern web applications consist of tightly coupled layers: dynamic browser interfaces (SPAs/SSRs), REST/GraphQL APIs, background workers, third-party services (payment processors, transactional email, webhooks), and multi-tiered role authorization. Traditional testing often fragments these layers, leading to missed edge cases, visual defects, broken integrations, and untracked bugs.

This framework solves these challenges by providing:
1. **A Unified QA Operating System:** Combines human QA analytical rigor with automated browser testing (Playwright), API health assertions, WCAG accessibility scans, and performance profiling.
2. **Dual-Layer Verification (UI + Non-UI):** Verifies both visible frontend behaviors and external system side-effects (e.g. database persistence, payment provider sandbox records, email delivery, webhook payloads).
3. **Audit-Ready Deliverables:** Automatically organizes run evidence into timestamped folders (`Staging_Test_{Date}_Run_{N}/`), generates standardized multi-tab Excel reports (`.xlsx`), and maintains strict defect traceability.
4. **Plug-and-Play Adaptability:** Decoupled from any single proprietary project. By configuring the **Target Web Application System Configuration & Links** section in [`Context.md`](./Context.md), this suite instantly adapts to test any target web application.
5. **AI-Assisted Autonomous QA:** Pre-configured with specialized QA agent skills to allow AI coding assistants to conduct exploratory testing, capture screenshot proof, and triage defects without touching production source code.

---

## 🧠 2. Senior QA Analyst Skills & Testing Disciplines

This framework embeds the core competencies and methodologies of a Senior QA Analyst / QA Lead:

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     UNIVERSAL WEB APP QA TESTING TAXONOMY                       │
├───────────────────────────────┬─────────────────────────────────────────────────┤
│ 1. Functional & Exploratory   │ Heuristic analysis, boundary values, edge cases │
│ 2. E2E UI Test Automation     │ Playwright browser flows, multi-role contexts   │
│ 3. API & Contract Validation  │ REST/GraphQL, schema contracts, HTTP codes      │
│ 4. Non-UI Staging Proof       │ Payment sandboxes, email inboxes, webhooks      │
│ 5. Multi-Role RBAC Security   │ Privilege escalation prevention, route guards   │
│ 6. Accessibility (a11y)       │ WCAG 2.1/2.2 AA audits, axe-core integration    │
│ 7. Performance & Latency      │ Core Web Vitals (LCP, CLS, TTFB, DOM load)      │
│ 8. Cross-Browser & Responsive │ Chromium, WebKit, Firefox, mobile viewports     │
│ 9. Defect Triage & Isolation  │ Repro steps, console logs, severity scoring     │
│ 10. Audit-Ready Reporting     │ Multi-sheet Excel dashboards, evidence indices  │
└───────────────────────────────┴─────────────────────────────────────────────────┘
```

---

## 🎯 3. How to Connect Your Web App System

You can point this framework to your web application in three simple steps:

### Step 1: Configure [`Context.md`](./Context.md)
Open [`Context.md`](./Context.md) and fill in the **Target Web Application System Configuration & Links** table:
```markdown
| Parameter | Configuration / URL |
| :--- | :--- |
| **Primary Staging URL** | https://staging.yourdomain.com |
| **Authentication URL** | https://staging.yourdomain.com/login |
| **API Base URL** | https://api-staging.yourdomain.com/v1 |
| **API Docs / Swagger** | https://api-staging.yourdomain.com/docs |
```
Define your user roles (Admin, Manager, User) and list your application's **Critical User Journeys (CUJs)**.

### Step 2: Set Environment Credentials (`.env`)
Create or update your local `.env` file with target URLs and test credentials:
```env
WEB_APP_BASE_URL="https://staging.yourdomain.com"
API_BASE_URL="https://api-staging.yourdomain.com/v1"
TEST_ADMIN_EMAIL="qa-admin@yourdomain.com"
TEST_ADMIN_PASSWORD="YourSecureStagingPassword123!"
TEST_USER_EMAIL="qa-user@yourdomain.com"
TEST_USER_PASSWORD="YourSecureStagingPassword123!"
```

### Step 3: Run the Test Suites
Run the automated runners or use the provided Playwright scripts to execute tests, capture screenshots, and generate reports.

---

## 🛠️ 4. Automated Script Suite Inventory

The [`scripts/`](./scripts) directory contains modular, production-ready QA tools:

| Script | Engine | Description & Scope |
| :--- | :--- | :--- |
| **`playwright_ui_runner.js`** | Playwright (Node.js) | Executes automated end-to-end browser journeys against the deployed staging URL. Captures full-page screenshots with strict naming (`TC-{MODULE}-{ID}_{INDEX}.png`). Supports isolated browser contexts per user role. |
| **`api_health_checker.js`** | Axios (Node.js) | Validates API endpoint reachability, HTTP response status codes, payload contracts, and response latency thresholds. |
| **`accessibility_audit.js`** | Axe-Core (Node.js) | Audits key application routes against WCAG 2.1 Level AA accessibility standards, generating actionable violation reports. |
| **`performance_profiler.js`** | Playwright (Node.js) | Measures Core Web Vitals and load timings: TTFB, DOMContentLoaded, LCP, and total network asset payloads. |
| **`excel_report_generator.py`** | OpenPyXL (Python) | Compiles test execution results into an executive spreadsheet with a KPI Summary Dashboard, Detailed Test Execution Log, and Defect Triage tracker. |
| **`evidence_packager.py`** | Python | Validates the current testing run directory, verifies that all screenshots referenced in test cases exist, and creates an automated run manifest. |

---

## 🚀 5. Quick Start & Execution Commands

### Prerequisites
- Node.js (v18+)
- Python (v3.9+) with `openpyxl`
- Playwright browsers installed: `npx playwright install`

### Install Dependencies
```bash
npm install
pip install openpyxl
```

### Execute Test Suites
```bash
# 1. Run E2E UI journeys with automatic screenshot capture
npm run test:ui

# 2. Run API endpoint health and contract checks
npm run test:api

# 3. Run automated WCAG 2.1 AA accessibility audit
npm run audit:a11y

# 4. Measure Core Web Vitals and page speed
npm run profile:perf

# 5. Generate standardized Excel report from execution logs
npm run report:excel

# 6. Package and validate run evidence
npm run package:run
```

---

## 📂 6. Repository Directory Structure

```text
qa-testing-tool/
├── Context.md                         # Authoritative QA context, AUT URLs, roles, and architecture
├── README.md                          # Framework overview, purpose, and operating instructions
├── Automation Testing Script.md       # Universal staging testing rules, classifications, and guidelines
├── package.json                       # QA runner dependencies & npm scripts
├── Deliverable/                       # Master test case templates and sprint deliverables
│   └── Master_Web_App_Test_Cases_Template.md
├── scripts/                           # Modular automation and report generation scripts
│   ├── playwright_ui_runner.js        # E2E browser runner & screenshot capturer
│   ├── api_health_checker.js          # REST/GraphQL endpoint health and contract checker
│   ├── accessibility_audit.js         # Axe-core WCAG 2.1 AA accessibility auditor
│   ├── performance_profiler.js        # Page speed & Core Web Vitals profiler
│   ├── excel_report_generator.py      # Standardized multi-sheet Excel report generator
│   └── evidence_packager.py           # Evidence organizer and run packaging validator
├── .agents/skills/                    # Specialized AI agent skills for QA automation
│   └── web-app-qa-automation/
│       └── SKILL.md                   # Autonomous QA agent protocol & guidelines
└── Staging_Test_{YYYY-MM-DD}_Run_{N}/ # Created automatically per testing run
    ├── Updated_Staging_Test_Cases.xlsx # Filled execution matrix
    ├── Applicability_Record.md        # Classification log (UI vs Non-UI vs Local)
    ├── Defects_Report.md              # Detailed bug tickets
    └── Evidence/
        ├── UI/                        # Screenshots (TC-{MODULE}-{ID}_{INDEX}.png)
        └── Non_UI/                    # API payloads, external sandbox proofs
```

---

## 🔒 7. Universal QA Directives & Golden Rules

1. **Deploy Staging Only:** Tests must target the live, deployed staging environment. Never test against `localhost` or local developer harnesses.
2. **Strictly QA-Only (No Code Tampering):** Never edit application source code, alter database schemas, or attempt to fix bugs directly. Discover, isolate, document, and report bugs.
3. **Preserve Test Case Format:** Never reformat or redesign provided client test case templates. Populate the provided columns (`Status`, `Actual Result`, `Evidence`, `Remarks`) directly.
4. **UI vs. Non-UI Separation:** Maintain clear separation between browser UI actions and external verification sources (APIs, webhooks, payment sandboxes).
5. **Traceable Evidence:** Every marked test case must link to an evidence file existing in the same run folder. No unsupported assertions.
6. **Protect Shared Staging Data:** Use dedicated test accounts, unique timestamps, and idempotent data to avoid polluting staging environments.

---

## 📄 License & Attribution
Maintained by the Quality Assurance & Test Engineering Team. Open for adaptation across modern web engineering stacks.
