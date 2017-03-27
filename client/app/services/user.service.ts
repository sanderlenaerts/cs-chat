
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  constructor(private http: Http){

  }

  getUsers(){
    return this.http.get('http://localhost:3000/api/users')
      .map((response: Response) => response.json())
  }

}
