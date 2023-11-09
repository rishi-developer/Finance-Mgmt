import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { FORGET_PASSWORD, LOGIN } from 'src/app/constants/login.constants';

@Component({
  selector: 'app-sign-up-otp',
  templateUrl: './sign-up-otp.component.html',
  styleUrls: ['./sign-up-otp.component.css'],
})
export class SignUpOtpComponent implements OnInit {
  signupForm!: FormGroup;
  securityCode!: string;
  show: boolean = false;
  emailID!: string;

  constructor(
    private router: Router,
    private toastr: ToastrShowService,
    private formBuilder: FormBuilder,
    private _authService: AuthUserService
  ) {
    this.emailID = this._authService.getSignUpmail();
  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      otp1: [''],
      otp2: [''],
      otp3: [''],
      otp4: [''],
      otp5: [''],
      otp6: [''],
    });
  }

  /**
   * Resend the OTP to the registered email.
   */
  resend() {
    this._authService.forgotPassword(this.emailID).subscribe(
      (res: { message: string }) => {
        if (res) {
          this.toastr.showSuccess(FORGET_PASSWORD.OTP_SENT);
        }
      },
      (error) => {
        this.toastr.showError('Error in Sending OTP');
      }
    );
  }

  /**
   * Verify the entered OTP and proceed if valid.
   */
  verifyOtpFn() {
    this.securityCode = Object.values(this.signupForm.value)
      ?.join('')
      .toLowerCase();
    if (this.securityCode?.length === 6) {
      this._authService.validateOtp(this.emailID, this.securityCode).subscribe(
        (data) => {
          if (data.message === LOGIN.VALIDATE_OTP) {
            this.toastr.showSuccess(LOGIN.VALIDATE_OTP);
            this._authService.setSignUpOTP(this.securityCode);
            this.router.navigate(['/sign-up-create-password']);
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
}
