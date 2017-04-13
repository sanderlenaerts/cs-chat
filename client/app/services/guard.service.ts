import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
 
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
              this.authenticationService.logout().subscribe(data => {
                this.router.navigate(['/login']);
              });
              
              return false;
            }
            
        }
 
        // not logged in so redirect to login page
        this.router.navigate(['/login']);
        return false;
    }
}
