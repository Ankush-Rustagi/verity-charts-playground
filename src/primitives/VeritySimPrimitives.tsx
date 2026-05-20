/**
 * Simulated Verity chart primitives for Storybook "After" stories.
 *
 * These components mirror the prop contract defined in doc 27
 * (27-verity-chart-primitives-design-system.md). They translate Verity props
 * to raw Highcharts options internally, exactly as the real implementation
 * would. They live here as a rendered specification until the production
 * primitives exist in Verkada-Web.
 */
import { useState, useEffect } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import Highcharts from 'highcharts';
import xrangeModule from 'highcharts/modules/xrange';
import { PlaygroundChart } from './PlaygroundChart';

xrangeModule(Highcharts);

// ─── Color system ─────────────────────────────────────────────────────────────
// Mirrors the exact token definitions from verity-chart-color-palettes.html
// (light-mode values). In the real implementation these resolve via CSS custom
// properties; here we hard-code the hex so Highcharts can render them.

export type ColorPalette = 'categorical' | 'sequential' | 'diverging' | 'status';

/**
 * CSS token string → resolved light-mode hex.
 * Covers all four palettes defined in the color system spec (doc 27).
 *
 * Categorical:  --vc-1 … --vc-8  (8 Verkada-flavored tokens)
 * Status:       --vc-success / --vc-warning / --vc-danger / --vc-neutral
 * Sequential:   --vs-1 … --vs-5  (single-hue blue, light → dark)
 * Diverging:    --vd-neg2 / --vd-neg1 / --vd-mid / --vd-pos1 / --vd-pos2
 */
const TOKEN_HEX: Record<string, string> = {
  // Categorical series tokens
  'var(--vc-1)': '#2563eb',
  'var(--vc-2)': '#0891b2',
  'var(--vc-3)': '#4f46e5',
  'var(--vc-4)': '#d97706',
  'var(--vc-5)': '#dc2626',
  'var(--vc-6)': '#16a34a',
  'var(--vc-7)': '#7c3aed',
  'var(--vc-8)': '#b45309',
  // Status tokens
  'var(--vc-success)': '#16a34a',
  'var(--vc-warning)': '#d97706',
  'var(--vc-danger)':  '#dc2626',
  'var(--vc-neutral)': '#9ca3af',
  // Sequential tokens (light → dark)
  'var(--vs-1)': '#dbeafe',
  'var(--vs-2)': '#93c5fd',
  'var(--vs-3)': '#3b82f6',
  'var(--vs-4)': '#1d4ed8',
  'var(--vs-5)': '#1e3a8a',
  // Diverging tokens
  'var(--vd-neg2)': '#dc2626',
  'var(--vd-neg1)': '#fca5a5',
  'var(--vd-mid)':  '#e5e7eb',
  'var(--vd-pos1)': '#93c5fd',
  'var(--vd-pos2)': '#1d4ed8',
};

export const PALETTE_HEX: Record<ColorPalette, string[]> = {
  // blue-600, cyan-500, violet-500, yellow-500, red-400, green-500, purple-600, orange-500
  categorical: ['#226ecd', '#19a0d5', '#6565d9', '#fb9717', '#de3243', '#14ba74', '#893dcd', '#ff5500'],
  // blue-10 → blue-1000 (Verkada blue scale, light to dark)
  sequential:  ['#dee9f8', '#9cbee9', '#6fa1de', '#4e8bd7', '#347ad1', '#226ecd', '#184d8f', '#122740'],
  // red-500, red-100, neutral-75, blue-50, blue-700
  diverging:   ['#cb2939', '#f3847d', '#dce0e4', '#9cbee9', '#1d5eae'],
  // green-500, yellow-600, red-400, neutral-400
  status:      ['#14ba74', '#f18313', '#de3243', '#838e98'],
};

// Zone coloring uses a different order than series coloring.
// Zones are ordered by value (low → high), so:
//   sequential: darkest step for the lowest value band, lightest for the highest.
//   status:     danger for the lowest value band (bad threshold), success for the highest.
const ZONE_PALETTE_HEX: Record<ColorPalette, string[]> = {
  categorical: PALETTE_HEX.categorical,
  sequential:  [...PALETTE_HEX.sequential].reverse(), // darkest first → lowest values
  diverging:   PALETTE_HEX.diverging,
  status:      ['#de3243', '#f18313', '#14ba74', '#838e98'], // danger → warning → success → neutral
};

