import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'my-app',
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
      <div class="dropdown-btn">
        <i class="fa fa-bars dropdown-icon" aria-hidden="true" onclick="triggerDropdown()"></i>
        <dropdown (disconnect)="signOut($event)" [connected]="authenticated"></dropdown>
      </div>
    </header>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./dist/assets/css/default.css', './dist/assets/css/header.css']
})

export class AppComponent implements OnInit {

  authenticated: boolean;

  ngOnInit(){
    this.authenticated = this.authenticationService.isLoggedIn();
  }

  constructor(private authenticationService: AuthenticationService, private router: Router){
    authenticationService.changeEmitted$.subscribe(
        authenticated => {
            this.authenticated = authenticated;
    });
  }

  signOut(connected){
    this.logout();
  }

  logout(){
    this.authenticationService.logout();
    //TODO: change logout into observable so "navigate" can be part of success
    this.router.navigate(['/login']);
  }
}
