import { TestBed } from '@angular/core/testing';
import { PREFS_KEY, readPrefs } from '../../../features/classroom/data-access/prefs.storage';
import { PROGRESS_KEY, markDone, readProgress } from '../../../features/classroom/data-access/progress.storage';
import { PrefsSheet } from './prefs-sheet';

describe('PrefsSheet', () => {
  beforeEach(() => {
    localStorage.removeItem(PREFS_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    TestBed.configureTestingModule({ imports: [PrefsSheet] });
  });

  it('opens the room settings and persists ink, large type, and a little motion', () => {
    const fixture = TestBed.createComponent(PrefsSheet);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[role="dialog"]')).toBeNull();
    fixture.componentInstance.show();
    fixture.detectChanges();
    expect(root.textContent).toContain('How this room feels');
    fixture.componentInstance.setTheme('ink');
    fixture.componentInstance.setTypeSize('large');
    fixture.componentInstance.setMotion('a-little');
    expect(readPrefs()).toEqual({ theme: 'ink', typeSize: 'large', motion: 'a-little' });
    fixture.componentInstance.hide();
    fixture.detectChanges();
    expect(root.querySelector('[role="dialog"]')).toBeNull();
  });

  it('clears ticks only when the visitor confirms', () => {
    markDone('scaffold', 'what');
    const fixture = TestBed.createComponent(PrefsSheet);
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);
    fixture.componentInstance.clearTicks();
    expect(readProgress().completed['scaffold']).toEqual(['what']);
    fixture.componentInstance.clearTicks();
    expect(readProgress().completed).toEqual({});
    confirm.mockRestore();
  });
});
