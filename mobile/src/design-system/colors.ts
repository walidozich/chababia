export const colors = {
  primary: '#9fe870',
  primaryActive: '#cdffad',
  primaryPale: '#e2f6d5',
  ink: '#0e0f0c',
  inkDeep: '#163300',
  body: '#454745',
  mute: '#868685',
  canvas: '#ffffff',
  canvasSoft: '#e8ebe6',
  positive: '#2ead4b',
  negative: '#d03238',
  warning: '#ffd11a',
} as const;

export type ColorToken = keyof typeof colors;
