

import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'public-view',
  template: `
    <header class="nav-header">

      <nav class="navbar">
        <ul>
         <li [routerLinkActive]="['active']" [routerLink]="['/info']" [routerLinkActiveOptions]="{ exact: true }">Self-help</li>
         <li *ngIf="authenticationService.betweenOffice() || authenticated" [routerLinkActive]="['active']" [routerLink]="['/live-chat']">Live Chat</li>
         <li *ngIf="authenticated && authenticationService.user.role == 'ADMIN'" [routerLinkActive]="['active']" [routerLink]="['/admin']">Admin Panel</li>
        </ul>
      </nav>
      <div class="company-logo">
        <img src="./dist/assets/images/hq.svg" width="84px">
      </div>
      <div *ngIf="authenticated" class="logout">
        <a (click)="logout()">Log out</a>
      </div>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./dist/assets/css/public.css']
})

export class PublicComponent implements OnInit {
  public authenticated: boolean

  constructor(private authenticationService: AuthenticationService, private router: Router){
    this.authenticated = authenticationService.isLoggedIn();
  }

  ngOnInit(){
    console.log(this.authenticationService.token);
  }

  logout(){
    console.log('Logging out');
    this.authenticationService.logout();
    this.authenticated = false;
    this.router.navigate(['/login']);
  }
}
