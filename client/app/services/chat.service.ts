
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as io from 'socket.io-client';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class ChatService {
  private socket;
  private connection;
  private url = 'http://localhost:3000';

  constructor(private http: Http, private authenticationService: AuthenticationService){

  }

  nextCustomer(){
    console.log('Asking for a customer');
    this.socket.emit('match-customer', {});
  }

  sendSupportData(data){
    // Send request to Express REST API

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    return this.http.post('http://localhost:3000/api/mail', JSON.stringify(data), options)
      .map((response: Response) => response.json())
  }

  getActiveConnection(){
    return this.connection;
  }

  stopConversation(){
    console.log('stopping chat');
    this.socket.emit('stop-chat', {});
  }



  sendMessage(message){
    this.socket.emit('add-message', message);
  }

  joinQueue(customer) {
    return this.registerSocket(customer);

  }

  disconnect(){
    this.socket.disconnect();
  }

  private registerSocket(d){
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('message', (data) => {
        observer.next(data);
      });

      this.socket.on('connect', (data) => {
        console.log('connect');
        let userData;
        let type;
        if (d !== null){
          userData = d;
          type = "register";
        }
        else {
          userData = this.authenticationService.user;
          type = "auth";
        }
        this.socket.emit('data',
        {
          user: userData,
          type: type
        });
      })

      this.socket.on('match-complete', (data) => {
        observer.next(data);
      })

      this.socket.on('endConversation', (data) => {
        observer.next(data);
      })

      this.socket.on('queue-length', (data) => {
        observer.next(data);
      })

      this.socket.on('queue-position', (data) => {
        observer.next(data);
      })

      this.socket.on('disableChat', (data) => {
        observer.next(data);
      })

      return () => {
        this.socket.disconnect();
      };
    })
    this.connection = observable;
    return observable;
  }

  leaveQueue(){
    this.socket.disconnect();
  }

  startWork(){
    return this.registerSocket(null);
  }

  quitWork(){
    this.connection = null;
    this.socket.disconnect();
  }

  isConnected(){
    return !!this.socket;
  }

}
