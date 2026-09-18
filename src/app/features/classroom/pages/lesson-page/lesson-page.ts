import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { getLesson, getStep } from '../../domain/catalog';
import { LessonPlayer } from '../../ui/lesson-player/lesson-player';

@Component({
  selector: 'app-lesson-page',
  imports: [LessonPlayer, RouterLink],
  templateUrl: './lesson-page.html',
  styleUrl: './lesson-page.css',
})
export class LessonPage {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(
    this.route.paramMap.pipe(
      map((params) => ({
        lessonId: params.get('lessonId') ?? '',
        stepId: params.get('stepId') ?? '',
      })),
    ),
    { initialValue: { lessonId: '', stepId: '' } },
  );

  readonly lesson = computed(() => getLesson(this.params().lessonId));
  readonly step = computed(() => {
    const lesson = this.lesson();
    return lesson ? getStep(lesson, this.params().stepId) : undefined;
  });
}
