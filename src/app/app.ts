import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { applyPrefs, readPrefs } from './features/classroom/data-access/prefs.storage';
import { AppHeader } from './shared/ui/app-header/app-header';
import { SkipLink } from './shared/ui/skip-link/skip-link';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeader, SkipLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor() {
    applyPrefs(readPrefs());
  }
}
