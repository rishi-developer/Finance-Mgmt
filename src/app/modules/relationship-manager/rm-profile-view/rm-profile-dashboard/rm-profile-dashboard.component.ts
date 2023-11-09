import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { RelationshipManagerService } from '../../service/relationship-manager.service';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { USERROLES } from 'src/app/shared/common-enums/enum';
@Component({
  selector: 'app-rm-profile-dashboard',
  templateUrl: './rm-profile-dashboard.component.html',
  styleUrls: ['./rm-profile-dashboard.component.css']
})
export class RmProfileDashboardComponent implements OnInit {
  mainHeadingValue: string = 'Profile';
  details: any;
  index : number = 0;
  rmUserId:string='';
  rmBoolean: boolean = false;
  role: string ="";
  hasRmFunctionality: boolean = false;

  constructor(private sharedModuleService: SharedModuleService,
    private relationshipMangerModuleService: RelationshipManagerService,
    private toastr: ToastrShowService,
    private router:Router,
    private authUserService:AuthUserService,
    private route:ActivatedRoute) {
  }

  ngOnInit(): void {
    this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);
    this.route.paramMap.subscribe((params:any)=>{
      this.rmUserId=params.get?.('rmUserId');
   });

   this.authUserService.getUserDetailBehaviorSubject().subscribe(data => {
    if (data){
      this.role = data.newRoleFinal.roleDescription;
      if(this.role=== USERROLES.RELATIONSHIP_MANAGER){
        this.rmBoolean = true;
      }
    }
  });
  this.getRMprofile();
  }

  backroute(){
    if(this.role=='RELATIONSHIP MANAGER'){
      this.router.navigate(['relationshipManager']);
    }
    else{
      this.router.navigate(['broker']);
    }
  }

  getRMprofile() {
    this.relationshipMangerModuleService.getRmProfile(this.rmUserId).subscribe(res => {
      if (res) {
        this.details = res;
        this.details.userFirstNameAlphabet = this.details.firstName.charAt(0);;
        this.details.userLastNameAlphabet= this.details.lastName.charAt(0);
        this.relationshipMangerModuleService.setRmProfileUpdate(this.details);
        this.relationshipMangerModuleService.setRMprofileData(this.details);
        if(this.details.hasRmFunctionality !== '')
          this.hasRmFunctionality = true;
      }
    }, err => {
      this.toastr.showError("Error in loading data");
    })
  }
}
