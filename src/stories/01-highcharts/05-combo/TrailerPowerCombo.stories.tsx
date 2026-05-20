import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { ComboTimeSeriesChart, type ColorPalette } from '../../../primitives/VeritySimPrimitives';
import { fakeTimeSeries } from '../../../utils/fakeData';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Combo and Stock/Trailer Power Metrics (dual axis combo)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Dual y-axis combo: stacked columns (energy draw) on the left axis, spline (state of charge %) on the right axis. The most data-dense customer-facing chart per item 14 in the inventory. Production source: `Verkada-Web/src/command/trailers/common/PowerMetricsChart/PowerMetricsChart.tsx` (uses `ChartAdvanced` Stock wrapper). Verity primitive target: `ComboTimeSeriesChart`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;

export const Default: Story = {
  render: () => {
    const solar = fakeTimeSeries({ count: 96, base: 200, amplitude: 150, noise: 30, seed: 1 });
    const grid = fakeTimeSeries({ count: 96, base: 100, amplitude: 50, noise: 15, seed: 2 });
    const soc = fakeTimeSeries({ count: 96, base: 65, amplitude: 15, noise: 2, seed: 3 });
    return (
      <PlaygroundChart
        options={{
          chart: { zooming: { type: 'x' } },
          title: { text: 'Trailer power draw plus state of charge' },
          xAxis: { type: 'datetime', crosshair: true },
          yAxis: [
            {
              title: { text: 'Watts' },
              min: 0,
            },
            {
              title: { text: 'State of charge (%)' },
              opposite: true,
              min: 0,
              max: 100,
            },
          ],
          legend: { enabled: true, align: 'center', verticalAlign: 'bottom' },
          tooltip: { useHTML: true, shared: true, outside: true },
          plotOptions: {
            column: {
              stacking: 'normal',
              borderRadius: 0,
              groupPadding: 0,
              pointPadding: 0,
            },
            spline: {
              marker: { enabled: false },
              lineWidth: 2,
            },
          },
          series: [
            { type: 'column', name: 'Solar (W)', data: solar, yAxis: 0, color: '#F59E0B' },
            { type: 'column', name: 'Grid (W)', data: grid, yAxis: 0, color: '#9CA3AF' },
            { type: 'spline', name: 'SoC (%)', data: soc, yAxis: 1, color: '#22C55E' },
          ],
        }}
        height={420}
      />
    );
  },
};

type ComboAfterArgs = {
  stacking:           'none' | 'normal';
  zoom:               boolean;
  showLegend:         boolean;
  dualAxis:           boolean;
  tooltip:            'shared-crosshair' | 'point' | 'disabled';
  colorPalette:       ColorPalette;
  xAxisTitle:         string;
  primaryAxisTitle:   string;
  secondaryAxisTitle: string;
};

type AfterVerityStory = StoryObj<ComboAfterArgs>;

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: ComboTimeSeriesChart + dual axis',
  args: {
    stacking:           'normal',
    zoom:               true,
    showLegend:         true,
    dualAxis:           true,
    tooltip:            'shared-crosshair',
    colorPalette:       'categorical',
    xAxisTitle:         '',
    primaryAxisTitle:   'Watts',
    secondaryAxisTitle: 'State of charge (%)',
  },
  argTypes: {
    stacking:           { control: 'inline-radio', options: ['none', 'normal'], description: 'Column stacking for column-type series.' },
    zoom:               { control: 'boolean', description: 'Enable x-axis zoom select.' },
    showLegend:         { control: 'boolean', description: 'Show/hide the chart legend.' },
    dualAxis:           { control: 'boolean', description: 'When true, adds a secondary y-axis (right) for SoC series.' },
    tooltip:            { control: 'inline-radio', options: ['shared-crosshair', 'point', 'disabled'], description: 'Tooltip interaction mode.' },
    colorPalette:       { control: 'inline-radio', options: ['categorical', 'status', 'sequential', 'diverging'], description: 'Token-based color palette.' },
    xAxisTitle:         { control: 'text', description: 'X-axis label.' },
    primaryAxisTitle:   { control: 'text', description: 'Left y-axis label.' },
    secondaryAxisTitle: { control: 'text', description: 'Right y-axis label (only shown when dualAxis is on).' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Same chart using a Verity `ComboTimeSeriesChart`. Solar and Grid use categorical palette indices (blue, teal). Grid uses `status: "neutral"` (gray). SoC uses `status: "success"` (green — high SoC is good). No raw hex anywhere in consumer code.\n\n**Production source:** Trailers: Power Metrics (`src/command/trailers/common/PowerMetricsChart/PowerMetricsChart.tsx`)',
      },
      source: {
        code: `<ComboTimeSeriesChart
  series={[
    { name: 'Solar (W)', type: 'column', data: solarData, axis: 'primary'   },
    { name: 'Grid (W)',  type: 'column', data: gridData,  axis: 'primary',   status: 'neutral'  },
    { name: 'SoC (%)',   type: 'spline', data: socData,   axis: 'secondary', status: 'success'  },
  ]}
  stacking="normal"
  primaryAxis={{ title: 'Watts', min: 0 }}
  secondaryAxis={{ title: 'State of charge (%)', min: 0, max: 100 }}
  zoom
  showLegend
  tooltip={{ kind: 'shared-crosshair' }}
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => {
    const solar = fakeTimeSeries({ count: 96, base: 200, amplitude: 150, noise: 30, seed: 1 });
    const grid  = fakeTimeSeries({ count: 96, base: 100, amplitude: 50,  noise: 15, seed: 2 });
    const soc   = fakeTimeSeries({ count: 96, base: 65,  amplitude: 15,  noise: 2,  seed: 3 });
    return (
      <ComboTimeSeriesChart
        series={[
          { name: 'Solar (W)', type: 'column', data: solar as [number, number][], axis: 'primary'   },
          { name: 'Grid (W)',  type: 'column', data: grid  as [number, number][], axis: 'primary',   status: 'neutral'  },
          { name: 'SoC (%)',   type: 'spline', data: soc   as [number, number][], axis: args.dualAxis ? 'secondary' : 'primary', status: 'success' },
        ]}
        stacking={args.stacking}
        xAxisTitle={args.xAxisTitle}
        primaryAxis={{ title: args.primaryAxisTitle, min: 0 }}
        secondaryAxis={args.dualAxis ? { title: args.secondaryAxisTitle, min: 0, max: 100 } : undefined}
        zoom={args.zoom}
        showLegend={args.showLegend}
        colorPalette={args.colorPalette}
        tooltip={{ kind: args.tooltip }}
        height={420}
      />
    );
  },
};
