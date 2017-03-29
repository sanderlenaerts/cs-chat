import { Component, OnInit, OnDestroy, Input, AfterViewChecked, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators  } from '@angular/forms';
import { EmailValidator } from '../validators/email.validator';


@Component({
  selector: 'user-input',
  template: `
    <div class="form-wrapper">
      <form [formGroup]="form" (ngSubmit)="register()">
        <div *ngIf="form.controls['name'].hasError('required') && form.controls['name'].dirty" class="alert alert-danger">You must include a name.</div>

        <label for="name">Name</label>
        <input type="text" name="name" id="name" placeholder="Name" autofocus required [formControl]="form.controls['name']"/>


        <div *ngIf="form.controls['email'].hasError('invalidEmailAddress') && form.controls['email'].dirty" class="alert alert-danger">Your email address must be of pattern \"john@doe.com\".</div>

        <div *ngIf="form.controls['email'].hasError('required') && form.controls['email'].dirty" class="alert alert-danger">You must include an email.</div>

        <label for="email">Email</label>
        <input type="text" name="email" id="email" placeholder="Email" autofocus required [formControl]="form.controls['email']"/>

        <div *ngIf="form.controls['description'].hasError('required') && form.controls['description'].dirty" class="alert alert-danger">You must include a description of your problem.</div>

        <label for="description">Description of problem</label>
        <input type="text" name="description" id="description" placeholder="Brief description" autofocus required [formControl]="form.controls['description']"/>

        <input type="submit" value="Next" [disabled]="!form.valid">

      </form>
    </div>
  `,
  styleUrls: ['./dist/assets/css/user-input.css']
})

export class UserInputComponent implements OnInit {

  @Output() registered = new EventEmitter();
  form: FormGroup;


  constructor(private authenticationService : AuthenticationService, private fb: FormBuilder ){

  }

  ngOnInit(){
    this.form = this.fb.group({
      name: [null, Validators.required],
      email: [null, Validators.compose([Validators.required, EmailValidator.isValidMailFormat])],
      description: [null, Validators.required]
    })
  }

  register(){
    // We have to send the data to the parent component
    // We can use @Output and events for this

    // We emit the event
    this.registered.emit(this.form.value);
  }

}
