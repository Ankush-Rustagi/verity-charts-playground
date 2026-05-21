import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { Gauge } from '../../../primitives/VeritySimPrimitives';
import { STATUS_COLORS, CHART_FONT_FAMILY } from '../../../primitives/chartColors';
import { GAUGE_ARG_TYPES } from '../../argTypes';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Gauges/Connect Box (solidgauge donut)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Solidgauge donut with center text label. Models the Connect Box stats page. Production source: `Verkada-Web/src/command/connectors/components/connect-box-stats-page/ConnectBoxGauge.tsx`. Verity primitive target: `Gauge` (donut variant). Covers 4 production files.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;

export const Default: Story = {
  render: () => {
    const value = 73;
    return (
      <PlaygroundChart
        options={{
          chart: { type: 'solidgauge', backgroundColor: 'transparent' },
          title: { text: '' },
          pane: {
            center: ['50%', '60%'],
            size: '100%',
            startAngle: -120,
            endAngle: 120,
            borderWidth: 0,
            borderColor: 'transparent',
            background: [
              {
                backgroundColor: '#E5E7EB',
                borderWidth: 0,
                borderColor: 'transparent',
                innerRadius: '75%',
                outerRadius: '100%',
                shape: 'arc',
              },
            ],
          },
          yAxis: {
            min: 0,
            max: 100,
            stops: [
              [0,       STATUS_COLORS.danger],
              [0.499,   STATUS_COLORS.danger],
              [0.5,     STATUS_COLORS.warning],
              [0.849,   STATUS_COLORS.warning],
              [0.85,    STATUS_COLORS.success],
            ],
            tickPositions: [],
            labels: { enabled: false },
          },
          tooltip: { enabled: false },
          credits: { enabled: false },
          plotOptions: {
            solidgauge: {
              borderWidth: 0,
              borderColor: 'transparent',
              linecap: 'round',
              dataLabels: {
                enabled: true,
                useHTML: true,
                borderWidth: 0,
                backgroundColor: 'none',
                y: -20,
                formatter: function () {
                  return `<div style="text-align:center;font-family:${CHART_FONT_FAMILY}"><div style="font-size:48px;font-weight:700">${this.y}%</div><div style="font-size:14px;color:#6B7280;margin-top:4px">Camera uptime</div></div>`;
                },
              },
              innerRadius: '75%',
              radius: '100%',
            },
          },
          series: [
            {
              type: 'solidgauge',
              name: 'Uptime',
              data: [value],
            },
          ],
        }}
        height={320}
      />
    );
  },
};

type GaugeAfterArgs = {
  value:       number;
  min:         number;
  max:         number;
  unit:        string;
  centerLabel: string;
  warnAt:      number;
  goodAt:      number;
  thickness:   'thin' | 'normal' | 'thick';
  gaugeType:   'solid' | 'arc';
};

type AfterVerityStory = StoryObj<GaugeAfterArgs>;

export const AfterVerityHighcharts: AfterVerityStory = {
  name: 'After Verity Highcharts: Gauge + semantic thresholds',
  args: {
    value:       73,
    min:         0,
    max:         100,
    unit:        '%',
    centerLabel: 'Camera uptime',
    warnAt:      50,
    goodAt:      85,
    thickness:   'normal',
    gaugeType:   'solid',
  },
  argTypes: {
    ...GAUGE_ARG_TYPES,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Same gauge using a Verity `Gauge` primitive. The `thresholds` prop drives a 3-stop gradient (danger → warning → success) using semantic status tokens — no hex color stops in consumer code.\n\n**Production source:** Connect Box: Camera Uptime Gauge (`src/command/connectors/components/connect-box-stats-page/ConnectBoxGauge.tsx`)',
      },
      source: {
        code: `<Gauge
  value={73}
  unit="%"
  centerLabel="Camera uptime"
  thresholds={{ warn: 50, good: 85 }}
/>`,
        type: 'code',
      },
    },
  },
  render: (args) => (
    <Gauge
      value={args.value}
      min={args.min}
      max={args.max}
      unit={args.unit}
      centerLabel={args.centerLabel}
      thickness={args.thickness}
      gaugeType={args.gaugeType}
      thresholds={{ warn: args.warnAt, good: args.goodAt }}
    />
  ),
};
