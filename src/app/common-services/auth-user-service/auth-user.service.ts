import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';
import {
  LoginResponse,
  SignupResponse,
  UserInfoResponse,
} from 'src/app/models/login';
export let browserRefresh = false;

@Injectable({
  providedIn: 'root',
})
export class AuthUserService {
  loggedIn: boolean = false;
  userEmail = '';
  userPassword = '';
  forgetEmail: string = '';
  forgetOtp!: string;
  signUpEmail!: string;
  signUpOTP!: string;
  mail!: string;
  private subscription: Subscription;
  public isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedInObservable = this.isLoggedIn.asObservable();
  userInfo = new BehaviorSubject<any>(null);
  public sideBarFlag = new BehaviorSubject<boolean>(false);
  SideBarFlagObservable = this.sideBarFlag.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  //Login/Sign-In Helper function starts here

  /**
   * Checks if a user is authenticated by providing an email and password.
   * @param  email - User's email address.
   * @param  password - User's password.
   * @returns {Observable<LoginResponse>} An Observable that emits a LoginResponse.
   */
  isAuthenticated(email: string, password: string): Observable<LoginResponse> {
    const obj = {
      email: email,
      password: password,
    };
    return this.http.post<LoginResponse>('new/login', obj);
  }

  /**
   * sets the detail of the logged-in user in local storage
   * @param tokenInfo is details of the logged in user
   */
  setToken(tokenInfo: LoginResponse) {
    localStorage.setItem('token', tokenInfo.token);
    localStorage.setItem('roleDetails', JSON.stringify(tokenInfo));
    this.getRole();
  }

  getSideBarFlag() {
    return this.sideBarFlag.asObservable();
  }

  /**
   * Retrieves the user's token from local storage.
   * Updates the isLoggedIn BehaviorSubject if a token is found.
   * @returns {string | null} - The user's token or null if not found.
   */
  getToken() {
    let resultToken = localStorage.getItem('token');
    if (resultToken != null) {
      this.isLoggedIn.next(true);
    }
    return resultToken;
  }

  /**
   * Retrieves user role details from local storage.
   * Updates the isLoggedIn BehaviorSubject and userInfo BehaviorSubject if role details are found.
   * @returns {string | null} - User role details (as a string) or null if not found.
   */
  getRole() {
    let resultToken = localStorage.getItem('roleDetails');
    if (resultToken != null) {
      this.isLoggedIn.next(true);
      this.userInfo.next(JSON.parse(resultToken));
    }
    return resultToken;
  }

  /**
   * User details stored in the userInfo BehaviorSubject.
   * @returns {Observable<any>} An Observable emitting user details.
   */
  getUserDetailBehaviorSubject(): Observable<LoginResponse> {
    this.getRole();
    return this.userInfo.asObservable();
  }

  /**
   * Validates an OTP
   * @param email - Email for which to validate the OTP.
   * @param otp - OTP to be validated.
   * @returns {Observable<SignupResponse>} An Observable that emits a message.
   */
  validateOtp(email: string, otp: string): Observable<SignupResponse> {
    const obj = {
      email: email,
      otp: otp,
    };
    return this.http.post<SignupResponse>('validate/otp', obj);
  }

  /**
   * call to generate otp for the email
   * @param email is the email id of user
   */
  forgotPassword(email: string) {
    const obj = {
      email: email,
    };
    return this.http.post<{ message: string }>('send/otp', obj);
  }

  /**
   * Sets up a new password for a user.
   * @param email -  User's email address.
   * @param password -  New password to set.
   * @param OTP -  One-Time Password for verification.
   * @returns - An Observable of type SignupResponse.
   */
  setUpPassword(
    email: string,
    password: string,
    OTP: string
  ): Observable<SignupResponse> {
    const obj = {
      email: email,
      password: password,
      otp: OTP,
    };
    return this.http.post<SignupResponse>('new/set/password', obj);
  }

  /**
   * Get user information by providing a random string.
   * @param randomString - Random string used to identify the user.
   * @returns {Observable<UserInfoResponse>} An Observable that emits user information.
   */
  getUserInfo(randomString: string): Observable<UserInfoResponse> {
    const obj = {
      randomString: randomString,
    };
    return this.http.post<UserInfoResponse>('get/user/email', obj);
  }

  /**
   * Sets the forget email address.
   * @param {string} email The email address to set as the forget email.
   */
  setForgetmail(email: string) {
    this.forgetEmail = email;
  }

  /**
   * Retrieves the forget email address.
   * @returns {string} The forget email address.
   */
  getForgetmail() {
    return this.forgetEmail;
  }

  /**
   * Sets the forget OTP
   * @param otp - OTP to set as the forget OTP.
   */
  setForgetOTP(otp: string) {
    this.forgetOtp = otp;
  }

  /**
   * Retrieves the forget OTP
   * @returns {string}  - Forget OTP.
   */
  getFotgetOTP() {
    return this.forgetOtp;
  }

  /**
   * Sets the sign-up email address.
   * @param email - Email address to set as the sign-up email.
   */
  setSignUpmail(email: string) {
    this.signUpEmail = email;
  }

  /**
   * Get the sign-up email address.
   * @returns {string} -  Sign-up email address.
   */
  getSignUpmail() {
    return this.signUpEmail;
  }

  /**
   * Set the sign-up OTP.
   * @param otp - OTP to set as the sign-up OTP.
   */
  setSignUpOTP(otp: string) {
    this.signUpOTP = otp;
  }

  /**
   * Get the sign-up OTP.
   * @returns {string} - Sign-up OTP.
   */
  getSignUpOTP() {
    return this.signUpOTP;
  }
}
