import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { RelationshipManagerService } from '../../relationship-manager/service/relationship-manager.service';

@Component({
  selector: 'app-ucc-activation-confirmation-modal',
  templateUrl: './ucc-activation-confirmation-modal.component.html',
  styleUrls: ['./ucc-activation-confirmation-modal.component.css'],
})
export class UccActivationConfirmationModalComponent implements OnInit {
  // modalData: any;
  constructor(
    public dialogRef: MatDialogRef<any>,
    private toastr: ToastrShowService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private relationshipManagerService: RelationshipManagerService
  ) {}

  ngOnInit(): void {}

  back() {
    this.dialogRef.close();
  }

  submit() {
    console.log(this.data)
    this.relationshipManagerService
      .removeClient(this.data.modalData.rmUserId, this.data.modalData.clientUserId, 'UCC Activation')
      .subscribe(
        (data: any) => {
          if (data) {
            this.toastr.showSuccess(data.message);
          }
        },
        (err: any) => {
          this.toastr.showError('Error in raising request');
        }
      );
      this.dialogRef.close();

    // this.toastr.showSuccess('Request status changed successfully');
  }
}
