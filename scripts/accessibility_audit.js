/**
 * Automated Accessibility (a11y) WCAG 2.1 AA Auditor
 * Universal QA Testing Tool for Web Applications
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    url: process.env.WEB_APP_BASE_URL || 'https://staging.yourwebapp.com',
    dryRun: false,
    outDir: null,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) config.url = args[++i];
    if (args[i] === '--dry-run') config.dryRun = true;
    if (args[i] === '--out' && args[i + 1]) config.outDir = args[++i];
    if (args[i] === '--help') {
      console.log(`
Usage: node scripts/accessibility_audit.js [options]

Options:
  --url <url>        Target URL to audit for WCAG accessibility (default: from .env)
  --dry-run          Simulate accessibility audit
  --out <dir>        Output directory for audit report
  --help             Display this help message
      `);
      process.exit(0);
    }
  }
  return config;
}

function getOutDir(customDir) {
  if (customDir) return customDir;
  const today = new Date().toISOString().split('T')[0];
  return path.join(process.cwd(), `Staging_Test_${today}_Run_01`, 'Evidence', 'UI');
}

async function main() {
  const config = parseArgs();
  const outDir = getOutDir(config.outDir);
  fs.mkdirSync(outDir, { recursive: true });

  console.log('='.repeat(70));
  console.log('♿ WCAG 2.1 AA ACCESSIBILITY AUDIT SUITE');
  console.log('='.repeat(70));
  console.log(`Target URL:     ${config.url}`);
  console.log(`Dry Run:        ${config.dryRun}`);
  console.log(`Report Output:  ${outDir}`);
  console.log('='.repeat(70));

  if (config.dryRun) {
    console.log('[DRY-RUN] Simulating WCAG 2.1 AA evaluation...');
    const mockReport = {
      targetUrl: config.url,
      standard: 'WCAG 2.1 Level AA',
      violationsCount: 0,
      passesCount: 24,
      incompleteCount: 1,
      violations: [],
      timestamp: new Date().toISOString(),
    };
    const reportPath = path.join(outDir, 'TC-A11Y-001_AccessibilityReport.json');
    fs.writeFileSync(reportPath, JSON.stringify(mockReport, null, 2));
    console.log(`[DRY-RUN] Generated mock accessibility report: TC-A11Y-001_AccessibilityReport.json`);
    console.log('✅ Accessibility dry-run completed.');
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
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    console.log(`\nNavigating to ${config.url} for DOM & ARIA inspection...`);
    await page.goto(config.url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    let auditReport;
    try {
      const AxeBuilder = require('@axe-core/playwright').default;
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      auditReport = {
        targetUrl: config.url,
        standard: 'WCAG 2.1 Level AA',
        violationsCount: results.violations.length,
        passesCount: results.passes.length,
        incompleteCount: results.incomplete.length,
        violations: results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          help: v.help,
          helpUrl: v.helpUrl,
          nodes: v.nodes.length,
        })),
        timestamp: new Date().toISOString(),
      };
    } catch (e) {
      console.log('ℹ️ Running standard built-in accessibility DOM inspection heuristics...');
      const checks = await page.evaluate(() => {
        const issues = [];
        const imagesNoAlt = document.querySelectorAll('img:not([alt])');
        if (imagesNoAlt.length > 0) {
          issues.push({ id: 'image-alt', impact: 'critical', description: `${imagesNoAlt.length} images missing alt attributes` });
        }
        const emptyButtons = Array.from(document.querySelectorAll('button')).filter((b) => !b.innerText.trim() && !b.getAttribute('aria-label'));
        if (emptyButtons.length > 0) {
          issues.push({ id: 'button-name', impact: 'critical', description: `${emptyButtons.length} buttons missing accessible names` });
        }
        if (!document.documentElement.getAttribute('lang')) {
          issues.push({ id: 'html-has-lang', impact: 'serious', description: '<html> element missing lang attribute' });
        }
        return issues;
      });

      auditReport = {
        targetUrl: config.url,
        standard: 'WCAG 2.1 Level AA Heuristics',
        violationsCount: checks.length,
        violations: checks,
        timestamp: new Date().toISOString(),
      };
    }

    const reportPath = path.join(outDir, 'TC-A11Y-001_AccessibilityReport.json');
    fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2));

    console.log(`\nViolations Found: ${auditReport.violationsCount}`);
    if (auditReport.violationsCount > 0) {
      console.table(auditReport.violations);
    } else {
      console.log('🎉 No critical accessibility violations detected on initial page scan!');
    }
    console.log(`\nReport saved to: ${reportPath}`);
  } catch (err) {
    console.error('❌ Error executing accessibility audit:', err.message);
  } finally {
    if (browser) await browser.close();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
