

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'public-view',
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./dist/assets/css/public.css']
})

export class PublicComponent implements OnInit {

  constructor(){

  }

  ngOnInit(){
    
  }

}
