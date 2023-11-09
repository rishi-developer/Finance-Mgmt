import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';


@Component({
  selector: 'app-broker-details-view',
  templateUrl: './broker-details-view.component.html',
  styleUrls: ['./broker-details-view.component.css']
})
export class BrokerDetailsViewComponent implements OnInit {
  mobile: boolean = false;
  viewDetail: any = {
  }
  brokerId:any;
  role:any;
  selectionTypes=['Advisory Client','Broker Client'];
  selectedValue:string='Advisory Client';
  constructor(
    private  _sharedModuleService: SharedModuleService,
    private router:Router,
    private _responsiveService: ResponsiveService,
    private route: ActivatedRoute)

   { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params:any)=>{
      this.brokerId = params?.get('id');
      this.role=params?.get('role');
     })
     this.getAdvisorClientDetails();
     this.onResize();
    this._responsiveService.checkWidth();
  }

  getAdvisorClientDetails(){
    this. _sharedModuleService.getBrokerDetails(this.brokerId,1).subscribe(data=>{


     if(data){
      this.viewDetail.name = data.brokerName;
      this.viewDetail.email = data.brokerEmail;

     }
    })
  }
  onResize() {
    this._responsiveService.getMobileStatus().subscribe((isMobile: boolean) => {
      this.mobile = isMobile;
    });
  }

}
