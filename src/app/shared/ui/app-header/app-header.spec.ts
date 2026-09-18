import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppHeader } from './app-header';

describe('AppHeader', () => {
  it('brands the classroom and exposes settings', () => {
    TestBed.configureTestingModule({
      imports: [AppHeader],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(AppHeader);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.header__brand')?.textContent).toContain('Learn');
    expect(root.querySelector('[aria-label="Classroom settings"]')).toBeTruthy();
  });
});
