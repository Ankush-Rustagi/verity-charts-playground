import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { fakeTimeSeries } from '../../../utils/fakeData';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Areas/Participant Status (percent-stacked area)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Percent-stacked area showing composition over time. Only customer-facing chart that uses `stacking: \'percent\'`. Production source: `Verkada-Web/src/command/unite/pages/incidentDetails/dashboard/components/participantStatusOverTime/ParticipantStatusOvertimeChart.tsx`. Verity primitive target: `AreaChart` with `stacked: \'percent\'`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;

export const Default: Story = {
  render: () => {
    const checked = fakeTimeSeries({ count: 60, base: 30, amplitude: 8, noise: 3, seed: 1 });
    const inactive = fakeTimeSeries({ count: 60, base: 20, amplitude: 5, noise: 2, seed: 2 });
    const responded = fakeTimeSeries({ count: 60, base: 50, amplitude: 12, noise: 4, seed: 3 });
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'area' },
          title: { text: 'Participant status over time' },
          xAxis: { type: 'datetime', crosshair: true },
          yAxis: { title: { text: 'Share' }, labels: { format: '{value}%' } },
          legend: { enabled: true, align: 'center', verticalAlign: 'bottom' },
          tooltip: { useHTML: true, shared: true, outside: true },
          plotOptions: {
            area: {
              stacking: 'percent',
              marker: { enabled: false },
            },
          },
          series: [
            { type: 'area', name: 'Responded', data: responded, color: '#22C55E' },
            { type: 'area', name: 'Checked in', data: checked, color: '#3B82F6' },
            { type: 'area', name: 'Inactive', data: inactive, color: '#9CA3AF' },
          ],
        }}
      />
    );
  },
};
