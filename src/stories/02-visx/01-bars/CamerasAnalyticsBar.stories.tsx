import { CHART_FONT_FAMILY } from '../../../primitives/chartColors';
import type { Meta, StoryObj } from '@storybook/react';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Bar } from '@visx/shape';
import { GridRows } from '@visx/grid';
import { ColumnChart, type ColorPalette } from '../../../primitives/VeritySimPrimitives';
import { fakeColumnSeries } from '../../../utils/fakeData';
import { COLUMN_ARG_TYPES } from '../../argTypes';

const meta: Meta = {
  title: '02 visx/Bars/Cameras Analytics BarChart (forked visx kit)',
  parameters: {
    docs: {
      description: {
        component:
          'The original Cameras Analytics dashboard bar chart, built on the forked visx kit. Predates Verity Chart. Production source: `Verkada-Web/src/command/cameras/components/charts/BarChart.tsx` plus shared subcomponents in `cameras/components/charts/components/`. Inventory: this is the visx Cameras Analytics surface mentioned in cluster 1 (legacy pre-Verity). Migration candidate: collapse into Verity `ColumnChart`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;
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
    const { categories, values } = fakeColumnSeries({ count: 12, seed: 88 });
    const width = 640;
    const height = 320;
    const margin = { top: 16, right: 16, bottom: 36, left: 48 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const xScale = scaleBand<string>({
      domain: categories,
      range: [0, innerWidth],
      padding: 0.2,
    });
    const yScale = scaleLinear<number>({
      domain: [0, Math.max(...values) * 1.1],
      range: [innerHeight, 0],
      nice: true,
    });
    return (
      <svg width={width} height={height} style={{ background: '#FFFFFF', fontFamily: CHART_FONT_FAMILY }}>
        <Group left={margin.left} top={margin.top}>
          <GridRows scale={yScale} width={innerWidth} stroke="#E5E7EB" strokeDasharray="2,2" />
          {values.map((v, i) => {
            const x = xScale(categories[i]) ?? 0;
            const y = yScale(v);
            return (
              <Bar
                key={categories[i]}
                x={x}
                y={y}
                width={xScale.bandwidth()}
                height={innerHeight - y}
                fill="#3B82F6"
                rx={3}
              />
            );
          })}
          <AxisBottom top={innerHeight} scale={xScale} stroke="#9CA3AF" tickStroke="#9CA3AF" tickLabelProps={() => ({ fill: '#374151', fontSize: 11, textAnchor: 'middle' })} />
          <AxisLeft scale={yScale} stroke="#9CA3AF" tickStroke="#9CA3AF" tickLabelProps={() => ({ fill: '#374151', fontSize: 11, textAnchor: 'end', dx: -4, dy: 3 })} />
        </Group>
      </svg>
    );
  },
};

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: ColumnChart (migration from visx)',
  parameters: {
    docs: {
      description: {
        story:
          'Same bar chart using a Verity `ColumnChart`. Migrates from forked visx kit to the standard Verity primitive. `colorPalette="categorical"` gives the single series `--vc-1` (brand blue). All axis, grid, and tooltip config absorbed by the primitive.\n\n**Production source:** Cameras Analytics: Bar Chart (`src/command/cameras/components/charts/BarChart.tsx`)',
      },
      source: {
        code: `<ColumnChart
  axisKind="categorical"
  categories={categories}
  colorPalette="categorical"
  series={[{ name: 'Value', data: values }]}
  tooltip={{ kind: 'shared-crosshair' }}
/>`,
        type: 'code',
      },
    },
  },
  args: {
    stacking: 'none',
    columnDensity: 'normal',
    axisKind: 'categorical',
    xAxisTitle: '',
    yAxisTitle: '',
    showLegend: false,
    tooltip: 'shared-crosshair',
    dataLabels: false,
    colorPalette: 'categorical',
  },
  argTypes: { ...COLUMN_ARG_TYPES },
  render: (args) => {
    const { categories, values } = fakeColumnSeries({ count: 12, seed: 88 });
    const datetimeData = (vals: number[]): [number, number][] =>
      vals.map((v, i) => [Date.UTC(2026, 4, 1, i * 2), v]);
    const primaryData = args.axisKind === 'datetime' ? datetimeData(values) : values;
    return (
      <ColumnChart
        axisKind={args.axisKind}
        categories={args.axisKind === 'categorical' ? categories : undefined}
        columnDensity={args.columnDensity}
        stacking={args.stacking}
        xAxisTitle={args.xAxisTitle}
        yAxisTitle={args.yAxisTitle}
        showLegend={args.showLegend}
        colorPalette={args.colorPalette}
        dataLabels={args.dataLabels}
        series={[{ name: 'Value', data: primaryData }]}
        tooltip={{ kind: args.tooltip }}
        height={320}
      />
    );
  },
};
