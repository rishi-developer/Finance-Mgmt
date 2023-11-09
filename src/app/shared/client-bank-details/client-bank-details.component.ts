import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-client-bank-details',
  templateUrl: './client-bank-details.component.html',
  styleUrls: ['./client-bank-details.component.css']
})
export class ClientBankDetailsComponent implements OnInit {
  element: any;
  element1 :any;
  bankList: any =[];
  clientId: any;
  userId: any;
  userRole: any;

  constructor(private sharedModuleService: SharedModuleService,
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
    
  
   
    this. getclientBankDetails();
  }


  getclientBankDetails() {
    this.sharedModuleService.getBankData(this.clientId).subscribe(data => {
      if (data) {
        this.element1 = data
      }
    }, err => {
      this.toastr.showError("Error in loading data");
    });
  }
}
