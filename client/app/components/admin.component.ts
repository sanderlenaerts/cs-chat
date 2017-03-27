import { Component, Input, OnInit, style, state, animate, transition, trigger, ViewEncapsulation} from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

import { Router } from '@angular/router';

@Component({
  selector: 'admin-page',
  template: `
  <header class="nav-header">
    <div class="header-container">
      <div  class="company-logo">
        <img src="./dist/assets/images/hq.svg" width="84px">
      </div>
      <h3>Live Chat Admin Panel</h3>
      <a [class.hidden]="!authenticated" (click)="logout()">Log out</a>
    </div>
    <div class="inner-nav">
      <ul>
        <li [routerLinkActive]="['active']" [routerLink]="['/admin/users']">Users</li>
      </ul>
    </div>
  </header>
  <main>
    <router-outlet></router-outlet>
  </main>
  `,
  styleUrls: ['./dist/assets/css/admin.css'],
})

export class AdminComponent implements OnInit {

  public authenticated: boolean

  constructor(private authenticationService : AuthenticationService, private router: Router){
    this.authenticated = this.authenticationService.isLoggedIn();
  }

  ngOnInit(){

  }

  logout(){
    this.authenticationService.logout();
    this.authenticated = false;
    this.router.navigate(['/login']);
  }
}
