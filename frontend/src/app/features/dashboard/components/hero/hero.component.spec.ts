import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeroComponent,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Learn Without Limits');
  });

  it('should render welcome badge', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.welcome-badge')?.textContent).toContain('Welcome to InclusiveLearn');
  });

  it('should render description text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain('Access high-quality education');
  });

  it('should have Get Started button with correct route', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.btn.primary') as HTMLAnchorElement;
    expect(button.textContent?.trim()).toContain('Get Started');
    expect(button.getAttribute('routerLink')).toBe('/auth/register');
  });

  it('should have Browse Courses button with correct route', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.btn.secondary') as HTMLAnchorElement;
    expect(button.textContent?.trim()).toBe('Browse Courses');
    expect(button.getAttribute('routerLink')).toBe('/courses');
  });
}); 