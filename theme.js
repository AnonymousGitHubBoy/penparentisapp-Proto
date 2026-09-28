// theme.js — the single source of truth for colour and spacing.
// Same hex values as the mockup. Change them here, not in the screens.

export const colors = {
  royal: '#1B3FA0',
  royalLight: '#2449B4',   // top of button gradients
  royalDeep: '#0C2265',
  ink: '#0A1633',
  cream: '#F6EADA',
  creamDeep: '#E8D6B8',
  paper: '#FFFDF8',
  karma: '#C8912B',
  karmaLight: '#E0AE45',
  muted: '#5A6484',
  body: '#2A3352',
  line: 'rgba(10,22,51,0.13)',
  tabIdle: '#7B8399',
};

// Reused gradient pairs so headers and buttons stay consistent.
export const gradients = {
  header: [colors.royal, colors.royalDeep],
  button: [colors.royalLight, colors.royal],
  gold: [colors.karmaLight, colors.karma],
  card: [colors.paper, colors.cream],
};

// Two-layer blue-tinted shadow. iOS reads the shadow* keys, Android reads elevation.
export const lift = {
  shadowColor: colors.royalDeep,
  shadowOpacity: 0.22,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
};

export const space = { xs: 6, sm: 10, md: 16, lg: 22, xl: 30 };

export const radius = { sm: 8, md: 14, lg: 20, pill: 999 };
