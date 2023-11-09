import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import {list_of_broker_admin} from 'src/app/shared/list-of-brokers-tab/list-of-broker-tab.model';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';



@Component({
  selector: 'app-list-of-brokers-tab',
  templateUrl: './list-of-brokers-tab.component.html',
  styleUrls: ['./list-of-brokers-tab.component.css']
})


export class ListOfBrokersTabComponent implements OnInit {
  @Input() category?: string;
  color: ThemePalette = 'primary';
  mobile: boolean = false;
  tablePageIndex: number = 0;
  tableLength: number = 0;
  pageEvent?: PageEvent;
  dataSource: any;
  displayedColumns: string[] = ['active', 'brokerId', 'brokerName', 'adminName','onboardingDate','brokerClientCount','advisoryClientCount','status'];
  userId:any;
  flag!:boolean;
  brokerList:any;
  searchText:any;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  constructor(
    private _responsiveService: ResponsiveService,
    private _sharedModuleService: SharedModuleService,
    private toastr: ToastrShowService,
    private router:Router,
    private _authService: AuthUserService
  ) {
    this.dataSource = new MatTableDataSource<list_of_broker_admin>([]);
  }

  ngOnInit(): void {
    this._authService.getUserDetailBehaviorSubject().subscribe(data=>{
      if(data)
      this.userId = data.userId;
    })
    if(this.category=='admin'){
      this.flag=true;
    }
    this.onResize();
    this._responsiveService.checkWidth();

    this.getBrokerList();
  }

  getBrokerList(event?: PageEvent) {
    if (event?.pageIndex) {
      let pageNo: number = event.pageIndex;
      //TODO: remove mock broker ID, subscribe to broker details on login
      let brokerID = '123';
      this._sharedModuleService.getBrokerList(this.userId, pageNo + 1).subscribe(data => {
        if (data && data.length) {
          for (const element of data) {
            if(element.isActive==1){
            element.activeBoolean = 'Active';
            }
            else{
              element.activeBoolean = 'InActive';
            }
          }
          this.brokerList=data;
          //TODO: ask backend to send total rows in response, remove 10
          // this.tableLength = data.total_rows;
          this.tableLength = 10;
          this.tablePageIndex = pageNo;
          this.dataSource = new MatTableDataSource<list_of_broker_admin>(data);
          this.dataSource.paginator = this.paginator.toArray()[1];
          this.dataSource.sort = this.sort;
        }
      }, err => {
        this.toastr.showError("Error in loading data");
      });
    } else {
      let brokerID = '123';
      this._sharedModuleService.getBrokerList(this.userId, 1).subscribe(data => {

        if (data && data.length) {
          for (const element of data) {
            if(element.isActive==1){
            element.activeBoolean = 'Active';
            }
            else{
              element.activeBoolean = 'InActive';
            }
          }
          this.brokerList=data;
          //TODO: ask backend to send total rows in response, remove 10
          // this.tableLength = data.total_rows;
          this.tableLength = 10;
          this.tablePageIndex = 0;
          this.dataSource = new MatTableDataSource<list_of_broker_admin>(data);
          this.dataSource.paginator = this.paginator.toArray()[1];
          this.dataSource.sort = this.sort;
        }
      }, err => {
        this.toastr.showError("Error in loading data");
      });
    }
  }

  sortData(sort: MatSort) {
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
      if (typeof data[sortHeaderId] === 'string') {
        return data[sortHeaderId].toLocaleLowerCase();
      }
      return data[sortHeaderId];
    }
  }

  routePortfolio(clientId:any){
    this.router.navigate(['broker-details',clientId,this.category])
  }

  applyFilter(event: any) {
    let  filterValue=event.target.value;
     filterValue = filterValue.trim(); // Remove whitespace
     filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
     this.dataSource.filter = filterValue;
   }

  onResize() {
    this._responsiveService.getMobileStatus().subscribe((isMobile: boolean) => {
      this.mobile = isMobile;
    });
  }
}
