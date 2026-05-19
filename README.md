# Verity Charts Playground

- **Last Updated:** May 18, 2026
- **Owner:** Core Command PM (Ankush Rustagi)
- **Status:** Active. Companion artifact to the Highcharts feature audit.
- **Audience:** Verity design system owners, Web platform leads, designers reviewing data viz primitives.
- **Companion docs:** [Command Chart Inventory](../../20-core-projects/ai-in-command/ai-platform-strategy/22-command-chart-inventory.md), [Highcharts Feature Audit](../../20-core-projects/ai-in-command/ai-platform-strategy/23-highcharts-feature-audit.md), [AI Analytics Roadmap](../../20-core-projects/ai-in-command/ai-platform-strategy/12-ai-analytics-roadmap-may2026.md).

---

## Purpose

A runnable Storybook that mirrors every distinct Highcharts chart shape used in customer-facing Command, with fake data and source backlinks. It is the visual review surface for the proposed Verity DataViz primitive set.

The audit doc proves "this is what Highcharts has to do." This playground shows "here is what it looks like, with the actual options applied." Together they let the Verity team scope the primitive component library without guessing.

This is intentionally NOT a real component library. It is a curated playground for capturing what the production stack already does so the team can review, evaluate, and converge on a primitive shape before writing the real Verity components.

---

## What's in here

```
verity-charts-playground/
├── .storybook/                    Storybook config (Highcharts modules registered in preview.ts)
├── src/
│   ├── primitives/
│   │   └── PlaygroundChart.tsx    Thin wrapper around highcharts-react-official
│   ├── utils/
│   │   └── fakeData.ts            Seeded fake data generators
│   └── stories/
│       ├── 00-About.mdx           Section index, coverage table, run instructions
│       ├── 01-highcharts/         All Highcharts surfaces, by chart type
│       │   ├── 01-columns/
│       │   ├── 02-lines/
│       │   ├── 03-areas/
│       │   ├── 04-gauges/
│       │   ├── 05-combo/
│       │   ├── 06-threshold-editor/
│       │   └── 07-custom-renderer/
│       └── 02-visx/               All visx surfaces, by chart shape
│           ├── 01-bars/
│           ├── 02-lines/
│           ├── 03-schedules/
│           ├── 04-pie-and-cal/
│           ├── 05-sparklines/
│           └── 06-bespoke/
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Top-level sidebar groups are `01 Highcharts` and `02 visx`, with chart-type subfolders inside each. See the **About** page in Storybook (or `src/stories/00-About.mdx`) for the full coverage table mapping every inventory surface to a Story.

---

## How to run locally

```bash
cd documentation/17-ux-design/verity-charts-playground
npm install
npm run storybook
```

Storybook opens on `http://localhost:6006`. First install takes ~60-90 seconds.

Stories live-reload on edit. Try changing a value in any `*.stories.tsx` and watch the chart redraw.

---

## How to add a new story

The point of this playground is to keep accumulating real production chart shapes so the team has a single browsable reference. To add one:

1. Pick the section folder under `src/stories/` that matches the chart type. If none fit, create a new numbered section.
2. Copy the closest existing `*.stories.tsx` as a template.
3. Update the options object to match your target chart. The goal is fidelity to the production consumer: same `chart.type`, same `xAxis.type`, same `plotOptions`, same tooltip mode, same color decisions.
4. Use fake data from `src/utils/fakeData.ts`. Add a generator there if you need a new data shape (and seed it for determinism).
5. Set `parameters.docs.description.component` to a one-paragraph summary that includes:
   - What the chart shows.
   - The production source file path (relative to `Verkada-Web`).
   - The Verity primitive target from the [feature audit](../../20-core-projects/ai-in-command/ai-platform-strategy/23-highcharts-feature-audit.md).

That's the whole contract. No tests, no real component library, just curated chart shapes.

---

## Mapping: Story to production source

Every story declares its production source in the docs panel. Quick reference:

