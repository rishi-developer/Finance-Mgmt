import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IsActiveMatchOptions, Router } from '@angular/router';
import { AuthUserService } from '../common-services/auth-user-service/auth-user.service';
import { SharedModuleService } from '../common-services/shared-module-service/shared-module.service';
import { SideBarToggleService } from '../common-services/side-bar-toggle-service/side-bar-toggle.service';
import { InviteRMModalComponent } from '../modules/broker/broker-admin/invite-rm-modal/invite-rm-modal.component';
import { USERROLES } from '../shared/common-enums/enum';
import { SidebarToggleResponse } from '../models/broker-admin';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  profileScore!: string;
  userId!: string;
  clientId!: string;
  flag: boolean = false;
  role: string = '';
  state?: number;
  selectedReport?: string;
  selectedModal?: string;
  subheading: string = '';
  heading: string = '';
  isReportsActive: string = 'false';
  isActive: boolean = false;
  hasRMFunctionality?: boolean;
  reportsList = [
    'Portfolio Valuation',
    'Portfolio Summary',
    'Capital Gain Realized',
    'Capital Gain Unrealized',
    'Transactions',
    'Dividend Report',
    'Profit And Loss',
    'Transaction History',
  ];
  showSubmenu: boolean = false;
  isExpanded!: boolean;
  activeLink: string = '';
  myMatchOptions: IsActiveMatchOptions = {
    queryParams: 'exact',
    matrixParams: 'ignored',
    paths: 'exact',
    fragment: 'ignored',
  };
  constructor(
    private authUserService: AuthUserService,
    public dialog: MatDialog,
    private router: Router,
    private sharedModuleService: SharedModuleService,
    private sideBarToggleService: SideBarToggleService
  ) {}

  ngOnInit(): void {
    this.authUserService.getUserDetailBehaviorSubject().subscribe((data) => {
      if (data) {
        this.role = data.newRoleFinal.roleDescription;
        this.hasRMFunctionality = data.hasRMFunctionality;
        this.userId = data.userId;
      }
    });
    this.sideBarToggleService.getIsExpandedUpdate().subscribe((res: SidebarToggleResponse) => {
      this.isExpanded = res.text;
    });
    if (this.role === USERROLES.CLIENT) {
      this.clientId = this.userId;
      let payload = {
        userId: this.clientId,
      };
      this.sharedModuleService
        .getClientRiskAssessmentScore(payload)
        .subscribe((res) => {
          if (res) {
            this.profileScore = res.message;
          }
        });
    }
  }

  setOpenState(stateNumber: number) {
    this.state = stateNumber;
  }

  transactionRouting() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
  }

  addRM(buttonType: string) {
    this.selectedModal = buttonType;
    this.isActive = true;
    if (buttonType == 'Send Email Invitation Broker Admin') {
      this.heading = 'Invite New Broker Admin';
      this.subheading =
        'Provide the below required details to onboard a broker admin for your organization.';
    } else {
      this.heading = 'Invite New RM';
      this.subheading =
        'Provide the below required details to onboard a new RM for your organization.';
    }
    let inviteRmObj = {
      actionButton: buttonType,
      heading: this.heading,
      subheading: this.subheading,
    };
    const dialogRef = this.dialog.open(InviteRMModalComponent, {
      width: '496px',
      height: '100%',
      data: { modalData: inviteRmObj },
      position: { right: '0px' },
      autoFocus: false,
      panelClass: 'rm-modal',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.isActive = false;
      if (result) {
        this.sharedModuleService
          .createCommonInviteAssignReassign(result)
          .then(() => {});
      }
    });
  }
}
