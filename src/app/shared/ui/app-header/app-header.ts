import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PrefsSheet } from '../prefs-sheet/prefs-sheet';

@Component({
  selector: 'app-header',
  imports: [RouterLink, PrefsSheet],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css',
})
export class AppHeader {}
