import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../primitives/PlaygroundChart';
import { PrimitiveStoryLayout } from '../../primitives/PrimitiveStoryLayout';
import { fakeTimeSeries } from '../../utils/fakeData';

type Args = {
  secondaryAxis: boolean;
  columnStackingMode: 'normal' | 'percent' | 'none';
  zoomEnabled: boolean;
  primaryAxisLabel: string;
  secondaryAxisLabel: string;
};

const meta: Meta<Args> = {
  title: '03 Verity Primitives/ComboTimeSeriesChart',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Proposed Verity primitive for multi-series charts that mix column and line/spline on the same time axis, optionally with a secondary y-axis. Built on Highcharts Stock (`ChartAdvanced` today) so it inherits zoom/pan and date range selection. Covers the 2 most data-dense customer-facing surfaces: Attendance Analytics and Trailer Power Metrics.',
      },
    },
  },
  argTypes: {
    secondaryAxis: { control: 'boolean' },
    columnStackingMode: { control: 'inline-radio', options: ['normal', 'percent', 'none'] },
    zoomEnabled: { control: 'boolean' },
    primaryAxisLabel: { control: 'text' },
    secondaryAxisLabel: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {
  args: { secondaryAxis: true, columnStackingMode: 'normal', zoomEnabled: true, primaryAxisLabel: 'Watts', secondaryAxisLabel: 'State of charge (%)' },
  render: (args) => {
    const solar = fakeTimeSeries({ count: 96, base: 200, amplitude: 150, noise: 30, seed: 1 });
    const grid = fakeTimeSeries({ count: 96, base: 100, amplitude: 50, noise: 15, seed: 2 });
    const soc = fakeTimeSeries({ count: 96, base: 65, amplitude: 15, noise: 2, seed: 3 });
    return (
      <PrimitiveStoryLayout
        chart={
          <PlaygroundChart
            options={{
              chart: args.zoomEnabled ? { zooming: { type: 'x' as const } } : {},
              title: { text: '' },
              xAxis: { type: 'datetime', crosshair: true },
              yAxis: args.secondaryAxis
                ? [
                    { title: { text: args.primaryAxisLabel }, min: 0 },
                    { title: { text: args.secondaryAxisLabel }, opposite: true, min: 0, max: 100 },
                  ]
                : [{ title: { text: args.primaryAxisLabel }, min: 0 }],
              legend: { enabled: true, align: 'center', verticalAlign: 'bottom' },
              tooltip: { useHTML: true, shared: true, outside: true },
              plotOptions: {
                column: {
                  stacking: args.columnStackingMode === 'none' ? undefined : args.columnStackingMode,
                  borderRadius: 0,
                  groupPadding: 0,
                  pointPadding: 0,
                },
                spline: { marker: { enabled: false }, lineWidth: 2 },
              },
              series: [
                { type: 'column', name: 'Solar', data: solar, yAxis: 0, color: '#F59E0B' },
                { type: 'column', name: 'Grid', data: grid, yAxis: 0, color: '#9CA3AF' },
                { type: 'spline', name: 'SoC', data: soc, yAxis: args.secondaryAxis ? 1 : 0, color: '#22C55E' },
              ],
            }}
            height={400}
          />
        }
        propsAPI={[
          { raw: 'chart.zooming.type', verityProp: 'zoom?: "x" | "y" | "xy" | "none"' },
          { raw: 'yAxis: [{...}, {...opposite:true}]', verityProp: 'secondaryAxis?: { title; min; max } | null' },
          { raw: 'series[].yAxis (per-series index)', verityProp: 'series[i].axis?: "primary" | "secondary"' },
          { raw: 'plotOptions.column.stacking', verityProp: 'columnStacking?: "normal" | "percent" | "none"' },
          { raw: '(uses Highcharts Stock module)', verityProp: '(internal; ChartAdvanced is the current wrapper)', note: 'Suggest renaming `ChartAdvanced` to `ComboTimeSeriesChart` in the Verity API.' },
        ]}
        productionSources={[
          { surface: 'Trailer Power Metrics (dual axis)', file: 'src/command/trailers/common/PowerMetricsChart/PowerMetricsChart.tsx' },
          { surface: 'Attendance Analytics (Stock + tickPositioner)', file: 'src/command/access/attendance-analytics/AttendanceAnalyticsCombinedChart.tsx' },
        ]}
        notes="Only 2 production consumers but very high value: Trailer is the most data-dense Command chart per inventory item 14, and Attendance is the prototype for prompt-to-chart per the strategy roadmap. The `secondaryAxis` prop is the single biggest API surface this primitive needs to get right."
      />
    );
  },
};
