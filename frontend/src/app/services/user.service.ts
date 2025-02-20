import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, retry, throwError, tap } from 'rxjs';
import { User, UserRegistration, UserLogin, AccessibilityPreferences } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:64182/api/users';  // Keep using HTTP port

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      retry(1),  // Retry failed request once
      catchError(this.handleError)
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  register(registration: UserRegistration): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, registration).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  login(credentials: UserLogin): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  updatePreferences(userId: number, preferences: AccessibilityPreferences): Observable<AccessibilityPreferences> {
    return this.http.put<AccessibilityPreferences>(
      `${this.apiUrl}/${userId}/preferences`, 
      preferences
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
} 