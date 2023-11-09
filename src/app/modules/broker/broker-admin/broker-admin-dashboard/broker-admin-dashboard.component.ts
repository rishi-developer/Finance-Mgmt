import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';

@Component({
  selector: 'app-broker-admin-dashboard',
  templateUrl: './broker-admin-dashboard.component.html',
  styleUrls: ['./broker-admin-dashboard.component.css'],
})
export class BrokerAdminDashboardComponent implements OnInit {
  mainHeadingValue: string = 'Home';
  hasRMFunctionality?: boolean;
  userDetailSubscription: Subscription = new Subscription();

  constructor(
    private sharedModuleService: SharedModuleService,
    private authUserService: AuthUserService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);

    this.userDetailSubscription = this.authUserService
      .getUserDetailBehaviorSubject()
      .subscribe((data) => {
        if (data) this.hasRMFunctionality = data.hasRMFunctionality;
      });
  }

  /**
   * Unsubscribes from subscriptions.
   */
  ngOnDestroy(): void {
    this.userDetailSubscription.unsubscribe();
  }
}
