import { StyleSheet, Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: "'Stack Sans Notch', system-ui, -apple-system, sans-serif",
  android: "'Stack Sans Notch', system-ui, sans-serif",
  default: "'Stack Sans Notch', system-ui, sans-serif",
});

const WEIGHT_BOLD = '700' as const;
const WEIGHT_SEMIBOLD = '600' as const;
const WEIGHT_REGULAR = '400' as const;

export const typography = StyleSheet.create({
  'display-mega': {
    fontFamily,
    fontSize: 126,
    fontWeight: WEIGHT_BOLD,
    lineHeight: 107.1,
    letterSpacing: 0,
  },
  'display-xxl': {
    fontFamily,
    fontSize: 96,
    fontWeight: WEIGHT_BOLD,
    lineHeight: 81.6,
    letterSpacing: 0,
  },
  'display-xl': {
    fontFamily,
    fontSize: 64,
    fontWeight: WEIGHT_BOLD,
    lineHeight: 54.4,
    letterSpacing: 0,
  },
  'display-lg': {
    fontFamily,
    fontSize: 47,
    fontWeight: WEIGHT_REGULAR,
    lineHeight: 70.5,
    letterSpacing: -0.108,
  },
  'display-md': {
    fontFamily,
    fontSize: 40,
    fontWeight: WEIGHT_BOLD,
    lineHeight: 34,
    letterSpacing: 0,
  },
  'display-sm': {
    fontFamily,
    fontSize: 32,
    fontWeight: WEIGHT_SEMIBOLD,
    lineHeight: 38.4,
    letterSpacing: -0.96,
  },
  'display-xs': {
    fontFamily,
    fontSize: 24,
    fontWeight: WEIGHT_SEMIBOLD,
    lineHeight: 31.2,
    letterSpacing: -0.48,
  },
  'body-lg': {
    fontFamily,
    fontSize: 20,
    fontWeight: WEIGHT_REGULAR,
    lineHeight: 30,
    letterSpacing: 0,
  },
  'body-md': {
    fontFamily,
    fontSize: 16,
    fontWeight: WEIGHT_REGULAR,
    lineHeight: 24,
    letterSpacing: 0,
  },
  'body-md-strong': {
    fontFamily,
    fontSize: 16,
    fontWeight: WEIGHT_SEMIBOLD,
    lineHeight: 24,
    letterSpacing: 0,
  },
  'body-sm': {
    fontFamily,
    fontSize: 14,
    fontWeight: WEIGHT_REGULAR,
    lineHeight: 20,
    letterSpacing: 0,
  },
  'body-sm-strong': {
    fontFamily,
    fontSize: 14,
    fontWeight: WEIGHT_SEMIBOLD,
    lineHeight: 20,
    letterSpacing: 0,
  },
  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: WEIGHT_REGULAR,
    lineHeight: 16,
    letterSpacing: 0,
  },
  'button-md': {
    fontFamily,
    fontSize: 16,
    fontWeight: WEIGHT_SEMIBOLD,
    lineHeight: 24,
    letterSpacing: 0,
  },
});

export const useTypography = () => typography;

export const fontAssets = {
  'Stack Sans Notch': require('@/assets/fonts/StackSansNotch.ttf'),
};
