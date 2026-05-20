import type { Meta, StoryObj } from '@storybook/react';
import Highcharts from 'highcharts';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { LineChart, type ColorPalette } from '../../../primitives/VeritySimPrimitives';
import { fakeTimeSeries, fakePlotBands } from '../../../utils/fakeData';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Lines and Splines/Alarms Wireless Signal (RSSI, heatmap-style)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Connection signal strength chart, item 8 in the inventory. Per the user walk: extremely buried (Alarms then device list then WiFi icon then hover over Connection Signal Strength), but the chart itself is a hover-driven RSSI line with a color gradient from light to dark blue indicating signal quality. This is a representative example of a high-fidelity sensor-style chart hidden behind a low-discoverability UX path. Production source: `Verkada-Web/src/command/alarms-v3/alarm-system/components/device-detail/overview/device-metric-chart/DeviceMetricChart.tsx` (the RSSI variant). Verity primitive target: `SignalStrengthChart`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;
type LineArgs = {
  smooth: boolean;
  markers: boolean;
  zones: boolean;
  bands: number;
  xAxisTitle: string;
  yAxisTitle: string;
  tooltip: 'shared-crosshair' | 'point' | 'disabled';
  showLegend: boolean;
  colorPalette: ColorPalette;
};
type AfterVerityStory = StoryObj<LineArgs>;

export const Default: Story = {
  render: () => {
    const data = fakeTimeSeries({ count: 144, base: -62, amplitude: 14, noise: 3, stepMs: 10 * 60 * 1000, seed: 7 });
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'line' },
          title: { text: 'Connection signal strength (RSSI, dBm)' },
          xAxis: { type: 'datetime', crosshair: true },
          yAxis: {
            min: -100,
            max: -30,
            title: { text: 'RSSI (dBm)' },
          },
          legend: { enabled: false },
          tooltip: {
            useHTML: true,
            shared: true,
            outside: true,
            formatter: function () {
              const p = (this as Highcharts.TooltipFormatterContextObject).points?.[0];
              if (!p) return '';
              const rssi = p.y as number;
              const quality = rssi > -55 ? 'Excellent' : rssi > -70 ? 'Good' : rssi > -80 ? 'Fair' : 'Poor';
              return `<div><strong>${new Date(p.x as number).toLocaleTimeString()}</strong><br/>${rssi} dBm (${quality})</div>`;
            },
          },
          plotOptions: {
            line: {
              marker: { enabled: false },
              lineWidth: 2,
              zones: [
                { value: -80, color: '#1E3A8A' },
                { value: -70, color: '#1D4ED8' },
                { value: -55, color: '#3B82F6' },
                { color: '#93C5FD' },
              ],
            },
          },
          series: [{ type: 'line', name: 'RSSI', data }],
        }}
      />
    );
  },
};

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: LineChart + zones',
  args: { smooth: false, markers: false, zones: true, bands: 0, xAxisTitle: '', yAxisTitle: 'RSSI (dBm)', tooltip: 'shared-crosshair', showLegend: false, colorPalette: 'sequential' },
  argTypes: {
    smooth: {
      control: 'boolean',
      description: '`smooth?: boolean` — false = line, true = spline',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    markers: {
      control: 'boolean',
      description: '`markers?: boolean`',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    zones: {
      control: 'boolean',
      description: '`zones?: ZoneConfig[]` — RSSI quality coloring. Toggle to compare with/without.',
      table: { type: { summary: 'ZoneConfig[]' }, defaultValue: { summary: 'true (RSSI)' } },
    },
    bands: {
      control: { type: 'range', min: 0, max: 5, step: 1 },
      description: '`bands?: PlotBand[]` — alert-event plotBands',
      table: { type: { summary: 'PlotBand[]' }, defaultValue: { summary: '0' } },
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
    tooltip: {
      control: 'inline-radio',
      options: ['shared-crosshair', 'point', 'disabled'],
      description: '`tooltip?: { kind: ... }` (base prop)',
      table: { type: { summary: '"shared-crosshair" | "point" | "disabled"' }, defaultValue: { summary: '"shared-crosshair"' } },
    },
    showLegend: {
      control: 'boolean',
      description: '`showLegend?: boolean` (base prop)',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    colorPalette: {
      control: 'inline-radio',
      options: ['categorical', 'sequential', 'diverging', 'status'],
      description: '`colorPalette?: ColorPalette` (base prop) — drives zone colors. Sequential canonical for signal magnitude.',
      table: { type: { summary: 'ColorPalette' }, defaultValue: { summary: '"sequential"' } },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Same chart as a Verity `LineChart`. `colorPalette="sequential"` drives zone colors automatically. The sequential palette is darkest-first so worst signal (≤ −80 dBm) gets the darkest step and excellent signal (> −55 dBm) gets the lightest.\n\n**Production source:** Alarms: Wireless Connection Signal Strength (`src/command/alarms-v3/.../DeviceMetricChart.tsx`)',
      },
      source: {
        code: `<LineChart
  smooth={false}
  colorPalette="sequential"
  series={[{ name: 'RSSI', data: rssiData }]}
  zones={[
    { value: -80 },  // Poor     (≤ −80 dBm) → darkest sequential step
    { value: -70 },  // Fair     (−80 to −70)
    { value: -55 },  // Good     (−70 to −55)
    {},              // Excellent (> −55)    → lightest sequential step
  ]}
  tooltip={{ kind: 'shared-crosshair' }}
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => {
    const data  = fakeTimeSeries({ count: 144, base: -62, amplitude: 14, noise: 3, stepMs: 10 * 60 * 1000, seed: 7 });
    const eventBands = fakePlotBands({ count: args.bands });
    return (
      <LineChart
        smooth={args.smooth}
        markers={args.markers}
        colorPalette={args.colorPalette}
        showLegend={args.showLegend}
        xAxisTitle={args.xAxisTitle}
        yAxisTitle={args.yAxisTitle}
        series={[{ name: 'RSSI (dBm)', data: data as [number, number][] }]}
        zones={args.zones ? [{ value: -80 }, { value: -70 }, { value: -55 }, {}] : undefined}
        bands={eventBands.length > 0 ? eventBands : undefined}
        tooltip={{ kind: args.tooltip }}
      />
    );
  },
};
