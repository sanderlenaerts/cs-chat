
import { Component, OnInit, style, state, animate, transition, trigger, ViewEncapsulation} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { WhitespaceValidator } from './validators/whitespace.validator';
import { NotificationService } from '../services/notification.service';

// RxJS operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Component({
  selector: 'registration',
  template: `
  <div class="content-wrapper">
    <div class="form-wrapper">
      <h3>Register new user</h3>
      <div *ngIf="submitted" class="dots-loader"></div>
      <div *ngIf="errors?.length > 0 && !submitted" class="has-errors">
        <li *ngFor="let error of errors" class="error">
          {{error}}
        </li>
      </div>
      <form *ngIf="!submitted" (ngSubmit)="doRegister()" [formGroup]="register">
       <div *ngIf=" register.controls['username'].hasError('whitespace')&& register.controls['username'].dirty" class="alert alert-danger">The username cannot contain whitespaces</div>

        <div class="alert" [ngClass]="((register.controls['username'].hasError('minlength') || register.controls['username'].hasError('maxlength'))  && register.controls['name'].dirty) ? 'alert-danger' : ''">The username must be between 3 and 10 characters long
        </div>
        <label for="username">Username</label>
        <input required id="username" type="text" name="username" placeholder="Username" [formControl]="register.controls['username']">

        <div class="alert" [ngClass]="((register.controls['name'].hasError('minlength') || register.controls['name'].hasError('maxlength'))  && register.controls['name'].dirty) ? 'alert-danger' : ''">The name must be between 6 and 20 characters long
        </div>

        <label for="name">Name</label>
        <input required id="name" type="text" name="name" placeholder="Name" [formControl]="register.controls['name']">

        <div class="alert" [ngClass]="((register.controls['password'].hasError('minlength') || register.controls['password'].hasError('maxlength'))  && register.controls['name'].dirty) ? 'alert-danger' : ''">The password must be between 5 and 10 characters long
        </div>

    
        <label for="password">Password</label>
        <input required id="password" type="password" name="password" value="" placeholder="Password" [formControl]="register.controls['password']">

        <div *ngIf=" register.controls['role'].hasError('required')&& register.controls['role'].dirty" class="alert alert-danger">You have to select a role for this account</div>

        <label for="role">Role</label>
        <select id="role" required name="role" [formControl]="register.controls['role']">
          <option selected value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>

        <input type="submit" [disabled]="!register.valid" value="Register new user">
      </form>
    </div>
  </div>
  `,
  styleUrls: ['./dist/assets/css/registration.css']
})

export class RegisterComponent implements OnInit {

  register: FormGroup
  errors: String []
  submitted: boolean

  constructor(private fb: FormBuilder, private authenticationService: AuthenticationService, private router: Router, private notificationService: NotificationService){}


  ngOnInit(){
    // Building the form and adding validation on the input fields
    this.register = this.fb.group({
      username: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10), WhitespaceValidator.hasNoWhiteSpace])],
      name: [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
      role: ['USER', Validators.required]
    })
  }

  doRegister(){
      this.submitted = true;
      this.authenticationService.register(this.register.value)
        .subscribe(
          data => {
            this.errors = [];            
            this.router.navigate(['/admin/users']);
            this.notificationService.notify({
              message: "User was successfully added",
              type: "success"
            })
          },
          err => {
            this.submitted = false;
            this.errors = [];
            console.log(err.json());
            for (var error of err.json()){
              console.log(error.msg);
              this.errors.push(error.msg);
            }
          }
        )
    }
}
