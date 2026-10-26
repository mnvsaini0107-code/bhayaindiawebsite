const puppeteer = require('puppeteer-core');

async function testConsole() {
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  
  const consoleErrors = [];
  const consoleWarnings = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    } else if (msg.type() === 'warning') {
      consoleWarnings.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

  // Open mobile menu to trigger drawer rendering
  await page.setViewport({ width: 390, height: 844 });
  const mobileBtn = await page.$('#mobile-menu-btn');
  if (mobileBtn) {
    console.log('Clicking mobile menu trigger...');
    await mobileBtn.click();
    await new Promise(r => setTimeout(r, 1000));
  }

  // Also navigate to founder-profile
  console.log('Navigating to http://localhost:3000/founder-profile...');
  await page.goto('http://localhost:3000/founder-profile', { waitUntil: 'networkidle2', timeout: 30000 });

  // Test /founder redirect
  console.log('Testing /founder redirect...');
  await page.goto('http://localhost:3000/founder', { waitUntil: 'networkidle2', timeout: 30000 });
  console.log('Landed on URL:', page.url());

  await browser.close();

  console.log('\n--- CONSOLE CHECK RESULTS ---');
  console.log('Console Errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((e, i) => console.log(`  [ERROR ${i+1}] ${e}`));
  }
  const duplicateKeyIssues = [...consoleErrors, ...consoleWarnings].filter(text => text.includes('same key') || text.includes('Encountered two children'));
  console.log('Duplicate Key Issues found:', duplicateKeyIssues.length);
  if (duplicateKeyIssues.length > 0) {
    duplicateKeyIssues.forEach(msg => console.log('  -> ' + msg));
    process.exit(1);
  } else {
    console.log('SUCCESS: No duplicate key warnings or errors detected!');
  }
}

testConsole().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
