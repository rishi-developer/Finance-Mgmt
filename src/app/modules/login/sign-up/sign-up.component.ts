import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { FORGET_PASSWORD, LOGIN } from 'src/app/constants/login.constants';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  parameterValue!: string;
  emailId!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrShowService,
    private _authService: AuthUserService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryparams) => {
      this.parameterValue = queryparams.signUpCode;
    });
    this.getEmail();
  }

  /**
   * Fetch email address
   */
  getEmail() {
    this._authService.getUserInfo(this.parameterValue).subscribe(
      (res) => {
        if (res) {
          this.emailId = res.email;
          this._authService.setSignUpmail(this.emailId);
        }
      },
      (error) => {
        if (error.status === 404) {
          this.toastr.showError('Link is Expired');
        } else {
          this.toastr.showError(LOGIN.ERROR_LOADING);
        }
      }
    );
  }

  /**
   * Handle form submission to request OTP
   */
  submit() {
    this._authService.forgotPassword(this.emailId).subscribe(
      (res: { message: string }) => {
        if (res) {
          this.toastr.showSuccess(FORGET_PASSWORD.OTP_SENT);
          this.router.navigate(['/sign-up-otp']);
        }
      },
      (error) => {
        this.toastr.showError(LOGIN.ERROR_LOADING);
      }
    );
  }
}
