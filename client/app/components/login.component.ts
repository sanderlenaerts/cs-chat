import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private authenticationService: AuthenticationService, private fb: FormBuilder, private router: Router){
      this.login = this.fb.group({
        username: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])],
        password: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])]
      })

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
    this.authenticationService.login(this.login.value)
      .subscribe(data => {
        console.log(data);
        this.authenticationService.changeAuthenticated(true);
        this.router.navigate(['/info']);
      },
      err => {
        this.errors = []
        for (var error of err.json()){
          console.log(error.msg);
          this.errors.push(error.msg);
        }
        this.submitted = false;
        console.log(err);
      })
  }

  logout(){
    this.authenticationService.logout();
    // TODO: On success show a success message
  }


}
