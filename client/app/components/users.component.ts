
import { Component, OnInit, style, state, animate, transition, trigger, ViewEncapsulation, Input} from '@angular/core';

import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

import { SearchPipe } from '../filters/user.filter';
import { SearchComponent } from './search.component';

@Component({
  selector: 'user-list',
  encapsulation: ViewEncapsulation.None,
  template: `

  <div class="buttons-container">
    <!-- Search -->
    <search (update)="term = $event" class="search-container"></search>
    <div [routerLink]="['/admin/registration']" class="success-button">
      Add new user
    </div>
    <!-- Add user -->
  </div>
  <section class="cards">
    <!-- One user card taking up 50% of the screen -->
    <article *ngFor="let user of users | searchFilter: term" class="user-card">
      <div class="user-role">
        <p>{{user.role}}</p>
      </div>
      <p class="username">{{user.name}} ({{user.username}})</p>
      <div *ngIf="user.username !== 'admin'" class="update-user" [routerLink]="['/admin/user', user.username]">
        <i class="fa fa-pencil" aria-hidden="true"></i>
      </div>
    </article>

  </section>


  `,
  styleUrls: ['./dist/assets/css/userlist.css']
})

export class UsersComponent implements OnInit {

  users: any[] = [];

  constructor(private userService: UserService){}

  ngOnInit(){
    this.userService.getUsers()
      .subscribe(data => {
        this.users = data;
      },
      err => {
      })
  }

}
