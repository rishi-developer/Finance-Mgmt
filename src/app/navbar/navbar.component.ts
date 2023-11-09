import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { AuthGuard } from 'src/app/AuthGuard/auth.guard';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUserService } from '../common-services/auth-user-service/auth-user.service';
import { ResponsiveService } from '../common-services/responsive-service/responsive.service';
import { SideBarToggleService } from '../common-services/side-bar-toggle-service/side-bar-toggle.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdatePasswordOtpModalComponent } from '../shared/update-password-otp-modal/update-password-otp-modal.component';
import { USERROLES } from '../shared/common-enums/enum';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  mainHeadingValue?: string;
  @Output() sidenav: EventEmitter<any> = new EventEmitter();
  mobile: boolean = false;
  isLoggedIn = true;
  isSideBarOpened = true;
  userFirstName: string = '';
  userLastName: string = '';
  userFirstNameAlphabet: string = '';
  userLastNameAlphabet: string = '';
  userId: string = '';
  role: string = '';
  brokerAdminfirstTimeLogin?: boolean;
  isExpanded!: boolean;

  constructor(
    private _authService: AuthUserService,
    private router: Router,
    private _sideBarToggleService: SideBarToggleService,
    private _responsiveService: ResponsiveService,
    private sharedModuleService: SharedModuleService,
    private _authGuard: AuthGuard,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._authService.isLoggedInObservable.subscribe((res: any) => {
      this.isLoggedIn = res;
    });
    this._sideBarToggleService.isSideOpened.subscribe((res: any) => {
      this.isSideBarOpened = res;
    });
    this._authService.getUserDetailBehaviorSubject().subscribe((data) => {
      if (data) {
        this.userId = data.userId;
        this.role = data.newRoleFinal.roleDescription;
        if (this.role === USERROLES.BROKER_ADMIN) {
          this.brokerAdminfirstTimeLogin = data.brokerAdminfirstTimeLogin;
        }
        this.userFirstName = data.firstName;
        this.userLastName = data.lastName;
        this.userFirstNameAlphabet = this.userFirstName.charAt(0);
        this.userLastNameAlphabet = this.userLastName.charAt(0);
      }
    });
    this.onResize();
    this._responsiveService.checkWidth();
    this.sharedModuleService.getNavbarHeading().subscribe((data) => {
      if (data) this.mainHeadingValue = data.mainHeading;
    });

    this._sideBarToggleService.getIsExpandedUpdate().subscribe((res: any) => {
      this.isExpanded = res.text;
    });
  }

  logout() {
    this._authGuard.logout();
  }
  toggle() {
    this.sidenav.emit();
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this._sideBarToggleService.sendIsExpandedUpdate(this.isExpanded);
  }

  showProfile() {
    if (this.role === USERROLES.RELATIONSHIP_MANAGER)
      this.router.navigate(['relationshipManager/rm-profile', this.userId]);

    if (this.role === USERROLES.BROKER_ADMIN)
      this.router.navigate(['broker/profile', this.userId]);

    if (this.role === USERROLES.CLIENT) this.router.navigate(['client']);
  }
  onResize() {
    this._responsiveService.getMobileStatus().subscribe((isMobile: boolean) => {
      this.mobile = isMobile;
    });
  }
}
