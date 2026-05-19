import type { CSSProperties, ReactNode } from 'react';

type OptionAnnotation = {
  raw: string;
  verityProp: string;
  note?: string;
};

type ProductionSource = {
  surface: string;
  file: string;
};

type Props = {
  chart: ReactNode;
  propsAPI: OptionAnnotation[];
  productionSources: ProductionSource[];
  notes?: string;
};

const wrapperStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 360px',
  gap: 24,
  alignItems: 'flex-start',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: 13,
  color: '#111827',
};

const panelStyle: CSSProperties = {
  padding: 16,
  borderRadius: 8,
  background: '#F9FAFB',
  border: '1px solid #E5E7EB',
};

const sectionTitleStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: '#6B7280',
  marginBottom: 8,
  marginTop: 16,
};

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 12,
};

const thStyle: CSSProperties = {
  textAlign: 'left',
  padding: '6px 4px',
  borderBottom: '1px solid #E5E7EB',
  color: '#6B7280',
  fontWeight: 600,
};

const tdStyle: CSSProperties = {
  padding: '6px 4px',
  borderBottom: '1px solid #F3F4F6',
  verticalAlign: 'top',
};

const codeStyle: CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 11,
  background: '#FFFFFF',
  padding: '1px 4px',
  borderRadius: 3,
  border: '1px solid #E5E7EB',
};

export function PrimitiveStoryLayout({ chart, propsAPI, productionSources, notes }: Props) {
  return (
    <div style={wrapperStyle}>
      <div>{chart}</div>
      <div style={panelStyle}>
        <div style={{ ...sectionTitleStyle, marginTop: 0 }}>Proposed Verity prop API</div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Raw Highcharts option</th>
              <th style={thStyle}>Verity prop</th>
            </tr>
          </thead>
          <tbody>
            {propsAPI.map((p) => (
              <tr key={p.raw + p.verityProp}>
                <td style={tdStyle}>
                  <code style={codeStyle}>{p.raw}</code>
                  {p.note ? <div style={{ marginTop: 2, color: '#6B7280', fontSize: 11 }}>{p.note}</div> : null}
                </td>
                <td style={tdStyle}>
                  <code style={codeStyle}>{p.verityProp}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={sectionTitleStyle}>Production sources this primitive covers</div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Surface</th>
              <th style={thStyle}>Verkada-Web file</th>
            </tr>
          </thead>
          <tbody>
            {productionSources.map((s) => (
              <tr key={s.file}>
                <td style={tdStyle}>{s.surface}</td>
                <td style={{ ...tdStyle, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 10, wordBreak: 'break-all' }}>
                  {s.file}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {notes ? (
          <>
            <div style={sectionTitleStyle}>Design notes</div>
            <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{notes}</div>
          </>
        ) : null}
      </div>
    </div>
  );
}
