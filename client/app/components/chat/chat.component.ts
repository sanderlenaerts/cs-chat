import { Component, ViewEncapsulation, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { ChatService } from '../../services/chat.service';

import { FocusDirective } from '../../directives/focus.directive';

// Simple 'focus' Directive

@Component({
  selector: 'chat',
  template: `
    <div class="chatbox" [ngClass]="!isLoggedIn ? 'full-chatbox' : ''">
      <div class="chat-header">
        <div class="inner-chat-header">
          <h3>Live Chat Support</h3>
        </div>
        <div *ngIf="!isLoggedIn && active" class="close-button"><i class="fa fa-times" aria-hidden="true" (click)="endConversation()"></i></div>
      </div>
      <div class="chat-content">
        <div class="chat-partner" *ngIf="active">
          <p >You are currently chatting with {{partner.name}}</p>
          <p *ngIf="isLoggedIn"><span class="underlined">Problem: </span>{{partner.description}}</p>
        </div>
        <ng-container *ngIf="active">
          <div #messageList class="messages messageList">
            <div class="message employee" *ngFor="let message of messages" >
              <div [ngClass]="message.from == partner.name ? 'received' : 'sent'">
                <h4>{{message.from}}</h4>
                <div class="message-group">
                  <p *ngFor="let content of message.text">
                    <span>{{content}}</span>
                  </p>
                </div>

              </div>
            </div>
            <div *ngIf="chatDisabled">
              <p>{{partner.name}} has disconnected from the chat</p>
            </div>
          </div>
        </ng-container>

      </div>
      <div class="chat-input" *ngIf="active && !chatDisabled">
        <div>
          <textarea #text [focus]="inputFocused" (keydown.enter)="sendMessage();false" rows="2" class="text-input" [(ngModel)]="message" name="message"></textarea>
          <button class="send-text" type="submit" (click)="sendMessage();moveFocus()">Send <i class="fa fa-paper-plane" aria-hidden="true"></i></button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dist/assets/css/chatbox.css']

})

export class ChatComponent implements OnInit, AfterViewChecked {

  // Autoscroll container
  @ViewChild('messageList') private myScrollContainer: ElementRef;

  // Refocus on input field
  @ViewChild('textarea') text: ElementRef;

  @Input()
  isLoggedIn: boolean
  message: String = '';
  inputFocused: boolean = false;

  @Input()
  active: boolean;

  @Input()
  chatDisabled: boolean;

  @Input()
  partner: any

  @Input()
  messages: any [];

  @Output()
  chatend = new EventEmitter();

  constructor(private authenticationService : AuthenticationService, private chatService : ChatService){}

  // Put focus back on the input field
  moveFocus(){
    this.inputFocused = true;
    setTimeout(() => {this.inputFocused = false});
  }

  ngOnInit(){
  }

  // Send a send message reques to the socket
  sendMessage(){
    if (this.message != ''){
      this.chatService.sendMessage(this.message);
      this.message = '';
    }
  }

  // Every time the view is checked (every time a new message arrives), scroll the chatbox to the bottom
  ngAfterViewChecked(){
    this.scrollToBottom();
  }

  // Emit an output event to end the chat
  // No variables needed, can pass whatever
  endConversation(){
    this.chatend.emit('');
  }

  // Scroll the chat to the bottom
  private scrollToBottom(): void {
      try {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } 
      catch(err) { 

      }
    }
}
