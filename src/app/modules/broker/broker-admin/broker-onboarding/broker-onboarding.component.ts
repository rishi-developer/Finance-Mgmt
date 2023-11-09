import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { BrokerModuleService } from './../../service/broker-module.service';
import { AuthUserService } from './../../../../common-services/auth-user-service/auth-user.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/models/broker-admin';

@Component({
  selector: 'app-broker-onboarding',
  templateUrl: './broker-onboarding.component.html',
  styleUrls: ['./broker-onboarding.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class BrokerOnboardingComponent implements OnInit {
  mainHeadingValue: string = 'Getting Started';
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  userId: string = '';
  submitted: boolean = false;
  message: string = 'not-success';
  userDetailSubscription: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private authUserService: AuthUserService,
    private toastr: ToastrShowService,
    private brokerModuleService: BrokerModuleService,
    private router: Router,
    private sharedModuleService: SharedModuleService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.firstFormGroup = this.formBuilder.group({});
    this.secondFormGroup = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);
    this.userDetailSubscription = this.authUserService
      .getUserDetailBehaviorSubject()
      .subscribe((data) => {
        if (data) this.userId = data.userId;
      });

    this.firstFormGroup = this.formBuilder.group({
      checkbox1: [false, Validators.requiredTrue],
      checkbox2: [false, Validators.requiredTrue],
      checkbox3: [false],
    });

    this.secondFormGroup = this.formBuilder.group({
      arn: ['', Validators.required],
      euin: ['', [Validators.required, Validators.pattern('[E]+[0-9]{6}')]],
      bseUserId: ['', Validators.required],
      bseMemberId: ['', Validators.required],
      bsePwd: ['', Validators.required],
      userId: [this.userId],
    });
  }

  /**
   * Redirects to the login screen after clearing local storage and setting the user as logged out.
   */
  redirectTo() {
    localStorage.clear();
    this.authUserService.isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  /**
   * Submits the first step form based on the checkbox selected, Clears the validation for specific fields in the secondFormGroup.
   */
  firstStepSubmit() {
    this.submitted = true;

    if (!this.firstFormGroup.value.checkbox3) {
      this.secondFormGroup.controls['bseUserId'].setValue('');
      this.secondFormGroup.controls['bseMemberId'].setValue('');
      this.secondFormGroup.controls['bsePwd'].setValue('');

      this.secondFormGroup.controls['bseUserId'].clearValidators();
      this.secondFormGroup.controls['bseUserId'].updateValueAndValidity();

      this.secondFormGroup.controls['bseMemberId'].clearValidators();
      this.secondFormGroup.controls['bseMemberId'].updateValueAndValidity();

      this.secondFormGroup.controls['bsePwd'].clearValidators();
      this.secondFormGroup.controls['bsePwd'].updateValueAndValidity();
      this.changeDetectorRef.detectChanges();
    }
  }

  /**
   * Submits the second step form and checks for duplicate ARN before saving broker BSE info.
   */
  secondStepSubmit() {
    if (this.secondFormGroup.invalid) return;
    const arnValue = this.secondFormGroup.controls['arn'].value;
    this.brokerModuleService
      .checkDuplicateARN(arnValue)
      .pipe(
        mergeMap((data: Message) => {
          if (data) {
            return this.brokerModuleService.saveBrokerBSEInfo(
              this.secondFormGroup.value
            );
          } else {
            throw new Error('ARN not found or other relevant error');
          }
        })
      )
      .subscribe(
        (data: Message) => {
          if (data?.message) {
            this.message = data.message;
            if (this.message === 'success') {
              this.toastr.showSuccess('Onboarded successfully');
            } else {
              this.toastr.showError(this.message);
            }
          }
        },
        (err) => {
          if (err.status === 409) {
            this.toastr.showError(err.error);
          } else {
            this.toastr.showError('Error in onboarding');
          }
        }
      );
  }

  /**
   * Unsubscribes from subscriptions.
   */
  ngOnDestroy(): void {
    this.userDetailSubscription.unsubscribe();
  }
}
