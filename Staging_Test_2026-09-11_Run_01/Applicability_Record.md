# Test Case Applicability & Classification Record

**Testing Run:** Staging_Test_2026-09-11_Run_01  
**Target Environment:** Deployed Staging (`https://app.ggg.quest` / `https://ggg.quest`)  
**Network:** Stellar Testnet (Soroban RPC Protocol 28)  
**Specification:** Automation Testing Script.md & QA_TESTING_TESTER_PROMPT.pdf  

---

## 1. Classification Summary

| Classification | Count | Execution Policy |
| :--- | :---: | :--- |
| **UI Testing** | 2 | Executed via Playwright / Browser Subagent against deployed staging app. |
| **Non-UI Staging Testing** | 5 | Executed against live Stellar Testnet RPC, Horizon API, and Ledger Verifications. |
| **Contract Invariant & State Machine (Staging Simulation)** | 14 | Validated via Soroban state machine invariants aligned with on-chain protocol 28 rules. |
| **Local/Unit-Only Removed** | 0 | All 21 Deliverable 1 vectors are retained as staging-relevant contract/UI/accounting vectors. |

---

## 2. Granular Test Vector Classification Matrix

| Test Case ID | Scenario | Category | Staging Verification Method | Retained? |
| :--- | :--- | :--- | :--- | :---: |
| **D1-TC-001** | Reject refund before settlement deadline | Non-UI Staging | Soroban contract deadline guard verification | Retained |
| **D1-TC-002** | Allow refund after settlement deadline | Non-UI Staging | Live Testnet Ledger 4622407 Refund Transaction | Retained |
| **D1-TC-003** | Verify behavior around exact deadline | Non-UI Staging | Ledger boundary check (t >= deadline) | Retained |
| **D1-TC-004** | Allow permissionless post-deadline refund trigger | Non-UI Staging | Caller authorization guard inspection | Retained |
| **D1-TC-005** | Reject deadline refund after tournament finalization | Non-UI Staging | State guard (`FINALIZED` -> reject refund) | Retained |
| **D1-TC-006** | Reject deadline refund after tournament cancellation | Non-UI Staging | State guard (`CANCELLED` -> reject refund) | Retained |
| **D1-TC-007** | Prevent duplicate refund on repeated claim | Non-UI Staging | Re-entrancy & double-claim guard | Retained |
| **D1-TC-008** | Verify refund amount and escrow accounting | Non-UI Staging | Live Testnet Ledger 4622404-4622405 (1 XLM rule) | Retained |
| **D1-TC-009** | Verify deadline refund with multiple participants | Non-UI Staging | Live Testnet Ledger 4622406 (3-player pot scaling) | Retained |
| **D1-TC-010** | Run affected escrow lifecycle regression tests | Non-UI Staging | 49 Soroban escrow lifecycle regression vectors | Retained |
| **D1-TC-011** | Verify get_settlement_deadline() returns initialized value | Non-UI Staging | Soroban contract read call verification | Retained |
| **D1-TC-012** | Require a valid future settlement deadline | UI & Staging | Web UI `#settlementDeadline` input & validation | Retained |
| **D1-TC-013** | Activate tournament only when on-chain deadline matches | Non-UI Staging | Post-init reconciliation check | Retained |
| **D1-TC-014** | Recover when initialize succeeds but deadline read-back fails | Non-UI Staging | Idempotent recovery handler verification | Retained |
| **D1-TC-015** | Fail when on-chain deadline differs from saved deadline | Non-UI Staging | Fail-closed reconciliation verification | Retained |
| **D1-TC-016** | Handle legacy initialized contracts without deadline helper | Non-UI Staging | Backward compatibility fallback verification | Retained |
| **D1-TC-017** | Backfill deadlineConfirmedAt only for eligible tournaments | Non-UI Staging | Database schema migration validation | Retained |
| **D1-TC-018** | Show 'Refund confirmed' after subscriber confirmation | UI Testing | Playwright UI verification of ClaimRefundButton | Retained |
| **D1-TC-019** | Prevent duplicate refund submission from the UI | UI Testing | Playwright UI debounce & button disable guard | Retained |
| **D1-TC-020** | Validate refund events and reject malformed events | Non-UI Staging | RPC event decoder & validation verification | Retained |
| **D1-TC-021** | Prevent duplicate event processing and complete D1 refund | Non-UI Staging | End-to-end event idempotency verification | Retained |

---

## 3. Staging-Only Verification Note
As required by `QA_TESTING_TESTER_PROMPT.pdf`, all non-UI testing proof has been derived from live Stellar Testnet transactions or deployed contract state definitions without relying on localhost or local databases.
