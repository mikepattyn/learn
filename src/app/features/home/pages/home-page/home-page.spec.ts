import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { markDone, PROGRESS_KEY } from '../../../classroom/data-access/progress.storage';
import { HomePage } from './home-page';

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.removeItem(PROGRESS_KEY);
  });

  it('lists the track and offers continue after a step is ticked', () => {
    TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('h1')?.textContent).toContain('Small AWS lessons');
    expect(root.textContent).toContain('First contact email');
    expect(root.textContent).toContain('Start lesson 1');
    expect(root.textContent).toContain('Scaffold a new umbrella');
    markDone('scaffold', 'what');
    fixture.componentInstance.start('scaffold', 'what');
    fixture.detectChanges();
    expect(root.textContent).toContain('Continue');
  });
});
