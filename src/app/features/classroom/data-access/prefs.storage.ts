export const PREFS_KEY = 'learn-prefs';

export type Theme = 'paper' | 'ink';
export type TypeSize = 'comfortable' | 'large';
export type Motion = 'reduce' | 'a-little';

export type Prefs = {
  theme: Theme;
  typeSize: TypeSize;
  motion: Motion;
};

const defaults: Prefs = {
  theme: 'paper',
  typeSize: 'comfortable',
  motion: 'reduce',
};

export function readPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { ...defaults };
    const parsed = JSON.parse(raw) as Partial<Prefs>;
    return {
      theme: parsed.theme === 'ink' ? 'ink' : 'paper',
      typeSize: parsed.typeSize === 'large' ? 'large' : 'comfortable',
      motion: parsed.motion === 'a-little' ? 'a-little' : 'reduce',
    };
  } catch {
    return { ...defaults };
  }
}

export function writePrefs(prefs: Prefs): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore quota */
  }
  applyPrefs(prefs);
}

export function applyPrefs(prefs: Prefs): void {
  const root = document.documentElement;
  root.dataset['theme'] = prefs.theme;
  root.dataset['size'] = prefs.typeSize;
  root.dataset['motion'] = prefs.motion;
}
