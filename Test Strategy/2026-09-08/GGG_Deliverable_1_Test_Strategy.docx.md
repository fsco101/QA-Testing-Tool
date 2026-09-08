**GGG**

# **Deliverable 1 Test Strategy**

**Deadline-Enforced Escrow**

Good Game Guild  |  Week 1  |  Stellar Testnet  |  Soroban Tournament Escrow

| Purpose Define the high-level QA approach for GGG Deliverable 1 only: what must be verified, which risks receive the most coverage, how evidence is collected, and what conditions must be satisfied before the deadline-enforced escrow can be accepted. |
| :---- |

| PROJECT | GGG (Good Game Guild) |
| :---- | :---- |
| DELIVERABLE | 1 — Deadline-Enforced Escrow |
| REPOSITORY | https://github.com/webnxt-2030/ggg |
| CONTRACT CRATE | `contracts/escrow` (`ggg-escrow`, `soroban-sdk` 26) |
| NETWORK | Stellar Testnet |
| PRIMARY FUNCTION | `claim_refund(env: Env, player: Address)` |
| SPRINT FOCUS | Settlement deadline enforcement & permissionless refund claim |
| PASS CRITERIA | Refund succeeds at/after deadline, fails before it (`Error::DeadlineNotReached`), and both paths pass contract tests. |
| SOURCE | GGG Instawards One-Page Scope & GGG Core Codebase (`contracts/escrow`) |
| PREPARED | 08 September 2026 |
| SCOPE | Deliverable 1 only |

| Safety boundary • QA execution is limited to Stellar Testnet. • Mainnet deployment and Mainnet USDC are explicitly out of scope. • All tests and invariants are strictly cross-verified against `contracts/escrow/src/lib.rs` and `test.rs`. |
| :---- |

# **1\. Document Control and Source Basis**

