import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Gauges/Connect Box (solidgauge donut)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Solidgauge donut with center text label. Models the Connect Box stats page. Production source: `Verkada-Web/src/command/connectors/components/connect-box-stats-page/ConnectBoxGauge.tsx`. Verity primitive target: `Gauge` (donut variant). Covers 4 production files.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;

export const Default: Story = {
  render: () => {
    const value = 73;
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'solidgauge', backgroundColor: 'transparent' },
          title: { text: '' },
          pane: {
            center: ['50%', '60%'],
            size: '100%',
            startAngle: -120,
            endAngle: 120,
            background: [
              {
                backgroundColor: '#E5E7EB',
                innerRadius: '75%',
                outerRadius: '100%',
                shape: 'arc',
              },
            ],
          },
          yAxis: {
            min: 0,
            max: 100,
            stops: [
              [0.0, '#EF4444'],
              [0.5, '#F59E0B'],
              [0.85, '#22C55E'],
            ],
            tickPositions: [],
            labels: { enabled: false },
          },
          tooltip: { enabled: false },
          credits: { enabled: false },
          plotOptions: {
            solidgauge: {
              dataLabels: {
                enabled: true,
                useHTML: true,
                y: -20,
                formatter: function () {
                  return `<div style="text-align:center;font-family:Inter,sans-serif"><div style="font-size:48px;font-weight:700">${this.y}%</div><div style="font-size:14px;color:#6B7280;margin-top:4px">Camera uptime</div></div>`;
                },
              },
              innerRadius: '75%',
              radius: '100%',
            },
          },
          series: [
            {
              type: 'solidgauge',
              name: 'Uptime',
              data: [value],
            },
          ],
        }}
        height={320}
      />
    );
  },
};
