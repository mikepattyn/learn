import { Component, OnDestroy, signal } from '@angular/core';

export const FOCUS_SECONDS = 8 * 60;

@Component({
  selector: 'app-focus-timer',
  templateUrl: './focus-timer.html',
  styleUrl: './focus-timer.css',
})
export class FocusTimer implements OnDestroy {
  readonly remaining = signal(FOCUS_SECONDS);
  readonly running = signal(false);
  readonly ended = signal(false);
  private handle = 0;

  ngOnDestroy(): void {
    this.stopClock();
  }

  label(): string {
    const value = this.remaining();
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  toggle(): void {
    if (this.running()) {
      this.stopClock();
      return;
    }
    this.running.set(true);
    this.handle = window.setInterval(() => this.tick(), 1000);
  }

  reset(): void {
    this.stopClock();
    this.ended.set(false);
    this.remaining.set(FOCUS_SECONDS);
  }

  private tick(): void {
    const next = this.remaining() - 1;
    if (next <= 0) {
      this.remaining.set(0);
      this.stopClock();
      this.ended.set(true);
      return;
    }
    this.remaining.set(next);
  }

  private stopClock(): void {
    this.running.set(false);
    window.clearInterval(this.handle);
    this.handle = 0;
  }
}
