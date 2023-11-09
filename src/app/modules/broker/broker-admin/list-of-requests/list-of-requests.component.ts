import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { BrokerModuleService } from '../../service/broker-module.service';
import { MatDialog } from '@angular/material/dialog';
import { UccActivationModalComponent } from 'src/app/modules/client/ucc-activation-modal/ucc-activation-modal.component';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/modules/client/service/client.service';
import { REQUEST_RAISED } from 'src/app/constants/broker-admin.constants';
import {
  BankAccount,
  BrokerAdminRequestsList,
  ClientPersonalOtherDetails,
  FatcaDetails,
  NomineeDetails,
  TaxDetails,
} from 'src/app/models/broker-admin';
import { Subscription } from 'rxjs';
import { RequestRemarksModalComponentComponent } from 'src/app/shared/request-remarks-modal-component/request-remarks-modal-component.component';

@Component({
  selector: 'app-list-of-requests',
  templateUrl: './list-of-requests.component.html',
  styleUrls: ['./list-of-requests.component.css'],
})
export class ListOfRequestsComponent implements OnInit {
  isMobile = false;
  dataSource = new MatTableDataSource<BrokerAdminRequestsList>([]);
  displayedColumns: string[] = [
    'typeOfAction',
    'clientName',
    'rMName',
    'requestDate',
    'actionDate',
    'status',
    'action',
  ];
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  userId!: string;
  clientUccData!: ClientPersonalOtherDetails;
  clientFatcaTaxDetails!: TaxDetails[];
  clientFatcaData!: FatcaDetails;
  clientBankData!: BankAccount[];
  clientNomineeData!: NomineeDetails[];
  clientId!: string;
  isTableHasFilteredData: boolean = true;
  userDetailSubscription: Subscription = new Subscription();

  constructor(
    private responsiveService: ResponsiveService,
    private brokerModuleService: BrokerModuleService,
    private authUserService: AuthUserService,
    private toastr: ToastrShowService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userDetailSubscription = this.authUserService
      .getUserDetailBehaviorSubject()
      .subscribe((data) => {
        if (data) this.userId = data.userId;
      });
    this.onResize();
    this.responsiveService.checkWidth();
    this.getRequestRaisedList();
  }

