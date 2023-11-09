import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { LOGIN } from 'src/app/constants/login.constants';
import { LoginResponse } from 'src/app/models/login';
import { USERROLES } from 'src/app/shared/common-enums/enum';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css'],
})
export class LoginScreenComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  errorState = false;
  confirmPassShow?: boolean;
  userRole: string = '';
  firstTimeLogin!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrShowService,
    private _authService: AuthUserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.minLength(5),
          Validators.pattern(/^\S+@\S+\.\S+$/),
        ],
      ],
      password: ['', Validators.required],
    });

    this._authService.getUserDetailBehaviorSubject().subscribe((data) => {
      if (data) {
        this.userRole = data.newRoleFinal?.roleDescription;
      }
    });
    this.routeDashboard();
  }

  /**
   * route to the forget password screen
   */
  forgotPassword() {
    this.router.navigate(['/login/forget']);
  }

  /**
   * Function to login the user and sets the token in local storage
   */
  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    let username = this.loginForm.controls['email'].value;
    const password = this.loginForm.controls['password'].value;
    this._authService.isAuthenticated(username, password).subscribe(
      (response: LoginResponse) => {
        this._authService.setToken(response);
        this.userRole = response?.newRoleFinal?.roleDescription;
        this.firstTimeLogin = response?.brokerAdminfirstTimeLogin;
        this.routeDashboard();
      },
      (error) => {
        this.toastr.showError(LOGIN.INVALID_CRED);
      }
    );
  }

  /**
   * Routes the user to specific location based upon the user role
   */
  routeDashboard() {
    if (this._authService.getToken()) {
      if (this.userRole === USERROLES.ADMIN) {
        this.router.navigate(['product-admin']);
      } else if (this.userRole === USERROLES.BROKER_ADMIN) {
        if (this.firstTimeLogin) {
          this.router.navigate(['broker-onboarding']);
        } else {
          this.router.navigate(['broker']);
        }
      } else if (this.userRole === USERROLES.RELATIONSHIP_MANAGER) {
        this.router.navigate(['relationshipManager']);
      } else {
        this.router.navigate(['client']);
      }
    }
  }

  /**
   * Toggles the visibility icon in the password field
   */
  confirmPasswordToggle() {
    this.confirmPassShow = !this.confirmPassShow;
  }
}
