import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthUserService } from '../common-services/auth-user-service/auth-user.service';

@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {

  constructor(private authService: AuthUserService,
    private router: Router) { }

  canActivate(): boolean {
    if (this.authService.getRole()!=null) {
      return true;
    }
    localStorage.clear();
    this.authService.isLoggedIn.next(false);
    this.router.navigate(['/login']);
    return false;
  }

}
