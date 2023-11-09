import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-client-communication-details',
  templateUrl: './client-communication-details.component.html',
  styleUrls: ['./client-communication-details.component.css']
})
export class ClientCommunicationDetailsComponent implements OnInit {
  element: any;
  element2 : any;
  clientId: any;
  viewDetail: any = {
  };
  userId: any;
  userRole: any;
  constructor(private sharedModuleService:SharedModuleService,
    private toastr: ToastrShowService,
    private route: ActivatedRoute,
    private authUserService: AuthUserService,) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.clientId = params.get?.('id');
    });


    this.authUserService.getUserDetailBehaviorSubject().subscribe(data => {
      if (data)
        this.userId = data.userId;this.userId = data.userId;
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
      this.viewDetail.address1 = data.clientDataCSV.address1;
      this.viewDetail.address2 = data.clientDataCSV.address2;
      this.viewDetail.address3 = data.clientDataCSV.address3;
      this.viewDetail.city = data.clientDataCSV.city;
      this.viewDetail.bankName1 = data.clientDataCSV.bankName1;
      this.viewDetail.pincode = data.clientDataCSV.pincode;
      this.viewDetail.country = data.clientDataCSV.country;
      this.viewDetail.residentialFax = data.clientDataCSV.residentialFax;
      this.viewDetail.officeFax = data.clientDataCSV.officeFax;
      this.viewDetail.officePhone = data.clientDataCSV.officePhone;
      this.viewDetail.email = data.clientDataCSV.email; 
      }
      resolve(true);
    });
  });
  return gotClientDetails;
  }
}
