import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import {
  AreaChart,
  type ColorPalette,
  type ZoneConfig,
} from '../../../primitives/VeritySimPrimitives';
import { fakeTimeSeries } from '../../../utils/fakeData';

// RSSI data: base −60 dBm, range roughly −80 to −40.
// Zones partition the signal quality range; omit `color` to let colorPalette drive.
const DEMO_RSSI_ZONES: ZoneConfig[] = [
  { value: -70 },  // ≤ −70 dBm → poor     (danger  with status palette)
  { value: -50 },  // −70 to −50 → moderate (warning with status palette)
  {},              // > −50 dBm  → strong   (success with status palette)
];

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Areas/Device Metric RSSI (area + zones + plotLines)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Single-series area with color zones (green/yellow/red bands) and plotLines for tier thresholds. Models the Alarms device metric chart. Production source: `Verkada-Web/src/command/alarms-v3/alarm-system/components/device-detail/overview/device-metric-chart/DeviceMetricChart.tsx`. Verity primitive target: `SignalStrengthChart` (or `LineChart` with structured `zones` and `thresholds` props).',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;
type AreaArgs = {
  variant:      'area' | 'areaspline' | 'arearange';
  stacking:     'normal' | 'percent' | 'none';
  fillOpacity:  number;
  zones:        ZoneConfig[];
  xAxisTitle:   string;
  yAxisTitle:   string;
  showLegend:   boolean;
  tooltip:      'shared-crosshair' | 'point' | 'disabled';
  colorPalette: ColorPalette;
};
type AfterVerityStory = StoryObj<AreaArgs>;

export const Default: Story = {
  render: () => {
    const data = fakeTimeSeries({ count: 96, base: -60, amplitude: 12, noise: 4, stepMs: 15 * 60 * 1000 });
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'line' },
          title: { text: 'WiFi RSSI (dBm), last 24 hours' },
          xAxis: { type: 'datetime', crosshair: true },
          yAxis: {
            min: -100,
            max: -30,
            title: { text: 'RSSI (dBm)' },
            plotLines: [
              { value: -50, color: '#22C55E', dashStyle: 'Dash', width: 1, label: { text: 'Strong' } },
              { value: -70, color: '#F59E0B', dashStyle: 'Dash', width: 1, label: { text: 'Weak' } },
              { value: -80, color: '#EF4444', dashStyle: 'Dash', width: 1, label: { text: 'Critical' } },
            ],
          },
          legend: { enabled: false },
          tooltip: { useHTML: true, outside: true },
          plotOptions: {
            area: {
              fillOpacity: 0.2,
            },
            series: {
              marker: { enabled: false },
              zones: [
                { value: -70, color: '#EF4444' },
                { value: -50, color: '#F59E0B' },
                { color: '#22C55E' },
              ],
            },
          },
          series: [{ type: 'area', name: 'RSSI', data }],
        }}
      />
    );
  },
};

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: AreaChart + zones',
  args: { variant: 'area', stacking: 'none', fillOpacity: 0.2, zones: DEMO_RSSI_ZONES, xAxisTitle: '', yAxisTitle: 'RSSI (dBm)', showLegend: false, tooltip: 'point', colorPalette: 'status' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['area', 'areaspline', 'arearange'],
      description: '`variant?: "area" | "areaspline" | "arearange"`',
      table: { type: { summary: '"area" | "areaspline" | "arearange"' }, defaultValue: { summary: '"area"' } },
    },
    stacking: {
      control: 'inline-radio',
      options: ['none', 'normal', 'percent'],
      description: '`stacking?: "normal" | "percent" | "none"`',
      table: { type: { summary: '"normal" | "percent" | "none"' }, defaultValue: { summary: '"none"' } },
    },
    fillOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: '`fillOpacity?: number`',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0.2' } },
    },
    zones: {
      control: 'object',
      description:
        '`zones?: ZoneConfig[]` — `{ value?, color? }` threshold bands on the series fill. ' +
        'Each entry colors from the previous threshold up to `value`; omit `value` on the last entry. ' +
        'Omit `color` to let `colorPalette` drive colors. ' +
        'Default partitions RSSI quality tiers (≤ −70 dBm poor / −70 to −50 moderate / > −50 strong). ' +
        'Edit thresholds to see realtime zone boundaries shift.',
      table: { type: { summary: 'ZoneConfig[]' } },
    },
    xAxisTitle: {
      control: 'text',
      description: '`xAxisTitle?: string` — shorthand for `xAxis.title`.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '""' } },
    },
    yAxisTitle: {
      control: 'text',
      description: '`yAxisTitle?: string` — shorthand for `yAxis.title`.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '"RSSI (dBm)"' } },
    },
    showLegend: {
      control: 'boolean',
      description: '`showLegend?: boolean` (base prop)',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    tooltip: {
      control: 'inline-radio',
      options: ['shared-crosshair', 'point', 'disabled'],
      description: '`tooltip?: { kind: ... }` (base prop)',
      table: { type: { summary: '"shared-crosshair" | "point" | "disabled"' }, defaultValue: { summary: '"point"' } },
    },
    colorPalette: {
      control: 'inline-radio',
      options: ['categorical', 'sequential', 'diverging', 'status'],
      description: '`colorPalette?: ColorPalette` (base prop) — drives zone colors. `"status"` is canonical for signal quality: danger-first → poor signal gets red, strong gets green.',
      table: { type: { summary: 'ColorPalette' }, defaultValue: { summary: '"status"' } },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Same chart as a Verity `AreaChart`. `colorPalette="status"` drives zone colors automatically — no per-zone color props. The status zone palette is danger-first, so the lowest value band (poor signal, ≤ −70 dBm) gets danger red and the highest band (strong signal, > −50 dBm) gets success green. `fillOpacity` and `tooltip` stay as-is.\n\n**Production source:** Alarms: Device Metric RSSI (`src/command/alarms-v3/.../DeviceMetricChart.tsx`)',
      },
      source: {
        code: `<AreaChart
  variant="area"
  colorPalette="status"
  series={[{ name: 'RSSI', data: rssiData }]}
  zones={[
    { value: -70 },  // Poor     (≤ −70 dBm) → danger
    { value: -50 },  // Moderate (−70 to −50) → warning
    {},              // Strong   (> −50 dBm)  → success
  ]}
  fillOpacity={0.2}
  tooltip={{ kind: 'point' }}
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => {
    const data = fakeTimeSeries({ count: 96, base: -60, amplitude: 12, noise: 4, stepMs: 15 * 60 * 1000 });
    const secondSeries = fakeTimeSeries({ count: 96, base: -50, amplitude: 8, noise: 3, seed: 2, stepMs: 15 * 60 * 1000 });
    const isStacked = args.stacking !== 'none';
    const activeZones = !isStacked && args.variant !== 'arearange' && args.zones.length > 0
      ? args.zones
      : undefined;
    return (
      <AreaChart
        variant={args.variant}
        stacking={args.stacking}
        fillOpacity={args.fillOpacity}
        xAxisTitle={args.xAxisTitle}
        yAxisTitle={args.yAxisTitle}
        colorPalette={args.colorPalette}
        showLegend={isStacked ? true : args.showLegend}
        series={
          isStacked
            ? [
                { name: 'RSSI (dBm)', data: data as [number, number][] },
                { name: 'Secondary',  data: secondSeries as [number, number][] },
              ]
            : [{ name: 'RSSI (dBm)', data: data as [number, number][] }]
        }
        zones={activeZones}
        tooltip={{ kind: args.tooltip }}
      />
    );
  },
};
