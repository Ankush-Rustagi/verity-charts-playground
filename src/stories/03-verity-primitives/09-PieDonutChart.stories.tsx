import type { Meta, StoryObj } from '@storybook/react';
import { PieDonutChart, AfterVerityPanel } from '../../primitives/VeritySimPrimitives';

type Args = {
  innerRadius:  number;
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
    innerRadius: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: '`innerRadius?: number` — donut hole size as a 0–100 percentage. `0` = full pie, `60` = standard donut.',
      table: { type: { summary: 'number (0–100)' }, defaultValue: { summary: '60' } },
    },
    showLabels: {
      control: 'inline-radio',
      options: ['always', 'hover', 'none'],
      description: '`showLabels?: "always" | "hover" | "none"` — `"always"` renders data labels on every slice; `"hover"` shows them only in the tooltip; `"none"` omits labels entirely.',
      table: { type: { summary: '"always" | "hover" | "none"' }, defaultValue: { summary: '"hover"' } },
    },
    showLegend: {
      control: 'boolean',
      description: '`showLegend?: boolean` — default `true`. Legend moves below the chart at container widths below 400px.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    maxSlices: {
      control: { type: 'range', min: 2, max: 8, step: 1 },
      description: '`maxSlices?: number` — slices beyond this count collapse into an "Other" catch-all slice. Useful for top-N distributions.',
      table: { type: { summary: 'number' } },
    },
    backedUp: {
      control: { type: 'range', min: 0, max: 100, step: 0.1 },
      description: 'Playground data control — Backed up (GB).',
      table: { category: 'Data' },
    },
    pending: {
      control: { type: 'range', min: 0, max: 30, step: 0.1 },
      description: 'Playground data control — Pending (GB).',
      table: { category: 'Data' },
    },
    failed: {
      control: { type: 'range', min: 0, max: 10, step: 0.1 },
      description: 'Playground data control — Failed (GB).',
      table: { category: 'Data' },
    },
    skipped: {
      control: { type: 'range', min: 0, max: 20, step: 0.1 },
      description: 'Playground data control — Skipped (GB).',
      table: { category: 'Data' },
    },
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {
  args: {
    innerRadius: 60,
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
      innerRadius={`${args.innerRadius}%`}
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
    innerRadius: 60,
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
        maxSlices={args.maxSlices}
        centerLabel="GB total"
      />
    </AfterVerityPanel>
  ),
};
