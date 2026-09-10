Test the project’s deployed staging version using Playwright and the appropriate staging-safe
testing mechanism required by each test case.
Use the attached test cases file as the basis for testing:
[ATTACH TEST CASES FILE HERE]
Instructions:

1. Execute all applicable test cases in the provided file.
2. Use the correct staging testing mechanism for each test case based on what is actually
   being tested.
   Examples:
   ● UI / user-flow tests — use Playwright against the deployed staging application.
   ● API tests — use the staging API.
   ● Background worker tests — use the appropriate staging worker or test trigger.
   ● Scheduler / cron tests — use the available staging scheduler or approved test trigger.
   ● CI / system tests — use the appropriate staging test harness or CI mechanism.
   ● Fault-injection tests — use approved staging-safe methods to simulate the required
   condition.
   ● Database state or isolation tests — use staging-safe fixtures, test accounts, reset
   mechanisms, or isolated test data.
   ● Operator or signing tests — use the approved staging process and ask for human action
   when necessary.
   Do not force every test case to be executed through the UI if another staging mechanism is
   more appropriate.
3. Do not mark a test case as N/A or NOT RUN only because it requires internal testing
   mechanisms.
   If the test case belongs to the current deliverable, it remains applicable.
4. Use the safest and least-privileged staging mechanism available.
   Do not request production secrets, production credentials, or unrestricted infrastructure access.
   If a test genuinely requires a staging-specific credential, permission, test control, worker trigger,
   scheduler trigger, test harness, or human action, ask me for exactly what is needed.
5. If credentials, permissions, OTP, signing, approval, test data, or human assistance are
   required, ask me first and continue testing after they are provided.
6. Assign the most appropriate Status/Result:
   ● PASS — Actual result matches the expected result.
   ● FAIL — The test was properly executed, but the actual result does not match the
   expected result.
   ● BLOCKED — A required dependency or staging testing mechanism is unavailable.
   ● NOT RUN — The test has not yet been executed.
   ● N/A — The test genuinely does not apply to the current deliverable.
   ● PARTIALLY PASSED — Only part of the expected behavior was satisfied.
   ● PENDING USER ACTION — The test requires credentials, permission, approval, OTP,
   signing, or human assistance before continuing.
7. Avoid false failures.
   If a problem may be caused by missing access, incorrect setup, temporary loading, network
   instability, or timing, resolve the condition first and retry the test before marking it FAIL.
8. For Playwright tests, wait for the correct application state instead of using unnecessary
   fixed delays.
9. Record the testing environment:
   ● Staging URL
   ● Test Date
   ● Browser
   ● Build/Version, if available
   ● Staging testing mechanism used when relevant
10. Capture evidence when needed.
    Use clear filenames such as:
    TC-LOGIN-001_01.png
    For non-UI tests, evidence may also be:
    TC-WORKER-003_log.txt
    TC-CRON-004_result.txt
11. In the Evidence section, keep the content short.
    Actual Result:
    Briefly state what actually happened.
    Evidence:
    TC-LOGIN-001_01.png
    I will manually insert the screenshot or other evidence into the file later.
12. Put explanations and conclusions in the Remarks field.
    Examples:
    Function works as expected.
    Failed at Step 4 — expected confirmation message was not displayed.
    Worker completed but returned an incorrect status.
13. If a defect is found, identify the exact step or operation where the failure occurred.
14. Avoid unnecessarily changing shared staging data.
    Use test accounts, temporary fixtures, isolated data, or staging-safe reset mechanisms
    whenever possible.
15. Do not modify the original test cases file.
    Create a new updated copy containing:
    ● Environment Details
    ● Updated Status/Result
    ● Actual Result
    ● Evidence filename
    ● Remarks
16. Keep the original test case IDs, steps, preconditions, and expected results unless a
    correction is necessary.
17. After testing, provide:
    ● The updated test cases file
    ● All generated evidence files
    ● Any remaining BLOCKED, NOT RUN, or PENDING USER ACTION test cases and what
    is required to complete them
    Important:
    ● Cover all test cases in scope.
    ● Select the correct staging-safe testing mechanism for each test case.
    ● Use Playwright when testing user-facing behavior.
    ● Use appropriate staging test controls for internal or system-level tests.
    ● Do not skip applicable tests simply because they cannot be performed through the UI.
    ● Do not request production secrets or unnecessary infrastructure access.
    ● Ask for specific assistance when required.
    ● Retry suspicious temporary failures before marking FAIL.
    ● Keep Evidence concise and explain the result in Remarks.
