/**
 * Shared Storybook argType definitions for Verity chart primitives.
 *
 * ─── Why this file exists ────────────────────────────────────────────────────
 * Each "After Verity" story exposes the same controls as the corresponding
 * primitive story. Without a shared source, every new prop or description
 * change has to be applied across 10+ files manually.
 *
 * ─── How to use ──────────────────────────────────────────────────────────────
 *
 *   import { COLUMN_ARG_TYPES } from '../../argTypes';   // adjust depth
 *
 *   // In a primitive story's meta.argTypes (or a story-level argTypes):
 *   argTypes: {
 *     ...COLUMN_ARG_TYPES,
 *     onBarClick: { control: false, description: '...', table: { category: 'Proposed API' } },
 *   }
 *
 * ─── Note on defaults ────────────────────────────────────────────────────────
 * `table.defaultValue` is documentation-only — it does NOT affect rendering.
 * Actual defaults are set via the story's `args`. When an After Verity story
 * uses a different default (e.g. xAxisTitle = 'Hour of day' instead of ''),
 * just set it in `args` and leave the argType as-is.
 */

import type { ArgTypes } from '@storybook/react';

// ─── Shared base props (all time-series primitives) ──────────────────────────

export const BASE_ARG_TYPES = {
  colorPalette: {
    control: 'inline-radio',
    options: ['categorical', 'sequential', 'diverging', 'status'],
    description:
      '`colorPalette?: "categorical" | "sequential" | "diverging" | "status"` (base prop) — resolves token palette. ' +
      'Categorical: `--vc-1`…`--vc-8`. Sequential: `--vs-1`…`--vs-8` (blue-10 → blue-1000). ' +
      'Diverging: 5-stop red → grey → blue. Status: green / amber / red / neutral.',
    table: { type: { summary: 'ColorPalette' }, defaultValue: { summary: '"categorical"' } },
  },
  showLegend: {
    control: 'boolean',
    description:
      '`showLegend?: boolean` (base prop) — default auto: `true` when >1 series, `false` for single.',
    table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
  },
  tooltip: {
    control: 'inline-radio',
    options: ['shared-crosshair', 'point', 'disabled'],
    description:
      '`tooltip?: { kind: "shared-crosshair" | "point" | "disabled" }` (base prop) — three modes cover all 57 audited Command files.',
    table: {
      type: { summary: '"shared-crosshair" | "point" | "disabled"' },
      defaultValue: { summary: '"shared-crosshair"' },
    },
  },
  xAxisTitle: {
    control: 'text',
    description:
      '`xAxisTitle?: string` — shorthand for `xAxis.title`. Maps `xAxis.title.text`.',
    table: { type: { summary: 'string' }, defaultValue: { summary: '""' } },
  },
  yAxisTitle: {
    control: 'text',
    description:
      '`yAxisTitle?: string` — shorthand for `yAxis.title`. Maps `yAxis.title.text`.',
    table: { type: { summary: 'string' }, defaultValue: { summary: '""' } },
  },
} satisfies Partial<ArgTypes>;

// ─── ColumnChart controls ─────────────────────────────────────────────────────

export const COLUMN_ARG_TYPES = {
  ...BASE_ARG_TYPES,
  stacking: {
    control: 'inline-radio',
    options: ['none', 'normal', 'percent'],
    description:
      '`stacking?: "normal" | "percent" | "none"` — maps `plotOptions.column.stacking`. `"none"` = no stacking.',
    table: { type: { summary: '"normal" | "percent" | "none"' }, defaultValue: { summary: '"none"' } },
  },
  columnDensity: {
    control: 'inline-radio',
    options: ['tight', 'normal', 'loose'],
    description:
      '`columnDensity?: "tight" | "normal" | "loose"` — maps `groupPadding + pointPadding` presets.',
    table: { type: { summary: '"tight" | "normal" | "loose"' }, defaultValue: { summary: '"normal"' } },
  },
  axisKind: {
    control: 'inline-radio',
    options: ['datetime', 'categorical'],
    description:
      '`xAxis: DatetimeAxis | CategoryAxis` — categorical axis required by ~2 production files.',
    table: { type: { summary: '"datetime" | "categorical"' }, defaultValue: { summary: '"categorical"' } },
  },
  dataLabels: {
    control: 'boolean',
    description:
      '`dataLabels?: boolean` — renders value labels on each bar. Auto-disabled by responsive rule at container widths below 400px.',
    table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
  },
} satisfies Partial<ArgTypes>;

