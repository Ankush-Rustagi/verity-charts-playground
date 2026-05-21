import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { LineChart, type ColorPalette } from '../../../primitives/VeritySimPrimitives';
import { fakeTimeSeries, fakePlotBands } from '../../../utils/fakeData';
import { LINE_ARG_TYPES } from '../../argTypes';
import { CHART_FONT_FAMILY } from '../../../primitives/chartColors';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Lines and Splines/Sensor Dashboard Tile (chrome-free, disabled tooltip)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Compact card-sized tile showing the last hour of sensor data. Disabled Highcharts tooltip (the parent card renders its own panel instead), no axes, minimal chart chrome. Item 5 in the inventory (Sensor Dashboard). Production source: `Verkada-Web/src/command/sensors/components/sensor-dashboard/DashboardLineGraphTile.tsx`. This is a great validation of the "tooltip: disabled, use external React panel" pattern from the audit. Verity primitive target: `LineChart` with a `chromeMinimal` preset.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;
type LineArgs = {
  smooth:       boolean;
  markers:      boolean;
  yZones:       boolean;
  xBands:       number;
  xAxisTitle:   string;
  yAxisTitle:   string;
  tooltip:      'shared-crosshair' | 'point' | 'disabled';
  showLegend:   boolean;
  colorPalette: ColorPalette;
  seriesName:   string;
};
type AfterVerityStory = StoryObj<LineArgs>;

export const Default: Story = {
  render: () => {
    const data = fakeTimeSeries({ count: 60, stepMs: 60 * 1000, base: 70.5, amplitude: 1.5, noise: 0.4, seed: 33 });
    const latest = data[data.length - 1][1];
    return (
      <div style={{ width: 240, padding: 16, borderRadius: 12, background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2, fontFamily: CHART_FONT_FAMILY }}>
          Temperature, last hour
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, color: '#111827', marginBottom: 8, fontFamily: CHART_FONT_FAMILY }}>
          {latest.toFixed(1)}°F
        </div>
        <PlaygroundChart
          options={{
            chart: {
              type: 'spline',
              backgroundColor: 'transparent',
              margin: [0, 0, 0, 0],
              spacing: [0, 0, 0, 0],
            },
            title: { text: '' },
            credits: { enabled: false },
            xAxis: { visible: false, type: 'datetime' },
            yAxis: { visible: false },
            legend: { enabled: false },
            tooltip: { enabled: false },
            plotOptions: {
              spline: {
                marker: { enabled: false },
                lineWidth: 2,
                color: '#0EA5E9',
              },
            },
            series: [{ type: 'spline', name: 'Temp', data }],
          }}
          height={64}
        />
      </div>
    );
  },
};

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: LineChart chromeMinimal',
  args: { smooth: true, markers: false, yZones: false, xBands: 0, xAxisTitle: '', yAxisTitle: '', tooltip: 'disabled', showLegend: false, colorPalette: 'categorical', seriesName: 'Temp' },
  argTypes: {
    ...LINE_ARG_TYPES,
    yZones: {
      control: 'boolean',
      description: '`yZones?: ZoneConfig[]` — Y-axis threshold coloring. Toggle to compare with/without.',
      table: { type: { summary: 'ZoneConfig[]' }, defaultValue: { summary: 'undefined' } },
    },
    xBands: {
      control: { type: 'range', min: 0, max: 5, step: 1 },
      description: '`xBands?: PlotBand[]` — X-axis alert-event background overlays count.',
      table: { type: { summary: 'PlotBand[]' }, defaultValue: { summary: '0' } },
    },
    seriesName: {
      control: 'text',
      description: 'Label for the data series shown in legend and tooltip.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Temp' } },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Same tile using a Verity `LineChart` with `chromeMinimal` preset and `tooltip={{ kind: "disabled" }}`. Color comes from `colorPalette="categorical"`. All raw chart chrome absorbed by the primitive.\n\n**Production source:** Sensors: Dashboard Tile (`src/command/sensors/components/sensor-dashboard/DashboardLineGraphTile.tsx`)',
      },
      source: {
        code: `<LineChart
  smooth
  chromeMinimal
  colorPalette="categorical"
  series={[{ name: 'Temp', data: tempData }]}
  tooltip={{ kind: 'disabled' }}
  height={64}
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => {
    const data = fakeTimeSeries({ count: 60, stepMs: 60 * 1000, base: 70.5, amplitude: 1.5, noise: 0.4, seed: 33 });
    const latest = data[data.length - 1][1];
    const eventBands = fakePlotBands({ count: args.xBands });
    return (
      <div style={{ width: 260, padding: 16, borderRadius: 12, background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2, fontFamily: CHART_FONT_FAMILY }}>
          Temperature, last hour
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, color: '#111827', marginBottom: 8, fontFamily: CHART_FONT_FAMILY }}>
          {latest.toFixed(1)}&deg;F
        </div>
        <LineChart
          smooth={args.smooth}
          markers={args.markers}
          colorPalette={args.colorPalette}
          showLegend={args.showLegend}
          xAxisTitle={args.xAxisTitle}
          yAxisTitle={args.yAxisTitle}
          series={[{ name: args.seriesName, data: data as [number, number][] }]}
          yZones={args.yZones ? [{ value: 68 }, { value: 72 }, {}] : undefined}
          xBands={eventBands.length > 0 ? eventBands : undefined}
          tooltip={{ kind: args.tooltip }}
          chromeMinimal
          height={64}
        />
      </div>
    );
  },
};
