import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { fakeTimeSeries, fakePlotBands } from '../../../utils/fakeData';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Lines and Splines/Sensor Default (spline + plotBands)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Smoothed spline over datetime, with alert-event plotBands and a shared crosshair tooltip. Models the default sensor detail chart. Production source: `Verkada-Web/src/command/sensors/components/sensor-highcharts/`. Verity primitive target: `LineChart` (when no draggable thresholds) or `ThresholdEditorChart` (when thresholds are editable).',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;

export const Default: Story = {
  render: () => {
    const data = fakeTimeSeries({ count: 192, stepMs: 5 * 60 * 1000, base: 68, amplitude: 6, noise: 1.5 });
    const bands = fakePlotBands({ count: 3 });
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'spline' },
          title: { text: 'Temperature (°F), last 16 hours' },
          xAxis: {
            type: 'datetime',
            crosshair: true,
            plotBands: bands,
          },
          yAxis: {
            title: { text: '°F' },
            plotLines: [
              { value: 75, color: '#EF4444', dashStyle: 'Dash', width: 1, label: { text: 'High alert' } },
              { value: 60, color: '#3B82F6', dashStyle: 'Dash', width: 1, label: { text: 'Low alert' } },
            ],
          },
          legend: { enabled: false },
          tooltip: {
            useHTML: true,
            shared: true,
            outside: true,
            formatter: function () {
              const p = (this as Highcharts.TooltipFormatterContextObject).points?.[0];
              if (!p) return '';
              return `<div><strong>${new Date(p.x as number).toLocaleTimeString()}</strong><br/>${p.y}°F</div>`;
            },
          },
          plotOptions: {
            spline: {
              marker: { enabled: false },
              color: '#0EA5E9',
              connectNulls: false,
            },
          },
          series: [{ type: 'spline', name: 'Temperature', data }],
        }}
      />
    );
  },
};
