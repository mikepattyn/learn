import { TestBed } from '@angular/core/testing';
import { SkipLink } from './skip-link';

describe('SkipLink', () => {
  it('points at the named landmark', () => {
    TestBed.configureTestingModule({ imports: [SkipLink] });
    const fixture = TestBed.createComponent(SkipLink);
    fixture.componentRef.setInput('targetId', 'main');
    fixture.componentRef.setInput('label', 'Skip to content');
    fixture.detectChanges();
    const link = (fixture.nativeElement as HTMLElement).querySelector('a.skip-link');
    expect(link?.getAttribute('href')).toBe('#main');
    expect(link?.textContent).toBe('Skip to content');
  });
});
