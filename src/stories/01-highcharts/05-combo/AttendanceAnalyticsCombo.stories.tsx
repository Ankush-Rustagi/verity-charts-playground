import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { fakeTimeSeries } from '../../../utils/fakeData';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Combo and Stock/Attendance Analytics (Stock + tickPositioner)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Time view: filled area chart over a datetime axis with a custom `tickPositioner` for sparse axis labels and a stepped area background. Wired to the Verity filter bar in production. Per the inventory, this is the closest existing surface to a prompt-to-chart prototype: a Verity filter bar already drives a Verity chart, so swapping the filter bar for an NL input is the smallest unlock. Production source: `Verkada-Web/src/command/access/attendance-analytics/AttendanceAnalyticsCombinedChart.tsx`. Verity primitive target: `ComboTimeSeriesChart`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;

export const Default: Story = {
  render: () => {
    const checkedIn = fakeTimeSeries({ count: 96, stepMs: 15 * 60 * 1000, base: 40, amplitude: 25, noise: 4, seed: 11 });
    const expected = fakeTimeSeries({ count: 96, stepMs: 15 * 60 * 1000, base: 60, amplitude: 18, noise: 2, seed: 22 });
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'area', zooming: { type: 'x' } },
          title: { text: 'Attendance, last 24 hours' },
          xAxis: {
            type: 'datetime',
            crosshair: true,
            tickPositioner: function () {
              const positions: number[] = [];
              const { min, max } = this.getExtremes();
              const step = (max - min) / 6;
              for (let i = 0; i <= 6; i += 1) positions.push(Math.round(min + i * step));
              return positions;
            },
          },
          yAxis: { min: 0, title: { text: 'People' } },
          legend: { enabled: false },
          tooltip: { useHTML: true, shared: true, outside: true },
          plotOptions: {
            area: {
              marker: { enabled: false },
              fillOpacity: 0.18,
            },
          },
          series: [
            { type: 'area', name: 'Expected (capacity)', data: expected, color: '#9CA3AF', step: 'center' as Highcharts.OptionsStepValue, fillOpacity: 0.06 },
            { type: 'area', name: 'Checked in', data: checkedIn, color: '#3B82F6' },
          ],
        }}
      />
    );
  },
};
