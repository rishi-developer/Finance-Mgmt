import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-password-confirmation-modal',
  templateUrl: './update-password-confirmation-modal.component.html',
  styleUrls: ['./update-password-confirmation-modal.component.css']
})
export class UpdatePasswordConfirmationModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UpdatePasswordConfirmationModalComponent>) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
    window.location.reload();

  }

}
