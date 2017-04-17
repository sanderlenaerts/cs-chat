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
    // Get all the questions listed in the faq.json file
    this.getFAQ().subscribe(data => {
      this.faq = data.help;
    })
  }

  constructor(private http: Http){
    
  }

  // Send an http request to the faq.json file
  getFAQ(): Observable<any> {
    return this.http.get("../../faq.json")
      .map((res:any) => res.json());
  }
}
