import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { fakeTimeSeries } from '../../../utils/fakeData';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Threshold Editor/Sensor Threshold Editor (draggable)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Spline of recent sensor data with two draggable threshold bands. The user drags the colored areaspline regions to set alert thresholds. Models the sensor edit-alerts chart. Production source: `Verkada-Web/src/command/sensors/components/sensor-edit-alerts/sensor-edit-alerts-chart/SensorEditAlertsChart.tsx` plus the `sensor-highcharts/hooks/useSensorHighchartsThresholdSeries.tsx` hook. Verity primitive target: `ThresholdEditorChart`. The single most leveraged primitive: collapses ~22 sensor files.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;

export const Default: Story = {
  render: () => {
    const [thresholds, setThresholds] = useState({ high: 75, low: 60 });
    const data = fakeTimeSeries({ count: 192, stepMs: 5 * 60 * 1000, base: 68, amplitude: 6, noise: 1.5 });
    const xMin = data[0][0];
    const xMax = data[data.length - 1][0];
    const highBand: [number, number, number][] = [
      [xMin, thresholds.high, 100],
      [xMax, thresholds.high, 100],
    ];
    const lowBand: [number, number, number][] = [
      [xMin, 0, thresholds.low],
      [xMax, 0, thresholds.low],
    ];
    return (
      <div>
        <div style={{ marginBottom: 8, fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#374151' }}>
          Drag the red or blue bands to adjust thresholds. Current: high {thresholds.high}°F, low {thresholds.low}°F.
        </div>
        <PlaygroundChart
          options={{
            chart: { type: 'spline' },
            title: { text: '' },
            xAxis: { type: 'datetime', crosshair: true },
            yAxis: { min: 40, max: 100, title: { text: '°F' } },
            legend: { enabled: false },
            tooltip: { useHTML: true, shared: true, outside: true },
            plotOptions: {
              areaspline: {
                fillOpacity: 0.18,
                lineWidth: 0,
                enableMouseTracking: false,
                dragDrop: {
                  draggableY: true,
                  dragMaxY: 100,
                  dragMinY: 0,
                },
                point: {
                  events: {
                    drop: function () {
                      const newY = (this as Highcharts.Point).y;
                      if (typeof newY !== 'number') return;
                      const isHigh = (this.series.name || '').includes('high');
                      setThresholds((prev) =>
                        isHigh ? { ...prev, high: Math.round(newY) } : { ...prev, low: Math.round(newY) },
                      );
                    },
                  },
                },
              },
              spline: {
                marker: { enabled: false },
                color: '#0EA5E9',
              },
            },
            series: [
              { type: 'areaspline', name: 'high band', data: highBand, color: '#EF4444' },
              { type: 'areaspline', name: 'low band', data: lowBand, color: '#3B82F6' },
              { type: 'spline', name: 'Temperature', data, zIndex: 5 },
            ],
          }}
          height={380}
        />
      </div>
    );
  },
};