| Story | Audit cluster | Production source (Verkada-Web) | Verity primitive target |
|---|---|---|---|
| 01 Columns / Alerts Trends | 2 | `src/command/cameras-analytics/components/alerts-trends/AlertsTrendsChart.tsx` | `ColumnChart` |
| 01 Columns / Gateway Uptime | 3 | `src/command/gateways/details/common/gatewayHighcharts/` | `ColumnChart` (stacked) |
| 02 Lines / Sales Conversion | 2 | `src/command/cameras-analytics/components/sales-conversion-rate-widget/SalesConversionRateChart.tsx` | `LineChart` |
| 02 Lines / Sensor Default | 3 | `src/command/sensors/components/sensor-highcharts/` | `LineChart` or `ThresholdEditorChart` |
| 03 Areas / Device Metric RSSI | 3 | `src/command/alarms-v3/.../device-metric-chart/DeviceMetricChart.tsx` | `SignalStrengthChart` |
| 03 Areas / Sensor Audio | 3 | `src/command/sensors/components/sensor-highcharts/hooks/useSensorHighchartsDataSeries.tsx` | `AreaChart` (range variant) |
| 03 Areas / Participant Status | 3 | `src/command/unite/pages/incidentDetails/.../ParticipantStatusOvertimeChart.tsx` | `AreaChart` (percent stacked) |
| 04 Gauges / Connect Box | 3 | `src/command/connectors/components/connect-box-stats-page/ConnectBoxGauge.tsx` | `Gauge` (donut) |
| 04 Gauges / Unite Elapsed Clock | 3 | `src/command/unite/pages/home/ElapsedTimeClock.tsx` | Escape hatch (one-off) |
| 05 Combo / Trailer Power | 3 | `src/command/trailers/common/PowerMetricsChart/PowerMetricsChart.tsx` | `ComboTimeSeriesChart` |
| 06 Threshold Editor / Sensor | 3 | `src/command/sensors/components/sensor-edit-alerts/sensor-edit-alerts-chart/SensorEditAlertsChart.tsx` | `ThresholdEditorChart` |
| 07 Custom Renderer / Gateway Arrows | 3 | `src/command/gateways/details/common/gatewayHighcharts/hooks/useGatewayHighChartsNavigationArrows.tsx` | `ExtendChart` escape hatch |
| 08 Sparklines / Camera Network | 5 | Camera Analytics tab (items 18 and 19 in inventory) | `Sparkline` |

Add a row whenever you add a story.

---

## Why this exists

The Highcharts feature audit produced a recommended primitive set:

- `ColumnChart`, `LineChart`, `AreaChart`, `ComboTimeSeriesChart`, `Gauge`, `SignalStrengthChart`, `ThresholdEditorChart`, `Sparkline`.

Reviewing that list as a markdown table is fine. Reviewing it as 13 live, interactive Highcharts renders with fake data is far better. The playground exists so the Verity team can:

1. See exactly which chart shapes the primitives need to cover (no guessing from prose).
2. Catch shapes the audit missed by spotting the gap visually.
3. Pressure-test API proposals against real chart configurations (drag the threshold band; does the proposed `onThresholdChange` prop make sense?).
4. Hand designers a single URL when discussing the Verity DataViz primitive set, instead of a list of production URLs scattered across products.

---

## What's NOT in here

- No real Verity primitive implementations. The proposed `<ColumnChart>` etc. components live in the future Verity DataViz workstream, not here. This playground composes raw Highcharts options directly.
- No production data. All charts use seeded fake data from `src/utils/fakeData.ts`.
- No design tokens. The playground uses a small inline palette (`#3B82F6`, `#22C55E`, etc.) to keep dependencies zero. When the real Verity primitives ship, they'll use VDS tokens.
- No tests. This is a visual review surface, not a component library under test.

---

## Adding back-pressure to the audit

The audit and the playground are intentionally coupled. If you add a story for a chart shape that's not covered by any of the 7 proposed primitives, update the audit doc's [Verity DataViz primitive recommendations](../../20-core-projects/ai-in-command/ai-platform-strategy/23-highcharts-feature-audit.md#verity-dataviz-primitive-recommendations) section to capture the gap. The playground is the practical test of the audit's claims.

---

## Versions (pinned to match Verkada-Web)

- Highcharts: **11.4.7**
- highcharts-react-official: **3.2.1**
- visx: **3.3.0** (and 3.4.0 for `@visx/axis`, 3.12.0 for `@visx/responsive`)
- React: **18.3.1**
- Storybook: **8.6.18**
- Node: 18+

Highcharts modules loaded globally in `.storybook/preview.ts` match the Verity baseline bundle: `highcharts-more`, `accessibility`, `draggable-points`, `no-data-to-display`, `solid-gauge`, `pattern-fill`. They are invoked as factory functions per the Highcharts 11 module API.

visx is consumed directly from `@visx/*` subpackages in each Story (no shared wrapper). The subpackages used: `shape`, `group`, `scale`, `text`, `point`, `grid`, `curve`, `axis`, `responsive`, `pattern`, `tooltip`, `gradient`, `event`.
