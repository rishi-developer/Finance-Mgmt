import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { holding_list } from './holdings-table.model';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-advisor-client-holdings-table',
  templateUrl: './advisor-client-holdings-table.component.html',
  styleUrls: ['./advisor-client-holdings-table.component.css']
})
export class AdvisorClientHoldingsTableComponent implements OnInit {
  @Input() selectedButtonValue?:string;

  mobile: boolean = false;
  statusOptions = ['Pending', 'Executed'];
  tablePageIndex: number = 0;
  tableLength: number = 0;
  pageEvent?: PageEvent;
  dataSource: any;
  clientId:any;
  holdingsList:any;
  searchText:any;
  displayedColumns: string[] = ['fundName', 'nav', 'value','returnRate','exitLoad'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  constructor(
    private _responsiveService: ResponsiveService,
    private _sharedModuleService:SharedModuleService,
    private toastr: ToastrShowService,
    private router:Router,
    private route: ActivatedRoute,
  ) {
    this.dataSource = new MatTableDataSource<holding_list>([]);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params:any)=>{
      this.clientId = params?.get('id');
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
      this._sharedModuleService.getAdviseHoldingList(this.clientId, pageNo + 1).subscribe(data => {

        if (data && data.length) {
          this.holdingsList=data;
          //TODO: ask backend to send total rows in response, remove 10
          // this.tableLength = data.total_rows;
          this.tableLength = 10;
          this.tablePageIndex = pageNo;
          this.dataSource = new MatTableDataSource<holding_list>(data);
          this.dataSource.paginator = this.paginator.toArray()[1];
          this.dataSource.sort = this.sort;
        }
      }, err => {
        this.toastr.showError("Error in loading data");
      });
    } else {
      let brokerID = '123';
      this._sharedModuleService.getAdviseHoldingList(this.clientId, 1).subscribe(data => {
        if (data && data.length) {
          this.holdingsList=data;
          //TODO: ask backend to send total rows in response, remove 10
          // this.tableLength = data.total_rows;
          this.tableLength = 10;
          this.tablePageIndex = 0;
          this.dataSource = new MatTableDataSource<holding_list>(data);
          this.dataSource.paginator = this.paginator.toArray()[1];
          this.dataSource.sort = this.sort;
        }
      }, err => {
        this.toastr.showError("Error in loading data");
      });
    }
  }

  routePortfolio(clientId:any){
    this.router.navigate(['broker/broker-portfolio',clientId])
  }
  applyFilter(event: any) {
    let  filterValue=event.target.value;
     filterValue = filterValue.trim(); // Remove whitespace
     filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
     this.dataSource.filter = filterValue;
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

}
