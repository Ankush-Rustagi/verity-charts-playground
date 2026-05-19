import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { fakeTimeSeries } from '../../../utils/fakeData';

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
