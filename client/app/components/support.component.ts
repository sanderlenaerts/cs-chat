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

        <div *ngIf=" support.controls['name'].hasError('maxlength') && support.controls['name'].dirty" class="alert alert-danger">The name cannot be longer than 20 characters</div>

        <label for="name">Name</label>
        <input required id="name" type="text" name="name" placeholder="Name" [formControl]="support.controls['name']">

        <div *ngIf=" support.controls['type'].hasError('required') && support.controls['type'].dirty" class="alert alert-danger">You have to select a role for this account</div>

        <label for="type">Type of Support</label>
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

        <label for="proceed"></label>
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

        <input type="submit" [disabled]="!support.valid" value="End chat"/>
      </form>
    </div>
  `,
  styleUrls: ['./dist/assets/css/support-form.css']
})
export class SupportFormComponent implements OnInit, OnChanges {

  @Input()
  customer: Customer

  support: FormGroup;

  @Output()
  supportEvent = new EventEmitter();


  constructor(private authenticationService : AuthenticationService, private fb: FormBuilder){}


  ngOnInit(){
    this.support = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      quickfix: this.fb.group({
        'offandon': [''],
        'pebkkac': [''],
        'password': [''],
        'multidevice': ['']
      }, {validator: this.checkboxRequired}),
      location: null,
      room: [null],
      problem: [null],
      solution: [null],
      username: [null],
      proceed: this.fb.group({
        'resolve': [''],
        'ticket': [''],
        'credit': [''],
        'call': [''],
        'visit': [''],
        'fix': ['']
      }),
    })
  }

  ngOnChanges(change: SimpleChanges){
    console.log(change);
    var customer = change['customer'].currentValue;
    console.log(customer);

    if (customer){
      console.log(customer.name);
      this.support.patchValue({
        name: customer.name
      })
    }

  }

  doSupport(){
    //Send the data to the backend
    console.log("Do support");
    this.supportEvent.emit(this.support.value);
  }

  checkboxRequired(group: FormGroup){
    var valid = false;

    for (let name in group.controls) {
      var val = group.controls[name].value;
      if (val) {
        valid = true;
        break;
      }
    }

    if (valid) {
      return null;
    }

    return {
      checkboxRequired: true
    };
  }



}
