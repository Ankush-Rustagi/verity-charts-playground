import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { ThresholdEditorChart, type ColorPalette } from '../../../primitives/VeritySimPrimitives';
import { fakeTimeSeries, fakePlotBands } from '../../../utils/fakeData';
import { CHART_FONT_FAMILY } from '../../../primitives/chartColors';
import { THRESHOLD_EDITOR_ARG_TYPES } from '../../argTypes';

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
type ThresholdArgs = {
  editable:             boolean;
  xBands:               number;
  unit:                 string;
  xAxisTitle:           string;
  colorPalette:         ColorPalette;
  initialThresholdHigh: number;
  initialThresholdLow:  number;
  yMin:                 number;
  yMax:                 number;
  seriesName:           string;
};
type AfterVerityStory = StoryObj<ThresholdArgs>;

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
        <div style={{ marginBottom: 8, fontFamily: CHART_FONT_FAMILY, fontSize: 13, color: '#374151' }}>
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

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: ThresholdEditorChart',
  args: {
    editable:             true,
    xBands:               2,
    unit:                 '°F',
    xAxisTitle:           '',
    colorPalette:         'categorical',
    initialThresholdHigh: 75,
    initialThresholdLow:  60,
    yMin:                 40,
    yMax:                 100,
    seriesName:           'Temperature',
  },
  argTypes: {
    editable:             THRESHOLD_EDITOR_ARG_TYPES.editable,
    xBands:               THRESHOLD_EDITOR_ARG_TYPES.xBands,
    unit:                 THRESHOLD_EDITOR_ARG_TYPES.unit,
    xAxisTitle:           THRESHOLD_EDITOR_ARG_TYPES.xAxisTitle,
    colorPalette:         THRESHOLD_EDITOR_ARG_TYPES.colorPalette,
    initialThresholdHigh: THRESHOLD_EDITOR_ARG_TYPES.initialThresholdHigh,
    initialThresholdLow:  THRESHOLD_EDITOR_ARG_TYPES.initialThresholdLow,
    yMin:                 THRESHOLD_EDITOR_ARG_TYPES.yMin,
    yMax:                 THRESHOLD_EDITOR_ARG_TYPES.yMax,
    seriesName: {
      control: 'text',
      description: 'Label for the data series shown in the legend and tooltip.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Temperature' } },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Same draggable threshold chart using a Verity `ThresholdEditorChart`. High band is always `danger` (red), low band is always `warning` (amber) — semantics are encoded in the primitive, not the consumer. Series color from `colorPalette="categorical"`. No hex in consumer code.\n\n**Production source:** Sensors: Edit Alerts Chart (`src/command/sensors/components/sensor-edit-alerts/sensor-edit-alerts-chart/SensorEditAlertsChart.tsx`)',
      },
      source: {
        code: `<ThresholdEditorChart
  seriesData={tempData}
  seriesName="Temperature"
  thresholds={thresholds}
  onThresholdChange={setThresholds}
  valueRange={{ min: 40, max: 100 }}
  unit="°F"
  alertEvents={alertBands}
  editable
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => {
    const [thresholds, setThresholds] = useState({ high: args.initialThresholdHigh, low: args.initialThresholdLow });
    const data  = fakeTimeSeries({ count: 192, stepMs: 5 * 60 * 1000, base: 68, amplitude: 6, noise: 1.5 });
    const alertBands = fakePlotBands({ count: args.xBands });
    return (
      <>
        <div style={{ marginBottom: 8, fontFamily: CHART_FONT_FAMILY, fontSize: 13, color: '#374151' }}>
          {args.editable
            ? `Drag the red or amber bands to adjust. Current: high ${thresholds.high}${args.unit}, low ${thresholds.low}${args.unit}.`
            : `Read-only view. Current: high ${thresholds.high}${args.unit}, low ${thresholds.low}${args.unit}.`}
        </div>
        <ThresholdEditorChart
          seriesData={data as [number, number][]}
          seriesName={args.seriesName}
          colorPalette={args.colorPalette}
          thresholds={thresholds}
          onThresholdChange={(next) => setThresholds((prev) => ({ high: next.high ?? prev.high, low: next.low ?? prev.low }))}
          valueRange={{ min: args.yMin, max: args.yMax }}
          unit={args.unit}
          xAxisTitle={args.xAxisTitle}
          alertEvents={alertBands}
          editable={args.editable}
        />
      </>
    );
  },
};
