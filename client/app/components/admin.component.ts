import { Component, OnInit} from '@angular/core';


@Component({
  selector: 'admin-page',
  template: `
  
  <div class="inner-nav">
    <ul>
      <li [routerLinkActive]="['active']" [routerLink]="['/admin/users']">Users</li>
    </ul>
  </div>
  <main>
    <router-outlet></router-outlet>
  </main>
  `,
  styleUrls: ['./dist/assets/css/admin.css'],
})

export class AdminComponent implements OnInit {

  

  constructor(){}

  ngOnInit(){}
  
}
