import type { Meta, StoryObj } from '@storybook/react';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Bar } from '@visx/shape';
import { AxisBottom } from '@visx/axis';

const meta: Meta = {
  title: '02 visx/Bespoke/Camera Device Stats Motion Vis (Omaha team driver)',
  parameters: {
    docs: {
      description: {
        component:
          'Motion strip visualization: per-minute motion intensity bars colored by activity level, with custom 2-line axis ticks (date plus time). This was the named driver in STR-3906 for picking visx over Highcharts (per the inventory timeline). Production source: `Verkada-Web/src/command/ui/camera-page/routes/stats/components/device-analytics/motion/MotionVis.tsx`. Per the OSS Scout verification: Highcharts can deliver this, but the cost in custom formatter code is non-trivial, and React-state tooltips are markedly cleaner in visx.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const start = new Date('2026-05-15T00:00:00Z').getTime();
    const data: { t: number; intensity: number }[] = [];
    for (let i = 0; i < 144; i += 1) {
      const t = start + i * 10 * 60 * 1000;
      const hour = Math.floor((i * 10) / 60);
      const dayPeak = Math.max(0, Math.sin(((hour - 4) * Math.PI) / 18));
      const noise = Math.random() * 0.3;
      const intensity = Math.min(1, dayPeak + noise);
      data.push({ t, intensity });
    }
    const width = 720;
    const height = 200;
    const margin = { top: 12, right: 12, bottom: 48, left: 12 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const xScale = scaleTime<number>({
      domain: [new Date(data[0].t), new Date(data[data.length - 1].t)],
      range: [0, innerWidth],
    });
    const yScale = scaleLinear<number>({ domain: [0, 1], range: [innerHeight, 0] });
    const colorFor = (i: number) => {
      if (i < 0.2) return '#E5E7EB';
      if (i < 0.45) return '#93C5FD';
      if (i < 0.7) return '#3B82F6';
      return '#1D4ED8';
    };
    const barW = innerWidth / data.length - 1;
    return (
      <svg width={width} height={height} style={{ background: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
        <Group left={margin.left} top={margin.top}>
          {data.map((d, i) => (
            <Bar
              key={i}
              x={xScale(new Date(d.t)) ?? 0}
              y={yScale(d.intensity)}
              width={Math.max(1, barW)}
              height={innerHeight - yScale(d.intensity)}
              fill={colorFor(d.intensity)}
              rx={1}
            />
          ))}
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            stroke="#9CA3AF"
            tickStroke="#9CA3AF"
            numTicks={6}
            tickComponent={({ x, y, formattedValue }) => {
              const d = new Date(formattedValue ?? '');
              const date = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
              const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
              return (
                <g transform={`translate(${x},${y})`}>
                  <text textAnchor="middle" fontSize={11} fill="#111827" y={6}>
                    {time}
                  </text>
                  <text textAnchor="middle" fontSize={10} fill="#6B7280" y={20}>
                    {date}
                  </text>
                </g>
              );
            }}
          />
        </Group>
      </svg>
    );
  },
};
