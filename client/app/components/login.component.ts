import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'login-page',
  template: `
  <main>
    <!-- Login form -->
    <div class="content-wrapper">
      <div class="image-container">
        <img src="./dist/assets/images/connection.png"/>
        <img src="./dist/assets/images/support.png"/>
        <img src="./dist/assets/images/security.png"/>
        <img src="./dist/assets/images/cloud.png"/>
        <img src="./dist/assets/images/voice.png"/>
      </div>

      <div class="form-wrapper">
        <h3>Sign in</h3>
        <div *ngIf="submitted" class="dots-loader"></div>
        <div *ngIf="isLoggedIn" class="submitted">
          <p>You are currently logged in as {{user.name}} ({{user.username}}). <a (click)="logout()">Log out</a> if you want to log in with another account.</p>
        </div>
        <div *ngIf="errors?.length > 0 && !submitted" class="has-errors">
          <li *ngFor="let error of errors" class="error">
            {{error}}
          </li>
        </div>

        <form *ngIf="!submitted && !isLoggedIn" (ngSubmit)="doLogin()" [formGroup]="login">
          <div *ngIf=" login.controls['username'].hasError('minlength') && login.controls['username'].touched" class="alert alert-danger">The username must be at least 3 characters long</div>

          <div *ngIf=" login.controls['username'].hasError('maxlength')&& login.controls['username'].dirty" class="alert alert-danger">The username cannot be longer than 10 characters</div>

          <label for="username">Username</label>
          <input id="username" type="text" name="username" placeholder="Username" [formControl]="login.controls['username']">


          <div *ngIf=" login.controls['password'].hasError('minlength') && login.controls['password'].dirty" class="alert alert-danger">The password must be at least 5 characters long</div>

          <div *ngIf=" login.controls['password'].hasError('maxlength')&& login.controls['password'].dirty" class="alert alert-danger">The password cannot be longer than 10 characters</div>

          <label for="password">Password</label>
          <input id="password" type="password" name="password" value="" placeholder="Password" [formControl]="login.controls['password']">

          <input type="submit" [disabled]="!login.valid" value="Sign in">
        </form>
      </div>
    </div>
  </main>
  `,
  styleUrls: ['./dist/assets/css/login.css']
})

export class LoginComponent implements OnInit {

  login: FormGroup
  errors: String []
  submitted: boolean
  isLoggedIn: boolean
  user: any

  @Output()
  loginSuccess = new EventEmitter(); 

  constructor(private authenticationService: AuthenticationService, private fb: FormBuilder, private router: Router, private notificationService: NotificationService, private chatService: ChatService){
      // Initialize the login form   
      this.login = this.fb.group({
        username: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])],
        password: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])]
      })

      // When authenticated state changes, change state in this component
      // Subscribe to the observable
      authenticationService.changeEmitted$.subscribe(
        authenticated => {
            this.isLoggedIn = authenticated;
     });
  }

  ngOnInit(){
    this.isLoggedIn = this.authenticationService.isLoggedIn();
    this.user = this.authenticationService.user;
  }

  doLogin(){
    this.submitted = true;
    // Send a login request
    // On success navigate to the info page
    this.authenticationService.login(this.login.value)
      .subscribe(data => {
        this.authenticationService.changeAuthenticated(true);
        this.router.navigate(['/info']);
        this.chatService.login();
      },
      err => {
        // if errors, display them
        this.errors = []
        for (var error of err.json()){
          this.errors.push(error.msg);
        }
        this.submitted = false;
      })
  }

  // Send a logout request
  logout(){
    this.authenticationService.logout().subscribe(status => {
      this.isLoggedIn = status;
      this.chatService.logout();
    });
  }


}
