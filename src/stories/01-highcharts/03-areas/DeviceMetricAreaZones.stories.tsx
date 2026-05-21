import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import {
  AreaChart,
  type ColorPalette,
  type ZoneConfig,
} from '../../../primitives/VeritySimPrimitives';
import { fakeTimeSeries } from '../../../utils/fakeData';
import { AREA_ARG_TYPES } from '../../argTypes';

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
  yZones:       ZoneConfig[];
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
  args: { variant: 'area', stacking: 'none', fillOpacity: 0.2, yZones: DEMO_RSSI_ZONES, xAxisTitle: '', yAxisTitle: 'RSSI (dBm)', showLegend: false, tooltip: 'point', colorPalette: 'status' },
  argTypes: {
    variant:      AREA_ARG_TYPES.variant,
    stacking:     AREA_ARG_TYPES.stacking,
    fillOpacity:  AREA_ARG_TYPES.fillOpacity,
    yZones:       AREA_ARG_TYPES.yZones,
    xAxisTitle:   AREA_ARG_TYPES.xAxisTitle,
    yAxisTitle:   AREA_ARG_TYPES.yAxisTitle,
    showLegend:   AREA_ARG_TYPES.showLegend,
    tooltip:      AREA_ARG_TYPES.tooltip,
    colorPalette: AREA_ARG_TYPES.colorPalette,
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
  yZones={[
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
    const activeZones = !isStacked && args.variant !== 'arearange' && args.yZones.length > 0
      ? args.yZones
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
        yZones={activeZones}
        tooltip={{ kind: args.tooltip }}
      />
    );
  },
};
