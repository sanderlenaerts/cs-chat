
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

  getActiveConnection(){
    return this.connection;
  }

  stopConversation(){
    this.socket.emit('stop-chat', {});
  }

  sendMessage(message){
    this.socket.emit('add-message', message);
  }

  joinQueue() {
    return this.registerSocket();

  }

  private registerSocket(){
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('message', (data) => {
        observer.next(data);
      });

      this.socket.on('connect', (data) => {
        console.log('connect');
        this.socket.emit('data', this.authenticationService.user);
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
    return this.registerSocket();
  }

  quitWork(){
    this.connection = null;
    this.socket.disconnect();
  }

  isConnected(){
    return !!this.socket;
  }

}
