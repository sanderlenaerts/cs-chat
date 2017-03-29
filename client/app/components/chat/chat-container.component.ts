import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'chat-container',
  template: `
  <div class="chatcontainer">
    <h3>We advise you to first carefully read the self-help section, as this might provide a solution to the issue(s) you may be experiencing.</h3>

    <!-- TODO: Output event that saves the user-data -->
    <user-input (registered)="getCustomerData($event)" *ngIf="!registered && !isLoggedIn"></user-input>
    <chat *ngIf="registered || isLoggedIn" [messages]="messages" [active]="active" [partner]="partner"></chat>
    <div class="controls" *ngIf="isLoggedIn">
      <section *ngIf="isConnected" [ngClass]="isConnected ? 'divider' : ''">
        <p>People in queue:</p>
        <p>{{amountQueue}}</p>
      </section>
      <section *ngIf="isConnected" class="divider">
        <button class="btn danger-btn full-btn" (click)="quitWork()">Quit work</button>
      </section>
      <section *ngIf="!isConnected" class="divider">
        <button class="btn success-btn full-btn" (click)="startWork()">Start work</button>
      </section>
      <section [ngClass]="((isConnected && (amountQueue > 0)) || (isConnected && active)) ? 'divider' : ''" *ngIf="isConnected && (amountQueue > 0)  || (isConnected && active)">
        <p>Chatting with:</p>
        <p>{{partner}}</p>
      </section>
      <section *ngIf="isConnected && (amountQueue > 0)  || (isConnected && active)">
        <button *ngIf="!active" class="btn success-btn full-btn" (click)="nextCustomer()">Next customer</button>

        <button *ngIf="active" class="btn danger-btn full-btn" (click)="stopConversation()">Stop conversation</button>
      </section>
    </div>
    <div *ngIf="!active && !isLoggedIn && registered" class="btn-container">
      <button [ngClass]="{'success-btn': inQueue == false, 'danger-btn': inQueue == true}" (click)="toggleQueue()" class="btn full-btn">{{ inQueue ? 'Leave queue' : 'Start chatting'}}</button>
      <p *ngIf="inQueue">You are currently number {{position}} in queue</p>
    </div>
  </div>


  `,
  styleUrls: ['./dist/assets/css/chatcontainer.css']
})

export class ChatContainerComponent implements OnInit {
  connection: any;
  isLoggedIn: boolean;
  isConnected: boolean;
  messages: any[] = [];
  inQueue: boolean;
  active: boolean;
  partner: String;
  amountQueue: Number;
  position: Number;
  registered: boolean;
  customer: any;

  constructor(private chatService: ChatService, private authenticationService: AuthenticationService){}

  ngOnInit(){
    this.isLoggedIn = this.authenticationService.isLoggedIn();
    this.isConnected = false;
    this.inQueue = false;
    this.active = false;
    this.registered = false;
  }

  getCustomerData(customer){
    this.registered = true;
    this.customer = customer;
  }

  startWork(){
    this.connection = this.chatService.startWork().subscribe(data => {
      // Do something with the data;
      this.handleData(data);
    })
    this.isConnected = true;
  }

  quitWork(){
    this.stopConversation();
    this.connection.unsubscribe();
    this.isConnected = false;
  }

  ngOnDestroy(){
    if (this.connection !== null){
      this.connection.unsubscribe();
    }
  }

  nextCustomer(){
    this.chatService.nextCustomer();
  }

  stopConversation(){
    //Clear the chat
    this.messages = [];
    this.active = false;
    this.partner = null;

    // Emit to socket that you quitWork
    this.chatService.stopConversation();

  }

  toggleQueue(){
    if (!this.inQueue){
      // Create the connection
      this.connection = this.chatService.joinQueue(this.customer).subscribe(data => {
        console.log(data);
        this.handleData(data);

      })
    }
    else {
      // Stop the connection
      this.connection.unsubscribe();
      this.chatService.leaveQueue();
    }
    this.inQueue = !this.inQueue;
  }

  private handleData(data){
    console.log(data);
    if (data.type == 'start'){
      this.partner = data.name;
      this.customer = data;
      this.active = true;
    }
    else if (data.type == 'new-message'){
      console.log("From: ", data.from);
      this.messages.push({
        from: data.from,
        text: data.text
      });
      console.log(this.messages);
    }
    else if (data.type == 'endConversation'){
      this.inQueue = false;
      this.messages = [];
      this.partner = null;
      this.active = false;
    }
    else if (data.type == 'queue-length'){
      this.amountQueue = data.length;
    }
    else if (data.type == 'queue-position'){
      this.position = data.position;
    }
  }
}
