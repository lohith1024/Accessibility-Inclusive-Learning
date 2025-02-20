import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="about-container">
      <h2>About InclusiveLearn</h2>
      <p>
        InclusiveLearn is dedicated to making education accessible to everyone.
        Our platform provides inclusive learning experiences that accommodate
        different learning styles and accessibility needs.
      </p>
    </div>
  `,
  styles: [`
    .about-container {
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin: 2rem 0;
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
    }

    p {
      color: #666;
      line-height: 1.6;
    }
  `]
})
export class AboutComponent {} 