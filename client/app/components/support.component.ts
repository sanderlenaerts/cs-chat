import { Component, OnInit, Output, EventEmitter, OnChanges, OnDestroy, Input, AfterViewChecked, ElementRef, ViewChild, SimpleChanges } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';


export interface Customer {
  name: String,
  description: String,
  email: String,
  ip: String
}


@Component({
  selector: 'support-form',

  template: `
    <div class="form-wrapper">
      <form *ngIf="!submitted" (ngSubmit)="doSupport()" [formGroup]="support">
        <p>Fields marked with * are required</p>
        <div *ngIf=" support.controls['name'].hasError('maxlength') && support.controls['name'].dirty" class="alert alert-danger">The name cannot be longer than 20 characters</div>

        <label for="name">Name<span class="superscript">*</span></label>
        <input required id="name" type="text" name="name" placeholder="Name" [formControl]="support.controls['name']">

        <div *ngIf=" support.controls['type'].hasError('required') && support.controls['type'].dirty" class="alert alert-danger">You have to select a type for this ticket</div>

        <label for="type">Type of Support<span class="superscript">*</span></label>
        <label class="sidelabel">
          <input type="radio" value="wifi" formControlName="type" name="type">
          WiFi
        </label>
        <label class="sidelabel">
          <input type="radio" value="support" formControlName="type" name="type">
          Support
        </label>
        <label class="sidelabel">
          <input type="radio" value="voip" formControlName="type" name="type">
          VOIP
        </label>
        <label class="sidelabel">
          <input type="radio" value="operations" formControlName="type" name="type">
          Operations/Accounts
        </label>

        <label for="quickfix">Quick fix</label>
        <label class="sidelabel"><input type="checkbox"
        [formControl]="support.controls.quickfix.controls.password"/>Password</label>

        <label class="sidelabel"><input type="checkbox"
        [formControl]="support.controls.quickfix.controls.offandon"/>Off and On again</label>

        <label class="sidelabel"><input type="checkbox"
        [formControl]="support.controls.quickfix.controls.pebkkac"/>PEBKKAC</label>

        <label class="sidelabel"><input type="checkbox"
        [formControl]="support.controls.quickfix.controls.multidevice"/>Multi Device logoff</label>

        <label class="sidelabel"><input type="checkbox"
        [formControl]="support.controls.quickfix.controls.other"/><input #otherFix (keypress)="checkOtherFix(otherFix.value)" placeholder="Other..." class="inline-checkboxes" type="text" [formControl]="support.controls.otherFix"></label>

       

        <label for="location">Location</label>
        <input id="location" type="text" name="location" placeholder="Location" [formControl]="support.controls['location']">

        <label for="username">Username</label>
        <input id="username" type="text" name="username" placeholder="Username" [formControl]="support.controls['username']">

        <label for="room">Room / Site Number</label>
        <input  id="room" type="text" name="room" placeholder="Room / Site number" [formControl]="support.controls['room']">

        <label for="problem">Problem description</label>
        <textarea id="problem" type="text" name="problem" placeholder="Problem" [formControl]="support.controls['problem']"></textarea>

        <label for="solution">Solution</label>
        <textarea id="solution" type="text" name="solution" placeholder="Solution" [formControl]="support.controls['solution']"></textarea>

        <label for="proceed">Proceed</label>
        <label class="sidelabel"><input type="checkbox"
        [formControl]="support.controls.proceed.controls.resolve"/>Resolve</label>

        <label class="sidelabel"><input type="checkbox"
        [formControl]="support.controls.proceed.controls.ticket"/>Create Ticket</label>

        <label class="sidelabel"><input type="checkbox"
        [formControl]="support.controls.proceed.controls.credit"/>Credit</label>

        <label class="sidelabel"><input type="checkbox"
        [formControl]="support.controls.proceed.controls.call"/>Call Back</label>

        <label class="sidelabel"><input type="checkbox"
        [formControl]="support.controls.proceed.controls.visit"/>Site visit</label>

        <label class="sidelabel"><input type="checkbox"
        [formControl]="support.controls.proceed.controls.fix"/>Break Fix</label>

         <label class="sidelabel"><input type="checkbox"
        [formControl]="support.controls.proceed.controls.other"/><input #otherProceed (keypress)="checkOtherProceed(otherProceed.value)" placeholder="Other..." class="inline-checkboxes" type="text" [formControl]="support.controls.otherProceed"></label>

      </form>
    </div>
  `,
  styleUrls: ['./dist/assets/css/support-form.css']
})
export class SupportFormComponent implements OnInit, OnChanges {

  support: FormGroup;

  @Input()
  customer: Customer

  @Input()
  reset: boolean;

  @Output()
  supportEvent = new EventEmitter();

  constructor(private authenticationService : AuthenticationService, private fb: FormBuilder){}


  ngOnInit(){
    // Initialize the support form
    this.support = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      quickfix: this.fb.group({
        'offandon': [false],
        'pebkkac': [false],
        'password': [false],
        'multidevice': [false],
        'other': [false]
      }),
      location: null,
      room: [null],
      problem: [null],
      solution: [null],
      username: [null],
      proceed: this.fb.group({
        'resolve': [false],
        'ticket': [false],
        'credit': [false],
        'call': [false],
        'visit': [false],
        'fix': [false],
        'other': [false]
      }),
      otherProceed: [''],
      otherFix: ['']
    })

    // When the ticket is changed, emit an event to communicate the changes to the parent component
    this.support.valueChanges.subscribe(data => {
      //Send the data to the backend
      var obj = {
        support: data,
        valid: this.support.valid,
      }

      this.supportEvent.emit(obj);
    });
  }

  // Detect a change to context
  ngOnChanges(change: SimpleChanges){
    if (change.hasOwnProperty('customer')){
      var customer = change['customer'];

      if (customer.currentValue){
        this.support.patchValue({
          name: customer.currentValue.name
        })
      }
    }
    else if (change.hasOwnProperty('reset')){
      // Reset the form if the reset property was altered
      if (change['reset']){
        this.support.reset();
      }
    }
  }

  // On reload, refill the form with data
  fillForm(ticket){
    this.support.patchValue(ticket.support);
  }
}
