import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../primitives/PlaygroundChart';
import { PrimitiveStoryLayout } from '../../primitives/PrimitiveStoryLayout';
import { fakeColumnSeries } from '../../utils/fakeData';

type Args = {
  stacked: 'none' | 'normal' | 'percent';
  columnDensity: 'tight' | 'normal' | 'loose';
  borderRadius: number;
  showCrosshair: boolean;
  axisKind: 'datetime' | 'categorical';
  showLegend: boolean;
  primaryColor: string;
};

const meta: Meta<Args> = {
  title: '03 Verity Primitives/ColumnChart',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Proposed Verity primitive for column-shaped time-series and categorical bar charts. Single or multi-series, optional stacking, structured palette. Covers the largest set of customer-facing surfaces (10+ files). Use the Controls panel to toggle stacking, change column density, switch axis kind, or pick a primary color.',
      },
    },
  },
  argTypes: {
    stacked: {
      control: 'inline-radio',
      options: ['none', 'normal', 'percent'],
      description: 'Single, additive-stacked, or percent-stacked.',
    },
    columnDensity: {
      control: 'inline-radio',
      options: ['tight', 'normal', 'loose'],
      description: 'Maps to groupPadding/pointPadding presets.',
    },
    borderRadius: {
      control: { type: 'range', min: 0, max: 12, step: 1 },
      description: 'Column corner radius (px).',
    },
    showCrosshair: { control: 'boolean' },
    axisKind: { control: 'inline-radio', options: ['datetime', 'categorical'] },
    showLegend: { control: 'boolean' },
    primaryColor: { control: 'color' },
  },
};
export default meta;

type Story = StoryObj<Args>;

const densityMap = {
  tight: { groupPadding: 0.02, pointPadding: 0 },
  normal: { groupPadding: 0.1, pointPadding: 0.05 },
  loose: { groupPadding: 0.25, pointPadding: 0.1 },
};

export const Playground: Story = {
  args: {
    stacked: 'none',
    columnDensity: 'normal',
    borderRadius: 4,
    showCrosshair: true,
    axisKind: 'categorical',
    showLegend: false,
    primaryColor: '#3B82F6',
  },
  render: (args) => {
    const { categories, values } = fakeColumnSeries({ count: 12, seed: 5 });
    const secondSeries = values.map((v) => Math.round(v * 0.4));
    const thirdSeries = values.map((v) => Math.round(v * 0.25));
    const isStacked = args.stacked !== 'none';
    const density = densityMap[args.columnDensity];
    const datetimeData = (vals: number[]) => vals.map((v, i) => [Date.UTC(2026, 4, 1, i * 2), v]);
    return (
      <PrimitiveStoryLayout
        chart={
          <PlaygroundChart
            options={{
              chart: { type: 'column' },
              title: { text: '' },
              xAxis:
                args.axisKind === 'categorical'
                  ? { categories, crosshair: args.showCrosshair }
                  : { type: 'datetime', crosshair: args.showCrosshair },
              yAxis: { min: 0, title: { text: 'Count' } },
              legend: { enabled: args.showLegend, align: 'center', verticalAlign: 'bottom' },
              tooltip: { useHTML: true, shared: true, outside: true },
              plotOptions: {
                column: {
                  stacking: args.stacked === 'none' ? undefined : args.stacked,
                  borderRadius: args.borderRadius,
                  groupPadding: density.groupPadding,
                  pointPadding: density.pointPadding,
                },
              },
              series: isStacked
                ? [
                    {
                      type: 'column',
                      name: 'Primary',
                      data: args.axisKind === 'categorical' ? values : datetimeData(values),
                      color: args.primaryColor,
                    },
                    {
                      type: 'column',
                      name: 'Secondary',
                      data: args.axisKind === 'categorical' ? secondSeries : datetimeData(secondSeries),
                      color: '#9CA3AF',
                    },
                    {
                      type: 'column',
                      name: 'Tertiary',
                      data: args.axisKind === 'categorical' ? thirdSeries : datetimeData(thirdSeries),
                      color: '#F59E0B',
                    },
                  ]
                : [
                    {
                      type: 'column',
                      name: 'Value',
                      data: args.axisKind === 'categorical' ? values : datetimeData(values),
                      color: args.primaryColor,
                    },
                  ],
            }}
          />
        }
        propsAPI={[
          { raw: 'chart.type: "column"', verityProp: '(implicit, primitive name is ColumnChart)' },
          { raw: 'plotOptions.column.stacking', verityProp: 'stacked?: "none" | "normal" | "percent"' },
          {
            raw: 'plotOptions.column.borderRadius',
            verityProp: 'columnStyle?: { rounded?: boolean }',
            note: 'Constants: rounded=true maps to 4px, false maps to 0.',
          },
          {
            raw: 'plotOptions.column.groupPadding + pointPadding',
            verityProp: 'columnDensity?: "tight" | "normal" | "loose"',
            note: 'Three presets cover every observed value pair in production.',
          },
          {
            raw: 'xAxis.type: "datetime" | xAxis.categories',
            verityProp: 'xAxis: { kind: "datetime" } | { kind: "category", categories }',
            note: 'Categorical axis required by only 2 production files (Intercoms, Attendance avg).',
          },
          { raw: 'xAxis.crosshair', verityProp: 'showCrosshair?: boolean (default: true)' },
          { raw: 'legend.enabled', verityProp: 'legend?: "hidden" | "bottom" | "inline" (default: hidden)' },
          { raw: 'series[].color', verityProp: 'palette?: VerityChartPalette | string[]' },
          { raw: 'tooltip.formatter (HTML+React)', verityProp: 'tooltip?: { kind: "shared-crosshair"; render: (points) => ReactNode }' },
          { raw: 'point.events.click', verityProp: 'onPointClick?: (point) => void' },
        ]}
        productionSources={[
          { surface: 'Cameras Analytics: Alerts Trends', file: 'src/command/cameras-analytics/components/alerts-trends/AlertsTrendsChart.tsx' },
          { surface: 'Cameras Analytics: Helix Trends', file: 'src/command/cameras-analytics/components/helix-trends-widget/HelixTrendsChart.tsx' },
          { surface: 'Cameras Analytics: Net Occupancy', file: 'src/command/cameras-analytics/components/occupancy-trends-widget/NetOccupancyChart.tsx' },
          { surface: 'Cameras Analytics: Traffic', file: 'src/command/cameras-analytics/components/occupancy-trends-widget/TrafficChart.tsx' },
          { surface: 'Cameras Analytics: Queue Length', file: 'src/command/cameras-analytics/components/queue-times-widget/QueueLengthChart.tsx' },
          { surface: 'Cameras Analytics: Queue Wait Time', file: 'src/command/cameras-analytics/components/queue-times-widget/QueueWaitTimeChart.tsx' },
          { surface: 'Intercoms Dashboard (stacked)', file: 'src/command/intercoms/pages/dashboard/DashboardBarGraph.tsx' },
          { surface: 'Gateway Uptime (stacked, datetime)', file: 'src/command/gateways/details/common/gatewayHighcharts/GatewayHighchartsUptime.tsx' },
          { surface: 'Attendance Analytics (average view)', file: 'src/command/access/attendance-analytics/AttendanceAnalyticsCombinedChart.tsx' },
        ]}
        notes="The columnDensity preset compresses 14 production files worth of groupPadding/pointPadding choices into 3 options. If a team needs a custom spacing they're not on the happy path; that's intentional. Open question: should Intercoms-style stacked-bar with click navigation be `onPointClick` or `onSegmentClick`?"
      />
    );
  },
};
