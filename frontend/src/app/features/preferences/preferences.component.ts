import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '@app/core/services';
import { AccessibilityPreferences, User } from '@models/user.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="preferences-container">
      <h2>Accessibility Preferences</h2>
      @if (isLoading) {
        <div class="loading">Loading preferences...</div>
      } @else if (!currentUser) {
        <div class="error">Please log in to manage preferences</div>
      } @else {
        <form [formGroup]="preferencesForm" (ngSubmit)="onSubmit()">
          <div class="form-group checkbox-group">
            <label title="Enable high contrast mode for better visibility">
              <input type="checkbox" formControlName="highContrast">
              <span>High Contrast Mode</span>
            </label>
          </div>

          <div class="form-group">
            <label>Font Size</label>
            <select formControlName="fontSize">
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div class="form-group checkbox-group">
            <label title="Optimize interface for screen readers">
              <input type="checkbox" formControlName="screenReader">
              <span>Screen Reader Optimized</span>
            </label>
          </div>

          <div class="form-group">
            <label>Color Scheme</label>
            <select formControlName="colorScheme">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div class="form-group checkbox-group">
            <label title="Reduce motion animations">
              <input type="checkbox" formControlName="reducedMotion">
              <span>Reduced Motion</span>
            </label>
          </div>

          <button type="submit">Save Preferences</button>
        </form>
      }

      @if (message) {
        <div class="message" [class.error]="messageType === 'error'">
          {{ message }}
        </div>
      }
    </div>
  `,
  styles: [`
    .preferences-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2c3e50;
      font-weight: 500;
    }

    select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;

      &:hover {
        background: #2980b9;
      }
    }
  `]
})
export class PreferencesComponent implements OnInit {
  preferencesForm: FormGroup;
  message = '';
  messageType: 'success' | 'error' = 'success';
  currentUser: User | null = null;
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.preferencesForm = this.fb.group({
      highContrast: [false],
      fontSize: ['medium'],
      screenReader: [false],
      colorScheme: ['light'],
      reducedMotion: [false]
    });
  }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe({
      next: (user) => {
        if (!user) {
          this.router.navigate(['/auth/login']);
          return;
        }
        this.currentUser = user;
        if (user.accessibilityPreferences) {
          this.preferencesForm.patchValue(user.accessibilityPreferences);
          this.applyPreferences(user.accessibilityPreferences);
          this.applyCombinedClasses(user.accessibilityPreferences);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.currentUser?.id) {
      console.error('No user ID found:', this.currentUser);
      this.message = 'User ID not found. Please try logging in again.';
      this.messageType = 'error';
      return;
    }

    console.log('Current user:', this.currentUser);

    if (this.preferencesForm.valid) {
      const preferences = this.preferencesForm.value;
      console.log('Submitting preferences for user ID:', this.currentUser.id);
      console.log('Preferences data:', preferences);

      this.userService.updatePreferences(this.currentUser.id, preferences)
        .subscribe({
          next: (prefs) => {
            console.log('Updated preferences:', prefs);
            this.message = 'Preferences saved successfully!';
            this.messageType = 'success';
            if (prefs) {
              this.applyPreferences(prefs);
            }
          },
          error: (error) => {
            console.error('Detailed error:', error);
            this.message = `Failed to save preferences: ${error.status} ${error.statusText}`;
            this.messageType = 'error';
          }
        });
    }
  }

  private applyPreferences(prefs: AccessibilityPreferences): void {
    const body = document.body;
    
    // Reset all theme classes
    body.classList.remove(
      'dark-mode', 
      'high-contrast', 
      'font-small', 
      'font-medium', 
      'font-large', 
      'reduced-motion'
    );

    // Apply new theme classes
    if (prefs.highContrast) {
      body.classList.add('high-contrast');
    } else if (prefs.colorScheme === 'dark') {
      body.classList.add('dark-mode');
    }

    // Apply font size
    body.classList.add(`font-${prefs.fontSize}`);

    // Apply other preferences
    if (prefs.reducedMotion) {
      body.classList.add('reduced-motion');
    }

    // Force a repaint to ensure styles are applied
    document.documentElement.style.display = 'none';
    document.documentElement.offsetHeight;
    document.documentElement.style.display = '';
  }

  private applyCombinedClasses(prefs: AccessibilityPreferences): void {
    const body = document.body;
    body.className = ''; // Reset classes
    
    if (prefs.highContrast) body.classList.add('high-contrast');
    if (prefs.colorScheme === 'dark') body.classList.add('dark-mode');
    body.classList.add(`font-${prefs.fontSize}`);
    if (prefs.reducedMotion) body.classList.add('reduced-motion');
    if (prefs.screenReader) body.classList.add('screen-reader');
  }
} 