/**
 * Verkada design system color tokens — CSS custom property values.
 *
 * Source: copied from the Verkada design system CSS variables.
 * Use these constants in chartColors.ts instead of raw hex strings.
 *
 * Import only what you need:
 *   import { BLUE, NEUTRAL, STATUS_TOKENS } from './verkadaTokens';
 */

export const BRAND = {
  10: '#f1faff', 25: '#e6f3fa', 50: '#dcf1fc',
  100: '#c5e3f3', 200: '#b1d9ee', 250: '#9fcbe2', 300: '#8bc7e6',
  400: '#55adda', 500: '#359dd3', 600: '#0285c8', 700: '#0279b6',
  750: '#015e8e', 800: '#01496e', 850: '#04354f', 900: '#082b3e', 950: '#001926',
} as const;

export const BLUE = {
  offWhite: '#edf3fb',
  10:   '#dee9f8',
  25:   '#bdd3f0',
  50:   '#9cbee9',
  75:   '#85afe3',
  100:  '#6fa1de',
  200:  '#6097db',
  300:  '#4e8bd7',
  400:  '#4384d5',
  500:  '#347ad1',
  600:  '#226ecd',
  700:  '#1d5eae',
  800:  '#184d8f',
  900:  '#0f325c',
  1000: '#122740',
} as const;

export const CYAN = {
  digi: '#6beeff',
  offWhite: '#f3fbfe',
  10: '#e1f5fc', 25: '#cfeffb', 50: '#bde9fa', 75: '#a9e3f8',
  100: '#95ddf7', 200: '#7ed6f6', 300: '#63d0f5', 400: '#3ac1eb',
  500: '#19a0d5', 600: '#007faf', 700: '#115274', 800: '#15374c', 900: '#002033',
} as const;

export const RED = {
  digi: '#ff6e6e',
  offWhite: '#fff2f0',
  10: '#ffdcd7', 25: '#fec7bf', 50: '#fcb1a8', 75: '#f89b92',
  100: '#f3847d', 200: '#ed6c69', 300: '#e65255', 400: '#de3243',
  500: '#cb2939', 600: '#b01d2b', 700: '#8d162a', 800: '#66132e',
  900: '#471327', 1000: '#3d0101',
} as const;

export const GREEN = {
  digi: '#2af29e',
  offWhite: '#f3fcf6',
  10: '#dff7e7', 25: '#caf1d9', 50: '#b6ebca', 75: '#a0e5bc',
  100: '#89dfae', 200: '#6fd9a1', 300: '#52d393', 400: '#26cc86',
  500: '#14ba74', 600: '#249c69', 700: '#1c7c5a', 800: '#145c4a',
  900: '#0d3a35', 1000: '#112b2d',
} as const;

export const YELLOW = {
  digi: '#ffd959',
  offWhite: '#fffbf1',
  10: '#fdf2da', 25: '#fde9c3', 50: '#fce0ad', 75: '#fcd696',
  100: '#fdcc81', 200: '#fdc26b', 300: '#feb756', 400: '#ffab40',
  500: '#fb9717', 600: '#f18313', 700: '#c35d03', 800: '#a33d02',
  900: '#6b2405', 1000: '#311b12',
} as const;

export const VIOLET = {
  digi: '#7777ff',
  offWhite: '#f1f1ff',
  10: '#e4e4ff', 25: '#d6d6ff', 50: '#c9c9ff', 75: '#bbbbff',
  100: '#a7a7ff', 200: '#9999ff', 300: '#8b8bff', 400: '#7777ff',
  500: '#6565d9', 600: '#5353b2', 700: '#3e3e85', 800: '#32326b', 900: '#212147',
} as const;

export const TURQUOISE = {
  digi: '#11cccc',
  offWhite: '#ecfbfb',
  10: '#dbf7f7', 25: '#b8f0f0', 50: '#94e8e8', 75: '#70e0e0',
  100: '#54dada', 200: '#32d3d3', 300: '#11cccc', 400: '#10c0c0',
  500: '#0fb4b4', 600: '#0d9999', 700: '#0a7a7a', 800: '#085c5c', 900: '#042d2d',
} as const;

export const PURPLE = {
  digi: '#893dcd',
  offWhite: '#f6effb',
  10: '#ede2f8', 25: '#dcc5f0', 50: '#caa8e9', 75: '#be94e3',
  100: '#b281de', 200: '#aa73db', 300: '#a164d7', 400: '#9b5ad5',
  500: '#924dd1', 600: '#893dcd', 700: '#692f9e', 800: '#52257b',
  900: '#371852', 1000: '#251a3b',
} as const;

export const ORANGE = {
  digi: '#ff5500',
  offWhite: '#fff1eb',
  10: '#ffe6d9', 25: '#ffccb2', 50: '#ffb28c', 75: '#ffa173',
  100: '#ff9059', 200: '#ff8547', 300: '#ff7733', 400: '#ff661a',
  500: '#ff5500', 600: '#e54d00', 700: '#b23c00', 800: '#802b00', 900: '#4d1a00',
} as const;

export const NEUTRAL = {
  offWhite: '#f7f9fb',
  offBlack: '#030e16',
  10: '#eff3f7', 25: '#eaeff3', 50: '#e6eaee', 75: '#dce0e4',
  100: '#cdd1d7', 200: '#b0b6be', 300: '#949ca5', 400: '#838e98',
  500: '#73808c', 600: '#536573', 700: '#3f515f', 800: '#2c3e4c',
  900: '#192630', 950: '#0f1b24',
} as const;

export const GRAY = {
  0: '#fdfefe', 10: '#f8f9f9', 25: '#f2f3f3', 50: '#eaebeb', 75: '#dce0e4',
  100: '#bfbfc0', 200: '#a0a1a2', 250: '#8d8d8d', 300: '#757678',
  400: '#5a5b5d', 450: '#45494c', 500: '#313235', 600: '#2d2e30',
  700: '#232426', 800: '#1b1c1d', 900: '#151516',
} as const;

export const SLATE = {
  0: '#fafafa', 50: '#f4f4f5', 100: '#e3e5e8', 200: '#d2d5da',
  400: '#9da3ae', 500: '#6d737e', 600: '#4e545f', 700: '#2e3238',
  750: '#313640', 800: '#24282e', 850: '#1a1d21', 900: '#181a1e',
  950: '#0e1012', 1000: '#08090c',
} as const;

// ─── Semantic aliases used throughout chartColors.ts ─────────────────────────

/** Convenience re-exports used as semantic status color sources. */
export const STATUS_TOKENS = {
  success: GREEN[500],   // #14ba74
  warning: YELLOW[600],  // #f18313
  danger:  RED[400],     // #de3243
  neutral: NEUTRAL[300], // #949ca5  (updated from a0adb8; see NEUTRAL[300])
} as const;
