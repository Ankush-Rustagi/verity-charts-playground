import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { fakeTimeSeries } from '../../../utils/fakeData';

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
