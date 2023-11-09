import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgetPasswordOTPComponent } from './forget-password-otp/forget-password-otp.component';
import { ForgetCreatePasswordComponent } from './forget-create-password/forget-create-password.component';
import { SignUpOtpComponent } from './sign-up-otp/sign-up-otp.component';
import { SignUpCreatePasswordComponent } from './sign-up-create-password/sign-up-create-password.component';
const routes: Routes = [
  {
    path: '',
    component: LoginScreenComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'forget',
    component: ForgetPasswordComponent,
  },
  {
    path: 'forget-OTP',
    component: ForgetPasswordOTPComponent,
  },
  {
    path: 'forget-create-password',
    component: ForgetCreatePasswordComponent,
  },
  {
    path: 'sign-up-otp',
    component: SignUpOtpComponent,
  },
  {
    path: 'sign-up-create-password',
    component: SignUpCreatePasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
