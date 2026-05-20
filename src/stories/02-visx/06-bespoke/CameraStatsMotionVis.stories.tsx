import type { Meta, StoryObj } from '@storybook/react';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Bar } from '@visx/shape';
import { AxisBottom } from '@visx/axis';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { PALETTE_HEX, type ColorPalette } from '../../../primitives/VeritySimPrimitives';

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

// ─── After Verity Highcharts ──────────────────────────────────────────────────

// Deterministic noise so the bar pattern is stable across re-renders.
const seededNoise = (i: number) => ((Math.sin(i * 2.3) * 0.5 + 0.5) * 0.3);

type MotionAfterArgs = {
  colorPalette: ColorPalette;
  numBuckets:   2 | 4 | 8;
  tooltip:      'enabled' | 'disabled';
};
type AfterVerityStory = StoryObj<MotionAfterArgs>;

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: MotionVis via column + per-point color',
  args: {
    colorPalette: 'sequential',
    numBuckets:   4,
    tooltip:      'enabled',
  },
  argTypes: {
    colorPalette: {
      control: 'inline-radio',
      options: ['categorical', 'sequential', 'diverging', 'status'],
      description: '`colorPalette?: ColorPalette` — palette applied to intensity buckets. `sequential` (light→dark blue) is the natural fit for motion intensity data.',
      table: { type: { summary: 'ColorPalette' }, defaultValue: { summary: '"sequential"' } },
    },
    numBuckets: {
      control: 'inline-radio',
      options: [2, 4, 8],
      description: '`numBuckets?: 2 | 4 | 8` — number of color buckets mapped across the 0–1 intensity range.',
      table: { type: { summary: '2 | 4 | 8' }, defaultValue: { summary: '4' } },
    },
    tooltip: {
      control: 'inline-radio',
      options: ['enabled', 'disabled'],
      description: 'Show per-bar tooltip with timestamp and intensity value.',
      table: { type: { summary: '"enabled" | "disabled"' }, defaultValue: { summary: '"enabled"' } },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Highcharts `column` migration of the motion intensity strip. Each bar gets a per-point `color` override by bucketing its 0–1 intensity value into the chosen Verity palette. The 2-line date/time axis ticks are reproduced via `labels.useHTML: true` — this is the "non-trivial custom formatter" cost cited in the inventory as a visx advantage for this surface.\n\n' +
          '**Proposed primitive:** `HeatmapColumnChart` with `numBuckets` and `colorPalette` props. The transform (intensity → bucket → color) would be encapsulated inside the primitive, keeping consumer code hex-free.\n\n' +
          '**Production source:** Camera Device Stats: Motion Vis (`src/command/ui/camera-page/routes/stats/components/device-analytics/motion/MotionVis.tsx`)',
      },
      source: {
        code: `<HeatmapColumnChart
  data={motionData}        // [{ t: timestamp, value: 0–1 }]
  colorPalette="sequential"
  numBuckets={4}
  tooltip={{ kind: 'enabled' }}
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => {
    const start = new Date('2026-05-15T00:00:00Z').getTime();
    const palette = PALETTE_HEX[args.colorPalette];
    const seriesData: Highcharts.PointOptionsObject[] = [];
    for (let i = 0; i < 144; i++) {
      const t = start + i * 10 * 60 * 1000;
      const hour = Math.floor((i * 10) / 60);
      const dayPeak = Math.max(0, Math.sin(((hour - 4) * Math.PI) / 18));
      const intensity = Math.min(1, dayPeak + seededNoise(i));
      const bucketIdx = Math.min(args.numBuckets - 1, Math.floor(intensity * args.numBuckets));
      // Scale bucket index linearly across the full palette so the highest
      // bucket always maps to the darkest color, regardless of numBuckets.
      const paletteIdx = Math.round((bucketIdx / Math.max(1, args.numBuckets - 1)) * (palette.length - 1));
      seriesData.push({ x: t, y: intensity, color: palette[paletteIdx] });
    }
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'column' },
          title: { text: '' },
          xAxis: {
            type: 'datetime',
            tickAmount: 6,
            title: { text: '' },
            labels: {
              useHTML: true,
              formatter: function () {
                const d = new Date(this.value as number);
                const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
                const date = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                return `<div style="text-align:center;font-size:11px;line-height:1.5"><span style="color:#1a1d23">${time}</span><br><span style="font-size:10px;color:#6b7280">${date}</span></div>`;
              },
            },
          },
          yAxis: {
            min: 0,
            max: 1,
            labels: { enabled: false },
            title: { text: '' },
            gridLineWidth: 0,
          },
          legend: { enabled: false },
          tooltip:
            args.tooltip === 'disabled'
              ? { enabled: false }
              : {
                  useHTML: true,
                  formatter: function () {
                    const d = new Date(this.point.x!);
                    const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                    return `<b>${time}</b>: ${((this.point.y ?? 0) * 100).toFixed(0)}% intensity`;
                  },
                  outside: true,
                },
          plotOptions: {
            column: {
              pointPadding: 0,
              groupPadding: 0,
              borderWidth: 0,
              borderRadius: 1,
            },
          },
          series: [{ type: 'column', name: 'Motion intensity', data: seriesData }],
          credits: { enabled: false },
        }}
      />
    );
  },
};
