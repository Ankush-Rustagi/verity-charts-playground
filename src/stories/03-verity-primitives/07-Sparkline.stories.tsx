import type { Meta, StoryObj } from '@storybook/react';
import { Sparkline, type ColorPalette } from '../../primitives/VeritySimPrimitives';
import { fakeTimeSeries } from '../../utils/fakeData';
import { SPARKLINE_ARG_TYPES } from '../argTypes';

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
    ...SPARKLINE_ARG_TYPES,
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
