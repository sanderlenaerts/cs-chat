
import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {

  public token: String;
  public user = {
    role: '',
    name: '',
    username: ''
  }

  @Output()
  authChange = new EventEmitter();

  constructor(private http: Http){
    this.token = JSON.parse(localStorage.getItem('token'));
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user == null){
      this.user = {
        role: '',
        name: '',
        username: ''
      }
    }
  }

  betweenOffice = function(){
    var date = new Date();
    var lower = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8, 30, 0);

    var upper = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 10, 30, 0);

    // check if the date passed is between these hours
    return lower <= date && upper >= date;
  }

  register(userData: any): Observable<boolean> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    return this.http.post('http://localhost:3000/api/register', JSON.stringify(userData), options)
      .map((response: Response) => response.json())
  }

  login(credentials: any) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    return this.http.post('http://localhost:3000/api/login', JSON.stringify(credentials), options)
      .map((response: Response) => {
        //TODO: Do something with the jwt

        var res = response.json();

        // set token property
        this.token = res.token;
        this.user.role = res.role;
        this.user.username = res.username;
        this.user.name = res.name;

        console.log(this.user);

        // store username and jwt token in local storage to keep user logged in between page refreshes
        console.log(JSON.stringify(this.user));
        localStorage.setItem('token', JSON.stringify(this.token));
        localStorage.setItem('user', JSON.stringify(this.user));

        return response.json();
      })
  }

  logout(){
    localStorage.removeItem('token');
    this.token = null;
    this.user = {
      role: '',
      name: '',
      username: ''
    }
  }

  currentUser(){
    return this.user;
  }

  isLoggedIn() {
    return !!this.token;
  }
}
