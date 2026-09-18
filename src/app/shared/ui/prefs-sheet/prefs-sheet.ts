import { Component, signal } from '@angular/core';
import { resetAll } from '../../../features/classroom/data-access/progress.storage';
import {
  readPrefs,
  writePrefs,
  type Motion,
  type Prefs,
  type Theme,
  type TypeSize,
} from '../../../features/classroom/data-access/prefs.storage';

@Component({
  selector: 'app-prefs-sheet',
  templateUrl: './prefs-sheet.html',
  styleUrl: './prefs-sheet.css',
})
export class PrefsSheet {
  readonly open = signal(false);
  readonly prefs = signal<Prefs>(readPrefs());

  show(): void {
    this.open.set(true);
  }

  hide(): void {
    this.open.set(false);
  }

  setTheme(theme: Theme): void {
    this.save({ ...this.prefs(), theme });
  }

  setTypeSize(typeSize: TypeSize): void {
    this.save({ ...this.prefs(), typeSize });
  }

  setMotion(motion: Motion): void {
    this.save({ ...this.prefs(), motion });
  }

  clearTicks(): void {
    if (window.confirm('Clear all lesson ticks? The steps stay. Only your checks go.')) {
      resetAll();
    }
  }

  private save(prefs: Prefs): void {
    writePrefs(prefs);
    this.prefs.set(prefs);
  }
}
