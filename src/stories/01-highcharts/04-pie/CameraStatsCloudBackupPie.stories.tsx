import type { Meta, StoryObj } from '@storybook/react';
import { PIE_DONUT_ARG_TYPES, INNER_RADIUS_MAP, type InnerRadiusSize } from '../../argTypes';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { PieDonutChart } from '../../../primitives/VeritySimPrimitives';
import { CHART_FONT_FAMILY } from '../../../primitives/chartColors';

const CLOUD_BACKUP_SEGMENTS = [
  { name: 'Backed up', y: 18.4, color: '#16a34a' },
  { name: 'Pending',   y: 2.8,  color: '#d97706' },
  { name: 'Failed',    y: 0.6,  color: '#dc2626' },
  { name: 'Skipped',   y: 2.2,  color: '#9ca3af' },
];
const TOTAL_GB = CLOUD_BACKUP_SEGMENTS.reduce((acc, s) => acc + s.y, 0);

const meta: Meta = {
  title: '01 Highcharts/Pie/Camera Stats Cloud Backup Donut',
  parameters: {
    docs: {
      description: {
        component:
          'Highcharts pie/donut rendition of the Camera Stats cloud backup chart. ' +
          'Production source: `Verkada-Web/src/command/ui/camera-page/routes/stats/components/device-analytics/single-camera-cloud-backup/CloudBackupPie.tsx`.\n\n' +
          '**Note on visx vs Highcharts:** The visx version (`02 visx/Pie and Calendar/Camera Stats Cloud Backup Pie`) uses a custom SVG with explicit pad-angle gaps between segments. ' +
          'Highcharts pie does not support pad-angle spacing natively; this story uses `borderWidth: 3` and `borderColor: #FFFFFF` to approximate the gap. ' +
          'For exact pixel parity the visx implementation is the reference. For the Verity primitive target, Highcharts is the implementation path.\n\n' +
          '**Verity primitive target:** `PieDonutChart` with `colorPalette="status"`. See the "After Verity Highcharts" story.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <PlaygroundChart
      options={{
        chart: { type: 'pie' },
        title: { text: '' },
        subtitle: {
          useHTML: true,
          text: `<div style="text-align:center;font-family:${CHART_FONT_FAMILY};line-height:1.3"><div style="font-size:22px;font-weight:700;color:#111827">${TOTAL_GB.toFixed(1)} GB</div><div style="font-size:11px;color:#6B7280;margin-top:2px">total</div></div>`,
          verticalAlign: 'middle',
          floating: true,
          y: 0,
        },
        legend: { enabled: true, align: 'center', verticalAlign: 'bottom' },
        tooltip: {
          useHTML: true,
          outside: true,
          pointFormat: '<b>{point.name}</b>: {point.y} GB ({point.percentage:.1f}%)',
        },
        plotOptions: {
          pie: {
            innerSize: '60%',
            showInLegend: true,
            borderWidth: 3,
            borderColor: '#FFFFFF',
            dataLabels: { enabled: false },
          },
        } as Highcharts.Options['plotOptions'],
        series: [{ type: 'pie', name: 'Storage', data: CLOUD_BACKUP_SEGMENTS }],
        credits: { enabled: false },
      }}
      height={320}
    />
  ),
};

type PieAfterArgs = {
  innerRadius: InnerRadiusSize;
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
    innerRadius: 'l',
    showLabels:  'hover',
    showLegend:  true,
    backedUp:    18.4,
    pending:     2.8,
    failed:      0.6,
    skipped:     2.2,
  },
  argTypes: {
    ...PIE_DONUT_ARG_TYPES,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Same chart using the simulated Verity `PieDonutChart` primitive. ' +
          '`colorPalette="status"` with `status` keys on each slice replaces the raw hex color assignments. ' +
          '`centerLabel` drives the donut hole text. No raw hex in consumer code.\n\n' +
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
  render: (args) => {
    const total = (args.backedUp + args.pending + args.failed + args.skipped).toFixed(1);
    return (
      <PieDonutChart
        slices={[
          { name: 'Backed up', y: args.backedUp, status: 'success' },
          { name: 'Pending',   y: args.pending,  status: 'warning' },
          { name: 'Failed',    y: args.failed,   status: 'danger'  },
          { name: 'Skipped',   y: args.skipped,  status: 'neutral' },
        ].filter((s) => s.y > 0)}
        colorPalette="status"
        innerRadius={INNER_RADIUS_MAP[args.innerRadius]}
        showLabels={args.showLabels}
        showLegend={args.showLegend}
        centerLabel={`${total} GB total`}
      />
    );
  },
};
