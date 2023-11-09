import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { BseCredentialModalComponent } from 'src/app/modules/broker/bse-modal/bse-credential-modal/bse-credential-modal.component';
import { advisor_client_list } from 'src/app/_helper/model';
import { ListOfClientsService } from '../../services/list-of-clients.service';

@Component({
  selector: 'app-broker-client-list',
  templateUrl: './broker-client-list.component.html',
  styleUrls: ['./broker-client-list.component.css']
})
export class BrokerClientListComponent implements OnInit {
 @Input() selectedClientType?:string;

  mobile: boolean = false;
  statusOptions = ['Pending', 'Executed'];
  tablePageIndex: number = 0;
  tableLength: number = 0;
  pageEvent?: PageEvent;
  dataSource: any;
  displayedColumns: string[] = ['clientId', 'clientName', 'portfolioValue', 'currentInvestment'];
  userId:any;
  brokerId:string='';
  brokerList:any;
  searchText:any;
  transactionStatusOptions = ['Purchase', 'SIP','STP','SWP','Switch out'];
  action = 'Purchase';
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  constructor(
    private _responsiveService: ResponsiveService,
    private clientList: ListOfClientsService,
    private toastr: ToastrShowService,
    private router:Router,
    private _authService: AuthUserService,
    public dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource<advisor_client_list>([]);
  }

  ngOnInit(): void {
    this._authService.getUserDetailBehaviorSubject().subscribe(data=>{
      if(data)
      this.userId = data.userId;
    });

    this.onResize();
    this._responsiveService.checkWidth();

    this.getClientList();
  }

  getClientList(event?: PageEvent) {
    if (event?.pageIndex) {
      let pageNo: number = event.pageIndex;
      //TODO: remove mock broker ID, subscribe to broker details on login
      let brokerID = '123';
      this.clientList.getBrokerClientList(this.userId, this.brokerId,pageNo + 1).subscribe(data => {
        if (data && data.length) {
          this.brokerList=data;
          //TODO: ask backend to send total rows in response, remove 10
          // this.tableLength = data.total_rows;
          this.tableLength = 10;
          this.tablePageIndex = pageNo;
          this.dataSource = new MatTableDataSource<advisor_client_list>(data);
          this.dataSource.paginator = this.paginator.toArray()[1];
          this.dataSource.sort = this.sort;
        }
      }, err => {
        this.toastr.showError("Error in loading data");
      });
    } else {
      let brokerID = '123';
      this.clientList.getBrokerClientList(this.userId, this.brokerId,1).subscribe(data => {

        if (data && data.length) {
          this.brokerList=data;
          //TODO: ask backend to send total rows in response, remove 10
          // this.tableLength = data.total_rows;
          this.tableLength = 10;
          this.tablePageIndex = 0;
          this.dataSource = new MatTableDataSource<advisor_client_list>(data);
          this.dataSource.paginator = this.paginator.toArray()[1];
          this.dataSource.sort = this.sort;
        }
      }, err => {
        this.toastr.showError("Error in loading data");
      });
    }
  }

  routeBrokerClientPortfolio(clientId:any){
    this.router.navigate(['broker-client-portfolio',clientId,'broker'])
  }

  sortData(sort: MatSort) {
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
      if (typeof data[sortHeaderId] === 'string') {
        return data[sortHeaderId].toLocaleLowerCase();
      }
      return data[sortHeaderId];
    }
  }

  onResize() {
    this._responsiveService.getMobileStatus().subscribe((isMobile: boolean) => {
      this.mobile = isMobile;
    });
  }
  applyFilter(event: any) {
    let  filterValue=event.target.value;
     filterValue = filterValue.trim(); // Remove whitespace
     filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
     this.dataSource.filter = filterValue;
   }

   selectedtransactionScreen(selectedAction:any){
    if(localStorage.getItem('creds-present')=='false'){
      const dialogRef = this.dialog.open(BseCredentialModalComponent, {
        width: '600px',
        data: {partnerId:localStorage.getItem('partner-Id'),selectedTransaction:selectedAction,transactionType:'Fresh'},
        panelClass: 'bse-credential-modal'
      });
    }
    else if(localStorage.getItem('creds-present')=='true'){
    if ( selectedAction == 'SIP' || selectedAction == 'Purchase'){
      this.router.navigate(['/fresh/transaction',selectedAction]);
    }
    else {
      this.router.navigate(['/fresh/transaction/STP-SWP',selectedAction]);
    }
  }
  }
}
