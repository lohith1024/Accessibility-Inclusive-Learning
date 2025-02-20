import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturedCoursesComponent } from './featured-courses.component';

describe('FeaturedCoursesComponent', () => {
  let component: FeaturedCoursesComponent;
  let fixture: ComponentFixture<FeaturedCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedCoursesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render section title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toBe('Featured Courses');
  });

  it('should render correct number of course cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.course-card');
    expect(cards.length).toBe(component.courses.length);
  });

  it('should render course details correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const firstCard = compiled.querySelector('.course-card');
    const firstCourse = component.courses[0];

    expect(firstCard?.querySelector('h3')?.textContent).toBe(firstCourse.title);
    expect(firstCard?.querySelector('.category')?.textContent).toBe(firstCourse.category);
    expect(firstCard?.querySelector('.students')?.textContent).toContain(firstCourse.students);
    expect(firstCard?.querySelector('.level')?.textContent).toBe(firstCourse.level);
  });

  it('should render course images with correct attributes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const images = compiled.querySelectorAll('.image-container img');

    images.forEach((img: Element, index: number) => {
      const imgElement = img as HTMLImageElement;
      expect(imgElement.src).toBe(component.courses[index].image);
      expect(imgElement.alt).toBe(component.courses[index].title);
    });
  });

  it('should render learn more links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const learnMoreLinks = compiled.querySelectorAll('.learn-more');

    expect(learnMoreLinks.length).toBe(component.courses.length);
    learnMoreLinks.forEach(link => {
      expect(link.textContent?.trim()).toBe('Learn more →');
    });
  });
}); 