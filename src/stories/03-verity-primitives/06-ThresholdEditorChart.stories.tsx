import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../primitives/PlaygroundChart';
import { type ColorPalette, PALETTE_HEX } from '../../primitives/VeritySimPrimitives';
import { fakeTimeSeries, fakePlotBands } from '../../utils/fakeData';
import { THRESHOLD_EDITOR_ARG_TYPES } from '../argTypes';

type Args = {
  yMin: number;
  yMax: number;
  initialThresholdHigh: number;
  initialThresholdLow: number;
  bands: number;
  editable: boolean;
  unit: string;
  colorPalette: ColorPalette;
};

const meta: Meta<Args> = {
  title: '03 Verity Primitives/ThresholdEditorChart',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Proposed Verity primitive for inline threshold editing — drag the colored bands to set warning / danger thresholds, with a touch fallback (slider form). Collapses ~22 sensor detail chart files that currently each manage their own `draggable-points` wiring.\n\n' +
          '**Production sources:** All Sensors product-line threshold setting UIs — temperature, humidity, TVOC, CO₂, PM2.5, motion sensitivity, audio, RSSI, occupancy.\n\n' +
          '**Design note:** `editable` maps `dragDrop.draggableY`. Desktop drag uses the `draggable-points` module; touch uses a controlled slider+number-input form to fix the browser-scroll conflict noted in doc 24.',
      },
    },
  },
  argTypes: {
    ...THRESHOLD_EDITOR_ARG_TYPES,
    onThresholdChange: {
      control: false,
      description: '`onThresholdChange: (thresholds: Threshold[]) => void` — called on each drag-drop and slider change.',
      table: { type: { summary: '(thresholds: Threshold[]) => void' }, category: 'Proposed API' },
    },
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {
  args: { yMin: 0, yMax: 100, initialThresholdHigh: 80, initialThresholdLow: 20, bands: 2, editable: true, unit: '°C', colorPalette: 'categorical' },
  render: (args) => {
    const seriesData = fakeTimeSeries({ count: 144, base: 50, amplitude: 18, noise: 4 });
    const plotBands  = fakePlotBands({ count: args.bands });
    const lineColor  = PALETTE_HEX[args.colorPalette][0];
    const xMin = seriesData[0]?.[0]  ?? Date.now();
    const xMax = seriesData[seriesData.length - 1]?.[0] ?? Date.now();
    const highBand: [number, number, number][] = [[xMin, args.initialThresholdHigh, args.yMax], [xMax, args.initialThresholdHigh, args.yMax]];
    const lowBand:  [number, number, number][] = [[xMin, args.yMin, args.initialThresholdLow],  [xMax, args.yMin, args.initialThresholdLow]];
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'spline' },
          title: { text: '' },
          xAxis: { type: 'datetime', crosshair: true, plotBands: plotBands },
          yAxis: { min: args.yMin, max: args.yMax, title: { text: args.unit } },
          legend: { enabled: false },
          tooltip: { useHTML: true, shared: true, outside: true },
          plotOptions: {
            areaspline: {
              fillOpacity: 0.18,
              lineWidth: 0,
              enableMouseTracking: false,
              dragDrop: { draggableY: args.editable, dragMaxY: args.yMax, dragMinY: args.yMin },
            },
            spline: { marker: { enabled: false } },
          } as Highcharts.PlotOptions,
          series: [
            { type: 'areaspline', name: 'high band', data: highBand, color: '#EF4444' },
            { type: 'areaspline', name: 'low band',  data: lowBand,  color: '#F59E0B' },
            { type: 'spline',     name: 'Sensor',    data: seriesData, color: lineColor, zIndex: 5 },
          ],
        }}
        height={380}
      />
    );
  },
};
