import type { Meta, StoryObj } from '@storybook/react';
import { Gauge } from '../../primitives/VeritySimPrimitives';
import { GAUGE_ARG_TYPES } from '../argTypes';

type Args = {
  value:       number;
  min:         number;
  max:         number;
  unit:        string;
  centerLabel: string;
  thickness:   'thin' | 'normal' | 'thick';
  gaugeType:   'solid' | 'arc';
  goodAt:      number;
  warnAt:      number;
};

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
    ...GAUGE_ARG_TYPES,
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {
  args: {
    value:       73,
    min:         0,
    max:         100,
    unit:        '%',
    centerLabel: 'Camera uptime',
    thickness:   'normal',
    gaugeType:   'solid',
    goodAt:      85,
    warnAt:      50,
  },
  render: (args) => (
    <Gauge
      value={args.value}
      min={args.min}
      max={args.max}
      unit={args.unit}
      centerLabel={args.centerLabel}
      thickness={args.thickness}
      gaugeType={args.gaugeType}
      thresholds={{ warn: args.warnAt, good: args.goodAt }}
    />
  ),
};
