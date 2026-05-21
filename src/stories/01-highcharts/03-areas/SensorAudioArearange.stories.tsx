import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { AreaChart, type ColorPalette } from '../../../primitives/VeritySimPrimitives';
import { fakeArearange, fakeTimeSeries } from '../../../utils/fakeData';
import { AREA_ARG_TYPES } from '../../argTypes';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Areas/Sensor Audio (arearange min/max envelope)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Min/max envelope visualization using `arearange`. The audio sensor chart shows the noise floor range per time bucket rather than a single value. Production source: `Verkada-Web/src/command/sensors/components/sensor-highcharts/hooks/useSensorHighchartsDataSeries.tsx` (audio branch). Verity primitive target: `AreaChart` with `kind: \'range\'` variant.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;
type AreaArgs = {
  variant: 'area' | 'areaspline' | 'arearange';
  stacking: 'normal' | 'percent' | 'none';
  fillOpacity: number;
  xAxisTitle: string;
  yAxisTitle: string;
  showLegend: boolean;
  tooltip: 'shared-crosshair' | 'point' | 'disabled';
  colorPalette: ColorPalette;
};
type AfterVerityStory = StoryObj<AreaArgs>;

export const Default: Story = {
  render: () => {
    const data = fakeArearange({ count: 192, base: 42, spread: 18, noise: 3 });
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'arearange' },
          title: { text: 'Ambient noise (dB), last 16 hours' },
          xAxis: { type: 'datetime', crosshair: true },
          yAxis: { title: { text: 'dB' } },
          legend: { enabled: false },
          tooltip: { useHTML: true, shared: true, outside: true },
          plotOptions: {
            arearange: {
              fillOpacity: 0.35,
              lineWidth: 1,
              color: '#0EA5E9',
            },
          },
          series: [{ type: 'arearange', name: 'dB range', data }],
        }}
      />
    );
  },
};

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: AreaChart variant="arearange"',
  args: { variant: 'arearange', stacking: 'none', fillOpacity: 0.35, xAxisTitle: '', yAxisTitle: 'dB', showLegend: false, tooltip: 'point', colorPalette: 'categorical' },
  argTypes: {
    variant:      AREA_ARG_TYPES.variant,
    stacking:     AREA_ARG_TYPES.stacking,
    fillOpacity:  AREA_ARG_TYPES.fillOpacity,
    xAxisTitle:   AREA_ARG_TYPES.xAxisTitle,
    yAxisTitle:   AREA_ARG_TYPES.yAxisTitle,
    showLegend:   AREA_ARG_TYPES.showLegend,
    tooltip:      AREA_ARG_TYPES.tooltip,
    colorPalette: AREA_ARG_TYPES.colorPalette,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Same chart as a Verity `AreaChart`. `variant="arearange"` renders the min/max noise envelope. Color comes from `colorPalette="categorical"` (default `--vc-1`, brand blue) — not sequential, because this is a single-series envelope with no magnitude ordering across series. Sequential palette assigns `--vs-1` (near-white) to the first series, making it nearly invisible against a light background.\n\n**Production source:** Sensors: Audio arearange (`src/command/sensors/components/sensor-highcharts/hooks/useSensorHighchartsDataSeries.tsx`)',
      },
      source: {
        code: `<AreaChart
  variant="arearange"
  colorPalette="categorical"
  series={[{
    name: 'dB range',
    data: noiseData,  // [ts, lo, hi][]
  }]}
  fillOpacity={0.35}
  tooltip={{ kind: 'point' }}
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => {
    const rangeData = fakeArearange({ count: 192, base: 42, spread: 18, noise: 3 });
    const lineData  = fakeTimeSeries({ count: 96, base: 42, amplitude: 8, noise: 2 });
    const stackedA  = fakeTimeSeries({ count: 96, base: 25, amplitude: 6, noise: 2, seed: 1 });
    const stackedB  = fakeTimeSeries({ count: 96, base: 17, amplitude: 4, noise: 2, seed: 2 });
    const isRange   = args.variant === 'arearange';
    const isStacked = args.stacking !== 'none' && !isRange;
    return (
      <AreaChart
        variant={args.variant}
        stacking={args.stacking}
        fillOpacity={args.fillOpacity}
        xAxisTitle={args.xAxisTitle}
        yAxisTitle={args.yAxisTitle}
        colorPalette={args.colorPalette}
        showLegend={isStacked ? true : args.showLegend}
        series={
          isRange
            ? [{ name: 'dB range', data: rangeData as [number, number, number][] }]
            : isStacked
              ? [
                  { name: 'Channel A', data: stackedA as [number, number][] },
                  { name: 'Channel B', data: stackedB as [number, number][] },
                ]
              : [{ name: 'dB', data: lineData as [number, number][] }]
        }
        tooltip={{ kind: args.tooltip }}
      />
    );
  },
};
