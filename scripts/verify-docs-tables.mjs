import { chromium } from 'playwright';

const docs = [
  { id: 'about--docs', name: 'About' },
  { id: '03-verity-primitives-overview--docs', name: 'Verity Primitives Overview' },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });

for (const { id, name } of docs) {
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console.error: ${m.text()}`);
  });
  await page.goto(`http://localhost:6006/iframe.html?id=${id}&viewMode=docs`, {
    waitUntil: 'networkidle',
    timeout: 15000,
  });
  await page.waitForTimeout(1500);

  const tableInfo = await page.evaluate(() => {
    const tables = Array.from(document.querySelectorAll('table'));
    return tables.map((t) => ({
      className: t.className,
      headers: Array.from(t.querySelectorAll('th')).map((th) => th.textContent?.trim()).slice(0, 5),
      rowCount: t.querySelectorAll('tbody tr').length,
      colCount: t.querySelectorAll('thead th').length,
      hasGridChrome: getComputedStyle(t).borderCollapse,
    }));
  });

  console.log(`\n${name} (${id})`);
  console.log(`  Errors: ${errors.length}`);
  console.log(`  Tables found: ${tableInfo.length}`);
  tableInfo.forEach((t, i) => {
    console.log(`    [${i}] class="${t.className}" rows=${t.rowCount} cols=${t.colCount} headers=${JSON.stringify(t.headers)}`);
  });
  await page.close();
}

await browser.close();
