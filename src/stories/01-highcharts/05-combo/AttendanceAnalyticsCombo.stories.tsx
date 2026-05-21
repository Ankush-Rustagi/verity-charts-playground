import type { Meta, StoryObj } from '@storybook/react';
import { COMBO_ARG_TYPES } from '../../argTypes';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { ComboTimeSeriesChart, type ColorPalette } from '../../../primitives/VeritySimPrimitives';
import { fakeTimeSeries } from '../../../utils/fakeData';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Combo and Stock/Attendance Analytics (Stock + tickPositioner)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Time view: filled area chart over a datetime axis with a custom `tickPositioner` for sparse axis labels and a stepped area background. Wired to the Verity filter bar in production. Per the inventory, this is the closest existing surface to a prompt-to-chart prototype: a Verity filter bar already drives a Verity chart, so swapping the filter bar for an NL input is the smallest unlock. Production source: `Verkada-Web/src/command/access/attendance-analytics/AttendanceAnalyticsCombinedChart.tsx`. Verity primitive target: `ComboTimeSeriesChart`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;

export const Default: Story = {
  render: () => {
    const checkedIn = fakeTimeSeries({ count: 96, stepMs: 15 * 60 * 1000, base: 40, amplitude: 25, noise: 4, seed: 11 });
    const expected = fakeTimeSeries({ count: 96, stepMs: 15 * 60 * 1000, base: 60, amplitude: 18, noise: 2, seed: 22 });
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'area', zooming: { type: 'x' } },
          title: { text: 'Attendance, last 24 hours' },
          xAxis: {
            type: 'datetime',
            crosshair: true,
            tickPositioner: function () {
              const positions: number[] = [];
              const { min, max } = this.getExtremes();
              const step = (max - min) / 6;
              for (let i = 0; i <= 6; i += 1) positions.push(Math.round(min + i * step));
              return positions;
            },
          },
          yAxis: { min: 0, title: { text: 'People' } },
          legend: { enabled: false },
          tooltip: { useHTML: true, shared: true, outside: true },
          plotOptions: {
            area: {
              marker: { enabled: false },
              fillOpacity: 0.18,
            },
          },
          series: [
            { type: 'area', name: 'Expected (capacity)', data: expected, color: '#9CA3AF', step: 'center' as Highcharts.OptionsStepValue, fillOpacity: 0.06 },
            { type: 'area', name: 'Checked in', data: checkedIn, color: '#3B82F6' },
          ],
        }}
      />
    );
  },
};

type ComboAfterArgs = {
  showLegend:       boolean;
  tooltip:          'shared-crosshair' | 'point' | 'disabled';
  colorPalette:     ColorPalette;
  xAxisTitle:       string;
  primaryAxisTitle: string;
};

type AfterVerityStory = StoryObj<ComboAfterArgs>;

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: ComboTimeSeriesChart + area',
  args: {
    showLegend:       false,
    tooltip:          'shared-crosshair',
    colorPalette:     'status',
    xAxisTitle:       '',
    primaryAxisTitle: 'Participants',
  },
  argTypes: {
    showLegend:       COMBO_ARG_TYPES.showLegend,
    tooltip:          COMBO_ARG_TYPES.tooltip,
    colorPalette:     COMBO_ARG_TYPES.colorPalette,
    xAxisTitle:       COMBO_ARG_TYPES.xAxisTitle,
    primaryAxisTitle: COMBO_ARG_TYPES.primaryAxisTitle,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Same chart using a Verity `ComboTimeSeriesChart`. Expected capacity uses `status: "neutral"` (gray band). Checked in falls through to `categorical` palette index 0 (`--vc-1`). No raw hex in consumer code.\n\n**Production source:** Access: Attendance Analytics (`src/command/access/attendance-analytics/AttendanceAnalyticsCombinedChart.tsx`)',
      },
      source: {
        code: `<ComboTimeSeriesChart
  series={[
    { name: 'Expected (capacity)', type: 'area', data: expectedData, status: 'neutral', fillOpacity: 0.06 },
    { name: 'Checked in',          type: 'area', data: checkedInData },
  ]}
  tooltip={{ kind: 'shared-crosshair' }}
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => {
    const checkedIn = fakeTimeSeries({ count: 96, stepMs: 15 * 60 * 1000, base: 40, amplitude: 25, noise: 4, seed: 11 });
    const expected  = fakeTimeSeries({ count: 96, stepMs: 15 * 60 * 1000, base: 60, amplitude: 18, noise: 2, seed: 22 });
    return (
      <ComboTimeSeriesChart
        series={[
          { name: 'Expected (capacity)', type: 'area', data: expected   as [number, number][], status: 'neutral', fillOpacity: 0.06 },
          { name: 'Checked in',          type: 'area', data: checkedIn  as [number, number][] },
        ]}
        showLegend={args.showLegend}
        colorPalette={args.colorPalette}
        xAxisTitle={args.xAxisTitle}
        primaryAxis={{ title: args.primaryAxisTitle }}
        tooltip={{ kind: args.tooltip }}
      />
    );
  },
};
