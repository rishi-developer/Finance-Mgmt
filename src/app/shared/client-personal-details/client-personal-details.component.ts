import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-client-personal-details',
  templateUrl: './client-personal-details.component.html',
  styleUrls: ['./client-personal-details.component.css']
})
export class ClientPersonalDetailsComponent implements OnInit {
  element: any;
  clientId: any;
  viewDetail: any = {
  };
  userRole: any;
  userId: any;

  constructor(private sharedModuleService:SharedModuleService,
    private toastr: ToastrShowService,
    private route: ActivatedRoute,
    private authUserService: AuthUserService) { }
    
  ngOnInit(): void {
     
    this.route.paramMap.subscribe((params: any) => {
      this.clientId = params.get?.('id');
    });

    this.authUserService.getUserDetailBehaviorSubject().subscribe(data => {
      if (data) 
        this.userId = data.userId;
        this.userRole = data.newRoleFinal.roleDescription;
    });

    if( this.userRole == 'CLIENT'){
      this.clientId = this.userId
    }

    this.getclientPersonalDetails();
  }

  getclientPersonalDetails(){
    var gotClientDetails = new Promise((resolve, reject) => {
    this.sharedModuleService.getClientPersonalOtherDetails(this.clientId).subscribe(data=>{
      if (data) {
      this.viewDetail.primaryHolderFirstName = data.clientDataCSV.primaryHolderFirstName;
      this.viewDetail.primaryHolderDOB = data.clientDataCSV.primaryHolderDOB;
      this.viewDetail.primaryHolderMiddleName = data.clientDataCSV.primaryHolderMiddleName;
      this.viewDetail.primaryHolderLastName = data.clientDataCSV.primaryHolderLastName;
      this.viewDetail.gender = data.clientDataCSV.gender;
      this.viewDetail.clientCode = data.clientDataCSV.clientCode;
      this.viewDetail.memberCode = data.clientDataCSV.memberCode;
      this.viewDetail.bankBranch1 = data.clientDataCSV.bankBranch1;
      this.viewDetail.primaryHolderPAN = data.clientDataCSV.primaryHolderPAN;
      this.viewDetail.primaryHolderPANExempt = data.clientDataCSV.primaryHolderPANExempt;
      this.viewDetail.occupationCode = data.clientDataCSV.occupationCode;
      this.viewDetail.clientType = data.clientDataCSV.clientType;
      this.viewDetail.holdingNature = data.clientDataCSV.holdingNature;
      this.viewDetail.gender = data.clientDataCSV.gender;
      this.sharedModuleService.setClientBanksDetails(this.element)         
      }
      resolve(true);
    });
  });
  return gotClientDetails;
  }
}
