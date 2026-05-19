import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Gauges/Unite Elapsed Clock (literal gauge)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Literal clock-face gauge. The only customer-facing use of `chart.type: \'gauge\'` (not `solidgauge`). Production source: `Verkada-Web/src/command/unite/pages/home/ElapsedTimeClock.tsx`. Audit recommendation: do not promote to Verity primitive; it is a one-off. Document the pattern, keep the file as a custom consumer.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;

export const Default: Story = {
  render: () => {
    const minutes = 7;
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'gauge', backgroundColor: 'transparent' },
          title: { text: '' },
          pane: {
            startAngle: 0,
            endAngle: 360,
            background: [
              { backgroundColor: '#F3F4F6', borderWidth: 0, outerRadius: '100%', innerRadius: '85%' },
            ],
          },
          yAxis: {
            min: 0,
            max: 60,
            tickInterval: 5,
            minorTickInterval: 1,
            tickLength: 8,
            tickWidth: 1,
            tickColor: '#9CA3AF',
            labels: { distance: 18, style: { fontSize: '11px' } },
          },
          tooltip: { enabled: false },
          credits: { enabled: false },
          plotOptions: {
            gauge: {
              dial: {
                radius: '85%',
                backgroundColor: '#111827',
                baseWidth: 4,
                topWidth: 1,
              },
              pivot: { radius: 6, backgroundColor: '#111827' },
            },
          },
          series: [
            {
              type: 'gauge',
              name: 'Elapsed',
              data: [minutes],
              dataLabels: { enabled: false },
            },
          ],
        }}
        height={320}
      />
    );
  },
};
