import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UploadIPDMpdalComponent } from '../upload-ipd-mpdal/upload-ipd-mpdal.component';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';

@Component({
  selector: 'app-risk-profile-result',
  templateUrl: './risk-profile-result.component.html',
  styleUrls: ['./risk-profile-result.component.css'],
})
export class RiskProfileResultComponent implements OnInit {
  mainHeadingValue: string = 'Risk Profile';
  profilescore: any;
  userID: any;
  fileURL: any;
  clientId!: string;
  riskScore!: any;
  role: any;
  userId!: string;
  disableViewButton: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _sharedModulService: SharedModuleService,
    private authUserService: AuthUserService
  ) {
    this.profilescore = localStorage.getItem('profilescore') as string;
    this.userID = localStorage.getItem('userId') as string;
    this._sharedModulService.setNavbarHeading(this.mainHeadingValue);
  }

  ngOnInit(): void {
    this.IPDUploadCheck();
    this.route.paramMap.subscribe((params: any) => {
      this.clientId = params.get?.('id');
      if (this.clientId === null || this.clientId === undefined) {
        this.clientId = this._sharedModulService.riskClientId;
      }
    });
    this.authUserService.getUserDetailBehaviorSubject().subscribe((data) => {
      if (data) {
        this.role = data.newRoleFinal?.roleDescription;
        this.userId = data.userId;
        if (this.role === 'CLIENT') {
          this.clientId = data.userId;
        }
      }
    });
    let payload = {
      userId: this.clientId,
    };
    this._sharedModulService
      .getClientRiskAssessmentScore(payload)
      .subscribe((res) => {
        if (res) {
          this.profilescore = res.message;
        }
      });
    this._sharedModulService.setNavbarHeading(this.mainHeadingValue);
  }

  /**
   * Checks if IPD document is uploaded.
   */

  IPDUploadCheck() {
    this._sharedModulService
      .checkIPDDocument(this.clientId)
      .subscribe((res) => {
        if (res.message === 'True') {
          this.disableViewButton = true;
        }
      });
  }

  /**
   * Navigates back to the risk profile.
   */
  backtoRiskprofile() {
    this.router.navigate(['broker-client-portfolio', this.clientId], {
      queryParams: { clientProfileType: 'AllclientsProfile', activeTab: 3 },
    });
  }

  /**
   * Views the IPD document.
   */
  viewIPD() {
    this._sharedModulService.viewIPD(this.clientId).subscribe((data) => {
      if (data) {
        this.fileURL = data.message;
        window.open(this.fileURL, '_blank');
      }
    });
  }

  /**
   * Opens the dialog to upload IPD document.
   */
  uploadIPD() {
    const dialogRef = this.dialog.open(UploadIPDMpdalComponent, {
      width: '800px',
      restoreFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.disableViewButton = true;
      this.IPDUploadCheck();
    });
  }
}
