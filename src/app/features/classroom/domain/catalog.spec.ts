import {
  adjacentSteps,
  firstIncompleteStep,
  getLesson,
  getStep,
  lessonProgress,
  nextLesson,
  track,
  trackProgress,
} from './catalog';

describe('lesson catalog', () => {
  it('exposes the first-contact-email track in order', () => {
    expect(track.id).toBe('first-contact-email');
    expect(track.lessons.map((lesson) => lesson.id)).toEqual([
      'scaffold',
      'email',
      'contact-api',
    ]);
    expect(getLesson('email')?.title).toContain('Mikepattyn.Email');
    expect(getStep(track.lessons[0], 'what')?.title).toContain('What this skill is');
  });

  it('finds the first incomplete step and neighbours', () => {
    const lesson = getLesson('scaffold')!;
    expect(getLesson('missing')).toBeUndefined();
    expect(getStep(lesson, 'missing')).toBeUndefined();
    expect(firstIncompleteStep(lesson, ['what']).id).not.toBe('what');
    expect(firstIncompleteStep(lesson, lesson.steps.map((step) => step.id)).id).toBe(lesson.steps[0].id);
    expect(adjacentSteps(lesson, 'what').next?.id).toBeTruthy();
    expect(adjacentSteps(lesson, 'what').prev).toBeUndefined();
    expect(adjacentSteps(lesson, 'missing').index).toBe(-1);
    expect(nextLesson('scaffold')?.id).toBe('email');
    expect(nextLesson('contact-api')).toBeUndefined();
    expect(nextLesson('missing')).toBeUndefined();
  });

  it('computes lesson and track ratios from ticked steps', () => {
    const lesson = getLesson('scaffold')!;
    expect(lessonProgress(lesson, []).complete).toBe(false);
    expect(lessonProgress(lesson, lesson.steps.map((step) => step.id)).complete).toBe(true);
    const overall = trackProgress({ scaffold: [lesson.steps[0].id] });
    expect(overall.done).toBe(1);
    expect(overall.total).toBeGreaterThan(1);
  });
});
