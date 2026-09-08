# **GGG Project Test Cases**

**Comprehensive Feature, Expected Behavior & User Flow Suite**

Good Game Guild | Stellar Testnet | Soroban Tournament Escrow & Live Web App

| Deliverable | Project-Wide Master QA Suite (55 Test Cases) |
| :---- | :---- |
| **Scope** | Organizer, Player, Referee, Admin User Flows, Soroban Escrow & Event Subscriber |
| **Network** | Stellar Testnet ([https://ggg.quest](https://ggg.quest)) — Mainnet USDC/Public out of scope |
| **Pass criteria** | All contract invariants, state transitions, wallet signings, and SSE live updates pass |
| **Safety rule** | No custody of player funds, zero leaked stroops, strict authorization guards on all state mutations |

**Execution fields:** Record Actual Result, Status (Pass/Fail/Blocked/Not Tested), Evidence/Bug ID, candidate build/commit, and Testnet contract ID when applicable.

# **Project Test Case Matrix**

| ID | Area | Scenario | Severity | Status |
| :---- | :---- | :---- | :---- | :---- |
| TC-ORG-001 | Organizer flow | Successful Tournament Creation with XLM Entry Fee (Happy Path) | Critical | Not Tested |
| TC-ORG-002 | Organizer flow | Reject Creation when Organizer Address Equals Referee Address | Critical | Not Tested |
| TC-ORG-003 | Organizer flow | Reject Creation with Non-Positive Entry Fee | High | Not Tested |
| TC-ORG-004 | Organizer flow | Reject Creation with Invalid Basis Point Split (Sum != 10000) | High | Not Tested |
| TC-ORG-005 | Organizer flow | Reject Creation with Settlement Deadline in the Past | High | Not Tested |
| TC-ORG-006 | Organizer flow | Reject Creation with Settlement Deadline Exceeding 90-Day Safe Horizon | High | Not Tested |
| TC-ORG-007 | Organizer flow | Successful Tournament Creation with USDC Asset | High | Not Tested |
| TC-ORG-008 | Organizer flow | Double Initialization Protection (Re-initialization Attack) | Critical | Not Tested |
| TC-ORG-009 | Organizer flow | Organizer Authorization Verification on Deployment | Critical | Not Tested |
| TC-ORG-010 | Organizer flow | Form Input Persistence & Session Recovery on Wallet Reject | Medium | Not Tested |
| TC-PLY-001 | Player flow | Successful Tournament Join & Fee Deduction (Happy Path) | Critical | Not Tested |
| TC-PLY-002 | Player flow | Dynamic Prize Pool Incremental Scaling with Multiple Players | Critical | Not Tested |
| TC-PLY-003 | Player flow | Duplicate Registration Guard (Already Joined) | Critical | Not Tested |
| TC-PLY-004 | Player flow | Insufficient Balance Rejection | High | Not Tested |
| TC-PLY-005 | Player flow | Registration Blocked at or After Settlement Deadline | Critical | Not Tested |
| TC-PLY-006 | Player flow | Registration Blocked when Tournament is Cancelled | High | Not Tested |
| TC-PLY-007 | Player flow | Registration Blocked when Tournament is Finished | High | Not Tested |
| TC-PLY-008 | Player flow | Maximum Registration Ceiling Enforced (100 Players) | High | Not Tested |
| TC-PLY-009 | Player flow | Join QR Code Parsing & Mobile/Direct Join Flow | Medium | Not Tested |
| TC-PLY-010 | Player flow | Player Storage & Instance TTL Bump on Join | Medium | Not Tested |
| TC-REF-001 | Referee flow | Successful Match Finalization & Split Distribution (Happy Path) | Critical | Not Tested |
| TC-REF-002 | Referee flow | Deterministic Dust Allocation to 1st Place Winner | Critical | Not Tested |
| TC-REF-003 | Referee flow | Non-Referee Unauthorized Settlement Rejection | Critical | Not Tested |
| TC-REF-004 | Referee flow | Reject Settlement with Non-Distinct Winners (Duplicate Winner) | High | Not Tested |
| TC-REF-005 | Referee flow | Reject Settlement with Unregistered Winner Address | Critical | Not Tested |
| TC-REF-006 | Referee flow | Reject Settlement at or After Settlement Deadline | Critical | Not Tested |
| TC-REF-007 | Referee flow | Double Finalization Protection | Critical | Not Tested |
| TC-REF-008 | Referee flow | Reject Settlement on Cancelled Tournament | High | Not Tested |
| TC-REF-009 | Referee flow | Read-Only Helper `get_reward` Validation | Medium | Not Tested |
| TC-REF-010 | Referee flow | Settlement Console Candidate Roster Accuracy | Medium | Not Tested |
| TC-REFUND-001 | Refund & cancellation | Organizer Cancellation Before Deadline (Happy Path) | Critical | Not Tested |
| TC-REFUND-002 | Refund & cancellation | Non-Organizer Cancellation Rejection | Critical | Not Tested |
| TC-REFUND-003 | Refund & cancellation | Cancellation Rejection at or After Deadline | High | Not Tested |
| TC-REFUND-004 | Refund & cancellation | Permissionless Refund Claim on Cancelled Tournament | Critical | Not Tested |
| TC-REFUND-005 | Refund & cancellation | Permissionless Refund Claim Post-Deadline (Unsettled Tournament) | Critical | Not Tested |
| TC-REFUND-006 | Refund & cancellation | Reject Refund Claim Before Deadline on Non-Cancelled Tournament | Critical | Not Tested |
| TC-REFUND-007 | Refund & cancellation | Duplicate Refund Claim Prevention (Idempotency) | Critical | Not Tested |
| TC-REFUND-008 | Refund & cancellation | Reject Refund for Non-Registered Address | High | Not Tested |
| TC-LIVE-001 | Real-time feed & subscriber | Real-Time Prize Pool & Participant List Update over SSE | High | Not Tested |
| TC-LIVE-002 | Real-time feed & subscriber | Live Feed Reconnection & Event Replay on Network Blip | Medium | Not Tested |
| TC-LIVE-003 | Real-time feed & subscriber | Subscriber Idempotent Event Processing | High | Not Tested |
| TC-LIVE-004 | Real-time feed & subscriber | Immediate Status Chip Reflection on Finalization or Cancellation | High | Not Tested |
| TC-LIVE-005 | Real-time feed & subscriber | Explorer Link Verification | Low | Not Tested |
| TC-ADM-001 | Platform admin | Admin Authentication & Session Security | High | Not Tested |
| TC-ADM-002 | Platform admin | Role Hierarchy Enforcement (ADMIN vs ORGANIZER) | High | Not Tested |
| TC-ADM-003 | Platform admin | Platform Tournament Overview & Search/Filter | Medium | Not Tested |
| TC-ADM-004 | Platform admin | Force Cancel Tournament from Admin Panel | Medium | Not Tested |
| TC-ADM-005 | Platform admin | CSRF & Rate Limiting Protection | High | Not Tested |
| TC-SEC-001 | Contract invariants & security | Fund Conservation Invariant (Zero Leaked Stroops) | Critical | Not Tested |
| TC-SEC-002 | Contract invariants & security | Integer Arithmetic Overflow Protection | Critical | Not Tested |
| TC-SEC-003 | Contract invariants & security | Soroban State Archival & Instance TTL Extension | Critical | Not Tested |
| TC-SEC-004 | Contract invariants & security | Storage Boundedness & State Bloat Guard | High | Not Tested |
| TC-SEC-005 | Contract invariants & security | Absence of Custodial Withdrawal / Drain Backdoors | Critical | Not Tested |
| TC-SEC-006 | Contract invariants & security | Reentrancy Invariant | Critical | Not Tested |
| TC-SEC-007 | Contract invariants & security | Safe Error Reporting (`panic_with_error!`) | High | Not Tested |

# **Organizer flow**

## **TC-ORG-001 - Successful Tournament Creation with XLM Entry Fee (Happy Path)**

| Preconditions | Organizer has connected Freighter wallet on Stellar Testnet with funded XLM balance. |
| :---- | :---- |
| **Test Steps** | 1. Navigate to `/tournaments/new`. 2. Enter tournament title, select game title, upload banner image, and specify rules. 3. Set entry fee (e.g., `10 XLM`), select asset `XLM`. 4. Enter a valid referee Stellar address (`G...`). 5. Set settlement deadline to a valid future timestamp (e.g., `Now + 7 days`). 6. Confirm default winner split: `[6000, 3000, 1000]` (60% / 30% / 10%). 7. Submit form and approve both Freighter wallet transactions: - Transaction 1: Deploy contract WASM instance. - Transaction 2: Invoke `initialize(...)` with configured parameters. |
| **Expected Result** | Contract deployed (`C...`), `initialize` succeeds. Database creates tournament record with status `ACTIVE`. Browser redirects to tournament detail page showing live prize counter (`0 XLM`) and empty participant list. |
| **Severity** | Critical |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-ORG-002 - Reject Creation when Organizer Address Equals Referee Address**

| Preconditions | Organizer Freighter wallet connected. |
| :---- | :---- |
| **Test Steps** | 1. In `/tournaments/new`, input the connected Organizer's own wallet address into the Referee field. 2. Attempt to submit. |
| **Expected Result** | Client-side validation flags an error. If bypassed, contract `initialize` reverts with `Error::OrganizerIsReferee (#5)`. No funds or state corrupted. |
| **Severity** | Critical |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-ORG-003 - Reject Creation with Non-Positive Entry Fee**

| Preconditions | Organizer wallet connected. |
| :---- | :---- |
| **Test Steps** | 1. In the creation form, enter `0` or a negative value for the entry fee. 2. Attempt to submit. |
| **Expected Result** | Form blocks submission with "Entry fee must be greater than 0". If submitted to contract, `initialize` reverts with `Error::NonPositiveEntryFee (#4)`. |
| **Severity** | High |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-ORG-004 - Reject Creation with Invalid Basis Point Split (Sum != 10000)**

| Preconditions | Organizer wallet connected. |
| :---- | :---- |
| **Test Steps** | 1. Enter custom basis points that sum to `9,000` (e.g., 5000, 3000, 1000) or `11,000`. 2. Attempt to deploy and initialize. |
| **Expected Result** | Client rejects submission. Smart contract rejects with `Error::BadDistributionSum (#3)` or `Error::BadDistributionLen (#2)`. |
| **Severity** | High |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-ORG-005 - Reject Creation with Settlement Deadline in the Past**

| Preconditions | Organizer wallet connected. |
| :---- | :---- |
| **Test Steps** | 1. Set settlement deadline date/time earlier than current system UTC time. 2. Submit creation. |
| **Expected Result** | Validation prevents past deadlines. Contract reverts with `Error::DeadlineNotFuture (#12)`. |
| **Severity** | High |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-ORG-006 - Reject Creation with Settlement Deadline Exceeding 90-Day Safe Horizon**

| Preconditions | Organizer wallet connected. |
| :---- | :---- |
| **Test Steps** | 1. Set settlement deadline to `Now + 95 days` (exceeding `MAX_SETTLEMENT_HORIZON_SECS = 90 days`). 2. Submit creation. |
| **Expected Result** | Contract reverts with `Error::DeadlineExceedsTestnetSafeHorizon (#13)` to prevent contract state archival before settlement. |
| **Severity** | High |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-ORG-007 - Successful Tournament Creation with USDC Asset**

| Preconditions | `USDC_ISSUER` and `USDC_SAC_ADDRESS` configured in environment. Organizer holds testnet USDC. |
| :---- | :---- |
| **Test Steps** | 1. Fill form, select `USDC` as currency, set entry fee `5 USDC`. 2. Complete 2-step Freighter signing. |
| **Expected Result** | Contract initialized with USDC SAC address as `token`. Prize counter displays `0 USDC`. |
| **Severity** | High |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-ORG-008 - Double Initialization Protection (Re-initialization Attack)**

| Preconditions | Tournament contract already deployed and initialized. |
| :---- | :---- |
| **Test Steps** | 1. Call `initialize(...)` directly on the deployed contract address using a different organizer address. |
| **Expected Result** | Contract immediately reverts with `Error::AlreadyInitialized (#1)`. Admin and referee storage slots remain untouched. |
| **Severity** | Critical |
| **Required Evidence** | Cargo contract test output and invariant assertion logs. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-ORG-009 - Organizer Authorization Verification on Deployment**

| Preconditions | Pre-built `initialize` transaction specifying Organizer `A`, but signed by caller `B`. |
| :---- | :---- |
| **Test Steps** | 1. Submit transaction to Soroban RPC without Organizer `A`'s signature. |
| **Expected Result** | Transaction fails during simulation or submission due to missing `organizer.require_auth()`. |
| **Severity** | Critical |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-ORG-010 - Form Input Persistence & Session Recovery on Wallet Reject**

| Preconditions | Organizer fills complete form. |
| :---- | :---- |
| **Test Steps** | 1. Click "Create Tournament". 2. In Freighter popup, click "Reject" on Transaction 1. |
| **Expected Result** | Form inputs (title, fee, referee, deadline) remain populated; user receives a friendly toast "Transaction rejected by user" and can retry without retyping. |
| **Severity** | Medium |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

# **Player flow**

## **TC-PLY-001 - Successful Tournament Join & Fee Deduction (Happy Path)**

| Preconditions | Active tournament with `10 XLM` entry fee. Player Freighter wallet has `50 XLM`. |
| :---- | :---- |
| **Test Steps** | 1. Player opens `/tournaments/[id]`. 2. Connect Freighter wallet. 3. Click "Join Tournament" (or scan QR code). 4. In Freighter prompt, inspect and sign `join_tournament(player)` transaction. |
| **Expected Result** | Player's wallet balance decreases by `10 XLM` (+ tiny gas fee). Contract balance increases by `10 XLM`. Dynamic Prize Pool counter updates from `0 XLM` to `10 XLM`. Player's wallet address appears in Participant List. Button state flips to "Joined / Registered". |
| **Severity** | Critical |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-PLY-002 - Dynamic Prize Pool Incremental Scaling with Multiple Players**

| Preconditions | Active tournament with `5 XLM` entry fee. |
| :---- | :---- |
| **Test Steps** | 1. Player 1 joins with 5 XLM -> Verify pool = `5 XLM`, participants = 1. 2. Player 2 joins with 5 XLM -> Verify pool = `10 XLM`, participants = 2. 3. Player 3 joins with 5 XLM -> Verify pool = `15 XLM`, participants = 3. |
| **Expected Result** | Pool scales strictly linearly ($\text{Count} \times \text{Entry Fee}$). Every join emits a `("registered", player)` event with the exact cumulative pool value. |
| **Severity** | Critical |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-PLY-003 - Duplicate Registration Guard (Already Joined)**

| Preconditions | Player has already successfully joined tournament. |
| :---- | :---- |
| **Test Steps** | 1. Attempt to trigger `join_tournament(player)` a second time with the same wallet. |
| **Expected Result** | Web UI disables button ("Already Registered"). If invoked directly on-chain, contract reverts with `Error::AlreadyJoined (#9)`. No second fee is deducted. |
| **Severity** | Critical |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-PLY-004 - Insufficient Balance Rejection**

| Preconditions | Tournament entry fee is `100 XLM`. Player wallet only holds `10 XLM`. |
| :---- | :---- |
| **Test Steps** | 1. Click "Join Tournament" and attempt to sign transaction. |
| **Expected Result** | Soroban transaction simulation fails with SAC transfer error (insufficient funds). User receives clear error toast. No state change occurs. |
| **Severity** | High |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-PLY-005 - Registration Blocked at or After Settlement Deadline**

| Preconditions | Active tournament where current ledger time $\ge$ configured `settlement_deadline`. |
| :---- | :---- |
| **Test Steps** | 1. Attempt to join the tournament. |
| **Expected Result** | UI indicates "Registration Closed". Contract call reverts with `Error::DeadlineReached (#18)`. No entry fee pulled. |
| **Severity** | Critical |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-PLY-006 - Registration Blocked when Tournament is Cancelled**

| Preconditions | Tournament has been cancelled by Organizer. |
| :---- | :---- |
| **Test Steps** | 1. Attempt to join the cancelled tournament. |
| **Expected Result** | UI shows "Tournament Cancelled". Contract reverts with `Error::AlreadyCancelled (#8)`. |
| **Severity** | High |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-PLY-007 - Registration Blocked when Tournament is Finished**

| Preconditions | Tournament has been settled and finalized by Referee. |
| :---- | :---- |
| **Test Steps** | 1. Attempt to join the finished tournament. |
| **Expected Result** | UI displays "Tournament Completed". Contract reverts with `Error::AlreadyFinished (#7)`. |
| **Severity** | High |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-PLY-008 - Maximum Registration Ceiling Enforced (100 Players)**

| Preconditions | Tournament has reached `MAX_PLAYERS = 100` registered participants. |
| :---- | :---- |
| **Test Steps** | 1. A 101st unique player attempts to call `join_tournament(player)`. |
| **Expected Result** | Contract reverts with `Error::MaxPlayersReached (#17)`. Contract storage remains within Testnet safe bounded capacity. |
| **Severity** | High |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-PLY-009 - Join QR Code Parsing & Mobile/Direct Join Flow**

| Preconditions | Tournament detail page displayed on desktop. |
| :---- | :---- |
| **Test Steps** | 1. Display QR Code on tournament detail page. 2. Scan QR code from external device/browser. 3. Verify resolved URL is `/tournaments/[id]?action=join`. |
| **Expected Result** | Opens tournament view with Freighter connect / join modal automatically primed. |
| **Severity** | Medium |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-PLY-010 - Player Storage & Instance TTL Bump on Join**

| Preconditions | Tournament active, player joins. |
| :---- | :---- |
| **Test Steps** | 1. Inspect contract instance storage after join. |
| **Expected Result** | `Registered(player)` key set to `true`. `Players` vector contains address. Contract calls `extend_instance_ttl` up to `TESTNET_INSTANCE_TTL_EXTEND_TO_LEDGERS` (120 days) if below threshold. |
| **Severity** | Medium |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

# **Referee flow**

## **TC-REF-001 - Successful Match Finalization & Split Distribution (Happy Path)**

| Preconditions | Tournament has 5 registered players (`fee = 20 XLM`, `pool = 100 XLM`). Split is `[6000, 3000, 1000]`. Ledger time < deadline. |
| :---- | :---- |
| **Test Steps** | 1. Referee connects designated wallet address. 2. Navigates to `/tournaments/[id]/settle`. 3. Selects 1st Place (Player A), 2nd Place (Player B), 3rd Place (Player C) from registered candidate list. 4. Clicks "Submit Standings" and signs Freighter transaction invoking `finalize_results(A, B, C)`. |
| **Expected Result** | Contract transfers `60 XLM` to Player A. Contract transfers `30 XLM` to Player B. Contract transfers `10 XLM` to Player C. Contract escrow balance becomes `0 XLM`. Status becomes `Finished = true`. Emits short symbol event `("finalized", A, B, C)` with amounts `[60, 30, 10]`. Winners panel updates on public UI with links to Stellar.Expert explorer. |
| **Severity** | Critical |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-REF-002 - Deterministic Dust Allocation to 1st Place Winner**

| Preconditions | 7 players registered at `10 XLM` each (`Pool = 70 XLM = 700,000,000 stroops`). Split: 60%, 30%, 10%.   - 60% of 70 = 42 XLM   - 30% of 70 = 21 XLM   - 10% of 70 = 7 XLM   *(In uneven pools e.g. Pool = 101 XLM: 60% = 60.6, 30% = 30.3, 10% = 10.1; sum of integer division = 100; dust = 1).* |
| :---- | :---- |
| **Test Steps** | 1. Setup an odd pool producing integer remainder in integer division (`pool * bps / 10000`). 2. Referee finalizes results. |
| **Expected Result** | Remainder dust is strictly allocated to 1st place (`first_amt = amounts[0] + dust`). Total distributed tokens strictly equal $100\%$ of pool ($\sum \text{payouts} = \text{pool}$). Contract token balance is left at exactly `0`. |
| **Severity** | Critical |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-REF-003 - Non-Referee Unauthorized Settlement Rejection**

| Preconditions | Connected wallet is NOT the designated Referee address. |
| :---- | :---- |
| **Test Steps** | 1. Attempt to invoke `finalize_results(p1, p2, p3)`. |
| **Expected Result** | Transaction fails simulation or execution due to missing `referee.require_auth()`. No funds disbursed. |
| **Severity** | Critical |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-REF-004 - Reject Settlement with Non-Distinct Winners (Duplicate Winner)**

| Preconditions | Referee in settlement console. |
| :---- | :---- |
| **Test Steps** | 1. Select Player A for 1st Place AND Player A for 2nd Place. 2. Attempt to finalize. |
| **Expected Result** | UI validation prevents submission. Contract reverts with `Error::WinnersNotDistinct (#10)`. |
| **Severity** | High |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-REF-005 - Reject Settlement with Unregistered Winner Address**

| Preconditions | Referee enters an arbitrary wallet address that never registered for the tournament. |
| :---- | :---- |
| **Test Steps** | 1. Call `finalize_results` including the unregistered address. |
| **Expected Result** | Contract reverts with `Error::WinnerNotRegistered (#11)`. No transfers executed. |
| **Severity** | Critical |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-REF-006 - Reject Settlement at or After Settlement Deadline**

| Preconditions | Tournament ledger timestamp $\ge$ `settlement_deadline`. |
| :---- | :---- |
| **Test Steps** | 1. Referee attempts to finalize match standings after the deadline has elapsed. |
| **Expected Result** | Contract reverts with `Error::DeadlineReached (#18)`. Funds are preserved for player refund claims. |
| **Severity** | Critical |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-REF-007 - Double Finalization Protection**

| Preconditions | Tournament has already been successfully finalized. |
| :---- | :---- |
| **Test Steps** | 1. Attempt to call `finalize_results` a second time. |
| **Expected Result** | Contract reverts with `Error::AlreadyFinished (#7)`. |
| **Severity** | Critical |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-REF-008 - Reject Settlement on Cancelled Tournament**

| Preconditions | Organizer has cancelled the tournament. |
| :---- | :---- |
| **Test Steps** | 1. Referee attempts to finalize standings. |
| **Expected Result** | Contract reverts with `Error::AlreadyCancelled (#8)`. |
| **Severity** | High |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-REF-009 - Read-Only Helper `get_reward` Validation**

| Preconditions | Tournament finalized with known podium winners. |
| :---- | :---- |
| **Test Steps** | 1. Call read-only query `get_reward(player)`. |
| **Expected Result** | Returns exact calculated prize amount for 1st, 2nd, and 3rd place players, and returns `0` for any other participant or non-registered address. |
| **Severity** | Medium |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-REF-010 - Settlement Console Candidate Roster Accuracy**

| Preconditions | 5 players have joined the tournament. |
| :---- | :---- |
| **Test Steps** | 1. Referee opens `/tournaments/[id]/settle`. |
| **Expected Result** | Dropdowns for 1st, 2nd, and 3rd place only populate with the 5 registered participant addresses; selecting a candidate in one slot disables them in other slots. |
| **Severity** | Medium |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

# **Refund & cancellation**

## **TC-REFUND-001 - Organizer Cancellation Before Deadline (Happy Path)**

| Preconditions | Active tournament with 3 registered players (`30 XLM` in escrow). Before deadline. |
| :---- | :---- |
| **Test Steps** | 1. Organizer connects wallet. 2. Clicks "Cancel Tournament" on dashboard or detail page. 3. Signs transaction invoking `cancel_tournament()`. |
| **Expected Result** | Contract sets `Cancelled = true`. Emits `("cancelled", player_count)` event. UI updates badge to `CANCELLED`. Immediate refunds become available for all 3 players. |
| **Severity** | Critical |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-REFUND-002 - Non-Organizer Cancellation Rejection**

| Preconditions | Connected wallet is not the Organizer. |
| :---- | :---- |
| **Test Steps** | 1. Attempt to invoke `cancel_tournament()`. |
| **Expected Result** | Reverts with authorization error (`organizer.require_auth()` failure). |
| **Severity** | Critical |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-REFUND-003 - Cancellation Rejection at or After Deadline**

| Preconditions | Ledger timestamp $\ge$ `settlement_deadline`. |
| :---- | :---- |
| **Test Steps** | 1. Organizer attempts to call `cancel_tournament()`. |
| **Expected Result** | Reverts with `Error::DeadlineReached (#18)`. Post-deadline fallback takes precedence. |
| **Severity** | High |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-REFUND-004 - Permissionless Refund Claim on Cancelled Tournament**

| Preconditions | Tournament is cancelled. Player A paid `10 XLM`. |
| :---- | :---- |
| **Test Steps** | 1. Call `claim_refund(player_A)`. |
| **Expected Result** | Contract transfers `10 XLM` to Player A's address. `RefundClaimed(player_A)` set to `true`. Emits `RefundClaimed { player: player_A, amount: 10 XLM }` event. UI shows Player A's status as "Refunded". |
| **Severity** | Critical |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-REFUND-005 - Permissionless Refund Claim Post-Deadline (Unsettled Tournament)**

| Preconditions | Tournament was neither finalized nor cancelled, and ledger timestamp $\ge$ `settlement_deadline`. |
| :---- | :---- |
| **Test Steps** | 1. Player B clicks "Claim Refund" on the web page. 2. Transaction calls `claim_refund(player_B)`. |
| **Expected Result** | Because deadline is reached, contract permits the claim without organizer/referee intervention. Exactly `100%` of Player B's entry fee is returned to Player B's wallet. Escrow balance decrements by the refunded amount. |
| **Severity** | Critical |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-REFUND-006 - Reject Refund Claim Before Deadline on Non-Cancelled Tournament**

| Preconditions | Active tournament, not cancelled, current ledger timestamp < `settlement_deadline`. |
| :---- | :---- |
| **Test Steps** | 1. Player attempts to invoke `claim_refund(player)`. |
| **Expected Result** | Contract reverts with `Error::DeadlineNotReached (#14)`. No tokens moved. |
| **Severity** | Critical |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-REFUND-007 - Duplicate Refund Claim Prevention (Idempotency)**

| Preconditions | Player has already claimed their refund. |
| :---- | :---- |
| **Test Steps** | 1. Attempt to invoke `claim_refund(player)` again. |
| **Expected Result** | Contract checks `DataKey::RefundClaimed(player)` and reverts with `Error::RefundAlreadyClaimed (#16)`. Escrow cannot be drained twice. |
| **Severity** | Critical |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-REFUND-008 - Reject Refund for Non-Registered Address**

| Preconditions | Address never called `join_tournament`. |
| :---- | :---- |
| **Test Steps** | 1. Call `claim_refund(random_address)`. |
| **Expected Result** | Contract checks `DataKey::Registered(player)` and reverts with `Error::PlayerNotRegistered (#15)`. |
| **Severity** | High |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

# **Real-time feed & subscriber**

## **TC-LIVE-001 - Real-Time Prize Pool & Participant List Update over SSE**

| Preconditions | Spectator has tournament detail page open on browser. |
| :---- | :---- |
| **Test Steps** | 1. Another player joins the tournament via wallet transaction. 2. Observe spectator's browser screen without refreshing the page. |
| **Expected Result** | Background subscriber picks up the on-chain `registered` event. Pushes update through Redis to `/api/tournaments/[id]/events` SSE stream. Browser prize pool counter increments smoothly and participant avatar appears in real time. |
| **Severity** | High |
| **Required Evidence** | SSE event stream network payload and browser live UI inspection. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-LIVE-002 - Live Feed Reconnection & Event Replay on Network Blip**

| Preconditions | Tournament detail page connected to SSE. |
| :---- | :---- |
| **Test Steps** | 1. Disconnect network for 10 seconds, then reconnect. |
| **Expected Result** | Client `EventSource` automatically reconnects, replays missed contract events from PostgreSQL, and resynchronizes the prize pool count. |
| **Severity** | Medium |
| **Required Evidence** | SSE event stream network payload and browser live UI inspection. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-LIVE-003 - Subscriber Idempotent Event Processing**

| Preconditions | Subscriber running with Soroban RPC cursor. |
| :---- | :---- |
| **Test Steps** | 1. Restart subscriber worker or simulate duplicate RPC event payload. |
| **Expected Result** | Database `ContractEvent` table deduplicates using transaction hash/ledger sequence. No duplicate participants or pool amounts recorded. |
| **Severity** | High |
| **Required Evidence** | SSE event stream network payload and browser live UI inspection. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-LIVE-004 - Immediate Status Chip Reflection on Finalization or Cancellation**

| Preconditions | Viewing active tournament. |
| :---- | :---- |
| **Test Steps** | 1. Referee finalizes tournament on-chain. |
| **Expected Result** | Status chip immediately transitions from `ACTIVE` to `COMPLETED` and Podium Winners card renders without page refresh. |
| **Severity** | High |
| **Required Evidence** | SSE event stream network payload and browser live UI inspection. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-LIVE-005 - Explorer Link Verification**

| Preconditions | Tournament finalized. |
| :---- | :---- |
| **Test Steps** | 1. Click on transaction hash or winner address in Winners Panel. |
| **Expected Result** | Opens Stellar.Expert Testnet explorer pointing to the exact transaction envelope and recipient address. |
| **Severity** | Low |
| **Required Evidence** | SSE event stream network payload and browser live UI inspection. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

# **Platform admin**

## **TC-ADM-001 - Admin Authentication & Session Security**

| Preconditions | Admin credentials provisioned in `.env` (`ADMIN_USERNAME`, `ADMIN_PASSWORD`). |
| :---- | :---- |
| **Test Steps** | 1. Navigate to `/login`. 2. Input valid admin credentials. |
| **Expected Result** | Argon2 password verification succeeds; signed `httpOnly` secure JWT cookie created; user redirected to `/admin` dashboard. |
| **Severity** | High |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-ADM-002 - Role Hierarchy Enforcement (ADMIN vs ORGANIZER)**

| Preconditions | Logged in as Organizer. |
| :---- | :---- |
| **Test Steps** | 1. Attempt to directly access `/admin/users` or perform user role modifications. |
| **Expected Result** | System intercepts with `403 Forbidden` or redirects to standard dashboard. |
| **Severity** | High |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-ADM-003 - Platform Tournament Overview & Search/Filter**

| Preconditions | Multiple tournaments created across different states (Active, Completed, Cancelled). |
| :---- | :---- |
| **Test Steps** | 1. In `/admin`, search by tournament title, filter by status, and inspect contract IDs. |
| **Expected Result** | Data tables accurately filter and show all platform tournaments with pagination. |
| **Severity** | Medium |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-ADM-004 - Force Cancel Tournament from Admin Panel**

| Preconditions | Abandoned tournament with unresponsive organizer. |
| :---- | :---- |
| **Test Steps** | 1. Admin clicks "Cancel Tournament" in admin console. |
| **Expected Result** | Updates database status to cancelled; surfaces notification for participants to claim refunds. |
| **Severity** | Medium |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-ADM-005 - CSRF & Rate Limiting Protection**

| Preconditions | API endpoints active. |
| :---- | :---- |
| **Test Steps** | 1. Submit rapid requests (> 100 req/min) to `/api/tournaments` or attempt cross-site request without valid CSRF header. |
| **Expected Result** | Rate limiter (Redis) responds with `429 Too Many Requests`; CSRF guard rejects untrusted origin. |
| **Severity** | High |
| **Required Evidence** | Stellar.Expert Testnet explorer transaction link, contract test output, and UI state proof. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

# **Contract invariants & security**

## **TC-SEC-001 - Fund Conservation Invariant (Zero Leaked Stroops)**

| Preconditions | Preconditions verified according to spec. |
| :---- | :---- |
| **Test Steps** | $$\text{Contract Balance After Finalization} = 0$$ $$\text{Contract Balance After All Refunds} = 0$$ |
| **Expected Result** | At no point do tokens remain locked or trapped in the contract after all winners are paid or all players refunded. |
| **Severity** | Critical |
| **Required Evidence** | Cargo contract test output and invariant assertion logs. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-SEC-002 - Integer Arithmetic Overflow Protection**

| Preconditions | Preconditions verified according to spec. |
| :---- | :---- |
| **Test Steps** | Test large numbers (e.g., maximum supported stroop fee multiplied by 100 players). |
| **Expected Result** | Code uses `checked_mul`, `checked_add`, and `checked_div`. Release profile has `overflow-checks = true`. Never experiences silent integer wrap-around. |
| **Severity** | Critical |
| **Required Evidence** | Cargo contract test output and invariant assertion logs. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-SEC-003 - Soroban State Archival & Instance TTL Extension**

| Preconditions | Preconditions verified according to spec. |
| :---- | :---- |
| **Test Steps** | Invocations of `initialize`, `join_tournament`, `finalize_results`, `cancel_tournament`, and `claim_refund` invoke `extend_instance_ttl`. |
| **Expected Result** | Instance TTL threshold is bumped to `120 days` (well beyond the 90-day settlement deadline), preventing contract instance and data from becoming archived while funds are in escrow. |
| **Severity** | Critical |
| **Required Evidence** | Cargo contract test output and invariant assertion logs. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-SEC-004 - Storage Boundedness & State Bloat Guard**

| Preconditions | Preconditions verified according to spec. |
| :---- | :---- |
| **Test Steps** | Storage model maintains a capped vector `Vec<Address>` (`MAX_PLAYERS = 100`) and individual address-keyed keys `Registered(Address)`. |
| **Expected Result** | Transaction CPU/memory resource consumption remains well under Stellar Soroban transaction limits. |
| **Severity** | High |
| **Required Evidence** | Cargo contract test output and invariant assertion logs. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-SEC-005 - Absence of Custodial Withdrawal / Drain Backdoors**

| Preconditions | Preconditions verified according to spec. |
| :---- | :---- |
| **Test Steps** | Inspect contract ABI and bytecode for any `admin_withdraw`, `owner_drain`, or arbitrary transfer functions. |
| **Expected Result** | No withdraw function exists. Money leaves the contract **only** through verified winner payouts (`finalize_results`) or player refunds (`claim_refund`). |
| **Severity** | Critical |
| **Required Evidence** | Cargo contract test output and invariant assertion logs. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-SEC-006 - Reentrancy Invariant**

| Preconditions | Preconditions verified according to spec. |
| :---- | :---- |
| **Test Steps** | Verify state updates (`Finished = true`, `RefundClaimed = true`) relative to token transfer calls. |
| **Expected Result** | State flags are set, and Soroban native reentrancy guard prevents recursive call exploits. |
| **Severity** | Critical |
| **Required Evidence** | Cargo contract test output and invariant assertion logs. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

## **TC-SEC-007 - Safe Error Reporting (`panic_with_error!`)**

| Preconditions | Preconditions verified according to spec. |
| :---- | :---- |
| **Test Steps** | Trigger any failing condition in the contract. |
| **Expected Result** | Returns structured, typed error codes (`Error::#`) instead of bare uninformative panics, allowing client dApp to decode and display meaningful explanations to the user. |
| **Severity** | High |
| **Required Evidence** | Cargo contract test output and invariant assertion logs. |
| **Actual Result** |  |
| **Status** | Not Tested |
| **Evidence / Bug ID / Remarks** |  |

# **Final Project Execution Summary**

| QA environment / build |  |
| :---- | :---- |
| **Candidate commit / build ID** |  |
| **Stellar Testnet contract ID** |  |
| **Execution date** |  |
| **Tester** |  |
| **Passed / Failed / Blocked** |  |
| **Open Critical / High defects** |  |
| **Final verdict** | PROJECT PASS / FAIL / BLOCKED |
