import type { Meta, StoryObj } from '@storybook/react';
import { Group } from '@visx/group';
import { PieDonutChart, AfterVerityPanel } from '../../../primitives/VeritySimPrimitives';

const meta: Meta = {
  title: '02 visx/Pie and Calendar/Camera Stats Cloud Backup Pie (custom donut)',
  parameters: {
    docs: {
      description: {
        component:
          'Custom donut with non-standard pad-angle gaps between segments. Per the inventory verification notes: this is the one case where Highcharts truly cannot deliver pixel parity. Highcharts pie does not support pad-angle gaps; achieving the look would require a custom SVG renderer hack. Production source: `Verkada-Web/src/command/ui/camera-page/routes/stats/components/device-analytics/single-camera-cloud-backup/CloudBackupPie.tsx`. Verity primitive target: legitimate `ExtendChart` escape hatch case, or stay on visx (cluster 4 capability win, the only one that actually holds up).',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: 'Default (visx custom SVG)',
  render: () => {
    const segments = [
      { label: 'Backed up', value: 18.4, color: '#22C55E' },
      { label: 'Pending', value: 2.8, color: '#F59E0B' },
      { label: 'Failed', value: 0.6, color: '#EF4444' },
      { label: 'Skipped', value: 2.2, color: '#9CA3AF' },
    ];
    const total = segments.reduce((s, x) => s + x.value, 0);
    const size = 240;
    const cx = size / 2;
    const cy = size / 2;
    const outerR = 100;
    const innerR = 70;
    const padAngleDeg = 4;
    const totalPadDeg = padAngleDeg * segments.length;
    const availableDeg = 360 - totalPadDeg;
    let cursor = -90;
    const arcs = segments.map((seg) => {
      const sweep = (seg.value / total) * availableDeg;
      const start = cursor;
      const end = start + sweep;
      cursor = end + padAngleDeg;
      const rad = (deg: number) => (deg * Math.PI) / 180;
      const xo1 = cx + outerR * Math.cos(rad(start));
      const yo1 = cy + outerR * Math.sin(rad(start));
      const xo2 = cx + outerR * Math.cos(rad(end));
      const yo2 = cy + outerR * Math.sin(rad(end));
      const xi1 = cx + innerR * Math.cos(rad(end));
      const yi1 = cy + innerR * Math.sin(rad(end));
      const xi2 = cx + innerR * Math.cos(rad(start));
      const yi2 = cy + innerR * Math.sin(rad(start));
      const largeArc = sweep > 180 ? 1 : 0;
      const d = [
        `M ${xo1} ${yo1}`,
        `A ${outerR} ${outerR} 0 ${largeArc} 1 ${xo2} ${yo2}`,
        `L ${xi1} ${yi1}`,
        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${xi2} ${yi2}`,
        'Z',
      ].join(' ');
      return { ...seg, d };
    });
    return (
      <div style={{ fontFamily: 'Inter, sans-serif' }}>
        <svg width={size} height={size} style={{ background: '#FFFFFF' }}>
          <Group>
            {arcs.map((a) => (
              <path key={a.label} d={a.d} fill={a.color} />
            ))}
            <text x={cx} y={cy - 4} textAnchor="middle" fontSize={28} fontWeight={600} fill="#111827">
              {total.toFixed(1)} GB
            </text>
            <text x={cx} y={cy + 16} textAnchor="middle" fontSize={12} fill="#6B7280">
              total
            </text>
          </Group>
        </svg>
        <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 12, color: '#374151' }}>
          {segments.map((s) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, background: s.color, borderRadius: 2 }} />
              {s.label}: {s.value} GB
            </div>
          ))}
        </div>
      </div>
    );
  },
};

type PieAfterArgs = {
  innerRadius: number;
  showLabels:  'always' | 'hover' | 'none';
  showLegend:  boolean;
  backedUp:    number;
  pending:     number;
  failed:      number;
  skipped:     number;
};

type AfterVerityStory = StoryObj<PieAfterArgs>;

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: PieDonutChart + status palette',
  args: {
    innerRadius: 60,
    showLabels:  'hover',
    showLegend:  true,
    backedUp:    18.4,
    pending:     2.8,
    failed:      0.6,
    skipped:     2.2,
  },
  argTypes: {
    innerRadius: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: '`innerRadius` — donut hole size as a 0–100 percentage. `0` = full pie, `60` = standard donut.',
    },
    showLabels: {
      control: 'inline-radio',
      options: ['always', 'hover', 'none'],
      description: '`showLabels` — when to render data labels.',
    },
    showLegend: { control: 'boolean', description: '`showLegend` — show legend below chart.' },
    backedUp: { control: { type: 'range', min: 0, max: 100, step: 0.1 }, description: 'Backed up (GB).', table: { category: 'Data' } },
    pending:  { control: { type: 'range', min: 0, max: 30,  step: 0.1 }, description: 'Pending (GB).',   table: { category: 'Data' } },
    failed:   { control: { type: 'range', min: 0, max: 10,  step: 0.1 }, description: 'Failed (GB).',    table: { category: 'Data' } },
    skipped:  { control: { type: 'range', min: 0, max: 20,  step: 0.1 }, description: 'Skipped (GB).',   table: { category: 'Data' } },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Same cloud backup breakdown using a Verity `PieDonutChart`. ' +
          '`colorPalette="status"` with per-slice `status` keys replaces the raw hex fills — no color literals in consumer code. ' +
          '`centerLabel` renders total GB in the donut hole via Highcharts subtitle.\n\n' +
          '**Gap vs. visx:** The visx version uses explicit pad-angle gaps (4°) between segments. ' +
          'Highcharts approximates this with `borderWidth: 3` and a white border — close but not pixel-identical. ' +
          'For exact gap fidelity keep the visx implementation; for Verity system parity use this primitive.\n\n' +
          '**Production source:** Camera Stats — single camera cloud backup (`src/command/ui/camera-page/routes/stats/components/device-analytics/single-camera-cloud-backup/CloudBackupPie.tsx`)',
      },
      source: {
        code: `<PieDonutChart
  slices={[
    { name: 'Backed up', y: 18.4, status: 'success' },
    { name: 'Pending',   y: 2.8,  status: 'warning' },
    { name: 'Failed',    y: 0.6,  status: 'danger'  },
    { name: 'Skipped',   y: 2.2,  status: 'neutral' },
  ]}
  colorPalette="status"
  innerRadius="60%"
  centerLabel="GB total"
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => (
    <AfterVerityPanel
      primitiveName="PieDonutChart"
      consumerCode={`<PieDonutChart
  slices={[
    { name: 'Backed up', y: 18.4, status: 'success' },
    { name: 'Pending',   y: 2.8,  status: 'warning' },
    { name: 'Failed',    y: 0.6,  status: 'danger'  },
    { name: 'Skipped',   y: 2.2,  status: 'neutral' },
  ]}
  colorPalette="status"
  innerRadius="60%"
  centerLabel="GB total"
/>`}
      source={{
        surface: 'Camera Stats — single camera cloud backup',
        file: 'src/command/ui/camera-page/routes/stats/components/device-analytics/single-camera-cloud-backup/CloudBackupPie.tsx',
      }}
    >
      <PieDonutChart
        slices={[
          { name: 'Backed up', y: args.backedUp, status: 'success' },
          { name: 'Pending',   y: args.pending,  status: 'warning' },
          { name: 'Failed',    y: args.failed,   status: 'danger'  },
          { name: 'Skipped',   y: args.skipped,  status: 'neutral' },
        ].filter((s) => s.y > 0)}
        colorPalette="status"
        innerRadius={`${args.innerRadius}%`}
        showLabels={args.showLabels}
        showLegend={args.showLegend}
        centerLabel="GB total"
      />
    </AfterVerityPanel>
  ),
};
