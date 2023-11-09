import { RelationshipManagerService } from './../service/relationship-manager.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { UccActivationModalComponent } from '../../client/ucc-activation-modal/ucc-activation-modal.component';
import { UccActivationConfirmationModalComponent } from '../../client/ucc-activation-confirmation-modal/ucc-activation-confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { GenerateReportModalComponent } from 'src/app/shared/generate-report-modal/generate-report-modal.component';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { BrokerAdminClientList } from 'src/app/models/broker-admin';

@Component({
  selector: 'app-rm-dashboard',
  templateUrl: './rm-dashboard.component.html',
  styleUrls: ['./rm-dashboard.component.css'],
})
export class RmDashboardComponent implements OnInit {
  dataSource: MatTableDataSource<BrokerAdminClientList> =
    new MatTableDataSource<BrokerAdminClientList>([]);
  mobile: boolean = false;
  userId: string = '';
  mainHeadingValue: string = 'Home';
  displayedColumns: string[] = [
    'panNo',
    'clientName',
    'portfolioValue',
    'investedValue',
    'action',
  ];
  subscriptionName: Subscription;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private responsiveService: ResponsiveService,
    private relationshipManagerService: RelationshipManagerService,
    private toastr: ToastrShowService,
    private authUserService: AuthUserService,
    private router: Router,
    private sharedModuleService: SharedModuleService,
    public dialog: MatDialog
  ) {
    this.subscriptionName = this.sharedModuleService
      .getUccActivationUpdate()
      .subscribe(() => {
        this.getBrokerAdminClientList();
      });
  }

  ngOnInit(): void {
    this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);
    this.authUserService.getUserDetailBehaviorSubject().subscribe((data) => {
      if (data) {
        this.userId = data.userId;
        console.log(this.userId);
      } else {
        console.log('error');
      }
    });
    console.log('hello');
    this.onResize();
    this.responsiveService.checkWidth();
    this.getBrokerAdminClientList();
    this.paginator._intl.itemsPerPageLabel = 'Rows per page:';
  }

  onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile: boolean) => {
      this.mobile = isMobile;
    });
  }

  addNewClient() {
    this.router.navigate(['client/client-onboarding']);
  }

  clientProfile(clientuserId: string) {
    this.router.navigate(['broker-client-portfolio', clientuserId], {
      queryParams: { clientProfileType: 'AllclientsProfile' },
    });
  }

  getBrokerAdminClientList() {
    this.relationshipManagerService.getRmClientList(this.userId).subscribe(
      (data) => {
        if (data) {
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

  removeClient(clientUserId: string) {
    this.relationshipManagerService
      ?.removeClient(this.userId, clientUserId, 'Remove Client')
      .subscribe(
        (data) => {
          if (data) {
            this.toastr.showSuccess(data.message);
          }
        },
        (err) => {
          this.toastr.showError('Error in raising request');
        }
      );
  }

  generateReport() {
    const dialogRef = this.dialog.open(GenerateReportModalComponent, {
      width: '514px',
      autoFocus: false,
      panelClass: 'modal-styling',
    });
  }

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
    let uccActive = {
      rmUserId: this.userId,
      clientUserId: clientUserId,
    };
    console.log(this.userId, clientUserId);
    const dialogRef = this.dialog.open(
      UccActivationConfirmationModalComponent,
      {
        width: '490px',
        data: { modalData: uccActive },
        panelClass: 'modal-styling',
      }
    );
  }

  activateNominee(clientUserId: string) {
    this.sharedModuleService
      ?.activateNominee(this.userId, clientUserId)
      .subscribe(
        (data) => {
          if (data) {
            let bseResponse = JSON.parse(data.message);
            let status = bseResponse.StatusCode;
            let remarks = bseResponse.Remarks;
            if (status == '101') {
              this.toastr.showError(remarks);
            } else {
              this.toastr.showSuccess(remarks);
            }
          }
        },
        (err) => {
          this.toastr.showError('Error in activating nominee');
        }
      );
  }

  applyFilter(event: any) {
    let filterValue = event.target.value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  sortData(sort: MatSort) {
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: any) => {
      if (!data[sortHeaderId]) {
        return this.sort.direction === 'asc' ? '3' : '1';
      }
      return '2' + data[sortHeaderId].toString().toLowerCase();
    };
  }
}
