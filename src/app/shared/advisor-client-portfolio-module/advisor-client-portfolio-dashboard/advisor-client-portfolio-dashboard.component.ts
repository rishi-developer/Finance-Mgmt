import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';

@Component({
  selector: 'app-advisor-client-portfolio-dashboard',
  templateUrl: './advisor-client-portfolio-dashboard.component.html',
  styleUrls: ['./advisor-client-portfolio-dashboard.component.css']
})
export class AdvisorClientPortfolioDashboardComponent implements OnInit {
  selectedTab:number=0;
  clientId:any;
  role:any;
  broker:any;
  viewDetail: any = {
  }
  selectionTypes=['Profile','Recent Advice','Holding'];
  selectedValue:string='Profile';
  mobile: boolean = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private _responsiveService: ResponsiveService,
    private _sharedModuleService: SharedModuleService) { }

  ngOnInit(): void {
   this.route.paramMap.subscribe((params:any)=>{
    this.clientId = params?.get('id');
    if(this.clientId){
      this._sharedModuleService.setClientId(this.clientId);
    }
    this.role=params?.get('role');
   });
   this.getAdvisorClientDetails();
   this.getAdvisorClientSummary();
   this.onResize();
   this._responsiveService.checkWidth();
  }

  getAdvisorClientDetails(){
    this._sharedModuleService.getAdvisorProfile(this.clientId).subscribe(data=>{


     if(data){
      this.viewDetail.name = data.clientName;
      this.viewDetail.panNo = data.clientPAN;
      this.viewDetail.brokerName=data.brokerName;
      if(data.type===1){
        this.viewDetail.type = 'Advisory Client'
      } else{
        this.viewDetail.type = '-'
      }
     }
    })
  }
  getAdvisorClientSummary(){
    this._sharedModuleService.getAdvisorSummary(this.clientId).subscribe(data=>{
     if(data){
      this.viewDetail.activeFunds = data.activeFunds;
      this.viewDetail.activeSIP = data.activeSIP;
      this.viewDetail.fundValue = data.fundValue;
      this.viewDetail.totalReturn = data.totalReturn;
      if(data.type===1){
        this.viewDetail.type = 'Advisory Client'
      } else{
        this.viewDetail.type = '-'
      }
     }
    });

  }


  changeTab() {
    this.selectedTab = 1;
    this.selectedValue='Recent Advice';
    this._sharedModuleService.setGenerateAdvise(true);
 }
 onResize() {
  this._responsiveService.getMobileStatus().subscribe((isMobile: boolean) => {
    this.mobile = isMobile;
  });
}

}

