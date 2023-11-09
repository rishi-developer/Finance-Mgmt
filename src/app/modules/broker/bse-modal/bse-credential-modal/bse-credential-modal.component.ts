import { BrokerModuleService } from './../../service/broker-module.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { BseCredentialConfirmationModalComponent } from '../bse-credential-confirmation-modal/bse-credential-confirmation-modal.component';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-bse-credential-modal',
  templateUrl: './bse-credential-modal.component.html',
  styleUrls: ['./bse-credential-modal.component.css']
})
export class BseCredentialModalComponent implements OnInit {
  bseCredentialForm!: FormGroup;
  message?:string;

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<BseCredentialModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private router:Router,
    private toastr: ToastrShowService,
    private sharedModuleService:SharedModuleService,
    private brokerModuleService:BrokerModuleService) { }

  ngOnInit(): void {
    this.bseCredentialForm = this.formBuilder.group({
      bseUserId: ['', Validators.required],
      bseMemberId: ['', Validators.required],
      bsePwd: ['', Validators.required],
      partnerId: [this.data.partnerId]
    });
  }
  onClose() {
    this.dialogRef.close();
  }
  onSubmit() {
    if(this.bseCredentialForm.invalid)
      return;
    this.brokerModuleService.saveBseCredential(this.bseCredentialForm.value).subscribe(data => {
      if(data){
      this.message=data.message;
      if(this.message=='success'){
      this.toastr.showSuccess('Verification successful');
      this.sharedModuleService.sendUpdate(true);
      this.onClose();
      const dialogRef = this.dialog.open(BseCredentialConfirmationModalComponent, {
        width: '600px',
        data:{selectedTransaction:this.data.selectedTransaction,transactionType:this.data.transactionType,fundName:this.data.fundName,clientId:this.data.clientId,schemeCode:this.data.schemeCode},
        panelClass: 'bse-credential-confirmation-modal'
      });
    }
    else{
      this.toastr.showError(this.message ?? 'Please try again later');
    }
      }
    },
    err=>{
      this.toastr.showError("Error in verifying password");
    });


  }

}
