import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  firstIncompleteStep,
  lessonProgress,
  lessons,
  track,
  trackProgress,
} from '../../../classroom/domain/catalog';
import { readProgress, setLast } from '../../../classroom/data-access/progress.storage';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  readonly track = track;
  readonly lessons = lessons;
  readonly tick = signal(0);
  readonly progress = computed(() => {
    this.tick();
    return readProgress();
  });
  readonly overall = computed(() => trackProgress(this.progress().completed));
  readonly continueLesson = computed(() => {
    const state = this.progress();
    return (
      lessons.find((lesson) => lesson.id === state.lastLessonId) ??
      lessons.find((lesson) => !lessonProgress(lesson, state.completed[lesson.id] ?? []).complete) ??
      lessons[0]
    );
  });
  readonly continueStep = computed(() => {
    const state = this.progress();
    const lesson = this.continueLesson();
    const last =
      state.lastLessonId === lesson.id && state.lastStepId
        ? lesson.steps.find((step) => step.id === state.lastStepId)
        : undefined;
    return last ?? firstIncompleteStep(lesson, state.completed[lesson.id] ?? []);
  });

  lessonState(id: string) {
    return lessonProgress(
      lessons.find((lesson) => lesson.id === id)!,
      this.progress().completed[id] ?? [],
    );
  }

  start(lessonId: string, stepId: string): void {
    setLast(lessonId, stepId);
    this.tick.update((value) => value + 1);
  }

  firstIncomplete(lessonId: string): string {
    const lesson = lessons.find((item) => item.id === lessonId)!;
    return firstIncompleteStep(lesson, this.progress().completed[lessonId] ?? []).id;
  }
}
