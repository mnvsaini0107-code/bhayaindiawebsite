const { execSync } = require('child_process');
const fs = require('fs');

try {
  const out = execSync('npx @shopify/cli theme check --path shopify-theme --fail-level error');
  fs.writeFileSync('theme-check-output.txt', 'CLEAN');
} catch (e) {
  const full = (e.stdout ? e.stdout.toString() : '') + '\n' + (e.stderr ? e.stderr.toString() : '');
  fs.writeFileSync('theme-check-output.txt', full);
}
