import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import {
  LineChart,
  type ColorPalette,
  type PlotBand,
  type ZoneConfig,
} from '../../../primitives/VeritySimPrimitives';
import { fakeTimeSeries } from '../../../utils/fakeData';

// Sensor series: count 192, step 5 min, starting 2026-05-01T08:00Z = 1746086400000.
// Band timestamps are offsets from that anchor so they land visibly in the chart.
const DEMO_BANDS: PlotBand[] = [
  { from: 1746090000000, to: 1746092700000, color: 'rgba(239,68,68,0.15)',  label: 'Alert: motion'    },
  { from: 1746104400000, to: 1746111600000, color: 'rgba(245,158,11,0.12)', label: 'Alert: temp high' },
  { from: 1746118800000, to: 1746120600000, color: 'rgba(239,68,68,0.15)',  label: 'Alert: door ajar' },
];

// Zones for temperature data (base ~68, range ~60–78 °F).
// No color — let colorPalette drive; try "status" for semantic danger/warning/success.
const DEMO_ZONES: ZoneConfig[] = [
  { value: 65 },  // ≤ 65 °F → zone 0
  { value: 72 },  // 65–72 °F → zone 1
  {},             // > 72 °F  → zone 2
];

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Lines and Splines/Sensor Default (spline + plotBands)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Smoothed spline over datetime, with alert-event plotBands and a shared crosshair tooltip. Models the default sensor detail chart. Production source: `Verkada-Web/src/command/sensors/components/sensor-highcharts/`. Verity primitive target: `LineChart` (when no draggable thresholds) or `ThresholdEditorChart` (when thresholds are editable).',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;
type LineArgs = {
  smooth:       boolean;
  markers:      boolean;
  bands:        PlotBand[];
  zones:        ZoneConfig[];
  xAxisTitle:   string;
  yAxisTitle:   string;
  tooltip:      'shared-crosshair' | 'point' | 'disabled';
  showLegend:   boolean;
  colorPalette: ColorPalette;
};
type AfterVerityStory = StoryObj<LineArgs>;

