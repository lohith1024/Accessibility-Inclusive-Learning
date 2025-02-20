import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@app/core/services';
import { map } from 'rxjs';

export const authGuard = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.currentUser$.pipe(
    map(user => {
      if (user) {
        return true;
      }
      
      router.navigate(['/auth/login']);
      return false;
    })
  );
}; 