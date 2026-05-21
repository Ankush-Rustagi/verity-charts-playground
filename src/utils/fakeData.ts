import { BAND_COLORS } from '../primitives/chartColors';

const SEED_DEFAULT = 1729;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type SeriesPoint = [number, number];

type TimeSeriesOpts = {
  start?: Date;
  stepMs?: number;
  count?: number;
  base?: number;
  amplitude?: number;
  noise?: number;
  trend?: number;
  seed?: number;
};

export function fakeTimeSeries({
  start = new Date('2026-05-01T08:00:00Z'),
  stepMs = 15 * 60 * 1000,
  count = 96,
  base = 50,
  amplitude = 20,
  noise = 5,
  trend = 0,
  seed = SEED_DEFAULT,
}: TimeSeriesOpts = {}): SeriesPoint[] {
  const rand = mulberry32(seed);
  const startMs = start.getTime();
  const points: SeriesPoint[] = [];
  for (let i = 0; i < count; i += 1) {
    const t = startMs + i * stepMs;
    const wave = amplitude * Math.sin(i / 6);
    const n = (rand() - 0.5) * 2 * noise;
    const v = base + wave + n + trend * i;
    points.push([t, Math.round(v * 100) / 100]);
  }
  return points;
}

export function fakeColumnSeries({
  count = 24,
  base = 100,
  amplitude = 40,
  noise = 15,
  seed = SEED_DEFAULT,
  startHourLabel = 0,
}: {
  count?: number;
  base?: number;
  amplitude?: number;
  noise?: number;
  seed?: number;
  startHourLabel?: number;
} = {}): { categories: string[]; values: number[] } {
  const rand = mulberry32(seed);
  const categories: string[] = [];
  const values: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const hour = (startHourLabel + i) % 24;
    categories.push(`${String(hour).padStart(2, '0')}:00`);
    const wave = amplitude * Math.max(0, Math.sin(i / 4));
    const n = (rand() - 0.5) * 2 * noise;
    values.push(Math.max(0, Math.round(base + wave + n)));
  }
  return { categories, values };
}

export function fakeArearange({
  count = 96,
  base = 40,
  spread = 12,
  noise = 4,
  seed = SEED_DEFAULT,
  start = new Date('2026-05-01T00:00:00Z'),
  stepMs = 15 * 60 * 1000,
}: {
  count?: number;
  base?: number;
  spread?: number;
  noise?: number;
  seed?: number;
  start?: Date;
  stepMs?: number;
} = {}): [number, number, number][] {
  const rand = mulberry32(seed);
  const out: [number, number, number][] = [];
  const startMs = start.getTime();
  for (let i = 0; i < count; i += 1) {
    const t = startMs + i * stepMs;
    const center = base + 10 * Math.sin(i / 8);
    const localSpread = spread + (rand() - 0.5) * 2 * noise;
    out.push([t, center - localSpread / 2, center + localSpread / 2]);
  }
  return out;
}

export function fakePlotBands({
  count = 3,
  start = new Date('2026-05-01T09:00:00Z'),
  spacingMs = 4 * 60 * 60 * 1000,
  bandWidthMs = 45 * 60 * 1000,
}: {
  count?: number;
  start?: Date;
  spacingMs?: number;
  bandWidthMs?: number;
} = {}): { from: number; to: number; color: string; label: string }[] {
  const palette = [BAND_COLORS.danger, BAND_COLORS.warning, BAND_COLORS.neutral];
  const labels = ['Alert: motion', 'Alert: temperature high', 'Alert: door ajar'];
  const startMs = start.getTime();
  const bands = [];
  for (let i = 0; i < count; i += 1) {
    const from = startMs + i * spacingMs;
    bands.push({
      from,
      to: from + bandWidthMs,
      color: palette[i % palette.length],
      label: labels[i % labels.length],
    });
  }
  return bands;
}
