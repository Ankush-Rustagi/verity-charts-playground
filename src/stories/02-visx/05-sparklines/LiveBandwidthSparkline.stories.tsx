import { CHART_FONT_FAMILY } from '../../../primitives/chartColors';
import type { Meta, StoryObj } from '@storybook/react';
import { SPARKLINE_ARG_TYPES } from '../../argTypes';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { AreaClosed, LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { Sparkline, type ColorPalette } from '../../../primitives/VeritySimPrimitives';
import { fakeTimeSeries } from '../../../utils/fakeData';

const meta: Meta = {
  title: '02 visx/Sparklines/Live Bandwidth Sparkline (Camera Analytics tab)',
  parameters: {
    docs: {
      description: {
        component:
          'Live bandwidth sparkline tile, ticking in near-realtime. Item 18 in the inventory. Production source: `Verkada-Web/src/command/components/bandwidth-limit/LiveBandwidthChart.tsx`. Per the inventory rationale: tiny sparklines with high update frequency favor lightweight visx over Highcharts for DOM weight and render cost reasons.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;
type SparklineArgs = {
  type: 'line' | 'area';
  height: number;
  width: number;
  colorPalette: ColorPalette;
  showLatestValue: boolean;
  caption: string;
  unit: string;
};
type AfterVerityStory = StoryObj<SparklineArgs>;

export const Default: Story = {
  render: () => {
    const data = fakeTimeSeries({ count: 60, base: 14, amplitude: 6, noise: 2, seed: 77 });
    const latest = data[data.length - 1][1];
    const width = 280;
    const height = 60;
    const xScale = scaleTime<number>({
      domain: [new Date(data[0][0]), new Date(data[data.length - 1][0])],
      range: [0, width],
    });
    const yScale = scaleLinear<number>({
      domain: [0, Math.max(...data.map((d) => d[1])) * 1.2],
      range: [height, 0],
    });
    return (
      <div style={{ width: width + 24, padding: 12, borderRadius: 8, background: '#FFFFFF', border: '1px solid #E5E7EB', fontFamily: CHART_FONT_FAMILY }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#6B7280' }}>Live bandwidth</span>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>{latest.toFixed(1)} Mbps</span>
        </div>
        <svg width={width} height={height}>
          <Group>
            <AreaClosed
              data={data}
              x={(d) => xScale(new Date(d[0])) ?? 0}
              y={(d) => yScale(d[1]) ?? 0}
              yScale={yScale}
              fill="#3B82F6"
              fillOpacity={0.18}
              curve={curveMonotoneX}
            />
            <LinePath
              data={data}
              x={(d) => xScale(new Date(d[0])) ?? 0}
              y={(d) => yScale(d[1]) ?? 0}
              stroke="#3B82F6"
              strokeWidth={1.5}
              curve={curveMonotoneX}
            />
          </Group>
        </svg>
      </div>
    );
  },
};

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: Sparkline (migration from visx)',
  args: { type: 'area', height: 60, width: 280, colorPalette: 'categorical', showLatestValue: true, caption: 'Live bandwidth', unit: ' Mbps' },
  argTypes: {
    ...SPARKLINE_ARG_TYPES,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Same bandwidth tile using a Verity `Sparkline`. `colorPalette="categorical"` gives the area `--vc-1` (brand blue). Card chrome built into the primitive. No hex in consumer code.\n\n**Production source:** Camera Analytics: Live Bandwidth sparkline (`src/command/components/bandwidth-limit/LiveBandwidthChart.tsx`)',
      },
      source: {
        code: `<Sparkline
  data={bandwidthData}
  type="area"
  caption="Live bandwidth"
  unit=" Mbps"
  colorPalette="categorical"
  showLatestValue
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => {
    const data = fakeTimeSeries({ count: 60, base: 14, amplitude: 6, noise: 2, seed: 77 });
    return (
      <Sparkline
        data={data as [number, number][]}
        type={args.type}
        caption={args.caption}
        unit={args.unit}
        colorPalette={args.colorPalette}
        showLatestValue={args.showLatestValue}
        height={args.height}
        width={args.width}
      />
    );
  },
};
