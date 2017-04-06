import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Notification } from '../models/notification';

@Component({
  selector: 'notification',
  template: `
  <div *ngIf="notification.message != ''" class="notification" [ngClass]="'notify-' + notification.type">
    <span>{{notification.message}}</span><span (click)="discardNotification()"><i class="fa fa-close"></i></span>
  </div>
  `,
  styleUrls: ['../dist/assets/css/notification.css']
})

export class NotificationComponent implements OnInit {

    @Input()
    notification: Notification;

    @Output()
    discard = new EventEmitter();

    ngOnInit(){
        this.notification = {
            message: '',
            type: ''
        }
    }

    discardNotification(){
        this.discard.emit(true);
    }

}