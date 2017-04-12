
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as io from 'socket.io-client';
import { AuthenticationService } from './authentication.service';
import { Subject } from 'rxjs/Subject';
import { Ticket } from '../models/ticket';
import { NotificationService } from './notification.service';

@Injectable()
export class ChatService {
  private socket;
  private connection;
  private url = 'http://localhost:3000';
  private connectionChange = new Subject<any>();

  constructor(private http: Http, private authenticationService: AuthenticationService, private notificationService: NotificationService){

  }

  // Observable string streams
  changeConnectionEmitted$ = this.connectionChange.asObservable();

  // Service message commands
  changeConnected(change: any) {
      this.connectionChange.next(change);
  }

  nextCustomer(){
    this.socket.emit('match-customer', {
      uid: localStorage.getItem('uid')
    });
  }

  sendSupportData(data){
    // Send request to Express REST API

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    return this.http.post('/api/mail', JSON.stringify(data), options)
      .map((response: Response) => {
        this.notificationService.notify({
          message: "A ticket was sent",
          type: 'success'
        })
        return response.json()
      })
  }

  getActiveConnection(){
    return this.connection;
  }

  stopConversation(){
    this.socket.emit('stop-chat', {
      uid: localStorage.getItem('uid')
    });
  }

  sendMessage(message){
    let data = {
      uid: localStorage.getItem('uid'),
      message: message
    }
    this.socket.emit('add-message', data);
  }

  isRegistered(){
    this.socket.emit('isRegistered', {
      uid: localStorage.getItem('uid')
    })
  }

  joinQueue() {
    this.socket.emit('joinQueue', {
      uid: localStorage.getItem('uid')
    })
  }

  leaveQueue(){
    this.socket.emit('leaveQueue', {
      uid: localStorage.getItem('uid')
    })
  }

  updateCustomer(customer){
    this.socket.emit('updatecustomer', {
      uid: localStorage.getItem('uid'),
      customer: customer
    })
  }

  disconnect(){
    this.socket.disconnect();
  }

  connect(){
    return this.connectSocket(this.authenticationService.user);
  }

  getUpdates(){
    this.socket.emit('update', {
      uid: localStorage.getItem('uid')
    })
  }

  getChat(){
    console.log('Get chat');
    this.socket.emit('getChat', {
      uid: localStorage.getItem('uid')
    })
  }

  saveTicket(ticket: Ticket){
    this.socket.emit('save-ticket', {
      uid: localStorage.getItem('uid'),
      ticket: ticket
    })
  }

  private connectSocket(user){
    console.log('Connecting socket: ', user);
    this.socket = io("/");
    let observable = new Observable(observer => {
      console.log('Connecting socket.io');
      this.socket.on('message', (data) => {
        observer.next(data);
      });

      this.socket.on('connect', (data) => {
        console.log('connect');
        let userData;
        let type;
        let uid = localStorage.getItem('uid');

        if (user.name == ''){
          userData = user;
          type = "register";
        }
        else {
          userData = this.authenticationService.user;
          type = "auth";
        }
        this.socket.emit('register',
        {
          uid: uid,
          user: userData,
          type: type
        });
      })

      this.socket.on('identify', (data) => {
        localStorage.setItem('uid', data.uid);
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

      this.socket.on('continue', (data) => {
        observer.next(data);
      })

      this.socket.on('isRegistered', (data) => {
        observer.next(data);
      })

      return () => {
        this.socket.emit('disconenct');
        this.changeConnected(false);
      };
    })
    this.connection = observable;
    this.changeConnected(true);
    return observable;
  }

  isConnected(){
    return !!this.socket;
  }

}
