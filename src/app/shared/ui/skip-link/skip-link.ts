import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skip-link',
  templateUrl: './skip-link.html',
  styleUrl: './skip-link.css',
})
export class SkipLink {
  readonly targetId = input.required<string>();
  readonly label = input.required<string>();
}
