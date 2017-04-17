

import { Component, Input, Output, EventEmitter} from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'dropdown',
  template: `
    <div id="dropdown" class="dropdown-content">
      <a routerLink="/info"><i class="fa fa-lg fa-fw fa-question-circle"></i>Self-help</a>
      <a routerLink="/live-chat"><i class="fa fa-lg fa-fw fa-comments"></i>Live Chat</a>
      <a *ngIf="connected && authenticationService.user.role == 'ADMIN'" [routerLink]="['/admin']"><i class="fa fa-lg fa-fw fa-unlock-alt" aria-hidden="true"></i>
Admin Panel </a>
      <a *ngIf="connected" (click)="logout()"><i class="fa fa-lg fa-fw fa-sign-out"></i>Log out</a>
  </div>
  `,
  styleUrls: ['./dist/assets/css/dropdown.css']
})

export class DropdownComponent {

  @Input()
  connected;

  @Output()
  disconnect = new EventEmitter();

  constructor(private authenticationService: AuthenticationService, private router: Router){

  }


  // Emit an event to logout
  logout(){
    this.disconnect.emit(false);
  }

}
