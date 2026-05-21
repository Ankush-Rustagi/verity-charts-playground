import type { Meta, StoryObj } from '@storybook/react';
import { LINE_ARG_TYPES } from '../../argTypes';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import {
  LineChart,
  type ColorPalette,
  type PlotBand,
  type ZoneConfig,
} from '../../../primitives/VeritySimPrimitives';
import { BAND_COLORS } from '../../../primitives/chartColors';
import { fakeTimeSeries } from '../../../utils/fakeData';

// Sensor series: count 192, step 5 min, starting 2026-05-01T08:00Z = 1746086400000.
// Band timestamps are offsets from that anchor so they land visibly in the chart.
const DEMO_BANDS: PlotBand[] = [
  { from: 1746090000000, to: 1746092700000, color: BAND_COLORS.danger,  label: 'Alert: motion'    },
  { from: 1746104400000, to: 1746111600000, color: BAND_COLORS.warning, label: 'Alert: temp high' },
  { from: 1746118800000, to: 1746120600000, color: BAND_COLORS.danger,  label: 'Alert: door ajar' },
];

// Zones for temperature data (base ~68, range ~60–78 °F).
// No color — let colorPalette drive; try "status" for semantic danger/warning/success.
const DEMO_ZONES: ZoneConfig[] = [
  { value: 65 },  // ≤ 65 °F → zone 0
  { value: 72 },  // 65–72 °F → zone 1
  {},             // > 72 °F  → zone 2
];

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
type LineArgs = {
  smooth:             boolean;
  markers:            boolean;
  xBands:             PlotBand[];
  yZones:             ZoneConfig[];
  xAxisTitle:         string;
  yAxisTitle:         string;
  tooltip:            'shared-crosshair' | 'point' | 'disabled';
  showLegend:         boolean;
  colorPalette:       ColorPalette;
  seriesName:         string;
  thresholdHighValue: number;
  thresholdHighLabel: string;
  thresholdLowValue:  number;
  thresholdLowLabel:  string;
};
type AfterVerityStory = StoryObj<LineArgs>;

export const Default: Story = {
  render: () => {
    const data = fakeTimeSeries({ count: 192, stepMs: 5 * 60 * 1000, base: 68, amplitude: 6, noise: 1.5 });
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'spline' },
          title: { text: 'Temperature (°F), last 16 hours' },
          xAxis: {
            type: 'datetime',
            crosshair: true,
            plotBands: DEMO_BANDS as Highcharts.XAxisPlotBandsOptions[],
          },
          yAxis: {
            title: { text: '°F' },
            plotLines: [
              { value: 75, color: '#EF4444', dashStyle: 'Dash', width: 1, label: { text: 'High alert' } },
              { value: 60, color: '#3B82F6', dashStyle: 'Dash', width: 1, label: { text: 'Low alert'  } },
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

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: LineChart + xBands + thresholds',
  args: {
    smooth:             true,
    markers:            false,
    xBands:             DEMO_BANDS,
    yZones:             DEMO_ZONES,
    xAxisTitle:         '',
    yAxisTitle:         '°F',
    tooltip:            'shared-crosshair',
    showLegend:         false,
    colorPalette:       'categorical',
    seriesName:         'Temperature',
    thresholdHighValue: 75,
    thresholdHighLabel: 'High alert',
    thresholdLowValue:  60,
    thresholdLowLabel:  'Low alert',
  },
  argTypes: {
    ...LINE_ARG_TYPES,
    seriesName: {
      control: 'text',
      description: 'Label for the data series shown in legend and tooltip.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Temperature' } },
    },
    thresholdHighValue: {
      control: { type: 'number' },
      description: 'Value for the upper threshold plotline.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '75' } },
    },
    thresholdHighLabel: {
      control: 'text',
      description: 'Label text for the upper threshold plotline.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'High alert' } },
    },
    thresholdLowValue: {
      control: { type: 'number' },
      description: 'Value for the lower threshold plotline.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '60' } },
    },
    thresholdLowLabel: {
      control: 'text',
      description: 'Label text for the lower threshold plotline.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Low alert' } },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Same chart using a Verity `LineChart`. `xBands` passes alert-event background overlays (time windows on the x-axis); `thresholds` plotLines use `status` tokens instead of raw hex.\n\n**Production source:** Sensors: Default Detail Chart (`src/command/sensors/components/sensor-highcharts/`)',
      },
      source: {
        code: `<LineChart
  smooth
  colorPalette="categorical"
  series={[{ name: 'Temperature', data: tempData }]}
  xBands={[
    { from: alertStart1, to: alertStart1 + 45*60000,   color: BAND_COLORS.danger,  label: 'Alert: motion'    },
    { from: alertStart2, to: alertStart2 + 2*3600000,  color: BAND_COLORS.warning, label: 'Alert: temp high' },
  ]}
  yZones={[
    { value: 65 },  // cool
    { value: 72 },  // normal
    {},             // warm
  ]}
  thresholds={[
    { value: 75, status: 'danger',  label: 'High alert' },
    { value: 60, status: 'warning', label: 'Low alert'  },
  ]}
  tooltip={{ kind: 'shared-crosshair' }}
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => {
    const data = fakeTimeSeries({ count: 192, stepMs: 5 * 60 * 1000, base: 68, amplitude: 6, noise: 1.5 });
    return (
      <LineChart
        smooth={args.smooth}
        markers={args.markers}
        colorPalette={args.colorPalette}
        showLegend={args.showLegend}
        xAxisTitle={args.xAxisTitle}
        yAxisTitle={args.yAxisTitle}
        series={[{ name: args.seriesName, data: data as [number, number][] }]}
        xBands={args.xBands.length > 0 ? args.xBands : undefined}
        yZones={args.yZones.length > 0 ? args.yZones : undefined}
        thresholds={[
          { value: args.thresholdHighValue, status: 'danger',  label: args.thresholdHighLabel },
          { value: args.thresholdLowValue,  status: 'warning', label: args.thresholdLowLabel  },
        ]}
        tooltip={{ kind: args.tooltip }}
      />
    );
  },
};
