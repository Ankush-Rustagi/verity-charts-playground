import type { Meta, StoryObj } from '@storybook/react';
import { PieDonutChart } from '../../primitives/VeritySimPrimitives';
import { PIE_DONUT_ARG_TYPES, INNER_RADIUS_MAP, type InnerRadiusSize } from '../argTypes';

type Args = {
  innerRadius:  InnerRadiusSize;
  showLabels:   'always' | 'hover' | 'none';
  showLegend:   boolean;
  maxSlices:    number;
  backedUp:     number;
  pending:      number;
  failed:       number;
  skipped:      number;
};

const meta: Meta<Args> = {
  title: '03 Verity Primitives/PieDonutChart',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Proposed Verity primitive for pie and donut charts. Covers proportional part-to-whole composition charts with optional donut hole, center label, and status-semantic slice coloring.\n\n' +
          '**First consumer:** Camera Stats cloud backup donut (`src/command/ui/camera-page/routes/stats/components/device-analytics/single-camera-cloud-backup/CloudBackupPie.tsx`). ' +
          'Current production implementation uses a custom visx SVG with pad-angle gaps; the Verity primitive is a close functional match via Highcharts.\n\n' +
          '**Design note:** `colorPalette="status"` plus per-slice `status` keys is the idiomatic path for state-based charts (backed up / pending / failed / skipped → success / warning / danger / neutral). ' +
          '`maxSlices` collapses long tail slices into "Other" — useful for per-user or per-camera top-N breakdowns.',
      },
    },
  },
  argTypes: {
    ...PIE_DONUT_ARG_TYPES,
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {
  args: {
    innerRadius: 'l',
    showLabels:  'hover',
    showLegend:  true,
    maxSlices:   8,
    backedUp:    18.4,
    pending:     2.8,
    failed:      0.6,
    skipped:     2.2,
  },
  render: (args) => (
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
      maxSlices={args.maxSlices}
      centerLabel="GB total"
    />
  ),
};

export const AfterVerityHighcharts: Story = {
  name: 'After Verity Highcharts: PieDonutChart + status palette',
  args: {
    innerRadius: 'l',
    showLabels:  'hover',
    showLegend:  true,
    maxSlices:   8,
    backedUp:    18.4,
    pending:     2.8,
    failed:      0.6,
    skipped:     2.2,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Camera Stats cloud backup donut using a Verity `PieDonutChart` primitive. ' +
          '`colorPalette="status"` with per-slice `status` keys drives the backed-up/pending/failed/skipped color mapping through the semantic token system — no hex in consumer code.\n\n' +
          '`centerLabel` renders total GB inside the donut hole via Highcharts subtitle.\n\n' +
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
      maxSlices={args.maxSlices}
      centerLabel="GB total"
    />
  ),
};
