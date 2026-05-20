import type { Meta, StoryObj } from '@storybook/react';
import { Group } from '@visx/group';
import { AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import { Bar } from '@visx/shape';
import Highcharts from 'highcharts';
import xrangeModule from 'highcharts/modules/xrange';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';



// Initialize xrange once at module load
xrangeModule(Highcharts);

const meta: Meta = {
  title: '02 visx/Schedules/Alarms AI Schedule (horizontal bars)',
  parameters: {
    docs: {
      description: {
        component:
          'Horizontal-bar schedule (a row per day of week, colored intervals showing when the schedule is active). Item 9 in the inventory. Production source: `Verkada-Web/src/command/alarms-v3/shared/components/schedule/horizontal-schedule-chart/HorizontalScheduleChart.tsx`.\n\n' +
          '**Migration path:** Highcharts `xrange` chart type handles arbitrary intervals per category with zero hacks — including midnight-wrapping. See the **After Verity Highcharts** story for a drop-in replacement. In the Verity design system this would become a dedicated `ScheduleChart` primitive wrapping `xrange`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

// ─── Shared schedule data ─────────────────────────────────────────────────────

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SCHEDULE: Record<string, [number, number][]> = {
  Mon: [[18, 8]],
  Tue: [[18, 8]],
  Wed: [[18, 8]],
  Thu: [[18, 8]],
  Fri: [[18, 24]],
  Sat: [[0, 24]],
  Sun: [[0, 12]],
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => {
    const days = DAYS;
    const schedule = SCHEDULE;
    const width = 640;
    const height = 240;
    const margin = { top: 16, right: 16, bottom: 36, left: 48 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const xScale = scaleLinear<number>({ domain: [0, 24], range: [0, innerWidth] });
    const yScale = scaleBand<string>({ domain: days, range: [0, innerHeight], padding: 0.25 });
    const bandH = yScale.bandwidth();
    return (
      <svg width={width} height={height} style={{ background: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
        <Group left={margin.left} top={margin.top}>
          {days.map((day) => {
            const y = yScale(day) ?? 0;
            const intervals = schedule[day] ?? [];
            return (
              <g key={day}>
                <Bar x={0} y={y} width={innerWidth} height={bandH} fill="#F3F4F6" rx={4} />
                {intervals.map(([startH, endH], i) => {
                  if (endH <= startH) {
                    const w1 = xScale(24) - xScale(startH);
                    const w2 = xScale(endH);
                    return (
                      <g key={`${day}-${i}`}>
                        <Bar x={xScale(startH)} y={y} width={w1} height={bandH} fill="#3B82F6" rx={4} />
                        <Bar x={0} y={y} width={w2} height={bandH} fill="#3B82F6" rx={4} />
                      </g>
                    );
                  }
                  return (
                    <Bar
                      key={`${day}-${i}`}
                      x={xScale(startH)}
                      y={y}
                      width={xScale(endH) - xScale(startH)}
                      height={bandH}
                      fill="#3B82F6"
                      rx={4}
                    />
                  );
                })}
                <text x={-8} y={y + bandH / 2} textAnchor="end" dy="0.32em" fontSize={11} fill="#374151">
                  {day}
                </text>
              </g>
            );
          })}
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            stroke="#9CA3AF"
            tickStroke="#9CA3AF"
            tickValues={[0, 4, 8, 12, 16, 20, 24]}
            tickFormat={(v) => `${v}:00`}
            tickLabelProps={() => ({ fill: '#374151', fontSize: 11, textAnchor: 'middle' })}
          />
        </Group>
      </svg>
    );
  },
};

// ─── After Verity Highcharts ──────────────────────────────────────────────────

const H = 3_600_000; // ms per hour

/**
 * Convert normalized [startH, endH] pairs into xrange points for one series.
 * Midnight-wrapping intervals (endH < startH) are split into two segments.
 */
function intervalsToPoints(
  intervals: [number, number][],
  yi: number,
): Highcharts.XrangePointOptionsObject[] {
  const pts: Highcharts.XrangePointOptionsObject[] = [];
  for (const [startH, endH] of intervals) {
    if (endH > startH) {
      pts.push({ x: startH * H, x2: endH * H, y: yi });
    } else {
      pts.push({ x: startH * H, x2: 24 * H, y: yi });
      if (endH > 0) pts.push({ x: 0, x2: endH * H, y: yi });
    }
  }
  return pts;
}

/**
 * Return the inactive (gap) intervals within [0, 24] for a given set of
 * active intervals (after midnight-wrapping is expanded).
 */
function inactiveIntervals(active: [number, number][]): [number, number][] {
  // Expand any midnight-wrapping into [0,24]-normalized pairs
  const norm: [number, number][] = [];
  for (const [s, e] of active) {
    if (e > s) norm.push([s, e]);
    else { norm.push([s, 24]); if (e > 0) norm.push([0, e]); }
  }
  norm.sort((a, b) => a[0] - b[0]);
  const gaps: [number, number][] = [];
  let cursor = 0;
  for (const [s, e] of norm) {
    if (s > cursor) gaps.push([cursor, s]);
    cursor = Math.max(cursor, e);
  }
  if (cursor < 24) gaps.push([cursor, 24]);
  return gaps;
}

type ScheduleAfterArgs = {
  showInactive: boolean;
  pointWidth:   number;
  tooltip:      'enabled' | 'disabled';
};
type AfterVerityStory = StoryObj<ScheduleAfterArgs>;

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: ScheduleChart via xrange (single series)',
  args: {
    showInactive: true,
    pointWidth:   18,
    tooltip:      'enabled',
  },
  argTypes: {
    showInactive: {
      control: 'boolean',
      description: '`showInactive?: boolean` — render grey bars for inactive hours. Proposed `ScheduleChart` prop.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    pointWidth: {
      control: { type: 'range', min: 8, max: 32, step: 2 },
      description: '`pointWidth?: number` — row height in pixels. Maps `plotOptions.xrange.pointWidth`.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '18' } },
    },
    tooltip: {
      control: 'inline-radio',
      options: ['enabled', 'disabled'],
      description: '`tooltip?: "enabled" | "disabled"` — show active-interval tooltip on hover.',
      table: { type: { summary: '"enabled" | "disabled"' }, defaultValue: { summary: '"enabled"' } },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Same schedule using Highcharts `xrange`. ' +
          'Active intervals use `--vc-1` (brand blue), inactive gaps use `--vc-neutral` (grey). ' +
          'Both live in a **single xrange series** with per-point `color` override — this eliminates the vertical grouping offset that appears when two series share the same y-axis rows.\n\n' +
          '**Color tokens:** `--vc-1` (`#2563eb`) for active, `--vc-neutral` (`#9ca3af`) for inactive. Not the diverging palette — diverging is a 5-stop red→grey→blue scale for above/below-baseline data. This is a binary state chart (on/off), so two semantic tokens are the right call.\n\n' +
          'In the Verity primitive layer this ships as `ScheduleChart` with `activeColor` and `inactiveColor` props, hiding the xrange transform entirely.\n\n' +
          '**Production source:** Alarms: AI Schedule editor (`src/command/alarms-v3/shared/components/schedule/horizontal-schedule-chart/HorizontalScheduleChart.tsx`)',
      },
      source: {
        code: `<ScheduleChart
  days={['Mon','Tue','Wed','Thu','Fri','Sat','Sun']}
  schedule={[
    { day: 'Mon', intervals: [[18, 8]]  },
    { day: 'Tue', intervals: [[18, 8]]  },
    { day: 'Wed', intervals: [[18, 8]]  },
    { day: 'Thu', intervals: [[18, 8]]  },
    { day: 'Fri', intervals: [[18, 24]] },
    { day: 'Sat', intervals: [[0,  24]] },
    { day: 'Sun', intervals: [[0,  12]] },
  ]}
  activeColor="var(--vc-1)"
  inactiveColor="var(--vc-neutral)"
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => {
    const ACTIVE_COLOR   = '#226ecd'; // var(--vc-1)    blue-600
    const INACTIVE_COLOR = '#838e98'; // var(--vc-neutral) neutral-400

    const allPoints: Highcharts.XrangePointOptionsObject[] = [];
    DAYS.forEach((day, yi) => {
      const active = SCHEDULE[day] ?? [];
      for (const pt of intervalsToPoints(active, yi)) {
        allPoints.push({ ...pt, color: ACTIVE_COLOR });
      }
      if (args.showInactive) {
        for (const pt of intervalsToPoints(inactiveIntervals(active), yi)) {
          allPoints.push({ ...pt, color: INACTIVE_COLOR });
        }
      }
    });

    return (
      <PlaygroundChart
        height={260}
        options={{
          chart: { type: 'xrange' },
          title: { text: '' },
          xAxis: {
            min: 0,
            max: 24 * H,
            type: 'datetime',
            dateTimeLabelFormats: { hour: '%H:%M', day: '%H:%M' },
            tickPositions: [0, 4, 8, 12, 16, 20, 24].map((h) => h * H),
            title: { text: '' },
          },
          yAxis: {
            categories: DAYS,
            reversed: true,
            title: { text: '' },
            gridLineWidth: 0,
          },
          legend: { enabled: false },
          tooltip: args.tooltip === 'disabled'
            ? { enabled: false }
            : {
                useHTML: true,
                formatter: function () {
                  const pt = this.point as { x: number; x2: number; y: number; color: string };
                  if (pt.color === INACTIVE_COLOR) return false as unknown as string;
                  const day    = DAYS[pt.y ?? 0];
                  const startH = Math.round((pt.x  ?? 0) / H);
                  const endH   = Math.round((pt.x2 ?? 0) / H);
                  return `<b>${day}</b>: ${String(startH).padStart(2, '0')}:00 – ${String(endH).padStart(2, '0')}:00`;
                },
                outside: true,
              },
          plotOptions: {
            xrange: {
              borderRadius: 4,
              pointWidth: args.pointWidth,
              dataLabels: { enabled: false },
            },
          } as Highcharts.PlotOptions,
          series: [
            {
              type: 'xrange',
              name: 'Schedule',
              data: allPoints,
            },
          ],
          credits: { enabled: false },
        }}
      />
    );
  },
};
