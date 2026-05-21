import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../primitives/PlaygroundChart';
import {
  type ColorPalette,
  type PlotBand,
  type ZoneConfig,
  PALETTE_HEX,
  toHCPlotBands,
} from '../../primitives/VeritySimPrimitives';
import { fakeTimeSeries, fakePlotBands } from '../../utils/fakeData';
import { LINE_ARG_TYPES } from '../argTypes';

// fakePlotBands defaults: start=2026-05-01T09:00:00Z, 3 bands, 4h spacing, 45min width.
// fakeTimeSeries starts at 2026-05-01T08:00:00Z with 144 points × 15 min = ~36h.
// All three bands fall within the visible range.
const DEMO_X_BANDS: PlotBand[] = fakePlotBands();

// Y-zones partition the y-axis (data around base 68, range ~52–88).
// Omit `color` to let colorPalette drive zone coloring.
const DEMO_Y_ZONES: ZoneConfig[] = [
  { value: 60 },   // ≤ 60 → zone 0 (danger with status palette)
  { value: 74 },   // 60–74 → zone 1 (warning with status palette)
  {},              // > 74  → zone 2 (success with status palette)
];

type Args = {
  smooth:       boolean;
  markers:      boolean;
  xBands:       PlotBand[];
  yZones:       ZoneConfig[];
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
          'Proposed Verity primitive for line / spline time-series. Single or multi-series, optional `yZones` for y-value threshold coloring, optional `xBands` (alert-event background overlays) and `thresholds` (plotLines), three tooltip modes.\n\n' +
          '**`xBands` vs `yZones`:** `xBands` shade a background rectangle over a *time range* on the x-axis (e.g. alert events). `yZones` re-color the line itself as it crosses a *data value* on the y-axis (e.g. temp danger threshold). Set `colorPalette="status"` to activate semantic token coloring for zones.\n\n' +
          '**Production sources:** Sales Conversion (`cameras-analytics`); Sensor Default Detail Chart; Alarms Wireless RSSI; Sensor Dashboard Tile (chrome-free); Gateway Historical GPS.\n\n' +
          '**Design note:** Open question — should `yZones` and `thresholds` be the same prop? They serve adjacent purposes (color the data vs. annotate the axis) but in practice they\'re usually configured together.',
      },
    },
  },
  argTypes: {
    ...LINE_ARG_TYPES,
    thresholds: {
      control: false,
      description: '`thresholds?: { value: number; color?: string; status?: StatusKey; label?: string }[]` — maps `yAxis.plotLines`.',
      table: { type: { summary: 'ThresholdLine[]' }, category: 'Proposed API' },
    },
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {
  args: {
    smooth:       false,
    markers:      false,
    xBands:       DEMO_X_BANDS,
    yZones:       DEMO_Y_ZONES,
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

    // yZone colors: explicit override if set, else palette by index.
    const resolvedZones = args.yZones.length > 0
      ? args.yZones.map((z, i) => ({ ...z, color: z.color ?? palette[i % palette.length] }))
      : undefined;

    return (
      <PlaygroundChart
        options={{
          chart: { type: curve },
          title: { text: '' },
          xAxis: {
            type: 'datetime',
            crosshair: args.tooltip !== 'disabled',
            plotBands: args.xBands.length > 0 ? toHCPlotBands(args.xBands) : undefined,
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