export const Default: Story = {
  render: () => {
    const data = fakeTimeSeries({ count: 192, stepMs: 5 * 60 * 1000, base: 68, amplitude: 6, noise: 1.5 });
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'spline' },
          title: { text: 'Temperature (°F), last 16 hours' },
          xAxis: {
            type: 'datetime',
            crosshair: true,
            plotBands: DEMO_BANDS as Highcharts.XAxisPlotBandsOptions[],
          },
          yAxis: {
            title: { text: '°F' },
            plotLines: [
              { value: 75, color: '#EF4444', dashStyle: 'Dash', width: 1, label: { text: 'High alert' } },
              { value: 60, color: '#3B82F6', dashStyle: 'Dash', width: 1, label: { text: 'Low alert'  } },
            ],
          },
          legend: { enabled: false },
          tooltip: {
            useHTML: true,
            shared: true,
            outside: true,
            formatter: function () {
              const p = (this as Highcharts.TooltipFormatterContextObject).points?.[0];
              if (!p) return '';
              return `<div><strong>${new Date(p.x as number).toLocaleTimeString()}</strong><br/>${p.y}°F</div>`;
            },
          },
          plotOptions: {
            spline: {
              marker: { enabled: false },
              color: '#0EA5E9',
              connectNulls: false,
            },
          },
          series: [{ type: 'spline', name: 'Temperature', data }],
        }}
      />
    );
  },
};

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: LineChart + bands + thresholds',
  args: {
    smooth:       true,
    markers:      false,
    bands:        DEMO_BANDS,
    zones:        DEMO_ZONES,
    xAxisTitle:   '',
    yAxisTitle:   '°F',
    tooltip:      'shared-crosshair',
    showLegend:   false,
    colorPalette: 'categorical',
  },
  argTypes: {
    smooth: {
      control: 'boolean',
      description: '`smooth?: boolean` — false = line, true = spline',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    markers: {
      control: 'boolean',
      description: '`markers?: boolean`',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    bands: {
      control: 'object',
      description:
        '`bands?: PlotBand[]` — `{ from, to, color, label? }` x-axis time-range overlays for alert events. ' +
        '`from`/`to` are Unix timestamps (ms). Edit the array to change placement, width (`to − from`), or color. ' +
        'Default shows 3 alert-event bands anchored to 2026-05-01T08:00Z.',
      table: { type: { summary: 'PlotBand[]' } },
    },
    zones: {
      control: 'object',
      description:
        '`zones?: ZoneConfig[]` — `{ value?, color? }` threshold bands on the line itself. ' +
        'Each entry colors from the previous threshold up to `value`. Omit `color` to use `colorPalette`. ' +
        'Default partitions °F data range (≤65 / 65–72 / >72). Try `colorPalette="status"` for semantic coloring.',
      table: { type: { summary: 'ZoneConfig[]' } },
    },
    xAxisTitle: {
      control: 'text',
      description: '`xAxisTitle?: string` — shorthand for `xAxis.title`.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '""' } },
    },
    yAxisTitle: {
      control: 'text',
      description: '`yAxisTitle?: string` — shorthand for `yAxis.title`.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '"°F"' } },
    },
    tooltip: {
      control: 'inline-radio',
      options: ['shared-crosshair', 'point', 'disabled'],
      description: '`tooltip?: { kind: ... }` (base prop)',
      table: { type: { summary: '"shared-crosshair" | "point" | "disabled"' }, defaultValue: { summary: '"shared-crosshair"' } },
    },
    showLegend: {
      control: 'boolean',
      description: '`showLegend?: boolean` (base prop)',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    colorPalette: {
      control: 'inline-radio',
      options: ['categorical', 'sequential', 'diverging', 'status'],
      description: '`colorPalette?: ColorPalette` (base prop) — drives series line + zone colors. Threshold lines always use status tokens.',
      table: { type: { summary: 'ColorPalette' }, defaultValue: { summary: '"categorical"' } },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Same chart using a Verity `LineChart`. `bands` passes alert-event plotBands; threshold `plotLines` use `status` tokens instead of raw hex.\n\n**Production source:** Sensors: Default Detail Chart (`src/command/sensors/components/sensor-highcharts/`)',
      },
      source: {
        code: `<LineChart
  smooth
  colorPalette="categorical"
  series={[{ name: 'Temperature', data: tempData }]}
  bands={[
    { from: alertStart1, to: alertStart1 + 45*60000, color: 'rgba(239,68,68,0.15)', label: 'Alert: motion'    },
    { from: alertStart2, to: alertStart2 + 2*3600000, color: 'rgba(245,158,11,0.12)', label: 'Alert: temp high' },
  ]}
  zones={[
    { value: 65 },  // cool
    { value: 72 },  // normal
    {},             // warm
  ]}
  thresholds={[
    { value: 75, status: 'danger',  label: 'High alert' },
    { value: 60, status: 'warning', label: 'Low alert'  },
  ]}
  tooltip={{ kind: 'shared-crosshair' }}
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => {
    const data = fakeTimeSeries({ count: 192, stepMs: 5 * 60 * 1000, base: 68, amplitude: 6, noise: 1.5 });
    return (
      <LineChart
        smooth={args.smooth}
        markers={args.markers}
        colorPalette={args.colorPalette}
        showLegend={args.showLegend}
        xAxisTitle={args.xAxisTitle}
        yAxisTitle={args.yAxisTitle}
        series={[{ name: 'Temperature', data: data as [number, number][] }]}
        bands={args.bands.length > 0 ? args.bands : undefined}
        zones={args.zones.length > 0 ? args.zones : undefined}
        thresholds={[
          { value: 75, status: 'danger',  label: 'High alert' },
          { value: 60, status: 'warning', label: 'Low alert'  },
        ]}
        tooltip={{ kind: args.tooltip }}
      />
    );
  },
};
