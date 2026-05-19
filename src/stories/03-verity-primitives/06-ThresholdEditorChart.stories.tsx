import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import { PlaygroundChart } from '../../primitives/PlaygroundChart';
import { PrimitiveStoryLayout } from '../../primitives/PrimitiveStoryLayout';
import { fakeTimeSeries, fakePlotBands } from '../../utils/fakeData';

type Args = {
  yMin: number;
  yMax: number;
  initialThresholdHigh: number;
  initialThresholdLow: number;
  alertBandsCount: number;
  draggable: boolean;
  unit: string;
};

const meta: Meta<Args> = {
  title: '03 Verity Primitives/ThresholdEditorChart',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Proposed Verity primitive for sensor-style charts with draggable threshold bands and alert event overlays. The single most leveraged primitive in the audit: collapses the entire ~22-file sensor-highcharts/ tree. Drag the colored bands in the chart to change thresholds; the React state above the chart updates in response.',
      },
    },
  },
  argTypes: {
    yMin: { control: { type: 'number', min: 0, max: 100 } },
    yMax: { control: { type: 'number', min: 0, max: 200 } },
    initialThresholdHigh: { control: { type: 'range', min: 0, max: 200, step: 1 } },
    initialThresholdLow: { control: { type: 'range', min: 0, max: 200, step: 1 } },
    alertBandsCount: { control: { type: 'range', min: 0, max: 5, step: 1 } },
    draggable: { control: 'boolean' },
    unit: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {
  args: { yMin: 40, yMax: 100, initialThresholdHigh: 75, initialThresholdLow: 60, alertBandsCount: 2, draggable: true, unit: '°F' },
  render: (args) => {
    const [high, setHigh] = useState(args.initialThresholdHigh);
    const [low, setLow] = useState(args.initialThresholdLow);
    useEffect(() => setHigh(args.initialThresholdHigh), [args.initialThresholdHigh]);
    useEffect(() => setLow(args.initialThresholdLow), [args.initialThresholdLow]);
    const data = fakeTimeSeries({ count: 192, stepMs: 5 * 60 * 1000, base: (args.yMin + args.yMax) / 2, amplitude: 6, noise: 1.5 });
    const bands = fakePlotBands({ count: args.alertBandsCount });
    const xMin = data[0][0];
    const xMax = data[data.length - 1][0];
    const highBand: [number, number, number][] = [
      [xMin, high, args.yMax],
      [xMax, high, args.yMax],
    ];
    const lowBand: [number, number, number][] = [
      [xMin, args.yMin, low],
      [xMax, args.yMin, low],
    ];
    return (
      <PrimitiveStoryLayout
        chart={
          <div>
            <div style={{ marginBottom: 8, fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#374151' }}>
              {args.draggable ? 'Drag the bands to adjust. ' : 'Drag disabled. '}
              Current thresholds: <strong>high {high}{args.unit}</strong>, <strong>low {low}{args.unit}</strong>.
            </div>
            <PlaygroundChart
              options={{
                chart: { type: 'spline' },
                title: { text: '' },
                xAxis: { type: 'datetime', crosshair: true, plotBands: bands },
                yAxis: { min: args.yMin, max: args.yMax, title: { text: args.unit } },
                legend: { enabled: false },
                tooltip: { useHTML: true, shared: true, outside: true },
                plotOptions: {
                  areaspline: {
                    fillOpacity: 0.18,
                    lineWidth: 0,
                    enableMouseTracking: false,
                    dragDrop: { draggableY: args.draggable, dragMaxY: args.yMax, dragMinY: args.yMin },
                    point: {
                      events: {
                        drop: function () {
                          const newY = (this as Highcharts.Point).y;
                          if (typeof newY !== 'number') return;
                          const isHigh = (this.series.name || '').includes('high');
                          if (isHigh) setHigh(Math.round(newY));
                          else setLow(Math.round(newY));
                        },
                      },
                    },
                  },
                  spline: { marker: { enabled: false }, color: '#0EA5E9' },
                } as Highcharts.PlotOptions,
                series: [
                  { type: 'areaspline', name: 'high band', data: highBand, color: '#EF4444' },
                  { type: 'areaspline', name: 'low band', data: lowBand, color: '#3B82F6' },
                  { type: 'spline', name: 'Value', data, zIndex: 5 },
                ],
              }}
              height={380}
            />
          </div>
        }
        propsAPI={[
          { raw: 'series (3 sub-series: high band, low band, data line)', verityProp: 'value: { series: TimeSeries; thresholds: { high?: number; low?: number } }' },
          { raw: 'plotOptions.areaspline.dragDrop', verityProp: 'editable?: boolean (default: true)' },
          { raw: 'point.events.drop', verityProp: 'onThresholdChange?: (next: { high?: number; low?: number }) => void' },
          { raw: 'xAxis.plotBands', verityProp: 'alertEvents?: { from: Date; to: Date; label?: string; color?: string }[]' },
          { raw: 'yAxis.min / yAxis.max', verityProp: 'valueRange: { min: number; max: number }' },
          { raw: 'yAxis.title', verityProp: 'unit: string' },
        ]}
        productionSources={[
          { surface: 'Sensor edit alerts chart (drag thresholds)', file: 'src/command/sensors/components/sensor-edit-alerts/sensor-edit-alerts-chart/SensorEditAlertsChart.tsx' },
          { surface: 'Sensor detail chart (read-only thresholds)', file: 'src/command/sensors/components/sensor-detail/sensor-detail-chart/SensorDetailChart.tsx' },
          { surface: 'Sensor detail event chart', file: 'src/command/sensors/components/sensor-detail/sensor-detail-event-chart/SensorDetailEventChart.tsx' },
          { surface: 'Sensor live chart with investigation overlay', file: 'src/command/sensors/components/sensor-detail/sensor-live-chart/SensorLiveChart.tsx' },
          { surface: 'Sensor alert card body', file: 'src/command/sensors/components/sensor-detail/sensor-alert-cards/sensor-alert-card/SensorAlertGraphCardBody.tsx' },
          { surface: 'Sensor alert card body V2', file: 'src/command/sensors/components/sensor-detail/sensor-alert-cards/sensor-alert-card/SensorAlertGraphCardBodyV2.tsx' },
          { surface: 'Sensor highcharts composer + ~14 hooks', file: 'src/command/sensors/components/sensor-highcharts/' },
        ]}
        notes="The single biggest payoff in the entire primitive set. Today the sensor stack lives across ~22 files of hooks that compose Highcharts options. The Verity primitive collapses that to one consumer per sensor surface. The `value` prop is intentionally a single object so it can be passed straight to a React form state without spreading 5 separate props."
      />
    );
  },
};
