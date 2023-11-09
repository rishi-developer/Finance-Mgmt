import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { ProductAdminService } from './../service/product-admin.service';
import { RoleId } from 'src/app/_helper/role';

@Component({
  selector: 'app-add-new-broker',
  templateUrl: './add-new-broker.component.html',
  styleUrls: ['./add-new-broker.component.css'],
})
export class AddNewBrokerComponent implements OnInit {
  mainHeadingValue: string = 'Broker Onboarding';
  modalForm: FormGroup;
  startsWithZero: boolean = false;
  userId: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private productAdminService: ProductAdminService,
    private toastr: ToastrShowService,
    private authUserService: AuthUserService,
    private router: Router,
    private sharedModuleService: SharedModuleService
  ) {
    this.modalForm = this.formBuilder.group({});
    this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);
  }

  ngOnInit(): void {
    this.authUserService.getUserDetailBehaviorSubject().subscribe((data) => {
      if (data) this.userId = data.userId;
    });

    this.modalForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: [''],
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
      phoneNo: [
        '',
        [
          Validators.minLength(10),
          Validators.maxLength(12),
          Validators.required,
          Validators.pattern(/^[0-9]*$/),
        ],
      ],
      organizationName: ['', Validators.required],
      hasRMFunctionality: [false],
      onboardedBy: [this.userId],
      virtualRMId: [''],
      organizationId: [-1],
      role: [RoleId.BrokerAdmin],
      euin: [''],
    });
  }

  /**
   * Validate if phone number starts with '0'.
   * @param number - Phone number input element.
   */
  validatePhoneNumber(number: KeyboardEvent) {
    if ((number.target as HTMLInputElement).value[0]?.toString() === '0') {
      this.startsWithZero = true;
      this.modalForm.controls['phoneNo'].setErrors({ phoneNo: true });
    } else {
      this.startsWithZero = false;
    }
  }

  /**
   * Navigate back to the previous route.
   */
  backRoute() {
    this.router.navigate(['product-admin']);
  }

  /**
   *  Submit the form for broker onboarding.
   */
  onSubmit() {
    if (this.modalForm.invalid) {
      return;
    }
    this.productAdminService.onboardUser(this.modalForm.value).subscribe(
      (data) => {
        if (data) {
          this.toastr.showSuccess('User onboarded successfully');
          this.backRoute();
        }
      },
      (err) => {
        if (err.status === 417) {
          this.toastr.showError('Error in onboarding broker');
        } else {
          this.toastr.showError(err.error);
        }
      }
    );
  }
}
