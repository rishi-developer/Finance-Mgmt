import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { BrokerModuleService } from '../../service/broker-module.service';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { Router } from '@angular/router';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { InviteRMModalComponent } from '../invite-rm-modal/invite-rm-modal.component';
import {
  CLIENTS,
  REQUEST_RAISED,
  RM,
} from 'src/app/constants/broker-admin.constants';
import { BrokerAdminRmList } from 'src/app/models/broker-admin';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-of-rm',
  templateUrl: './list-of-rm.component.html',
  styleUrls: ['./list-of-rm.component.css'],
})
export class ListOfRMComponent implements OnInit {
  displayedColumns: string[] = [
    'virtualRMId',
    'rmName',
    'noOfClients',
    'action',
  ];
  dataSource: MatTableDataSource<BrokerAdminRmList> =
    new MatTableDataSource<BrokerAdminRmList>([]);
  isMobile: boolean = false;
  userId: string = '';
  subheading: string = '';
  heading: string = '';
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  isTableHasFilteredData: boolean = true;
  userDetailSubscription: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private responsiveService: ResponsiveService,
    private toastr: ToastrShowService,
    private brokerModuleService: BrokerModuleService,
    private authUserService: AuthUserService,
    private sharedModuleService: SharedModuleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userDetailSubscription = this.authUserService
      .getUserDetailBehaviorSubject()
      .subscribe((data) => {
        if (data) this.userId = data.userId;
      });
    this.getBrokerAdminRmList();
    this.onResize();
    this.responsiveService.checkWidth();
    this.paginator._intl.itemsPerPageLabel = 'Rows per page:';
  }

  /**
   * Retrieves the list of RMs.
   */
  getBrokerAdminRmList() {
    this.brokerModuleService.getBrokerAdminRmList(this.userId).subscribe(
      (data) => {
        if (data) {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      (err) => {
        this.toastr.showError(REQUEST_RAISED.ERROR_DATA);
      }
    );
  }

  /**
   * Deactivates an RM.
   * @param rmUserId - User ID of the RM to deactivate.
   */
  deactivateRm(rmUserId: string) {
    this.brokerModuleService.deactivateRm(this.userId, rmUserId).subscribe(
      (data) => {
        if (data) {
          this.toastr.showSuccess('Rm removed successfully');
          this.getBrokerAdminRmList();
        }
      },
      (err) => {
        this.toastr.showError('Error in removing rm');
      }
    );
  }

  /**
   * Navigates to the profile of an RM.
   * @param rmUserId - User ID of the RM whose profile to view.
   */
  rmProfile(rmUserId: string) {
    this.router.navigate(['relationshipManager/rm-profile', rmUserId]);
  }

  /**
   * Handles the window resize event.
   */
  onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile: boolean) => {
      this.isMobile = isMobile;
    });
  }

  /**
   * Filter table data based on user input.
   * @param event - Value entered by the user.
   */
  applyFilter(event: KeyboardEvent) {
    let filterValue = (event.target as HTMLInputElement).value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (this.dataSource.filteredData?.length > 0) {
      this.isTableHasFilteredData = true;
    } else {
      this.isTableHasFilteredData = false;
    }
  }

  /**
   * Sort data based on column.
   */
  sortData() {
    this.dataSource.sortingDataAccessor = (
      data: BrokerAdminRmList,
      sortHeaderId: string
    ) => {
      if (!data[sortHeaderId as keyof BrokerAdminRmList]) {
        return this.sort.direction === 'asc' ? '3' : '1';
      }
      return (
        '2' +
        data[sortHeaderId as keyof BrokerAdminRmList].toString().toLowerCase()
      );
    };
  }

  /**
   * Opens the Invite RM modal dialog.
   * @param buttonType - Type of action button to display in the modal.
   * @param noOfClient - Number of clients associated with the RM.
   * @param rmFirstName - First name of the RM.
   * @param rmMiddleName - Middle name of the RM.
   * @param rmLastName - Last name of the RM.
   * @param rmUserId - User ID of the RM.
   */
  addRM(
    buttonType: string,
    noOfClient?: number,
    rmFirstName?: string,
    rmMiddleName?: string,
    rmLastName?: string,
    rmUserId?: string
  ) {
    if (buttonType === 'Assign/Reassign Client') {
      this.subheading = CLIENTS.ASSIGN_CLIENT;
      if (noOfClient === 0) {
        buttonType = 'Assign Client';
        this.heading = buttonType;
      } else {
        buttonType = 'Reassign Client';
        this.heading = buttonType;
      }
    } else {
      this.heading = 'Invite New RM';
      this.subheading = RM.INVITE_RM;
    }
    let inviteRmObj = {
      actionButton: buttonType,
      heading: this.heading,
      subheading: this.subheading,
      rmFirstName: rmFirstName,
      rmMiddleName: rmMiddleName,
      rmLastName: rmLastName,
      rmUserId: rmUserId,
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
      if (result) {
        this.sharedModuleService
          .createCommonInviteAssignReassign(result)
          .then(() => {
            this.getBrokerAdminRmList();
          });
      }
    });
  }

  /**
   * Unsubscribes from subscriptions.
   */
  ngOnDestroy(): void {
    this.userDetailSubscription.unsubscribe();
  }
}
