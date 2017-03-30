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
    <chat *ngIf="(registered && active) || isLoggedIn" [messages]="messages" [active]="active" [customer]="customer"></chat>
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
      <section [ngClass]="((isConnected && (amountQueue > 0)) || (isConnected && active)) ? 'divider' : ''" *ngIf="(isConnected && active)">
        <p>Chatting with:</p>
        <p>{{customer.name}}</p>
        <p>{{customer.ip}}</p>
      </section>
      <section *ngIf="isConnected && (amountQueue > 0)  || (isConnected && active)">
        <button *ngIf="!active" class="btn success-btn full-btn" (click)="nextCustomer()">Next customer</button>

        <button *ngIf="active" class="btn danger-btn full-btn" (click)="ticketSent ?  deleteModal.open() : detailsModal.open()" >Stop conversation</button>
      </section>
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
        <support-form (supportEvent)="sendSupportData($event)" [customer]="customer"></support-form>
     </modal-content>
  </modal>

  <modal  #deleteModal
         title=""
         class="modal modal-small"
         [hideCloseButton]="true"
         [closeOnEscape]="false"
         [closeOnOutsideClick]="false">

     <modal-content class="user-details">
       <p>Are you sure you want to termnate the chat session</p>
       <button (click)="deleteModal.close();terminateChat()" class="danger-button"><i class="fa fa-check"></i> Delete</button>
       <button (click)="deleteModal.close()"><i class="fa fa-times"></i> Cancel </button>
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
  isConnected: boolean;
  messages: any[] = [];
  inQueue: boolean;
  active: boolean;
  amountQueue: Number;
  position: Number;
  registered: boolean;
  customer: any;
  ticketSent: boolean;



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

  }

  terminateChat(){
    //Clear the chat
    this.messages = [];
    this.active = false;
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

  sendSupportData(supportForm){
    var data = {
      support: supportForm,
      chat: this.messages
    }
    console.log('test');

    //TODO: Move this inside the success from observable
    this.ticketSent = true;
    this.chatService.sendSupportData(data).subscribe(data => {
      // TODO: Success messages
      // TODO: Open modal that asks if they're sure to end the chat
    })
  }

  private handleData(data){
    console.log(data);
    if (data.type == 'start'){
      this.customer = data;
      console.log('setting active');
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
