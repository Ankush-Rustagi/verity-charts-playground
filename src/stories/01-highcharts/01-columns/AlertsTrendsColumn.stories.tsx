import type { Meta, StoryObj } from '@storybook/react';
import Highcharts from 'highcharts';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { ColumnChart, type ColorPalette } from '../../../primitives/VeritySimPrimitives';
import { fakeColumnSeries } from '../../../utils/fakeData';
import { CHART_FONT_FAMILY } from '../../../primitives/chartColors';
import { COLUMN_ARG_TYPES } from '../../argTypes';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Columns/Alerts Trends (Cameras Analytics)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Boring Highcharts column chart, hourly buckets, single series. Models the Cameras Analytics widgets. Production source: `Verkada-Web/src/command/cameras-analytics/components/alerts-trends/AlertsTrendsChart.tsx` plus the shared `cameras-analytics/utils/charts.ts` helper. Verity primitive target: `ColumnChart`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;
type ColumnArgs = {
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
type AfterVerityStory = StoryObj<ColumnArgs>;

export const Default: Story = {
  render: () => {
    const { categories, values } = fakeColumnSeries({ count: 24 });
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'column' },
          title: { text: 'People crossings (hourly)' },
          xAxis: {
            categories,
            crosshair: true,
            title: { text: 'Hour of day' },
          },
          yAxis: {
            min: 0,
            title: { text: 'Crossings' },
          },
          legend: { enabled: false },
          tooltip: {
            useHTML: true,
            shared: true,
            outside: true,
            formatter: function () {
              const point = (this as Highcharts.TooltipFormatterContextObject).points?.[0];
              if (!point) return '';
              return `<div style="font-family:${CHART_FONT_FAMILY}"><strong>${point.x}</strong><br/>${point.y} crossings</div>`;
            },
          },
          plotOptions: {
            column: {
              borderRadius: 4,
              groupPadding: 0.1,
              pointPadding: 0.05,
              color: '#3B82F6',
            },
          },
          series: [
            {
              type: 'column',
              name: 'Crossings',
              data: values,
            },
          ],
        }}
      />
    );
  },
};

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: ColumnChart',
  args: {
    stacking: 'none',
    columnDensity: 'normal',
    axisKind: 'categorical',
    xAxisTitle: 'Hour of day',
    yAxisTitle: 'Crossings',
    showLegend: false,
    tooltip: 'shared-crosshair',
    dataLabels: false,
    colorPalette: 'categorical',
  },
  argTypes: { ...COLUMN_ARG_TYPES },
  parameters: {
    docs: {
      description: {
        story:
          'Same chart as a Verity `ColumnChart`. All Controls match the Verity primitive API. `axisKind` + `columnDensity` + `tooltip` replace raw `xAxis` and `plotOptions.column` config.\n\n**Production source:** Cameras Analytics: Alerts Trends (`src/command/cameras-analytics/components/alerts-trends/AlertsTrendsChart.tsx`)',
      },
      source: {
        code: `<ColumnChart
  axisKind="categorical"
  categories={hourLabels}
  columnDensity="normal"
  colorPalette="categorical"
  series={[{ name: 'Crossings', data: values }]}
  tooltip={{ kind: 'shared-crosshair' }}
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => {
    const { categories, values } = fakeColumnSeries({ count: 24 });
    const secondSeries = values.map((v) => Math.round(v * 0.45));
    const isStacked = args.stacking !== 'none';
    const datetimeData = values.map((v, i) => [Date.UTC(2026, 4, 1, i), v] as [number, number]);
    return (
      <ColumnChart
        axisKind={args.axisKind}
        categories={args.axisKind === 'categorical' ? categories : undefined}
        columnDensity={args.columnDensity}
        stacking={args.stacking}
        xAxisTitle={args.xAxisTitle}
        yAxisTitle={args.yAxisTitle}
        showLegend={isStacked ? true : args.showLegend}
        colorPalette={args.colorPalette}
        series={
          isStacked
            ? [
                { name: 'Crossings', data: args.axisKind === 'categorical' ? values : datetimeData },
                { name: 'Returns',   data: args.axisKind === 'categorical' ? secondSeries : secondSeries.map((v, i) => [Date.UTC(2026, 4, 1, i), v] as [number, number]) },
              ]
            : [{ name: 'Crossings', data: args.axisKind === 'categorical' ? values : datetimeData }]
        }
        tooltip={{ kind: args.tooltip }}
        dataLabels={args.dataLabels}
      />
    );
  },
};
