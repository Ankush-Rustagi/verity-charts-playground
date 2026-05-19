import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import type { CSSProperties } from 'react';

type Props = {
  options: Highcharts.Options;
  height?: number | string;
};

const DEFAULT_HEIGHT = 360;

export function PlaygroundChart({ options, height = DEFAULT_HEIGHT }: Props) {
  const wrapperStyle: CSSProperties = {
    width: '100%',
    height,
  };
  const merged: Highcharts.Options = {
    ...options,
    chart: {
      height,
      ...options.chart,
    },
  };
  return (
    <div style={wrapperStyle}>
      <HighchartsReact highcharts={Highcharts} options={merged} />
    </div>
  );
}
