import { NgModule } from '@angular/core';
import { LoginRoutingModule } from './login-routing.module';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForgetPasswordOTPComponent } from './forget-password-otp/forget-password-otp.component';
import { ForgetCreatePasswordComponent } from './forget-create-password/forget-create-password.component';
import { SignUpOtpComponent } from './sign-up-otp/sign-up-otp.component';
import { SignUpCreatePasswordComponent } from './sign-up-create-password/sign-up-create-password.component';

@NgModule({
  declarations: [
    LoginScreenComponent,
    ForgetPasswordComponent,
    SignUpComponent,
    ForgetPasswordOTPComponent,
    ForgetCreatePasswordComponent,
    SignUpOtpComponent,
    SignUpCreatePasswordComponent,
  ],
  imports: [LoginRoutingModule, SharedModule],
})
export class LoginModule {}
