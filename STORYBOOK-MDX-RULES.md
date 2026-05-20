# Storybook MDX formatting rules

**Read this before editing any file under `src/stories/*.mdx`.**

Storybook 8 MDX does not render GitHub-flavored markdown the same way as docs-vibes. Pipe tables and some inline patterns break silently (raw `|` text on the page) or fail the production build. Follow these rules every time.

---

## Tables: JSX only, never pipe markdown

**Do not** use pipe tables:

```markdown
| Col A | Col B |
|---|---|
| x | y |
```

**Do** use JSX with the shared class (styled in `.storybook/preview.ts`):

```mdx
<table className="vp-table">
  <thead>
    <tr>
      <th>Col A</th>
      <th>Col B</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>x</td><td>y</td></tr>
  </tbody>
</table>
```

Copy an existing table from `00-About.mdx` or `00-Release-Notes.mdx` as a template.

---

## Code spans: no asterisk wildcards inside `<code>`

MDX treats `*` as emphasis. This **breaks the build**:

```mdx
<code>--vc-*</code>
```

**Do** use a concrete token or plain backticks in prose:

```mdx
<code>--vc-1</code>, <code>--vs-3</code>
```

---

## Internal Storybook links

Use query paths on `<a>` (works on GitHub Pages with base path):

```mdx
<a href="?path=/docs/about--docs">About</a>
<a href="?path=/story/03-verity-primitives-piedonutchart--playground">PieDonutChart</a>
```

To find a story id: run `npm run build-storybook`, then inspect `storybook-static/index.json` entries keys.

---

## Bold in table cells

Prefer `<strong>text</strong>` inside `<td>` rather than `**text**` in JSX tables.

---

## Meta title and sidebar order

Every docs page starts with:

```mdx
import { Meta } from '@storybook/blocks';
<Meta title="Release Notes" />
```

Sidebar order is controlled in `.storybook/preview.ts` → `parameters.options.storySort.order`. Add new top-level doc titles there when you add a new MDX page.

---

## Pre-push checklist

```bash
cd documentation/17-ux-design/verity-charts-playground
npm run verify-mdx          # catches pipe tables and risky <code> patterns
npm run build-storybook     # must pass before pushing to Ankush-Rustagi/verity-charts-playground
```

If `build-storybook` fails with "Unable to index" and an MDX syntax error, check this file first.

---

## Files that must follow these rules

- `src/stories/00-Release-Notes.mdx` (changelog with deep links)
- `src/stories/00-About.mdx` (roadmap context and coverage)
- `src/stories/03-verity-primitives/00-Overview.mdx` (primitive set overview)

When adding a new `*.mdx` doc, list it here and add its `<Meta title="...">` to `storySort` in `preview.ts`.
