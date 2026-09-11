Test the project’s deployed staging version using Playwright and other staging-accessible verification methods when required by the test case.

Use the attached test cases file as the basis for testing:

`[ATTACH TEST CASES FILE HERE]`

---

## 1. Review and classify all test cases

Review every test case before execution.

Classify each test case as:

### UI Testing
Keep test cases where Playwright can perform the required actions and verify the expected behavior through the deployed staging application.

**Examples:**
* Navigation
* Login / logout
* Forms
* Buttons and links
* Validation
* User workflows
* Role-based UI behavior
* Displayed data
* Modals
* Notifications
* Redirects
* Search / filter / sort
* File uploads
* UI-triggered transactions
* Any functionality whose result can be verified through the browser

### Non-UI Staging Testing
Keep test cases that verify real behavior produced by staging but whose final proof is outside the UI.

**Examples:**
* On-chain transaction proof
* Testnet transaction status
* Blockchain explorer evidence
* Wallet transaction history
* External payment / provider records
* Staging API results tied to a staging action
* Other externally observable staging-generated results

> [!NOTE]
> If staging performs a transaction and the test requires on-chain proof, verify the matching transaction and capture evidence.

### Local/Unit-Only
Remove test cases specifically intended for:
* Unit testing
* Local or localhost testing
* Local database testing
* Running the application locally
* Repository-only validation
* Code inspection only
* Developer-only local harnesses
* Local workers or schedulers
* Local application scripts
* Code-level regression suites that do not exercise staging

> [!IMPORTANT]
> **Do not execute these tests.**  
> Keep a short applicability record listing removed test case IDs and why they were removed.  
> Do not remove a test simply because it is non-UI. If it can be exercised or verified against the deployed staging system, keep it.

---

## 2. Test only the deployed staging system

**Do not:**
* Run the application locally.
* Test against localhost.
* Perform unit testing.
* Use a local database.
* Use local application behavior as staging evidence.
* Use repository inspection alone as evidence.
* Use local test harnesses as proof of staging behavior.
* Use CI/build results as staging evidence.

Testing tools may run from the tester's computer, but the system being tested must be the deployed staging environment.

---

## 3. QA/testing only — do not modify the project

This task is strictly for QA and testing.

**Do not:**
* Edit source code
* Fix bugs directly
* Modify application logic
* Modify configuration files
* Change dependencies
* Modify database schemas or migrations
* Commit changes
* Push changes
* Create or push branches
* Open or merge pull requests
* Cherry-pick commits
* Deploy changes
* Modify the staging deployment

If a bug is discovered, document it in the test result and evidence. Do not fix it.  
Normal user-generated data created through expected staging workflows is allowed.

---

## 4. Always preserve the provided test case format

Always use the format, structure, layout, and organization of the test cases file provided by the user.

Do not redesign or replace the existing test case template.

**Preserve, as applicable:**
* Column names
* Column order
* Test Case IDs
* Test Case titles / scenarios
* Preconditions
* Test steps
* Expected results
* Testing technique / type fields
* Priority
* Existing remarks fields
* Existing evidence fields
* Sheet structure
* Table formatting
* General document layout

Put the testing results directly into the appropriate existing fields of the provided test case format.

For example, populate the provided fields for:
* **Status/Result**
* **Actual Result**
* **Evidence**
* **Remarks**

If the source file uses slightly different names for these columns, use the existing column names instead of unnecessarily creating new ones.

Do not create a completely different test case format just because another format may look better.

### UI and Non-UI separation
UI and Non-UI testing must still remain clearly separated.  
* If the original file already has separate sections or sheets, use them.
* If separation is necessary but the original file does not provide it, create separate **UI Testing** and **Non-UI Testing** sections/sheets while keeping the exact same test case column structure, formatting, and style from the provided file.

Do not redesign the test matrix.

---

## 5. Execute all retained test cases

Execute all staging-applicable test cases.

### UI Tests
Use Playwright against the deployed staging application.  
Playwright should perform actions whenever it reasonably can, including:
* Clicking buttons
* Entering provided credentials
* Filling forms
* Selecting options
* Uploading files
* Submitting forms
* Creating accounts
* Navigating workflows
* Switching available roles/accounts
* Confirming dialogs
* Performing normal user actions
* Triggering transactions
* Following redirects
* Checking notifications and statuses

Do not stop merely because a step is described as a user action if Playwright can perform it.

### Non-UI Tests
Use an appropriate staging-accessible verification source, such as:
* Blockchain explorer
* Public testnet
* Wallet history
* Payment provider staging/sandbox record
* Deployed staging API
* Other external proof directly connected to the staging action

Evidence must be traceable to the staging operation being tested.

