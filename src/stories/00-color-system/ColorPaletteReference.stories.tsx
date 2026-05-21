import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LIGHT_CHART, DARK_CHART, CHART_FONT_FAMILY } from '../../primitives/chartColors';

// ─── Token definitions ────────────────────────────────────────────────────────
// Chart colors come from chartColors.ts (single source of truth).
// Only UI chrome tokens (bg, surface, border, text, etc.) are defined here.

const LIGHT = {
  bg: '#f5f6f8', surface: '#ffffff', border: '#e6eaee',
  text: '#1a1d23', textMuted: '#6b7280', radius: '10px',
  shadow: '0 1px 4px rgba(0,0,0,.08)',
  chartGrid: '#e6eaee', chartAxis: '#949ca5',
  ...LIGHT_CHART,
};

const DARK = {
  bg: '#0f1117', surface: '#1a1d23', border: '#2d3140',
  text: '#f0f1f5', textMuted: '#9ca3af', radius: '10px',
  shadow: '0 1px 4px rgba(0,0,0,.4)',
  chartGrid: '#313640', chartAxis: '#6d737e',
  ...DARK_CHART,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Swatch({ color, token, label }: { color: string; token: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <div
        style={{
          width: 52, height: 52, borderRadius: 8,
          background: color,
          border: '1px solid rgba(0,0,0,.08)',
          transition: 'transform .15s',
          cursor: 'default',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        title={`${token}: ${color}`}
      />
      <div style={{ fontSize: 10, textAlign: 'center', lineHeight: 1.3, maxWidth: 54 }}>
        {token}<br /><span style={{ fontWeight: 500 }}>{label}</span>
      </div>
    </div>
  );
}

function MiniBar({ color, height }: { color: string; height: string }) {
  return (
    <div
      style={{
        flex: 1, minWidth: 14, maxWidth: 40,
        height,
        background: color,
        borderRadius: '3px 3px 0 0',
        transition: 'opacity .2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '.7')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    />
  );
}

function Section({
  t, title, badge, description, note, children,
}: {
  t: typeof LIGHT;
  title: string;
  badge?: string;
  description: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: t.surface, border: `1px solid ${t.border}`,
        borderRadius: t.radius, boxShadow: t.shadow,
        padding: 24, marginBottom: 24,
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: t.text }}>
          {title}
          {badge && (
            <span style={{
              display: 'inline-block', fontSize: 10, fontWeight: 600,
              letterSpacing: '.4px', textTransform: 'uppercase',
              padding: '2px 7px', borderRadius: 4,
              background: t.border, color: t.textMuted,
              marginLeft: 8, verticalAlign: 'middle',
            }}>{badge}</span>
          )}
        </h2>
        <p style={{ fontSize: 12, color: t.textMuted, marginTop: 3 }}>{description}</p>
      </div>
      {children}
      <div style={{
        fontSize: 12, color: t.textMuted,
        borderTop: `1px solid ${t.border}`,
        paddingTop: 14, marginTop: 20,
      }}>
        {note}
      </div>
    </div>
  );
}

function ChartLabel({ t, children }: { t: typeof LIGHT; children: string }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, color: t.textMuted,
      textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

function MiniChartWrap({ t, children }: { t: typeof LIGHT; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', gap: 5,
      height: 80,
      borderBottom: `1px solid ${t.chartGrid}`,
      borderLeft: `1px solid ${t.chartGrid}`,
      padding: '4px 4px 0',
    }}>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function ColorPaletteReference() {
  const [dark, setDark] = useState(false);
  const t = dark ? DARK : LIGHT;

  const font = CHART_FONT_FAMILY;

  return (
    <div style={{
      fontFamily: font, background: t.bg, color: t.text,
      padding: '32px 24px 64px', minHeight: '100vh',
      transition: 'background .2s, color .2s',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: 40, gap: 16, flexWrap: 'wrap',
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: t.text }}>Verity Chart Color Palettes</h1>
          <p style={{ fontSize: 13, color: t.textMuted, marginTop: 4, maxWidth: 520 }}>
            Visual reference for the four named palette presets defined in the design system spec.
            Token names map directly to the <code>colorPalette</code> and <code>status</code> props on each primitive.
          </p>
        </div>
        <button
          onClick={() => setDark(d => !d)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 13, color: t.textMuted, cursor: 'pointer',
            background: 'none', border: 'none', padding: '4px 0',
            fontFamily: font,
          }}
        >
          {dark ? '☀ Light mode' : '☽ Dark mode'}
          <div style={{
            width: 36, height: 20, borderRadius: 10,
            background: dark ? t.vc1 : t.border,
            position: 'relative', transition: 'background .2s',
          }}>
            <div style={{
              width: 14, height: 14, borderRadius: '50%', background: '#fff',
              position: 'absolute', top: 3,
              left: dark ? 19 : 3,
              transition: 'left .2s',
              boxShadow: '0 1px 3px rgba(0,0,0,.25)',
            }} />
          </div>
        </button>
      </div>

      {/* ─── CATEGORICAL ─── */}
      <Section
        t={t}
        title="Categorical"
        badge="Default"
        description="8 distinct colors for comparing independent series. No implied order or magnitude relationship between colors."
        note="Consumers: ColumnChart, BarChart, LineChart, ScatterChart (multi-series)"
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
          {[
            { color: t.vc1, token: '--vc-1', label: 'blue-600' },
            { color: t.vc2, token: '--vc-2', label: 'cyan-500' },
            { color: t.vc3, token: '--vc-3', label: 'violet-500' },
            { color: t.vc4, token: '--vc-4', label: 'yellow-500' },
            { color: t.vc5, token: '--vc-5', label: 'red-400' },
            { color: t.vc6, token: '--vc-6', label: 'green-500' },
            { color: t.vc7, token: '--vc-7', label: 'purple-600' },
            { color: t.vc8, token: '--vc-8', label: 'orange-500' },
          ].map(s => <Swatch key={s.token} color={s.color} token={s.token} label={s.label} />)}
        </div>
        <ChartLabel t={t}>Preview: multi-series bar chart</ChartLabel>
        <MiniChartWrap t={t}>
          {([
            [t.vc1, '72%'], [t.vc2, '55%'], [t.vc3, '88%'], [t.vc4, '40%'],
            [t.vc5, '65%'], [t.vc6, '50%'], [t.vc7, '30%'], [t.vc8, '78%'],
          ] as [string, string][]).map(([color, h], i) => (
            <MiniBar key={i} color={color} height={h} />
          ))}
        </MiniChartWrap>
      </Section>

      {/* ─── SEQUENTIAL + DIVERGING (2-col) ─── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24,
        marginBottom: 24,
      }}>
        {/* Sequential */}
        <div
          style={{
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: t.radius, boxShadow: t.shadow, padding: 24,
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: t.text }}>Sequential</h2>
            <p style={{ fontSize: 12, color: t.textMuted, marginTop: 3 }}>
              Verkada blue, 8 steps light-to-dark (blue-10 → blue-800). For data where magnitude matters.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
            {[
              { color: t.vs1, token: '--vs-1', label: 'blue-10' },
              { color: t.vs2, token: '--vs-2', label: 'blue-50' },
              { color: t.vs3, token: '--vs-3', label: 'blue-100' },
              { color: t.vs4, token: '--vs-4', label: 'blue-300' },
              { color: t.vs5, token: '--vs-5', label: 'blue-500' },
              { color: t.vs6, token: '--vs-6', label: 'blue-600' },
              { color: t.vs7, token: '--vs-7', label: 'blue-700' },
              { color: t.vs8, token: '--vs-8', label: 'blue-800' },
            ].map(s => <Swatch key={s.token} color={s.color} token={s.token} label={s.label} />)}
          </div>
          <ChartLabel t={t}>Preview: magnitude column chart</ChartLabel>
          <MiniChartWrap t={t}>
            {([
              [t.vs1, '10%'], [t.vs2, '22%'], [t.vs3, '34%'], [t.vs4, '47%'],
              [t.vs5, '59%'], [t.vs6, '71%'], [t.vs7, '83%'], [t.vs8, '95%'],
            ] as [string, string][]).map(([color, h], i) => (
              <MiniBar key={i} color={color} height={h} />
            ))}
          </MiniChartWrap>
          <div style={{
            fontSize: 12, color: t.textMuted, borderTop: `1px solid ${t.border}`,
            paddingTop: 14, marginTop: 20,
          }}>
            Consumers: occupancy density, signal strength, bandwidth usage
          </div>
        </div>

        {/* Diverging */}
        <div
          style={{
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: t.radius, boxShadow: t.shadow, padding: 24,
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: t.text }}>Diverging</h2>
            <p style={{ fontSize: 12, color: t.textMuted, marginTop: 3 }}>
              Two hues from a neutral midpoint. For data with a meaningful zero or baseline.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
            {[
              { color: t.vdNeg2, token: '--vd-neg2', label: 'red-500' },
              { color: t.vdNeg1, token: '--vd-neg1', label: 'red-100' },
              { color: t.vdMid,  token: '--vd-mid',  label: 'neutral-75' },
              { color: t.vdPos1, token: '--vd-pos1', label: 'blue-50' },
              { color: t.vdPos2, token: '--vd-pos2', label: 'blue-700' },
            ].map(s => <Swatch key={s.token} color={s.color} token={s.token} label={s.label} />)}
          </div>
          <ChartLabel t={t}>Preview: above/below baseline</ChartLabel>
          {/* Diverging chart: bars straddle a midline */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            height: 80,
            borderBottom: `1px solid ${t.chartGrid}`,
            borderLeft: `1px solid ${t.chartGrid}`,
            padding: '4px 4px 0',
            position: 'relative',
          }}>
            {/* midline */}
            <div style={{
              position: 'absolute', left: 0, right: 0, top: '50%',
              borderTop: `1px dashed ${t.chartAxis}`,
            }} />
            {/* neg bars hang from midline */}
            {([
              [t.vdNeg2, '70%', 'neg'],
              [t.vdNeg1, '35%', 'neg'],
              [t.vdMid,  '8%',  'pos'],
              [t.vdPos1, '38%', 'pos'],
              [t.vdPos2, '72%', 'pos'],
            ] as [string, string, 'neg' | 'pos'][]).map(([color, h, dir], i) => (
              <div
                key={i}
                style={{
                  flex: 1, minWidth: 14, maxWidth: 40,
                  height: h,
                  background: color,
                  borderRadius: 3,
                  alignSelf: dir === 'neg' ? 'flex-start' : 'flex-end',
                  transition: 'opacity .2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              />
            ))}
          </div>
          <div style={{
            fontSize: 12, color: t.textMuted, borderTop: `1px solid ${t.border}`,
            paddingTop: 14, marginTop: 20,
          }}>
            Consumers: access events vs. baseline, gateway uptime vs. SLA
          </div>
        </div>
      </div>

      {/* ─── STATUS ─── */}
      <Section
        t={t}
        title="Status"
        description="4 semantic tokens for alert-based charts. Values map to health states, not to data categories."
        note="Consumers: Gauge bands, ThresholdEditorChart zones, KPIValue delta coloring, LineChart zones"
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
          {[
            { color: t.vcSuccess, token: '--vc-success', label: 'green-500'  },
            { color: t.vcWarning, token: '--vc-warning', label: 'yellow-600' },
            { color: t.vcDanger,  token: '--vc-danger',  label: 'red-400'    },
            { color: t.vcNeutral, token: '--vc-neutral', label: 'neutral-300' },
          ].map(s => <Swatch key={s.token} color={s.color} token={s.token} label={s.label} />)}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {([
            { color: t.vcSuccess, label: 'Success', token: 'green-500',   desc: 'Within threshold, healthy, operational',      example: 'KPI delta positive, gauge in range, zone below alert level' },
            { color: t.vcWarning, label: 'Warning', token: 'yellow-600',  desc: 'Approaching threshold, degraded',             example: 'KPI delta neutral, gauge near limit, zone approaching alert level' },
            { color: t.vcDanger,  label: 'Danger',  token: 'red-400',     desc: 'Threshold breached, failing',                example: 'KPI delta negative, gauge over limit, alarm fired' },
            { color: t.vcNeutral, label: 'Neutral', token: 'neutral-300', desc: 'No signal, unknown, inactive',               example: 'Device offline, data not available, gauge bands with no condition' },
          ]).map(({ color, label, token, desc, example }) => (
            <div
              key={label}
              style={{
                flex: 1, minWidth: 140,
                borderRadius: 8, padding: '14px 16px',
                border: `1px solid rgba(0,0,0,.07)`,
                borderLeft: `3px solid ${color}`,
                background: t.surface,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                <span style={{
                  fontSize: 11, fontWeight: 600, color: t.textMuted,
                  textTransform: 'uppercase', letterSpacing: '.4px',
                }}>{label}</span>
              </div>
              <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2, fontWeight: 500 }}>{token}</div>
              <div style={{ fontSize: 12, color: t.text, marginTop: 6 }}>{desc}</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4, fontStyle: 'italic' }}>{example}</div>
            </div>
          ))}
        </div>

        {/* KPI strip */}
        <div style={{
          fontSize: 11, fontWeight: 600, color: t.textMuted,
          textTransform: 'uppercase', letterSpacing: '.4px',
          marginTop: 20, marginBottom: 10,
        }}>
          Preview: KPI strip using status tokens
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {([
            { label: 'Total events',    value: '12,483', delta: 'No change',        deltaColor: t.vcNeutral },
            { label: 'Failed events',   value: '347',    delta: '+12% vs last week', deltaColor: t.vcDanger,  valueColor: t.vcDanger },
            { label: 'Resolved alerts', value: '98%',    delta: '+3pp vs last week', deltaColor: t.vcSuccess, valueColor: t.vcSuccess },
            { label: 'Unique actors',   value: '41',     delta: '+5 vs last week',   deltaColor: t.vcSuccess },
          ]).map(({ label, value, delta, deltaColor, valueColor }) => (
            <div
              key={label}
              style={{
                flex: 1, minWidth: 120,
                background: t.bg, border: `1px solid ${t.border}`,
                borderRadius: 8, padding: '12px 14px',
              }}
            >
              <div style={{ fontSize: 11, color: t.textMuted }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, margin: '2px 0', color: valueColor ?? t.text }}>{value}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: deltaColor }}>{delta}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── Token quick-reference table ─── */}
      <div
        style={{
          background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: t.radius, boxShadow: t.shadow,
          padding: 24,
        }}
      >
        <h2 style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 16 }}>
          Token quick-reference
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%', borderCollapse: 'collapse',
            fontSize: 12, color: t.text,
          }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                {['Palette', 'Prop value', 'Tokens', 'Use when'].map(h => (
                  <th key={h} style={{
                    padding: '6px 12px', textAlign: 'left',
                    fontSize: 11, fontWeight: 600, color: t.textMuted,
                    textTransform: 'uppercase', letterSpacing: '.4px',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {([
                ['Categorical', 'colorPalette="categorical"', '--vc-1 … --vc-8',     'Multiple independent series, no implied order'],
                ['Sequential',  'colorPalette="sequential"',  '--vs-1 … --vs-8',     'Ordered data where magnitude matters'],
                ['Diverging',   'colorPalette="diverging"',   '--vd-neg2 … --vd-pos2', 'Data with a meaningful midpoint/baseline'],
                ['Status',      'colorPalette="status"  or  status="success|warning|danger|neutral"',
                                                              '--vc-success / warning / danger / neutral', 'Alert-based, health-state charts'],
              ] as [string, string, string, string][]).map(([pal, prop, tokens, when], i) => (
                <tr key={pal} style={{
                  borderBottom: `1px solid ${t.border}`,
                  background: i % 2 === 1 ? t.bg : 'transparent',
                }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600 }}>{pal}</td>
                  <td style={{ padding: '8px 12px' }}><code style={{ fontSize: 11 }}>{prop}</code></td>
                  <td style={{ padding: '8px 12px', color: t.textMuted }}>{tokens}</td>
                  <td style={{ padding: '8px 12px', color: t.textMuted }}>{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Story config ─────────────────────────────────────────────────────────────

const meta: Meta = {
  title: '00 Color System/Palette Reference',
  component: ColorPaletteReference,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Visual reference for all four Verity chart color palettes: Categorical (default), Sequential, Diverging, and Status. ' +
          'Toggle dark mode to see how each token adapts. Hover swatches for the exact hex. ' +
          'Use this page when discussing which palette to apply to a new chart type.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
