import type { Meta, StoryObj } from '@storybook/react';
import { Group } from '@visx/group';
import { AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import { Bar } from '@visx/shape';

const meta: Meta = {
  title: '02 visx/Schedules/Alarms AI Schedule (horizontal bars)',
  parameters: {
    docs: {
      description: {
        component:
          'Horizontal-bar schedule (a row per day of week, colored intervals showing when the schedule is active). Item 9 in the inventory. Custom enough that Highcharts would need awkward configuration (gapped bars per category), trivial in visx. Production source: `Verkada-Web/src/command/alarms-v3/shared/components/schedule/horizontal-schedule-chart/HorizontalScheduleChart.tsx`. Verity primitive target: leave on visx (cluster 4 ergonomic win) or build a dedicated `ScheduleChart` primitive.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const schedule: Record<string, [number, number][]> = {
      Mon: [[18, 8]],
      Tue: [[18, 8]],
      Wed: [[18, 8]],
      Thu: [[18, 8]],
      Fri: [[18, 24]],
      Sat: [[0, 24]],
      Sun: [[0, 12]],
    };
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
