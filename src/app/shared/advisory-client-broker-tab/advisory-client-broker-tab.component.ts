import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { advisory_client_admin } from './advisory-client-broker-tab.model';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-advisory-client-broker-tab',
  templateUrl: './advisory-client-broker-tab.component.html',
  styleUrls: ['./advisory-client-broker-tab.component.css']
})
export class AdvisoryClientBrokerTabComponent implements OnInit {
  @Input() category?: string;
  @Input() selectedClientType?:string;
  color: ThemePalette = 'primary';
  mobile: boolean = false;
  statusOptions = ['Pending', 'Executed'];
  tablePageIndex: number = 0;
  tableLength: number = 0;
  pageEvent?: PageEvent;
  dataSource: any;
  displayedColumns: string[] = ['active', 'clientId', 'clientName', 'portfolioValue','currentInvestment','advisedDate','advisedStatus'];
  brokerId:any;
  advisorId:any;
  flag!:boolean;
  advisoryClientList:any;
  searchText:any;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  constructor(
    private _responsiveService: ResponsiveService,
    private _sharedModuleService: SharedModuleService,
    private toastr: ToastrShowService,
    private router:Router,
    private route: ActivatedRoute
  ) { this.dataSource = new MatTableDataSource<advisory_client_admin>([]);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params:any)=>{
      this.brokerId = params?.get('id');
      this.advisorId = this.brokerId
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
      this._sharedModuleService.getAdvisorClientDetails(this.advisorId, pageNo + 1).subscribe(data => {
        if (data ) {
          for (const element of data) {
            if(element.activeStatus==1){
            element.activeBoolean = 'Active';
            }
            else{
              element.activeBoolean = 'InActive';
            }
          }
          this.advisoryClientList=data;
          //TODO: ask backend to send total rows in response, remove 10
          // this.tableLength = data.total_rows;
          this.tableLength = 10;
          this.tablePageIndex = pageNo;
          this.dataSource = new MatTableDataSource<advisory_client_admin>(data);
          this.dataSource.paginator = this.paginator.toArray()[1];
          this.dataSource.sort = this.sort;

        }
      }, err => {
        this.toastr.showError("Error in loading data");
      });
    } else {
      let brokerID = '123';
      this._sharedModuleService.getAdvisorClientDetails(this.advisorId, 1).subscribe(data => {
        if (data ) {
          for (const element of data) {
            if(element.activeStatus==1){
            element.activeBoolean = 'Active';
            }
            else{
              element.activeBoolean = 'InActive';
            }
          }
          this.advisoryClientList=data;
          //TODO: ask backend to send total rows in response, remove 10
          // this.tableLength = data.total_rows;
          this.tableLength = 10;
          this.tablePageIndex = 0;
          this.dataSource = new MatTableDataSource<advisory_client_admin>(data);
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
    this.router.navigate(['advisor-client-portfolio',clientId,this.category])
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
