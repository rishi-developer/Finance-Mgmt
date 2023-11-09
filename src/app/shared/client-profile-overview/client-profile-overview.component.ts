import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { ClientService } from 'src/app/modules/client/service/client.service';

@Component({
  selector: 'app-client-profile-overview',
  templateUrl: './client-profile-overview.component.html',
  styleUrls: ['./client-profile-overview.component.css']
})
export class ClientProfileOverviewComponent implements OnInit {
  element: any;
  clientId: any;
  clientUccData:any;
  clientFatcaData:any;
  clientBankData:any;
  clientNomineeData:any;
  clientFatcaTaxDetails:any;
  role:string='';
  viewDetail: any = {
  };
 
  constructor(private sharedModuleService: SharedModuleService,
    private authUserService: AuthUserService,
    private clientService:ClientService,
    private toastr: ToastrShowService,
    private route: ActivatedRoute,
    private router: Router,) { }

  ngOnInit(): void {
   this.element = this.sharedModuleService.getClientOverviewDetails();

   this.authUserService.getUserDetailBehaviorSubject().subscribe(data => {
    if (data)
      this.role = data.newRoleFinal.roleDescription;
  });
   
   this.route.paramMap.subscribe((params:any)=>{
    this.clientId=params.get?.('id');
    if(this.clientId){
      this.getClientUccData();
      this.getClientFatcaData();
      this.getClientBankData();
      this.getNomineeDetails();
    }
   });
   this.getclientPersonalDetails();

  }

  editClientDetails(){
    localStorage.setItem('clientUccData',JSON.stringify(this.clientUccData));
    if(this.clientFatcaData!=undefined){
      localStorage.setItem('clientFatcaData',JSON.stringify(this.clientFatcaData));
    }
    else{
      localStorage.setItem('clientFatcaData','null');
    }
    localStorage.setItem('clientBankData',JSON.stringify(this.clientBankData));
    localStorage.setItem('clientNomineeData',JSON.stringify(this.clientNomineeData));
    localStorage.setItem('clientFatcaTaxDetails',JSON.stringify(this.clientFatcaTaxDetails));
    // this.router.navigate(['client/edit-details',this.clientId]);
    this.router.navigate(['client/client-onboarding'] , { queryParams: { clientId: this.clientId} });
  }

  getClientUccData(){
      this.sharedModuleService.getClientPersonalOtherDetails(this.clientId).subscribe(data => {
        
       if(data){
        this.clientUccData=data;
        this.getFatcaTaxDetails();
       }
    }, err => {
      this.toastr.showError("Error in loading data");
    });
  }

  getClientFatcaData(){
    this.sharedModuleService.getFatcaDetails(this.clientId).subscribe(data => {
      if(data){
       this.clientFatcaData=data[0];
      }
   }, err => {
     this.toastr.showError("Error in loading data");
   });
  }

  getClientBankData(){
    this.sharedModuleService.getBankData(this.clientId).subscribe(data => {
      if(data){
       this.clientBankData=data;
      }
   }, err => {
     this.toastr.showError("Error in loading data");
   });
  }

  getNomineeDetails(){
    this.sharedModuleService.getNomineeDetails(this.clientId).subscribe(data => {
      if(data){
       this.clientNomineeData=data;
      }
   }, err => {
     this.toastr.showError("Error in loading data");
   });
  }

  getFatcaTaxDetails() {
    this.clientService.getFatcaTaxDetails(this.clientUccData.clientDataCSV.primaryHolderPAN).subscribe(data => {
      if (data){
        this.clientFatcaTaxDetails = data;
      }
    }, err => {
      this.toastr.showError("Error in loading data");
    });
  }
  getclientPersonalDetails(){
    var gotClientDetails = new Promise((resolve, reject) => {
    this.sharedModuleService.getClientPersonalOtherDetails(this.clientId).subscribe(data=>{
      if (data) {
      this.viewDetail.primaryHolderPAN = data.clientDataCSV.primaryHolderPAN;         
      }
      resolve(true);
    });
  });
  return gotClientDetails;
  }
}
