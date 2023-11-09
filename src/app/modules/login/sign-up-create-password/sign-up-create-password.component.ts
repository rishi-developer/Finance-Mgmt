import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControlOptions,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { ConfirmedValidator } from '../../../shared/password.validator';
import { SignupResponse } from 'src/app/models/login';

@Component({
  selector: 'app-sign-up-create-password',
  templateUrl: './sign-up-create-password.component.html',
  styleUrls: ['./sign-up-create-password.component.css'],
})
export class SignUpCreatePasswordComponent implements OnInit {
  signUpForm!: FormGroup;
  showDetails: boolean = true;
  show: boolean = true;
  confirmPassShow?: boolean;
  passwordStrength: number = 0;
  emailID!: string;
  otp!: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrShowService,
    private _authService: AuthUserService
  ) {}

  ngOnInit(): void {
    this.emailID = this._authService.getSignUpmail();
    this.otp = this._authService.getSignUpOTP();
    this.signUpForm = this.formBuilder.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-zd$@$!%*?&#].{7,}'
            ),
          ],
        ],
        confirm_password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-zd$@$!%*?&#].{7,}'
            ),
          ],
        ],
      },
      {
        validator: ConfirmedValidator('password', 'confirm_password'),
      } as AbstractControlOptions
    );
  }

  /**
   * Update the password strength when it changes.
   * @param strength - Current password strength.
   */
  onStrengthChanged(strength: number) {
    this.passwordStrength = strength;
  }

  /**
   * Toggle password visibility.
   */
  passwordToggle() {
    this.show = !this.show;
  }

  /**
   * Toggle password details visibility.
   */
  passwordDetailsToggle() {
    this.showDetails = !this.showDetails;
  }

  /**
   * Check password strength and remove spaces
   * @param input -  Input event object
   */
  passStrengthCheck(input: Event) {
    const inputElement = input.target as HTMLInputElement;
    const trimmedValue = inputElement.value.replace(/\s/g, '');
    inputElement.value = trimmedValue;
    if (inputElement.value === '') {
      this.passwordStrength = 0;
    }
  }

  confirmPasswordToggle() {
    this.confirmPassShow = !this.confirmPassShow;
  }

  /**
   * Reset the password and navigate to the login page if the form is valid
   */
  resetPassword() {
    if (this.signUpForm.valid) {
      const password = this.signUpForm.controls['password'].value;
      this._authService
        .setUpPassword(this.emailID, password, this.otp)
        .subscribe((res: SignupResponse) => {
          if (res) {
            this.toastr.showSuccess('Account created succesfully');
            this.router.navigate(['login']);
          }
        });
    }
  }
}
