/**
 * Single source of truth for all Verity chart color tokens and typography.
 *
 * All hex values are sourced from verkadaTokens.ts (Verkada design system).
 * Change a value in verkadaTokens.ts and it propagates here automatically.
 *
 * This file then propagates to:
 *   - VeritySimPrimitives (PALETTE_HEX, ZONE_PALETTE_HEX, STATUS_HEX)
 *   - ColorPaletteReference story (LIGHT / DARK token objects)
 *   - Any other consumer that imports from this file
 */

// ─── Typography ──────────────────────────────────────────────────────────────

/** Font family used in all Verity charts (Highcharts + visx). */
export const CHART_FONT_FAMILY = '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

import { BLUE, CYAN, RED, GREEN, YELLOW, VIOLET, ORANGE, PURPLE, NEUTRAL } from './verkadaTokens';

// ─── Light-mode chart tokens ─────────────────────────────────────────────────

export const LIGHT_CHART = {
  // Categorical – 8 Verkada design system tokens
  vc1: BLUE[600],    // #226ecd  blue-600
  vc2: CYAN[500],    // #19a0d5  cyan-500
  vc3: VIOLET[500],  // #6565d9  violet-500
  vc4: YELLOW[500],  // #fb9717  yellow-500
  vc5: RED[400],     // #de3243  red-400
  vc6: GREEN[500],   // #14ba74  green-500
  vc7: PURPLE[600],  // #893dcd  purple-600
  vc8: ORANGE[500],  // #ff5500  orange-500
  // Status – semantic health-state tokens
  vcSuccess: GREEN[500],    // #14ba74
  vcWarning: YELLOW[600],   // #f18313
  vcDanger:  RED[400],      // #de3243
  vcNeutral: NEUTRAL[300],  // #949ca5
  // Sequential – Verkada blue scale, blue-10 → blue-800
  vs1: BLUE[10],   // #dee9f8
  vs2: BLUE[50],   // #9cbee9
  vs3: BLUE[100],  // #6fa1de
  vs4: BLUE[300],  // #4e8bd7
  vs5: BLUE[500],  // #347ad1
  vs6: BLUE[600],  // #226ecd
  vs7: BLUE[700],  // #1d5eae
  vs8: BLUE[800],  // #184d8f
  // Diverging – red-400 → neutral-75 → blue-700
  vdNeg2: RED[500],       // #cb2939
  vdNeg1: RED[100],       // #f3847d
  vdMid:  NEUTRAL[75],    // #dce0e4
  vdPos1: BLUE[50],       // #9cbee9
  vdPos2: BLUE[700],      // #1d5eae
} as const;

// ─── Dark-mode chart tokens ──────────────────────────────────────────────────

export const DARK_CHART = {
  // Categorical – lighter variants for dark backgrounds
  vc1: BLUE[300],    // #4e8bd7
  vc2: CYAN[300],    // #63d0f5
  vc3: VIOLET[200],  // #9999ff
  vc4: YELLOW[300],  // #feb756
  vc5: RED[200],     // #ed6c69
  vc6: GREEN[300],   // #52d393
  vc7: PURPLE[300],  // #a164d7
  vc8: ORANGE[300],  // #ff7733
  // Status – adapted for dark surfaces
  vcSuccess: GREEN[300],    // #52d393
  vcWarning: YELLOW[300],   // #feb756
  vcDanger:  RED[200],      // #ed6c69
  vcNeutral: NEUTRAL[200],  // #b0b6be
  // Sequential – reversed (blue-800 → blue-10 on dark bg)
  vs1: BLUE[800],  // #184d8f
  vs2: BLUE[700],  // #1d5eae
  vs3: BLUE[600],  // #226ecd
  vs4: BLUE[500],  // #347ad1
  vs5: BLUE[300],  // #4e8bd7
  vs6: BLUE[100],  // #6fa1de
  vs7: BLUE[50],   // #9cbee9
  vs8: BLUE[10],   // #dee9f8
  // Diverging – dark-mode adjusted
  vdNeg2: RED[200],      // #ed6c69
  vdNeg1: RED[100],      // #f3847d
  vdMid:  NEUTRAL[700],  // #3f515f
  vdPos1: BLUE[300],     // #4e8bd7
  vdPos2: BLUE[500],     // #347ad1
} as const;

// ─── Derived exports for VeritySimPrimitives ─────────────────────────────────

/** Ordered palette arrays consumed by PALETTE_HEX in VeritySimPrimitives. */
export const PALETTE_ARRAYS = {
  categorical: [
    LIGHT_CHART.vc1, LIGHT_CHART.vc2, LIGHT_CHART.vc3, LIGHT_CHART.vc4,
    LIGHT_CHART.vc5, LIGHT_CHART.vc6, LIGHT_CHART.vc7, LIGHT_CHART.vc8,
  ],
  sequential: [
    LIGHT_CHART.vs1, LIGHT_CHART.vs2, LIGHT_CHART.vs3, LIGHT_CHART.vs4,
    LIGHT_CHART.vs5, LIGHT_CHART.vs6, LIGHT_CHART.vs7, LIGHT_CHART.vs8,
  ],
  diverging: [
    LIGHT_CHART.vdNeg2, LIGHT_CHART.vdNeg1, LIGHT_CHART.vdMid,
    LIGHT_CHART.vdPos1, LIGHT_CHART.vdPos2,
  ],
  status: [
    LIGHT_CHART.vcSuccess, LIGHT_CHART.vcWarning,
    LIGHT_CHART.vcDanger,  LIGHT_CHART.vcNeutral,
  ],
};

/** Named status colors consumed by STATUS_HEX in VeritySimPrimitives. */
export const STATUS_COLORS = {
  success: LIGHT_CHART.vcSuccess,
  warning: LIGHT_CHART.vcWarning,
  danger:  LIGHT_CHART.vcDanger,
  neutral: LIGHT_CHART.vcNeutral,
};

/** Converts a 6-digit hex color to rgba with the given alpha (0–1). */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Low-opacity fills for xBands plot-band overlays.
 * Derived from status tokens so they stay in sync when token values change.
 */
export const BAND_COLORS = {
  danger:  hexToRgba(LIGHT_CHART.vcDanger,  0.15),
  warning: hexToRgba(LIGHT_CHART.vcWarning, 0.15),
  neutral: hexToRgba(LIGHT_CHART.vcNeutral, 0.12),
  info:    hexToRgba(LIGHT_CHART.vc1,       0.12),
};
