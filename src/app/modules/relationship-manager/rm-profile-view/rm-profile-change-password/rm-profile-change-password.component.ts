import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from 'src/app/shared/password.validator';
import { MatDialog } from '@angular/material/dialog';
import { UpdatePasswordModalComponent } from 'src/app/shared/update-password-modal/update-password-modal.component';
import { UpdatePasswordConfirmationModalComponent } from 'src/app/shared/update-password-confirmation-modal/update-password-confirmation-modal.component';
import { UpdatePasswordOtpModalComponent } from 'src/app/shared/update-password-otp-modal/update-password-otp-modal.component';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';


@Component({
  selector: 'app-rm-profile-change-password',
  templateUrl: './rm-profile-change-password.component.html',
  styleUrls: ['./rm-profile-change-password.component.css']
})
export class RmProfileChangePasswordComponent implements OnInit {
  modalForm: FormGroup;
  parameterValue !: string;
  securityCodeAccepted: boolean = false;
  showDetails: boolean = true;
  show: boolean = false;
  confirmPassShow?: boolean;
  passwordStrength: number = 0;
  emailId?: string;
  emailID !: string;
  password: any;
  constructor(private formBuilder: FormBuilder, public dialog: MatDialog,
    private _sharedModulService: SharedModuleService,
    private toastr: ToastrShowService,) { this.modalForm = this.formBuilder.group({}); }

  ngOnInit(): void {
    this.modalForm = this.formBuilder.group({
      password: ['', 
      [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&#].{7,}')]
    ],
      confirm_password: ['',
       [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&#].{7,}')]
      ]

    },
      {
        validator: ConfirmedValidator('password', 'confirm_password')
      });

  }

  onStrengthChanged(strength: number, value: any) {
    this.passwordStrength = strength;
  }

  passwordToggle() {
    this.show = !this.show;
  }
  passDetailsToggle() {
    this.showDetails = !this.showDetails;
  }

  passStrengthCheck(input: any) {
    let a = input.target.value.replace(/\s/g, "");
    input.target.value = a;
    if (input.target.value == '') {
      this.passwordStrength = 0;
    }
  }
  confirmPasswordToggle() {
    this.confirmPassShow = !this.confirmPassShow;
  }

  back() {
    window.location.reload();
  }

  submit() {
    if (this.modalForm.invalid) {
      return;
    }
    this.password = this.modalForm.value.password
    this._sharedModulService.setRmPassword(this.password)
    const dialogRef = this.dialog.open(UpdatePasswordOtpModalComponent, {
      width: '500px',
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe((res:any) => {
      if( res ==  "set new password successfully"){
        window.scroll(0,0,)
        this.toastr.showSuccess("Password Changed Successfully")
      }
     })
  }

}
