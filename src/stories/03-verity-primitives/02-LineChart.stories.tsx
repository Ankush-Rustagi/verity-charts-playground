import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../primitives/PlaygroundChart';
import { PrimitiveStoryLayout } from '../../primitives/PrimitiveStoryLayout';
import { fakeTimeSeries, fakePlotBands } from '../../utils/fakeData';

type Args = {
  curve: 'line' | 'spline';
  showMarkers: boolean;
  showCrosshair: boolean;
  zonesEnabled: boolean;
  bandsCount: number;
  thresholdHigh: number | null;
  thresholdLow: number | null;
  tooltipMode: 'shared-crosshair' | 'point' | 'disabled';
  primaryColor: string;
};

const meta: Meta<Args> = {
  title: '03 Verity Primitives/LineChart',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Proposed Verity primitive for line / spline time-series. Single or multi-series, optional zones for threshold coloring, optional plotBands and plotLines, three tooltip modes. Covers the most common "data over time" shape outside of sensor threshold editing.',
      },
    },
  },
  argTypes: {
    curve: { control: 'inline-radio', options: ['line', 'spline'] },
    showMarkers: { control: 'boolean' },
    showCrosshair: { control: 'boolean' },
    zonesEnabled: { control: 'boolean', description: 'Color the line by value threshold (good/warn/critical).' },
    bandsCount: { control: { type: 'range', min: 0, max: 5, step: 1 }, description: 'Number of plotBand event markers.' },
    thresholdHigh: { control: { type: 'number', min: 0, max: 100, step: 1 } },
    thresholdLow: { control: { type: 'number', min: 0, max: 100, step: 1 } },
    tooltipMode: { control: 'inline-radio', options: ['shared-crosshair', 'point', 'disabled'] },
    primaryColor: { control: 'color' },
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {
  args: {
    curve: 'spline',
    showMarkers: false,
    showCrosshair: true,
    zonesEnabled: false,
    bandsCount: 2,
    thresholdHigh: 75,
    thresholdLow: 60,
    tooltipMode: 'shared-crosshair',
    primaryColor: '#0EA5E9',
  },
  render: (args) => {
    const data = fakeTimeSeries({ count: 144, base: 68, amplitude: 8, noise: 2 });
    const bands = fakePlotBands({ count: args.bandsCount });
    const plotLines: Highcharts.YAxisPlotLinesOptions[] = [];
    if (args.thresholdHigh != null) {
      plotLines.push({ value: args.thresholdHigh, color: '#EF4444', dashStyle: 'Dash', width: 1, label: { text: 'High' } });
    }
    if (args.thresholdLow != null) {
      plotLines.push({ value: args.thresholdLow, color: '#3B82F6', dashStyle: 'Dash', width: 1, label: { text: 'Low' } });
    }
    return (
      <PrimitiveStoryLayout
        chart={
          <PlaygroundChart
            options={{
              chart: { type: args.curve },
              title: { text: '' },
              xAxis: { type: 'datetime', crosshair: args.showCrosshair, plotBands: bands },
              yAxis: { title: { text: 'Value' }, plotLines },
              legend: { enabled: false },
              tooltip: args.tooltipMode === 'disabled' ? { enabled: false } : { useHTML: true, shared: args.tooltipMode === 'shared-crosshair', outside: true },
              plotOptions: {
                [args.curve]: {
                  marker: { enabled: args.showMarkers, radius: 3 },
                  color: args.primaryColor,
                  zones: args.zonesEnabled
                    ? [
                        { value: args.thresholdLow ?? 60, color: '#EF4444' },
                        { value: args.thresholdHigh ?? 75, color: '#22C55E' },
                        { color: '#F59E0B' },
                      ]
                    : undefined,
                },
              } as Highcharts.PlotOptions,
              series: [{ type: args.curve, name: 'Value', data }],
            }}
          />
        }
        propsAPI={[
          { raw: 'chart.type: "line" | "spline"', verityProp: 'curve?: "line" | "spline"' },
          { raw: 'plotOptions.[curve].marker.enabled', verityProp: 'showPoints?: boolean (default: false)' },
          { raw: 'xAxis.crosshair', verityProp: 'showCrosshair?: boolean (default: true)' },
          {
            raw: 'plotOptions.[curve].zones',
            verityProp: 'zones?: { value: number; color: string }[]',
            note: 'Threshold coloring; required by 10 production files including Alarms wireless and sensor RSSI.',
          },
          {
            raw: 'xAxis.plotBands',
            verityProp: 'eventBands?: { from: Date; to: Date; color: string; label?: string }[]',
            note: 'Used for alert overlays on the sensor stack.',
          },
          {
            raw: 'yAxis.plotLines',
            verityProp: 'thresholds?: { value: number; color: string; label?: string }[]',
          },
          {
            raw: 'tooltip.*',
            verityProp: 'tooltip?: { kind: "shared-crosshair" | "point" | "disabled"; render?: (...) => ReactNode }',
          },
        ]}
        productionSources={[
          { surface: 'Sales Conversion (Cameras Analytics)', file: 'src/command/cameras-analytics/components/sales-conversion-rate-widget/SalesConversionRateChart.tsx' },
          { surface: 'Sensor Default Detail Chart', file: 'src/command/sensors/components/sensor-detail/sensor-detail-chart/SensorDetailChart.tsx' },
          { surface: 'Alarms Wireless Connection Signal (RSSI)', file: 'src/command/alarms-v3/alarm-system/components/device-detail/overview/device-metric-chart/DeviceMetricChart.tsx' },
          { surface: 'Sensor Dashboard Tile (chrome-free)', file: 'src/command/sensors/components/sensor-dashboard/DashboardLineGraphTile.tsx' },
          { surface: 'Gateway Historical GPS Timeline', file: 'src/command/gateways/details/historicalGps/GatewayHistoricalGpsTimeline.tsx' },
        ]}
        notes="Open question: should `zones` and `thresholds` be the same prop? They serve adjacent purposes (color the data vs. annotate the axis) but in practice they're usually configured together. Combining them would simplify the API at the cost of less flexible visual customization."
      />
    );
  },
};
