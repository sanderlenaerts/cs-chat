import { Component, OnInit } from '@angular/core';
import { Injectable }     from '@angular/core';


@Component({
  selector: 'home',
  template: `
  <div class="wrapper">
    <p>Experiencing any issues with one of our networks? We are happy to be of help through any of our communication channels. You can also reach us through email at <a href="mailto:support@hq.net.nz">support@hq.net.nz</a> or give us a call on 0800 479 434.</p>
    <div class="btn-container">
        <button class="btn" [routerLink]="['/info']">Read the FAQs</button>
        <button class="btn" [routerLink]="['/livechat']">Chat with an employee</button>
    </div>
  </div>
  `,
  styleUrls: ['./dist/assets/css/home.css']
})

export class HomeComponent implements OnInit {

  ngOnInit(){}

  constructor(){}

}
