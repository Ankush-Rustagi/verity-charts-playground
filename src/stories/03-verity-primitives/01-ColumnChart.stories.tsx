import type { Meta, StoryObj } from '@storybook/react';
import { ColumnChart, type ColorPalette } from '../../primitives/VeritySimPrimitives';
import { fakeColumnSeries } from '../../utils/fakeData';

type Args = {
  stacking: 'normal' | 'percent' | 'none';
  columnDensity: 'tight' | 'normal' | 'loose';
  axisKind: 'datetime' | 'categorical';
  xAxisTitle: string;
  yAxisTitle: string;
  showLegend: boolean;
  tooltip: 'shared-crosshair' | 'point' | 'disabled';
  dataLabels: boolean;
  colorPalette: ColorPalette;
};

const meta: Meta<Args> = {
  title: '03 Verity Primitives/ColumnChart',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Proposed Verity primitive for column-shaped time-series and categorical bar charts. Single or multi-series, optional stacking, structured palette. Covers the largest set of customer-facing surfaces (10+ files).\n\n' +
          '**Production sources:** Alerts Trends, Helix Trends, Net Occupancy, Traffic, Queue Length, Queue Wait Time (`src/command/cameras-analytics/`); Intercoms Dashboard stacked; Gateway Uptime datetime; Attendance Analytics avg.\n\n' +
          '**Design note:** `columnDensity` compresses 14 production files worth of `groupPadding`/`pointPadding` choices into 3 options. Open question: should Intercoms-style stacked-bar with click navigation be `onPointClick` or `onSegmentClick`?',
      },
    },
  },
  argTypes: {
    stacking: {
      control: 'inline-radio',
      options: ['none', 'normal', 'percent'],
      description: '`stacking?: "normal" | "percent" | "none"` — maps `plotOptions.column.stacking`. `"none"` = no stacking.',
      table: { type: { summary: '"normal" | "percent" | "none"' }, defaultValue: { summary: '"none"' } },
    },
    columnDensity: {
      control: 'inline-radio',
      options: ['tight', 'normal', 'loose'],
      description: '`columnDensity?: "tight" | "normal" | "loose"` — maps `groupPadding + pointPadding` presets.',
      table: { type: { summary: '"tight" | "normal" | "loose"' }, defaultValue: { summary: '"normal"' } },
    },
    axisKind: {
      control: 'inline-radio',
      options: ['datetime', 'categorical'],
      description: '`xAxis: DatetimeAxis | CategoryAxis` — categorical axis required by ~2 production files.',
      table: { type: { summary: '"datetime" | "categorical"' }, defaultValue: { summary: '"categorical"' } },
    },
    xAxisTitle: {
      control: 'text',
      description: '`xAxisTitle?: string` — shorthand for `xAxis.title`. Maps `xAxis.title.text`.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '""' } },
    },
    yAxisTitle: {
      control: 'text',
      description: '`yAxisTitle?: string` — shorthand for `yAxis.title`. Maps `yAxis.title.text`.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '""' } },
    },
    showLegend: {
      control: 'boolean',
      description: '`showLegend?: boolean` (base prop) — default auto: `true` when >1 series, `false` for single.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    tooltip: {
      control: 'inline-radio',
      options: ['shared-crosshair', 'point', 'disabled'],
      description: '`tooltip?: { kind: "shared-crosshair" | "point" | "disabled" }` (base prop) — three modes cover all 57 audited Command files.',
      table: { type: { summary: '"shared-crosshair" | "point" | "disabled"' }, defaultValue: { summary: '"shared-crosshair"' } },
    },
    dataLabels: {
      control: 'boolean',
      description: '`dataLabels?: boolean` — renders value labels on each bar. Auto-disabled by responsive rule at container widths below 400px.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    colorPalette: {
      control: 'inline-radio',
      options: ['categorical', 'sequential', 'diverging', 'status'],
      description: '`colorPalette?: "categorical" | "sequential" | "diverging" | "status"` (base prop) — resolves token palette. Categorical: `--vc-1`…`--vc-8`.',
      table: { type: { summary: 'ColorPalette' }, defaultValue: { summary: '"categorical"' } },
    },
    onBarClick: {
      control: false,
      description: '`onBarClick?: (point: ColumnPoint) => void` — maps `point.events.click`.',
      table: { type: { summary: '(point: ColumnPoint) => void' }, category: 'Proposed API' },
    },
    onTimeRangeBrush: {
      control: false,
      description: '`onTimeRangeBrush?: (range: { start: Date; end: Date }) => void` — maps `xAxis.events.afterSetExtremes`.',
      table: { type: { summary: '(range: { start: Date; end: Date }) => void' }, category: 'Proposed API' },
    },
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {
  args: {
    stacking: 'none',
    columnDensity: 'normal',
    axisKind: 'categorical',
    xAxisTitle: 'Category',
    yAxisTitle: 'Count',
    showLegend: true,
    tooltip: 'shared-crosshair',
    dataLabels: false,
    colorPalette: 'categorical',
  },
  render: (args) => {
    const { categories, values } = fakeColumnSeries({ count: 12, seed: 5 });
    const secondSeries = values.map((v) => Math.round(v * 0.4));
    const thirdSeries  = values.map((v) => Math.round(v * 0.25));
    const datetimeData = (vals: number[]): [number, number][] =>
      vals.map((v, i) => [Date.UTC(2026, 4, 1, i * 2), v]);
    const primaryData   = args.axisKind === 'datetime' ? datetimeData(values)       : values;
    const secondaryData = args.axisKind === 'datetime' ? datetimeData(secondSeries) : secondSeries;
    const tertiaryData  = args.axisKind === 'datetime' ? datetimeData(thirdSeries)  : thirdSeries;
    return (
      <ColumnChart
        axisKind={args.axisKind}
        categories={args.axisKind === 'categorical' ? categories : undefined}
        stacking={args.stacking}
        columnDensity={args.columnDensity}
        xAxisTitle={args.xAxisTitle}
        yAxisTitle={args.yAxisTitle}
        showLegend={args.showLegend}
        tooltip={{ kind: args.tooltip }}
        dataLabels={args.dataLabels}
        colorPalette={args.colorPalette}
        series={[
          { name: 'Primary',   data: primaryData },
          { name: 'Secondary', data: secondaryData },
          { name: 'Tertiary',  data: tertiaryData },
        ]}
      />
    );
  },
};
