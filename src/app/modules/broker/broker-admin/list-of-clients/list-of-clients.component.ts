import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { Router } from '@angular/router';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { BrokerModuleService } from 'src/app/modules/broker/service/broker-module.service';
import { InviteRMModalComponent } from '../invite-rm-modal/invite-rm-modal.component';
import { UccActivationModalComponent } from 'src/app/modules/client/ucc-activation-modal/ucc-activation-modal.component';
import { CLIENTS } from 'src/app/constants/broker-admin.constants';
import { BrokerAdminClientList } from 'src/app/models/broker-admin';

@Component({
  selector: 'app-list-of-clients',
  templateUrl: './list-of-clients.component.html',
  styleUrls: ['./list-of-clients.component.css'],
})
export class ListOfClientsComponent implements OnInit {
  mainHeadingValue: string = 'Home';
  dataSource: MatTableDataSource<BrokerAdminClientList> =
    new MatTableDataSource<BrokerAdminClientList>([]);
  isMobile: boolean = false;
  userId: string = '';
  actionButton: string = '';
  subheading: string = '';
  assignedRmId: string = '';
  hasRMFunctionality?: boolean;
  subscriptionName: Subscription;
  userDetailSubscription: Subscription = new Subscription();
  displayedColumns: string[] = [
    'panNo',
    'clientName',
    'portfolioValue',
    'investedValue',
    'assignedRM',
    'action',
  ];
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  isTableHasFilteredData: boolean = true;

  constructor(
    private responsiveService: ResponsiveService,
    private brokerModuleService: BrokerModuleService,
    private toastr: ToastrShowService,
    private authUserService: AuthUserService,
    private router: Router,
    public dialog: MatDialog,
    private sharedModuleService: SharedModuleService
  ) {
    this.subscriptionName = this.sharedModuleService
      .getUccActivationUpdate()
      .subscribe(() => {
        this.getBrokerAdminClientList();
      });
  }

  ngOnInit(): void {
    this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);
    this.userDetailSubscription = this.authUserService
      .getUserDetailBehaviorSubject()
      .subscribe((data) => {
        if (data) this.userId = data.userId;
        this.hasRMFunctionality = data.hasRMFunctionality;
      });

