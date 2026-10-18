import { StyleSheet } from 'react-native';

// Colors
export const colors = {
  white: '#FFFFFF',
  ink: '#0A0A0A',
  inkSoft: '#262626',
  inkMuted: '#363636',
  gray25: '#FAFAFA',
  gray50: '#F6F6F6',
  gray100: '#EEEEEE',
  gray200: '#E2E2E2',
  gray300: '#CFCFCF',
  gray600: '#5C5C5C',
  gray700: '#3D3D3D',
  surface: '#F3F3F3',
  surfacePressed: '#E9E9E9',
  heroTop: '#EEEEEE',
  heroBottom: '#F5F5F5',
  heroFade: 'rgba(245, 245, 245, 0)',
  muted: '#777777',
  soft: '#666666',
  onDarkMuted: '#B5B5B5',
  onDarkLabel: '#A8A8A8',
  accent: '#FF5A1F',
  success: '#1D7A46',
  warning: '#B54708',
  danger: '#C4361B',
  dangerBg: '#FDF0EC',
} as const;

// Font families
export const fonts = {
  light: 'Manrope_300Light',
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extrabold: 'Manrope_800ExtraBold',
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
} as const;

// Spacing scale
export const space = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  section: 48,
  sectionLg: 72,
} as const;

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  pill: 999,
} as const;

// Shared text styles
export const type = StyleSheet.create({
  display: {
    fontFamily: fonts.light,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.4,
    color: colors.ink,
  },
  title: {
    fontFamily: fonts.light,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.3,
    color: colors.ink,
  },
  heading: {
    fontFamily: fonts.semibold,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.2,
    color: colors.ink,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 25,
    color: colors.soft,
  },
  small: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink,
  },
  eyebrow: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  micro: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.soft,
  },
  price: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.ink,
  },
});
