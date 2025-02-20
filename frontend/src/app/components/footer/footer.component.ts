import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="main-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>InclusiveLearn</h3>
            <p>Making education accessible for everyone</p>
          </div>
          <div class="footer-section">
            <h4>Contact</h4>
            <p>Email: contact&#64;inclusivelearn.com</p>
            <p>Phone: (555) 123-4567</p>
          </div>
          <div class="footer-section">
            <h4>Follow Us</h4>
            <div class="social-links">
              <a href="#" aria-label="Twitter">Twitter</a>
              <a href="#" aria-label="LinkedIn">LinkedIn</a>
              <a href="#" aria-label="GitHub">GitHub</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} InclusiveLearn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .main-footer {
      background: #2c3e50;
      color: white;
      padding: 3rem 0 1rem;
      margin-top: auto;  /* Push footer to bottom */
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .footer-section h3, .footer-section h4 {
      margin: 0 0 1rem;
      color: #3498db;
    }

    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-links a {
      color: white;
      text-decoration: none;
      transition: color 0.3s;
      padding: 0.5rem;
      border-radius: 4px;

      &:hover {
        color: #3498db;
        background: rgba(52, 152, 219, 0.1);
      }
    }

    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 1rem;
      text-align: center;
      font-size: 0.9rem;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
} 