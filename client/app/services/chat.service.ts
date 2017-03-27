
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as io from 'socket.io-client';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class ChatService {
  private socket;
  private url = 'http://localhost:3000';

  constructor(private http: Http, private authenticationService: AuthenticationService){

  }

  sendMessage(message){
    this.socket.emit('add-message', message);
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('message', (data) => {
        observer.next(data);
      });

      this.socket.on('connect', (data) => {
        console.log('connect');
        this.socket.emit('data', this.authenticationService.user);
      })

      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }
}
