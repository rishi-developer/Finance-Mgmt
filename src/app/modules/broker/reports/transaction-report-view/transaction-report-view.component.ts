import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { transaction_report_view } from './transaction-report-view.model';

@Component({
  selector: 'app-transaction-report-view',
  templateUrl: './transaction-report-view.component.html',
  styleUrls: ['./transaction-report-view.component.css']
})
export class TransactionReportViewComponent implements OnInit {
  mobile: boolean = false;
  tablePageIndex: number = 0;
  tableLength: number = 0;
  pageEvent?: PageEvent;
  dataSource: any;
  displayedColumns: string[] = ['orderId','schemeDetails','date','folioNo','transactionType', 'NoOfUnits', 'amount', 'transactionStatus'];
  searchText:any;
  clientId:string='';
  startDate:string='';
  endDate:string='';
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  constructor(
    private _responsiveService: ResponsiveService,
    private toastr: ToastrShowService,
    private route: ActivatedRoute,
    private router:Router
  ) {
    this.dataSource = new MatTableDataSource<transaction_report_view>([]);
  }

  ngOnInit(): void {
    this.onResize();
    this._responsiveService.checkWidth();
    this.route.queryParams.subscribe(queryparams => {
      this.clientId = queryparams.clientId;
      this.startDate=(queryparams.startDate.split(" "))[0];
      this.endDate=(queryparams.endDate.split(" "))[0];
    });
    // this.getTransactionReportsList();
  }

  // getTransactionReportsList(event?: PageEvent) {
  //   if (event?.pageIndex) {
  //     let pageNo: number = event.pageIndex;
  //     //TODO: remove mock broker ID, subscribe to broker details on login
  //     this.clientList.getBrokerClientList(this.userId, this.brokerId,pageNo + 1).subscribe(data => {
  //       if (data && data.length) {
  //         //TODO: ask backend to send total rows in response, remove 10
  //         // this.tableLength = data.total_rows;
  //         this.tableLength = 10;
  //         this.tablePageIndex = pageNo;
  //         this.dataSource = new MatTableDataSource<transaction_report_view>(data);
  //         this.dataSource.paginator = this.paginator.toArray()[1];
  //         this.dataSource.sort = this.sort;
  //       }
  //     }, err => {
  //       this.toastr.showError("Error in loading data");
  //     });
  //   } else {
  //     this.clientList.getBrokerClientList(this.userId, this.brokerId,1).subscribe(data => {
  //       if (data && data.length) {
  //         //TODO: ask backend to send total rows in response, remove 10
  //         // this.tableLength = data.total_rows;
  //         this.tableLength = 10;
  //         this.tablePageIndex = 0;
  //         this.dataSource = new MatTableDataSource<transaction_report_view>(data);
  //         this.dataSource.paginator = this.paginator.toArray()[1];
  //         this.dataSource.sort = this.sort;
  //       }
  //     }, err => {
  //       this.toastr.showError("Error in loading data");
  //     });
  //   }
  // }

  backRouting(){
    this.router.navigate(['/transaction-report']);
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

}
