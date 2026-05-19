import type { Meta, StoryObj } from '@storybook/react';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { LinePath } from '@visx/shape';
import { curveLinear } from '@visx/curve';
import { fakeTimeSeries } from '../../../utils/fakeData';

const meta: Meta = {
  title: '02 visx/Sparklines/Camera Network Indicator (live tile)',
  parameters: {
    docs: {
      description: {
        component:
          'Tiny network signal sparkline inside the camera video panel. Items 18 and 19 in the inventory both live on the Camera Analytics tab. Production source: `Verkada-Web/src/command/controllers/video/networkIndicator/CameraNetworkIndicator.tsx`. Per the inventory: visx was the right call here because the sparkline is embedded in a hover panel with strict size constraints; Highcharts adds DOM weight not worth its cost at this scale. Verity primitive target: `Sparkline` (could be either library; visx is the lighter footprint).',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const data = fakeTimeSeries({ count: 40, base: 12, amplitude: 4, noise: 1.2, seed: 55 });
    const width = 240;
    const height = 56;
    const xScale = scaleTime<number>({
      domain: [new Date(data[0][0]), new Date(data[data.length - 1][0])],
      range: [0, width],
    });
    const yScale = scaleLinear<number>({
      domain: [0, Math.max(...data.map((d) => d[1])) * 1.2],
      range: [height, 0],
    });
    return (
      <div style={{ width, padding: 12, borderRadius: 8, background: '#F9FAFB', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Network signal</div>
        <div style={{ fontSize: 20, fontWeight: 600, color: '#111827', marginBottom: 6 }}>92%</div>
        <svg width={width} height={height}>
          <Group>
            <LinePath
              data={data}
              x={(d) => xScale(new Date(d[0])) ?? 0}
              y={(d) => yScale(d[1]) ?? 0}
              stroke="#22C55E"
              strokeWidth={1.5}
              curve={curveLinear}
            />
          </Group>
        </svg>
      </div>
    );
  },
};
