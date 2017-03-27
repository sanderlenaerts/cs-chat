import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class RoleGuard implements CanActivate {
 
    constructor(private authenticationService: AuthenticationService, private router: Router) { }
 
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

      console.log(this.authenticationService.token);

      var roles = route.data["roles"] as Array<string>;
      var isAllowed = (roles == null || roles.indexOf(this.authenticationService.user.role) != -1);

      if (!isAllowed){
        this.router.navigate(['/login']);
      }

      return isAllowed;

    }
}
