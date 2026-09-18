import { Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { adjacentSteps, nextLesson } from '../../domain/catalog';
import type { Lesson, Step } from '../../domain/lessons/types';
import {
  isStepDone,
  markDone,
  readProgress,
  resetLesson,
  setLast,
  unmark,
} from '../../data-access/progress.storage';
import { FocusTimer } from '../../../../shared/ui/focus-timer/focus-timer';

@Component({
  selector: 'app-lesson-player',
  imports: [FocusTimer, RouterLink],
  templateUrl: './lesson-player.html',
  styleUrl: './lesson-player.css',
})
export class LessonPlayer {
  private readonly router = inject(Router);
  readonly lesson = input.required<Lesson>();
  readonly step = input.required<Step>();
  readonly tick = signal(0);

  readonly completed = computed(() => {
    this.tick();
    return readProgress().completed;
  });
  readonly done = computed(() => isStepDone(this.completed(), this.lesson().id, this.step().id));
  readonly neighbours = computed(() => adjacentSteps(this.lesson(), this.step().id));
  readonly following = computed(() => nextLesson(this.lesson().id));
  readonly lessonComplete = computed(() => {
    const ids = this.completed()[this.lesson().id] ?? [];
    return ids.length === this.lesson().steps.length;
  });
  readonly stepRatio = computed(() => (this.neighbours().index + 1) / this.lesson().steps.length);

  stepDone(stepId: string): boolean {
    return isStepDone(this.completed(), this.lesson().id, stepId);
  }

  go(lessonId: string, stepId: string): void {
    setLast(lessonId, stepId);
    this.tick.update((value) => value + 1);
    void this.router.navigate(['/lesson', lessonId, stepId]);
  }

  completeAndAdvance(): void {
    markDone(this.lesson().id, this.step().id);
    this.tick.update((value) => value + 1);
    const next = this.neighbours().next;
    if (next) {
      this.go(this.lesson().id, next.id);
      return;
    }
    const following = this.following();
    if (following) {
      this.go(following.id, following.steps[0].id);
    }
  }

  uncheck(): void {
    unmark(this.lesson().id, this.step().id);
    this.tick.update((value) => value + 1);
  }

  reset(): void {
    resetLesson(this.lesson().id);
    this.tick.update((value) => value + 1);
  }
}
