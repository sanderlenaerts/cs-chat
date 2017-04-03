
import { Component, OnInit, style, state, animate, transition, trigger, ViewEncapsulation} from '@angular/core';

import { UserService } from '../services/user.service';

@Component({
  selector: 'user-list',
  encapsulation: ViewEncapsulation.None,
  template: `

  <div class="buttons-container">
    <!-- Search -->
    <div class="search-container">
      <input type="text" placeholder="Search...">
    </div>
    <div [routerLink]="['/admin/registration']" class="success-button">
      Add new user
    </div>
    <!-- Add user -->
  </div>
  <section class="cards">
    <!-- One user card taking up 50% of the screen -->
    <article *ngFor="let user of users" class="user-card">
      <div class="user-role">
        <p>{{user.role}}</p>
      </div>
      <p class="username">{{user.name}} ({{user.username}})</p>
      <div class="delete-user" (click)="deleteModal.open()">
        <i class="fa fa-trash"></i>
      </div>
    </article>

  </section>
  <modal  #deleteModal
         title=""
         class="modal modal-small"
         [hideCloseButton]="true"
         [closeOnEscape]="false"
         [closeOnOutsideClick]="false">

     <modal-content class="user-details">
       <p>Are you sure you want to delete this user?</p>
       <p>This action cannot be reversed!</p>
       <button (click)="deleteModal.close();" class="danger-button"><i class="fa fa-check"></i> Delete</button>
       <button (click)="deleteModal.close()"><i class="fa fa-times"></i> Cancel </button>
     </modal-content>
  </modal>

  `,
  styleUrls: ['./dist/assets/css/userlist.css'],
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

export class UsersComponent implements OnInit {

  users: any[]

  constructor(private userService: UserService){}

  ngOnInit(){
    this.userService.getUsers()
      .subscribe(data => {
        console.log(data);
        this.users = data;
      },
      err => {
        console.log(err);
      })
  }
}
