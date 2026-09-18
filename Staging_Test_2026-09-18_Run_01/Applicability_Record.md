# Staging Test Applicability Record

> **Run Date:** 2026-09-18  
> **Target Scope:** Deployed Staging Web Application Verification

---

## 1. Retained Staging Test Cases

All UI browser journeys and external non-UI staging verifications have been retained and executed against the deployed staging environment.

- **UI Tests Executed:** 5 scenarios verified via browser automation.
- **Non-UI Tests Executed:** 1 scenarios verified via API and external integration sources.

---

## 2. Excluded Local / Unit-Only Cases

| Test ID | Test Scenario | Exclusion Justification |
| :--- | :--- | :--- |
| `TC-UNIT-001` | Component Unit Rendering Tests | Pure Jest/Vitest unit test; executes in local memory, out of staging scope. |
| `TC-LOCAL-002` | Local Docker DB Migration Harness | Local developer harness testing database migrations; out of staging scope. |
| `TC-CODE-003` | Static ESLint / SonarQube Rules | Source code linting; verified in CI build pipeline, not deployed staging. |
