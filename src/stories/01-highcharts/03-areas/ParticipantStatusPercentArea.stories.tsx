import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { AreaChart, type ColorPalette } from '../../../primitives/VeritySimPrimitives';
import { fakeTimeSeries } from '../../../utils/fakeData';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Areas/Participant Status (percent-stacked area)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Percent-stacked area showing composition over time. Only customer-facing chart that uses `stacking: \'percent\'`. Production source: `Verkada-Web/src/command/unite/pages/incidentDetails/dashboard/components/participantStatusOverTime/ParticipantStatusOvertimeChart.tsx`. Verity primitive target: `AreaChart` with `stacked: \'percent\'`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;

export const Default: Story = {
  render: () => {
    const checked = fakeTimeSeries({ count: 60, base: 30, amplitude: 8, noise: 3, seed: 1 });
    const inactive = fakeTimeSeries({ count: 60, base: 20, amplitude: 5, noise: 2, seed: 2 });
    const responded = fakeTimeSeries({ count: 60, base: 50, amplitude: 12, noise: 4, seed: 3 });
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'area' },
          title: { text: 'Participant status over time' },
          xAxis: { type: 'datetime', crosshair: true },
          yAxis: { title: { text: 'Share' }, labels: { format: '{value}%' } },
          legend: { enabled: true, align: 'center', verticalAlign: 'bottom' },
          tooltip: { useHTML: true, shared: true, outside: true },
          plotOptions: {
            area: {
              stacking: 'percent',
              marker: { enabled: false },
            },
          },
          series: [
            { type: 'area', name: 'Responded', data: responded, color: '#22C55E' },
            { type: 'area', name: 'Checked in', data: checked, color: '#3B82F6' },
            { type: 'area', name: 'Inactive', data: inactive, color: '#9CA3AF' },
          ],
        }}
      />
    );
  },
};

type AreaAfterArgs = {
  variant:      'area' | 'areaspline';
  stacking:     'none' | 'normal' | 'percent';
  fillOpacity:  number;
  showLegend:   boolean;
  tooltip:      'shared-crosshair' | 'point' | 'disabled';
  colorPalette: ColorPalette;
  xAxisTitle:   string;
  yAxisTitle:   string;
};

type AfterVerityStory = StoryObj<AreaAfterArgs>;

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: AreaChart stacking="percent"',
  args: {
    variant:      'area',
    stacking:     'percent',
    fillOpacity:  0.5,
    showLegend:   true,
    tooltip:      'shared-crosshair',
    colorPalette: 'categorical',
    xAxisTitle:   '',
    yAxisTitle:   'Participants (%)',
  },
  argTypes: {
    variant:      { control: 'inline-radio', options: ['area', 'areaspline'], description: '`area` = hard corners; `areaspline` = smooth curve.' },
    stacking:     { control: 'inline-radio', options: ['none', 'normal', 'percent'], description: 'Area stacking mode. `percent` = 100% stacked.' },
    fillOpacity:  { control: { type: 'range', min: 0, max: 1, step: 0.01 }, description: 'Fill opacity under each area.' },
    showLegend:   { control: 'boolean', description: 'Show/hide the chart legend.' },
    tooltip:      { control: 'inline-radio', options: ['shared-crosshair', 'point', 'disabled'], description: 'Tooltip interaction mode.' },
    colorPalette: { control: 'inline-radio', options: ['categorical', 'status', 'sequential', 'diverging'], description: 'Token-based color palette.' },
    xAxisTitle:   { control: 'text', description: 'X-axis label.' },
    yAxisTitle:   { control: 'text', description: 'Y-axis label.' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Same chart as a Verity `AreaChart`. Responded and Inactive declare semantic intent via `status`; Checked in carries no status and falls through to the categorical palette (series index 1 → `--vc-2`, teal). No color strings appear in consumer code.\n\n**Production source:** Unite: Participant status over time (`src/command/unite/pages/incidentDetails/dashboard/components/participantStatusOverTime/ParticipantStatusOvertimeChart.tsx`)',
      },
      source: {
        code: `<AreaChart
  variant="area"
  stacking="percent"
  showLegend
  series={[
    { name: 'Responded',  data: respondedData, status: 'success' },
    { name: 'Checked in', data: checkedData                       },
    { name: 'Inactive',   data: inactiveData,  status: 'neutral' },
  ]}
  tooltip={{ kind: 'shared-crosshair' }}
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => {
    const checked   = fakeTimeSeries({ count: 60, base: 30, amplitude: 8,  noise: 3, seed: 1 });
    const inactive  = fakeTimeSeries({ count: 60, base: 20, amplitude: 5,  noise: 2, seed: 2 });
    const responded = fakeTimeSeries({ count: 60, base: 50, amplitude: 12, noise: 4, seed: 3 });
    return (
      <AreaChart
        variant={args.variant}
        stacking={args.stacking}
        fillOpacity={args.fillOpacity}
        showLegend={args.showLegend}
        colorPalette={args.colorPalette}
        xAxisTitle={args.xAxisTitle}
        yAxisTitle={args.yAxisTitle}
        series={[
          { name: 'Responded',  data: responded, status: 'success' },
          { name: 'Checked in', data: checked },
          { name: 'Inactive',   data: inactive,  status: 'neutral' },
        ]}
        tooltip={{ kind: args.tooltip }}
      />
    );
  },
};
