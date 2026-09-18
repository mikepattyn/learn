import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstIncompleteStep, getLesson } from '../../domain/catalog';
import { readProgress } from '../../data-access/progress.storage';

@Component({
  selector: 'app-lesson-redirect-page',
  template: '',
})
export class LessonRedirectPage {
  constructor() {
    const route = inject(ActivatedRoute);
    const router = inject(Router);
    const lessonId = route.snapshot.paramMap.get('lessonId') ?? '';
    const lesson = getLesson(lessonId);
    if (!lesson) {
      void router.navigateByUrl('/');
      return;
    }
    const progress = readProgress();
    const stored =
      progress.lastLessonId === lesson.id && progress.lastStepId
        ? lesson.steps.find((step) => step.id === progress.lastStepId)
        : undefined;
    const step = stored ?? firstIncompleteStep(lesson, progress.completed[lesson.id] ?? []);
    void router.navigate(['/lesson', lesson.id, step.id]);
  }
}
