import type { Meta, StoryObj } from '@storybook/react';
import { Sparkline, type ColorPalette } from '../../primitives/VeritySimPrimitives';
import { fakeTimeSeries } from '../../utils/fakeData';

type Args = {
  type: 'line' | 'area';
  height: number;
  width: number;
  colorPalette: ColorPalette;
  showLatestValue: boolean;
  caption: string;
  unit: string;
};

const meta: Meta<Args> = {
  title: '03 Verity Primitives/Sparkline',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Proposed Verity primitive for inline mini-charts. Designed to embed in DataTable cells or metric cards. Takes no `BaseChartProps` (no title, no legend, no export). Fixed `width` and `height` props; ignores responsive breakpoints.\n\n' +
          '**Production sources:** Live Bandwidth (device metrics card); Camera Network Indicator (camera grid cell); Camera Stats Battery (camera detail panel); Gateway Throughput sparkline.\n\n' +
          '**Design note:** Spec `type` accepts `"line"` or `"column"`. This simulation uses `"line"` and `"area"` because the production uses are all area-style; a column sparkline variant can be added when needed.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['line', 'area'],
      description: '`type?: "line" | "area"` — line renders without fill; area renders filled. Spec also reserves `"column"` for future use.',
      table: { type: { summary: '"line" | "area"' }, defaultValue: { summary: '"area"' } },
    },
    colorPalette: {
      control: 'inline-radio',
      options: ['categorical', 'sequential', 'diverging', 'status'],
      description: '`colorPalette?: ColorPalette` — drives the series color from `palette[0]`. Overridden by `status` if set.',
      table: { type: { summary: 'ColorPalette' }, defaultValue: { summary: '"categorical"' } },
    },
    height: {
      control: { type: 'range', min: 24, max: 120, step: 4 },
      description: '`height?: number` (default 56) — fixed pixel height. No responsive override.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '56' } },
    },
    width: {
      control: { type: 'range', min: 80, max: 480, step: 8 },
      description: '`width?: number` (default 240) — fixed pixel width. No responsive override.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '240' } },
    },
    showLatestValue: {
      control: 'boolean',
      description: '`showEndpoint?: boolean` (spec) — highlights the last data point with a value callout.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    caption: {
      control: 'text',
      description: '`label: string` (sim card wrapper) — shown above the sparkline as the metric name.',
      table: { type: { summary: 'string' } },
    },
    unit: {
      control: 'text',
      description: '`unit?: string` — displayed after the latest value.',
      table: { type: { summary: 'string' } },
    },
    trend: {
      control: false,
      description: '`trend?: "up" | "down" | "flat"` — auto-computed from data if omitted. Drives directional color on the latest value.',
      table: { type: { summary: '"up" | "down" | "flat"' }, category: 'Proposed API' },
    },
    status: {
      control: false,
      description: '`status?: "success" | "warning" | "danger" | "neutral"` — overrides `colorPalette` with a semantic status token.',
      table: { type: { summary: 'StatusKey' }, category: 'Proposed API' },
    },
  },
};
export default meta;

type Story = StoryObj<Args>;

const DEMO_DATA = fakeTimeSeries({ count: 72, base: 12.8, amplitude: 6, noise: 1.5, seed: 7 });

export const Playground: Story = {
  args: { type: 'area', colorPalette: 'categorical', height: 56, width: 240, showLatestValue: true, caption: 'Live bandwidth', unit: ' Mbps' },
  render: (args) => (
    <Sparkline
      data={DEMO_DATA}
      type={args.type}
      colorPalette={args.colorPalette}
      height={args.height}
      width={args.width}
      showLatestValue={args.showLatestValue}
      caption={args.caption}
      unit={args.unit}
    />
  ),
};