  /**
   * Retrieves the list of requests.
   */
  getRequestRaisedList() {
    this.brokerModuleService.getRequestRaisedList(this.userId).subscribe(
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
   * Changes the status of a request.
   * @param requestId - ID of the request.
   * @param requestStatus - New status of the request.
   */
  changeRequestStatus(
    clientId: string,
    requestId: string,
    requestStatus: string
  ) {
    const requestData = {
      requestId: requestId,
      requestStatus: requestStatus,
      userId: this.userId,
    };
    const dialogRef = this.dialog.open(RequestRemarksModalComponentComponent, {
      width: '500px',
      restoreFocus: false,
      data: { modalData: requestData },
    });
    dialogRef.afterClosed().subscribe(() => {
      if (requestStatus === '1') {
        this.brokerModuleService
          .deactivateClient(this.userId, clientId)
          .subscribe(
            (data) => {
              if (data) {
                this.toastr.showSuccess('Client removed successfully');
              }
            },
            (err) => {
              this.toastr.showError('Error in removing client');
            }
          );
      }
      this.getRequestRaisedList();
    });
  }

  /**
   *  Navigates to the client profile based on the type of action.
   * @param clientuserId - ID of the client user.
   * @param typeOfAction - Type of action
   */
  clientProfile(clientuserId: string, typeOfAction: string) {
    if (typeOfAction === 'UCC Activation') {
      this.clientId = clientuserId;
      if (clientuserId) {
        this.getClientUccData();
        this.getClientFatcaData();
        this.getClientBankData();
        this.getNomineeDetails();
      }
      setTimeout(() => {
        // this.router.navigate(['client/client-onboarding'], {
        //   queryParams: {
        //     clientId: clientuserId,
        //     sourceScreen: 'listOfRequests',
        //   },
        // });

        this.router.navigate(['broker-client-portfolio', clientuserId], {
          queryParams: { clientProfileType: 'AllclientsProfile' },
        });
      }, 1000);
    } else {
      this.router.navigate(['broker-client-portfolio', clientuserId], {
        queryParams: { clientProfileType: 'AllclientsProfile' },
      });
    }
  }

  /**
   * Retrieves the client's UCC details.
   */
  getClientUccData() {
    this.brokerModuleService
      .getClientPersonalOtherDetails(this.clientId)
      .subscribe(
        (data) => {
          if (data) {
            this.clientUccData = data;
            localStorage.setItem(
              'clientUccData',
              JSON.stringify(this.clientUccData)
            );
            this.getFatcaTaxDetails();
          }
        },
        (err) => {
          this.toastr.showError(REQUEST_RAISED.ERROR_DATA);
        }
      );
  }

  /**
   * Retrieves the client's FATCA tax details.
   */
  getFatcaTaxDetails() {
    this.brokerModuleService
      .getFatcaTaxDetails(this.clientUccData.clientDataCSV.primaryHolderPAN)
      .subscribe(
        (data) => {
          if (data) {
            this.clientFatcaTaxDetails = data;
            localStorage.setItem(
              'clientFatcaTaxDetails',
              JSON.stringify(this.clientFatcaTaxDetails)
            );
          }
        },
        (err) => {
          this.toastr.showError(REQUEST_RAISED.ERROR_DATA);
        }
      );
  }

  /**
   * Retrieves the client's FATCA details.
   */
  getClientFatcaData() {
    this.brokerModuleService.getFatcaDetails(this.clientId).subscribe(
      (data) => {
        if (data) {
          this.clientFatcaData = data;
          localStorage.setItem(
            'clientFatcaData',
            JSON.stringify(this.clientFatcaData)
          );
        } else {
          localStorage.setItem('clientFatcaData', 'null');
        }
      },
      (err) => {
        this.toastr.showError(REQUEST_RAISED.ERROR_DATA);
      }
    );
  }

  /**
   * Retrieves the client's bank details.
   */
  getClientBankData() {
    this.brokerModuleService.getBankData(this.clientId).subscribe(
      (data) => {
        if (data) {
          this.clientBankData = data;
          localStorage.setItem(
            'clientBankData',
            JSON.stringify(this.clientBankData)
          );
        }
      },
      (err) => {
        this.toastr.showError(REQUEST_RAISED.ERROR_DATA);
      }
    );
  }

  /**
   * Retrieves the client's nominee details.
   */
  getNomineeDetails() {
    this.brokerModuleService.getNomineeDetails(this.clientId).subscribe(
      (data) => {
        if (data) {
          this.clientNomineeData = data;
          localStorage.setItem(
            'clientNomineeData',
            JSON.stringify(this.clientNomineeData)
          );
        }
      },
      (err) => {
        this.toastr.showError(REQUEST_RAISED.ERROR_DATA);
      }
    );
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
   * Applies a filter to the list of Requests.
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
   *  Sorts the data.
   */
  sortData() {
    this.dataSource.sortingDataAccessor = (
      data: BrokerAdminRequestsList,
      sortHeaderId: string
    ) => {
      const propertyValue = data[sortHeaderId as keyof BrokerAdminRequestsList];
      if (!propertyValue) {
        return this.sort.direction === 'asc' ? '3' : '1';
      }
      return '2' + propertyValue.toString().toLowerCase();
    };
  }

  /**
   * Opens the UCC activation popup.
   * @param {string} clientUserId -  ID of the client user.
   * @param {string} clientFirstName -  First name of the client.
   * @param {string} clientMiddleName -  Middle name of the client.
   * @param {string} clientLastName -  Last name of the client.
   * @param {string} requestId -  ID of the request.
   */
  initiateUCCActivation(
    clientUserId: string,
    clientFirstName: string,
    clientMiddleName: string,
    clientLastName: string,
    requestId: string
  ) {
    const uccActivationObj = {
      clientId: clientUserId,
      clientFirstName: clientFirstName,
      clientMiddleName: clientMiddleName,
      clientLastName: clientLastName,
      requestId: requestId,
    };
    const dialogRef = this.dialog.open(UccActivationModalComponent, {
      width: '1024px',
      data: { modalData: uccActivationObj },
      panelClass: 'modal-styling',
    });
  }

  /**
   * Unsubscribes from subscriptions.
   */
  ngOnDestroy(): void {
    this.userDetailSubscription.unsubscribe();
  }
}