---

## 6. Status rules

Use the most accurate status:

* **PASS** — All material expected results were verified.
* **FAIL** — The test was properly executed against staging, but the observed result did not match the expected result.
* **BLOCKED** — A required staging dependency or verification mechanism is unavailable.
* **NOT RUN** — The applicable test has not yet been executed.
* **N/A** — The test genuinely does not apply to the current staging deliverable.
* **PARTIALLY PASSED** — Some expected behavior worked, but at least one material result was incomplete or incorrect.
* **PENDING USER ACTION** — A genuinely human-only action is required and cannot reasonably be completed by Playwright or another available staging mechanism.

> [!WARNING]
> Do not mark **PASS** until all material expected behavior has been verified.

---

## 7. PENDING USER ACTION rule

Think carefully before using **PENDING USER ACTION**.  
Do not use it simply because the test requires a user action.  
If Playwright can perform the action, perform it and continue.

**Playwright can normally:**
* Click buttons
* Fill forms
* Enter provided credentials
* Select options
* Upload provided files
* Create accounts
* Submit forms
* Trigger normal UI transactions
* Confirm dialogs
* Navigate workflows

**Ask me only when something genuinely requires human-only input, such as:**
* Missing credentials
* OTP / 2FA
* CAPTCHA / human verification
* Manual wallet signing outside Playwright
* Approval from another person / account
* Permission only I can grant
* Physical-device interaction

Before asking, consider whether another legitimate staging-accessible method can complete the test.  
Do not bypass security controls.

---

## 8. Avoid false failures

Before marking **FAIL**, check whether the issue could be caused by:
* Missing access
* Incorrect test data
* Temporary loading
* Network instability
* Timing
* External provider delay
* A step Playwright can perform
* Required human input not yet requested

Resolve the condition where possible and retry once.  
Only mark **FAIL** when staging has been properly exercised and the product still does not meet the expected result.

---

## 9. Access and assistance

Do not request unnecessary backend or infrastructure access such as:
* `DATABASE_URL`
* `CRON_SECRET`
* Direct database access
* Server environment variables
* Backend secrets
* Production credentials
* Production signing keys

Ask only for information or assistance genuinely required to complete the staging test.

---

## 10. Playwright execution

Wait for the correct application state instead of relying on unnecessary fixed delays.

**Wait for:**
* Elements becoming visible
* Navigation completing
* Content loading
* Buttons becoming enabled
* Requests completing
* Status changes appearing
* Confirmation messages displaying

> [!TIP]
> Use separate browser contexts when testing different users or roles (e.g. Organizer vs. Referee vs. Player).

---

## 11. Evidence

Both UI and Non-UI tests should include evidence when applicable.

### UI Evidence Example
`TC-LOGIN-001_01.png`

### Non-UI Evidence Examples
`TC-PAYMENT-010_OnChain_01.png`  
`TC-PAYOUT-012_Testnet_01.png`

### Formatting Rules in the Test Case File
* In the **Evidence** field, put **only the evidence filename(s)**.  
  Example: `TC-PAYMENT-010_OnChain_01.png`
* Do not put long explanations in Evidence.
* The actual screenshot or evidence file will be manually inserted into the test case document afterward.

---

## 12. Actual Result and Remarks

Populate the **Actual Result** field using the format already provided in the source test cases.

* **Actual Result:** Briefly state what actually happened.  
  *Example:* `The transaction was submitted successfully from staging and appeared on the testnet with a successful status.`

* **Remarks:** Use Remarks for the short conclusion or exact failure point.  
  *PASS Example:* `Function works as expected.`  
  *FAIL Example:* `Failed at Step 5 — the expected confirmation message was not displayed.`  
  *Non-UI Example:* `Transaction completed successfully and on-chain proof was verified.`

> [!IMPORTANT]
> Do not change the product to make a failed test pass. Record the defect instead.

---

## 13. Protect staging data

Avoid unnecessarily changing shared staging data.  
Create, modify, or delete only data required by the test.

**Prefer:**
* Dedicated test accounts
* Unique test references
* Staging test data
* Reversible actions

---

## 14. Create a new folder for every testing run

Every testing run must have its own new main folder.

**Folder Structure Example:**
```text
Staging_Test_2026-09-11_Run_01/
│
├── Updated_Staging_Test_Cases.xlsx
│
└── Evidence/
    ├── UI/
    │   ├── TC-LOGIN-001_01.png
    │   └── ...
    │
    └── Non_UI/
        ├── TC-PAYMENT-010_OnChain_01.png
        └── ...
```

* Do not mix files or evidence from different testing runs.
* Every evidence filename referenced in the test cases file must exist inside the same testing-run folder.

