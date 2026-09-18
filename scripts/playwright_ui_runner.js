/**
 * Playwright E2E UI Test Runner & Evidence Collector
 * Universal QA Testing Tool for Web Applications
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Helper to parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    baseUrl: process.env.WEB_APP_BASE_URL || 'https://staging.yourwebapp.com',
    headless: true,
    dryRun: false,
    outDir: null,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) config.baseUrl = args[++i];
    if (args[i] === '--no-headless') config.headless = false;
    if (args[i] === '--dry-run') config.dryRun = true;
    if (args[i] === '--out' && args[i + 1]) config.outDir = args[++i];
    if (args[i] === '--help') {
      console.log(`
Usage: node scripts/playwright_ui_runner.js [options]

Options:
  --url <url>        Target Web Application URL (default: from .env or Context.md)
  --no-headless      Run browser with visible UI
  --dry-run          Simulate execution without launching real browser
  --out <dir>        Output directory for evidence screenshots
  --help             Display this help message
      `);
      process.exit(0);
    }
  }
  return config;
}

// Generate default run folder if not provided
function getRunDir(customDir) {
  if (customDir) return customDir;
  const today = new Date().toISOString().split('T')[0];
  return path.join(process.cwd(), `Staging_Test_${today}_Run_01`, 'Evidence', 'UI');
}

async function main() {
  const config = parseArgs();
  const evidenceDir = getRunDir(config.outDir);
  fs.mkdirSync(evidenceDir, { recursive: true });

  console.log('='.repeat(70));
  console.log('🚀 UNIVERSAL WEB APPLICATION QA AUTOMATION RUNNER');
  console.log('='.repeat(70));
  console.log(`Target URL:     ${config.baseUrl}`);
  console.log(`Headless Mode:  ${config.headless}`);
  console.log(`Dry Run:        ${config.dryRun}`);
  console.log(`Evidence Path:  ${evidenceDir}`);
  console.log('='.repeat(70));

  if (config.dryRun) {
    console.log('\n[DRY-RUN] Simulating UI test execution and evidence generation...');
    const mockEvidence = ['TC-UI-001_LandingPage.png', 'TC-AUTH-001_LoginScreen.png', 'TC-NAV-001_NavigationMenu.png'];
    for (const file of mockEvidence) {
      fs.writeFileSync(path.join(evidenceDir, file), 'MOCK_SCREENSHOT_DATA');
      console.log(`[DRY-RUN] Created mock evidence: ${file}`);
    }
    console.log('✅ Dry-run completed successfully.');
    return;
  }

  let chromium;
  try {
    const pw = require('@playwright/test');
    chromium = pw.chromium;
  } catch (e) {
    console.error('❌ Playwright is not installed. Please run: npm install && npx playwright install');
    process.exit(1);
  }

  let browser;
  try {
    browser = await chromium.launch({
      headless: config.headless,
      args: ['--disable-dev-shm-usage', '--no-sandbox'],
    });

    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 QA-Automation-Bot',
    });

    const page = await context.newPage();

    // 1. Landing Page Test
    console.log('\n[1/3] Navigating to Landing Page...');
    try {
      const response = await page.goto(config.baseUrl, { waitUntil: 'networkidle', timeout: 30000 });
      console.log(`HTTP Status: ${response ? response.status() : 'N/A'}`);
      const landingShot = path.join(evidenceDir, 'TC-UI-001_LandingPage.png');
      await page.screenshot({ path: landingShot, fullPage: true });
      console.log(`📸 Evidence captured: TC-UI-001_LandingPage.png`);
    } catch (err) {
      console.warn(`⚠️ Warning navigating to ${config.baseUrl}: ${err.message}`);
    }

    // 2. Authentication / Login Route Test
    const loginUrl = new URL('/login', config.baseUrl).toString();
    console.log(`\n[2/3] Navigating to Auth Route: ${loginUrl}...`);
    try {
      await page.goto(loginUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const loginShot = path.join(evidenceDir, 'TC-AUTH-001_LoginScreen.png');
      await page.screenshot({ path: loginShot, fullPage: true });
      console.log(`📸 Evidence captured: TC-AUTH-001_LoginScreen.png`);
    } catch (err) {
      console.warn(`⚠️ Note: Login route navigation note: ${err.message}`);
    }

    // 3. Protected Route Security Check (Unauthenticated access redirect)
    const adminUrl = new URL('/admin', config.baseUrl).toString();
    console.log(`\n[3/3] Testing Protected Route Guard: ${adminUrl}...`);
    try {
      await page.goto(adminUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const protectedShot = path.join(evidenceDir, 'TC-SEC-001_ProtectedRouteRedirect.png');
      await page.screenshot({ path: protectedShot, fullPage: true });
      console.log(`📸 Evidence captured: TC-SEC-001_ProtectedRouteRedirect.png`);
    } catch (err) {
      console.warn(`⚠️ Note: Protected route check note: ${err.message}`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ UI AUTOMATION EXECUTION COMPLETED');
    console.log(`Evidence saved to: ${evidenceDir}`);
    console.log('='.repeat(70));
  } catch (err) {
    console.error('❌ Error executing Playwright UI suite:', err.message);
  } finally {
    if (browser) await browser.close();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, parseArgs };