// ─── LineChart controls ───────────────────────────────────────────────────────

export const LINE_ARG_TYPES = {
  ...BASE_ARG_TYPES,
  smooth: {
    control: 'boolean',
    description:
      '`smooth?: boolean` — `false` = straight `line` type, `true` = `spline`. Maps `chart.type`.',
    table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
  },
  markers: {
    control: 'boolean',
    description:
      '`markers?: boolean` — shows data-point dots. Maps `plotOptions.[curve].marker.enabled`.',
    table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
  },
  xBands: {
    control: 'object',
    description:
      '`xBands?: PlotBand[]` — **X-axis time-range overlays.** `{ from, to, color, label? }` shades a background ' +
      'rectangle over a time window. `from`/`to` are Unix timestamps (ms). ' +
      'Use `BAND_COLORS.danger / .warning / .neutral / .info` from `chartColors` for token-consistent fills. ' +
      'Common use: alert events, maintenance windows, outage periods.',
    table: { type: { summary: 'PlotBand[]' } },
  },
  yZones: {
    control: 'object',
    description:
      '`yZones?: ZoneConfig[]` — **Y-axis value zones.** `{ value?, color? }` re-colors the ' +
      'line/fill as it crosses a data-value threshold. Each entry applies from the previous ' +
      'threshold up to `value`; omit `value` on the last entry for an open-ended top zone. ' +
      'Omit `color` to let `colorPalette` drive colors — set `colorPalette="status"` for ' +
      'semantic danger/warning/success coloring.',
    table: { type: { summary: 'ZoneConfig[]' } },
  },
} satisfies Partial<ArgTypes>;

// ─── AreaChart controls ───────────────────────────────────────────────────────

export const AREA_ARG_TYPES = {
  ...BASE_ARG_TYPES,
  variant: {
    control: 'inline-radio',
    options: ['area', 'areaspline', 'arearange'],
    description:
      '`variant?: "area" | "areaspline" | "arearange"` — maps `chart.type`. `arearange` expects `[ts, lo, hi]` data tuples.',
    table: { type: { summary: '"area" | "areaspline" | "arearange"' }, defaultValue: { summary: '"area"' } },
  },
  stacking: {
    control: 'inline-radio',
    options: ['none', 'normal', 'percent'],
    description:
      '`stacking?: "normal" | "percent" | "none"` — maps `plotOptions.area.stacking`. Ignored for `arearange`.',
    table: { type: { summary: '"normal" | "percent" | "none"' }, defaultValue: { summary: '"none"' } },
  },
  fillOpacity: {
    control: { type: 'range', min: 0, max: 1, step: 0.05 },
    description:
      '`fillOpacity?: number` — maps `plotOptions.area.fillOpacity`. Locked to 1 when `stacking="percent"`.',
    table: { type: { summary: 'number' }, defaultValue: { summary: '0.18' } },
  },
  xBands: {
    control: 'object',
    description:
      '`xBands?: PlotBand[]` — **X-axis time-range overlays.** `{ from, to, color, label? }` shades a background ' +
      'rectangle over a time window. Use `BAND_COLORS.danger / .warning / .neutral / .info` from `chartColors` for token-consistent fills. ' +
      'Ignored when `stacking` is not `"none"` (stacked area obscures the background).',
    table: { type: { summary: 'PlotBand[]' } },
  },
  yZones: {
    control: 'object',
    description:
      '`yZones?: ZoneConfig[]` — **Y-axis value zones.** `{ value?, color? }` re-colors the area fill ' +
      'as it crosses a data-value threshold. Omit `color` to let `colorPalette` drive colors. ' +
      'Ignored for `arearange` and stacked variants. Set `colorPalette="status"` for semantic coloring.',
    table: { type: { summary: 'ZoneConfig[]' } },
  },
} satisfies Partial<ArgTypes>;

