import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {  ActivatedRouteSnapshot, CanActivate,CanActivateChild,Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthUserService } from '../common-services/auth-user-service/auth-user.service';
import {browserRefresh} from '../common-services/auth-user-service/auth-user.service'
import { ConfirmationModalComponent } from '../shared/confirmation-modal/confirmation-modal.component';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  public browserRefresh?: boolean;
  refreshTokenTimeout:any;
  token:any;
  userStateValue:any;
  tokenExpiration:any;

  constructor(private authService: AuthUserService,
    private router: Router,
    public dialog: MatDialog,) {
      this.tokenExpiration=localStorage.getItem('token');
      this.startRefreshTokenTimer();
    }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return false;
  }

  startRefreshTokenTimer() {
      const jwtToken = JSON.parse(atob(this.tokenExpiration.split('.')[1]));
      const expires = new Date(jwtToken.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (60 * 1000);
      this.refreshTokenTimeout = setTimeout(() => this.logout(), timeout);
  }



  canActivate(): boolean{
    this.browserRefresh = browserRefresh;
    if(this.browserRefresh){
      this.userStateValue=localStorage.getItem('UserState');
      if(this.userStateValue){
        this.logout();
      }
    }
    if(this.authService.getToken()!=null)
    {
      return true;
    }
    localStorage.clear();
    this.authService.isLoggedIn.next(false);
    this.router.navigate(['/login']);
    return false;


  }
  autoLogoutModalFunction(){
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '600px',
      data: {headingValue: 'Oh Snap!',textValue:'Your session has expired.', buttonValue: 'Login Again',modalType:'Auto Logout Modal'},
    });
    dialogRef.afterClosed().subscribe(result => {
      this.logout();
    });
  }
  logout(){
    localStorage.clear();
    this.authService.isLoggedIn.next(false);
    this.router.navigate(['/login']);
    return false;
  }

}
