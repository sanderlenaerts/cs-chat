

import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'public-view',
  template: `
  <!--<div class="app-container overlay">-->
    <header class="nav-header">
      <div class="company-logo">
        <img src="./dist/assets/images/hq.svg" width="84px">
      </div>
      <nav class="navbar">
        <ul>
         <li [routerLinkActive]="['active']" [routerLink]="['/info']" [routerLinkActiveOptions]="{ exact: true }">Self-help</li>
         <li [routerLinkActive]="['active']" [routerLink]="['/live-chat']">Live Chat</li>
        </ul>
      </nav>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
<!--  </div>-->
  `,
  styleUrls: ['./dist/assets/css/public.css']
})

export class PublicComponent implements OnInit {
  public authenticated: boolean

  constructor(private authenticationService: AuthenticationService){
    this.authenticated = authenticationService.isLoggedIn();
  }

  ngOnInit(){
    console.log(this.authenticationService.token);
  }

  test(){

  }

  logout(){
    this.authenticationService.logout();
    this.authenticated = false;
  }
}
