import { chromium } from 'playwright';

const indexRes = await fetch('http://localhost:6006/index.json');
const indexData = await indexRes.json();
const storyIds = Object.values(indexData.entries).map((e) => ({ id: e.id, type: e.type }));
console.log(`Verifying ${storyIds.length} entries (${storyIds.filter((s) => s.type === 'story').length} stories + ${storyIds.filter((s) => s.type === 'docs').length} docs)`);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const results = [];

for (const { id, type } of storyIds) {
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console.error: ${m.text()}`);
  });
  const viewMode = type === 'docs' ? 'docs' : 'story';
  try {
    await page.goto(`http://localhost:6006/iframe.html?id=${id}&viewMode=${viewMode}`, {
      waitUntil: 'networkidle',
      timeout: 15000,
    });
    await page.waitForTimeout(1500);
  } catch (e) {
    errors.push(`navigation: ${e.message}`);
  }
  const status = errors.length === 0 ? 'OK' : 'FAIL';
  console.log(`${status}  [${type}]  ${id}`);
  if (errors.length) {
    for (const e of errors) console.log(`      ${e}`);
  }
  results.push({ id, status, errors });
  await page.close();
}

await browser.close();
const failed = results.filter((r) => r.status === 'FAIL');
console.log(`\n${results.length - failed.length} OK, ${failed.length} FAIL`);
if (failed.length) {
  console.log('\nFailing story ids:');
  failed.forEach((r) => console.log(`  ${r.id}`));
  process.exit(1);
}
