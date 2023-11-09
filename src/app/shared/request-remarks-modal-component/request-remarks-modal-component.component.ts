import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { BrokerModuleService } from 'src/app/modules/broker/service/broker-module.service';

@Component({
  selector: 'app-request-remarks-modal-component',
  templateUrl: './request-remarks-modal-component.component.html',
  styleUrls: ['./request-remarks-modal-component.component.css'],
})
export class RequestRemarksModalComponentComponent implements OnInit {
  form: FormGroup;

  constructor(
    private responsiveService: ResponsiveService,
    private brokerModuleService: BrokerModuleService,
    private authUserService: AuthUserService,
    private toastr: ToastrShowService,
    public dialogRef: MatDialogRef<RequestRemarksModalComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      textArea: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.data = this.data.modalData;
  }

  /**
   * Closes the dialog modal component
   */
  goBack(): void {
    this.dialogRef.close();
  }

  /**
   * Makes the API call for changing the request status
   */
  onSubmit() {
    if (this.form.valid) {
      this.brokerModuleService
        .changeRequestStatus(
          this.data.userId,
          String(this.data.requestId),
          this.data.requestStatus,
          this.form.value.textArea
        )
        .subscribe(
          (data) => {
            if (data) {
              this.toastr.showSuccess('Request status changed successfully');
            }
          },
          (err) => {
            this.toastr.showError('Error in change request status');
          }
        );
        this.dialogRef.close();
    }
  }
}
