import { Component, Input, OnInit } from '@angular/core';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { ToastrService } from 'ngx-toastr';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-portfolio-profile-tab',
  templateUrl: './portfolio-profile-tab.component.html',
  styleUrls: ['./portfolio-profile-tab.component.css']
})
export class PortfolioProfileTabComponent implements OnInit {
  @Input() selectedButtonValue?: string;
  clientId!: string;
  mainHeadingValue: string = '';
  element: any;
  mobile: boolean = false;
  bankDetails: any = [];
  userId: any;
  viewDetail: any = {
  };
  userRole: any;
  constructor(private sharedModuleService: SharedModuleService,
    private _responsiveService: ResponsiveService,
    private route: ActivatedRoute,
    private authUserService: AuthUserService,
    private toastr: ToastrShowService,) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.clientId = params.get?.('id');
    });

    this.authUserService.getUserDetailBehaviorSubject().subscribe(data => {
      if (data)
        this.userId = data.userId;this.userId = data.userId;
        this.userRole = data.newRoleFinal.roleDescription;
        if(this.userRole=='CLIENT'){
          this.mainHeadingValue='Home';
        }
        else{
          this.mainHeadingValue='Client Profile';
        }
    });

    this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);

    if( this.userRole == 'CLIENT'){
      this.clientId = this.userId
    }
    this.getclientOverview();
  }


  getclientOverview() {
    var gotClientDetails = new Promise((resolve, reject) => {
      this.sharedModuleService.getClientOverview(this.clientId, this.userId).subscribe(data => {
        if (data) {
          data.portfolioValue = Number(data.portfolioValue).toFixed(2);
          data.totalReturn = Number(data.totalReturn).toFixed(2);
          this.element = data;
          this.viewDetail.clientFirstName = data.clientFirstName;
          this.viewDetail.clientMiddleName = data.clientMiddleName;
          this.viewDetail.clientLastName = data.clientLastName;
          this.viewDetail.email = data.email;
          this.viewDetail.clientPhoneNo = data.clientPhoneNo;
          this.viewDetail.userFirstNameAlphabet = data.clientFirstName.charAt(0);;
          this.viewDetail.userLastNameAlphabet = data.clientLastName.charAt(0);
          this.sharedModuleService.setClientOverviewDetails(this.element)
        }
        resolve(true);
      });
    });
    return gotClientDetails;
  }




}
