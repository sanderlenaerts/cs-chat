import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'chat',
  template: `
    <div class="chatbox" [ngClass]="!isLoggedIn ? 'full-chatbox' : ''">
      <div class="chat-header">
        <div class="inner-chat-header">
          <h3>Live Chat Support</h3>
        </div>
        <div class="close-button"><i class="fa fa-times" aria-hidden="true"></i></div>
      </div>
      <div class="chat-content">
        <p *ngIf="active">You are currently chatting with {{partner}}</p>
        <ng-container *ngIf="active">
          <div class="messages">
            <div class="message employee" *ngFor="let message of messages">
              <h4>{{message.from}}</h4>
              <p>{{message.text}}</p>
            </div>
          </div>
        </ng-container>

      </div>
      <div class="chat-input" *ngIf="active">
        <form>
          <textarea rows="2" class="text-input" [(ngModel)]="message" name="message"></textarea>
          <button class="send-text" type="submit" (click)="sendMessage()">Send <i class="fa fa-paper-plane" aria-hidden="true"></i></button>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./dist/assets/css/chatbox.css']
})

export class ChatComponent implements OnInit {

  isLoggedIn: boolean

  @Input()
  active: boolean;
  workActive: boolean;

  @Input()
  partner: String;

  @Input()
  messages: any [];

  message: String = '';

  constructor(private authenticationService : AuthenticationService, private chatService : ChatService){

  }

  ngOnInit(){
    this.isLoggedIn = this.authenticationService.isLoggedIn();
    this.active = false;
    this.workActive = false;
  }

  sendMessage(){
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

}
