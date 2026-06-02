import { TextStyle, Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  displaySm: {
    fontFamily,
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 38.4,
    letterSpacing: -0.96,
  },
  displayXs: {
    fontFamily,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 31.2,
    letterSpacing: -0.48,
  },
  bodyLg: {
    fontFamily,
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 30,
  },
  bodyMd: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyMdStrong: {
    fontFamily,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  bodySm: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  bodySmStrong: {
    fontFamily,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  buttonMd: {
    fontFamily,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyToken = keyof typeof typography;
