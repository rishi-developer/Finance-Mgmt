import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
import { UpdatePasswordConfirmationModalComponent } from '../update-password-confirmation-modal/update-password-confirmation-modal.component';
import { USERROLES } from '../common-enums/enum';

@Component({
  selector: 'app-update-password-modal',
  templateUrl: './update-password-modal.component.html',
  styleUrls: ['./update-password-modal.component.css'],
})
export class UpdatePasswordModalComponent implements OnInit {
  ForgetForm!: FormGroup;
  rmPassword!: string;
  rmEmail!: string;
  securityCode!: string;
  updatePassword: string = '';
  userRole: string ='';
  constructor(
    public dialogRef: MatDialogRef<UpdatePasswordModalComponent>,
    public dialog: MatDialog,
    private _sharedModulService: SharedModuleService,
    private toastr: ToastrShowService,
    private _authService: AuthUserService,
    private formBuilder: FormBuilder,
    private relationshipMangerModuleService: RelationshipManagerService
  ) {}

  ngOnInit(): void {
    this._authService.getUserDetailBehaviorSubject()?.subscribe((data) => {
      if (data) this.userRole = data.newRoleFinal?.roleDescription;
    });
    this.rmPassword = this._sharedModulService.getRmPassword();
    if (this.userRole === USERROLES.RELATIONSHIP_MANAGER)
      this.rmEmail =
        this.relationshipMangerModuleService.getRMprofileData()?.email;
    if (this.userRole === USERROLES.CLIENT)
      this.rmEmail = this._sharedModulService.clientEmail;
    this.ForgetForm = this.formBuilder.group({
      otp1: [''],
      otp2: [''],
      otp3: [''],
      otp4: [''],
      otp5: [''],
      otp6: [''],
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    this._sharedModulService
      .changeRmPassword(this.rmEmail, this.rmPassword)
      .subscribe(
        (res) => {
          if (res.message == 'set new password successfully') {
            this.dialogRef.close(res.message);
          }
        },
        (err) => {
          this.toastr.showError('Error in loading data');
        }
      );
  }

  verifyOtpFn() {
    this.securityCode =
      this.ForgetForm.controls['otp1'].value +
      '' +
      this.ForgetForm.controls['otp2'].value +
      '' +
      this.ForgetForm.controls['otp3'].value +
      '' +
      this.ForgetForm.controls['otp4'].value +
      '' +
      this.ForgetForm.controls['otp5'].value +
      '' +
      this.ForgetForm.controls['otp6'].value;
    if (this.securityCode.length == 6) {
      this._authService.validateOtp(this.rmEmail, this.securityCode).subscribe(
        (data) => {
          if (data.message === 'OTP Validated Successfully') {
            // this.toastr.showSuccess('OTP Validated Successfully');
            this.updatePassword = this._sharedModulService.getRmPassword();

            this._authService
              .setUpPassword(
                this.rmEmail,
                this.updatePassword,
                this.securityCode
              )
              .subscribe(
                (res: any) => {
                  if (res) {
                    // this.toastr.showSuccess('Password Updated Successfully');
                    // this.router.navigate(['login']);
                    this.dialogRef.close();
                    // window.location.reload();
                    const dialogRef = this.dialog.open(
                      UpdatePasswordConfirmationModalComponent,
                      {
                        width: '500px',
                        restoreFocus: false,
                      }
                    );
                  }
                },
                (error) => {
                  if (error.status == 409) {
                    this.toastr.showError(
                      'New Password cannot be same as Previous password!'
                    );
                  }
                }
              );
          } else if (data.message === 'OTP expired!!') {
            this.toastr.showError('OTP Expired');
          }
        },
        (error) => {
          this.toastr.showError('Error in Verifying Security Code');
        }
      );
    }
  }

  move(e: any, p: any, c: any, n: any) {
    var length = c.value.length;
    var maxlength = c.getAttribute('maxlength');
    if (length == maxlength) {
      n.focus();
    }
    if (e.key === 'Backspace') {
      p.focus();
    }
  }
}
