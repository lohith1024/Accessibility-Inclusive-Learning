import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { authGuard } from '@app/core/guards/auth.guard';

export const routes: Routes = [
  { 
    path: '',
    loadComponent: () => import('./features/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  { 
    path: 'users', 
    component: UserListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes')
      .then(m => m.AUTH_ROUTES)
  },
  { 
    path: 'preferences',
    loadComponent: () => import('./features/preferences/preferences.component')
      .then(m => m.PreferencesComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'about',
    loadComponent: () => 
      import('./components/about/about.component')
        .then(m => m.AboutComponent) 
  }
];
