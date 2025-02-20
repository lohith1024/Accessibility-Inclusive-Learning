import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Course {
  title: string;
  category: string;
  students: string;
  level: string;
  image: string;
}

@Component({
  selector: 'app-featured-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './featured-courses.component.html',
  styleUrls: ['./featured-courses.component.scss']
})
export class FeaturedCoursesComponent {
  courses: Course[] = [
    {
      title: "Accessible Web Development",
      category: "Web",
      students: "2.3k",
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Universal Design Principles",
      category: "Design",
      students: "1.8k",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1531498860502-7c67cf02f657?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Inclusive Content Creation",
      category: "Content",
      students: "3.1k",
      level: "All Levels",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
    }
  ];
} 