---

## 15. Updated test cases file

* Do not modify the original source test cases file.
* Create a new copy for the current testing run.

**Most importantly:**
* Use the provided test cases file as the template for the updated file.
* Do not recreate the test cases using a different template.
* Enter the testing results directly into the same format provided.

**For every retained test case, populate the applicable existing fields with:**
* **Status/Result**
* **Actual Result**
* **Evidence filename(s)**
* **Remarks**

**Keep the original:**
* IDs
* Test scenarios
* Preconditions
* Steps
* Expected results
* Column arrangement
* Formatting
* Structure

*(unless a correction is genuinely necessary)*

Remove local/unit-only cases from the updated staging copy while keeping the original source file unchanged.

---

## 16. Required deliverables

Provide one complete folder for the testing run containing:

```text
Testing_Run_Folder/
├── Updated_Staging_Test_Cases.xlsx (or .docx as provided)
└── Evidence/
    ├── UI/
    └── Non_UI/
```

Also include the **applicability record** for removed local/unit-only cases either in the updated test case file or as a separate file in the same folder.

---

## Important Quick-Reference Checklist

* **This is QA/testing only.**
* **Never change or push project code.**
* **Always use the format of the provided test cases file.**
* **Put the testing results directly into that existing format.**
* **Do not redesign the test case matrix.**
* **Preserve the existing columns, structure, and formatting as much as possible.**
* **Test the actual deployed staging system.**
* **Remove local/unit-only tests.**
* **Keep UI and Non-UI staging tests.**
* **Keep UI and Non-UI testing clearly separated while preserving the source test case format.**
* **If staging generates externally verifiable proof such as an on-chain transaction, verify it and save evidence.**
* **Do not use PENDING USER ACTION when Playwright can perform the action itself.**
* **Ask me only when genuine human-only input is required.**
* **Retry temporary issues once before assigning FAIL.**
* **Evidence should contain only the filename(s).**
* **Put what happened in Actual Result and the conclusion/failure detail in Remarks.**

---

## Appendix: Operational Context for GGG (Stellar Testnet Escrow)

When executing tests against the **Good Game Guild (GGG)** decentralized escrow staging deployment, align operations with these project-specific specifications:

### 1. Staging Target Endpoints
* **Web App Staging:** [https://app.ggg.quest](https://app.ggg.quest)
* **Landing & Info:** [https://ggg.quest](https://ggg.quest)
* **Network:** Stellar Testnet (Soroban Protocol 28)
* **Escrow WASM Contract Hash:** `9319ccbb7148750882df1cf735162059afe017778c9af37984304f291d5fe702`

### 2. Universal Testing Fee Directive
* **Strict Rule:** ALL fees must be strictly **1 XLM ONLY** (`10,000,000 stroops`) across all tournament setups, player entry registrations, and refund test executions.

### 3. Role-Based Browser Contexts
Utilize Playwright isolated browser contexts (`browser.newContext()`) corresponding to the standard QA Testnet wallet roster:
* **Organizer Context:** `Organizer1` (`GCND3TIWXXU6R7OE7DEVPKOC4AUAPVFRXQTV6E7MIWEMMNWI6PHY4QXQ`)
* **Referee Context:** `referee1` (`GAOOTDMZH4IOEO5PBII5PBYZWWNNQ2LYNDHFX2DBVZWYWBGGCSIOFZCF`)
* **Player Contexts:**
  * `Player1` (`GCVNHZ5ETC62BVHJZWDYNRZ5Q5WLWQ3FXXNYF7MNBNW7Q2RIBCBPVO6K`)
  * `Player2` (`GBLLV6KZ2VOTVG6GCENHQ5FD7SGOVCK6NMO7GFKKJGYSE2M75C56QC44`)
  * `Player3` (`GBE737HOTAV3RGAXKEZUE5ZLXOLE4O5EWDLZ24FYU4RS24P5F3RMYQQH`)

### 4. Non-UI Staging Evidence Sources
Capture externally traceable evidence for Non-UI staging operations via:
* **Stellar Expert Testnet Explorer:** `https://stellar.expert/explorer/testnet/tx/{tx_hash}`
* **Stellar Horizon Testnet API:** `https://horizon-testnet.stellar.org/transactions/{tx_hash}`
* **Soroban RPC Testnet Endpoint:** `https://soroban-testnet.stellar.org`

### 5. Local Simulators vs. Staging Evidence
Internal simulators (e.g. `EscrowTestSimulator` in local test runners) are developer harnesses used for code-level invariant checking and **must not** be used as evidence for deployed staging verification. Only live staging web interactions and Stellar Testnet transactions are valid staging proof.
