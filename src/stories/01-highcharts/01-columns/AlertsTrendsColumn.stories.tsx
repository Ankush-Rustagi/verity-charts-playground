import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { fakeColumnSeries } from '../../../utils/fakeData';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Columns/Alerts Trends (Cameras Analytics)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Boring Highcharts column chart, hourly buckets, single series. Models the Cameras Analytics widgets. Production source: `Verkada-Web/src/command/cameras-analytics/components/alerts-trends/AlertsTrendsChart.tsx` plus the shared `cameras-analytics/utils/charts.ts` helper. Verity primitive target: `ColumnChart`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;

export const Default: Story = {
  render: () => {
    const { categories, values } = fakeColumnSeries({ count: 24 });
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'column' },
          title: { text: 'People crossings (hourly)' },
          xAxis: {
            categories,
            crosshair: true,
            title: { text: 'Hour of day' },
          },
          yAxis: {
            min: 0,
            title: { text: 'Crossings' },
          },
          legend: { enabled: false },
          tooltip: {
            useHTML: true,
            shared: true,
            outside: true,
            formatter: function () {
              const point = (this as Highcharts.TooltipFormatterContextObject).points?.[0];
              if (!point) return '';
              return `<div style="font-family:Inter,sans-serif"><strong>${point.x}</strong><br/>${point.y} crossings</div>`;
            },
          },
          plotOptions: {
            column: {
              borderRadius: 4,
              groupPadding: 0.1,
              pointPadding: 0.05,
              color: '#3B82F6',
            },
          },
          series: [
            {
              type: 'column',
              name: 'Crossings',
              data: values,
            },
          ],
        }}
      />
    );
  },
};
