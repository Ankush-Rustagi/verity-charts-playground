import type { Meta, StoryObj } from '@storybook/react';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleLinear, scaleTime } from '@visx/scale';
import { LinePath, AreaClosed } from '@visx/shape';
import { GridRows } from '@visx/grid';
import { curveMonotoneX } from '@visx/curve';
import { AreaChart, type ColorPalette } from '../../../primitives/VeritySimPrimitives';
import { fakeTimeSeries } from '../../../utils/fakeData';

const meta: Meta = {
  title: '02 visx/Lines/Camera Device Stats Battery (Omaha team, 2025)',
  parameters: {
    docs: {
      description: {
        component:
          'Camera Device Stats battery line. Shipped by the Omaha team in 2025 (per the inventory timeline) on visx, even though Verity Chart had landed by then. Per the OSS Scout verification notes: the choice was driven by timing plus React ergonomics (state-driven tooltips, animation responsiveness), not by a Highcharts capability gap. Production source: `Verkada-Web/src/command/ui/camera-page/routes/stats/components/omaha-camera-stats-chart/battery-linegraph/BatteryLineGraph.tsx`. Verity primitive target: `LineChart` once migration appetite is there.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const series = fakeTimeSeries({ count: 168, stepMs: 60 * 60 * 1000, base: 75, amplitude: 18, noise: 3, seed: 17, trend: -0.08 }).map(
      ([t, v]) => [t, Math.max(0, Math.min(100, v))] as [number, number],
    );
    const width = 640;
    const height = 280;
    const margin = { top: 16, right: 16, bottom: 36, left: 48 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const xScale = scaleTime<number>({
      domain: [new Date(series[0][0]), new Date(series[series.length - 1][0])],
      range: [0, innerWidth],
    });
    const yScale = scaleLinear<number>({ domain: [0, 100], range: [innerHeight, 0] });
    return (
      <svg width={width} height={height} style={{ background: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
        <Group left={margin.left} top={margin.top}>
          <GridRows scale={yScale} width={innerWidth} stroke="#E5E7EB" strokeDasharray="2,2" />
          <AreaClosed
            data={series}
            x={(d) => xScale(new Date(d[0])) ?? 0}
            y={(d) => yScale(d[1]) ?? 0}
            yScale={yScale}
            fill="#22C55E"
            fillOpacity={0.15}
            curve={curveMonotoneX}
          />
          <LinePath
            data={series}
            x={(d) => xScale(new Date(d[0])) ?? 0}
            y={(d) => yScale(d[1]) ?? 0}
            stroke="#22C55E"
            strokeWidth={2}
            curve={curveMonotoneX}
          />
          <AxisBottom top={innerHeight} scale={xScale} stroke="#9CA3AF" tickStroke="#9CA3AF" numTicks={7} tickLabelProps={() => ({ fill: '#374151', fontSize: 10, textAnchor: 'middle' })} />
          <AxisLeft scale={yScale} stroke="#9CA3AF" tickStroke="#9CA3AF" tickFormat={(v) => `${v}%`} tickLabelProps={() => ({ fill: '#374151', fontSize: 11, textAnchor: 'end', dx: -4, dy: 3 })} />
        </Group>
      </svg>
    );
  },
};

type AreaAfterArgs = {
  variant:      'area' | 'areaspline';
  fillOpacity:  number;
  showLegend:   boolean;
  tooltip:      'shared-crosshair' | 'point' | 'disabled';
  colorPalette: ColorPalette;
  xAxisTitle:   string;
  yAxisTitle:   string;
};

type AfterVerityStory = StoryObj<AreaAfterArgs>;

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: AreaChart (migration from visx)',
  args: {
    variant:      'areaspline',
    fillOpacity:  0.18,
    showLegend:   false,
    tooltip:      'shared-crosshair',
    colorPalette: 'categorical',
    xAxisTitle:   '',
    yAxisTitle:   'Battery (%)',
  },
  argTypes: {
    variant:      { control: 'inline-radio', options: ['area', 'areaspline'], description: '`area` = hard corners; `areaspline` = smooth curve.' },
    fillOpacity:  { control: { type: 'range', min: 0, max: 1, step: 0.01 }, description: 'Fill opacity under the line (0 = no fill).' },
    showLegend:   { control: 'boolean', description: 'Show/hide the chart legend.' },
    tooltip:      { control: 'inline-radio', options: ['shared-crosshair', 'point', 'disabled'], description: 'Tooltip interaction mode.' },
    colorPalette: { control: 'inline-radio', options: ['categorical', 'status', 'sequential', 'diverging'], description: 'Token-based color palette.' },
    xAxisTitle:   { control: 'text', description: 'X-axis label.' },
    yAxisTitle:   { control: 'text', description: 'Y-axis label.' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Same battery trend using a Verity `AreaChart`. `status: "success"` (green) semantically signals healthy battery level. Migrates from visx to the standard Verity primitive.\n\n**Production source:** Camera Device Stats: Battery (`src/command/ui/camera-page/routes/stats/components/omaha-camera-stats-chart/battery-linegraph/BatteryLineGraph.tsx`)',
      },
      source: {
        code: `<AreaChart
  variant="areaspline"
  series={[{ name: 'Battery', data: batteryData, status: 'success' }]}
  tooltip={{ kind: 'shared-crosshair' }}
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => {
    const series = fakeTimeSeries({
      count: 168, stepMs: 60 * 60 * 1000, base: 75, amplitude: 18, noise: 3, seed: 17, trend: -0.08,
    }).map(([t, v]) => [t, Math.max(0, Math.min(100, v))] as [number, number]);
    return (
      <AreaChart
        variant={args.variant}
        fillOpacity={args.fillOpacity}
        showLegend={args.showLegend}
        tooltip={{ kind: args.tooltip }}
        colorPalette={args.colorPalette}
        xAxisTitle={args.xAxisTitle}
        yAxisTitle={args.yAxisTitle}
        series={[{ name: 'Battery (%)', data: series, status: 'success' }]}
      />
    );
  },
};