import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { ClientService } from '../service/client.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { BrokerModuleService } from '../../broker/service/broker-module.service';

interface uccActivationDetails {
  idDocumentType: string;
  name: string;
  uploadedFile: any;
}

const ELEMENT_DATA: uccActivationDetails[] = [
  { idDocumentType: 'Required file need to be in .tiff', name: '', uploadedFile: '' },
];

@Component({
  selector: 'app-ucc-activation-modal',
  templateUrl: './ucc-activation-modal.component.html',
  styleUrls: ['./ucc-activation-modal.component.css']
})
export class UccActivationModalComponent implements OnInit {
  mobile: boolean = false;
  dataSource = ELEMENT_DATA;
  displayedColumns: string[] = ['idDocumentType', 'name', 'action', 'uploadedFile'];
  userId: string = '';
  modalData: any = [];
  changeTriggered: boolean = false;
  file: any;
  modalForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<UccActivationModalComponent>,
    private brokerModuleService: BrokerModuleService,
    private responsiveService: ResponsiveService,
    private clientService: ClientService,
    private toastr: ToastrShowService,
    private router: Router,
    private formBuilder: FormBuilder,
    private sharedModuleService:SharedModuleService,
    private authUserService: AuthUserService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.modalForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.authUserService.getUserDetailBehaviorSubject().subscribe(data => {
      if (data)
        this.userId = data.userId;
    });

    this.modalForm = this.formBuilder.group({
      attachmentFile: ["", Validators.required],
    });

    this.getModalData();
    this.onResize();
    this.responsiveService.checkWidth();
  }

  onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile: boolean) => {
      this.mobile = isMobile;
    });
  }

  getModalData() {
    this.modalData = this.data.modalData;
  }

  onClose() {
    this.dialogRef.close();
  }

  onChange(event: any): void {
    this.changeTriggered = true;
    this.file = event.target.files[0];
  }

  activateUcc() {
    if (this.modalForm.invalid)
      return;

    const formData = new FormData();
    formData.append("file", this.file);
    formData.append("userIdOfCreator", this.userId);
    formData.append("userIdOfClient", this.modalData.clientId);

    this.clientService.activateUcc(formData).subscribe(data => {
      if (data) {
        let message = data.message;
        this.toastr.showSuccess('Ucc Activated successfully');
        this.onClose();
        this.sharedModuleService.sendUccActivationUpdate('Ucc Activated successfully');
        this.brokerModuleService.changeRequestStatus(this.userId,String(this.modalData.requestId),'1',"").subscribe(data => {
        })
      }
    }, err => {
      if (err.status == 409) {
        this.toastr.showError("Please upload file in tiff format");
      }
      else if(err.status == 208){
        this.toastr.showError(err.error.text);
      }
      else {
        this.toastr.showError(err.error);
      }
    });
  }


}
