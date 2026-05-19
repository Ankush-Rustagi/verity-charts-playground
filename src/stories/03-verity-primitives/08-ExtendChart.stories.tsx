import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../primitives/PlaygroundChart';
import { PrimitiveStoryLayout } from '../../primitives/PrimitiveStoryLayout';
import { fakeColumnSeries, fakeTimeSeries } from '../../utils/fakeData';

type Args = {
  pattern: 'static-svg-overlay' | 'dynamic-tracking-label';
  overlayColor: string;
  labelText: string;
};

const meta: Meta<Args> = {
  title: '03 Verity Primitives/ExtendChart (escape hatch)',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Proposed escape hatch for charts that need direct access to the Highcharts chart instance for `chart.renderer.*` calls. Only 2 customer-facing files reach for this today (Gateway navigation arrows, sensor live-point label). The escape hatch covers both documented patterns: static SVG overlay (added once at chart.events.load) and dynamic SVG label that re-renders on data updates. The Verity team should NOT bless `Highcharts.wrap` (internal monkey-patching); zero production files use it and it should stay that way.',
      },
    },
  },
  argTypes: {
    pattern: { control: 'inline-radio', options: ['static-svg-overlay', 'dynamic-tracking-label'] },
    overlayColor: { control: 'color' },
    labelText: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {
  args: { pattern: 'static-svg-overlay', overlayColor: '#374151', labelText: 'Live' },
  render: (args) => {
    const { categories, values } = fakeColumnSeries({ count: 24, seed: 99 });
    const liveData = fakeTimeSeries({ count: 60, base: 65, amplitude: 8, noise: 1 });
    const livePoint = liveData[liveData.length - 1];

    const staticOverlayOptions: Highcharts.Options = {
      chart: {
        type: 'column',
        events: {
          load: function () {
            const chart = this;
            const arrowStyle = { color: args.overlayColor, cursor: 'pointer', fontSize: '20px' } as Highcharts.CSSObject;
            chart.renderer
              .text('\u2039', 16, chart.chartHeight / 2)
              .attr({ zIndex: 5 })
              .css(arrowStyle)
              .add()
              .on('click', () => alert('Previous'));
            chart.renderer
              .text('\u203A', chart.chartWidth - 26, chart.chartHeight / 2)
              .attr({ zIndex: 5 })
              .css(arrowStyle)
              .add()
              .on('click', () => alert('Next'));
          },
        },
      },
      title: { text: '' },
      xAxis: { categories },
      yAxis: { min: 0, title: { text: 'Value' } },
      legend: { enabled: false },
      tooltip: { useHTML: true, outside: true },
      plotOptions: { column: { borderRadius: 4, color: '#3B82F6' } },
      series: [{ type: 'column', name: 'Value', data: values }],
    };

    const dynamicLabelOptions: Highcharts.Options = {
      chart: {
        type: 'spline',
        events: {
          render: function () {
            const chart = this as Highcharts.Chart & { __liveLabel?: Highcharts.SVGElement };
            const series = chart.series[0];
            if (!series || !series.points.length) return;
            const lastPoint = series.points[series.points.length - 1];
            if (lastPoint.plotX == null || lastPoint.plotY == null) return;
            const x = chart.plotLeft + lastPoint.plotX + 6;
            const y = chart.plotTop + lastPoint.plotY - 8;
            if (chart.__liveLabel) chart.__liveLabel.destroy();
            chart.__liveLabel = chart.renderer
              .label(args.labelText, x, y, 'callout', 0, 0, false, true)
              .attr({ fill: args.overlayColor, padding: 4, r: 4, zIndex: 6 })
              .css({ color: '#FFFFFF', fontSize: '11px', fontFamily: 'Inter, sans-serif' })
              .add();
          },
        },
      },
      title: { text: '' },
      xAxis: { type: 'datetime' },
      yAxis: { title: { text: 'Value' } },
      legend: { enabled: false },
      tooltip: { enabled: false },
      plotOptions: { spline: { color: '#22C55E', marker: { enabled: false } } },
      series: [{ type: 'spline', name: 'Live', data: liveData, zoneAxis: 'x' }],
    };

    return (
      <PrimitiveStoryLayout
        chart={
          <PlaygroundChart
            options={args.pattern === 'static-svg-overlay' ? staticOverlayOptions : dynamicLabelOptions}
            height={args.pattern === 'static-svg-overlay' ? 360 : 320}
          />
        }
        propsAPI={[
          { raw: 'chart.events.load', verityProp: 'extend?: { onMount: (chart: Highcharts.Chart) => void }', note: 'Pattern 1: static SVG overlay added once at mount.' },
          { raw: 'chart.events.render', verityProp: 'extend?: { onRender: (chart: Highcharts.Chart) => void }', note: 'Pattern 2: dynamic element repositioned every redraw. Consumer responsible for destroying prior element.' },
          { raw: 'Highcharts.wrap (NOT supported)', verityProp: '(intentionally excluded)', note: 'Zero customer-facing files use Highcharts.wrap; the escape hatch should not bless internal monkey-patching.' },
        ]}
        productionSources={[
          { surface: 'Gateway navigation arrows overlay', file: 'src/command/gateways/details/common/gatewayHighcharts/hooks/useGatewayHighChartsNavigationArrows.tsx' },
          { surface: 'Sensor live-point custom tooltip label', file: 'src/command/sensors/components/sensor-highcharts/hooks/useSensorHighchartsRenderLivePointTooltip.tsx' },
        ]}
        notes="The escape hatch is the smallest necessary surface for the 2 production patterns that actually exist. Adding more (e.g., custom plotOptions injection) would invite the proliferation the audit specifically warned against."
      />
    );
  },
};
