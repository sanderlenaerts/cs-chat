
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

  deleteUser(username){
    let user = {
      username: username
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions(
      {
        headers: headers,
        body: user
      });

    return this.http.delete('http://localhost:3000/api/users', options)
      .map((response: Response) => response.json())
  }

}
