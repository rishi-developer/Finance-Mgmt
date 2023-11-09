import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { USERROLES } from '../../common-enums/enum';
@Component({
  selector: 'app-broker-client-portfolio-dashboard',
  templateUrl: './broker-client-portfolio-dashboard.component.html',
  styleUrls: ['./broker-client-portfolio-dashboard.component.css'],
})
export class BrokerClientPortfolioDashboardComponent implements OnInit {
  mainHeadingValue: string = '';
  mobile: boolean = false;
  clientId: any;
  role: any;
  broker: any;
  flag: boolean = false;
  viewDetail: any = {};
  selectionTypes = ['Profile', 'Holding'];
  selectedValue: string = 'Profile';
  clientProfileType!: string;
  clientCodeBse: any;
  activeTab: number = 0;
  profileScore: any;
  userId!: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authUserService: AuthUserService,
    private _responsiveService: ResponsiveService,
    private sharedModuleService: SharedModuleService,
    private _sharedModuleService: SharedModuleService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams.activeTab) {
        // Set the active tab based on the query parameter
        this.activeTab = +queryParams.activeTab;
        this.profileScore = 'Risk Profile Not Generated.';
      }
    });
    this.authUserService.getUserDetailBehaviorSubject().subscribe((data) => {
      if (data) {
        this.role = data.newRoleFinal.roleDescription;
        this.userId = data.userId;
        if (this.role === USERROLES.CLIENT) {
          this.mainHeadingValue = 'Home';
          this.clientId = data.userId;
        } else {
          this.mainHeadingValue = 'Client Profile';
        }
      }
    });

    this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);

    this.route.paramMap.subscribe((params: any) => {
      this.clientId = params.get?.('id');
    });

    this.route.queryParams.subscribe((queryparams) => {
      this.clientProfileType = queryparams.clientProfileType;
    });

    this.clientCodeBse = localStorage.getItem('clientCodeBse');
    this.onResize();
    this._responsiveService.checkWidth();
    if (this.role === 'CLIENT') {
      this.clientId = this.userId;
    }
    let payload = {
      userId: this.clientId,
    };
    if (this.profileScore !== 'Risk Profile Not Generated.') {
      this._sharedModuleService
        .getClientRiskAssessmentScore(payload)
        .subscribe((res) => {
          if (res) {
            this.profileScore = res.message;
          }
        });
    }
  }

  getBrokerClientDetails() {
    this._sharedModuleService
      .getBrokerProfile(this.clientId)
      .subscribe((data) => {
        if (data) {
          this.viewDetail.name = data.clientName;
          this.viewDetail.panNo = data.clientPAN;
          this.viewDetail.brokerName = data.brokerName;
          if (data.type === 1) {
            this.viewDetail.type = 'Advisory Client';
          } else {
            this.viewDetail.type = '-';
          }
        }
      });
  }

  getBrokerClientSummary() {
    this._sharedModuleService
      .getBrokerSummary(this.clientId)
      .subscribe((data) => {
        if (data) {
          this.viewDetail.activeFunds = data.activeFunds;
          this.viewDetail.activeSIP = data.activeSIP;
          this.viewDetail.fundValue = data.fundValue;
          this.viewDetail.totalReturn = data.totalReturn;
          if (data.type === 1) {
            this.viewDetail.type = 'Advisory Client';
          } else {
            this.viewDetail.type = '-';
          }
        }
      });
  }

  onResize() {
    this._responsiveService.getMobileStatus().subscribe((isMobile: boolean) => {
      this.mobile = isMobile;
    });
  }

  backroute() {
    if (this.clientProfileType === 'mandateClientProfile') {
      this.router.navigate(['mandate']);
    }
    if (this.clientProfileType === 'AllclientsProfile') {
      if (this.role === 'BROKER ADMIN') {
        this.router.navigate(['broker']);
      } else {
        this.router.navigate(['relationshipManager']);
      }
    }
  }
}
