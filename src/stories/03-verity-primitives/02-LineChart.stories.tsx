import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../primitives/PlaygroundChart';
import {
  type ColorPalette,
  type PlotBand,
  type ZoneConfig,
  PALETTE_HEX,
} from '../../primitives/VeritySimPrimitives';
import { fakeTimeSeries } from '../../utils/fakeData';

// Series starts at 2026-05-01T08:00:00Z = 1746086400000.
// Band timestamps are offsets from that anchor so defaults are visible in the chart.
const DEMO_BANDS: PlotBand[] = [
  { from: 1746090000000, to: 1746092700000, color: 'rgba(239,68,68,0.15)',   label: 'Alert: motion'    },
  { from: 1746104400000, to: 1746111600000, color: 'rgba(245,158,11,0.12)',  label: 'Alert: temp high' },
];

// Zones partition the y-axis (data around base 68, range ~52–88).
// Omit `color` to let the colorPalette drive zone coloring.
const DEMO_ZONES: ZoneConfig[] = [
  { value: 60 },   // ≤ 60 → zone 0 (danger with status palette)
  { value: 74 },   // 60–74 → zone 1 (warning with status palette)
  {},              // > 74  → zone 2 (success with status palette)
];

type Args = {
  smooth:       boolean;
  markers:      boolean;
  bands:        PlotBand[];
  zones:        ZoneConfig[];
  xAxisTitle:   string;
  yAxisTitle:   string;
  tooltip:      'shared-crosshair' | 'point' | 'disabled';
  showLegend:   boolean;
  colorPalette: ColorPalette;
};

const meta: Meta<Args> = {
  title: '03 Verity Primitives/LineChart',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Proposed Verity primitive for line / spline time-series. Single or multi-series, optional zones for threshold coloring, optional `bands` (alert-event plotBands) and threshold `plotLines`, three tooltip modes.\n\n' +
          '**Production sources:** Sales Conversion (`cameras-analytics`); Sensor Default Detail Chart; Alarms Wireless RSSI; Sensor Dashboard Tile (chrome-free); Gateway Historical GPS.\n\n' +
          '**Design note:** Open question — should `zones` and `thresholds` be the same prop? They serve adjacent purposes (color the data vs. annotate the axis) but in practice they\'re usually configured together.',
      },
    },
  },
  argTypes: {
    smooth: {
      control: 'boolean',
      description: '`smooth?: boolean` — `false` = straight `line` type, `true` = `spline`. Maps `chart.type`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    markers: {
      control: 'boolean',
      description: '`markers?: boolean` — shows data-point dots. Maps `plotOptions.[curve].marker.enabled`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    bands: {
      control: 'object',
      description:
        '`bands?: PlotBand[]` — `{ from, to, color, label? }` time-range overlays on the x-axis. ' +
        '`from`/`to` are Unix timestamps (ms). `color` should be a low-opacity fill (e.g. `rgba(239,68,68,0.15)`) or a `var(--vc-*)` token at reduced opacity. ' +
        'Default shows two alert-event bands anchored to the demo series start (2026-05-01T08:00Z).',
      table: { type: { summary: 'PlotBand[]' } },
    },
    zones: {
      control: 'object',
      description:
        '`zones?: ZoneConfig[]` — `{ value?, color? }` threshold bands on the series line/fill. ' +
        'Each entry colors from the previous threshold up to `value`; omit `value` on the last entry to color through the max. ' +
        'Omit `color` to let `colorPalette` drive zone colors (recommended). ' +
        'Default shows 3 zones partitioning the demo data range — try `colorPalette="status"` to see semantic coloring.',
      table: { type: { summary: 'ZoneConfig[]' } },
    },
    tooltip: {
      control: 'inline-radio',
      options: ['shared-crosshair', 'point', 'disabled'],
      description: '`tooltip?: { kind: "shared-crosshair" | "point" | "disabled" }` (base prop).',
      table: { type: { summary: '"shared-crosshair" | "point" | "disabled"' }, defaultValue: { summary: '"shared-crosshair"' } },
    },
    showLegend: {
      control: 'boolean',
      description: '`showLegend?: boolean` (base prop).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    colorPalette: {
      control: 'inline-radio',
      options: ['categorical', 'sequential', 'diverging', 'status'],
      description: '`colorPalette?: ColorPalette` (base prop) — drives series and zone colors. Try `"status"` with the default zones to see danger/warning/success coloring.',
      table: { type: { summary: 'ColorPalette' }, defaultValue: { summary: '"categorical"' } },
    },
    thresholds: {
      control: false,
      description: '`thresholds?: { value: number; color?: string; status?: StatusKey; label?: string }[]` — maps `yAxis.plotLines`.',
      table: { type: { summary: 'ThresholdLine[]' }, category: 'Proposed API' },
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
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {
  args: {
    smooth:       false,
    markers:      false,
    bands:        DEMO_BANDS,
    zones:        DEMO_ZONES,
    xAxisTitle:   '',
    yAxisTitle:   '',
    tooltip:      'shared-crosshair',
    showLegend:   false,
    colorPalette: 'categorical',
  },
  render: (args) => {
    const data    = fakeTimeSeries({ count: 144, base: 68, amplitude: 8, noise: 2 });
    const palette = PALETTE_HEX[args.colorPalette];
    const curve   = args.smooth ? 'spline' : 'line';
    const tooltipOpts = args.tooltip === 'disabled'
      ? { enabled: false }
      : { useHTML: true, shared: args.tooltip === 'shared-crosshair', outside: true };

    // Zone colors: use explicit color if set, otherwise use the palette by index.
    const resolvedZones = args.zones.length > 0
      ? args.zones.map((z, i) => ({ ...z, color: z.color ?? palette[i % palette.length] }))
      : undefined;

    return (
      <PlaygroundChart
        options={{
          chart: { type: curve },
          title: { text: '' },
          xAxis: {
            type: 'datetime',
            crosshair: args.tooltip !== 'disabled',
            plotBands: args.bands.length > 0 ? (args.bands as Highcharts.XAxisPlotBandsOptions[]) : undefined,
            title: { text: args.xAxisTitle },
          },
          yAxis: { title: { text: args.yAxisTitle } },
          legend: { enabled: args.showLegend, align: 'center', verticalAlign: 'bottom' },
          tooltip: tooltipOpts,
          plotOptions: {
            [curve]: {
              marker: { enabled: args.markers, radius: 3 },
              color:  palette[0],
              zones:  resolvedZones,
            },
          } as Highcharts.PlotOptions,
          series: [{ type: curve, name: 'Value', data }],
        }}
      />
    );
  },
};
