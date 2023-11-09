import { BrokerModuleService } from './../service/broker-module.service';
import { BseCredentialModalComponent } from '../bse-modal/bse-credential-modal/bse-credential-modal.component';
import { Component, OnInit } from '@angular/core';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { Subscription } from 'rxjs';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';

@Component({
  selector: 'app-broker-dashboard',
  templateUrl: './broker-dashboard.component.html',
  styleUrls: ['./broker-dashboard.component.css']
})
export class BrokerDashboardComponent implements OnInit {
  clientTypes=['Advisory Client','Broker Client']
  mobile: boolean = false;
  selectedClientType:string='Advisory Client';
  statusOptions = ['Purchase', 'SIP','STP','SWP'];
  action = 'Purchase';
  userId:string='';
  isCredsPresent?:boolean;
  partnerId:string='';
  subscriptionName: Subscription;

  constructor(private _responsiveService: ResponsiveService,
    private router: Router,
    public dialog: MatDialog,
    private authUserService:AuthUserService,
    private sharedModuleService:SharedModuleService,
    private brokerModuleService:BrokerModuleService) {
      this.subscriptionName = this.sharedModuleService.getUpdate().subscribe(() => {
        this.checkBseCredential();
    })
     }

  ngOnInit(): void {
    this.authUserService.getUserDetailBehaviorSubject().subscribe(item => {
      if (item) {
        this.userId=item.userId;
      }
    });
    this.onResize();
    this._responsiveService.checkWidth();
    this.checkBseCredential();

  }
  onResize() {
    this._responsiveService.getMobileStatus().subscribe((isMobile:boolean) => {
      this.mobile = isMobile;
    });
  }
  transaction(){
    this.router.navigate(['fresh/transaction'])
  }

  selectedtransactionScreen(selectedAction:any){
    if(!this.isCredsPresent){
      const dialogRef = this.dialog.open(BseCredentialModalComponent, {
        width: '600px',
        data: {partnerId:this.partnerId,selectedTransaction:selectedAction},
        panelClass: 'bse-credential-modal'
      });
    }
    else if(this.isCredsPresent){
    if ( selectedAction == 'SIP' || selectedAction == 'Purchase'){
      this.router.navigate(['/fresh/transaction',selectedAction]);
    }
    else {
      this.router.navigate(['/fresh/transaction/STP-SWP',selectedAction]);
    }
  }
  }

  checkBseCredential(){
    this.brokerModuleService.checkBseCredential(this.userId).subscribe(data => {
      if(data){
      this.isCredsPresent=data.isCredPresent,
      localStorage.setItem('creds-present', data.isCredPresent);
      this.partnerId=data.partnerId;
      localStorage.setItem('partner-Id', this.partnerId);
      }
    });
  }



}
