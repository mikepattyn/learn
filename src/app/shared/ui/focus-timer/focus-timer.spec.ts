import { TestBed } from '@angular/core/testing';
import { FOCUS_SECONDS, FocusTimer } from './focus-timer';

describe('FocusTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ imports: [FocusTimer] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('counts down for eight minutes, can pause, and can reset', () => {
    const fixture = TestBed.createComponent(FocusTimer);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('8:00');
    expect(root.textContent).toContain('Start 8 minute focus timer');
    fixture.componentInstance.toggle();
    vi.advanceTimersByTime(1000);
    fixture.detectChanges();
    expect(fixture.componentInstance.remaining()).toBe(FOCUS_SECONDS - 1);
    expect(root.textContent).toContain('Pause timer');
    fixture.componentInstance.toggle();
    fixture.detectChanges();
    expect(root.textContent).toContain('Start 8 minute focus timer');
    fixture.componentInstance.reset();
    fixture.detectChanges();
    expect(fixture.componentInstance.remaining()).toBe(FOCUS_SECONDS);
    fixture.componentInstance.toggle();
    vi.advanceTimersByTime(FOCUS_SECONDS * 1000);
    fixture.detectChanges();
    expect(fixture.componentInstance.remaining()).toBe(0);
    expect(root.textContent).toContain('The step will wait');
  });
});
