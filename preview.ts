import type { Preview } from '@storybook/react';
import Highcharts from 'highcharts';

// Inject minimal table styling for MDX docs pages (Storybook's default sb-unstyled
// strips table chrome, and our MDX uses JSX <table> for reliable rendering).
if (typeof document !== 'undefined') {
  const id = 'verity-playground-docs-table-css';
  if (!document.getElementById(id)) {
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      .sbdocs table.vp-table { width: 100%; border-collapse: collapse; margin: 12px 0 16px; font-size: 14px; }
      .sbdocs table.vp-table th { text-align: left; border-bottom: 1px solid #E5E7EB; padding: 8px 12px; font-weight: 600; color: #374151; background: #F9FAFB; }
      .sbdocs table.vp-table td { border-bottom: 1px solid #F3F4F6; padding: 8px 12px; vertical-align: top; }
      .sbdocs table.vp-table tr:last-child td { border-bottom: none; }
      .sbdocs table.vp-table code { background: #F3F4F6; padding: 1px 5px; border-radius: 3px; font-size: 12px; }
    `;
    document.head.appendChild(s);
  }
}

import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import HighchartsPatternFill from 'highcharts/modules/pattern-fill';
import HighchartsDraggablePoints from 'highcharts/modules/draggable-points';

// In Highcharts 11, modules export a factory that must be invoked with the
// Highcharts instance. CDN-style bare imports no longer auto-register them.
// Guard with typeof so HMR re-runs don't crash.
[
  HighchartsMore,
  HighchartsSolidGauge,
  HighchartsAccessibility,
  HighchartsNoDataToDisplay,
  HighchartsPatternFill,
  HighchartsDraggablePoints,
].forEach((mod) => {
  if (typeof mod === 'function') {
    (mod as (h: typeof Highcharts) => void)(Highcharts);
  }
});

Highcharts.setOptions({
  lang: {
    thousandsSep: ',',
  },
  chart: {
    style: {
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
  credits: { enabled: false },
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'Release Notes',
          'About',
          '00 Color System',
          '01 Highcharts',
          [
            'Columns',
            'Lines and Splines',
            'Areas',
            'Gauges',
            'Pie',
            'Combo and Stock',
            'Threshold Editor',
            'Custom Renderer',
          ],
          '02 visx',
          ['Bars', 'Lines', 'Schedules', 'Pie and Calendar', 'Sparklines', 'Bespoke'],
          '03 Verity Primitives',
          [
            'Overview',
            'ColumnChart',
            'LineChart',
            'AreaChart',
            'Gauge',
            'ComboTimeSeriesChart',
            'ThresholdEditorChart',
            'Sparkline',
            'PieDonutChart',
            'ScheduleChart',
            'ExtendChart (escape hatch)',
          ],
          '*',
        ],
      },
    },
  },
};

export default preview;
