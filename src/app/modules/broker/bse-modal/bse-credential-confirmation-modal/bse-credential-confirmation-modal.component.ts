import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bse-credential-confirmation-modal',
  templateUrl: './bse-credential-confirmation-modal.component.html',
  styleUrls: ['./bse-credential-confirmation-modal.component.css']
})
export class BseCredentialConfirmationModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<BseCredentialConfirmationModalComponent>,
    private router:Router,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
  }
  onClose() {
    this.dialogRef.close();
    if(this.data.transactionType=='Fresh'){
    if (this.data.selectedTransaction == 'SIP' || this.data.selectedTransaction == 'Purchase'){
      this.router.navigate(['/fresh/transaction',this.data.selectedTransaction]);
    }
    else {
      this.router.navigate(['/fresh/transaction/STP-SWP',this.data.selectedTransaction]);
    }
  }
  else if(this.data.transactionType=='Additional'){
    if (this.data.selectedTransaction == 'Redemption' || this.data.selectedTransaction == 'Purchase'){
    this.router.navigate(['/transaction',this.data.selectedTransaction],{ queryParams: { fundName: this.data.fundName , clientId:this.data.clientId}});
    }
    else if(this.data.selectedTransaction == 'SIP'){
      this.router.navigate(['/fresh/transaction',this.data.selectedTransaction],{ queryParams: { fundName: this.data.fundName , transactionType:'Additional' , schemeCode:this.data.schemeCode}});
    }
    else if(this.data.selectedTransaction=='STP' || this.data.selectedTransaction=='SWP' || this.data.selectedTransaction=='Switch out'){
      this.router.navigate(['/fresh/transaction/STP-SWP',this.data.selectedTransaction],{ queryParams: { fundName: this.data.fundName , transactionType:'Additional' , schemeCode:this.data.schemeCode}});
    }
  }
  }

}
