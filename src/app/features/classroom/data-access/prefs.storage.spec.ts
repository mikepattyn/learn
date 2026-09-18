import { applyPrefs, PREFS_KEY, readPrefs, writePrefs } from './prefs.storage';

describe('prefs storage', () => {
  beforeEach(() => {
    localStorage.removeItem(PREFS_KEY);
    delete document.documentElement.dataset['theme'];
  });

  it('defaults to paper, comfortable, reduce', () => {
    expect(readPrefs()).toEqual({
      theme: 'paper',
      typeSize: 'comfortable',
      motion: 'reduce',
    });
    localStorage.setItem(PREFS_KEY, '{');
    expect(readPrefs().theme).toBe('paper');
  });

  it('persists ink theme and applies document data attributes', () => {
    writePrefs({ theme: 'ink', typeSize: 'large', motion: 'a-little' });
    expect(readPrefs()).toEqual({ theme: 'ink', typeSize: 'large', motion: 'a-little' });
    applyPrefs(readPrefs());
    expect(document.documentElement.dataset['theme']).toBe('ink');
    expect(document.documentElement.dataset['size']).toBe('large');
  });

  it('keeps paper defaults from stored values and ignores a full disk', () => {
    localStorage.setItem(
      PREFS_KEY,
      JSON.stringify({ theme: 'paper', typeSize: 'comfortable', motion: 'reduce' }),
    );
    expect(readPrefs()).toEqual({
      theme: 'paper',
      typeSize: 'comfortable',
      motion: 'reduce',
    });
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    writePrefs({ theme: 'ink', typeSize: 'large', motion: 'a-little' });
    setItem.mockRestore();
    expect(document.documentElement.dataset['theme']).toBe('ink');
  });
});
