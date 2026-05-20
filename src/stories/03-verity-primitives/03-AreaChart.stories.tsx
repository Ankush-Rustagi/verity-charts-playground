import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../primitives/PlaygroundChart';
import {
  type ColorPalette,
  type PlotBand,
  type ZoneConfig,
  PALETTE_HEX,
} from '../../primitives/VeritySimPrimitives';
import { fakeTimeSeries, fakeArearange } from '../../utils/fakeData';

// Series starts at 2026-05-01T08:00:00Z = 1746086400000.
const DEMO_BANDS: PlotBand[] = [
  { from: 1746090000000, to: 1746092700000, color: 'rgba(239,68,68,0.15)',  label: 'Alert: motion'    },
  { from: 1746104400000, to: 1746111600000, color: 'rgba(245,158,11,0.12)', label: 'Alert: temp high' },
];

// Zones for single-series area (data around base 50, range ~28–72).
// Omit `color` to let colorPalette drive zone coloring.
const DEMO_ZONES: ZoneConfig[] = [
  { value: 40 },  // ≤ 40 → zone 0 (danger with status palette)
  { value: 55 },  // 40–55 → zone 1 (warning)
  {},             // > 55  → zone 2 (success)
];

type Args = {
  variant:      'area' | 'areaspline' | 'arearange';
  stacking:     'normal' | 'percent' | 'none';
  fillOpacity:  number;
  bands:        PlotBand[];
  zones:        ZoneConfig[];
  xAxisTitle:   string;
  yAxisTitle:   string;
  showLegend:   boolean;
  tooltip:      'shared-crosshair' | 'point' | 'disabled';
  colorPalette: ColorPalette;
};

