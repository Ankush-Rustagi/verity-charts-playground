import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Columns/Intercoms Dashboard (stacked weekly)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Stacked column over the past 7 days, categorical x-axis (day of week), multi-event-type stack with custom colors. The only customer-facing chart that imports `highcharts` directly instead of through Verity `Chart` (flagged as tech-debt in the inventory). Production source: `Verkada-Web/src/command/intercoms/pages/dashboard/DashboardBarGraph.tsx`. Verity primitive target: `ColumnChart` with `stacked: \'normal\'` and categorical axis support.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;

export const Default: Story = {
  render: () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'column' },
          title: { text: 'Intercom usage, past 7 days' },
          xAxis: { categories: days },
          yAxis: { min: 0, title: { text: 'Calls' } },
          legend: { enabled: true, align: 'center', verticalAlign: 'bottom' },
          tooltip: { useHTML: true, shared: true, outside: true },
          plotOptions: {
            column: {
              stacking: 'normal',
              borderRadius: 0,
              groupPadding: 0.1,
              pointPadding: 0,
            },
            series: {
              point: {
                events: {
                  click: function () {
                    alert(`Navigate to call list filtered by ${this.series.name} on ${this.category}`);
                  },
                },
              },
            },
          },
          series: [
            { type: 'column', name: 'Answered', data: [22, 30, 25, 28, 35, 18, 12], color: '#22C55E' },
            { type: 'column', name: 'Missed', data: [6, 4, 8, 5, 7, 3, 5], color: '#EF4444' },
            { type: 'column', name: 'Voicemail', data: [3, 5, 2, 6, 4, 8, 2], color: '#F59E0B' },
          ],
        }}
      />
    );
  },
};
