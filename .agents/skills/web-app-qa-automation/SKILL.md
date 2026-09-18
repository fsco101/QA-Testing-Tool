---
name: web-app-qa-automation
description: Senior Quality Assurance Analyst guide for testing web application systems, executing Playwright browser journeys, validating APIs, verifying non-UI staging evidence, and producing audit-ready deliverables.
---

# Web Application QA Automation & Verification Skill

This skill defines the operational standards, analytical methodologies, and execution protocols for Senior QA Analysts and AI testing agents verifying web applications deployed to staging and production environments.

---

## 1. Core Operating Directives

1. **Target Staging Exclusively:**
   - Always read target URLs, credentials, and endpoints from [`Context.md`](file:///c:/Testing/Context.md) or local `.env`.
   - Never test against `localhost` or local developer mocks unless explicitly designated.
2. **Strictly QA-Only (No Code Modification):**
   - Do not modify application source code, API handlers, or database schemas.
   - If an issue or bug is discovered, isolate it, document reproducible steps, capture screenshot/network logs, and log it in the Defect Triage table.
3. **Preserve Test Case Formats:**
   - Retain the exact columns, IDs, and structure of provided client test sheets.
   - Populate `Status`, `Actual Result`, `Evidence`, and `Remarks` without altering table styling or column order.
4. **Enforce UI vs. Non-UI Evidence Separation:**
   - **UI Evidence:** Screenshots saved to `Evidence/UI/` named `TC-{MODULE}-{ID}_{INDEX}.png`.
   - **Non-UI Evidence:** JSON responses, API logs, or payment sandbox captures saved to `Evidence/Non_UI/` named `TC-{MODULE}-{ID}_{SOURCE}_{INDEX}.*`.

---

## 2. Test Classification Taxonomy

Before executing any test suite, classify every test case into one of three categories:

| Category | Execution Rule | Action |
| :--- | :--- | :--- |
| **UI Staging Test** | Verified via browser automation (Playwright) against the deployed staging URL. | Execute using appropriate role context; capture full-page screenshot. |
| **Non-UI Staging Test**| Verified via external systems directly connected to staging (REST API, webhooks, email sandbox, Stripe sandbox). | Verify external source; export payload or capture explorer screenshot. |
| **Local / Unit-Only** | Code-level unit tests, mock databases, developer harnesses. | **Exclude from staging run**; log in `Applicability_Record.md` with exclusion rationale. |

---

## 3. Multi-Role Browser Contexts

When testing applications with Role-Based Access Control (RBAC):
- Create isolated browser contexts (`browser.newContext()`) for each role (Admin, Manager, Standard User, Guest).
- Verify role isolation: Ensure standard users receive `403 Forbidden` or redirect when attempting to navigate to administrative routes.
- Verify session lifecycle: Logging out in one context must invalidate that session without terminating other role sessions.

---

## 4. Evidence Capture & Naming Convention

- In the test case sheet's **Evidence** column, provide **strictly the filename(s)** (e.g. `TC-AUTH-001_01.png`), never embedded paragraphs or raw paths.
- Store all files inside the dedicated testing run directory:
  ```text
  Staging_Test_{YYYY-MM-DD}_Run_{N}/
  ├── Evidence/
  │   ├── UI/
  │   │   └── TC-{MODULE}-{ID}_{INDEX}.png
  │   └── Non_UI/
  │       └── TC-{MODULE}-{ID}_{SOURCE}_{INDEX}.json
  ```

---

## 5. False Failure Prevention & Retries

Before recording a `FAIL`:
1. Check for network latency or loading spinners (wait for selector / network idle).
2. Check if valid test credentials and data were provided.
3. Perform one retry to confirm reproducibility.
4. If reproducible, inspect browser console logs and network response codes (`4xx`, `5xx`) to identify root cause.
