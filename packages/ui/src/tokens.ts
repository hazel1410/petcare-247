export const colors = {
  primary: '#4A9E8E',
  primaryLight: '#7BC4B4',
  primaryDark: '#2D7A6B',

  secondary: '#6B9FD4',
  secondaryLight: '#A3C8ED',
  secondaryDark: '#4A7FB5',

  accent: '#F5A623',
  accentLight: '#FFD580',

  background: '#F9F9F6',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F4F0',

  text: '#2C3E50',
  textSecondary: '#6B7C8D',
  textMuted: '#A0AEBF',

  error: '#E74C3C',
  errorLight: '#FADBD8',
  success: '#27AE60',
  successLight: '#D5F5E3',
  warning: '#F39C12',
  warningLight: '#FEF9E7',

  border: '#E0E6E8',
  borderLight: '#EEF2F4',

  urgencyCritical: '#E74C3C',
  urgencyUrgent: '#F39C12',
  urgencyModerate: '#F5A623',
  urgencyLow: '#27AE60',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  fontFamily: {
    regular: undefined,
    medium: undefined,
    bold: undefined,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    hero: 36,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
} as const;
