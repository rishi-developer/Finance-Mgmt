import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { FORGET_PASSWORD, LOGIN } from 'src/app/constants/login.constants';

@Component({
  selector: 'app-forget-password-otp',
  templateUrl: './forget-password-otp.component.html',
  styleUrls: ['./forget-password-otp.component.css'],
})
export class ForgetPasswordOTPComponent implements OnInit {
  forgetForm!: FormGroup;
  securityCode!: string;
  emailID!: string;
  resendOTP: boolean = false;
  resendOTPTimer!: number;

  constructor(
    private router: Router,
    private toastr: ToastrShowService,
    private formBuilder: FormBuilder,
    private _authService: AuthUserService
  ) {
    this.emailID = this._authService.getForgetmail();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.startResendOTPTimer();
  }

  initializeForm() {
    this.forgetForm = this.formBuilder.group({
      otp1: [''],
      otp2: [''],
      otp3: [''],
      otp4: [''],
      otp5: [''],
      otp6: [''],
    });
  }

  /**
   * Verify the entered OTP and proceed if valid.
   */
  verifyOtpFn() {
    this.securityCode = Object.values(this.forgetForm.value)
      ?.join('')
      .toLowerCase();
    if (this.securityCode?.length === 6) {
      this._authService.validateOtp(this.emailID, this.securityCode).subscribe(
        (data) => {
          if (data.message === LOGIN.VALIDATE_OTP) {
            this.toastr.showSuccess(data.message);
            this.router.navigate(['/forget-create-password']);
            this._authService.setForgetOTP(this.securityCode);
          } else if (data.message === 'OTP expired!!') {
            this.toastr.showError('OTP Expired');
          }
        },
        (error) => {
          this.toastr.showError(FORGET_PASSWORD.SECURITY_CODE);
        }
      );
    }
  }

  /**
   * Navigate back to the forget email page.
   */
  backToForgetEmail() {
    this.router.navigate(['/login/forget']);
  }

  /**
   * Resend the OTP to the registered email.
   */
  resend() {
    let mail_id = this.emailID;
    this._authService
      .forgotPassword(mail_id)
      .subscribe((res: { message: string }) => {
        if (res) {
          this.toastr.showSuccess(FORGET_PASSWORD.OTP_SENT);
          this.resetResendOTPTimer();
        }
      });
  }

  /**
   * Handle focus on input fields.
   * @param e -  Keyboard event.
   * @param previousField -  Previous input field.
   * @param currentField -  Current input field.
   * @param nextField -  Next input field.
   */
  handleInputFocus(
    e: KeyboardEvent,
    previousField: HTMLInputElement | null,
    currentField: HTMLInputElement,
    nextField: HTMLInputElement | null
  ) {
    const length = currentField.value?.length;
    const maxlength = Number(currentField.getAttribute('maxlength'));
    if (length === maxlength && nextField) {
      nextField.focus();
    }
    if (e.key === 'Backspace' && previousField) {
      previousField.focus();
    }
  }

  /**
   * Starts the timer for resending OTP
   */
  startResendOTPTimer() {
    this.resendOTPTimer = window.setTimeout(() => {
      this.resendOTP = true;
    }, 30000);
  }

  /**
   * Resets the timer for resending OTP
   */
  resetResendOTPTimer() {
    window.clearTimeout(this.resendOTPTimer);
    this.resendOTP = false;
    this.startResendOTPTimer();
  }
}
