const { execSync } = require('child_process');
try {
  const out = execSync('npx @shopify/cli theme check --path shopify-theme --fail-level error', { encoding: 'utf8' });
  console.log('SUCCESS:', out);
} catch (err) {
  console.log('ERRORS:');
  const lines = (err.stdout || err.message).split('\n');
  const errorLines = lines.filter(l => l.includes('[error]:') || l.includes(':\PROJECT'));
  console.log(errorLines.join('\n'));
}
