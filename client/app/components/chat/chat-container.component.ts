import { Component, ViewChild, ViewEncapsulation, Output, OnInit, OnDestroy, trigger, transition, animate, style } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AuthenticationService } from '../../services/authentication.service';
import { SupportFormComponent } from '../support.component';
import { Ticket } from '../../models/ticket';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'chat-container',
  encapsulation: ViewEncapsulation.None,
  template: `
  <div class="chatcontainer">
    <div class="inner-container">

      <h3 *ngIf="!isLoggedIn && !active">We advise you to first carefully read the self-help section, as this might provide a solution to the issue(s) you may be experiencing.</h3>

      <div *ngIf="!active && !isLoggedIn && registered && partner.name != null && partner.name != ''" class="has-errors">
        <p class="error">{{partner.name}} has disconnected from the chat
      </div>
      <div *ngIf="!active && !isLoggedIn && registered" class="btn-container">
        <button [ngClass]="{'success-btn': inQueue == false, 'danger-btn': inQueue == true}" (click)="toggleQueue()" class="btn full-btn">{{ inQueue ? 'Leave queue' : 'Start chatting'}}</button>
        <p *ngIf="inQueue">You are currently number {{position}} in queue</p>
      </div>

    </div>
  
    <user-input (registered)="getCustomerData($event)" *ngIf="!registered && !isLoggedIn"></user-input>

    <chat class="chat" *ngIf="(registered && active) || isLoggedIn" [isLoggedIn]="isLoggedIn" [messages]="messages" [active]="active" [chatDisabled]="chatDisabled" [partner]="partner" (chatend)="disconnect($event)"></chat>

    <div class="control-group" *ngIf="isLoggedIn">
      <div class="controls" *ngIf="active">
        <button class="btn danger-btn full-btn" (click)="discardModal.open()" ><i class="fa fa-exclamation" aria-hidden="true"></i>
Discard chat<i class="fa fa-exclamation" aria-hidden="true"></i>
        </button>
      </div>
      <div class="controls" *ngIf="amountQueue >= 0">
        <section>
          <p><i class="fa fa-th-list" aria-hidden="true"></i>
{{amountQueue}} waiting</p>
        </section>
      </div>
      <div class="controls" *ngIf="active">
        <section>
            <button class="btn success-btn full-btn"
            (click)="detailsModal.open()">Ticket</button>
        </section>
        <section [ngClass]="(amountQueue > 0) ? 'divider' : ''">
          <div class="chat-data">
            <p><i class="fa fa-user-circle-o" aria-hidden="true"></i>
  {{partner.name}}</p>
            <p><i class="fa fa-plug" aria-hidden="true"></i>
  {{partner.ip}}</p>
            <p><i class="fa fa-envelope" aria-hidden="true"></i>
          {{partner.email}}</p>
          </div>
        </section>
        <section *ngIf="active">
          <button class="btn danger-btn full-btn" (click)="ticket.valid ? deleteModal.open() : detailsModal.open()" >Stop conversation</button>
        </section>
      </div>
      <div class="controls" *ngIf="(amountQueue > 0) && !active">
        <button class="btn success-btn full-btn" (click)="nextCustomer()">Next customer</button>
      </div>
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
       <button (click)="discardModal.close();stopChat()" class="danger-button"><i class="fa fa-check"></i> Discard chat</button>
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

export class ChatContainerComponent implements OnInit, OnDestroy {
  connection: any;
  isLoggedIn: boolean;

  //TODO: Look into changing it into an observable
  reset: boolean = false;

  messages: any[] = [];
  inQueue: boolean = false;
  active: boolean = false;
  chatDisabled: boolean = false;
  amountQueue: Number;
  position: Number;
  registered: boolean;
  customer: any;
  partner: any;
  ticket: Ticket;

  @ViewChild(SupportFormComponent) support: SupportFormComponent;

  constructor(private chatService: ChatService, private authenticationService: AuthenticationService, private notificationService: NotificationService){
    authenticationService.changeEmitted$.subscribe(
      authenticated => {
        this.isLoggedIn = authenticated;
     });

     
  }

  ngOnInit(){
    console.log('Initting container');
    this.isLoggedIn = this.authenticationService.isLoggedIn();
    this.connection = this.chatService.getActiveConnection().subscribe(data => {
      this.handleData(data);
    })
    if (this.isLoggedIn){
      this.chatService.getUpdates();
      this.chatService.getChat();
    }
    else {
      this.chatService.isRegistered();
    }
  }


  getCustomerData(customer){
    this.registered = true;
    this.customer = customer;
    this.chatService.updateCustomer(customer);
  }

  ngOnDestroy(){
    if (this.connection){
      // make sure we unsubscribe from the observable
      this.connection.unsubscribe();
    }
  }

  nextCustomer(){
    this.chatService.nextCustomer();
  }

  terminateChat(){
    this.chatService.stopConversation();
    
    //Send the form data
    this.chatService.sendSupportData(this.ticket).subscribe(data => {
      // TODO: Success messages
      this.reset = !this.reset;
    })
  }

  toggleQueue(){
    if (!this.inQueue){
      // Create the connection to socket.io
      this.chatService.joinQueue();
    }
    else {
      // Stop the connection
      this.chatService.leaveQueue();
    }
    this.inQueue = !this.inQueue;
  }

  stopChat(){
    this.chatService.stopConversation();
    //this.partner = null;
  }

  disconnect(data){
    this.stopChat();
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
    }
    this.ticket = data;
    this.chatService.saveTicket(this.ticket);
  }

  private handleData(data){
    console.log(data);
    if (data.type == 'start'){
      console.log(data);
      this.partner = data;
      this.active = true;
      this.chatDisabled = false;
    }
    else if (data.type == 'new-message'){
      console.log('new messages: ', data.messages);
      console.log('Current messages: ', this.messages);
      this.messages.push(data.messages);
    }
    else if (data.type == 'endConversation'){
      console.log('Clearing the conversation in container');
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
      this.notificationService.notify({
        message: this.partner.name + " disconnected",
        type: 'error'
      })
      this.chatDisabled = true;
    }
    else if (data.type == 'continue'){
      this.partner = data.partner;
      this.active = true;
      this.chatDisabled = false;
      this.messages = data.chat;
      this.ticket = data.ticket;
      this.support.fillForm(data.ticket);
    }
    else if (data.type == 'isRegistered'){
      console.log(data.chat);
      this.partner = data.partner;
      this.registered = data.registered;
      this.active = data.active;
      this.inQueue = data.queue;
      this.messages = data.chat;

    }
  }
}
