import type { Meta, StoryObj } from '@storybook/react';
import { ScheduleChart } from '../../primitives/VeritySimPrimitives';
import type { ScheduleDayEntry } from '../../primitives/VeritySimPrimitives';
import { SCHEDULE_ARG_TYPES } from '../argTypes';

// ─── Demo data ────────────────────────────────────────────────────────────────

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEFAULT_SCHEDULE: ScheduleDayEntry[] = [
  { day: 'Mon', intervals: [[18, 8]]  },
  { day: 'Tue', intervals: [[18, 8]]  },
  { day: 'Wed', intervals: [[18, 8]]  },
  { day: 'Thu', intervals: [[18, 8]]  },
  { day: 'Fri', intervals: [[18, 24]] },
  { day: 'Sat', intervals: [[0,  24]] },
  { day: 'Sun', intervals: [[0,  12]] },
];

// ─── Story types ──────────────────────────────────────────────────────────────

type Args = {
  showInactive:  boolean;
  pointWidth:    number;
  tooltip:       'enabled' | 'disabled';
  activeColor:   string;
  inactiveColor: string;
};

const meta: Meta<Args> = {
  title: '03 Verity Primitives/ScheduleChart',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Proposed Verity primitive for categorical time-range (schedule / Gantt-lite) charts. ' +
          'Each row represents a day (or other category), and horizontal bars show active time intervals.\n\n' +
          'This is **not a bar chart.** A bar chart encodes a single magnitude per category. ' +
          '`ScheduleChart` encodes zero or more time-range spans per category row — the underlying ' +
          'Highcharts type is `xrange`, the same engine used for Gantt diagrams.\n\n' +
          '**Key prop:** `schedule` is an array of `{ day, intervals: [startH, endH][] }` objects. ' +
          'Midnight-wrapping intervals (e.g. `[22, 6]`) are supported natively.\n\n' +
          '**Color contract:** `activeColor` defaults to `var(--vc-1)` (brand blue, `blue-600`). ' +
          '`inactiveColor` defaults to `var(--vc-neutral)` (grey, `neutral-400`). ' +
          'These are two discrete state tokens, not a palette — diverging or sequential palettes ' +
          'do not apply here.\n\n' +
          '**First consumer:** Alarms: AI Schedule editor ' +
          '(`src/command/alarms-v3/shared/components/schedule/horizontal-schedule-chart/HorizontalScheduleChart.tsx`). ' +
          'Current production implementation uses a custom visx SVG. ' +
          'The Verity primitive wraps Highcharts `xrange` and handles midnight-wrapping, hover tooltips, and row sizing behind a clean prop interface.',
      },
    },
  },
  argTypes: { ...SCHEDULE_ARG_TYPES },
};

export default meta;
type Story = StoryObj<Args>;

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  args: {
    showInactive:  true,
    pointWidth:    18,
    tooltip:       'enabled',
    activeColor:   '#226ecd',
    inactiveColor: '#a0adb8',
  },
  render: (args) => (
    <ScheduleChart
      days={DAYS}
      schedule={DEFAULT_SCHEDULE}
      showInactive={args.showInactive}
      pointWidth={args.pointWidth}
      tooltip={args.tooltip}
      activeColor={args.activeColor}
      inactiveColor={args.inactiveColor}
    />
  ),
};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const ActiveOnlyNoInactive: Story = {
  name: 'Active bars only (showInactive=false)',
  parameters: {
    docs: {
      description: {
        story: 'With `showInactive={false}` the chart only renders colored bars for active intervals. The background is empty for inactive hours. Useful when the chart is compact or the empty-state context is obvious from surrounding UI.',
      },
    },
  },
  render: () => (
    <ScheduleChart
      days={DAYS}
      schedule={DEFAULT_SCHEDULE}
      showInactive={false}
    />
  ),
};

export const AllDay: Story = {
  name: 'Always-on schedule (24/7)',
  parameters: {
    docs: {
      description: {
        story: 'Every day is fully active (`[0, 24]`). No inactive gaps are rendered even when `showInactive` is on.',
      },
    },
  },
  render: () => (
    <ScheduleChart
      days={DAYS}
      schedule={DAYS.map((day) => ({ day, intervals: [[0, 24]] as [number, number][] }))}
    />
  ),
};

export const BusinessHoursOnly: Story = {
  name: 'Business-hours schedule',
  parameters: {
    docs: {
      description: {
        story: 'Active 09:00–17:00 Mon–Fri only. Sat and Sun have no active intervals; if `showInactive` is on, the full row renders in grey.',
      },
    },
  },
  render: () => (
    <ScheduleChart
      days={DAYS}
      schedule={[
        { day: 'Mon', intervals: [[9, 17]] },
        { day: 'Tue', intervals: [[9, 17]] },
        { day: 'Wed', intervals: [[9, 17]] },
        { day: 'Thu', intervals: [[9, 17]] },
        { day: 'Fri', intervals: [[9, 17]] },
      ]}
    />
  ),
};

export const MultipleIntervals: Story = {
  name: 'Multiple intervals per day',
  parameters: {
    docs: {
      description: {
        story: 'Each day can have multiple disjoint active windows. Common for alarm schedules with different active times in the morning and evening.',
      },
    },
  },
  render: () => (
    <ScheduleChart
      days={DAYS}
      schedule={[
        { day: 'Mon', intervals: [[6, 9], [17, 22]] },
        { day: 'Tue', intervals: [[6, 9], [17, 22]] },
        { day: 'Wed', intervals: [[6, 9], [17, 22]] },
        { day: 'Thu', intervals: [[6, 9], [17, 22]] },
        { day: 'Fri', intervals: [[6, 9], [17, 23]] },
        { day: 'Sat', intervals: [[8, 23]] },
        { day: 'Sun', intervals: [[8, 20]] },
      ]}
    />
  ),
};
