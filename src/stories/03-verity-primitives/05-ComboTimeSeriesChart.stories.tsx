import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../primitives/PlaygroundChart';
import { type ColorPalette, PALETTE_HEX } from '../../primitives/VeritySimPrimitives';
import { fakeTimeSeries } from '../../utils/fakeData';

type Args = {
  dualAxis: boolean;
  stacking: 'normal' | 'percent' | 'none';
  primaryAxisLabel: string;
  secondaryAxisLabel: string;
  colorPalette: ColorPalette;
};

const meta: Meta<Args> = {
  title: '03 Verity Primitives/ComboTimeSeriesChart',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Proposed Verity primitive for multi-series charts that mix column and line/spline on the same time axis, optionally with a secondary y-axis. Built on Highcharts Stock (`ChartAdvanced` today) so it inherits zoom/pan and date range selection.\n\n' +
          '**Production sources:** Trailer Power Metrics — dual axis (`src/command/trailers/`); Attendance Analytics — Stock + tickPositioner (`src/command/access/`).\n\n' +
          '**Design note:** Only 2 production consumers but very high value. The `dualAxis` prop is the single biggest API surface this primitive needs to get right. Suggest renaming `ChartAdvanced` → `ComboTimeSeriesChart` in the Verity API.',
      },
    },
  },
  argTypes: {
    dualAxis: {
      control: 'boolean',
      description: '`dualAxis?: boolean` — adds an opposing right-side y-axis. Maps `yAxis: [{...}, {...opposite:true}]`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    stacking: {
      control: 'inline-radio',
      options: ['none', 'normal', 'percent'],
      description: '`stacking?: "normal" | "percent" | "none"` — column stacking mode. Maps `plotOptions.column.stacking`.',
      table: { type: { summary: '"normal" | "percent" | "none"' }, defaultValue: { summary: '"none"' } },
    },
    primaryAxisLabel: {
      control: 'text',
      description: '`yAxes[0].title` — label for the primary (left) y-axis.',
      table: { type: { summary: 'string' } },
    },
    secondaryAxisLabel: {
      control: 'text',
      description: '`yAxes[1].title` — label for the secondary (right) y-axis. Only shown when `dualAxis` is set.',
      table: { type: { summary: 'string' } },
    },
    colorPalette: {
      control: 'inline-radio',
      options: ['categorical', 'sequential', 'diverging', 'status'],
      description: '`colorPalette?: ColorPalette` (base prop) — drives series colors by index across all column and line series.',
      table: { type: { summary: 'ColorPalette' }, defaultValue: { summary: '"categorical"' } },
    },
    seriesAxisBinding: {
      control: false,
      description: '`series[i].yAxis: 0 | 1` — binds a series to the primary or secondary axis. Replaces manual `yAxis` index tracking.',
      table: { type: { summary: '0 | 1' }, category: 'Proposed API' },
    },
    onTimeRangeBrush: {
      control: false,
      description: '`onTimeRangeBrush?: (range: { start: Date; end: Date }) => void` — maps Highcharts Stock zoom/pan events.',
      table: { type: { summary: '(range: { start: Date; end: Date }) => void' }, category: 'Proposed API' },
    },
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {
  args: { dualAxis: true, stacking: 'none', primaryAxisLabel: 'Watts', secondaryAxisLabel: 'State of charge (%)', colorPalette: 'categorical' },
  render: (args) => {
    const solar = fakeTimeSeries({ count: 96, base: 200, amplitude: 150, noise: 30, seed: 1 });
    const grid  = fakeTimeSeries({ count: 96, base: 100, amplitude: 50,  noise: 15, seed: 2 });
    const soc   = fakeTimeSeries({ count: 96, base: 65,  amplitude: 15,  noise: 2,  seed: 3 });
    const palette = PALETTE_HEX[args.colorPalette];
    return (
      <PlaygroundChart
        options={{
          chart: {},
          title: { text: '' },
          xAxis: { type: 'datetime', crosshair: true },
          yAxis: args.dualAxis
            ? [
                { title: { text: args.primaryAxisLabel }, min: 0 },
                { title: { text: args.secondaryAxisLabel }, opposite: true, min: 0, max: 100 },
              ]
            : [{ title: { text: args.primaryAxisLabel }, min: 0 }],
          legend: { enabled: true, align: 'center', verticalAlign: 'bottom' },
          tooltip: { useHTML: true, shared: true, outside: true },
          plotOptions: {
            column: {
              stacking: args.stacking ?? undefined,
              borderRadius: 0,
              groupPadding: 0,
              pointPadding: 0,
            },
            spline: { marker: { enabled: false }, lineWidth: 2 },
          },
          series: [
            { type: 'column', name: 'Solar', data: solar, yAxis: 0, color: palette[0] },
            { type: 'column', name: 'Grid',  data: grid,  yAxis: 0, color: palette[1] },
            { type: 'spline', name: 'SoC',   data: soc,   yAxis: args.dualAxis ? 1 : 0, color: palette[2] },
          ],
        }}
        height={400}
      />
    );
  },
};
