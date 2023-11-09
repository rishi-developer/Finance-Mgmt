import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-upload-ipd-mpdal',
  templateUrl: './upload-ipd-mpdal.component.html',
  styleUrls: ['./upload-ipd-mpdal.component.css']
})
export class UploadIPDMpdalComponent implements OnInit {
  modalForm: FormGroup;
  submitted: any;
  file: any;
  userID: any;
  formData: any
  buttonBoolean: any
  ViewIPDButtonFlag: boolean = true
  constructor(private toastr: ToastrShowService,
    public dialogRef: MatDialogRef<UploadIPDMpdalComponent>,
    private formBuilder: FormBuilder,
    private _sharedModulService: SharedModuleService,
  ) {
    this.modalForm = this.formBuilder.group({});
    this.userID = _sharedModulService.riskClientId ;
  }

  ngOnInit(): void {
    this.modalForm = this.formBuilder.group({
      attachmentFile: ['', Validators.required],
    })
  }
  close() {
    this.dialogRef.close();
  }
  onChange(event: any) {
    this.file = event.target.files[0];
    this.formData = new FormData();
    this.formData.append("file", this.file)
    this.formData.append("userId", this.userID)
  }

  onSubmit() {
    if (this.modalForm.invalid) {
      this.submitted = true;
      return
    }
    this.submitted = true;
    this._sharedModulService.uploadIPD(this.formData).subscribe(data => {
      if (data.message == "File uploaded") {
        this.toastr.showSuccess("File Uploaded Successfully!")
        this.dialogRef.close();
      }
    }, error => {
      if (error.status == 409) {
        this.toastr.showError('File format should be PDF only');
      }
    }
    )
  }

  onClose1() {
    this.dialogRef.close();
  }
}
