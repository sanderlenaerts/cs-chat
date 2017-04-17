import { Component, OnInit } from '@angular/core';
import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'landing',
  template: `
  <div class="wrapper">
    <h1>FAQ</h1>

    <div *ngFor="let category of faq">
      <h2>{{category.display}}</h2>
      <ul>
        <li *ngFor="let row of category.faq">
          <p><i class="fa fa-caret-right" aria-hidden="true"></i>
  {{row.question}}</p>
          <p>
  {{row.answer}}</p>
        </li>
      </ul>
    </div>

    
  </div>
  `,
  styleUrls: ['./dist/assets/css/landing.css']
})

export class LandingComponent implements OnInit {

  faq: any[]

  ngOnInit(){
    this.getFAQ().subscribe(data => {
      this.faq = data.help;
      console.log(data.help)
    })
  }

  constructor(private http: Http){
    
  }

  getFAQ(): Observable<any> {
    return this.http.get("../../faq.json")
      .map((res:any) => res.json());
  }
}
