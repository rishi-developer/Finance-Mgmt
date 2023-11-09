import { CreateMandateSipModalComponent } from './../create-mandate-sip-modal/create-mandate-sip-modal.component';
import { BrokerTransactionsService } from './../../services/broker-transactions.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { mandateSipList } from '../mandate-sip.model';
import { ToastrService } from 'ngx-toastr';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
// import { monthList } from '../mandate-sip.model';

@Component({
  selector: 'app-mandate-sip-table',
  templateUrl: './mandate-sip-table.component.html',
  styleUrls: ['./mandate-sip-table.component.css']
})
export class MandateSipTableComponent implements OnInit {
  mainHeadingValue: string = 'Mandate List';
  mobile: boolean = false;
  dataSource: any;
  userId: string = '';
  subscriptionName: Subscription;
  // monthList = monthList;
  displayedColumns: string[] = ['ucc', 'clientName', 'accountNo', 'bank', 'startDate', 'endDate', 'bseMandateCode', 'amount', 'status', 'action'];
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private responsiveService: ResponsiveService,
    private toastr: ToastrShowService,
    private brokerTransactionsService: BrokerTransactionsService,
    private authUserService: AuthUserService,
    private sharedModuleService: SharedModuleService,
    private router: Router,
    public dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource<mandateSipList>([]);
    this.subscriptionName = this.sharedModuleService.getUpdate().subscribe(() => {
      this.getMandateList();
    })
  }

  ngOnInit(): void {
    this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);
    this.authUserService.getUserDetailBehaviorSubject().subscribe(data => {
      if (data)
        this.userId = data.userId;
    });
    this.getMandateList();
    this.onResize();
    this.responsiveService.checkWidth();
  }

  createMandate() {
    const dialogRef = this.dialog.open(CreateMandateSipModalComponent, {
      width: '496px',
      height: '100%',
      position: { right: '0px' },
      autoFocus: false,
      panelClass: 'create-mandate-modal'
    });
  }

  clientProfile(clientuserId: string) {
    this.router.navigate(['broker-client-portfolio', clientuserId], { queryParams: { clientProfileType: 'mandateClientProfile'}});
  }

  getMandateList() {
    this.brokerTransactionsService.getMandateList(this.userId).subscribe(data => {
      if (data) {
        this.dataSource = new MatTableDataSource(data);
        // for (const element of data) {
        //   let rule = /\s{1,}/g;
        //   let formatDate = element.regnDate.split(rule).join(" ");
        //   let formatDate2=formatDate.split(" ");
        //   let month: any[] = [formatDate2[0]];
        //   for (var i = 0; i < month.length; i++) {
        //     var list = monthList.filter(data => data.description == month[i]);
        //     list.forEach(data => {
        //       element.formattedStartDate = formatDate2[1] + '/' + data.code + '/' + formatDate2[2]
        //     })
        //   }
        // }
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }, err => {
      this.toastr.showError("Error in loading data");
    });
  }

  inactivateMandate(mandateId: string, clientCode: string) {
    this.brokerTransactionsService.inactivateMandate(mandateId, clientCode, 'N').subscribe(data => {
      if (data) {
        this.getMandateList();
      }
    }, err => {
      this.toastr.showError("Error in Inactivating mandate");
    });
  }

  backRoute() {
    this.router.navigate(['broker']);
  }

  onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile: boolean) => {
      this.mobile = isMobile;
    });
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
        return this.sort.direction === "asc" ? '3' : '1';
      }
      return '2' + data[sortHeaderId].toString().toLowerCase();
    }
  }

}
