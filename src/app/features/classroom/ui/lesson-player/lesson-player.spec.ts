import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../../../app.routes';
import { getLesson } from '../../domain/catalog';
import { isStepDone, PROGRESS_KEY, readProgress } from '../../data-access/progress.storage';
import { LessonPlayer } from './lesson-player';

describe('LessonPlayer', () => {
  beforeEach(() => {
    localStorage.removeItem(PROGRESS_KEY);
    TestBed.configureTestingModule({
      imports: [LessonPlayer],
      providers: [provideRouter(routes)],
    });
  });

  function render(lessonId: string, stepId: string) {
    const lesson = getLesson(lessonId)!;
    const step = lesson.steps.find((item) => item.id === stepId)!;
    const fixture = TestBed.createComponent(LessonPlayer);
    fixture.componentRef.setInput('lesson', lesson);
    fixture.componentRef.setInput('step', step);
    fixture.detectChanges();
    return fixture;
  }

  it('ticks the current step, can uncheck, reset, and park home', () => {
    const fixture = render('scaffold', 'what');
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('h1')?.textContent).toContain('What this skill is');
    expect(root.textContent).toContain('Park and go home');
    expect(root.textContent).toContain('All steps in this lesson');
    fixture.componentInstance.completeAndAdvance();
    fixture.detectChanges();
    expect(isStepDone(readProgress().completed, 'scaffold', 'what')).toBe(true);
    expect(root.textContent).toContain('Uncheck this step');
    fixture.componentInstance.uncheck();
    fixture.detectChanges();
    expect(isStepDone(readProgress().completed, 'scaffold', 'what')).toBe(false);
    fixture.componentInstance.reset();
    fixture.detectChanges();
    expect(root.textContent).toContain('I did this');
  });

  it('opens the next lesson after the last step, and stays when the path ends', () => {
    const scaffoldLast = render('scaffold', getLesson('scaffold')!.steps.at(-1)!.id);
    scaffoldLast.componentInstance.completeAndAdvance();
    expect(readProgress().lastLessonId).toBe('email');
    const last = render('contact-api', getLesson('contact-api')!.steps.at(-1)!.id);
    last.componentInstance.completeAndAdvance();
    last.detectChanges();
    expect(isStepDone(readProgress().completed, 'contact-api', getLesson('contact-api')!.steps.at(-1)!.id)).toBe(
      true,
    );
    expect(last.nativeElement.textContent).toContain('Done. Go home');
  });
});
