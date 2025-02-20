import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  private userService = inject(UserService);
  
  public users = signal<User[]>([]);
  public loading = signal(true);
  public error = signal<string | null>(null);

  constructor() {
    this.loadUsers();
  }

  private loadUsers(): void {
    console.log('Loading users from:', this.userService['apiUrl']);
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('Received users:', users);
        this.users.set(users);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          url: error.url
        });
        this.error.set(this.getErrorMessage(error));
        this.loading.set(false);
      }
    });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Unable to connect to the server. Please check your connection.';
    }
    return error.error?.message || 'An error occurred while loading users.';
  }
} 