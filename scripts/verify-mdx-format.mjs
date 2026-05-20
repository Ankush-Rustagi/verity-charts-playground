/**
 * Guard Storybook MDX against formatting that breaks render or CI build.
 * See STORYBOOK-MDX-RULES.md in the playground root.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const STORIES = join(ROOT, 'src/stories');

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith('.mdx')) out.push(p);
  }
  return out;
}

const errors = [];

for (const file of walk(STORIES)) {
  const rel = file.replace(ROOT, '');
  const lines = readFileSync(file, 'utf8').split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const n = i + 1;

    // Pipe markdown table row (leading | after optional whitespace)
    if (/^\s*\|/.test(line) && !line.trim().startsWith('//')) {
      errors.push(`${rel}:${n}: pipe markdown table detected. Use <table className="vp-table"> JSX (see STORYBOOK-MDX-RULES.md).`);
    }

    // Asterisk inside <code> breaks MDX emphasis parser
    if (/<code>[^<]*\*[^<]*<\/code>/.test(line)) {
      errors.push(`${rel}:${n}: asterisk inside <code> breaks MDX build. Use a concrete token (e.g. --vc-1).`);
    }
  }
}

if (errors.length) {
  console.error('MDX format check failed:\n');
  for (const e of errors) console.error(`  ${e}`);
  console.error('\nSee STORYBOOK-MDX-RULES.md');
  process.exit(1);
}

console.log(`MDX format OK (${walk(STORIES).length} files)`);
