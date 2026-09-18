import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../../../app.routes';
import { PROGRESS_KEY, setLast } from '../../data-access/progress.storage';

describe('LessonRedirectPage', () => {
  beforeEach(() => {
    localStorage.removeItem(PROGRESS_KEY);
  });

  it('opens the last parked step, or parks home when the lesson is missing', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
    setLast('scaffold', 'install');
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/lesson/scaffold');
    expect(harness.routeNativeElement?.textContent).toContain('Put the skill where Cursor can see it');
    await harness.navigateByUrl('/lesson/missing');
    expect(harness.routeNativeElement?.textContent).toContain('Small AWS lessons');
  });

  it('opens the first incomplete step when the parked step is gone', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
    setLast('scaffold', 'missing-step');
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/lesson/scaffold');
    expect(harness.routeNativeElement?.textContent).toContain('What this skill is');
  });
});
