import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../primitives/PlaygroundChart';
import { PrimitiveStoryLayout } from '../../primitives/PrimitiveStoryLayout';
import { fakeTimeSeries } from '../../utils/fakeData';

type Args = {
  shape: 'line' | 'area';
  height: number;
  width: number;
  color: string;
  showLatestValue: boolean;
  caption: string;
  unit: string;
};

const meta: Meta<Args> = {
  title: '03 Verity Primitives/Sparkline',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Proposed Verity primitive for chrome-free, tile-sized time-series visualizations. No axes, no legend, optional latest-value display in the card chrome. Covers items 18 and 19 in the inventory. Today these are visx on production; the primitive could ship as Highcharts or visx internally. The recommendation is whichever the Verity team is happier maintaining; the consumer API is the same either way.',
      },
    },
  },
  argTypes: {
    shape: { control: 'inline-radio', options: ['line', 'area'] },
    height: { control: { type: 'range', min: 32, max: 120, step: 4 } },
    width: { control: { type: 'range', min: 120, max: 320, step: 20 } },
    color: { control: 'color' },
    showLatestValue: { control: 'boolean' },
    caption: { control: 'text' },
    unit: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {
  args: { shape: 'area', height: 56, width: 240, color: '#22C55E', showLatestValue: true, caption: 'Network signal', unit: '%' },
  render: (args) => {
    const data = fakeTimeSeries({ count: 48, base: 18, amplitude: 6, noise: 1.5 });
    const latest = data[data.length - 1][1];
    return (
      <PrimitiveStoryLayout
        chart={
          <div style={{ width: args.width, padding: 12, borderRadius: 8, background: '#F9FAFB', fontFamily: 'Inter, sans-serif' }}>
            {args.showLatestValue ? (
              <>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>{args.caption}</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#111827', marginBottom: 6 }}>
                  {latest.toFixed(1)}
                  {args.unit}
                </div>
              </>
            ) : null}
            <PlaygroundChart
              options={{
                chart: {
                  type: args.shape === 'line' ? 'spline' : 'areaspline',
                  backgroundColor: 'transparent',
                  margin: [0, 0, 0, 0],
                  spacing: [0, 0, 0, 0],
                },
                title: { text: '' },
                credits: { enabled: false },
                xAxis: { visible: false, type: 'datetime' },
                yAxis: { visible: false },
                legend: { enabled: false },
                tooltip: { enabled: false },
                plotOptions: {
                  spline: { marker: { enabled: false }, lineWidth: 1.5, color: args.color },
                  areaspline: { fillOpacity: 0.3, lineWidth: 1.5, color: args.color, marker: { enabled: false } },
                },
                series: [{ type: args.shape === 'line' ? 'spline' : 'areaspline', name: args.caption, data }],
              }}
              height={args.height}
            />
          </div>
        }
        propsAPI={[
          { raw: 'chart.type: "spline" | "areaspline"', verityProp: 'shape?: "line" | "area" (default: "area")' },
          { raw: 'chart height', verityProp: 'height?: number (default: 56)' },
          { raw: 'series[0].color', verityProp: 'color?: string (default: theme accent)' },
          { raw: '(card chrome rendered outside chart)', verityProp: 'caption?: string; unit?: string; showLatestValue?: boolean' },
          { raw: 'tooltip.enabled: false (always)', verityProp: '(no prop; tooltips never apply at this size)' },
        ]}
        productionSources={[
          { surface: 'Live Bandwidth sparkline (Camera Analytics tab)', file: 'src/command/components/bandwidth-limit/LiveBandwidthChart.tsx' },
          { surface: 'Camera Network Indicator sparkline', file: 'src/command/controllers/video/networkIndicator/CameraNetworkIndicator.tsx' },
        ]}
        notes="The card chrome (caption + latest value) is part of the primitive even though it's not part of Highcharts. Keeping them coupled means consumers can't get the chrome wrong. Open question: should the latest-value formatter accept a custom render function for non-numeric units?"
      />
    );
  },
};
