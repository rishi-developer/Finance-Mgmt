import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {
  mainHeadingValue: string = 'Error';
  //showSideBar: boolean = false;
  isOpened: boolean= true;
  // isError: boolean=false;

  constructor(private sharedModuleService: SharedModuleService,
    private authUser: AuthUserService,
    private router: Router) { }

  ngOnInit(): void {
    
    this.isOpened = false;
    this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);
  }

  returnToHome() {
    //this.logout();
    this.router.navigate(['/login']);
    // currently set to return to dashboard, use the commented out code if needed to directly logout 
  }
  // logout() {
  //   localStorage.clear();
  //   this.authUser.isLoggedIn.next(false);
  //   this.router.navigate(['/login']);
  // }

}