// ─── ThresholdEditorChart controls ───────────────────────────────────────────

export const THRESHOLD_EDITOR_ARG_TYPES = {
  colorPalette: BASE_ARG_TYPES.colorPalette,
  xAxisTitle: BASE_ARG_TYPES.xAxisTitle,
  yMin: {
    control: { type: 'number' },
    description: '`valueRange?.min` — y-axis minimum (maps `yAxis.min`).',
    table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
  },
  yMax: {
    control: { type: 'number' },
    description: '`valueRange?.max` — y-axis maximum (maps `yAxis.max`).',
    table: { type: { summary: 'number' }, defaultValue: { summary: '100' } },
  },
  initialThresholdHigh: {
    control: { type: 'number' },
    description: '`thresholds.high` — initial value for the high (danger) threshold band.',
    table: { type: { summary: 'number' } },
  },
  initialThresholdLow: {
    control: { type: 'number' },
    description: '`thresholds.low` — initial value for the low (warning) threshold band.',
    table: { type: { summary: 'number' } },
  },
  xBands: {
    control: { type: 'range', min: 0, max: 5, step: 1 },
    description:
      '`xBands?: PlotBand[]` — **X-axis alert-event overlays.** Shades time windows when an alert was active. Drag slider to add/remove bands.',
    table: { type: { summary: 'PlotBand[]' }, defaultValue: { summary: '2' } },
  },
  editable: {
    control: 'boolean',
    description:
      '`editable?: boolean` — enables drag-to-edit on threshold bands. Maps `plotOptions.areaspline.dragDrop.draggableY`.',
    table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
  },
  unit: {
    control: 'text',
    description: '`unit?: string` — y-axis title label suffix (e.g. `"°C"`, `"dB"`, `"%"`).',
    table: { type: { summary: 'string' } },
  },
} satisfies Partial<ArgTypes>;

// ─── Gauge controls ──────────────────────────────────────────────────────────

export const GAUGE_ARG_TYPES = {
  value: {
    control: { type: 'range', min: 0, max: 100, step: 1 },
    description: '`value: number` — maps `series[0].data[0]`.',
    table: { type: { summary: 'number' } },
  },
  min: {
    control: { type: 'number', min: 0, max: 100 },
    description: '`min?: number` (default 0) — maps `yAxis.min`.',
    table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
  },
  max: {
    control: { type: 'number', min: 0, max: 1000 },
    description: '`max?: number` (default 100) — maps `yAxis.max`.',
    table: { type: { summary: 'number' }, defaultValue: { summary: '100' } },
  },
  unit: {
    control: 'text',
    description: '`unit?: string` — label suffix shown below the value.',
    table: { type: { summary: 'string' }, defaultValue: { summary: '"%"' } },
  },
  centerLabel: {
    control: 'text',
    description:
      '`centerLabel?: string` — text rendered inside the donut hole. Accepts ReactNode in production; primitive internally calls `renderToString`.',
    table: { type: { summary: 'string | ReactNode' } },
  },
  thickness: {
    control: 'inline-radio',
    options: ['thin', 'normal', 'thick'],
    description:
      '`thickness?: "thin" | "normal" | "thick"` — maps `plotOptions.solidgauge.innerRadius`. Presets: thin → 85%, normal → 75%, thick → 60%.',
    table: { type: { summary: '"thin" | "normal" | "thick"' }, defaultValue: { summary: '"normal"' } },
  },
  gaugeType: {
    control: 'inline-radio',
    options: ['solid', 'arc'],
    description:
      '`gaugeType?: "solid" | "arc"` — `solid` = filled solidgauge; `arc` = needle-style gauge (escape hatch for ElapsedTimeClock).',
    table: { type: { summary: '"solid" | "arc"' }, defaultValue: { summary: '"solid"' } },
  },
  goodAt: {
    control: { type: 'range', min: 0, max: 100, step: 1 },
    description:
      '`bands?` (demo control) — threshold above which the gauge is "good". Maps to `yAxis.stops`.',
    table: { type: { summary: '{ from: number; to: number; color: StatusKey }[]' } },
  },
  warnAt: {
    control: { type: 'range', min: 0, max: 100, step: 1 },
    description:
      '`bands?` (demo control) — threshold above which the gauge is "warning" (below = danger). Maps to `yAxis.stops`.',
    table: { type: { summary: '{ from: number; to: number; color: StatusKey }[]' } },
  },
} satisfies Partial<ArgTypes>;

