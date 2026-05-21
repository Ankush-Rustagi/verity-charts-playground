import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { ColumnChart } from '../../../primitives/VeritySimPrimitives';
import { COLUMN_ARG_TYPES } from '../../argTypes';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Columns/Intercoms Dashboard (stacked weekly)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Stacked column over the past 7 days, categorical x-axis (day of week), multi-event-type stack with custom colors. The only customer-facing chart that imports `highcharts` directly instead of through Verity `Chart` (flagged as tech-debt in the inventory). Production source: `Verkada-Web/src/command/intercoms/pages/dashboard/DashboardBarGraph.tsx`. Verity primitive target: `ColumnChart` with `stacked: \'normal\'` and categorical axis support.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;

export const Default: Story = {
  render: () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'column' },
          title: { text: 'Intercom usage, past 7 days' },
          xAxis: { categories: days },
          yAxis: { min: 0, title: { text: 'Calls' } },
          legend: { enabled: true, align: 'center', verticalAlign: 'bottom' },
          tooltip: { useHTML: true, shared: true, outside: true },
          plotOptions: {
            column: {
              stacking: 'normal',
              borderRadius: 0,
              groupPadding: 0.1,
              pointPadding: 0,
            },
            series: {
              point: {
                events: {
                  click: function () {
                    alert(`Navigate to call list filtered by ${this.series.name} on ${this.category}`);
                  },
                },
              },
            },
          },
          series: [
            { type: 'column', name: 'Answered', data: [22, 30, 25, 28, 35, 18, 12], color: '#22C55E' },
            { type: 'column', name: 'Missed', data: [6, 4, 8, 5, 7, 3, 5], color: '#EF4444' },
            { type: 'column', name: 'Voicemail', data: [3, 5, 2, 6, 4, 8, 2], color: '#F59E0B' },
          ],
        }}
      />
    );
  },
};

type ColumnAfterArgs = {
  stacking:      'none' | 'normal' | 'percent';
  columnDensity: 'tight' | 'normal' | 'loose';
  showLegend:    boolean;
  tooltip:       'shared-crosshair' | 'point' | 'disabled';
  xAxisTitle:    string;
  yAxisTitle:    string;
};
// colorPalette="status" is set explicitly so the series' status hints activate.
// With the new applyPalette logic, status only drives color when colorPalette="status".

type AfterVerityStory = StoryObj<ColumnAfterArgs>;

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: ColumnChart stacked + semantic status',
  args: {
    stacking:      'normal',
    columnDensity: 'tight',
    showLegend:    true,
    tooltip:       'shared-crosshair',
    xAxisTitle:    'Day',
    yAxisTitle:    'Calls',
  },
  argTypes: {
    stacking:      COLUMN_ARG_TYPES.stacking,
    columnDensity: COLUMN_ARG_TYPES.columnDensity,
    showLegend:    COLUMN_ARG_TYPES.showLegend,
    tooltip:       COLUMN_ARG_TYPES.tooltip,
    xAxisTitle:    COLUMN_ARG_TYPES.xAxisTitle,
    yAxisTitle:    COLUMN_ARG_TYPES.yAxisTitle,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Same chart using a Verity `ColumnChart`. Call-outcome series use `status` props instead of raw hex: `success` (Answered), `danger` (Missed), `warning` (Voicemail). No color strings anywhere in consumer code.\n\n**Production source:** Intercoms: Dashboard (`src/command/intercoms/pages/dashboard/DashboardBarGraph.tsx`)',
      },
      source: {
        code: `<ColumnChart
  axisKind="categorical"
  categories={days}
  stacking="normal"
  columnDensity="tight"
  showLegend
  series={[
    { name: 'Answered',  data: answeredData,  status: 'success' },
    { name: 'Missed',    data: missedData,    status: 'danger'  },
    { name: 'Voicemail', data: voicemailData, status: 'warning' },
  ]}
  tooltip={{ kind: 'shared-crosshair' }}
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return (
      <ColumnChart
        axisKind="categorical"
        categories={days}
        stacking={args.stacking}
        columnDensity={args.columnDensity}
        showLegend={args.showLegend}
        xAxisTitle={args.xAxisTitle}
        yAxisTitle={args.yAxisTitle}
        colorPalette="status"
        series={[
          { name: 'Answered',  data: [22, 30, 25, 28, 35, 18, 12], status: 'success' },
          { name: 'Missed',    data: [6,  4,  8,  5,  7,  3,  5],  status: 'danger'  },
          { name: 'Voicemail', data: [3,  5,  2,  6,  4,  8,  2],  status: 'warning' },
        ]}
        tooltip={{ kind: args.tooltip }}
      />
    );
  },
};
