import { Component, ViewEncapsulation, Output, OnInit, OnDestroy, trigger, transition, animate, style } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'chat-container',
  encapsulation: ViewEncapsulation.None,
  template: `
  <div class="chatcontainer">
    <h3 *ngIf="!isLoggedIn">We advise you to first carefully read the self-help section, as this might provide a solution to the issue(s) you may be experiencing.</h3>

    <!-- TODO: Output event that saves the user-data -->
    <user-input (registered)="getCustomerData($event)" *ngIf="!registered && !isLoggedIn"></user-input>

    <chat class="chat" *ngIf="(registered && active) || isLoggedIn" [messages]="messages" [active]="active" [chatDisabled]="chatDisabled" [partner]="partner" (chatend)="endChatConversation($event)"></chat>

    <div class="control-group" *ngIf="isLoggedIn">
      <div class="controls" *ngIf="isConnected && active">
        <button class="btn danger-btn full-btn" (click)="discardModal.open()" ><i class="fa fa-exclamation" aria-hidden="true"></i>
Discard chat<i class="fa fa-exclamation" aria-hidden="true"></i>
        </button>
      </div>
      <div class="controls">
        <section *ngIf="!active">
          <button *ngIf="isConnected" class="btn danger-btn full-btn" (click)="quitWork()" >Quit work</button>

          <button *ngIf="!isConnected" class="btn success-btn full-btn" (click)="startWork()">Start work</button>
        </section>
        <section *ngIf="isConnected">
          <p [ngClass]="active ? '' : 'padded'"><i class="fa fa-th-list" aria-hidden="true"></i>
{{amountQueue}} waiting</p>
        </section>
      </div>
      <div class="controls" *ngIf="active && isConnected">
        <section>
            <button class="btn success-btn full-btn"
            (click)="detailsModal.open()">Ticket</button>
        </section>
        <section [ngClass]="((isConnected && (amountQueue > 0)) || isConnected) ? 'divider' : ''" *ngIf="isConnected">
          <div class="chat-data">
            <p><i class="fa fa-user-circle-o" aria-hidden="true"></i>
  {{partner.name}}</p>
            <p><i class="fa fa-plug" aria-hidden="true"></i>
  {{partner.ip}}</p>
            <p><i class="fa fa-envelope" aria-hidden="true"></i>
          {{partner.email}}</p>
          </div>
        </section>
        <section *ngIf="isConnected && (amountQueue > 0)  || isConnected ">
          <button class="btn danger-btn full-btn" (click)="ticket.valid ? deleteModal.open() : detailsModal.open()" >Stop conversation</button>
        </section>
      </div>
      <div class="controls" *ngIf="isConnected && (amountQueue > 0) && !active">
        <button class="btn success-btn full-btn" (click)="nextCustomer()">Next customer</button>
      </div>
    </div>

    <div *ngIf="!active && !isLoggedIn && registered && !!partner" class="has-errors">
      <p class="error">{{partner.name}} has disconnected from the chat
    </div>
    <div *ngIf="!active && !isLoggedIn && registered" class="btn-container">
      <button [ngClass]="{'success-btn': inQueue == false, 'danger-btn': inQueue == true}" (click)="toggleQueue()" class="btn full-btn">{{ inQueue ? 'Leave queue' : 'Start chatting'}}</button>
      <p *ngIf="inQueue">You are currently number {{position}} in queue</p>
    </div>
  </div>

  <modal  #detailsModal
         title=""
         class="modal modal-large"
         [hideCloseButton]="true"
         [closeOnEscape]="false"
         [closeOnOutsideClick]="false">
    <modal-header>
      <button (click)="detailsModal.close()" class="close"><i class="fa fa-times" aria-hidden="true"></i></button>
    </modal-header>

     <modal-content class="user-details">
        <support-form (supportEvent)="sendSupportData($event)" [reset]="reset" [customer]="partner"></support-form>
     </modal-content>
  </modal>

  <modal  #deleteModal
         title=""
         class="modal modal-small"
         [hideCloseButton]="true"
         [closeOnEscape]="false"
         [closeOnOutsideClick]="false">

     <modal-content class="user-details">
       <p>Are you sure you want to terminate the chat session</p>
       <button (click)="deleteModal.close();terminateChat()" class="danger-button"><i class="fa fa-check"></i> Terminate</button>
       <button (click)="deleteModal.close()"><i class="fa fa-times"></i> Cancel </button>
     </modal-content>
  </modal>

  <modal  #discardModal
         title=""
         class="modal modal-small"
         [hideCloseButton]="true"
         [closeOnEscape]="false"
         [closeOnOutsideClick]="false">

     <modal-content class="user-details">
       <p>Are you sure you want to discard the chat session? This will disconnect the customer and no ticket can be saved.</p>
       <button (click)="discardModal.close();discardChat()" class="danger-button"><i class="fa fa-check"></i> Discard chat</button>
       <button (click)="discardModal.close()"><i class="fa fa-times"></i> Cancel </button>
     </modal-content>
  </modal>

  `,
  styleUrls: ['./dist/assets/css/chatcontainer.css'],
  animations: [
        trigger('fadeInOut', [
            transition(':enter', [   // :enter is alias to 'void => *'
                style({ opacity: 0 }),
                animate(250, style({ opacity: 1 }))
            ]),
            transition(':leave', [   // :leave is alias to '* => void'
                animate(250, style({ opacity: 0 }))
            ])
        ])
    ]
})