// ─── ComboTimeSeriesChart controls ───────────────────────────────────────────

export const COMBO_ARG_TYPES = {
  colorPalette: BASE_ARG_TYPES.colorPalette,
  showLegend:   BASE_ARG_TYPES.showLegend,
  tooltip:      BASE_ARG_TYPES.tooltip,
  xAxisTitle:   BASE_ARG_TYPES.xAxisTitle,
  dualAxis: {
    control: 'boolean',
    description:
      '`dualAxis?: boolean` — adds an opposing right-side y-axis. Maps `yAxis: [{...}, {...opposite:true}]`.',
    table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
  },
  stacking: {
    control: 'inline-radio',
    options: ['none', 'normal'],
    description:
      '`stacking?: "normal" | "none"` — column stacking mode. Maps `plotOptions.column.stacking`.',
    table: { type: { summary: '"normal" | "none"' }, defaultValue: { summary: '"none"' } },
  },
  zoom: {
    control: 'boolean',
    description: '`zoom?: boolean` — enable x-axis zoom/pan via Highcharts Stock.',
    table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
  },
  primaryAxisTitle: {
    control: 'text',
    description: '`yAxes[0].title` — label for the primary (left) y-axis.',
    table: { type: { summary: 'string' } },
  },
  secondaryAxisTitle: {
    control: 'text',
    description:
      '`yAxes[1].title` — label for the secondary (right) y-axis. Only shown when `dualAxis` is true.',
    table: { type: { summary: 'string' } },
  },
} satisfies Partial<ArgTypes>;

// ─── Sparkline controls ───────────────────────────────────────────────────────

export const SPARKLINE_ARG_TYPES = {
  type: {
    control: 'inline-radio',
    options: ['line', 'area'],
    description:
      '`type?: "line" | "area"` — line renders without fill; area renders filled. Spec also reserves `"column"` for future use.',
    table: { type: { summary: '"line" | "area"' }, defaultValue: { summary: '"area"' } },
  },
  colorPalette: BASE_ARG_TYPES.colorPalette,
  height: {
    control: { type: 'range', min: 24, max: 120, step: 4 },
    description: '`height?: number` (default 56) — fixed pixel height. No responsive override.',
    table: { type: { summary: 'number' }, defaultValue: { summary: '56' } },
  },
  width: {
    control: { type: 'range', min: 80, max: 480, step: 8 },
    description: '`width?: number` (default 240) — fixed pixel width. No responsive override.',
    table: { type: { summary: 'number' }, defaultValue: { summary: '240' } },
  },
  showLatestValue: {
    control: 'boolean',
    description:
      '`showEndpoint?: boolean` (spec) — highlights the last data point with a value callout.',
    table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
  },
  caption: {
    control: 'text',
    description: '`label: string` (sim card wrapper) — shown above the sparkline as the metric name.',
    table: { type: { summary: 'string' } },
  },
  unit: {
    control: 'text',
    description: '`unit?: string` — displayed after the latest value.',
    table: { type: { summary: 'string' } },
  },
  trend: {
    control: false,
    description:
      '`trend?: "up" | "down" | "flat"` — auto-computed from data if omitted. Drives directional color on the latest value.',
    table: { type: { summary: '"up" | "down" | "flat"' }, category: 'Proposed API' },
  },
  status: {
    control: false,
    description:
      '`status?: "success" | "warning" | "danger" | "neutral"` — overrides `colorPalette` with a semantic status token.',
    table: { type: { summary: 'StatusKey' }, category: 'Proposed API' },
  },
} satisfies Partial<ArgTypes>;

// ─── PieDonutChart controls ───────────────────────────────────────────────────

/** Named presets for `innerRadius`. Maps to Highcharts `innerSize` percentage strings. */
export type InnerRadiusSize = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';