const meta: Meta<Args> = {
  title: '03 Verity Primitives/AreaChart',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Proposed Verity primitive for filled area charts. `variant` selects the Highcharts type; `stacking` is a separate prop so `areaspline` can also be stacked. Covers device metric, sensor threshold visualization, and Unite participant breakdowns.\n\n' +
          '**Production sources:** Device Metric RSSI (area + zones); Sensor Audio (arearange min/max); Sensor Threshold band (areaspline); Unite Participant Status (percent-stacked); Attendance Analytics (single area).\n\n' +
          '**Design note:** The `arearange` variant is functionally a different chart type (Highcharts `arearange`). Folding it under AreaChart unifies the API surface at the cost of slightly more polymorphic data shapes. Alternative: separate `RangeChart` primitive.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['area', 'areaspline', 'arearange'],
      description: '`variant?: "area" | "areaspline" | "arearange"` — maps `chart.type`. `arearange` expects `[ts, lo, hi]` data tuples.',
      table: { type: { summary: '"area" | "areaspline" | "arearange"' }, defaultValue: { summary: '"area"' } },
    },
    stacking: {
      control: 'inline-radio',
      options: ['none', 'normal', 'percent'],
      description: '`stacking?: "normal" | "percent" | "none"` — maps `plotOptions.area.stacking`. Ignored for `arearange`.',
      table: { type: { summary: '"normal" | "percent" | "none"' }, defaultValue: { summary: '"none"' } },
    },
    fillOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: '`fillOpacity?: number` — maps `plotOptions.area.fillOpacity`. Locked to 1 when `stacking="percent"`.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0.18' } },
    },
    bands: {
      control: 'object',
      description:
        '`bands?: PlotBand[]` — `{ from, to, color, label? }` x-axis time-range overlays. ' +
        '`from`/`to` are Unix timestamps (ms). Use a low-opacity fill (e.g. `rgba(239,68,68,0.15)`) so the area fill remains readable. ' +
        'Ignored when `stacking` is not `"none"` (stacked area obscures bands). ' +
        'Default anchored to 2026-05-01T08:00Z.',
      table: { type: { summary: 'PlotBand[]' } },
    },
    zones: {
      control: 'object',
      description:
        '`zones?: ZoneConfig[]` — `{ value?, color? }` threshold bands on the series fill. ' +
        'Each entry colors from the previous threshold up to `value`; omit `value` on the last entry. ' +
        'Omit `color` to let `colorPalette` drive colors. Ignored for `arearange` and stacked variants. ' +
        'Try `colorPalette="status"` with the default zones to see danger/warning/success coloring.',
      table: { type: { summary: 'ZoneConfig[]' } },
    },
    xAxisTitle: {
      control: 'text',
      description: '`xAxisTitle?: string` — shorthand for `xAxis.title`. Maps `xAxis.title.text`.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '""' } },
    },
    yAxisTitle: {
      control: 'text',
      description: '`yAxisTitle?: string` — shorthand for `yAxis.title`. Maps `yAxis.title.text`.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '""' } },
    },
    showLegend: {
      control: 'boolean',
      description: '`showLegend?: boolean` (base prop).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    tooltip: {
      control: 'inline-radio',
      options: ['shared-crosshair', 'point', 'disabled'],
      description: '`tooltip?: { kind: "shared-crosshair" | "point" | "disabled" }` (base prop).',
      table: { type: { summary: '"shared-crosshair" | "point" | "disabled"' }, defaultValue: { summary: '"shared-crosshair"' } },
    },
    colorPalette: {
      control: 'inline-radio',
      options: ['categorical', 'sequential', 'diverging', 'status'],
      description: '`colorPalette?: ColorPalette` (base prop) — drives series and zone colors across stacked variants.',
      table: { type: { summary: 'ColorPalette' }, defaultValue: { summary: '"categorical"' } },
    },
    series: {
      control: false,
      description: '`series: SingleSeries[] | RangeSeries[]` — data shape is variant-dependent. `arearange` expects `[ts, lo, hi]` tuples.',
      table: { type: { summary: 'SingleSeries[] | RangeSeries[]' }, category: 'Proposed API' },
    },
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {
  args: {
    variant:      'area',
    stacking:     'none',
    fillOpacity:  0.18,
    bands:        DEMO_BANDS,
    zones:        DEMO_ZONES,
    xAxisTitle:   '',
    yAxisTitle:   '',
    showLegend:   false,
    tooltip:      'shared-crosshair',
    colorPalette: 'categorical',
  },
  render: (args) => {
    const singleData  = fakeTimeSeries({ count: 96, base: 50, amplitude: 18, noise: 3 });
    const a = fakeTimeSeries({ count: 60, base: 30, amplitude: 8,  noise: 3, seed: 1 });
    const b = fakeTimeSeries({ count: 60, base: 20, amplitude: 5,  noise: 2, seed: 2 });
    const c = fakeTimeSeries({ count: 60, base: 50, amplitude: 12, noise: 4, seed: 3 });
    const rangeData = fakeArearange({ count: 192, base: 42, spread: 18, noise: 3 });
    const palette = PALETTE_HEX[args.colorPalette];
    const tooltipOpts = args.tooltip === 'disabled'
      ? { enabled: false }
      : { useHTML: true, shared: args.tooltip === 'shared-crosshair', outside: true };

    const isSingleNoRange = args.variant !== 'arearange' && args.stacking === 'none';
    const hcType = args.variant === 'arearange' ? 'arearange' : args.variant;

    // Zone colors: explicit override if set, else palette by index.
    const resolvedZones = isSingleNoRange && args.zones.length > 0
      ? args.zones.map((z, i) => ({ ...z, color: z.color ?? palette[i % palette.length] }))
      : undefined;

    let series: Highcharts.SeriesOptionsType[] = [];
    if (args.variant === 'arearange') {
      series = [{ type: 'arearange', name: 'Range', data: rangeData, color: palette[0] }];
    } else if (args.stacking !== 'none') {
      series = [
        { type: args.variant, name: 'Responded',  data: c, color: palette[0] },
        { type: args.variant, name: 'Checked in', data: a, color: palette[1] },
        { type: args.variant, name: 'Inactive',   data: b, color: palette[2] },
      ];
    } else {
      series = [{ type: args.variant, name: 'Value', data: singleData, color: palette[0] }];
    }

    return (
      <PlaygroundChart
        options={{
          chart: { type: hcType },
          title: { text: '' },
          xAxis: {
            type: 'datetime',
            crosshair: args.tooltip !== 'disabled',
            plotBands: isSingleNoRange && args.bands.length > 0
              ? (args.bands as Highcharts.XAxisPlotBandsOptions[])
              : undefined,
            title: { text: args.xAxisTitle },
          },
          yAxis: {
            title: { text: args.yAxisTitle },
            ...(args.stacking === 'percent' ? { labels: { format: '{value}%' } } : {}),
          },
          legend: { enabled: args.showLegend, align: 'center', verticalAlign: 'bottom' },
          tooltip: tooltipOpts,
          plotOptions: {
            [hcType]: {
              stacking: args.stacking ?? undefined,
              fillOpacity: args.stacking === 'percent' ? 1 : args.fillOpacity,
              marker: { enabled: false },
              zones: resolvedZones,
            },
            arearange: { fillOpacity: args.fillOpacity, lineWidth: 1 },
          } as Highcharts.PlotOptions,
          series,
        }}
      />
    );
  },
};
