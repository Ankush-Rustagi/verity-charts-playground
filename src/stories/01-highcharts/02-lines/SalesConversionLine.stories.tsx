import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { LineChart, type ColorPalette } from '../../../primitives/VeritySimPrimitives';
import { fakeTimeSeries, fakePlotBands } from '../../../utils/fakeData';

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
  smooth: boolean;
  markers: boolean;
  zones: boolean;
  bands: number;
  xAxisTitle: string;
  yAxisTitle: string;
  tooltip: 'shared-crosshair' | 'point' | 'disabled';
  showLegend: boolean;
  colorPalette: ColorPalette;
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
  args: { smooth: false, markers: true, zones: false, bands: 0, xAxisTitle: '', yAxisTitle: 'Conversion rate', tooltip: 'shared-crosshair', showLegend: false, colorPalette: 'categorical' },
  argTypes: {
    smooth: {
      control: 'boolean',
      description: '`smooth?: boolean` — false = line, true = spline',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    markers: {
      control: 'boolean',
      description: '`markers?: boolean` — shows data-point dots',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    zones: {
      control: 'boolean',
      description: '`zones?: ZoneConfig[]` — threshold coloring',
      table: { type: { summary: 'ZoneConfig[]' }, defaultValue: { summary: 'undefined' } },
    },
    bands: {
      control: { type: 'range', min: 0, max: 5, step: 1 },
      description: '`bands?: PlotBand[]` — alert-event plotBands',
      table: { type: { summary: 'PlotBand[]' }, defaultValue: { summary: '0' } },
    },
    xAxisTitle: {
      control: 'text',
      description: '`xAxisTitle?: string` — shorthand for `xAxis.title`.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '""' } },
    },
    yAxisTitle: {
      control: 'text',
      description: '`yAxisTitle?: string` — shorthand for `yAxis.title`.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '"Conversion rate"' } },
    },
    tooltip: {
      control: 'inline-radio',
      options: ['shared-crosshair', 'point', 'disabled'],
      description: '`tooltip?: { kind: ... }` (base prop)',
      table: { type: { summary: '"shared-crosshair" | "point" | "disabled"' }, defaultValue: { summary: '"shared-crosshair"' } },
    },
    showLegend: {
      control: 'boolean',
      description: '`showLegend?: boolean` (base prop)',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    colorPalette: {
      control: 'inline-radio',
      options: ['categorical', 'sequential', 'diverging', 'status'],
      description: '`colorPalette?: ColorPalette` (base prop)',
      table: { type: { summary: 'ColorPalette' }, defaultValue: { summary: '"categorical"' } },
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
    const eventBands = fakePlotBands({ count: args.bands });
    return (
      <LineChart
        smooth={args.smooth}
        markers={args.markers}
        colorPalette={args.colorPalette}
        showLegend={args.showLegend}
        xAxisTitle={args.xAxisTitle}
        yAxisTitle={args.yAxisTitle}
        series={[{ name: 'Conversion', data: data as [number, number][] }]}
        bands={eventBands.length > 0 ? eventBands : undefined}
        zones={args.zones ? [{ value: 0.15 }, { value: 0.22 }, {}] : undefined}
        tooltip={{ kind: args.tooltip }}
      />
    );
  },
};
