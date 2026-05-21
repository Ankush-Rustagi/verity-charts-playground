import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { ColumnChart } from '../../../primitives/VeritySimPrimitives';
import { fakeColumnSeries } from '../../../utils/fakeData';
import { COLUMN_ARG_TYPES } from '../../argTypes';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Columns/Gateway Uptime (stacked, datetime)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Stacked column on a datetime axis, two-state visualization (online vs degraded). Models the Gateway uptime stack. Production source: `Verkada-Web/src/command/gateways/details/common/gatewayHighcharts/`. Verity primitive target: `ColumnChart` with `stacked: \'normal\'`. This is the second-largest production usage of `column`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;

export const Default: Story = {
  render: () => {
    const online = fakeColumnSeries({ count: 24, base: 50, amplitude: 8, noise: 2, seed: 42 }).values.map((v) =>
      Math.min(60, v),
    );
    const degraded = online.map((v) => Math.max(0, 60 - v));
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'column' },
          title: { text: 'Uptime by hour (last 24h)' },
          xAxis: {
            type: 'datetime',
            crosshair: true,
            title: { text: 'Time' },
          },
          yAxis: {
            min: 0,
            max: 60,
            title: { text: 'Minutes' },
          },
          legend: { enabled: true, align: 'center', verticalAlign: 'bottom' },
          tooltip: {
            useHTML: true,
            shared: true,
            outside: true,
          },
          plotOptions: {
            column: {
              stacking: 'normal',
              borderRadius: 0,
              groupPadding: 0,
              pointPadding: 0,
            },
          },
          series: [
            {
              type: 'column',
              name: 'Online',
              data: online.map((v, i) => [Date.UTC(2026, 4, 1, i), v]),
              color: '#22C55E',
            },
            {
              type: 'column',
              name: 'Degraded',
              data: degraded.map((v, i) => [Date.UTC(2026, 4, 1, i), v]),
              color: '#EF4444',
            },
          ],
        }}
      />
    );
  },
};

type ColumnAfterArgs = {
  stacking:      'none' | 'normal';
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
  name: 'After Verity Highcharts: ColumnChart stacking="normal" + datetime',
  args: {
    stacking:      'normal',
    columnDensity: 'tight',
    showLegend:    true,
    tooltip:       'shared-crosshair',
    xAxisTitle:    '',
    yAxisTitle:    'Minutes',
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
          'Same chart as a Verity `ColumnChart`. Each series declares its semantic intent with a `status` prop instead of a color string. The primitive resolves `status: "success"` → success green and `status: "danger"` → danger red. No color values appear in consumer code.\n\n**Production source:** Gateway Details: Uptime by hour (`src/command/gateways/details/common/gatewayHighcharts/GatewayHighchartsUptime.tsx`)',
      },
      source: {
        code: `<ColumnChart
  axisKind="datetime"
  stacking="normal"
  columnDensity="tight"
  showLegend
  series={[
    { name: 'Online',   data: onlineData,   status: 'success' },
    { name: 'Degraded', data: degradedData, status: 'danger'  },
  ]}
  tooltip={{ kind: 'shared-crosshair' }}
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => {
    const online = fakeColumnSeries({ count: 24, base: 50, amplitude: 8, noise: 2, seed: 42 }).values.map((v) =>
      Math.min(60, v),
    );
    const degraded = online.map((v) => Math.max(0, 60 - v));
    return (
      <ColumnChart
        axisKind="datetime"
        stacking={args.stacking}
        columnDensity={args.columnDensity}
        showLegend={args.showLegend}
        xAxisTitle={args.xAxisTitle}
        yAxisTitle={args.yAxisTitle}
        colorPalette="status"
        series={[
          { name: 'Online',   data: online.map((v, i) => [Date.UTC(2026, 4, 1, i), v] as [number, number]), status: 'success' },
          { name: 'Degraded', data: degraded.map((v, i) => [Date.UTC(2026, 4, 1, i), v] as [number, number]), status: 'danger' },
        ]}
        tooltip={{ kind: args.tooltip }}
      />
    );
  },
};
