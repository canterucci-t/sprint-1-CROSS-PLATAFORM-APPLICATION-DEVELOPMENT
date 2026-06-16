export const COLORS = {
  primary: '#0B5C46',
  primaryLight: '#1F9D66',
  primaryBg: '#E8F6EF',
  warning: '#F2B705',
  warningBg: '#FFF8E1',
  danger: '#D64545',
  dangerBg: '#FDECEA',
  info: '#1E5AA8',
  infoBg: '#E3EDF8',
  text: '#263238',
  textSecondary: '#607D8B',
  background: '#F6F8FA',
  white: '#FFFFFF',
  gray: '#9E9E9E',
  grayLight: '#ECEFF1',
  border: '#E0E0E0',
  black: '#000000',
} as const;

export const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  normal: { bg: COLORS.primaryBg, text: COLORS.primary, border: COLORS.primaryLight },
  atencao: { bg: COLORS.warningBg, text: '#7B5800', border: COLORS.warning },
  corte_necessario: { bg: COLORS.dangerBg, text: COLORS.danger, border: COLORS.danger },
};
