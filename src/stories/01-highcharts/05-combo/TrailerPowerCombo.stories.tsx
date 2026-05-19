import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { fakeTimeSeries } from '../../../utils/fakeData';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Combo and Stock/Trailer Power Metrics (dual axis combo)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Dual y-axis combo: stacked columns (energy draw) on the left axis, spline (state of charge %) on the right axis. The most data-dense customer-facing chart per item 14 in the inventory. Production source: `Verkada-Web/src/command/trailers/common/PowerMetricsChart/PowerMetricsChart.tsx` (uses `ChartAdvanced` Stock wrapper). Verity primitive target: `ComboTimeSeriesChart`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;

export const Default: Story = {
  render: () => {
    const solar = fakeTimeSeries({ count: 96, base: 200, amplitude: 150, noise: 30, seed: 1 });
    const grid = fakeTimeSeries({ count: 96, base: 100, amplitude: 50, noise: 15, seed: 2 });
    const soc = fakeTimeSeries({ count: 96, base: 65, amplitude: 15, noise: 2, seed: 3 });
    return (
      <PlaygroundChart
        options={{
          chart: { zooming: { type: 'x' } },
          title: { text: 'Trailer power draw plus state of charge' },
          xAxis: { type: 'datetime', crosshair: true },
          yAxis: [
            {
              title: { text: 'Watts' },
              min: 0,
            },
            {
              title: { text: 'State of charge (%)' },
              opposite: true,
              min: 0,
              max: 100,
            },
          ],
          legend: { enabled: true, align: 'center', verticalAlign: 'bottom' },
          tooltip: { useHTML: true, shared: true, outside: true },
          plotOptions: {
            column: {
              stacking: 'normal',
              borderRadius: 0,
              groupPadding: 0,
              pointPadding: 0,
            },
            spline: {
              marker: { enabled: false },
              lineWidth: 2,
            },
          },
          series: [
            { type: 'column', name: 'Solar (W)', data: solar, yAxis: 0, color: '#F59E0B' },
            { type: 'column', name: 'Grid (W)', data: grid, yAxis: 0, color: '#9CA3AF' },
            { type: 'spline', name: 'SoC (%)', data: soc, yAxis: 1, color: '#22C55E' },
          ],
        }}
        height={420}
      />
    );
  },
};
