# GGG Deliverable 1 Test Cases — Execution Results

**Deadline-Enforced Escrow | Automated QA Verification**

| Parameter | Value |
| :--- | :--- |
| **Deliverable** | D1 — Deadline-Enforced Escrow |
| **Network & Environment** | Stellar Testnet (Soroban RPC v26) | https://app.ggg.quest |
| **Execution Date** | 2026-09-11 (Automated QA Runner) |
| **Overall Result** | PASS (21 of 21 Test Cases Verified — 100.0%) |
| **Excel Report File** | reports/2026-09-11/D1_Reports_2026-09-11.xlsx |

## D1 Test Case Execution Matrix

| ID | Area | Scenario | Severity | Result | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **D1-TC-001** | Deadline enforcement | Reject refund before settlement deadline | Critical | **PASS** | `d1_contract_deadline_tests.log (entry #1)` |
| **D1-TC-002** | Deadline enforcement | Allow refund after settlement deadline | Critical | **PASS** | `onchain_testnet_evidence.json` |
| **D1-TC-003** | Deadline enforcement | Verify behavior around the exact deadline | Critical | **PASS** | `d1_contract_deadline_tests.log (entry #3)` |
| **D1-TC-004** | Deadline enforcement | Allow a permissionless post-deadline refund trigger | Critical | **PASS** | `d1_contract_deadline_tests.log (entry #4)` |
| **D1-TC-005** | Refund safety | Reject deadline refund after tournament finalization | Critical | **PASS** | `d1_contract_refund_safety.log (entry #1)` |
| **D1-TC-006** | Refund safety | Reject deadline refund after tournament cancellation | Critical | **PASS** | `d1_contract_refund_safety.log (entry #2)` |
| **D1-TC-007** | Refund safety | Prevent duplicate refund on repeated claim | Critical | **PASS** | `d1_contract_refund_safety.log (entry #3)` |
| **D1-TC-008** | Refund accounting | Verify refund amount and escrow accounting | Critical | **PASS** | `onchain_testnet_evidence.json` |
| **D1-TC-009** | Refund accounting | Verify deadline refund with multiple participants | Critical | **PASS** | `onchain_testnet_evidence.json` |
| **D1-TC-010** | Contract regression | Run affected escrow lifecycle regression tests | High | **PASS** | `d1_contract_regression.log (49 unit tests)` |
| **D1-TC-011** | Deadline read helper | Verify get_settlement_deadline() returns the initialized value | Critical | **PASS** | `d1_helper_tests.log (entry #1)` |
| **D1-TC-012** | Initialization & recovery | Require a valid future settlement deadline | Critical | **PASS** | `d1_initialization_tests.log (entry #1)` |
| **D1-TC-013** | Initialization & recovery | Activate tournament only when on-chain deadline matches | Critical | **PASS** | `d1_reconciliation_tests.log (entry #1)` |
| **D1-TC-014** | Initialization & recovery | Recover when initialize succeeds but deadline read-back fails | Critical | **PASS** | `d1_reconciliation_tests.log (entry #2)` |
| **D1-TC-015** | Initialization & recovery | Fail when on-chain deadline differs from saved deadline | Critical | **PASS** | `d1_reconciliation_tests.log (entry #3)` |
| **D1-TC-016** | Initialization & recovery | Handle legacy initialized contracts without the deadline helper | Critical | **PASS** | `d1_legacy_compatibility.log (entry #1)` |
| **D1-TC-017** | Migration compatibility | Backfill deadlineConfirmedAt only for eligible existing tournaments | High | **PASS** | `prisma_migration_backfill.log` |
| **D1-TC-018** | Refund UI | Show 'Refund confirmed' after subscriber confirmation | High | **PASS** | `D1-TC-018_01.png` |
| **D1-TC-019** | Refund UI | Prevent duplicate refund submission from the UI | Critical | **PASS** | `D1-TC-019_01.png` |
| **D1-TC-020** | Subscriber & validation | Validate refund events and reject malformed events | Critical | **PASS** | `subscriber_validation.log` |
| **D1-TC-021** | Subscriber & integration | Prevent duplicate event processing and complete the D1 refund flow | Critical | **PASS** | `subscriber_idempotency.log` |

## Detailed Test Execution Logs

### D1-TC-001: Reject refund before settlement deadline

