
import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class NotificationService {


  constructor(private http: Http){
    
  }
  // Observable string sources
  private notificationShow = new Subject<any>();

  // Observable string streams
  notificationEmitted$ = this.notificationShow.asObservable();

  // Service message commands
  notify(change: any) {
      this.notificationShow.next(change);
  }
}
