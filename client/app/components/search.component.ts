
import { Component, OnInit, style, state, animate, transition, trigger, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';

import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

import { SearchPipe } from '../filters/user.filter';

@Component({
  selector: 'search',
  template: `


    <div>
      <input #search type="text" placeholder="Search..." (input)="update.emit(search.value)">
    </div>

  `,
  styleUrls: ['./dist/assets/css/search.css'],
})

export class SearchComponent implements OnInit {

  @Output()
  update = new EventEmitter();

  constructor(){}

  ngOnInit(){
    this.update.emit('');
  }


}
