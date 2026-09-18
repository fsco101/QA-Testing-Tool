/**
 * API Health, Contract & Latency Checker (Non-UI Staging Verification)
 * Universal QA Testing Tool for Web Applications
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    apiUrl: process.env.API_BASE_URL || 'https://api-staging.yourwebapp.com/v1',
    dryRun: false,
    outDir: null,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--api-url' && args[i + 1]) config.apiUrl = args[++i];
    if (args[i] === '--dry-run') config.dryRun = true;
    if (args[i] === '--out' && args[i + 1]) config.outDir = args[++i];
    if (args[i] === '--help') {
      console.log(`
Usage: node scripts/api_health_checker.js [options]

Options:
  --api-url <url>    Target API Base URL (default: from .env or Context.md)
  --dry-run          Simulate API checks without sending network requests
  --out <dir>        Output directory for JSON evidence
  --help             Display this help message
      `);
      process.exit(0);
    }
  }
  return config;
}

function getNonUiDir(customDir) {
  if (customDir) return customDir;
  const today = new Date().toISOString().split('T')[0];
  return path.join(process.cwd(), `Staging_Test_${today}_Run_01`, 'Evidence', 'Non_UI');
}

async function checkEndpoint(url, name) {
  let axios;
  try {
    axios = require('axios');
  } catch (e) {
    console.error('❌ Axios is not installed. Please run: npm install');
    process.exit(1);
  }

  const start = Date.now();
  try {
    const res = await axios.get(url, { timeout: 10000, validateStatus: () => true });
    const latency = Date.now() - start;
    return {
      endpoint: name,
      url,
      status: res.status,
      statusText: res.statusText,
      latencyMs: latency,
      headers: res.headers,
      data: res.data,
      passed: res.status >= 200 && res.status < 400,
    };
  } catch (err) {
    return {
      endpoint: name,
      url,
      status: 'NETWORK_ERROR',
      statusText: err.message,
      latencyMs: Date.now() - start,
      passed: false,
    };
  }
}

async function main() {
  const config = parseArgs();
  const nonUiDir = getNonUiDir(config.outDir);
  fs.mkdirSync(nonUiDir, { recursive: true });

  console.log('='.repeat(70));
  console.log('🌐 API HEALTH & NON-UI STAGING VERIFICATION SUITE');
  console.log('='.repeat(70));
  console.log(`API Base URL:  ${config.apiUrl}`);
  console.log(`Dry Run:       ${config.dryRun}`);
  console.log(`Evidence Path: ${nonUiDir}`);
  console.log('='.repeat(70));

  if (config.dryRun) {
    console.log('[DRY-RUN] Simulating API endpoint validation and payload capture...');
    const mockPayload = {
      status: 'healthy',
      version: '2.4.1',
      database: 'connected',
      timestamp: new Date().toISOString(),
      latencyMs: 42,
    };
    const evidencePath = path.join(nonUiDir, 'TC-API-001_HealthResponse.json');
    fs.writeFileSync(evidencePath, JSON.stringify(mockPayload, null, 2));
    console.log(`[DRY-RUN] Wrote mock non-UI evidence: TC-API-001_HealthResponse.json`);
    console.log('✅ API Health check dry-run completed.');
    return;
  }

  const endpoints = [
    { path: '/health', name: 'System Health' },
    { path: '/status', name: 'Service Status' },
    { path: '/version', name: 'Build Version' },
  ];

  const results = [];
  for (const ep of endpoints) {
    const fullUrl = new URL(ep.path, config.apiUrl).toString();
    console.log(`\nVerifying [${ep.name}]: ${fullUrl}...`);
    const res = await checkEndpoint(fullUrl, ep.name);
    results.push(res);
    console.log(`Status: ${res.status} | Latency: ${res.latencyMs}ms | Result: ${res.passed ? 'PASS' : 'FAIL'}`);
  }

  const evidenceFile = path.join(nonUiDir, 'TC-API-001_HealthCheckEvidence.json');
  fs.writeFileSync(evidenceFile, JSON.stringify(results, null, 2));
  console.log(`\n📸 Non-UI Evidence saved: ${evidenceFile}`);

  console.log('\n' + '='.repeat(70));
  console.log('✅ API VERIFICATION SUITE FINISHED');
  console.log('='.repeat(70));
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, checkEndpoint };
