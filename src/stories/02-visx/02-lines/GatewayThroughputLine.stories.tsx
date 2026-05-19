import type { Meta, StoryObj } from '@storybook/react';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleLinear, scaleTime } from '@visx/scale';
import { LinePath, Circle } from '@visx/shape';
import { GridRows } from '@visx/grid';
import { curveMonotoneX } from '@visx/curve';
import { fakeTimeSeries } from '../../../utils/fakeData';

const meta: Meta = {
  title: '02 visx/Lines/Gateway Throughput (visx half of Gateway detail)',
  parameters: {
    docs: {
      description: {
        component:
          'Throughput line on Gateway detail. Items 13, 14, 15 in the inventory: Gateway detail uses Highcharts for uptime (already migrated) and visx for throughput plus signal (still legacy). High data volume per item 14 with near-realtime ticking, which is part of why this stayed on visx. Production source: `Verkada-Web/src/command/gateways/details/common/gatewayChart/GatewayChart.tsx` plus `GatewayChartLivePoint.tsx`. Verity primitive target: `LineChart` (Highcharts) once the migration completes.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const series = fakeTimeSeries({ count: 120, stepMs: 60 * 1000, base: 850, amplitude: 280, noise: 60, seed: 4 });
    const width = 720;
    const height = 320;
    const margin = { top: 16, right: 16, bottom: 36, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const xMin = series[0][0];
    const xMax = series[series.length - 1][0];
    const yMax = Math.max(...series.map((p) => p[1])) * 1.1;
    const xScale = scaleTime<number>({ domain: [new Date(xMin), new Date(xMax)], range: [0, innerWidth] });
    const yScale = scaleLinear<number>({ domain: [0, yMax], range: [innerHeight, 0], nice: true });
    const livePoint = series[series.length - 1];
    return (
      <svg width={width} height={height} style={{ background: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
        <Group left={margin.left} top={margin.top}>
          <GridRows scale={yScale} width={innerWidth} stroke="#E5E7EB" strokeDasharray="2,2" />
          <LinePath
            data={series}
            x={(d) => xScale(new Date(d[0])) ?? 0}
            y={(d) => yScale(d[1]) ?? 0}
            stroke="#22C55E"
            strokeWidth={2}
            curve={curveMonotoneX}
          />
          <Circle
            cx={xScale(new Date(livePoint[0])) ?? 0}
            cy={yScale(livePoint[1]) ?? 0}
            r={5}
            fill="#22C55E"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
          <Circle
            cx={xScale(new Date(livePoint[0])) ?? 0}
            cy={yScale(livePoint[1]) ?? 0}
            r={10}
            fill="#22C55E"
            opacity={0.2}
          />
          <AxisBottom top={innerHeight} scale={xScale} stroke="#9CA3AF" tickStroke="#9CA3AF" numTicks={6} tickLabelProps={() => ({ fill: '#374151', fontSize: 11, textAnchor: 'middle' })} />
          <AxisLeft scale={yScale} stroke="#9CA3AF" tickStroke="#9CA3AF" tickLabelProps={() => ({ fill: '#374151', fontSize: 11, textAnchor: 'end', dx: -4, dy: 3 })} label="Mbps" labelProps={{ fill: '#374151', fontSize: 11, textAnchor: 'middle' }} />
        </Group>
      </svg>
    );
  },
};
