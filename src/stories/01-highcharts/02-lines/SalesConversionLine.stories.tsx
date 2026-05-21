import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { LineChart, type ColorPalette } from '../../../primitives/VeritySimPrimitives';
import { fakeTimeSeries, fakePlotBands } from '../../../utils/fakeData';
import { LINE_ARG_TYPES } from '../../argTypes';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Lines and Splines/Sales Conversion (line)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Single-series line on a datetime axis with point markers and shared tooltip. Models Cameras Analytics conversion rate widget. Production source: `Verkada-Web/src/command/cameras-analytics/components/sales-conversion-rate-widget/SalesConversionRateChart.tsx`. Verity primitive target: `LineChart`.',
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
    const data = fakeTimeSeries({ count: 30, base: 0.18, amplitude: 0.05, noise: 0.01, stepMs: 24 * 60 * 60 * 1000 });
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'line' },
          title: { text: 'Sales conversion rate (daily)' },
          xAxis: { type: 'datetime', crosshair: true },
          yAxis: {
            min: 0,
            max: 0.4,
            title: { text: 'Conversion rate' },
            labels: { formatter: function () { return `${Math.round((this.value as number) * 100)}%`; } },
          },
          legend: { enabled: false },
          tooltip: {
            useHTML: true,
            shared: true,
            outside: true,
            formatter: function () {
              const p = (this as Highcharts.TooltipFormatterContextObject).points?.[0];
              if (!p) return '';
              const date = new Date(p.x as number).toLocaleDateString();
              return `<div><strong>${date}</strong><br/>${Math.round((p.y as number) * 100)}% conversion</div>`;
            },
          },
          plotOptions: {
            line: {
              marker: { enabled: true, radius: 3 },
              color: '#3B82F6',
            },
          },
          series: [{ type: 'line', name: 'Conversion', data }],
        }}
      />
    );
  },
};

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: LineChart + point markers',
  args: { smooth: false, markers: true, yZones: false, xBands: 0, xAxisTitle: '', yAxisTitle: 'Conversion rate', tooltip: 'shared-crosshair', showLegend: false, colorPalette: 'categorical', seriesName: 'Conversion' },
  argTypes: {
    ...LINE_ARG_TYPES,
    seriesName: {
      control: 'text',
      description: 'Label for the data series shown in legend and tooltip.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Conversion' } },
    },
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
  },
  parameters: {
    docs: {
      description: {
        story:
          'Same chart using a Verity `LineChart`. `markers` replaces raw `plotOptions.line.marker.enabled`. No hex in consumer code.\n\n**Production source:** Cameras Analytics: Sales Conversion Rate (`src/command/cameras-analytics/components/sales-conversion-rate-widget/SalesConversionRateChart.tsx`)',
      },
      source: {
        code: `<LineChart
  smooth={false}
  markers
  colorPalette="categorical"
  series={[{ name: 'Conversion', data: conversionData }]}
  tooltip={{ kind: 'shared-crosshair' }}
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => {
    const data = fakeTimeSeries({ count: 30, base: 0.18, amplitude: 0.05, noise: 0.01, stepMs: 24 * 60 * 60 * 1000 });
    const eventBands = fakePlotBands({ count: args.xBands });
    return (
      <LineChart
        smooth={args.smooth}
        markers={args.markers}
        colorPalette={args.colorPalette}
        showLegend={args.showLegend}
        xAxisTitle={args.xAxisTitle}
        yAxisTitle={args.yAxisTitle}
        series={[{ name: args.seriesName, data: data as [number, number][] }]}
        xBands={eventBands.length > 0 ? eventBands : undefined}
        yZones={args.yZones ? [{ value: 0.15 }, { value: 0.22 }, {}] : undefined}
        tooltip={{ kind: args.tooltip }}
      />
    );
  },
};
