import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {
   amountModal :any;
   transTypeModal :any
   clientName:any
   FundCode:any;
   mode: any;
   installmentAmount : any;
   WithdrwalUnits : any;
   FundCode2: any;
  //  switchAmount?:string;
  SwitchFieldValue?:string;
   unitFlagValue?:string;
   clientEmail:string='';
  constructor(public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    private router:Router,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.amountModal = localStorage.getItem('amount') as string;
      this.transTypeModal = localStorage.getItem('transtype')as string;
      this.clientName = localStorage.getItem('ClientType')as string;
      this.FundCode = localStorage.getItem('schemeType')as string;
      this.mode = localStorage.getItem('modeType')as string;
      this.installmentAmount = localStorage.getItem('installAmountType') as string;
      this.WithdrwalUnits = localStorage.getItem('WithUnits')as string;
      this.FundCode2 = localStorage.getItem('fund2codeType')as string;
      // this.switchAmount= localStorage.getItem('SwitchAmount')as string;
      this.SwitchFieldValue= localStorage.getItem('SwitchFieldValue')as string;
      this.unitFlagValue= localStorage.getItem('UnitFlagValue')as string;
      this.clientEmail= localStorage.getItem('clientEmail')as string;
    }

  ngOnInit(): void {

  }
  onClose() {
    this.dialogRef.close();
  }

}
