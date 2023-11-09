import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import {broker_client_admin} from './broker-client-broker-tab.model'
@Component({
  selector: 'app-broker-client-broker-tab',
  templateUrl: './broker-client-broker-tab.component.html',
  styleUrls: ['./broker-client-broker-tab.component.css']
})
export class BrokerClientBrokerTabComponent implements OnInit {
  @Input() category?: string;
  @Input() selectedClientType?:string;
  color: ThemePalette = 'primary';
  mobile: boolean = false;
  statusOptions = ['Pending', 'Executed'];
  tablePageIndex: number = 0;
  tableLength: number = 0;
  pageEvent?: PageEvent;
  dataSource: any;
  displayedColumns: string[] = ['active', 'clientId', 'clientName', 'value','currentInvestment'];
  brokerId:any;
  brokerName:any;
  length:number=0;
  flag!:boolean;
  brokerClientList:any;
  searchText:any;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  constructor(
    private _responsiveService: ResponsiveService,
    private _sharedModuleService: SharedModuleService,
    private toastr: ToastrShowService,
    private router:Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params:any)=>{
      this.brokerId = params?.get('id');
     });
     if(this.category=='admin'){
      this.flag=true;
    }
    this.onResize();
    this._responsiveService.checkWidth();


    this.onResize();
    this._responsiveService.checkWidth();

    this.getBrokerList();
  }

  getBrokerList(event?: PageEvent) {
    if (event?.pageIndex) {
      let pageNo: number = event.pageIndex;
      //TODO: remove mock broker ID, subscribe to broker details on login
      let brokerID = '123';
      this._sharedModuleService.getBrokerClientList(this.brokerId, pageNo + 1).subscribe(data => {
        if (data ) {
          for (const element of data) {
            if(element.activeStatus==1){
            element.activeBoolean = 'Active';
            }
            else{
              element.activeBoolean = 'InActive';
            }
          }
          this.brokerClientList=data;

          //TODO: ask backend to send total rows in response, remove 10
          // this.tableLength = data.total_rows;
          this.tableLength = 10;
          this.tablePageIndex = pageNo;
          this.dataSource = new MatTableDataSource<broker_client_admin>(data);
          this.dataSource.paginator = this.paginator.toArray()[1];
          this.dataSource.sort = this.sort;
          this.length=this.dataSource.length;
        }
      }, err => {
        this.toastr.showError("Error in loading data");
      });
    } else {
      let brokerID = '123';
      this._sharedModuleService.getBrokerClientList(this.brokerId, 1).subscribe(data => {
        if (data ) {
          for (const element of data) {
            if(element.activeStatus==1){
            element.activeBoolean = 'Active';
            }
            else{
              element.activeBoolean = 'InActive';
            }
          }
          this.brokerClientList=data;
          //TODO: ask backend to send total rows in response, remove 10
          // this.tableLength = data.total_rows;
          this.tableLength = 10;
          this.tablePageIndex = 0;
          this.dataSource = new MatTableDataSource<broker_client_admin>(data);
          this.dataSource.paginator = this.paginator.toArray()[1];
          this.dataSource.sort = this.sort;
          this.length=this.dataSource.length;
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
    this.router.navigate(['broker-client-portfolio',clientId,this.category])

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
