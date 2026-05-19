import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../primitives/PlaygroundChart';
import { PrimitiveStoryLayout } from '../../primitives/PrimitiveStoryLayout';

type Args = {
  value: number;
  min: number;
  max: number;
  unit: string;
  centerLabel: string;
  innerRadius: number;
  goodAt: number;
  warnAt: number;
};

const meta: Meta<Args> = {
  title: '03 Verity Primitives/Gauge',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Proposed Verity primitive for solidgauge donut visualizations with a center HTML label. Covers Connect Box camera uptime gauges, advanced cameras gauge, and Unite incident solidgauge. Excludes the literal `gauge` clock face (Unite Elapsed Time Clock), which stays in the escape hatch as a one-off.',
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    min: { control: { type: 'number', min: 0, max: 100 } },
    max: { control: { type: 'number', min: 0, max: 1000 } },
    unit: { control: 'text' },
    centerLabel: { control: 'text' },
    innerRadius: { control: { type: 'range', min: 40, max: 90, step: 5 } },
    goodAt: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    warnAt: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {
  args: { value: 73, min: 0, max: 100, unit: '%', centerLabel: 'Camera uptime', innerRadius: 75, goodAt: 85, warnAt: 50 },
  render: (args) => (
    <PrimitiveStoryLayout
      chart={
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
                { backgroundColor: '#E5E7EB', innerRadius: `${args.innerRadius}%`, outerRadius: '100%', shape: 'arc' },
              ],
            },
            yAxis: {
              min: args.min,
              max: args.max,
              stops: [
                [0, '#EF4444'],
                [args.warnAt / args.max, '#F59E0B'],
                [args.goodAt / args.max, '#22C55E'],
              ] as Array<[number, string]>,
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
                    return `<div style="text-align:center;font-family:Inter,sans-serif"><div style="font-size:48px;font-weight:700">${this.y}${args.unit}</div><div style="font-size:14px;color:#6B7280;margin-top:4px">${args.centerLabel}</div></div>`;
                  },
                },
                innerRadius: `${args.innerRadius}%`,
                radius: '100%',
              },
            } as Highcharts.PlotOptions,
            series: [{ type: 'solidgauge', name: args.centerLabel, data: [args.value] }],
          }}
          height={320}
        />
      }
      propsAPI={[
        { raw: 'chart.type: "solidgauge"', verityProp: '(implicit)' },
        { raw: 'series[0].data[0]', verityProp: 'value: number' },
        { raw: 'yAxis.min / yAxis.max', verityProp: 'range: { min: number; max: number }' },
        { raw: 'yAxis.stops', verityProp: 'thresholds?: { warn: number; good: number }', note: 'Maps to 3-stop red/amber/green gradient. Custom stops via `palette`.' },
        { raw: 'plotOptions.solidgauge.innerRadius', verityProp: 'thickness?: "thin" | "normal" | "thick"', note: 'Maps to inner radius 85/75/60.' },
        { raw: 'dataLabels.formatter (HTML)', verityProp: 'centerLabel?: { value: ReactNode; caption?: string }' },
      ]}
      productionSources={[
        { surface: 'Connect Box stats (camera uptime)', file: 'src/command/connectors/components/connect-box-stats-page/ConnectBoxGauge.tsx' },
        { surface: 'Connect Box camera uptime gauge', file: 'src/command/connectors/components/connect-box-stats-page/CameraUptimeGauge.tsx' },
        { surface: 'Connect Box advanced cameras gauge', file: 'src/command/connectors/components/connect-box-stats-page/ConnectBoxAdvancedCamerasGauge.tsx' },
        { surface: 'Unite incident SolidGauge', file: 'src/command/unite/pages/incidentDetails/dashboard/components/SolidGaugeChart.tsx' },
      ]}
      notes="The `centerLabel` prop accepts ReactNode so consumers write JSX rather than HTML strings; the primitive internally does renderToString. Open question: should the `thresholds` prop accept arbitrary stops, or stay constrained to the 3-stop pattern observed in all 4 production files?"
    />
  ),
};
