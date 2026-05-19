import type { Meta, StoryObj } from '@storybook/react';
import { PlaygroundChart } from '../../../primitives/PlaygroundChart';
import { fakeColumnSeries } from '../../../utils/fakeData';

const meta: Meta<typeof PlaygroundChart> = {
  title: '01 Highcharts/Custom Renderer/Gateway Navigation Arrows (escape hatch)',
  component: PlaygroundChart,
  parameters: {
    docs: {
      description: {
        component:
          'Standard Highcharts column chart with custom SVG left/right arrows added via `chart.renderer.text(...).add()` at `chart.events.load`. One of only 2 customer-facing files that use `chart.renderer.*`. Production source: `Verkada-Web/src/command/gateways/details/common/gatewayHighcharts/hooks/useGatewayHighChartsNavigationArrows.tsx`. Verity primitive policy: this pattern lives in the `ExtendChart` escape hatch with a documented "static SVG overlay added at load" example.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PlaygroundChart>;

export const Default: Story = {
  render: () => {
    const { categories, values } = fakeColumnSeries({ count: 24, seed: 99 });
    return (
      <PlaygroundChart
        options={{
          chart: {
            type: 'column',
            events: {
              load: function () {
                const chart = this;
                const arrowStyle = { color: '#374151', cursor: 'pointer', fontSize: '20px' } as Highcharts.CSSObject;
                chart.renderer
                  .text('\u2039', 16, chart.chartHeight / 2)
                  .attr({ zIndex: 5 })
                  .css(arrowStyle)
                  .add()
                  .on('click', () => {
                    alert('Previous window');
                  });
                chart.renderer
                  .text('\u203A', chart.chartWidth - 26, chart.chartHeight / 2)
                  .attr({ zIndex: 5 })
                  .css(arrowStyle)
                  .add()
                  .on('click', () => {
                    alert('Next window');
                  });
              },
            },
          },
          title: { text: 'Gateway connections (with custom paging arrows)' },
          xAxis: { categories, crosshair: true },
          yAxis: { min: 0, title: { text: 'Connections' } },
          legend: { enabled: false },
          tooltip: { useHTML: true, shared: true, outside: true },
          plotOptions: {
            column: { borderRadius: 4, groupPadding: 0.1, color: '#3B82F6' },
          },
          series: [{ type: 'column', name: 'Connections', data: values }],
        }}
      />
    );
  },
};