    this.onResize();
    this.responsiveService.checkWidth();
    this.getBrokerAdminClientList();
    this.paginator._intl.itemsPerPageLabel = 'Rows per page:';
  }

  /**
   * Handles window resize
   */
  onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile: boolean) => {
      this.isMobile = isMobile;
    });
  }

  /**
   * Navigates to client profile page.
   * @param clientuserId - Client user ID.
   * @param clientCodeBse - Client code for BSE.
   */
  clientProfile(clientuserId: string, clientCodeBse: string) {
    this.router.navigate(['broker-client-portfolio', clientuserId], {
      queryParams: { clientProfileType: 'AllclientsProfile' },
    });
    localStorage.setItem('clientCodeBse', clientCodeBse);
  }

  /**
   * Navigates to client onboarding page.
   */
  addNewClient() {
    this.router.navigate(['client/client-onboarding']);
  }

  /**
   * Activates UCC for a client.
   * @param clientUserId - Client user ID.
   * @param clientFirstName - Client's first name.
   * @param clientMiddleName - Client's middle name.
   * @param clientLastName - Client's last name.
   */
  acticateUcc(
    clientUserId: string,
    clientFirstName: string,
    clientMiddleName: string,
    clientLastName: string
  ) {
    let uccActivationObj = {
      clientId: clientUserId,
      clientFirstName: clientFirstName,
      clientMiddleName: clientMiddleName,
      clientLastName: clientLastName,
    };
    const dialogRef = this.dialog.open(UccActivationModalComponent, {
      width: '1024px',
      data: { modalData: uccActivationObj },
      panelClass: 'modal-styling',
    });
  }

  /**
   * Activates nominee for a client.
   * @param clientUserId - Client user ID.
   */
  activateNominee(clientUserId: string) {
    this.sharedModuleService
      .activateNominee(this.userId, clientUserId)
      .subscribe(
        (data) => {
          if (data && data.message) {
            let bseResponse = JSON.parse(data.message);
            let status = bseResponse.StatusCode;
            let remarks = bseResponse.Remarks;
            if (status === '101') {
              this.toastr.showError(remarks);
            } else {
              this.toastr.showSuccess(remarks);
            }
          }
        },
        (err) => {
          this.toastr.showError(CLIENTS.ERROR_ACTIVATE);
        }
      );
  }

  /**
   * Retrieves the list of broker admin clients.
   */
  getBrokerAdminClientList() {
    this.brokerModuleService.getBrokerAdminClientList(this.userId).subscribe(
      (data) => {
        if (data?.length) {
          for (const element of data) {
            element.portfolioValue = Number(element.portfolioValue).toFixed(2);
            element.investedValue = Number(element.investedValue).toFixed(2);
          }
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      (err) => {
        this.toastr.showError('Error in loading data');
      }
    );
  }

  /**
   * Assigns or reassigns an RM to a client.
   * @param assignedRMUserId -  Assigned RM's user ID.
   * @param clientFirstName -  Client's first name.
   * @param clientMiddleName -  Client's middle name.
   * @param clientLastName -  Client's last name.
   * @param clientUserId -  Client user ID.
   * @param assignedRMFirstName -  Assigned RM's first name.
   * @param assignedRMMiddleName -  Assigned RM's middle name.
   * @param assignedRMLastName -  Assigned RM's last name.
   */
  assignReassignRm(
    assignedRMUserId: string,
    clientFirstName: string,
    clientMiddleName: string,
    clientLastName: string,
    clientUserId: string,
    assignedRMFirstName: string,
    assignedRMMiddleName: string,
    assignedRMLastName: string
  ) {
    if (assignedRMUserId === null) {
      this.actionButton = 'Assign RM';
      this.assignedRmId = '';
    } else {
      this.actionButton = 'Reassign RM';
      this.assignedRmId = assignedRMUserId;
    }
    this.subheading = CLIENTS.ASSIGN_CLIENT;
    let assignReassignObj = {
      actionButton: this.actionButton,
      heading: this.actionButton,
      clientFirstName: clientFirstName,
      clientMiddleName: clientMiddleName,
      clientLastName: clientLastName,
      subheading: this.subheading,
      assignedRmUserId: this.assignedRmId,
      clientUserId: clientUserId,
      assignedRMFirstName: assignedRMFirstName,
      assignedRMMiddleName: assignedRMMiddleName,
      assignedRMLastName: assignedRMLastName,
    };
    const dialogRef = this.dialog.open(InviteRMModalComponent, {
      width: '496px',
      height: '100%',
      data: { modalData: assignReassignObj },
      position: { right: '0px' },
      autoFocus: false,
      panelClass: 'rm-modal',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.sharedModuleService
          .createCommonInviteAssignReassign(result)
          .then(() => {
            this.getBrokerAdminClientList();
          });
      }
    });
  }

  /**
   * Deactivates a client.
   * @param clientUserId - Client user ID.
   */
  deactivateClient(clientUserId: string) {
    this.brokerModuleService
      .deactivateClient(this.userId, clientUserId)
      .subscribe(
        (data) => {
          if (data) {
            this.toastr.showSuccess('Client removed successfully');
            this.getBrokerAdminClientList();
          }
        },
        (err) => {
          this.toastr.showError('Error in removing client');
        }
      );
  }

  /**
   * Applies a filter to the client list.
   * @param event -  filter event.
   */
  applyFilter(event: KeyboardEvent) {
    let filterValue = (event.target as HTMLInputElement).value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.isTableHasFilteredData = !!this.dataSource.filteredData?.length;
  }

  /**
   * Sorts the client data.
   */
  sortData() {
    this.dataSource.sortingDataAccessor = (
      data: BrokerAdminClientList,
      sortHeaderId: string
    ) => {
      const propertyValue = data[sortHeaderId as keyof BrokerAdminClientList];
      if (!propertyValue) {
        return this.sort.direction === 'asc' ? '3' : '1';
      }
      return '2' + propertyValue.toString().toLowerCase();
    };
  }

  /**
   * Unsubscribes from subscriptions.
   */
  ngOnDestroy(): void {
    this.subscriptionName.unsubscribe();
    this.userDetailSubscription.unsubscribe();
  }
}
