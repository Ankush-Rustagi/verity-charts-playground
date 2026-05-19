import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { fakeTimeSeries } from '../../../utils/fakeData';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Lines and Splines/Sensor Dashboard Tile (chrome-free, disabled tooltip)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Compact card-sized tile showing the last hour of sensor data. Disabled Highcharts tooltip (the parent card renders its own panel instead), no axes, minimal chart chrome. Item 5 in the inventory (Sensor Dashboard). Production source: `Verkada-Web/src/command/sensors/components/sensor-dashboard/DashboardLineGraphTile.tsx`. This is a great validation of the "tooltip: disabled, use external React panel" pattern from the audit. Verity primitive target: `LineChart` with a `chromeMinimal` preset.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;

export const Default: Story = {
  render: () => {
    const data = fakeTimeSeries({ count: 60, stepMs: 60 * 1000, base: 70.5, amplitude: 1.5, noise: 0.4, seed: 33 });
    const latest = data[data.length - 1][1];
    return (
      <div style={{ width: 240, padding: 16, borderRadius: 12, background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2, fontFamily: 'Inter, sans-serif' }}>
          Temperature, last hour
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, color: '#111827', marginBottom: 8, fontFamily: 'Inter, sans-serif' }}>
          {latest.toFixed(1)}°F
        </div>
        <PlaygroundChart
          options={{
            chart: {
              type: 'spline',
              backgroundColor: 'transparent',
              margin: [0, 0, 0, 0],
              spacing: [0, 0, 0, 0],
            },
            title: { text: '' },
            credits: { enabled: false },
            xAxis: { visible: false, type: 'datetime' },
            yAxis: { visible: false },
            legend: { enabled: false },
            tooltip: { enabled: false },
            plotOptions: {
              spline: {
                marker: { enabled: false },
                lineWidth: 2,
                color: '#0EA5E9',
              },
            },
            series: [{ type: 'spline', name: 'Temp', data }],
          }}
          height={64}
        />
      </div>
    );
  },
};