/** Resolves a CSS token string or plain hex to a Highcharts-ready color. */
function resolveColor(color: string): string {
  return TOKEN_HEX[color] ?? color;
}

export type StatusKey = 'success' | 'warning' | 'danger' | 'neutral';

const STATUS_HEX: Record<StatusKey, string> = {
  success: '#14ba74',   // green-500
  warning: '#f18313',   // yellow-600
  danger:  '#de3243',   // red-400
  neutral: '#838e98',   // neutral-400
};

/**
 * Applies colors to series in priority order:
 *   1. Explicit `color` (token string or hex) — escape hatch, avoid in consumer code
 *   2. `status` key ('success' | 'warning' | 'danger' | 'neutral') — semantic intent
 *   3. `colorPalette` by index — default for purely categorical series
 */
function applyPalette<T extends { color?: string; status?: StatusKey }>(
  series: T[],
  palette: ColorPalette,
): (T & { color: string })[] {
  const colors = PALETTE_HEX[palette];
  return series.map((s, i) => ({
    ...s,
    color: s.color  ? resolveColor(s.color)
         : s.status ? STATUS_HEX[s.status]
         : colors[i % colors.length],
  }));
}

/** Applies zone palette colors to zones that have no explicit color. */
function applyZonePalette(
  zones: ZoneConfig[],
  palette: ColorPalette,
): (ZoneConfig & { color: string })[] {
  const colors = ZONE_PALETTE_HEX[palette];
  return zones.map((z, i) => ({
    ...z,
    color: z.color ? resolveColor(z.color) : colors[i % colors.length],
  }));
}

// ─── Shared types ─────────────────────────────────────────────────────────────

export type TooltipKind = 'shared-crosshair' | 'point' | 'disabled';
export type TooltipConfig = { kind: TooltipKind };
export type ZoneConfig = { value?: number; color?: string };
export type PlotBand = { from: number; to: number; color: string; label?: string };
export type ThresholdLine = {
  value: number;
  color?: string;
  status?: StatusKey;
  dashStyle?: Highcharts.DashStyleValue;
  label?: string;
};

function resolveTooltip(tooltip: TooltipConfig | undefined): Highcharts.TooltipOptions {
  if (!tooltip || tooltip.kind === 'shared-crosshair') return { useHTML: true, shared: true, outside: true };
  if (tooltip.kind === 'point') return { useHTML: true, outside: true };
  return { enabled: false };
}

/**
 * When tooltip is disabled the hover dot and halo are useless visual noise.
 * Returns plotOptions overrides that suppress both for any series type key.
 */
function resolveHoverSuppression(tooltip: TooltipConfig | undefined): Highcharts.PlotOptions {
  if (tooltip?.kind !== 'disabled') return {};
  return {
    series: {
      marker: { states: { hover: { enabled: false } } },
      states: { hover: { halo: { size: 0 } } },
    } as Highcharts.PlotSeriesOptions,
  };
}

// ─── ColumnChart ──────────────────────────────────────────────────────────────

const DENSITY_MAP = {
  tight:  { groupPadding: 0.02, pointPadding: 0,    borderRadius: 0 },
  normal: { groupPadding: 0.1,  pointPadding: 0.05, borderRadius: 4 },
  loose:  { groupPadding: 0.25, pointPadding: 0.1,  borderRadius: 6 },
};

