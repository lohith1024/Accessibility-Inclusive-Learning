import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render brand logo and text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const brand = compiled.querySelector('.brand');
    expect(brand?.querySelector('i.fas.fa-book-reader')).toBeTruthy();
    expect(brand?.textContent?.trim()).toContain('InclusiveLearn');
  });

  it('should render search input', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const searchInput = compiled.querySelector('.search-input') as HTMLInputElement;
    expect(searchInput).toBeTruthy();
    expect(searchInput.placeholder).toBe('Search courses...');
  });

  it('should call onSearch when input changes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const searchInput = compiled.querySelector('.search-input') as HTMLInputElement;
    const spy = spyOn(component, 'onSearch');
    
    searchInput.dispatchEvent(new Event('input'));
    expect(spy).toHaveBeenCalled();
  });

  it('should render navigation links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('.nav-link');
    
    expect(links[0].textContent?.trim()).toBe('Sign In');
    expect(links[0].getAttribute('routerLink')).toBe('/auth/login');
    
    expect(links[1].textContent?.trim()).toBe('Get Started');
    expect(links[1].getAttribute('routerLink')).toBe('/auth/register');
  });
}); 