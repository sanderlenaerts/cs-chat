import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class TimeGuard implements CanActivate {
 
    constructor(private router: Router, private authenticationService: AuthenticationService) { }
 
    canActivate() {
        var token = localStorage.getItem('token');
        if (token) {
            // logged in so return true
            if(tokenNotExpired(null, token)){
              // Everything works out
              return true;
            }
            else {
              // If expired request new token
              this.authenticationService.logout();
              //TODO: Send message along that you have to log in again
              //TODO: Only navigate with router if logout success (observable?)

              // Check if the current time of today is between 8.30 and 21.30

              var betweenOfficeHours = this.authenticationService.betweenOffice();

              if (!betweenOfficeHours){
                this.router.navigate(['/']);
              }
              return betweenOfficeHours;
            }
        }
 
        // Check if the current time of today is between 8.30 and 21.30

        var betweenOfficeHours = this.authenticationService.betweenOffice();

        if (!betweenOfficeHours){
          this.router.navigate(['/']);
        }
        return betweenOfficeHours;
    }


}