export const INNER_RADIUS_MAP: Record<InnerRadiusSize, string> = {
  xs:  '20%',  // almost a pie — very small hole
  s:   '35%',  // small donut hole
  m:   '50%',  // medium hole
  l:   '60%',  // standard donut (Verkada default)
  xl:  '70%',  // large hole
  xxl: '80%',  // thin ring
};

export const PIE_DONUT_ARG_TYPES = {
  innerRadius: {
    control: 'inline-radio',
    options: ['xs', 's', 'm', 'l', 'xl', 'xxl'] satisfies InnerRadiusSize[],
    description:
      '`innerRadius?: InnerRadiusSize` — donut hole size preset. `xs`=20% (near-pie) → `xxl`=80% (thin ring). Default: `l` (60%, Verkada standard donut).',
    table: { type: { summary: '"xs" | "s" | "m" | "l" | "xl" | "xxl"' }, defaultValue: { summary: '"l"' } },
  },
  showLabels: {
    control: 'inline-radio',
    options: ['always', 'hover', 'none'],
    description:
      '`showLabels?: "always" | "hover" | "none"` — `"always"` renders data labels on every slice; `"hover"` shows them only in the tooltip; `"none"` omits labels entirely.',
    table: { type: { summary: '"always" | "hover" | "none"' }, defaultValue: { summary: '"hover"' } },
  },
  showLegend: {
    control: 'boolean',
    description: '`showLegend?: boolean` — default `true`. Legend moves below the chart at container widths below 400px.',
    table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
  },
  maxSlices: {
    control: { type: 'range', min: 2, max: 8, step: 1 },
    description:
      '`maxSlices?: number` — slices beyond this count collapse into an "Other" catch-all slice. Useful for top-N distributions.',
    table: { type: { summary: 'number' } },
  },
  backedUp: {
    control: { type: 'range', min: 0, max: 100, step: 0.1 },
    description: 'Playground data control — Backed up (GB).',
    table: { category: 'Data' },
  },
  pending: {
    control: { type: 'range', min: 0, max: 30, step: 0.1 },
    description: 'Playground data control — Pending (GB).',
    table: { category: 'Data' },
  },
  failed: {
    control: { type: 'range', min: 0, max: 10, step: 0.1 },
    description: 'Playground data control — Failed (GB).',
    table: { category: 'Data' },
  },
  skipped: {
    control: { type: 'range', min: 0, max: 20, step: 0.1 },
    description: 'Playground data control — Skipped (GB).',
    table: { category: 'Data' },
  },
} satisfies Partial<ArgTypes>;

// ─── ScheduleChart controls ───────────────────────────────────────────────────

export const SCHEDULE_ARG_TYPES = {
  showInactive: {
    control: 'boolean',
    description:
      '`showInactive?: boolean` — render grey bars for inactive hours. Default `true`.',
    table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
  },
  pointWidth: {
    control: { type: 'range', min: 8, max: 36, step: 2 },
    description:
      '`pointWidth?: number` — row bar height in pixels. Default `18`.',
    table: { type: { summary: 'number' }, defaultValue: { summary: '18' } },
  },
  tooltip: {
    control: 'inline-radio',
    options: ['enabled', 'disabled'],
    description:
      '`tooltip?: "enabled" | "disabled"` — show active-interval tooltip on hover.',
    table: { type: { summary: '"enabled" | "disabled"' }, defaultValue: { summary: '"enabled"' } },
  },
  activeColor: {
    control: 'color',
    description:
      '`activeColor?: string` — color for active-interval bars. Default: `--vc-1` (`#226ecd`, blue-600).',
    table: { type: { summary: 'string (CSS color)' }, defaultValue: { summary: '#226ecd' } },
  },
  inactiveColor: {
    control: 'color',
    description:
      '`inactiveColor?: string` — color for inactive-gap bars. Default: `neutral-75` (`#dce0e4`, same as diverging palette midpoint).',
    table: { type: { summary: 'string (CSS color)' }, defaultValue: { summary: '#dce0e4' } },
  },
} satisfies Partial<ArgTypes>;
