import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../../../app.routes';

describe('LessonPage', () => {
  it('renders the named step and parks on an unknown lesson or step', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/lesson/scaffold/what');
    expect(harness.routeNativeElement?.textContent).toContain('What this skill is');
    await harness.navigateByUrl('/lesson/scaffold/missing-step');
    expect(harness.routeNativeElement?.textContent).toContain('not in this lesson');
    await harness.navigateByUrl('/lesson/missing/what');
    expect(harness.routeNativeElement?.textContent).toContain('not on this path');
  });
});
