import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuthUserService } from './common-services/auth-user-service/auth-user.service';
import { ResponsiveService } from './common-services/responsive-service/responsive.service';
import { SideBarToggleService } from './common-services/side-bar-toggle-service/side-bar-toggle.service';
import { ConfirmationModalComponent } from './shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Clovek-Frontend';
  mobile: boolean;
  flag: boolean = false;
  private subscriptionName!: Subscription;
  isLoggedIn = false;
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date;
  showSideBar: boolean = true;
  firstTimeLogin!: boolean;
  isExpanded!: boolean;
  constructor(
    private _responsiveService: ResponsiveService,
    private authUser: AuthUserService,
    private router: Router,
    private observer: BreakpointObserver,
    private sideBarToggleService: SideBarToggleService,
    private idle: Idle,
    private keepalive: Keepalive,
    public dialog: MatDialog,
    public dialogRef: MatDialog
  ) {
    this.subscriptionName = this.authUser
      .getSideBarFlag()
      .subscribe((res: any) => {
        this.flag = res;
      });
    this.mobile = false;
    // sets an idle timeout of 300 seconds, for testing purposes.
    idle.setIdle(300);
    // sets a timeout period of 10 seconds. after 310 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(10);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.logout();
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = "You've gone idle!";
      localStorage.setItem('UserState', this.idleState);
      this.openInactivityErrorModal();
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    this.authUser.isLoggedInObservable.subscribe((res: any) => {
      this.isLoggedIn = res;
      if (this.isLoggedIn) {
        idle.watch();
        this.timedOut = false;
      } else {
        idle.stop();
      }
    });
  }

  ngOnInit() {
    this.authUser.getUserDetailBehaviorSubject().subscribe((data) => {
      if (data) {
        let userRole = data.newRoleFinal?.roleDescription;
        if (userRole === 'BROKER ADMIN') {
          this.firstTimeLogin = data.brokerAdminfirstTimeLogin;
          this.showSideBar = !this.firstTimeLogin;
        } else {
          this.showSideBar = true;
        }
      }
    });
    this.authUser.getToken();
    this.authUser.isLoggedInObservable.subscribe((res: boolean) => {
      if (res) {
        this.isLoggedIn = res;
      }
    });

    this.sideBarToggleService
      .getIsExpandedUpdate()
      .subscribe((res: { text: boolean }) => {
        this.isExpanded = res?.text;
      });

    this.onResize();
    this.sideBarFunction();
  }

  openInactivityErrorModal() {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '600px',
      data: {
        headingValue: 'Oh Snap!',
        textValue:
          'Your session has expired due to inactivity. [You will time out in 10 seconds automatically]',
        buttonValue: 'Login Again',
        modalType: 'Inactivity Error Modal',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.logout();
    });
  }

  reset() {
    this.idle.watch();
    this.timedOut = false;
  }

  /**
   * Logs out the user from the application and clears the local storage
   */
  logout() {
    localStorage.clear();
    this.authUser.isLoggedIn.next(false);
    this.router.navigate(['/login']);
    this.dialogRef.closeAll();
  }

  sideBarFunction() {
    this.authUser.isLoggedInObservable.subscribe((res: any) => {
      this.isLoggedIn = res;
      if (this.isLoggedIn) {
        this.observer
          .observe(['(max-width: 768px)'])
          .pipe(delay(1))
          .subscribe((res) => {
            if (res.matches) {
              this.sideBarToggleService.sendIsExpandedUpdate(false);
              // this.sidenav.mode = 'over';
              // this.sidenav.close();
              // this.sideBarToggleService.isOpened.next(false);
            } else {
              this.sideBarToggleService.sendIsExpandedUpdate(true);
              // this.sidenav.mode = 'side';
              // this.sidenav.open();
              // this.sideBarToggleService.isOpened.next(true);
            }
          });
      }
    });
  }

  onResize() {
    this._responsiveService.checkWidth();
  }
}
