
import { Component, OnInit, style, state, animate, transition, trigger, ViewEncapsulation, Input} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { NotificationService } from '../services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';

import { SearchPipe } from '../filters/user.filter';
import { SearchComponent } from './search.component';

@Component({
  selector: 'update-form',
  encapsulation: ViewEncapsulation.None,
  template: `
  <div class="content-wrapper">
    <div class="form-wrapper">
      <h3>Update user</h3>
      <div *ngIf="submitted" class="dots-loader"></div>
      <div *ngIf="errors?.length > 0 && !submitted" class="has-errors">
        <li *ngFor="let error of errors" class="error">
          {{error}}
        </li>
      </div>
      <form *ngIf="!submitted" (ngSubmit)="doUpdate()" [formGroup]="update">


        <label for="username">Username</label>
        <p>{{user.username}}</p>

        <div *ngIf=" update.controls['name'].hasError('minlength') && update.controls['name'].dirty" class="alert alert-danger">The name must be at least 6 characters long</div>

        <div *ngIf=" update.controls['name'].hasError('maxlength') && update.controls['name'].dirty" class="alert alert-danger">The name cannot be longer than 20 characters</div>

        <label for="name">Name</label>
        <input required id="name" type="text" name="name" placeholder="Name" [formControl]="update.controls['name']">


        <div *ngIf=" update.controls['role'].hasError('required')&& update.controls['role'].dirty" class="alert alert-danger">You have to select a role for this account</div>

        <label for="role">Role</label>
        <select id="role" required name="role" [formControl]="update.controls['role']">
          <option selected value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        <div class="delete-container">
          <a (click)="deleteModal.open()">Delete {{user.username}}</a>
        </div>
        <input type="submit" [disabled]="!update.valid" value="Update">
      </form>
    </div>
  </div>

  <modal  #deleteModal
         title=""
         class="modal modal-small"
         [hideCloseButton]="true"
         [closeOnEscape]="false"
         [closeOnOutsideClick]="false">

     <modal-content class="user-details">
       <p>Are you sure you want to delete this user?</p>
       <p>This action cannot be reversed!</p>
       <button (click)="isLoggedInUser(user.username) ? sureModal.open() : deleteUser(user.username);deleteModal.close()" class="danger-button"><i class="fa fa-check"></i> Delete</button>
       <button (click)="deleteModal.close()"><i class="fa fa-times"></i> Cancel </button>
     </modal-content>
  </modal>

   <modal  #sureModal
         title=""
         class="modal modal-small"
         [hideCloseButton]="true"
         [closeOnEscape]="false"
         [closeOnOutsideClick]="false">

     <modal-content class="user-details">
       <p>You are about to delete yourself. Are you sure you want to do this?</p>
       <p>This action cannot be reversed!</p>
       <button (click)="deleteUser(user.username);sureModal.close();deleteModal.close();" class="danger-button"><i class="fa fa-check"></i> Delete</button>
       <button (click)="sureModal.close()"><i class="fa fa-times"></i> Cancel </button>
     </modal-content>
  </modal>

  `,
  styleUrls: ['./dist/assets/css/update-form.css'],
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

export class UpdateUserComponent implements OnInit {

  user: any = {};
  update: FormGroup;
  sub: any;

  constructor(private route: ActivatedRoute, private userService: UserService, private authenticationService: AuthenticationService, private router: Router, private fb: FormBuilder, private notificationService: NotificationService){}

  ngOnInit(){
    this.update = this.fb.group({
      name: [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])],
      role: [null, Validators.required]
    })

    this.sub = this.route.params.subscribe(params => {

     //Load the user details
     this.userService.getUser(params['username']).subscribe(data => {
       console.log(data);
       this.user = data;
       this.update.patchValue({
         username: data.username,
         name: data.name,
         role: data.role
       })
     },
       error => {
         this.router.navigate(['/admin/users']);
         this.notificationService.notify({
          message: error,
          type: 'error'
        })
       });
   });
  }

  doUpdate(){
    this.userService.updateUser(this.user.username, this.update.value).subscribe(data => {
      this.notificationService.notify({
        message: this.user.username + " was successfully updated",
        type: 'success'
      })
      this.router.navigate(['/admin/users']);
      
    },
    error => {
      console.log(error);
    })
  }

  isLoggedInUser(username){
    return username == this.authenticationService.user.username;
  }

  deleteUser(username){
    //delete user
    this.userService.deleteUser(username).subscribe(data => {
      console.log('Deleted the user');

      if (this.isLoggedInUser(username)){
        this.authenticationService.logout();
        // TODO: Change to observable so 'navigate' can move into success of the observable
        this.router.navigate(['/login']);
      }
      else {
        this.router.navigate(['/admin/users'])
      }
    })
  }

}