This strategy is scoped to GGG Deliverable 1 and is grounded in the GGG Instawards One-Page Scope and verified against the production smart contract implementation in [`contracts/escrow/src/lib.rs`](file:///c:/Testing/contracts/escrow/src/lib.rs).

| Source | Used for |
| :---- | :---- |
| GGG Instawards — One-Page Scope | Authoritative Deliverable 1 purpose, scope, pass criteria, Testnet boundary, risk controls, and completion evidence. |
| GGG Repository (`webnxt-2030/ggg`) | Verified source of truth for contract interfaces, Rust test suite (`contracts/escrow/src/test.rs`), and data keys. |
| Contract Implementation (`lib.rs`) | Settlement deadline validation (`deadline_reached`), `claim_refund` logic, state keys (`DataKey::RefundClaimed`), and error codes (`Error::DeadlineNotReached = 14`, `Error::RefundAlreadyClaimed = 16`). |
| 30-Day Execution Plan — Week 1 | Expected output: contract builds; refund deadline and failure paths pass automated tests. |
| Key Risk Controls | Deadline refunds prevent indefinite fund lock; contract risk reduced through unit tests, invariant/failure checks, integration testing, and documented risks. |

Repository and Contract Grounding:
* **Contract Crate:** `contracts/escrow` (package name: `ggg-escrow`, version: `0.1.0`).
* **Primary Interface:** `pub fn claim_refund(env: Env, player: Address)`.
* **Deadline Check:** `env.ledger().timestamp() >= deadline`. Anyone may submit this claim permissionlessly, but funds always transfer to the registered `player`.
* **Active Automated Suite:** 49 unit tests in `contracts/escrow/src/test.rs` covering deadline boundaries, idempotency, event emissions, and authorization guards.urce material.

# **2\. Purpose, Quality Objective, and Success Definition**

The purpose of Deliverable 1 QA is to establish confidence that GGG’s tournament escrow no longer depends indefinitely on an organizer or referee to release eligible funds when a tournament is not finalized or cancelled.

Primary quality objective: verify the deadline-enforced refund path as a money- and state-safety control. Before the deadline, the permissionless refund claim must be rejected. After the deadline, the intended eligible refund path must succeed without corrupting escrow state or allowing duplicate refunds.

| Success condition | D1 target |
| :---- | :---- |
| Deadline is enforced | The escrow has a clear settlement deadline that controls when the fallback refund path becomes available. |
| Before-deadline protection | claim\_refund\_after\_deadline() fails before the settlement deadline. |
| After-deadline recovery | claim\_refund\_after\_deadline() succeeds after the deadline for the intended unresolved condition. |
| Permissionless recovery | The fallback does not require an inactive organizer/referee to trigger the eligible refund. |
| Failure-path safety | Rejected/invalid refund attempts do not partially mutate escrow funds or tournament state. |
| Edge-case coverage | Boundary timing and relevant invalid-state cases are covered. |
| Contract evidence | Both pass and fail paths are demonstrated by the contract test suite. |

| D1 boundary rule The strategy covers only the deadline-enforced escrow change and the regression needed to prove it did not break affected existing escrow behavior. Single-transaction deploy/init, N-winner payouts, TTL/storage hardening, SDK publishing, and live SDK redeployment belong to later deliverables. |
| :---- |

# **3\. Scope and Boundaries**

In scope \- only functionality required to prove Deliverable 1 and its pass criteria:

* Add and verify the settlement deadline used by the escrow contract.  
* Permissionless claim\_refund\_after\_deadline() behavior when a tournament was not finalized or cancelled, using the wording of the provided scope.  
* Before-deadline rejection and after-deadline success behavior.  
* Exact/boundary timing behavior around the configured settlement deadline.  
* Failure paths and edge cases directly related to deadline eligibility and refund execution.  
* State and balance integrity after rejected refund attempts.  
* Repeat/replay behavior after a successful refund so a second refund cannot occur.  
* Regression coverage for existing escrow behavior affected by the deadline/refund modification.  
* Contract-test evidence demonstrating both positive and negative paths.

Out of scope for this document:

* Deliverable 2: single-transaction deploy and initialize, configurable N-winner payouts, TTL bumping/storage validation, get\_players(), and get\_tournament() helpers.  
* Deliverable 3: @ggg/escrow-sdk@0.1.0, client/transaction builders/validators, README, Node.js example, and SDK-based live reference deployment.  
* Week 4 full end-to-end validation and final public integration package, except where D1 evidence is carried forward.  
* Mainnet deployment and Mainnet USDC.  
* Multi-wallet support beyond Freighter.  
* Third-party security audit.  
* Broader gaming-platform expansion.  
* Marketing, operations, airdrops, subscriptions, or business development.

# **4\. Selected Test Strategy**

GGG Deliverable 1 uses a layered strategy because the escrow is stateful, time-dependent, and controls funds. The selected strategy types are intentionally limited to the four approaches that directly support this risk profile.

| Strategy type | Role in D1 | How it is applied |
| :---- | :---- | :---- |
| Analytical | Primary | Prioritize the highest-risk outcomes: funds remain locked after the deadline, refund happens too early, wrong state is accepted, funds/state mutate on failure, or a refund can happen twice. |
| Model-Based | Primary support | Use the tournament/escrow lifecycle and ledger-time transition to derive allowed and forbidden refund states before, at, and after the deadline. |
| Reactive | Supporting | Expand tests around newly discovered timing, state-transition, replay, or mutation defects during execution. |
| Regression-Averse | Critical | Re-run affected existing escrow tests after every deadline/refund change so the new fallback path does not break working tournament behavior. |

# **5\. Release Control and QA Gate**

Deliverable 1 should be tested against one identifiable release candidate. A PASS is valid only for the exact contract/build version that was executed. Any code or contract change after the pass requires focused retest plus regression against the new version.

| Stage | Required control |
| :---- | :---- |
| Implementation complete | Deadline/refund changes are available in a testable contract build and the intended expected behavior is defined. |
| Build identification | Record the exact commit/build/contract identity available to QA before the final pass. |
| Automated preflight | Contract builds and the Deliverable 1 contract tests run successfully before manual/independent verification begins. |
| Manual/QA pass | Verify the full D1 matrix against the same identified build/environment. |
| PASS | Record evidence for before-deadline rejection, after-deadline success, edge/failure paths, and regression. |
| FAIL | Record expected vs observed behavior, evidence, environment/build identity, and return the defect to development for correction. |

| Gate chain • Contract build / automated tests → manual D1 QA against one identified build → defect retest and regression if needed → D1 PASS/FAIL.• A green automated test suite supports the verdict but does not replace independent verification of the required D1 behavior. |
| :---- |

# **6\. Test Methodology and Levels**

Execution order: smoke/preflight → after-deadline happy path → before-deadline negative path → exact-boundary tests → invalid-state/failure tests → replay/idempotency → affected escrow regression → evidence review.

| Test method | D1 purpose | Examples |
| :---- | :---- | :---- |
| Smoke / build verification | Confirm the candidate contract is testable before deeper QA. | Contract builds; required test environment is available. |
| Functional / happy path | Prove the intended fallback works. | Applicable unresolved tournament \+ deadline passed → claim\_refund\_after\_deadline() succeeds. |
| Negative testing | Prove invalid early or ineligible claims are rejected. | Before deadline; wrong state; invalid caller/input if applicable. |
| Boundary testing | Find timing comparison defects. | Just before, exact deadline, just after, based on the contract’s implemented comparison rule. |
| State-transition testing | Prove only valid lifecycle states can move into refund. | Unresolved vs finalized/cancelled/settled states as defined by the contract. |
| Replay / idempotency | Prevent a second payout/refund after success. | Repeat claim after a successful refund. |
| Invariant / state-integrity testing | Verify rejected calls have no harmful side effects. | Compare balances/storage before and after failed invocation. |
| Integration / Testnet | Validate deployed contract behavior when a Testnet candidate is available. | Invoke contract on Stellar Testnet and retain transaction evidence. |
| Regression testing | Protect working escrow behavior. | Affected create/join/settle/cancel lifecycle checks. |
| Exploratory testing | Follow suspicious timing/state behavior discovered during QA. | Neighboring timestamps, state combinations, repeated calls. |

# **7\. D1 Deadline / Refund Model and Coverage Logic**

The model below is used to derive tests and to identify the exact point where an invalid refund must stop without changing escrow funds or state.

| Step | State / control | QA invariant |
| :---- | :---- | :---- |
| 1 | Tournament/escrow created and funded | Existing pre-deadline lifecycle remains valid and funds are controlled by the escrow. |
| 2 | Settlement deadline configured | Deadline value is stored/read consistently and is the authoritative timing gate for the fallback. |
| 3 | Before deadline | claim\_refund\_after\_deadline() must reject. No refund and no harmful state mutation. |
| 4 | Exact boundary | Behavior must match the contract’s defined comparison semantics and remain deterministic. |
| 5 | After deadline \+ eligible unresolved condition | Permissionless refund path becomes available. |
| 6 | Successful refund | Expected participant funds are returned according to contract rules and resulting state is correct. |
| 7 | Repeat claim after success | Must not create a second refund or inconsistent state. |
| 8 | Invalid/ineligible state | Must fail safely even if the deadline has passed. |
| 9 | Regression check | Affected existing escrow lifecycle still behaves correctly after the new fallback logic. |

# **8\. Test Environment Specification**

| Area | D1 QA requirement |
| :---- | :---- |
| Network | Stellar Testnet for any deployed/integration proof. Mainnet is excluded. |
| Contract platform | Soroban tournament escrow. |
| Build identity | Exact commit/build/contract ID or equivalent release identity must be captured if available. |
| Ledger time control | Contract test environment must allow deterministic manipulation/advancement of ledger timestamp/sequence needed for before/at/after-deadline cases. |
| Tournament fixtures | Fixtures for eligible unresolved tournament, pre-deadline state, post-deadline state, and invalid/ineligible states. |
| Funded escrow data | Sufficient test assets/funds to prove balance movement and no-mutation on failed paths. |
| Regression baseline | Existing affected escrow tests must be runnable so D1 can prove it did not break working behavior. |
| Evidence capture | Test logs/output, public Testnet transaction links when available, and build/contract identity. |
| Secrets hygiene | No private keys, seed phrases, credentials, or sensitive raw logs in the QA evidence package. |

# **9\. Test Tools and Evidence Sources**

| Tool / source | Use in D1 |
| :---- | :---- |
| Soroban contract test framework | Primary deterministic validation of deadline, refund, edge, and failure paths. |
| Rust/Cargo test runner (if used by the repository) | Run the contract’s automated test suite and retain pass/fail output. |
| Stellar / Soroban CLI (if used by the repository) | Build, deploy, invoke, and inspect Testnet contract behavior. |
| Stellar Explorer / transaction links | Publicly reviewable evidence of Testnet contract invocation when D1 is deployed. |
| Contract/build identifiers | Bind QA evidence to the exact implementation tested. |
| GitHub / project issue tracker | Defect records, acceptance clarifications, retest evidence, and final QA verdict when repository access is available. |
| GGG One-Page Scope | Controls the D1 acceptance requirements used by this strategy. |

# **10\. Risk Analysis and Prioritization**

Deliverable 1 uses risk-based prioritization. Fund availability, timing authorization, state integrity, and duplicate refund prevention receive the deepest coverage and block release on any unresolved critical failure.

| Risk | Severity | Why it matters | Required mitigation / QA focus |
| :---- | :---- | :---- | :---- |
| Eligible funds remain locked after organizer/referee inactivity | Critical | This is the primary gap D1 exists to close. | Prove post-deadline permissionless refund succeeds under the intended unresolved condition. |
| Refund succeeds before deadline | Critical | Funds can leave earlier than the escrow rules allow. | Before-deadline and exact-boundary negative tests; verify no mutation on failure. |
| Deadline comparison off by one boundary | High | A one-step timing bug can turn a valid/invalid refund into the opposite outcome. | Just-before / exact / just-after deterministic ledger-time tests. |
| Refund allowed from ineligible state | Critical | Funds may be returned when the tournament should follow a different lifecycle. | Model-based state negative tests using the final contract rules. |
| Successful refund can be repeated | Critical | Could duplicate fund movement. | Repeat/replay test after first success; verify no second refund. |
| Rejected call partially mutates state or balance | Critical | Can corrupt accounting even though the function reports failure. | Snapshot/compare storage and balances around failed calls. |
| Deadline change regresses working escrow behavior | High | Fixing one failure mode can break existing create/join/settle/cancel flows. | Regression suite over affected lifecycle behavior. |
| Wrong build/network/contract is tested | High | A PASS becomes meaningless if evidence is not bound to the actual candidate. | Record Testnet and exact build/contract identity. |
| Eligibility wording remains ambiguous | High | QA cannot determine expected state behavior reliably. | Block sign-off on ambiguous scenarios until the contract/spec clarifies the accepted states. |
| Sensitive evidence is exposed | High | Keys/credentials could compromise test resources. | Redact all private material; use only public IDs and transaction links. |

# **11\. Deliverable 1 Coverage Matrix**

| Issue / area | Manual QA focus | Required evidence |
| :---- | :---- | :---- |
| Settlement deadline | Deadline exists and controls fallback eligibility. | Build/contract identity \+ test output showing timing gate. |
| claim\_refund\_after\_deadline() | Permissionless fallback behaves as defined. | Successful post-deadline contract test/invocation. |
| Before deadline | Refund claim is rejected. | Negative contract-test result \+ unchanged state/balances. |
| After deadline | Refund claim succeeds for intended unresolved condition. | Positive test \+ returned funds/state result. |
| Exact boundary | Comparison semantics are deterministic. | Just-before/exact/just-after results. |
| Invalid state | Ineligible state is rejected safely. | Negative test \+ no harmful mutation. |
| Replay / duplicate | Second refund cannot occur. | Repeat-call result \+ balance/state verification. |
| Failure-path expansion | Relevant invalid timing/state paths are covered. | Automated suite output. |
| Regression | Affected existing escrow lifecycle remains green. | Regression test results. |

# **12\. Critical Strategy-Level Scenarios**

These are the minimum high-risk scenarios the detailed D1 test cases/checklist should cover. They are strategy-level scenarios, not a replacement for step-by-step test cases.

| ID | Scenario |
| :---- | :---- |
| D1-S01 | Valid eligible tournament, well before deadline → refund-after-deadline is rejected. |
| D1-S02 | Valid eligible tournament, one unit/ledger step before deadline → rejected. |
| D1-S03 | Exact deadline boundary → result matches the contract’s documented comparison semantics. |
| D1-S04 | Valid eligible tournament, immediately after deadline → refund succeeds. |
| D1-S05 | Valid eligible tournament, well after deadline → refund succeeds. |
| D1-S06 | Rejected pre-deadline call leaves balances unchanged. |
| D1-S07 | Rejected pre-deadline call leaves tournament/escrow storage unchanged except allowed non-business bookkeeping, if any. |
| D1-S08 | Successful refund updates expected state and balances exactly once. |
| D1-S09 | Repeat claim after successful refund → no second refund. |
| D1-S10 | Deadline passed but tournament state is not eligible for this fallback → reject safely. |
| D1-S11 | Finalized tournament \+ deadline passed → refund-after-deadline follows the final contract rule and does not bypass settlement. |
| D1-S12 | Cancelled tournament \+ deadline passed → behavior follows the final contract rule; no contradictory second fund movement. |
| D1-S13 | Malformed/invalid identifier or missing tournament, if callable by interface → reject without mutation. |
| D1-S14 | Unauthorized assumption check: permissionless means no organizer/referee signature is required for the eligible fallback. |
| D1-S15 | Multiple eligible refund callers/participants are handled according to contract rules without stealing another participant’s refund. |
| D1-S16 | Contract state remains internally consistent after a failed refund attempt. |
| D1-S17 | Existing create flow still works after the D1 change. |
| D1-S18 | Existing join/funding flow still works after the D1 change. |
| D1-S19 | Existing settle/finalize flow still works after the D1 change. |
| D1-S20 | Existing cancel/refund behavior that overlaps D1 does not conflict with the new fallback. |
| D1-S21 | Automated contract suite includes both required pass and fail deadline paths. |
| D1-S22 | All D1 evidence is bound to Stellar Testnet and the exact candidate build/contract identity. |

# **13\. Entry and Exit Criteria**

Entry criteria \- all must be true before the final Deliverable 1 QA pass begins:

* Deliverable 1 implementation is available in a testable Soroban contract build.  
* The settlement deadline and claim\_refund\_after\_deadline() expected behavior are defined sufficiently to determine pass/fail results.  
* The contract builds successfully and the relevant automated tests are runnable.  
* The test environment can deterministically control or advance ledger time for before/at/after deadline scenarios.  
* Required tournament/escrow fixtures and test funds/assets are available.  
* Affected existing escrow regression tests are runnable.  
* The candidate build/contract identity and Stellar Testnet environment are recorded before final execution.  
* Any known ambiguity about eligible unresolved states is documented and resolved enough for the required tests.

Exit criteria \- all must be true to record Deliverable 1 PASS:

* Refund succeeds after the deadline for the intended eligible unresolved condition.  
* Refund fails before the deadline.  
* Boundary behavior is deterministic and matches the contract’s defined comparison rule.  
* Failed refund attempts do not incorrectly mutate escrow funds or tournament state.  
* Repeat/replay checks do not produce a second refund.  
* Relevant invalid/ineligible states are rejected safely.  
* Expanded edge-case and failure-path contract tests are green.  
* Affected existing escrow regression tests remain green.  
* No unresolved Critical/High defect remains that changes the D1 money/state acceptance result.  
* Required build/Testnet/test evidence is complete and redacted.

# **14\. Defect Management, Severity, and Retest**

On failure, QA records the failing scenario, expected result, observed result, reproducible setup, evidence, network/build/contract identity, and the affected money/state consequence. The implementation is returned for correction; QA then performs focused retest plus affected regression before changing the verdict.

| Severity | Definition for D1 | Examples / release action |
| :---- | :---- | :---- |
| Critical | Unsafe or incorrect fund/state behavior. | Early refund, permanent lock after eligible deadline, duplicate refund, wrong-state refund, harmful partial mutation. Release blocker. |
| High | Major acceptance, boundary, regression, or evidence failure. | Boundary inconsistency, broken affected lifecycle, unverifiable build/contract identity, unresolved state-rule ambiguity. Normally blocks D1 PASS. |
| Medium | Non-critical issue with a safe workaround and no incorrect fund movement. | Non-blocking operator/test friction or message inconsistency. |
| Low | Cosmetic/non-functional issue outside D1 money/state acceptance. | Does not normally block Deliverable 1\. |

Retest rule: a fix must pass the original failing scenario, neighboring boundary/state scenarios, and the affected regression set. If the candidate implementation changes, the final evidence must be re-bound to the new build/contract identity.

# **15\. Roles, Responsibilities, and Review**

| Role | D1 responsibility |
| :---- | :---- |
| Developer / contract owner | Implements deadline/refund logic, supplies a testable build, maintains contract tests, fixes defects, and clarifies intended state rules. |
| QA tester | Builds the D1 test cases from this strategy, independently executes required scenarios, records evidence, reports defects, and retests fixes. |
| Project / repository owner | Confirms acceptance interpretation when requirements are ambiguous and decides release/risk acceptance. |
| Automated test suite | Provides repeatable evidence for deadline, failure, edge, and regression behavior; supports but does not replace QA judgment. |
| Stakeholder / reviewer | Reviews the evidence package to confirm D1’s refund-deadline claim is understandable and reproducible. |

# **16\. Metrics, Reporting, and Test Deliverables**

| Metric / output | D1 expectation |
| :---- | :---- |
| Required acceptance paths | 100% executed: after-deadline success \+ before-deadline failure. |
| Critical boundary scenarios | All just-before / exact / just-after cases executed. |
| Critical negative scenarios | All money/state P0 scenarios executed with no unresolved failure. |
| Contract-test status | Deliverable 1 positive, failure, and relevant regression tests green. |
| Defect reporting | Every failure has expected vs observed result, reproduction setup, severity, and evidence. |
| Evidence traceability | Every final result is tied to Stellar Testnet and the exact tested build/contract identity when available. |
| Final verdict | PASS / FAIL / HOLD with blockers and residual risks stated clearly. |

Expected D1 QA deliverables:

* This Test Strategy document.  
* Detailed Deliverable 1 test cases / execution checklist.  
* Test execution results and defect/retest records.  
* Automated contract-test evidence for before- and after-deadline paths.  
* Boundary and state-integrity evidence.  
* Public Testnet transaction/contract links when a deployed D1 candidate is available.  
* Final QA verdict with exact environment/build/contract identity and residual risks.

# **17\. Known Constraints, Residual Risks, and Change Control**

The strategy intentionally records limitations instead of treating them as invisible. A green D1 result proves the supplied acceptance scope; it is not a third-party security audit or a proof that every possible smart-contract risk has been eliminated.

| Constraint / residual risk | D1 treatment |
| :---- | :---- |
| Repository not exposed through current GitHub connection | Do not invent branch/file/test-command details. Use the provided scope as the controlling source until repository access is available. |
| Eligibility wording is high level | The source says refund after deadline when a tournament was not finalized or cancelled. Detailed state semantics must come from the final contract/spec before sign-off on ambiguous states. |
| Exact deadline comparison not specified in one-pager | QA must derive the expected equality behavior from the implemented/documented contract rule, then test just-before/exact/just-after. |
| Third-party security audit is out of scope | D1 uses contract tests, invariant/failure checks, integration testing, and documented risks, but does not claim formal audit assurance. |
| Mainnet is out of scope | No QA result in this document authorizes Mainnet deployment or Mainnet USDC. |
| Broader SDK / one-transaction / N-winner work is later scope | Do not fail or pass D1 based on Deliverable 2/3 features unless they directly break the D1 refund behavior. |
| External Stellar/Testnet availability | QA verifies GGG’s handling and evidence; it cannot guarantee third-party network uptime. |

| Change-control rule • This document is a strategy, not a frozen claim that the code already passes.• If Deliverable 1 requirements, eligibility rules, deadline semantics, or contract interfaces change, update the detailed test cases and this strategy where the high-level risk/coverage model is affected.• A code or contract change after a pass requires retest and affected regression on the new candidate. |
| :---- |

# **Appendix A. Final Manual QA Evidence Checklist**

☐ Stellar Testnet environment recorded.

☐ Exact candidate build/commit/contract identity recorded, if available.

☐ Contract build and automated tests green.

☐ Settlement deadline value/behavior confirmed.

☐ Before-deadline refund attempt rejected.

☐ Just-before-deadline boundary result verified.

☐ Exact-deadline boundary result verified against the contract rule.

☐ Just-after-deadline refund result verified.

☐ After-deadline eligible refund succeeds.

☐ Failed attempts leave balances/state unchanged.

☐ Ineligible-state attempts reject safely.

☐ Repeat claim after successful refund does not pay twice.

☐ Permissionless fallback does not require inactive organizer/referee authorization.

☐ Affected create/join/settle/cancel regression checks are green.

☐ Edge-case and failure-path contract tests are green.

☐ Any Testnet transaction/contract evidence is public and reviewable.

☐ Evidence contains no private keys, seeds, credentials, or sensitive raw logs.

☐ Open Critical/High defects and residual risks are recorded.

☐ Final PASS / FAIL / HOLD is tied to the exact candidate tested.

# **Appendix B. Source References**

* GGG Instawards — One-Page Scope (provided PDF).  
* Deliverable 1: Deadline-enforced escrow — settlement deadline and permissionless claim\_refund\_after\_deadline().  
* Pass criteria: refund succeeds after the deadline, fails before it, and both paths pass contract tests.  
* Week 1 expected output: contract builds; refund deadline and failure paths pass tests.  
* Repository lookup result: verified against `https://github.com/webnxt-2030/ggg`, smart contract crate `contracts/escrow/src/lib.rs`, and test harness `contracts/escrow/src/test.rs`.