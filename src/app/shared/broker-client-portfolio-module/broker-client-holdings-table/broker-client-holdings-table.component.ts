import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { BseCredentialModalComponent } from 'src/app/modules/broker/bse-modal/bse-credential-modal/bse-credential-modal.component';
import { client_holding_list } from './broker-client-holdings-table.model';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-broker-client-holdings-table',
  templateUrl: './broker-client-holdings-table.component.html',
  styleUrls: ['./broker-client-holdings-table.component.css']
})
export class BrokerClientHoldingsTableComponent implements OnInit {
  mainHeadingValue: string = 'Holdings';
  dataSource: any;
  mobile: boolean = false;
  clientId: any;
  userId: string = '';
  displayedColumns: string[] = ['fundName', 'transaction_type', 'folioNo','nav', 'value', 'returnRate', 'action'];
  transactionsList=['Purchase','Redeem','SIP','STP','SWP','Switch out'];
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  userRole: any;
  disableField:boolean=false;

  constructor(private router: Router,
    private responsiveService: ResponsiveService,
    private sharedModuleService: SharedModuleService,
    private toastr: ToastrShowService,
    private route: ActivatedRoute,
    private authUserService: AuthUserService
  ) {
    this.dataSource = new MatTableDataSource<client_holding_list>([]);
    this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);
  }

  ngOnInit(): void {
    this.authUserService.getUserDetailBehaviorSubject().subscribe(data => {
      if (data)
        this.userId = data.userId;
        this.userRole = data.newRoleFinal.roleDescription;
        if(this.userRole=='CLIENT'){
           this.disableField=true;
        }
    });

    // this.route.paramMap.subscribe((params:any)=>{
    //   this.clientId = params?.get('id');
    //   this.role=params?.get('role');
    //   if(this.role=='admin'|| this.role=='advisor'){
    //     this.flag = true;
    //   }
    //   else{
    //     this.flag = false;
    //   }
    //  });

    this.route.paramMap.subscribe((params: any) => {
      this.clientId = params.get?.('id');
    });


    if( this.userRole == 'CLIENT'){
      this.clientId = this.userId
    }

    this.onResize();
    this.responsiveService.checkWidth();
    this.paginator._intl.itemsPerPageLabel = "Rows per page:";
    this.getClientHoldings();
  }

  selectedTransaction(selectionTransaction:string,fundName:string,schemeCode:string,folioNumber:string){
    localStorage.setItem('client-id',this.clientId);
    // if(localStorage.getItem('creds-present')=='false'){
    //   const dialogRef = this.dialog.open(BseCredentialModalComponent, {
    //     width: '600px',
    //     data: {partnerId:localStorage.getItem('partner-Id'),selectedTransaction:selectedAction,transactionType:'Additional',fundName:fundName,clientId:this.clientId,schemeCode:schemeCode},
    //     panelClass: 'bse-credential-modal'
    //   });
    // }
    // else if(localStorage.getItem('creds-present')=='true'){
      if(selectionTransaction=='Purchase' || selectionTransaction=='Redeem'){
    this.router.navigate(['/transaction',selectionTransaction],{ queryParams: { fundName: fundName , clientId:this.clientId , folioNumber:folioNumber, schemeCode:schemeCode}});
      }
      else if(selectionTransaction=='SIP'){
        this.router.navigate(['/fresh/transaction',selectionTransaction],{ queryParams: { fundName: fundName , transactionType:'Additional' , schemeCode:schemeCode, folioNumber:folioNumber}});
      }
      else if(selectionTransaction=='STP' || selectionTransaction=='SWP' || selectionTransaction=='Switch out'){
        this.router.navigate(['/fresh/transaction/STP-SWP',selectionTransaction],{ queryParams: { fundName: fundName ,  clientId:this.clientId, transactionType:'Additional' , schemeCode:schemeCode , folioNumber:folioNumber}});
      }
    // }
  }



  getClientHoldings() {
    this.sharedModuleService.getclientHoldings(this.clientId, this.userId).subscribe(data => {
      if (data) {
        for (const element of data) {
          element.currentValue = element.currentValue.toFixed(2);
          element.currentNav = element.currentNav.toFixed(2);
        }
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }, err => {
      this.toastr.showError("Error in loading data");
    });
  }


  routePortfolio(clientId: any) {
    this.router.navigate(['broker/broker-portfolio', clientId])
  }

  applyFilter(event: any) {
    let filterValue = event.target.value;
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
    this.responsiveService.getMobileStatus().subscribe((isMobile: boolean) => {
      this.mobile = isMobile;
    });
  }
}

