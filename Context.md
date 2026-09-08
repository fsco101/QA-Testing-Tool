# GGG (Good Game Guild) — MVP QA Context & Specification

> **Project:** GGG (Good Game Guild)  
> **Ecosystem:** Stellar Blockchain & Soroban Smart Contracts  
> **Live Deployment:** [https://ggg.quest](https://ggg.quest)  
> **Repository:** [webnxt-2030/ggg](https://github.com/webnxt-2030/ggg) (Branch: `main` / `staging` / `develop`)  
> **Network:** Stellar Testnet (Default), Mainnet (Public ready)  
> **Contract Hash:** `9319ccbb7148750882df1cf735162059afe017778c9af37984304f291d5fe702`

---

## 1. Executive Summary & Core Value Proposition

GGG is a trustless, decentralized tournament prize-escrow and match-settlement protocol built on the Stellar network using Soroban smart contracts.

### The Problem
Traditional esports and grassroots gaming tournaments require a centralized custodian (organizer, Discord mod, or third-party platform) to collect entry fees and hold the prize pot until payouts occur. This introduces single points of failure:
- Custodians can skim funds, delay payouts, or rug-pull the prize pool.
- Players must trust unverified third parties.
- High fees or lack of accessible escrow for community gaming brackets.

### The GGG Solution
GGG replaces the custodian entirely with a dedicated on-chain Soroban escrow contract per tournament:
1. **Self-Custody & Neutrality:** The smart contract is the middleman holding the pot. There is no platform withdrawal or admin back-door to drain funds.
2. **Dynamic Prize Pool:** The prize pot scales dynamically as players pay entry fees directly from their own non-custodial wallets (Freighter).
3. **Automated On-Chain Settlement:** A neutral referee submits certified standings, triggering a single on-chain transaction that disburses winnings according to preset percentages.
4. **Guaranteed Refunds:** If the tournament is cancelled or reaches its settlement deadline without resolution, players can claim 100% of their entry fees directly from the contract.

---

## 2. Participant Roles & Permissions

| Role | Wallet / Auth Requirement | Responsibilities & Actions | Permissions & Contract Guards |
| :--- | :--- | :--- | :--- |
| **Organizer** | Freighter Wallet (`organizer.require_auth()`) | Creates tournament, defines metadata (game title, banner, rules), configures financial parameters (token, entry fee, settlement deadline, winner percentage splits), deploys & initializes the contract. | • Must not be the same address as the referee (`organizer != referee`).<br>• Can call `cancel_tournament()` before deadline to enable immediate player refunds.<br>• Cannot withdraw or skim player funds. |
| **Referee** | Freighter Wallet (`referee.require_auth()`) | Acts as the impartial tournament official who verifies match outcomes and certifies the final leaderboard. | • Sole address authorized to call `finalize_results(first, second, third)`.<br>• Must pick distinct, registered players (`WinnersNotDistinct`, `WinnerNotRegistered`).<br>• Can only finalize before the settlement deadline. |
| **Player** | Freighter Wallet (`player.require_auth()`) | Discovers tournaments (web UI or QR code), connects wallet, joins by paying the entry fee. | • Calls `join_tournament(player)` transferring entry fee via SAC.<br>• Can call `claim_refund(player)` permissionlessly if cancelled or if deadline expired.<br>• Max cap enforced (`MAX_PLAYERS = 100`). |
| **Platform Admin** | Web Session (Role: `ADMIN`) | System-wide governance, dispute escalation, tournament monitoring. | • Outranks `ORGANIZER` in the web application.<br>• Administrative controls are enforced at the web/API layer; contract funds remain strictly locked under contract logic. |

---

## 3. Financial Mechanics & Math Model

### 3.1 Currency & Asset Standard
- Utilizes the **Stellar Asset Contract (SAC)** standard for both:
  - **Native XLM:** Smallest unit = stroops ($1\text{ XLM} = 10^7\text{ stroops}$).
  - **USDC:** Issuer SAC address.
- Financial transactions execute via `soroban_sdk::token::TokenClient`.

### 3.2 Dynamic Prize Pool Formula
$$\text{Pool} = \text{Total Registered Players} \times \text{Entry Fee}$$
Every player invocation of `join_tournament` pulls `entry_fee` into the contract address and emits a `("registered", player)` event with the updated pool balance.

### 3.3 Winner Distribution & Deterministic Dust Handling
- Configured using **Basis Points (bps)**, where $10,000\text{ bps} = 100\%$.
- Default split: `[6000, 3000, 1000]` representing **60% for 1st**, **30% for 2nd**, and **10% for 3rd**.
- Payout calculations:
  $$\text{Payout}_i = \left\lfloor \frac{\text{Pool} \times \text{bps}_i}{10,000} \right\rfloor$$
- **Dust Handling:** Any remaining integer division remainder is deterministically added to **1st place**:
  $$\text{Payout}_1 = \left\lfloor \frac{\text{Pool} \times \text{bps}_1}{10,000} \right\rfloor + \left(\text{Pool} - \sum_{i=1}^3 \text{Payout}_i\right)$$

> [!IMPORTANT]
> ### ⚠️ Critical QA Observation: Referee Cut / Percentage
> - **Specification Note:** The prompt mentions *"The referee have also a percentage."*
> - **Current Contract Implementation (`contracts/escrow/src/lib.rs`):**  
>   `distribution_bps.len() == 3` and must sum to exactly `10,000`. The contract distributes $100\%$ of the calculated pool strictly to `first`, `second`, and `third`. There is currently **no transfer to the referee** in the on-chain `finalize_results` function.
> - **QA Action Item:** Verify with product whether:
>   1. Referee compensation is intended to be a 4th basis point cut inside the smart contract (e.g. 1st: 55%, 2nd: 25%, 3rd: 10%, Referee: 10%), OR
>   2. Handled via off-chain platform fee/organizer reimbursement, OR
>   3. Represents a pending contract upgrade requirement.

---

## 4. Contract State Machine & Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Uninitialized
    Uninitialized --> Active : initialize(organizer, referee, token, fee, bps, deadline)
    
    state Active {
        [*] --> RegistrationOpen
        RegistrationOpen --> RegistrationOpen : join_tournament(player) [fee pulled, pool increases]
    }

    Active --> Finalized : finalize_results(1st, 2nd, 3rd) by Referee [Funds Disbursed]
    Active --> Cancelled : cancel_tournament() by Organizer [Refunds Enabled]
    Active --> Expired : Settlement Deadline Passed without Finalization

    Cancelled --> RefundClaimed : claim_refund(player) [Immediate 100% refund]
    Expired --> RefundClaimed : claim_refund(player) [Post-deadline 100% refund]

    Finalized --> [*]
    RefundClaimed --> [*]
```

---

## 5. Technical Architecture

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/Radix, Lucide Icons | Responsive tournament UI, live prize counter, player registration QR code, settlement console. |
| **Wallet Connector** | `@stellar/freighter-api` v5+ | Browser signing; server never holds private keys. |
| **Client Blockchain SDK** | `@stellar/stellar-sdk` v15 | Transaction building, XDR envelope simulation, Soroban RPC communication. |
| **Smart Contract** | Rust, `soroban-sdk` v26, compiled to WASM | `ggg-escrow` contract managing state, custody, authorization, and payouts. |
| **Backend & Cache** | PostgreSQL 17 (Prisma ORM 7), Redis 7 (`ioredis`) | Off-chain tournament indexer, rate limiting, and session caching. |
| **Live Sync Worker** | Background Event Subscriber (`tsx` poller + SSE) | Polls `getEvents` on Soroban RPC and streams real-time updates to UI without page reload. |

---

## 6. QA Testing & Verification Matrix (Soroban Skills Applied)

Applying the installed skills (`soroban-common-mistakes`, `soroban-smart-contracts`, `stellar-dapp`):

### 6.1 Smart Contract Test Vectors
| Test Category | Invariant to Verify | Expected Result / Error Code |
| :--- | :--- | :--- |
| **Access Control** | Non-referee calls `finalize_results` | Revert / Auth rejection |
| **Access Control** | Non-organizer calls `cancel_tournament` | Revert / Auth rejection |
| **Access Control** | `organizer == referee` at `initialize` | Revert with `Error::OrganizerIsReferee (#5)` |
| **State Validation** | `distribution_bps` does not sum to 10,000 | Revert with `Error::BadDistributionSum (#3)` |
| **Registration Guard** | Player joins twice | Revert with `Error::AlreadyJoined (#9)` |
| **Registration Cap** | Number of participants reaches 101 | Revert with `Error::MaxPlayersReached (#17)` |
| **Winner Validation** | Referee submits non-distinct winners (e.g., 1st == 2nd) | Revert with `Error::WinnersNotDistinct (#10)` |
| **Winner Validation** | Referee submits an address that never registered | Revert with `Error::WinnerNotRegistered (#11)` |
| **Refund Mechanics** | Player claims refund while tournament is active & before deadline | Revert with `Error::DeadlineNotReached (#14)` |
| **Refund Mechanics** | Player claims refund twice | Revert with `Error::RefundAlreadyClaimed (#16)` |
| **Storage & TTL** | Contract instance state expiration | `extend_instance_ttl` maintains 90-day settlement horizon |

### 6.2 Web App & Integration Test Vectors
| Flow | Test Action | Expected Behavior |
| :--- | :--- | :--- |
| **Wallet Connection** | Connect Freighter on unsupported network | Prompt network switch to Stellar Testnet |
| **Two-Step Deployment** | Organizer creates tournament | Sign 1 (deploy) then Sign 2 (initialize) without session desync |
| **Live UI Propagation** | Player joins via wallet or QR | Real-time SSE updates prize pool and participant list without manual refresh |
| **Settlement Console** | Referee selects podium slots and signs | Podium validation enforces 3 distinct registered candidates |
| **Transaction Feedback** | Reverted Soroban transaction | Clear user-facing error message rather than unhandled RPC exception |

---

## 7. QA Directory Structure & Automated File Routing

Every week / sprint deliverable, new QA artifacts (test strategies, matrices, test cases, and execution logs) are generated. The system MUST automatically route and persist files into their designated workspace directories:

### 7.1 Folder Routing & Date Subfolder Rules

To maintain a clean and organized workspace, files are grouped by creation date into subfolders:

```
c:\Testing\
├── Context.md                         # Authoritative QA context & system specs
├── Test Strategy/                     # Test Strategies & High-Level Plans
│   └── {YYYY-MM-DD}/                  # Subfolder per creation date (e.g., 2026-09-08/)
│       └── {N}_GGG_Deliverable_{X}_Test_Strategy.docx (.docx / .md)
├── Test Cases/                        # Test Cases & Step-by-Step Execution Suites
│   └── {YYYY-MM-DD}/                  # Subfolder per creation date (e.g., 2026-09-08/)
│       ├── 1_GGG_D1_Test_Cases.docx (.docx / .md)
│       └── 2_GGG_Project_Test_Cases.docx (.docx / .md)
└── .agents/skills/                    # Soroban QA & Stellar dev agent skills
```

| Artifact Type | Target Subfolder | File Naming Convention | Description & Example |
| :--- | :--- | :--- | :--- |
| **Test Strategy** | [`Test Strategy/{YYYY-MM-DD}/`](file:///c:/Testing/Test%20Strategy/) | `{Sequence}_GGG_Deliverable_{N}_Test_Strategy.docx` | Saved in date subfolder (`YYYY-MM-DD`). The file name excludes the date and prefixes the sequence number for that day.<br>*Example:* `Test Strategy/2026-09-08/1_GGG_Deliverable_1_Test_Strategy.docx` |
| **Test Cases** | [`Test Cases/{YYYY-MM-DD}/`](file:///c:/Testing/Test%20Cases/) | `{Sequence}_GGG_D{N}_Test_Cases.docx`<br>*(or `{Sequence}_GGG_Project_Test_Cases.docx`)* | Saved in date subfolder (`YYYY-MM-DD`). The file name excludes the date and prefixes the sequence number for that day.<br>*Example:* `Test Cases/2026-09-08/1_GGG_D1_Test_Cases.docx` |

### 7.2 Automation Directives for the Agent
1. **Date Subfolder Creation:** Every time test cases or test strategies are created or updated, automatically create and use the folder for that date:
   - `c:\Testing\Test Strategy\{YYYY-MM-DD}\`
   - `c:\Testing\Test Cases\{YYYY-MM-DD}\`
2. **Sequential File Numbering (No Date in File Name):**
   - **Do NOT include the date** in the file name itself (the enclosing folder already denotes the date).
   - Prefix the file name with a sequence number indicating the order of creation on that date (e.g., `1_...` for the 1st file created, `2_...` for the 2nd file created).
   - Format: `{Sequence}_GGG_Deliverable_{N}_Test_Strategy.docx` and `{Sequence}_GGG_D{N}_Test_Cases.docx`.
3. **Context Synchronization:** Cross-reference newly added test cases or strategies with [`Context.md`](file:///c:/Testing/Context.md) to ensure all contract logic, role invariants, and error codes stay strictly aligned with the GGG specification.

### 7.3 Document Design & Visual Styling Standards (Basis: `GGG_D1_Test_Cases.docx`)

All generated `.docx` documents (Test Strategy and Test Cases) **must be identical in design, layout, typography, and color palette** to the template [`GGG_D1_Test_Cases.docx`](file:///c:/Testing/GGG_D1_Test_Cases.docx) in the root folder:

* **Page Layout & Margins:**
  - Compact margins: `Top: 0.55"`, `Bottom: 0.55"`, `Left: 0.65"`, `Right: 0.65"`.
* **Typography & Palette:**
  - **Body Font:** `Aptos` (fallback `Calibri`), Size `9.5 pt`, normal text color `#222222`.
  - **Document Title:** `Aptos Display`, Size `24.0 pt`, Bold, Color `#17365D` (Dark Navy).
  - **Subtitle / Tagline:** `Aptos Display`, Size `16.0 pt`, Bold.
  - **Heading 1:** `Aptos Display`, Size `15.0 pt`, Bold, Color `#365F91` (Steel Blue).
  - **Heading 2:** `Aptos Display`, Size `12.0 pt`, Bold, Color `#4F81BD` (Soft Blue).
* **Table Design & Cell Shading:**
  - **Table Style:** Standard Grid with compact cell padding (`top/bottom: 65 dxa`, `left/right: 70 dxa`).
  - **Table Headers:** Background fill `#154734` (Dark Forest Green / Spruce), Text: Pure White `#FFFFFF`, Bold, Size `9.0–9.5 pt`.
  - **Parameter / Sidebar Column Headers:** Background fill `#E7F0EC` (Light Mint / Sage Tint), Text: Bold `#154734` or dark neutral, Size `9.0 pt`.
  - **Data Rows:** Alternating rows subtle tint (`#F8FAFC` or `#FFFFFF`), text size `8.5–9.0 pt`.
* **Running Header & Footer:**
  - **Running Header (Top Right):** Font `Aptos`, Size `8.5 pt`, right-aligned:
    - Test Strategy: `GGG // DELIVERABLE {N} // TEST STRATEGY`
    - Deliverable Test Cases: `GGG // DELIVERABLE {N} // TEST CASES`
    - Project-Wide Test Cases: `GGG // PROJECT-WIDE // TEST CASES`
  - **Running Footer (Bottom):** Font `Aptos`, Size `8.5 pt`, center/left-aligned: `Internal QA document | Stellar Testnet only`.



