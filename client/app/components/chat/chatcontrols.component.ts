import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'chat-controls',
  template: `
    <div class="controls">
      <section *ngIf="isConnected" class="divider">
        <button class="btn danger-btn full-btn">Quit work</button>
      </section>
      <section *ngIf="!isConnected" class="divider">
        <button class="btn success-btn full-btn" (click)="startWork()">Start work</button>
      </section>
      <section [ngClass]="isConnected ? 'divider' : ''">
        <p>Chatting with:</p>
        <p>Nobody</p>
      </section>
      <section *ngIf="isConnected">
        <button class="btn success-btn full-btn">Next customer</button>
      </section>
    </div>
  `,
  styleUrls: ['./dist/assets/css/chatcontrols.css']
})

export class ChatcontrolsComponent implements OnInit {

  isLoggedIn: boolean;
  isConnected: boolean;
  chatting: boolean;

  constructor(private authenticationService : AuthenticationService, private chatService : ChatService){

  }

  ngOnInit(){
    this.isLoggedIn = this.authenticationService.isLoggedIn();
    this.isConnected = this.chatService.isConnected();
    this.chatting = false;
  }

  startWork(){
    console.log("Work started");
    this.isConnected = true;
    this.chatService.startWork();
  }




}
