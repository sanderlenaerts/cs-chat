import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './services/guard.service';
import { RoleGuard } from './services/roleguard.service';
import { TimeGuard } from './services/timeguard.service';

import { PublicComponent } from './components/public.component';
import { LandingComponent } from './components/landing.component';

import { ChatContainerComponent } from './components/chat/chat-container.component';
import { LoginComponent } from './components/login.component';
import { AdminComponent } from './components/admin.component';
import { UsersComponent } from './components/users.component';
import { RegisterComponent } from './components/register.component';

const appRoutes : Routes = [
  {
    path: '',
    component: PublicComponent,
    children: [
        { path: '', redirectTo: 'info', pathMatch: 'full' },
        { path: 'info',  component: LandingComponent},
        {
          path: 'live-chat',
          component: ChatContainerComponent,
          canActivate: [TimeGuard]
        }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, RoleGuard],
    children: [
        { path: '', redirectTo: 'users', pathMatch: 'full' },
        { path: 'users',  component: UsersComponent},
        { path: 'registration', component: RegisterComponent }
    ],
    data: {
      roles: ['ADMIN']
    }
  }
];

export const appRouting : ModuleWithProviders = RouterModule.forRoot(appRoutes);
