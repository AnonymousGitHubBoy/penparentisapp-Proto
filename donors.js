// donors.js — the list behind US 8 (the banner scroll) and the Info sheet's donor grid.
//
// Kept as plain data on purpose: whoever manages the donor list shouldn't have
// to open component code to add a name. Later this can be swapped for a fetch
// from the same backend that issues unlock codes, with zero changes to the
// two components that read it.

export const DONORS = [
  'Nina R.',
  'The de Groot Foundation',
  'Hiro T.',
  'Anonymous ×2',
  'Poetry Foundation',
  'Dee & Marcus',
  'New York State Council on the Arts',
  'Leah B.',
];

// Credits shown in the Info sheet (US 7). Fill in real names before shipping.
export const CREDITS = [
  { role: 'Design & development', name: '—' },
];