export class ChatContainerComponent implements OnInit {
  connection: any;
  isLoggedIn: boolean;
  reset: boolean = false;
  isConnected: boolean;
  messages: any[] = [];
  inQueue: boolean;
  active: boolean;
  chatDisabled: boolean;
  amountQueue: Number;
  position: Number;
  registered: boolean;
  customer: any;
  partner: any;
  ticket =  {
    support: {},
    valid: false,
    chat: []
  };




  constructor(private chatService: ChatService, private authenticationService: AuthenticationService){}

  ngOnInit(){
    this.isLoggedIn = this.authenticationService.isLoggedIn();
    this.isConnected = false;
    this.inQueue = false;
    this.active = false;
    this.chatDisabled = false;
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
    if (!this.active){
      this.chatService.stopConversation();
      this.connection.unsubscribe();
      this.isConnected = false;
      this.active = false;
      this.messages = [];
    }

  }

  ngOnDestroy(){
    if (this.connection){
      this.connection.unsubscribe();
    }
  }

  nextCustomer(){
    this.chatService.nextCustomer();
    this.chatDisabled = false;
  }

  terminateChat(){
    //Clear the chat

    this.messages = [];
    this.active = false;
    this.chatService.stopConversation();

    //Send the form data
    this.chatService.sendSupportData(this.ticket).subscribe(data => {
      // TODO: Success messages
      this.reset = !this.reset;
    })
  }

  toggleQueue(){
    if (!this.inQueue){
      // Create the connection
      console.log('joinin the queue');
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

  discardChat(){
    this.endChatConversation('');
  }

  endChatConversation(data){
    this.messages = [];
    this.active = false;
    this.chatService.stopConversation();
    this.inQueue = false;
    this.partner = null;
    this.connection.unsubscribe();
  }

  sendSupportData(supportForm){
    var data = {
      support: supportForm.support,
      chat: this.messages,
      valid: supportForm.valid
    }
    if(this.partner){
      data.support.email = this.partner.email;
      console.log(data.support.email);
    }
    this.ticket = data;
  }

  private handleData(data){
    console.log(data);
    if (data.type == 'start'){
      this.partner = data;
      console.log('setting active');
      this.active = true;
    }
    else if (data.type == 'new-message'){
      console.log("From: ", data.from);
      this.messages.push({
        from: data.from,
        text: data.text
      });
    }
    else if (data.type == 'endConversation'){
      this.inQueue = false;
      this.messages = [];
      this.active = false;
    }
    else if (data.type == 'queue-length'){
      this.amountQueue = data.length;
    }
    else if (data.type == 'queue-position'){
      this.position = data.position;
    }
    else if (data.type == 'disableChat'){
      this.chatDisabled = true;
    }
  }
}
