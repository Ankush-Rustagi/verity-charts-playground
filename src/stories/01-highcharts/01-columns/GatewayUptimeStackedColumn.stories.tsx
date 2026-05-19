import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { fakeColumnSeries } from '../../../utils/fakeData';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Columns/Gateway Uptime (stacked, datetime)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Stacked column on a datetime axis, two-state visualization (online vs degraded). Models the Gateway uptime stack. Production source: `Verkada-Web/src/command/gateways/details/common/gatewayHighcharts/`. Verity primitive target: `ColumnChart` with `stacked: \'normal\'`. This is the second-largest production usage of `column`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;

export const Default: Story = {
  render: () => {
    const online = fakeColumnSeries({ count: 24, base: 50, amplitude: 8, noise: 2, seed: 42 }).values.map((v) =>
      Math.min(60, v),
    );
    const degraded = online.map((v) => Math.max(0, 60 - v));
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'column' },
          title: { text: 'Uptime by hour (last 24h)' },
          xAxis: {
            type: 'datetime',
            crosshair: true,
            title: { text: 'Time' },
          },
          yAxis: {
            min: 0,
            max: 60,
            title: { text: 'Minutes' },
          },
          legend: { enabled: true, align: 'center', verticalAlign: 'bottom' },
          tooltip: {
            useHTML: true,
            shared: true,
            outside: true,
          },
          plotOptions: {
            column: {
              stacking: 'normal',
              borderRadius: 0,
              groupPadding: 0,
              pointPadding: 0,
            },
          },
          series: [
            {
              type: 'column',
              name: 'Online',
              data: online.map((v, i) => [Date.UTC(2026, 4, 1, i), v]),
              color: '#22C55E',
            },
            {
              type: 'column',
              name: 'Degraded',
              data: degraded.map((v, i) => [Date.UTC(2026, 4, 1, i), v]),
              color: '#EF4444',
            },
          ],
        }}
      />
    );
  },
};