export interface ColumnChartProps {
  series: { name: string; data: number[] | [number, number][]; color?: string; status?: StatusKey }[];
  colorPalette?: ColorPalette;
  stacking?: 'normal' | 'percent' | 'none';
  columnDensity?: 'tight' | 'normal' | 'loose';
  axisKind?: 'datetime' | 'categorical';
  categories?: string[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  showLegend?: boolean;
  tooltip?: TooltipConfig;
  dataLabels?: boolean;
  height?: number;
}

export function ColumnChart({
  series,
  colorPalette = 'categorical',
  stacking = 'none',
  columnDensity = 'normal',
  axisKind = 'categorical',
  categories,
  xAxisTitle,
  yAxisTitle,
  showLegend = false,
  tooltip,
  dataLabels = false,
  height,
}: ColumnChartProps) {
  const density = DENSITY_MAP[columnDensity];
  const resolvedSeries = applyPalette(series, colorPalette);
  return (
    <PlaygroundChart
      height={height}
      options={{
        chart: { type: 'column' },
        title: { text: '' },
        xAxis:
          axisKind === 'categorical'
            ? { categories, crosshair: tooltip?.kind !== 'disabled', title: { text: xAxisTitle ?? '' } }
            : { type: 'datetime', crosshair: tooltip?.kind !== 'disabled', title: { text: xAxisTitle ?? '' } },
        yAxis: { min: 0, title: { text: yAxisTitle ?? '' } },
        legend: { enabled: showLegend, align: 'center', verticalAlign: 'bottom' },
        tooltip: resolveTooltip(tooltip),
        plotOptions: {
          column: {
            stacking: stacking === 'none' ? undefined : stacking,
            borderRadius: density.borderRadius,
            groupPadding: density.groupPadding,
            pointPadding: density.pointPadding,
            dataLabels: { enabled: dataLabels },
          },
        },
        series: resolvedSeries.map((s) => ({ type: 'column' as const, ...s })),
      }}
    />
  );
}

// ─── LineChart ────────────────────────────────────────────────────────────────

export interface LineChartProps {
  series: { name: string; data: [number, number][]; color?: string; status?: StatusKey }[];
  colorPalette?: ColorPalette;
  /** true = spline (smooth curve), false = straight line; default false */
  smooth?: boolean;
  markers?: boolean;
  zones?: ZoneConfig[];
  bands?: PlotBand[];
  thresholds?: ThresholdLine[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  showLegend?: boolean;
  tooltip?: TooltipConfig;
  chromeMinimal?: boolean;
  height?: number;
}

export function LineChart({
  series,
  colorPalette = 'categorical',
  smooth = false,
  markers = false,
  zones,
  bands,
  thresholds,
  xAxisTitle,
  yAxisTitle,
  showLegend = false,
  tooltip,
  chromeMinimal = false,
  height,
}: LineChartProps) {
  const curve = smooth ? 'spline' : 'line';
  const resolvedSeries = applyPalette(series, colorPalette);
  const resolvedZones = zones ? applyZonePalette(zones, colorPalette) : undefined;

  const plotLines: Highcharts.YAxisPlotLinesOptions[] = (thresholds ?? []).map((t) => ({
    value: t.value,
    color: t.color  ? resolveColor(t.color)
         : t.status ? STATUS_HEX[t.status]
         : '#9ca3af',
    dashStyle: t.dashStyle ?? 'Dash',
    width: 1,
    label: t.label ? { text: t.label } : undefined,
  }));

  return (
    <PlaygroundChart
      height={height}
      options={{
        chart: {
          type: curve,
          ...(chromeMinimal ? { backgroundColor: 'transparent', margin: [0, 0, 0, 0], spacing: [0, 0, 0, 0] } : {}),
        },
        title: { text: '' },
        xAxis: {
          type: 'datetime',
          crosshair: !chromeMinimal && tooltip?.kind !== 'disabled',
          plotBands: bands,
          ...(chromeMinimal ? { visible: false } : { title: { text: xAxisTitle ?? '' } }),
        },
        yAxis: {
          title: { text: chromeMinimal ? '' : (yAxisTitle ?? '') },
          plotLines,
          ...(chromeMinimal ? { visible: false } : {}),
        },
        legend: { enabled: showLegend, align: 'center', verticalAlign: 'bottom' },
        tooltip: resolveTooltip(tooltip),
        plotOptions: {
          ...resolveHoverSuppression(tooltip),
          [curve]: { marker: { enabled: markers, radius: 3 }, lineWidth: 2, zones: resolvedZones },
        } as Highcharts.PlotOptions,
        series: resolvedSeries.map((s) => ({ type: curve as 'spline', ...s })),
      }}
    />
  );
}

// ─── AreaChart ────────────────────────────────────────────────────────────────

export interface AreaChartProps {
  variant?: 'area' | 'areaspline' | 'arearange';
  series: { name: string; data: [number, number][] | [number, number, number][]; color?: string; status?: StatusKey }[];
  colorPalette?: ColorPalette;
  stacking?: 'normal' | 'percent' | 'none';
  fillOpacity?: number;
  bands?: PlotBand[];
  zones?: ZoneConfig[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  showLegend?: boolean;
  tooltip?: TooltipConfig;
  height?: number;
}

export function AreaChart({
  variant = 'area',
  series,
  colorPalette = 'categorical',
  stacking,
  fillOpacity = 0.18,
  bands,
  zones,
  xAxisTitle,
  yAxisTitle,
  showLegend = false,
  tooltip,
  height,
}: AreaChartProps) {
  const hcType = variant === 'arearange' ? 'arearange' : variant;
  const resolvedSeries = applyPalette(series, colorPalette);
  const resolvedZones = zones ? applyZonePalette(zones, colorPalette) : undefined;

  return (
    <PlaygroundChart
      height={height}
      options={{
        chart: { type: hcType },
        title: { text: '' },
        xAxis: {
          type: 'datetime',
          crosshair: tooltip?.kind !== 'disabled',
          plotBands: bands,
          title: { text: xAxisTitle ?? '' },
        },
        yAxis: {
          title: { text: yAxisTitle ?? '' },
          ...(stacking === 'percent' ? { labels: { format: '{value}%' } } : {}),
        },
        legend: { enabled: showLegend, align: 'center', verticalAlign: 'bottom' },
        tooltip: resolveTooltip(tooltip),
        plotOptions: {
          [hcType]: {
            stacking: stacking === 'none' ? undefined : stacking,
            fillOpacity,
            marker: { enabled: false },
            ...(resolvedZones && hcType !== 'arearange' ? { zones: resolvedZones } : {}),
          },
          arearange: { fillOpacity, lineWidth: 1 },
        } as Highcharts.PlotOptions,
        series: resolvedSeries.map((s) => ({ type: hcType as 'area', ...s })),
      }}
    />
  );
}

// ─── ComboTimeSeriesChart ─────────────────────────────────────────────────────

export type ComboSeriesType = 'column' | 'spline' | 'area';

export interface ComboSeriesItem {
  name: string;
  type: ComboSeriesType;
  data: [number, number][];
  axis?: 'primary' | 'secondary';
  color?: string;
  status?: StatusKey;
  fillOpacity?: number;
}

export interface ComboTimeSeriesChartProps {
  series: ComboSeriesItem[];
  xAxisTitle?: string;
  primaryAxis?: { title?: string; min?: number; max?: number };
  secondaryAxis?: { title?: string; min?: number; max?: number } | null;
  stacking?: 'normal' | 'none';
  zoom?: boolean;
  showLegend?: boolean;
  tooltip?: TooltipConfig;
  height?: number;
}

export function ComboTimeSeriesChart({
  series,
  xAxisTitle,
  primaryAxis,
  secondaryAxis,
  stacking = 'none',
  zoom = false,
  showLegend = true,
  tooltip,
  height,
}: ComboTimeSeriesChartProps) {
  const colors = PALETTE_HEX.categorical;
  const resolvedSeries = series.map((s, i) => ({
    ...s,
    color: s.color  ? resolveColor(s.color)
         : s.status ? STATUS_HEX[s.status]
         : colors[i % colors.length],
    yAxis: s.axis === 'secondary' ? 1 : 0,
  }));

  const yAxes: Highcharts.YAxisOptions[] = [
    { title: { text: primaryAxis?.title ?? '' }, min: primaryAxis?.min },
  ];
  if (secondaryAxis) {
    yAxes.push({ title: { text: secondaryAxis.title ?? '' }, opposite: true, min: secondaryAxis.min, max: secondaryAxis.max });
  }

  return (
    <PlaygroundChart
      height={height}
      options={{
        chart: zoom ? { zooming: { type: 'x' as const } } : {},
        title: { text: '' },
        xAxis: { type: 'datetime', crosshair: tooltip?.kind !== 'disabled', title: { text: xAxisTitle ?? '' } },
        yAxis: yAxes,
        legend: { enabled: showLegend, align: 'center', verticalAlign: 'bottom' },
        tooltip: resolveTooltip(tooltip),
        plotOptions: {
          column: {
            stacking: stacking === 'none' ? undefined : stacking,
            borderRadius: 0,
            groupPadding: 0,
            pointPadding: 0,
          },
          spline: { marker: { enabled: false }, lineWidth: 2 },
          area:   { marker: { enabled: false }, fillOpacity: 0.18 },
        } as Highcharts.PlotOptions,
        series: resolvedSeries.map((s) => ({
          type: s.type as 'column',
          name: s.name,
          data: s.data,
          color: s.color,
          yAxis: s.yAxis,
          ...(s.type === 'area' && s.fillOpacity != null ? { fillOpacity: s.fillOpacity } : {}),
        })),
      }}
    />
  );
}

// ─── Gauge ────────────────────────────────────────────────────────────────────

const THICKNESS_MAP = {
  thin:   '85%',
  normal: '75%',
  thick:  '60%',
} as const;

export interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  centerLabel?: string;
  /** Percentage thresholds (0–100) of the min–max range. Drives 3-stop gradient. */
  thresholds?: { warn: number; good: number };
  thickness?: 'thin' | 'normal' | 'thick';
  height?: number;
}

export function Gauge({
  value,
  min = 0,
  max = 100,
  unit = '',
  centerLabel = '',
  thresholds = { warn: 50, good: 85 },
  thickness = 'normal',
  height,
}: GaugeProps) {
  const innerRadius = THICKNESS_MAP[thickness];
  const warnStop = thresholds.warn / 100;
  const goodStop = thresholds.good / 100;
  return (
    <PlaygroundChart
      height={height ?? 320}
      options={{
        chart: { type: 'solidgauge', backgroundColor: 'transparent' },
        title: { text: '' },
        pane: {
          center: ['50%', '60%'],
          size: '100%',
          startAngle: -120,
          endAngle: 120,
          background: [{ backgroundColor: '#e2e4e9', innerRadius, outerRadius: '100%', shape: 'arc' }],
        },
        yAxis: {
          min,
          max,
          stops: [
            [0,        STATUS_HEX.danger],
            [warnStop, STATUS_HEX.warning],
            [goodStop, STATUS_HEX.success],
          ] as Array<[number, string]>,
          tickPositions: [],
          labels: { enabled: false },
        },
        tooltip: { enabled: false },
        credits: { enabled: false },
        plotOptions: {
          solidgauge: {
            dataLabels: {
              enabled: true,
              useHTML: true,
              y: -20,
              formatter: function () {
                return `<div style="text-align:center;font-family:Inter,sans-serif"><div style="font-size:48px;font-weight:700">${this.y}${unit}</div><div style="font-size:14px;color:#6b7280;margin-top:4px">${centerLabel}</div></div>`;
              },
            },
            innerRadius,
            radius: '100%',
          },
        } as Highcharts.PlotOptions,
        series: [{ type: 'solidgauge', name: centerLabel, data: [value] }],
      }}
    />
  );
}

// ─── ThresholdEditorChart ─────────────────────────────────────────────────────

export interface ThresholdEditorChartProps {
  seriesData: [number, number][];
  seriesName?: string;
  thresholds: { high?: number; low?: number };
  onThresholdChange?: (next: { high?: number; low?: number }) => void;
  valueRange?: { min: number; max: number };
  unit?: string;
  xAxisTitle?: string;
  alertEvents?: PlotBand[];
  editable?: boolean;
  colorPalette?: ColorPalette;
  height?: number;
}

export function ThresholdEditorChart({
  seriesData,
  seriesName = 'Value',
  thresholds,
  onThresholdChange,
  valueRange = { min: 0, max: 100 },
  unit = '',
  xAxisTitle,
  alertEvents,
  editable = true,
  colorPalette = 'categorical',
  height,
}: ThresholdEditorChartProps) {
  const [localHigh, setLocalHigh] = useState(thresholds.high ?? valueRange.max * 0.8);
  const [localLow,  setLocalLow]  = useState(thresholds.low  ?? valueRange.min + (valueRange.max - valueRange.min) * 0.2);

  useEffect(() => { if (thresholds.high != null) setLocalHigh(thresholds.high); }, [thresholds.high]);
  useEffect(() => { if (thresholds.low  != null) setLocalLow(thresholds.low);   }, [thresholds.low]);

  const lineColor = PALETTE_HEX[colorPalette][0];
  const xMin = seriesData[0]?.[0]  ?? Date.now();
  const xMax = seriesData[seriesData.length - 1]?.[0] ?? Date.now();

  const highBand: [number, number, number][] = [
    [xMin, localHigh, valueRange.max],
    [xMax, localHigh, valueRange.max],
  ];
  const lowBand: [number, number, number][] = [
    [xMin, valueRange.min, localLow],
    [xMax, valueRange.min, localLow],
  ];

  return (
    <PlaygroundChart
      height={height ?? 380}
      options={{
        chart: { type: 'spline' },
        title: { text: '' },
        xAxis: {
          type: 'datetime',
          crosshair: true,
          plotBands: alertEvents as unknown as Highcharts.XAxisPlotBandsOptions[] | undefined,
          title: { text: xAxisTitle ?? '' },
        },
        yAxis: { min: valueRange.min, max: valueRange.max, title: { text: unit } },
        legend: { enabled: false },
        tooltip: { useHTML: true, shared: true, outside: true },
        plotOptions: {
          areaspline: {
            fillOpacity: 0.18,
            lineWidth: 0,
            enableMouseTracking: false,
            dragDrop: { draggableY: editable, dragMaxY: valueRange.max, dragMinY: valueRange.min },
            point: {
              events: {
                drop: function () {
                  const newY = (this as Highcharts.Point).y;
                  if (typeof newY !== 'number') return;
                  const isHigh = ((this as Highcharts.Point).series.name || '').includes('high');
                  if (isHigh) {
                    setLocalHigh(Math.round(newY));
                    onThresholdChange?.({ ...thresholds, high: Math.round(newY) });
                  } else {
                    setLocalLow(Math.round(newY));
                    onThresholdChange?.({ ...thresholds, low: Math.round(newY) });
                  }
                },
              },
            },
          },
          spline: { marker: { enabled: false } },
        } as Highcharts.PlotOptions,
        series: [
          { type: 'areaspline', name: 'high band', data: highBand, color: STATUS_HEX.danger  },
          { type: 'areaspline', name: 'low band',  data: lowBand,  color: STATUS_HEX.warning },
          { type: 'spline',     name: seriesName,  data: seriesData, color: lineColor, zIndex: 5 },
        ],
      }}
    />
  );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

export interface SparklineProps {
  data: [number, number][];
  type?: 'line' | 'area';
  caption?: string;
  unit?: string;
  showLatestValue?: boolean;
  height?: number;
  width?: number;
  colorPalette?: ColorPalette;
  status?: StatusKey;
}

export function Sparkline({
  data,
  type = 'area',
  caption,
  unit = '',
  showLatestValue = true,
  height = 56,
  width = 240,
  colorPalette = 'categorical',
  status,
}: SparklineProps) {
  const color     = status ? STATUS_HEX[status] : PALETTE_HEX[colorPalette][0];
  const chartType = type === 'line' ? 'spline' : 'areaspline';
  const latest    = data[data.length - 1]?.[1];

  return (
    <div style={{ width, padding: 12, borderRadius: 8, background: '#f5f6f8', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      {showLatestValue && caption && (
        <>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>{caption}</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#1a1d23', marginBottom: 6 }}>
            {latest !== undefined ? latest.toFixed(1) : '\u2014'}{unit}
          </div>
        </>
      )}
      <PlaygroundChart
        height={height}
        options={{
          chart: {
            type: chartType,
            backgroundColor: 'transparent',
            margin: [0, 0, 0, 0],
            spacing: [0, 0, 0, 0],
          },
          title: { text: '' },
          credits: { enabled: false },
          xAxis: { visible: false, type: 'datetime' },
          yAxis: { visible: false },
          legend: { enabled: false },
          tooltip: { enabled: false },
          plotOptions: {
            series: {
              marker: { states: { hover: { enabled: false } } },
              states: { hover: { halo: { size: 0 } } },
            } as Highcharts.PlotSeriesOptions,
            spline:     { marker: { enabled: false }, lineWidth: 1.5, color },
            areaspline: { fillOpacity: 0.25, lineWidth: 1.5, color, marker: { enabled: false } },
          } as Highcharts.PlotOptions,
          series: [{ type: chartType as 'spline', name: caption ?? '', data }],
        }}
      />
    </div>
  );
}

// ─── PieDonutChart ────────────────────────────────────────────────────────────

export interface PieSliceInput {
  name:    string;
  y:       number;
  color?:  string;
  status?: StatusKey;
}

export interface PieDonutChartProps {
  slices:        PieSliceInput[];
  /** Inner ring size string; default '60%' for donut. Pass '0%' for a full pie. */
  innerRadius?:  string;
  showLabels?:   'always' | 'hover' | 'none';
  /** Slices beyond this count collapse into an "Other" slice. */
  maxSlices?:    number;
  colorPalette?: ColorPalette;
  showLegend?:   boolean;
  /** Text shown in the donut hole center. Ignored when innerRadius is '0%'. */
  centerLabel?:  string;
  height?:       number;
}

export function PieDonutChart({
  slices,
  innerRadius  = '60%',
  showLabels   = 'hover',
  maxSlices,
  colorPalette = 'categorical',
  showLegend   = true,
  centerLabel,
  height,
}: PieDonutChartProps) {
  let displaySlices = slices;
  if (maxSlices != null && slices.length > maxSlices) {
    const kept   = slices.slice(0, maxSlices - 1);
    const otherY = slices.slice(maxSlices - 1).reduce((acc, s) => acc + s.y, 0);
    displaySlices = [...kept, { name: 'Other', y: otherY }];
  }

  const colors = PALETTE_HEX[colorPalette];
  const resolvedSlices = displaySlices.map((s, i) => ({
    name:  s.name,
    y:     s.y,
    color: s.color  ? resolveColor(s.color)
         : s.status ? STATUS_HEX[s.status]
         : colors[i % colors.length],
  }));

  const total    = resolvedSlices.reduce((acc, s) => acc + s.y, 0);
  const isDonut  = innerRadius !== '0%';
  const totalStr = total % 1 === 0 ? String(total) : total.toFixed(1);

  return (
    <PlaygroundChart
      height={height ?? 320}
      options={{
        chart: { type: 'pie' },
        title: { text: '' },
        subtitle: isDonut && centerLabel ? {
          useHTML: true,
          text: `<div style="text-align:center;font-family:Inter,sans-serif;line-height:1.3"><div style="font-size:22px;font-weight:700;color:#1a1d23">${totalStr}</div><div style="font-size:11px;color:#6b7280;margin-top:2px">${centerLabel}</div></div>`,
          verticalAlign: 'middle',
          floating: true,
          y: 0,
        } : undefined,
        legend: { enabled: showLegend, align: 'center', verticalAlign: 'bottom' },
        tooltip: {
          useHTML: true,
          outside: true,
          pointFormat: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)',
        },
        plotOptions: {
          pie: {
            innerSize: innerRadius,
            showInLegend: showLegend,
            dataLabels: {
              enabled: showLabels === 'always',
              format: '{point.name}: {point.percentage:.1f}%',
            },
          },
        } as Highcharts.PlotOptions,
        series: [{ type: 'pie', name: 'Value', data: resolvedSlices }],
        credits: { enabled: false },
      }}
    />
  );
}

// ─── ScheduleChart ────────────────────────────────────────────────────────────

const H = 60 * 60 * 1000; // 1 hour in ms — xrange x values are datetime offsets

export interface ScheduleDayEntry {
  /** Category label — must match one of the `days` array entries. */
  day: string;
  /**
   * Active intervals for this day as `[startHour, endHour]` pairs in 24-hour
   * decimal notation. Midnight-wrapping (e.g. `[22, 6]`) is supported.
   */
  intervals: [number, number][];
}

export interface ScheduleChartProps {
  /** Ordered category labels rendered on the y-axis (top → bottom). */
  days: string[];
  /** Active intervals per day. Days omitted from this array have no active bars. */
  schedule: ScheduleDayEntry[];
  /** Color token for active-interval bars. Default: `--vc-1` (brand blue). */
  activeColor?:   string;
  /** Color token for inactive-gap bars. Default: `--vc-neutral` (grey). */
  inactiveColor?: string;
  /** Render grey bars for inactive hours alongside active ones. Default `true`. */
  showInactive?:  boolean;
  /** Row height in pixels. Default `18`. */
  pointWidth?:    number;
  /** Show interval tooltip on hover. Default `'enabled'`. */
  tooltip?:       'enabled' | 'disabled';
  height?:        number;
  title?:         string;
}

function scheduleToPoints(
  schedule: ScheduleDayEntry[],
  days: string[],
  activeColor: string,
  inactiveColor: string,
  showInactive: boolean,
): Highcharts.XrangePointOptionsObject[] {
  const points: Highcharts.XrangePointOptionsObject[] = [];
  days.forEach((day, yi) => {
    const entry = schedule.find((e) => e.day === day);
    const active = entry?.intervals ?? [];

    // Normalise midnight-wrapping intervals into same-day segments [0,24]
    const normalised: [number, number][] = [];
    for (const [s, e] of active) {
      if (e > s) {
        normalised.push([s, e]);
      } else {
        // wraps midnight
        normalised.push([s, 24]);
        normalised.push([0, e]);
      }
    }

    for (const [s, e] of normalised) {
      points.push({ x: s * H, x2: e * H, y: yi, color: activeColor } as Highcharts.XrangePointOptionsObject);
    }

    if (showInactive) {
      // Compute gaps not covered by active intervals
      const sorted = [...normalised].sort((a, b) => a[0] - b[0]);
      let cursor = 0;
      const gaps: [number, number][] = [];
      for (const [s, e] of sorted) {
        if (s > cursor) gaps.push([cursor, s]);
        cursor = Math.max(cursor, e);
      }
      if (cursor < 24) gaps.push([cursor, 24]);
      for (const [s, e] of gaps) {
        points.push({ x: s * H, x2: e * H, y: yi, color: inactiveColor } as Highcharts.XrangePointOptionsObject);
      }
    }
  });
  return points;
}

export function ScheduleChart({
  days,
  schedule,
  activeColor   = '#226ecd', // var(--vc-1)      blue-600
  inactiveColor = '#838e98', // var(--vc-neutral) neutral-400
  showInactive  = true,
  pointWidth    = 18,
  tooltip       = 'enabled',
  height,
  title,
}: ScheduleChartProps) {
  const allPoints = scheduleToPoints(schedule, days, activeColor, inactiveColor, showInactive);

  return (
    <PlaygroundChart
      height={height ?? (days.length * 36 + 60)}
      options={{
        chart: { type: 'xrange' },
        title: { text: title ?? '' },
        xAxis: {
          min: 0,
          max: 24 * H,
          type: 'datetime',
          dateTimeLabelFormats: { hour: '%H:%M', day: '%H:%M' },
          tickPositions: [0, 4, 8, 12, 16, 20, 24].map((h) => h * H),
          title: { text: '' },
        },
        yAxis: {
          categories: days,
          reversed: true,
          title: { text: '' },
          gridLineWidth: 0,
        },
        legend: { enabled: false },
        tooltip: tooltip === 'disabled'
          ? { enabled: false }
          : {
              useHTML: true,
              outside: true,
              formatter: function () {
                const pt = this.point as { x: number; x2: number; y: number; color: string };
                if (pt.color === inactiveColor) return false as unknown as string;
                const day    = days[pt.y ?? 0];
                const startH = Math.round((pt.x  ?? 0) / H);
                const endH   = Math.round((pt.x2 ?? 0) / H);
                return `<b>${day}</b>: ${String(startH).padStart(2, '0')}:00\u2013${String(endH).padStart(2, '0')}:00`;
              },
            },
        plotOptions: {
          xrange: {
            borderRadius: 4,
            pointWidth,
            dataLabels: { enabled: false },
          },
        } as Highcharts.PlotOptions,
        series: [{ type: 'xrange', name: 'Schedule', data: allPoints }],
        credits: { enabled: false },
      }}
    />
  );
}

// ─── After Verity layout panel ────────────────────────────────────────────────

const panelWrapStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0,1fr) 360px',
  gap: 24,
  alignItems: 'flex-start',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: 13,
  color: '#111827',
};

const badgeStyle: CSSProperties = {
  display: 'inline-block',
  fontSize: 11,
  fontWeight: 700,
  background: '#D1FAE5',
  color: '#065F46',
  padding: '2px 8px',
  borderRadius: 4,
  letterSpacing: 0.4,
  marginRight: 8,
};

const subtitleStyle: CSSProperties = { fontSize: 11, color: '#9CA3AF' };

const rightPanelStyle: CSSProperties = {
  padding: 16,
  borderRadius: 8,
  background: '#F9FAFB',
  border: '1px solid #E5E7EB',
};

const labelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: '#6B7280',
  marginBottom: 8,
  marginTop: 0,
};

const codeBlockStyle: CSSProperties = {
  margin: 0,
  background: '#1E293B',
  color: '#E2E8F0',
  padding: 12,
  borderRadius: 6,
  fontSize: 11,
  lineHeight: 1.7,
  overflowX: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
};

export function AfterVerityPanel({
  primitiveName,
  consumerCode,
  source,
  children,
}: {
  primitiveName: string;
  consumerCode: string;
  source: { surface: string; file: string };
  children: ReactNode;
}) {
  return (
    <div style={panelWrapStyle}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <span style={badgeStyle}>AFTER &mdash; {primitiveName}</span>
          <span style={subtitleStyle}>Rendered via simulated Verity primitive</span>
        </div>
        {children}
      </div>
      <div style={rightPanelStyle}>
        <div style={labelStyle}>Consumer code</div>
        <pre style={codeBlockStyle}>
          <code>{consumerCode}</code>
        </pre>
        <div style={{ ...labelStyle, marginTop: 14 }}>Production source</div>
        <div style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>{source.surface}</div>
        <div
          style={{
            fontSize: 10,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            color: '#6B7280',
            wordBreak: 'break-all',
          }}
        >
          {source.file}
        </div>
      </div>
    </div>
  );
}
