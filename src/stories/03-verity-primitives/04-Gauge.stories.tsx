import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../primitives/PlaygroundChart';

type Args = {
  value: number;
  min: number;
  max: number;
  unit: string;
  centerLabel: string;
  thickness: 'thin' | 'normal' | 'thick';
  gaugeType: 'solid' | 'arc';
  goodAt: number;
  warnAt: number;
};

const THICKNESS_MAP = { thin: '85%', normal: '75%', thick: '60%' } as const;

const meta: Meta<Args> = {
  title: '03 Verity Primitives/Gauge',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Proposed Verity primitive for solidgauge donut visualizations with a center HTML label. Covers Connect Box camera uptime gauges, advanced cameras gauge, and Unite incident solidgauge. Excludes the literal `gauge` clock face (Unite Elapsed Time Clock), which stays in the escape hatch as a one-off.\n\n' +
          '**Production sources:** Connect Box stats — camera uptime, advanced cameras gauge (`src/command/connectors/`); Unite incident SolidGauge (`src/command/unite/`).\n\n' +
          '**Design note:** `centerLabel` accepts ReactNode so consumers write JSX rather than HTML strings. Open question: should `bands` accept arbitrary stops, or stay constrained to the 3-stop pattern observed in all 4 production files?',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: '`value: number` — maps `series[0].data[0]`.',
      table: { type: { summary: 'number' } },
    },
    min: {
      control: { type: 'number', min: 0, max: 100 },
      description: '`min?: number` (default 0) — maps `yAxis.min`.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    max: {
      control: { type: 'number', min: 0, max: 1000 },
      description: '`max?: number` (default 100) — maps `yAxis.max`.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '100' } },
    },
    unit: {
      control: 'text',
      description: '`unit?: string` — label suffix shown below the value.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '"%"' } },
    },
    centerLabel: {
      control: 'text',
      description: '`centerLabel?: string` — text rendered inside the donut hole. Accepts ReactNode in production; primitive internally calls `renderToString`.',
      table: { type: { summary: 'string | ReactNode' } },
    },
    thickness: {
      control: 'inline-radio',
      options: ['thin', 'normal', 'thick'],
      description: '`thickness?: "thin" | "normal" | "thick"` — maps `plotOptions.solidgauge.innerRadius`. Presets: thin → 85%, normal → 75%, thick → 60%.',
      table: { type: { summary: '"thin" | "normal" | "thick"' }, defaultValue: { summary: '"normal"' } },
    },
    gaugeType: {
      control: 'inline-radio',
      options: ['solid', 'arc'],
      description: '`gaugeType?: "solid" | "arc"` — `solid` = filled solidgauge (all 4 current consumers); `arc` = needle-style gauge (escape hatch for ElapsedTimeClock).',
      table: { type: { summary: '"solid" | "arc"' }, defaultValue: { summary: '"solid"' } },
    },
    goodAt: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: '`bands?: { from, to, color }[]` (demo control) — the threshold above which the gauge is "good". Maps to `yAxis.stops`.',
      table: { type: { summary: '{ from: number; to: number; color: StatusKey }[]' } },
    },
    warnAt: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: '`bands?` (demo control) — the threshold above which the gauge is "warning" (below = danger). Maps to `yAxis.stops`.',
      table: { type: { summary: '{ from: number; to: number; color: StatusKey }[]' } },
    },
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {
  args: { value: 73, min: 0, max: 100, unit: '%', centerLabel: 'Camera uptime', thickness: 'normal', gaugeType: 'solid', goodAt: 85, warnAt: 50 },
  render: (args) => {
    const innerRadius = THICKNESS_MAP[args.thickness];
    const isArc = args.gaugeType === 'arc';
    return (
      <PlaygroundChart
        options={{
          chart: { type: isArc ? 'gauge' : 'solidgauge', backgroundColor: 'transparent' },
          title: { text: '' },
          pane: {
            center: ['50%', '60%'],
            size: '100%',
            startAngle: -120,
            endAngle: 120,
            background: isArc ? [] : [
              { backgroundColor: '#E5E7EB', innerRadius, outerRadius: '100%', shape: 'arc' },
            ],
          },
          yAxis: {
            min: args.min,
            max: args.max,
            stops: [
              [0, '#EF4444'],
              [args.warnAt / args.max, '#F59E0B'],
              [args.goodAt / args.max, '#22C55E'],
            ] as Array<[number, string]>,
            tickPositions: isArc ? undefined : [],
            labels: { enabled: isArc },
          },
          tooltip: { enabled: false },
          credits: { enabled: false },
          plotOptions: {
            solidgauge: {
              dataLabels: {
                enabled: true,
                useHTML: true,
                y: -20,
                formatter: function () {
                  return `<div style="text-align:center;font-family:Inter,sans-serif"><div style="font-size:48px;font-weight:700">${this.y}${args.unit}</div><div style="font-size:14px;color:#6B7280;margin-top:4px">${args.centerLabel}</div></div>`;
                },
              },
              innerRadius,
              radius: '100%',
            },
          } as Highcharts.PlotOptions,
          series: [{ type: isArc ? 'gauge' : 'solidgauge', name: args.centerLabel, data: [args.value] }],
        }}
        height={320}
      />
    );
  },
};