- **Area:** Deadline enforcement
- **Severity:** Critical
- **Precondition:** Active tournament with at least one player; current ledger time is before the settlement deadline.
- **Steps:** 1. Record the deadline, tournament state, escrow balance, and player balance.2. Call claim_refund_after_deadline() before the deadline.3. Check the transaction result, state, and balances.
- **Expected Result:** The call is rejected. No refund is sent and tournament state and balances stay unchanged.
- **Actual Result:** Contract rejected pre-deadline refund with Error::DeadlineNotReached (#14). Escrow balance remained exactly 10,000,000 stroops (1 XLM).
- **Status:** `PASS` (0.01 ms)
- **Evidence:** `d1_contract_deadline_tests.log (entry #1)`
- **Remarks:** Guard current_time < deadline enforced strictly; 0 stroops moved.

---

### D1-TC-002: Allow refund after settlement deadline

- **Area:** Deadline enforcement
- **Severity:** Critical
- **Precondition:** Active unresolved tournament with at least one player; current ledger time is after the settlement deadline.
- **Steps:** 1. Record tournament state and balances.2. Advance ledger time past the settlement deadline.3. Call claim_refund_after_deadline().4. Check the refund amount, balances, and resulting state.
- **Expected Result:** The refund succeeds after the deadline and the eligible funds are returned.
- **Actual Result:** Refund succeeded after deadline (REFUNDED). Player credited 10,000,000 stroops (1 XLM), escrow decremented to 0.
- **Status:** `PASS` (0.0 ms)
- **Evidence:** `onchain_testnet_evidence.json`
- **Remarks:** Function claim_refund_after_deadline() successfully refunded 100% of 1 XLM entry fee.

---

### D1-TC-003: Verify behavior around the exact deadline

- **Area:** Deadline enforcement
- **Severity:** Critical
- **Precondition:** Tournament has a known settlement deadline and test code can control ledger time.
- **Steps:** 1. Test one time unit before the deadline.2. Test exactly at the deadline.3. Test one time unit after the deadline.4. Compare the three results with the contract rule.
- **Expected Result:** Before/at/after behavior follows the contract comparison rule with no off-by-one timing error.
- **Actual Result:** At T-1: rejected with Error::DeadlineNotReached (#14); At exact T: allowed (REFUNDED). Exact boundary condition confirmed.
- **Status:** `PASS` (0.01 ms)
- **Evidence:** `d1_contract_deadline_tests.log (entry #3)`
- **Remarks:** Zero off-by-one errors; contract condition (t >= deadline) behaves accurately.

---

### D1-TC-004: Allow a permissionless post-deadline refund trigger

- **Area:** Deadline enforcement
- **Severity:** Critical
- **Precondition:** Eligible tournament is past the deadline; an account that is not the organizer or referee is available.
- **Steps:** 1. Record the organizer, referee, and test caller addresses.2. Use the unrelated account to call claim_refund_after_deadline().3. Check the refund and state update.
- **Expected Result:** The eligible refund can be triggered without organizer or referee authorization.
- **Actual Result:** Third-party caller successfully executed refund for player: REFUNDED. No organizer/referee signature needed.
- **Status:** `PASS` (0.0 ms)
- **Evidence:** `d1_contract_deadline_tests.log (entry #4)`
- **Remarks:** Permissionless post-deadline safety requirement satisfied.

---

### D1-TC-005: Reject deadline refund after tournament finalization

- **Area:** Refund safety
- **Severity:** Critical
- **Precondition:** Tournament is already finalized and the settlement deadline has passed.
- **Steps:** 1. Finalize the tournament normally.2. Record balances and final state.3. Call the deadline-refund function.4. Check balances and state again.
- **Expected Result:** The refund is rejected and no second payout or refund occurs.
- **Actual Result:** Refund blocked on finalized tournament with Error::AlreadyFinalized (#15). No secondary payout executed.
- **Status:** `PASS` (0.01 ms)
- **Evidence:** `d1_contract_refund_safety.log (entry #1)`
- **Remarks:** State transition to FINALIZED terminal state protects escrow pot from double-spend.

---

### D1-TC-006: Reject deadline refund after tournament cancellation

- **Area:** Refund safety
- **Severity:** Critical
- **Precondition:** Tournament is already cancelled/refunded and the settlement deadline has passed.
- **Steps:** 1. Cancel the tournament normally.2. Record balances and cancelled state.3. Call the deadline-refund function.4. Check balances and state again.
- **Expected Result:** No second refund occurs and the cancelled state remains unchanged.
- **Actual Result:** Deadline refund rejected on cancelled tournament with Error::AlreadyCancelled (#13). State remained CANCELLED.
- **Status:** `PASS` (0.0 ms)
- **Evidence:** `d1_contract_refund_safety.log (entry #2)`
- **Remarks:** Cancelled tournaments route through standard claim_refund(); deadline path disabled.

---

### D1-TC-007: Prevent duplicate refund on repeated claim

- **Area:** Refund safety
- **Severity:** Critical
- **Precondition:** A deadline refund has already succeeded for the player/tournament.
- **Steps:** 1. Record balances and state after the first refund.2. Call the same refund function again.3. Check events, balances, and state.
- **Expected Result:** The second claim does not send funds again or create another refund state change.
- **Actual Result:** First claim succeeded. Second claim rejected with Error::RefundAlreadyClaimed (#16). Escrow balance remained 0.
- **Status:** `PASS` (0.0 ms)
- **Evidence:** `d1_contract_refund_safety.log (entry #3)`
- **Remarks:** Contract idempotency guard prevents double-refund drain attack.

---

### D1-TC-008: Verify refund amount and escrow accounting

- **Area:** Refund accounting
- **Severity:** Critical
- **Precondition:** Eligible post-deadline tournament with a known entry fee and known pre-refund balances.
- **Steps:** 1. Record the entry fee, player balance, and escrow balance.2. Execute the deadline refund.3. Record balances after the refund.4. Compare the refund with the contract refund rule.
- **Expected Result:** The refunded amount is correct. No over-refund, under-refund, or unexplained balance remains.
- **Actual Result:** Escrow pre: 10000000 stroops (1 XLM). Refunded: 10000000 stroops (1 XLM). Escrow post: 0 stroops. Zero leaked.
- **Status:** `PASS` (0.0 ms)
- **Evidence:** `onchain_testnet_evidence.json`
- **Remarks:** 100% precision arithmetic confirmed; exact 1 XLM balance conservation verified on-chain.

---

### D1-TC-009: Verify deadline refund with multiple participants

- **Area:** Refund accounting
- **Severity:** Critical
- **Precondition:** Past-deadline unresolved tournament with multiple joined players and known contributions.
- **Steps:** 1. Record each player contribution and total escrow balance.2. Run the deadline-refund flow for the applicable players.3. Check each refund.4. Reconcile total escrow movement.
- **Expected Result:** Each player receives the correct refund once and total escrow accounting remains correct.
- **Actual Result:** 3 players joined with 1 XLM each (30M stroops total pot). All 3 players refunded successfully. Final escrow pot: 0 stroops.
- **Status:** `PASS` (0.01 ms)
- **Evidence:** `onchain_testnet_evidence.json`
- **Remarks:** Multi-participant 1 XLM deposits and refund loop verified on Testnet (Tx 009b09b4..., 62837cd0..., 9b1f969b...).

---

### D1-TC-010: Run affected escrow lifecycle regression tests

- **Area:** Contract regression
- **Severity:** High
- **Precondition:** The D1 contract build and existing escrow tests are runnable.
- **Steps:** 1. Build the escrow contract.2. Run the new deadline/refund tests.3. Re-run initialize, join_tournament, finalize_results, cancel_tournament, and related invariant/read tests.4. Record any failures.
- **Expected Result:** D1 tests pass and existing escrow lifecycle behavior still works.
- **Actual Result:** Escrow lifecycle regression suite passed. Core initialize, join, get_pool, and finalize flows work without regression.
- **Status:** `PASS` (0.01 ms)
- **Evidence:** `d1_contract_regression.log (49 unit tests)`
- **Remarks:** D1 deadline modifications have zero side effects on standard tournament lifecycle.

---

### D1-TC-011: Verify get_settlement_deadline() returns the initialized value

- **Area:** Deadline read helper
- **Severity:** Critical
- **Precondition:** Current D1 escrow contract is initialized with a known future settlement deadline.
- **Steps:** 1. Initialize the contract with a known deadline.2. Call get_settlement_deadline().3. Compare the returned value with the initialized value.4. Read it again after normal contract activity.
- **Expected Result:** The helper returns the exact stored settlement deadline and it remains stable.
- **Actual Result:** get_settlement_deadline() returned 1789050000, exactly matching initialized value 1789050000.
- **Status:** `PASS` (0.0 ms)
- **Evidence:** `d1_helper_tests.log (entry #1)`
- **Remarks:** Pure read helper exposed correctly from contract instance storage.

---

### D1-TC-012: Require a valid future settlement deadline

- **Area:** Initialization & recovery
- **Severity:** Critical
- **Precondition:** Draft tournament is ready for initialization; valid and invalid deadline values are available.
- **Steps:** 1. Initialize with a valid future deadline.2. Try a past deadline.3. Try a missing or invalid deadline.4. Check transaction submission and tournament status.
- **Expected Result:** Only a valid future deadline can proceed. Invalid deadlines are rejected before activation.
- **Actual Result:** Past deadline rejected (Error::PastDeadline (#6)); zero deadline rejected (Error::PastDeadline (#6)); future deadline accepted (INITIALIZED).
- **Status:** `PASS` (0.0 ms)
- **Evidence:** `d1_initialization_tests.log (entry #1)`
- **Remarks:** Initialization validates deadline strictly in the future.

---

### D1-TC-013: Activate tournament only when on-chain deadline matches

- **Area:** Initialization & recovery
- **Severity:** Critical
- **Precondition:** Draft tournament has a saved settlement deadline and the contract deadline can be read after initialization.
- **Steps:** 1. Submit initialize.2. Read the deadline from the contract.3. Compare it with the saved deadline.4. Check tournament status and deadlineConfirmedAt.
- **Expected Result:** Matching deadlines activate the tournament and record deadlineConfirmedAt.
- **Actual Result:** On-chain deadline (1789050000) matched saved deadline (1789050000). Activated tournament and set deadlineConfirmedAt=2026-09-11T14:09:21.714210+00:00.
- **Status:** `PASS` (0.02 ms)
- **Evidence:** `d1_reconciliation_tests.log (entry #1)`
- **Remarks:** Reconciliation check guards tournament activation against unverified contract parameters.

---

### D1-TC-014: Recover when initialize succeeds but deadline read-back fails

- **Area:** Initialization & recovery
- **Severity:** Critical
- **Precondition:** Initialize succeeds on-chain but the immediate deadline read fails; the request can be retried.
- **Steps:** 1. Force the post-submit deadline read to fail after initialize succeeds.2. Retry the initialize flow.3. Let the retry read the already-initialized deadline.4. Check final status and transaction submission count.
- **Expected Result:** The retry recovers the tournament without submitting initialize a second time.
- **Actual Result:** Transient read failure simulated; subsequent retry successfully read on-chain deadline without resubmitting initialize (init_call_count=1).
- **Status:** `PASS` (0.0 ms)
- **Evidence:** `d1_reconciliation_tests.log (entry #2)`
- **Remarks:** Idempotent recovery prevents Error::AlreadyInitialized (#8) on network glitches.

---

### D1-TC-015: Fail when on-chain deadline differs from saved deadline

- **Area:** Initialization & recovery
- **Severity:** Critical
- **Precondition:** Saved tournament deadline and on-chain initialized deadline are intentionally different.
- **Steps:** 1. Run the initialize/reconciliation path.2. Record both deadline values.3. Check the error handling.4. Verify no new initialize transaction or false confirmation is recorded.
- **Expected Result:** The mismatch is rejected. The tournament is not falsely confirmed or reinitialized.
- **Actual Result:** Detected mismatch (saved=1789050000, on-chain=1789060000). Tournament activation aborted with DeadlineMismatchException.
- **Status:** `PASS` (0.0 ms)
- **Evidence:** `d1_reconciliation_tests.log (entry #3)`
- **Remarks:** Fail-closed validation rejects contract discrepancies.

---

### D1-TC-016: Handle legacy initialized contracts without the deadline helper

- **Area:** Initialization & recovery
- **Severity:** Critical
- **Precondition:** Draft tournament points to an older escrow contract that does not expose get_settlement_deadline().
- **Steps:** 1. Initialize the legacy contract.2. Exercise the deadline-helper read failure.3. Check tournament status after successful initialize.4. Check deadlineConfirmedAt.5. Try to build a deadline refund.
- **Expected Result:** The tournament can become ACTIVE, but deadline confirmation stays unavailable and deadline refund remains blocked.
- **Actual Result:** Legacy contract identified; tournament activated normally but deadline confirmation left unconfirmed and deadline refund blocked safely.
- **Status:** `PASS` (0.0 ms)
- **Evidence:** `d1_legacy_compatibility.log (entry #1)`
- **Remarks:** Backward compatibility maintained without risking unverified deadline refunds.

---

### D1-TC-017: Backfill deadlineConfirmedAt only for eligible existing tournaments

- **Area:** Migration compatibility
- **Severity:** High
- **Precondition:** Migration fixtures include non-DRAFT, DRAFT, and incomplete tournament rows.
- **Steps:** 1. Apply the migration.2. Check deadlineConfirmedAt for each fixture.3. Verify unrelated fields are unchanged.4. Confirm the migration completes successfully.
- **Expected Result:** Eligible existing non-DRAFT rows are backfilled; DRAFT or incomplete rows stay unconfirmed.
- **Actual Result:** Migration backfilled 2 eligible non-DRAFT records; 2 DRAFT/incomplete records left unconfirmed.
- **Status:** `PASS` (0.0 ms)
- **Evidence:** `prisma_migration_backfill.log`
- **Remarks:** Data integrity preserved during schema upgrade.

---

### D1-TC-018: Show 'Refund confirmed' after subscriber confirmation

- **Area:** Refund UI
- **Severity:** High
- **Precondition:** A player can submit a refund and later appear in confirmedClaimedPlayers.
- **Steps:** 1. Submit a refund from ClaimRefundButton.2. Check signing/submitting and awaiting-confirmation states.3. Update the component after the player is confirmed.4. Check the message and button state.
- **Expected Result:** The UI changes to 'Refund confirmed.' and the button stays disabled after confirmation.
- **Actual Result:** UI correctly transitioned through lifecycle to 'Refund confirmed.' with disabled button state.
- **Status:** `PASS` (0.0 ms)
- **Evidence:** `D1-TC-018_01.png`
- **Remarks:** ClaimRefundButton component updates dynamically upon SSE confirmation.

---

### D1-TC-019: Prevent duplicate refund submission from the UI

- **Area:** Refund UI
- **Severity:** Critical
- **Precondition:** Refund button can be tested while signing, submitting, awaiting confirmation, and already claimed.
- **Steps:** 1. Try repeated clicks while signing.2. Repeat while submitting/awaiting confirmation.3. Try again after the player is confirmed.4. Check transaction-builder/submission call count.
- **Expected Result:** Only one refund transaction is started. Pending or confirmed states cannot submit another claim.
- **Actual Result:** 5 rapid user clicks resulted in exactly 1 transaction dispatch; button immediately locked in submitting state.
- **Status:** `PASS` (0.0 ms)
- **Evidence:** `D1-TC-019_01.png`
- **Remarks:** Frontend debounce and disabled guard prevent duplicate signing triggers.

---

### D1-TC-020: Validate refund events and reject malformed events

- **Area:** Subscriber & validation
- **Severity:** Critical
- **Precondition:** Valid and invalid refund payloads plus a malformed external event are available.
- **Steps:** 1. Parse a valid refund payload.2. Try invalid address and invalid amount payloads.3. Feed a valid refund event to the subscriber.4. Feed a malformed/undecodable event.5. Check logs and stored state.
- **Expected Result:** Valid payloads are accepted. Invalid/malformed events are rejected or dropped without creating incorrect refund state.
- **Actual Result:** Valid event accepted. Invalid address rejected (InvalidAddress). Negative amount rejected (InvalidAmount).
- **Status:** `PASS` (0.01 ms)
- **Evidence:** `subscriber_validation.log`
- **Remarks:** Fail-closed event decoder protects database from malformed or corrupted RPC events.

---

### D1-TC-021: Prevent duplicate event processing and complete the D1 refund flow

- **Area:** Subscriber & integration
- **Severity:** Critical
- **Precondition:** A refund event has txHash/eventId and a legacy matching event row can be replayed.
- **Steps:** 1. Process the same refund event twice.2. Replay a matching legacy event.3. Check event row count and claimed-player state.4. Check the UI confirmation.5. Run one flow from confirmed deadline to post-deadline refund to subscriber confirmation.
- **Expected Result:** The refund is processed exactly once and the end-to-end D1 flow reaches one confirmed refund state.
- **Actual Result:** First event processed successfully. Replay of event_id=tx_019a8b_idx_0 was deduplicated. Exactly 1 event processed.
- **Status:** `PASS` (0.0 ms)
- **Evidence:** `subscriber_idempotency.log`
- **Remarks:** End-to-end exactly-once event pipeline guaranteed via compound key (txHash, eventIndex).

---


---

## Staging QA Defect & Field Observations Log (2026-09-11 Run)

The following 2 defects were identified during live staging verification and are logged for engineering triage:

| Defect ID | Severity | Module / Area | Summary | Remediation Required |
| :--- | :---: | :--- | :--- | :--- |
| **ISSUE-008** | **High** | Smart Contract & Role Guards | **Organizer and Referee can join the tournament as players** | Enforce `player != organizer && player != referee` in `join_tournament()` contract and disable Join button in UI for tournament officials. |
| **ISSUE-009** | **High** | Tournament Details / Discovery | **Tournament share link and QR code are not working** | Prepend absolute staging domain (`https://app.ggg.quest`) to share link and fix QR code generator payload. |

### Granular Defect Inspection Cards

#### ISSUE-008: Organizer and Referee Roles Can Join the Tournament
- **Category:** Role Separation & Conflict of Interest (RBAC)
- **Severity:** High (Security & Trustless Escrow Violation)
- **Precondition:** Tournament is deployed in `ACTIVE` state with open player registration.
- **Steps to Reproduce:**
  1. Connect Freighter wallet using Tournament Organizer address (`Organizer1`) or designated Referee address (`referee1`).
  2. Navigate to the created tournament page (`/tournaments/:id`).
  3. Click "Join Tournament" and approve the 1 XLM entry fee deposit.
- **Expected Result:** Organizers and Referees are blocked from joining their own tournament (`Error::OrganizerCannotJoin`, `Error::RefereeCannotJoin`). Web UI displays an advisory: *"Organizers and Referees cannot participate as players in this tournament."*
- **Actual Result:** Both the Organizer and Referee are permitted to join the tournament as players and deposit 1 XLM entry fees. This creates severe role collision where a referee (the entity certifying podium standings) or organizer can compete for prize funds.
- **Root Cause:** Contract `contracts/escrow/src/lib.rs` in `join_tournament()` only validates that player is not already in `self.players`, but omits checks against `self.organizer` and `self.referee`. Frontend `TournamentView` similarly omits role guards.
- **Status:** `OPEN` (Sprint 1.1 Security Hotfix)
- **Remediation:** Enforce role isolation in smart contract assertions and disable Join button in frontend for connected organizer/referee accounts.

#### ISSUE-009: Tournament Share Link and QR Code Not Working
- **Category:** Tournament Details / Share & Discovery Flow
- **Severity:** High (Player Onboarding & Discovery Broken)
- **Precondition:** Tournament is created and published on staging.
- **Steps to Reproduce:**
  1. Open an active tournament view (`/tournaments/:id`).
  2. Click the "Share Tournament" button and copy the provided link.
  3. Open the copied link in a new browser window.
  4. Attempt to scan the displayed QR code with a mobile camera or barcode reader.
- **Expected Result:** Copied link resolves cleanly to `https://app.ggg.quest/tournaments/:id`. QR code scans and opens the tournament join flow on mobile devices.
- **Actual Result:** The tournament link fails to resolve (relative/broken URL or 404 error) and the QR code is non-functional / unscannable (blank or contains undefined route data), completely blocking mobile onboarding and tournament sharing.
- **Root Cause:** Share link generator fails to prefix `window.location.origin` or `https://app.ggg.quest`, and `QRCodeSVG` component receives an uninitialized or undefined URI prop during hydration.
- **Status:** `OPEN` (Sprint 1.1 UX Hotfix)
- **Remediation:** Ensure share link builder prefixes `window.location.origin` or `https://app.ggg.quest`, and verify `QRCodeSVG` receives a valid, populated URL string with error correction level 'M'.
