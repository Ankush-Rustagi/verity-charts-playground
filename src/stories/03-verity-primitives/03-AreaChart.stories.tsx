import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../primitives/PlaygroundChart';
import { PrimitiveStoryLayout } from '../../primitives/PrimitiveStoryLayout';
import { fakeTimeSeries, fakeArearange } from '../../utils/fakeData';

type Args = {
  variant: 'single' | 'stacked' | 'percent' | 'range';
  fillOpacity: number;
  curve: 'area' | 'areaspline';
  showMarkers: boolean;
  primaryColor: string;
};

const meta: Meta<Args> = {
  title: '03 Verity Primitives/AreaChart',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Proposed Verity primitive for filled area charts. Variants: single area, stacked, percent-stacked, or range (min/max envelope via arearange). Covers device metric, sensor threshold visualization, and Unite participant breakdowns.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['single', 'stacked', 'percent', 'range'] },
    fillOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    curve: { control: 'inline-radio', options: ['area', 'areaspline'] },
    showMarkers: { control: 'boolean' },
    primaryColor: { control: 'color' },
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {
  args: { variant: 'single', fillOpacity: 0.18, curve: 'areaspline', showMarkers: false, primaryColor: '#0EA5E9' },
  render: (args) => {
    const singleData = fakeTimeSeries({ count: 96, base: 50, amplitude: 18, noise: 3 });
    const a = fakeTimeSeries({ count: 60, base: 30, amplitude: 8, noise: 3, seed: 1 });
    const b = fakeTimeSeries({ count: 60, base: 20, amplitude: 5, noise: 2, seed: 2 });
    const c = fakeTimeSeries({ count: 60, base: 50, amplitude: 12, noise: 4, seed: 3 });
    const rangeData = fakeArearange({ count: 192, base: 42, spread: 18, noise: 3 });

    let series: Highcharts.SeriesOptionsType[] = [];
    let chartType: string = args.curve;
    if (args.variant === 'single') {
      series = [{ type: args.curve, name: 'Value', data: singleData, color: args.primaryColor }];
    } else if (args.variant === 'stacked' || args.variant === 'percent') {
      series = [
        { type: args.curve, name: 'Responded', data: c, color: '#22C55E' },
        { type: args.curve, name: 'Checked in', data: a, color: '#3B82F6' },
        { type: args.curve, name: 'Inactive', data: b, color: '#9CA3AF' },
      ];
    } else {
      chartType = 'arearange';
      series = [{ type: 'arearange', name: 'Range', data: rangeData, color: args.primaryColor }];
    }

    return (
      <PrimitiveStoryLayout
        chart={
          <PlaygroundChart
            options={{
              chart: { type: chartType },
              title: { text: '' },
              xAxis: { type: 'datetime', crosshair: true },
              yAxis: {
                title: { text: 'Value' },
                ...(args.variant === 'percent' ? { labels: { format: '{value}%' } } : {}),
              },
              legend: { enabled: args.variant === 'stacked' || args.variant === 'percent', align: 'center', verticalAlign: 'bottom' },
              tooltip: { useHTML: true, shared: true, outside: true },
              plotOptions: {
                area: {
                  stacking: args.variant === 'stacked' ? 'normal' : args.variant === 'percent' ? 'percent' : undefined,
                  fillOpacity: args.fillOpacity,
                  marker: { enabled: args.showMarkers },
                },
                areaspline: {
                  stacking: args.variant === 'stacked' ? 'normal' : args.variant === 'percent' ? 'percent' : undefined,
                  fillOpacity: args.fillOpacity,
                  marker: { enabled: args.showMarkers },
                },
                arearange: { fillOpacity: args.fillOpacity, lineWidth: 1 },
              } as Highcharts.PlotOptions,
              series,
            }}
          />
        }
        propsAPI={[
          { raw: 'chart.type: "area" | "areaspline" | "arearange"', verityProp: 'variant: "single" | "stacked" | "percent" | "range"' },
          { raw: 'plotOptions.area.fillOpacity', verityProp: 'fillOpacity?: number (default: 0.18)' },
          { raw: 'plotOptions.area.stacking', verityProp: '(implied by variant)' },
          { raw: 'plotOptions.area.marker.enabled', verityProp: 'showPoints?: boolean (default: false)' },
          {
            raw: 'series[].data shape: [t, value] vs. [t, lo, hi]',
            verityProp: 'series: SingleSeries[] | RangeSeries[] (variant-dependent)',
            note: 'Range variant uses arearange under the hood; the data shape is part of the variant contract.',
          },
        ]}
        productionSources={[
          { surface: 'Device Metric RSSI (area + zones)', file: 'src/command/alarms-v3/alarm-system/components/device-detail/overview/device-metric-chart/DeviceMetricChart.tsx' },
          { surface: 'Sensor Audio (arearange min/max)', file: 'src/command/sensors/components/sensor-highcharts/hooks/useSensorHighchartsDataSeries.tsx' },
          { surface: 'Sensor Threshold band visualization (areaspline)', file: 'src/command/sensors/components/sensor-highcharts/hooks/useSensorHighchartsThresholdSeries.tsx' },
          { surface: 'Unite Participant Status (percent-stacked)', file: 'src/command/unite/pages/incidentDetails/dashboard/components/participantStatusOverTime/ParticipantStatusOvertimeChart.tsx' },
          { surface: 'Attendance Analytics (single area)', file: 'src/command/access/attendance-analytics/AttendanceAnalyticsCombinedChart.tsx' },
        ]}
        notes="The `range` variant is functionally a different chart type (arearange). Folding it under AreaChart unifies the API surface at the cost of slightly more polymorphic data shapes. Alternative: separate `RangeChart` primitive."
      />
    );
  },
};
