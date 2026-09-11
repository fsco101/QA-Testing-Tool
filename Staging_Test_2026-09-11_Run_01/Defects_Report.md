# Staging QA Defect Report — 2026-09-11 Testing Run

**Run Folder:** Staging_Test_2026-09-11_Run_01  
**Environment:** Deployed Staging (`https://app.ggg.quest`)  
**Network:** Stellar Testnet  
**Testing Directives:** Automation Testing Script.md & QA_TESTING_TESTER_PROMPT.pdf  

---

## Executive Summary of Identified Defects

| Defect ID | Severity | Category | Title | Priority / SLA |
| :--- | :---: | :--- | :--- | :---: |
| **ISSUE-008** | **High** | Smart Contract & Role Guards | Organizer and Referee can join the tournament as players | P1 — Sprint 1.1 Hotfix |
| **ISSUE-009** | **High** | Tournament Details / Discovery | Tournament share link and QR code are not working | P1 — Sprint 1.1 Hotfix |

---

## Detailed Defect Records

### ISSUE-008: Organizer and Referee Roles Can Join Tournament as Players
- **Severity:** High
- **Target Component:** `contracts/escrow/src/lib.rs` (`join_tournament`) & Frontend `TournamentView`
- **Original Field Report:** *"the organizer role and referee can join the tournament"*
- **Observed Behavior:**
  Both the tournament organizer and the impartial referee are permitted to join the tournament as players, depositing 1 XLM. This introduces a critical conflict of interest: the referee responsible for certifying podium results can be a competing player in the tournament.
- **Expected Behavior:**
  - Smart contract must enforce `require!(player != self.organizer && player != self.referee, Error::UnauthorizedRole)`.
  - Frontend UI must detect connected wallet and disable the 'Join Tournament' button with an advisory tooltip.
- **Status:** `OPEN (P1 Triage)`

---

### ISSUE-009: Tournament Share Link and QR Code Broken / Non-Functional
- **Severity:** High
- **Target Component:** Frontend Share Modal & `QRCodeSVG` Generator
- **Original Field Report:** *"and the tournament link and qr is not working"*
- **Observed Behavior:**
  Clicking the share link copies a malformed / relative path that fails to resolve (resulting in 404 navigation error), and the displayed QR code is unscannable or points to an empty/undefined path, preventing mobile player onboarding.
- **Expected Behavior:**
  - Share link must resolve to the fully qualified URL: `https://app.ggg.quest/tournaments/:id`.
  - QR code must accurately encode the HTTPS URL and scan cleanly on mobile devices.
- **Status:** `OPEN (P1 Triage)`
