
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  constructor(private http: Http){

  }

  getUsers(){
    return this.http.get('/api/users')
      .map((response: Response) => response.json())
  }

  updateUser(username, data){
    let updated = {
      username: username,
      name: data.name,
      role: data.role
    }

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });


    return this.http.put('/api/user/' + username, updated, headers).map((res: Response) => res.json());
  }



  getUser(username){

    let params: URLSearchParams = new URLSearchParams();
    params.set('username', username);

    let requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this.http.get('/api/user', requestOptions)
      .map((response: Response) => response.json())
      .catch((error:any) => {
        if (error.status === 404){
          return Observable.throw("The user with name '" + username +  "' was not found");
        }
      })
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

    return this.http.delete('/api/users', options)
      .map((response: Response) => response.json())
  }

}
