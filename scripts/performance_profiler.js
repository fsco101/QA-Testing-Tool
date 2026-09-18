/**
 * Performance & Core Web Vitals Profiler
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
Usage: node scripts/performance_profiler.js [options]

Options:
  --url <url>        Target URL to profile (default: from .env)
  --dry-run          Simulate performance profiling
  --out <dir>        Output directory for performance metrics
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
  console.log('⚡ PAGE PERFORMANCE & CORE WEB VITALS PROFILER');
  console.log('='.repeat(70));
  console.log(`Target URL:     ${config.url}`);
  console.log(`Dry Run:        ${config.dryRun}`);
  console.log(`Report Output:  ${outDir}`);
  console.log('='.repeat(70));

  if (config.dryRun) {
    console.log('[DRY-RUN] Simulating browser performance profiling...');
    const mockMetrics = {
      targetUrl: config.url,
      ttfbMs: 142,
      domContentLoadedMs: 480,
      loadTimeMs: 1120,
      lcpMs: 890,
      resourcesCount: 38,
      transferSizeBytes: 482100,
      slaStatus: 'PASS (<2500ms SLA)',
      timestamp: new Date().toISOString(),
    };
    const reportPath = path.join(outDir, 'TC-PERF-001_PerformanceMetrics.json');
    fs.writeFileSync(reportPath, JSON.stringify(mockMetrics, null, 2));
    console.log(`[DRY-RUN] Generated mock metrics: TC-PERF-001_PerformanceMetrics.json`);
    console.log('✅ Performance profiling dry-run completed.');
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

    console.log(`\nNavigating to ${config.url} and collecting performance timings...`);
    const startTime = Date.now();
    await page.goto(config.url, { waitUntil: 'load', timeout: 30000 });
    const totalWallTime = Date.now() - startTime;

    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] || {};
      const paintEntries = performance.getEntriesByType('paint') || [];
      const fcp = paintEntries.find((p) => p.name === 'first-contentful-paint');
      const resources = performance.getEntriesByType('resource') || [];

      return {
        ttfbMs: Math.round(nav.responseStart - nav.requestStart) || 0,
        domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd - nav.startTime) || 0,
        loadEventMs: Math.round(nav.loadEventEnd - nav.startTime) || 0,
        fcpMs: fcp ? Math.round(fcp.startTime) : 0,
        totalResources: resources.length,
      };
    });

    const report = {
      targetUrl: config.url,
      wallClockLoadMs: totalWallTime,
      ...metrics,
      slaStatus: metrics.domContentLoadedMs < 3000 ? 'PASS (Under 3s SLA)' : 'FLAG (Slow)',
      timestamp: new Date().toISOString(),
    };

    console.log('\n📊 Page Load Timings:');
    console.table([
      { Metric: 'TTFB (Time to First Byte)', Value: `${report.ttfbMs} ms` },
      { Metric: 'DOMContentLoaded', Value: `${report.domContentLoadedMs} ms` },
      { Metric: 'Load Complete', Value: `${report.loadEventMs || totalWallTime} ms` },
      { Metric: 'First Contentful Paint (FCP)', Value: `${report.fcpMs} ms` },
      { Metric: 'Total Assets Loaded', Value: `${report.totalResources} files` },
      { Metric: 'Performance SLA', Value: report.slaStatus },
    ]);

    const reportPath = path.join(outDir, 'TC-PERF-001_PerformanceMetrics.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\nReport saved to: ${reportPath}`);
  } catch (err) {
    console.error('❌ Error profiling performance:', err.message);
  } finally {
    if (browser) await browser.close();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
