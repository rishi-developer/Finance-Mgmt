import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { list_of_client } from './list-of-client-tab.model';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
@Component({
  selector: 'app-list-of-client-tab',
  templateUrl: './list-of-client-tab.component.html',
  styleUrls: ['./list-of-client-tab.component.css']
})
export class ListOfClientTabComponent implements OnInit {
  @Input() category?: string;
  activeButton:boolean=false;
  dataSource:any;
  userId:any;
  listOfClientData:any=[];
  ListOfClientDataLength:any;
  @ViewChild(MatSort) sort!: MatSort;
  ListData:any=[];
  statusOptions = ['Pending', 'Executed'];
  color: ThemePalette = 'primary';
  hideColumn:boolean=false;
  mobile: boolean = false;
  flag!:boolean;
  clientTypes=['Advisory Client','Broker Client'];
  selectedClientType:string='Advisory Client';
  searchText:any;
  displayedColumns: string[] = ['activeCheck', 'clientId', 'clientName','brokerName','portfolioValue','currentInvestment','advisedDate','advisedStatus'];
  constructor(private _sharedModuleService: SharedModuleService,
    private _authService: AuthUserService,
    private _responsiveService: ResponsiveService,
    private router:Router,) {
    this.dataSource = new MatTableDataSource<list_of_client>([]);
  }

  ngOnInit(): void {
    this._authService.getUserDetailBehaviorSubject().subscribe(data=>{
      if(data)
      this.userId = data.userId;
    });
    if(this.category=='admin'){
      this.flag=true;
    }
    this.onResize();
    this._responsiveService.checkWidth();
    this.getAllClientsData('Advisory Client');
  }
  getAllClientsData(clientType:any){
    this.activeButton = true;
    if(clientType==='Advisory Client'){
      this._sharedModuleService.getAllAdvisoryClients().subscribe(data => {
        if(data){
        this.listOfClientData=[];
        this.ListData=data;
        for (const element of data) {
          if(element.activeStatus==1){
          element.activeBoolean = 'Active';
          }
          else{
            element.activeBoolean = 'InActive';
          }
        }
        this.dataSource = new MatTableDataSource<list_of_client>(this.ListData);
        this.dataSource.sort = this.sort;
      }
      });
    }
    else if(clientType==='Broker Client'){
      this._sharedModuleService.getAllBrokerClients().subscribe(data => {
        if(data){
        this.ListData=data;
        for (const element of data) {
          if(element.activeStatus==1){
          element.activeBoolean = 'Active';
          }
          else{
            element.activeBoolean = 'InActive';
          }
        }
        this.dataSource = new MatTableDataSource<list_of_client>(this.ListData);
        this.dataSource.sort = this.sort;
      }
      });
    }
  }
  getSelectedClientData(ListType: String){
    this.getAllClientsData(ListType);
    if (ListType === 'Advisory Client') {
      this.hideColumn=false;
      this.activeButton = true;
      this.listOfClientData=[];
      this.listOfClientData=this.ListData;
      return;
    }
    else if (ListType === 'Broker Client') {
      this.hideColumn=true;
      this.activeButton = false;
      this.listOfClientData=[];
      this.listOfClientData=this.ListData;
      return;
    }
  }
  routePortfolio(clientId:any,brokerName:string,roleBoolean:boolean){
    if(!roleBoolean){
    this.router.navigate(['advisor-client-portfolio',clientId,this.category]);
    }
    else{
      this.router.navigate(['broker-client-portfolio',clientId,this.category]);
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
