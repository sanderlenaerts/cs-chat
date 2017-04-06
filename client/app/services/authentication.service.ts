
import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { User } from '../models/user';


@Injectable()
export class AuthenticationService {

  public token: String;
  public user: User;

  @Output()
  authChange = new EventEmitter();

  constructor(private http: Http){
    this.token = JSON.parse(localStorage.getItem('token'));
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user == null){
      this.user =  {
        role: '',
        name: '',
        username: ''
      }
    }
  }
  // Observable string sources
  private authenticateChange = new Subject<any>();

  // Observable string streams
  changeEmitted$ = this.authenticateChange.asObservable();

  // Service message commands
  changeAuthenticated(change: any) {
      this.authenticateChange.next(change);
  }

  betweenOffice = function(){
    var date = new Date();
    var lower = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8, 30, 0);
    var upper = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 21, 30, 0);

    // check if the date passed is between these hours
    return lower <= date && upper >= date;
  }

  register(userData: any): Observable<boolean> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    return this.http.post('http://localhost:3000/api/register', userData, options)
      .map((response: Response) => response.json())
  }

  login(credentials: any) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    return this.http.post('http://localhost:3000/api/login', JSON.stringify(credentials), options)
      .map((response: Response) => {
        var res = response.json();

        // set token property
        this.token = res.token;
        this.user = {
          role: res.role,
          username: res.username,
          name: res.name
        }

        // store username and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('token', JSON.stringify(this.token));
        localStorage.setItem('user', JSON.stringify(this.user));

        return res;
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
    localStorage.removeItem('user');
    this.changeAuthenticated(false);
  }

  currentUser(){
    return this.user;
  }

  isLoggedIn() {
    return !!this.token;
  }
}
