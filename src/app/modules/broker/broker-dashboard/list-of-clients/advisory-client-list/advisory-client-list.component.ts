import { Component, OnInit, ViewChild, ViewChildren, QueryList, Input } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { MatTableDataSource } from '@angular/material/table';
import { advisor_client_list } from 'src/app/_helper/model';
import { ListOfClientsService } from '../services/list-of-clients.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';


@Component({
  selector: 'app-advisory-client-list',
  templateUrl: './advisory-client-list.component.html',
  styleUrls: ['./advisory-client-list.component.css']
})
export class AdvisoryClientListComponent implements OnInit {
  @Input() selectedClientType?:string;
  mobile: boolean = false;
  statusOptions = ['Pending', 'Executed'];
  tablePageIndex: number = 0;
  tableLength: number = 0;
  pageEvent?: PageEvent;
  dataSource: any;
  email :any;
  advisorId:string='';
  userId:any;
  advisoryClientList:any;
  searchText:any;
  displayedColumns: string[] = ['clientId', 'clientName', 'portfolioValue', 'currentInvestment', 'advisedDate', 'status'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  constructor(
    private _responsiveService: ResponsiveService,
    private clientList: ListOfClientsService,
    private toastr: ToastrShowService,
    private router:Router,
    private _authService: AuthUserService
  ) {
    this.dataSource = new MatTableDataSource<advisor_client_list>([]);
  }

  ngOnInit(): void {
    this._authService.getUserDetailBehaviorSubject().subscribe(data=>{
      if(data)
      this.userId = data.userId;
    })
    this.onResize();
    this._responsiveService.checkWidth();

    this.getClientList();
  }

  getClientList(event?: PageEvent) {
    if (event?.pageIndex) {
      let pageNo: number = event.pageIndex;
      //TODO: remove mock broker ID, subscribe to broker details on login
      let brokerID = '123';
      this.clientList.getAdvisoryClientList(this.userId,this.advisorId, pageNo + 1).subscribe(data => {

        if (data && data.length) {
          this.advisoryClientList=data;
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
      this.clientList.getAdvisoryClientList(this.userId,this.advisorId, 1).subscribe(data => {

        if (data && data.length) {
          this.advisoryClientList=data;
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

  routePortfolio(clientId:any){
    this.router.navigate(['advisor-client-portfolio',clientId,'broker'])
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
