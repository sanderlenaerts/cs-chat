import { Component, ViewEncapsulation, OnInit, OnDestroy, Input, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { ChatService } from '../../services/chat.service';



@Component({
  selector: 'chat',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="chatbox" [ngClass]="!isLoggedIn ? 'full-chatbox' : ''">
      <div class="chat-header">
        <div class="inner-chat-header">
          <h3>Live Chat Support</h3>
        </div>
        <div class="close-button"><i class="fa fa-times" aria-hidden="true"></i></div>
      </div>
      <div class="chat-content">
        <div class="chat-partner" *ngIf="active">
          <p >You are currently chatting with {{partner.name}}</p>
          <p *ngIf="isLoggedIn"><span class="underlined">Problem: </span>{{partner.description}}</p>
        </div>
        <ng-container *ngIf="active">
          <div #messageList class="messages messageList">
            <div class="message employee" *ngFor="let message of messages">
              <h4>{{message.from}}</h4>
              <p>{{message.text}}</p>
            </div>
            <div *ngIf="chatDisabled">
              <p>{{partner.name}} has disconnected from the chat</p>
            </div>
          </div>
        </ng-container>

      </div>
      <div class="chat-input" *ngIf="active && !chatDisabled">
        <div>
          <textarea #text (keydown.enter)="sendMessage();false" rows="2" class="text-input" [(ngModel)]="message" name="message"></textarea>
          <button class="send-text" type="submit" (click)="sendMessage()">Send <i class="fa fa-paper-plane" aria-hidden="true"></i></button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dist/assets/css/chatbox.css']
})

export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('messageList') private myScrollContainer: ElementRef;
  isLoggedIn: boolean

  @ViewChild('textarea') text: ElementRef;

  @Input()
  active: boolean;

  @Input()
  chatDisabled: boolean;
  workActive: boolean;

  @Input()
  partner: any

  @Input()
  messages: any [];

  message: String = '';

  constructor(private authenticationService : AuthenticationService, private chatService : ChatService){

  }

  ngOnInit(){
    this.isLoggedIn = this.authenticationService.isLoggedIn();
    this.workActive = false;
  }

  sendMessage(){
    if (this.message != ''){
      console.log(this.message);
      this.chatService.sendMessage(this.message);
      this.message = '';
    }
  }


  ngAfterViewChecked(){
    this.scrollToBottom();
  }

  scrollToBottom(): void {
      try {

          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) { }
    }
}
