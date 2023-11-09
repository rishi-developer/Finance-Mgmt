import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { recent_list } from './recent-advice-table.model';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-recent-advice-table',
  templateUrl: './recent-advice-table.component.html',
  styleUrls: ['./recent-advice-table.component.css']
})
export class RecentAdviceTableComponent implements OnInit {
  @Input() selectedButtonValue?:string;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  StoreData: boolean = false;
  mobile: boolean = false;
  statusOptions = ['Adviced', 'Executed'];
  tablePageIndex: number = 0;
  tableLength: number = 0;
  pageEvent?: PageEvent;
  dataSource: any;
  clientId:any;
  generateAdviceBoolean:any;
  displayedColumns: string[] = ['fundName', 'nav', 'unit','status'];
  viewDetail: any = {
  }
  recentAdviceList:any;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  constructor(
    private _responsiveService: ResponsiveService,
    private _sharedModuleService:SharedModuleService,
    private toastr: ToastrShowService,
    private router:Router,
    private route: ActivatedRoute,
  ) {
    this.dataSource = new MatTableDataSource<recent_list>([]);
  }

  ngOnDestroy(): void{
    this._sharedModuleService.setGenerateAdvise(false);
}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params:any)=>{
      this.clientId = params?.get('id');
     })
    this.onResize();
    this._responsiveService.checkWidth();

    this.getClientList();

    this._sharedModuleService.getGenerateAdviseTrigger().subscribe(data=>{
      if(data){
        this.generateAdviceBoolean=true;
        this.StoreData=false;
        this.generateAdvice();
      }
    })

  }

  getClientList(event?: PageEvent) {
    if (event?.pageIndex) {
      let pageNo: number = event.pageIndex;
      //TODO: remove mock broker ID, subscribe to broker details on login

      this._sharedModuleService.getRecentAdviseList(this.clientId,'',pageNo+1).subscribe(data => {
        if(data){
          this.StoreData=true;
          this.generateAdvice();
          }
        if (data.adviseHistoryWithFundNames) {
          //TODO: ask backend to send total rows in response, remove 10
          // this.tableLength = data.total_rows;
          this.recentAdviceList=data.adviseHistoryWithFundNames;

          this.tableLength = 10;
          this.tablePageIndex = pageNo;
          this.dataSource = new MatTableDataSource<recent_list>(data.adviseHistoryWithFundNames);
          this.dataSource.paginator = this.paginator.toArray()[1];
          this.dataSource.sort = this.sort;


        }
      }, err => {
        this.toastr.showError("Error in loading data");
      });
    } else {
      let brokerID = '123';
      this._sharedModuleService.getRecentAdviseList(this.clientId,'', 1).subscribe(data => {
        if(data){
          this.StoreData=true;
          this.viewDetail.adviceId= data.adviceId;
        this.viewDetail.adviceDate = data.adviceDate;
        this.viewDetail.adviceStatus = data.adviceStatus;
        }

        if (data.adviseHistoryWithFundNames) {
          this.StoreData=true;
          this.recentAdviceList=data.adviseHistoryWithFundNames;
          //TODO: ask backend to send total rows in response, remove 10
          // this.tableLength = data.total_rows;
          this.tableLength = 10;
          this.tablePageIndex = 0;
          this.dataSource = new MatTableDataSource<recent_list>(data.adviseHistoryWithFundNames);
          this.dataSource.paginator = this.paginator.toArray()[1];
          this.dataSource.sort = this.sort;


        }
        if(this.generateAdviceBoolean){
          this.StoreData=false;
          this.generateAdviceBoolean=false;
        }
      }, err => {
        this.StoreData=true;
        this.toastr.showError("Error in loading data");
      });
    }
  }
  generateAdvice(){
    this._sharedModuleService.getRecentAdviseList(this.clientId,'true').subscribe(data=>{
      if(data){
      this.StoreData=true;
      this.generateAdviceBoolean=false;
      this.viewDetail.adviceId= data.adviceId;
        this.viewDetail.adviceDate = data.adviceDate;
        this.viewDetail.adviceStatus = data.adviceStatus;
      }
    },err => {
      this.StoreData=true;
      this.toastr.showError("Error in loading data");
    });

  }

  routePortfolio(clientId:any){
    this.router.navigate(['broker/broker-portfolio',clientId])
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
