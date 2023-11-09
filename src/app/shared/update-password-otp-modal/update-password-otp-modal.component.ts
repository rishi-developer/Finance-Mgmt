import { Component, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { RelationshipManagerService } from 'src/app/modules/relationship-manager/service/relationship-manager.service';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { UpdatePasswordModalComponent } from '../update-password-modal/update-password-modal.component';
import { USERROLES } from '../common-enums/enum';

@Component({
  selector: 'app-update-password-otp-modal',
  templateUrl: './update-password-otp-modal.component.html',
  styleUrls: ['./update-password-otp-modal.component.css'],
})
export class UpdatePasswordOtpModalComponent implements OnInit {
  rmPassword!: string;
  rmEmail!: string;
  userRole: string = '';

  constructor(
    public dialogRef: MatDialogRef<UpdatePasswordOtpModalComponent>,
    public dialog: MatDialog,
    private _sharedModulService: SharedModuleService,
    private toastr: ToastrShowService,
    private _authService: AuthUserService,
    private relationshipMangerModuleService: RelationshipManagerService
  ) {}

  ngOnInit(): void {
    this._authService.getUserDetailBehaviorSubject().subscribe((data) => {
      if (data) this.userRole = data.newRoleFinal?.roleDescription;
    });
    this.rmPassword = this._sharedModulService.getRmPassword();
    if (this.userRole === USERROLES.RELATIONSHIP_MANAGER)
      this.rmEmail =
        this.relationshipMangerModuleService.getRMprofileData()?.email;
    if (this.userRole === USERROLES.CLIENT)
      this.rmEmail = this._sharedModulService.clientEmail;
  }
  close() {
    this.dialogRef.close();
  }
  submit() {
    let mail_id = this.rmEmail;
    this._authService.forgotPassword(mail_id).subscribe(
      (res: any) => {
        if (res) {
          this._authService.setForgetmail(mail_id);
          this.toastr.showSuccess(
            'OTP sent successfully to the registered email id'
          );
          this.dialogRef.close();
          this.dialog.open(UpdatePasswordModalComponent, {
            width: '500px',
            restoreFocus: false,
          });
        }
      },
      (error) => {
        if (error.status == 500) {
          this.toastr.showError('Email Id not registered');
        }
      }
    );
  }
}
