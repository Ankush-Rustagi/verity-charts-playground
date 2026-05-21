import { CHART_FONT_FAMILY } from '../../../primitives/chartColors';
import type { Meta, StoryObj } from '@storybook/react';
import { SPARKLINE_ARG_TYPES } from '../../argTypes';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { LinePath } from '@visx/shape';
import { curveLinear } from '@visx/curve';
import { Sparkline, type ColorPalette } from '../../../primitives/VeritySimPrimitives';
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
      <div style={{ width, padding: 12, borderRadius: 8, background: '#F9FAFB', fontFamily: CHART_FONT_FAMILY }}>
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

type SparklineAfterArgs = {
  type:           'line' | 'area';
  caption:        string;
  unit:           string;
  status:         'success' | 'warning' | 'danger' | 'neutral';
  showLatestValue: boolean;
  width:          number;
  height:         number;
  colorPalette:   ColorPalette;
};

type AfterVerityStory = StoryObj<SparklineAfterArgs>;

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: Sparkline (migration from visx)',
  args: {
    type:            'line',
    caption:         'Network signal',
    unit:            '%',
    status:          'success',
    showLatestValue: true,
    width:           240,
    height:          56,
    colorPalette:    'categorical',
  },
  argTypes: {
    type:            SPARKLINE_ARG_TYPES.type,
    caption:         SPARKLINE_ARG_TYPES.caption,
    unit:            SPARKLINE_ARG_TYPES.unit,
    showLatestValue: SPARKLINE_ARG_TYPES.showLatestValue,
    width:           SPARKLINE_ARG_TYPES.width,
    height:          SPARKLINE_ARG_TYPES.height,
    colorPalette:    SPARKLINE_ARG_TYPES.colorPalette,
    // This story uses status as an interactive control (overrides colorPalette with a semantic token)
    status: {
      control: 'inline-radio',
      options: ['success', 'warning', 'danger', 'neutral'],
      description: '`status?: StatusKey` — semantic color override. Overrides `colorPalette` with a status token.',
      table: { type: { summary: 'StatusKey' } },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Same network signal tile using a Verity `Sparkline`. `status: "success"` (green) semantically signals a healthy signal reading. Migrates from visx to the standard Verity primitive.\n\n**Production source:** Camera Network Indicator (`src/command/controllers/video/networkIndicator/CameraNetworkIndicator.tsx`)',
      },
      source: {
        code: `<Sparkline
  data={signalData}
  type="line"
  caption="Network signal"
  unit="%"
  status="success"
  showLatestValue
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => {
    const data = fakeTimeSeries({ count: 40, base: 12, amplitude: 4, noise: 1.2, seed: 55 });
    return (
      <Sparkline
        data={data as [number, number][]}
        type={args.type}
        caption={args.caption}
        unit={args.unit}
        status={args.status}
        showLatestValue={args.showLatestValue}
        width={args.width}
        height={args.height}
        colorPalette={args.colorPalette}
      />
    );
  },
};
