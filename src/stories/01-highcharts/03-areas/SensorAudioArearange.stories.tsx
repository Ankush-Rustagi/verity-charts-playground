import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { fakeArearange } from '../../../utils/fakeData';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Areas/Sensor Audio (arearange min/max envelope)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Min/max envelope visualization using `arearange`. The audio sensor chart shows the noise floor range per time bucket rather than a single value. Production source: `Verkada-Web/src/command/sensors/components/sensor-highcharts/hooks/useSensorHighchartsDataSeries.tsx` (audio branch). Verity primitive target: `AreaChart` with `kind: \'range\'` variant.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;

export const Default: Story = {
  render: () => {
    const data = fakeArearange({ count: 192, base: 42, spread: 18, noise: 3 });
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'arearange' },
          title: { text: 'Ambient noise (dB), last 16 hours' },
          xAxis: { type: 'datetime', crosshair: true },
          yAxis: { title: { text: 'dB' } },
          legend: { enabled: false },
          tooltip: { useHTML: true, shared: true, outside: true },
          plotOptions: {
            arearange: {
              fillOpacity: 0.35,
              lineWidth: 1,
              color: '#0EA5E9',
            },
          },
          series: [{ type: 'arearange', name: 'dB range', data }],
        }}
      />
    );
  },
};
