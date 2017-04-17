import { Component, OnInit, OnDestroy, style, trigger, transition, animate } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { ChatService } from './services/chat.service';
import { NotificationService } from './services/notification.service';
import { Notification } from './models/notification';
import { NotificationComponent } from './components/notification.component';

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
        <a (click)="logout()"><i class="fa fa-sign-out" aria-hidden="true"></i>
Log out</a>
      </div>
      <div class="dropdown-btn">
        <i class="fa fa-bars dropdown-icon" aria-hidden="true" onclick="triggerDropdown()"></i>
        <dropdown (disconnect)="signOut($event)" [connected]="authenticated"></dropdown>
      </div>
    </header>
    <notification (discard)="notification = {message: '', type: ''}" [notification]="notification" [@fadeInOut]></notification>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./dist/assets/css/default.css', './dist/assets/css/header.css'],
  animations: [
        trigger('fadeInOut', [
            transition(':enter', [   // :enter is alias to 'void => *'
                style({ opacity: 0 }),
                animate(250, style({ opacity: 1 }))
            ]),
            transition(':leave', [   // :leave is alias to '* => void'
                animate(250, style({ opacity: 0 }))
            ])
        ])
    ]
})

export class AppComponent implements OnInit, OnDestroy {

  authenticated: boolean;
  notification: Notification;
  connection: any;

  ngOnInit(){
    this.authenticated = this.authenticationService.isLoggedIn();
    
  }

  // On destroy we need to unsubscribe from the observable
  ngOnDestroy(){
    this.connection.unsubscribe();
  }

  constructor(private authenticationService: AuthenticationService, private router: Router, private notificationService: NotificationService, private chatService: ChatService){
    // Subsribe to the observable that emits an event when the authenitcated state changes (log out, log in)
    authenticationService.changeEmitted$.subscribe(
        authenticated => {
            this.authenticated = authenticated;
    });

    // Subscribe to the observable that emits an event when a notification needs to be displayed 
    notificationService.notificationEmitted$.subscribe(
        data => {
            // data should contain a message and a type
            this.notification = data;
            setTimeout(() => {
              this.notification = {
                message: '',
                type: ''
              };
            }, 4000);
     });

     // If no connection was made yet, create one
     if (this.chatService.getActiveConnection() == null){
       this.connection = this.chatService.connect().subscribe(data => {
       });
    }
  }

  signOut(connected){
    this.logout();
  }
;
  /**
   * Method will call the authentication service to log out
   * On success the browser will navigate to the login page
   * One error a notification will be displayed
   */
  logout(){
    this.authenticationService.logout().subscribe(data => {
      this.router.navigate(['/login']);      
    },
    error => {
      this.notificationService.notify({
        message: 'Unable to logout',
        type: 'error'
      })
    });
  }
}
