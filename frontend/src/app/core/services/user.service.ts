import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, catchError, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { User, UserRegistration, UserLogin, AccessibilityPreferences } from '@app/models/user.model';
import { UserResponse } from '@app/models/auth.model';
import { environment } from '@env/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl + '/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    // Load user on startup
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('currentUser');
      if (token && savedUser) {
        const user = JSON.parse(savedUser);
        this.currentUserSubject.next(user);
        this.applyUserPreferences(user.accessibilityPreferences);
      }
    }
  }

  private applyUserPreferences(prefs: AccessibilityPreferences | null): void {
    if (!prefs) return;

    // Apply high contrast
    if (prefs.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // Apply font size
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${prefs.fontSize}`);

    // Apply screen reader optimizations
    if (prefs.screenReader) {
      document.body.classList.add('screen-reader');
    } else {
      document.body.classList.remove('screen-reader');
    }

    // Apply color scheme
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${prefs.colorScheme}-mode`);

    // Apply reduced motion
    if (prefs.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('Using token:', token);
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  register(registration: UserRegistration): Observable<User> {
    return this.http.post<UserResponse>(`${this.apiUrl}/register`, registration).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
        }
        const user: User = {
          id: response.id,
          username: response.userName,
          email: response.email,
          accessibilityPreferences: response.accessibilityPreferences,
          createdAt: new Date()
        };
        this.currentUserSubject.next(user);
      }),
      map(response => ({
        id: response.id,
        username: response.userName,
        email: response.email,
        accessibilityPreferences: response.accessibilityPreferences,
        createdAt: new Date()
      }))
    );
  }

  login(credentials: UserLogin): Observable<User> {
    return this.http.post<UserResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
          const user = {
            id: response.id,
            username: response.userName,
            email: response.email,
            accessibilityPreferences: response.accessibilityPreferences,
            createdAt: new Date()
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.applyUserPreferences(user.accessibilityPreferences);
        }
      }),
      map(response => ({
        id: response.id,
        username: response.userName,
        email: response.email,
        accessibilityPreferences: response.accessibilityPreferences,
        createdAt: new Date()
      }))
    );
  }

  updatePreferences(userId: string, preferences: AccessibilityPreferences): Observable<AccessibilityPreferences> {
    return this.http.put<AccessibilityPreferences>(
      `${this.apiUrl}/${userId}/preferences`, 
      preferences,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(updatedPrefs => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            accessibilityPreferences: updatedPrefs
          };
          this.currentUserSubject.next(updatedUser);
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          this.applyUserPreferences(updatedPrefs);
        }
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      // Reset styles
      this.applyUserPreferences({
        highContrast: false,
        fontSize: 'medium',
        screenReader: false,
        colorScheme: 'light',
        reducedMotion: false
      });
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  private getUserFromToken(token: string): User | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);

      if (!payload.nameid || !payload.unique_name || !payload.email) {
        console.error('Missing required claims in token');
        return null;
      }

      const preferences = payload.preferences ? 
        JSON.parse(payload.preferences) : 
        {
          highContrast: false,
          fontSize: 'medium',
          screenReader: false,
          colorScheme: 'light',
          reducedMotion: false
        };

      const user: User = {
        id: payload.nameid,
        username: payload.unique_name,
        email: payload.email,
        accessibilityPreferences: preferences,
        createdAt: new Date()
      };

      console.log('Parsed user from token:', user);
      return user;
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }
} 