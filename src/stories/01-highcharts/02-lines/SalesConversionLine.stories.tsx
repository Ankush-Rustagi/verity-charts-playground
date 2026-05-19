import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { fakeTimeSeries } from '../../../utils/fakeData';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Lines and Splines/Sales Conversion (line)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Single-series line on a datetime axis with point markers and shared tooltip. Models Cameras Analytics conversion rate widget. Production source: `Verkada-Web/src/command/cameras-analytics/components/sales-conversion-rate-widget/SalesConversionRateChart.tsx`. Verity primitive target: `LineChart`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;

export const Default: Story = {
  render: () => {
    const data = fakeTimeSeries({ count: 30, base: 0.18, amplitude: 0.05, noise: 0.01, stepMs: 24 * 60 * 60 * 1000 });
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'line' },
          title: { text: 'Sales conversion rate (daily)' },
          xAxis: { type: 'datetime', crosshair: true },
          yAxis: {
            min: 0,
            max: 0.4,
            title: { text: 'Conversion rate' },
            labels: { formatter: function () { return `${Math.round((this.value as number) * 100)}%`; } },
          },
          legend: { enabled: false },
          tooltip: {
            useHTML: true,
            shared: true,
            outside: true,
            formatter: function () {
              const p = (this as Highcharts.TooltipFormatterContextObject).points?.[0];
              if (!p) return '';
              const date = new Date(p.x as number).toLocaleDateString();
              return `<div><strong>${date}</strong><br/>${Math.round((p.y as number) * 100)}% conversion</div>`;
            },
          },
          plotOptions: {
            line: {
              marker: { enabled: true, radius: 3 },
              color: '#3B82F6',
            },
          },
          series: [{ type: 'line', name: 'Conversion', data }],
        }}
      />
    );
  },
};
