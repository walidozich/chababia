export const colors = {
  primary: '#9fe870',
  ink: '#163300',
  canvas: '#dddddd',
} as const;

export type ColorToken = keyof typeof colors;
