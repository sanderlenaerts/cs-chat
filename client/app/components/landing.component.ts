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

    <ul class="categories">
      <li *ngFor="let row of faq" [ngClass]="active === row.display ? 'active' : ''" (click)="setQuestions(row.display)">{{row.display}}</li>
    </ul>
      
      <ul class="questions">
        <li *ngFor="let qa of questions">
          <p><i class="fa fa-caret-right" aria-hidden="true"></i>
  {{qa.question}}</p>
          <p>
  {{qa.answer}}</p>
        </li>
      </ul>

    
  </div>
  `,
  styleUrls: ['./dist/assets/css/landing.css']
})

export class LandingComponent implements OnInit {

  faq: any[]
  questions: any[]
  active: String;

  ngOnInit(){
    // Get all the questions listed in the faq.json file
    this.getFAQ().subscribe(data => {
      this.faq = data.help;

      this.active = data.help[0].display;
      this.questions = data.help[0].faq;
    })
  }

  constructor(private http: Http){
    
  }

  // Send an http request to the faq.json file
  getFAQ(): Observable<any> {
    return this.http.get("../../faq.json")
      .map((res:any) => res.json());
  }

  setQuestions(display){
    this.active = display;

    for (var i = 0; i < this.faq.length; i++){
      console.log(this.faq[i]);
      if (this.faq[i].display == display){
        this.questions = this.faq[i].faq;
      }
    }

    
  }
}
