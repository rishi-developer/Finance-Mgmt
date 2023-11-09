import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { FORGET_PASSWORD } from 'src/app/constants/login.constants';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent implements OnInit {
  forgetForm!: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private _authService: AuthUserService,
    private toastr: ToastrShowService
  ) {}

  ngOnInit(): void {
    this.forgetForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.minLength(5),
          Validators.pattern(/^\S+@\S+\.\S+$/),
          Validators.pattern('[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}'),
        ],
      ],
    });
  }

  /**
   * navigates back to the login page
   */
  backToLogin() {
    this.router.navigate(['/login']);
  }

  /**
   * generates the OTP for email inserted to reset the password
   */
  submit() {
    if (this.forgetForm.valid) {
      let mail_id = this.forgetForm.controls['email'].value;
      this._authService.forgotPassword(mail_id).subscribe(
        (res: { message: string }) => {
          if (res) {
            this._authService.setForgetmail(mail_id);
            this.toastr.showSuccess(FORGET_PASSWORD.OTP_SENT);
            this.router.navigate(['/forget-OTP']);
          }
        },
        (error) => {
          if (error.status === 417) {
            this.toastr.showError('Email Id not registered');
          }
        }
      );
    }
  }
}
