import { Component, Input, OnInit } from '@angular/core';
import { Notification } from '../models/notification';

@Component({
  selector: 'notification',
  template: `
  <div *ngIf="notification.message != ''" class="notification" [ngClass]="'notify-' + notification.type">
    <i class="fa fa-check"></i> <span>{{notification.message}}</span>
  </div>
  `,
  styleUrls: ['../dist/assets/css/notification.css']
})

export class NotificationComponent implements OnInit {

    @Input()
    notification: Notification;

    ngOnInit(){
        this.notification = {
            message: '',
            type: ''
        }
    }

}