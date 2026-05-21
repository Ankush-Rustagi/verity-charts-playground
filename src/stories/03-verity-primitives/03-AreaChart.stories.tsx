import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../primitives/PlaygroundChart';
import {
  type ColorPalette,
  type PlotBand,
  type ZoneConfig,
  PALETTE_HEX,
  toHCPlotBands,
} from '../../primitives/VeritySimPrimitives';
import { fakeTimeSeries, fakeArearange } from '../../utils/fakeData';
import { AREA_ARG_TYPES } from '../argTypes';

// Y-zones for single-series area (data around base 50, range ~28–72).
// Omit `color` to let colorPalette drive zone coloring.
const DEMO_Y_ZONES: ZoneConfig[] = [
  { value: 40 },  // ≤ 40 → zone 0 (danger with status palette)
  { value: 55 },  // 40–55 → zone 1 (warning)
  {},             // > 55  → zone 2 (success)
];

type Args = {
  variant:      'area' | 'areaspline' | 'arearange';
  stacking:     'normal' | 'percent' | 'none';
  fillOpacity:  number;
  xBands:       PlotBand[];
  yZones:       ZoneConfig[];
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
    ...AREA_ARG_TYPES,
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
    xBands:       [],
    yZones:       DEMO_Y_ZONES,
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

    // Y-zone colors: explicit override if set, else palette by index.
    const resolvedZones = isSingleNoRange && args.yZones.length > 0
      ? args.yZones.map((z, i) => ({ ...z, color: z.color ?? palette[i % palette.length] }))
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
            plotBands: isSingleNoRange && args.xBands.length > 0
              ? toHCPlotBands(args.xBands)
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
