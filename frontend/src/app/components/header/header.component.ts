import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '@app/core/services';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from '@models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  template: `
    <header class="main-header">
      <div class="container">
        <div class="logo">
          <h1>InclusiveLearn</h1>
        </div>
        <nav>
          <ul>
            <li><a routerLink="/users" routerLinkActive="active">Users</a></li>
            <li><a routerLink="/about" routerLinkActive="active">About</a></li>
            @if (!(currentUser$ | async)) {
              <li><a routerLink="/auth/login" routerLinkActive="active">Login</a></li>
              <li><a routerLink="/auth/register" routerLinkActive="active">Register</a></li>
            } @else {
              <li><a routerLink="/preferences" routerLinkActive="active">Preferences</a></li>
              <li><button (click)="logout()">Logout</button></li>
            }
          </ul>
        </nav>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  readonly currentUser$: Observable<User | null>;

  constructor(private userService: UserService) {
    this.currentUser$ = this.userService.currentUser$;
  }

  logout(): void {
    this.userService.logout();
  }
} 