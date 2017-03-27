import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'chat',
  template: `
    <div class="chatbox">


      <div class="chat-header">
        <div class="inner-chat-header">
          <h3>Live Chat Support</h3>
        </div>
        <div class="close-button"><i class="fa fa-times" aria-hidden="true"></i></div>
      </div>
      <div class="chat-content">
        <div *ngIf="!chatActive" class="btn-container">
          <p *ngIf="inQueue">You are currently number x in queue</p>
          <button [ngClass]="{'success-btn': inQueue == false, 'danger-btn': inQueue == true}" (click)="toggleQueue()" class="btn">{{ inQueue ? 'Leave queue' : 'Start chatting'}}</button>
        </div>
        <div class="messages" *ngIf="chatActive">
          <div class="message employee">
            <h4>Sander</h4>
            <p>Hi there. How can I be of help?</p>
          </div>
          <div class="message customer">
            <h4>Customer47809</h4>
            <p>Hello. I have some trouble connecting to the internet on my iPad.</p>
          </div>
        </div>
        <ng-container *ngIf="chatActive">
          <div class="messages">
            <div class="message employee" *ngFor="let message of messages">
              <h4>Sander</h4>
              <p>{{message}}</p>
            </div>
          </div>
        </ng-container>

      </div>
      <div class="chat-input" *ngIf="chatActive">
        <form>
          <textarea rows="2" class="text-input" [(ngModel)]="message" name="message"></textarea>
          <button class="send-text" type="submit" (click)="sendMessage()">Send <i class="fa fa-paper-plane" aria-hidden="true"></i></button>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./dist/assets/css/chatbox.css']
})

export class ChatComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean
  inQueue: boolean;
  chatActive: boolean;
  connection: any;
  messages: any [] = [];
  message: String = '';

  constructor(private authenticationService : AuthenticationService, private chatService : ChatService){

  }

  ngOnInit(){
    this.isLoggedIn = this.authenticationService.isLoggedIn();
    this.inQueue = false;
    this.chatActive = true;

    this.connection = this.chatService.getMessages().subscribe(data => {
      this.messages.push(data.text);
    })
  }

  toggleQueue(){
    this.inQueue = !this.inQueue;
  }

  sendMessage(){
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
