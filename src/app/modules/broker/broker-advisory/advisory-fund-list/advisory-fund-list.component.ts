import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { BrokerModuleService } from '../../service/broker-module.service';

@Component({
  selector: 'app-advisory-fund-list',
  templateUrl: './advisory-fund-list.component.html',
  styleUrls: ['./advisory-fund-list.component.css'],
  providers: [TitleCasePipe]
})
export class AdvisoryFundListComponent implements OnInit {
  saveAdviceResponse:any;
  adviceFundsList:any;
  riskProfile?:string;
  adviceId?:string;

  constructor(private toastr: ToastrShowService,
    private brokerModuleService: BrokerModuleService,
    private router:Router,
    public dialog: MatDialog,
    private titlecasePipe:TitleCasePipe) { }

  ngOnInit(): void {
    this.saveAdviceResponse=JSON.parse(localStorage.getItem('saveAdviceResponse') || "[]");
    this.adviceFundsList=this.saveAdviceResponse.roboAdviceResopnseAdvisedFunds;
    this.riskProfile=this.titlecasePipe.transform(this.saveAdviceResponse.clientRiskProfile);
  }
  onSubmit(){
    this.brokerModuleService.sanctionAdvice(this.saveAdviceResponse).subscribe(data => {
      if (data) {
        this.adviceId=data.message;
        const dialogRef = this.dialog.open(ConfirmationModalComponent, {
          width: '600px',
          data: {headingValue: 'Advise Generated',textValue:'Advise has been generated with below mentioned details.', buttonValue: 'Return To Advisory',modalType:'broker-advisory',adviceId:this.adviceId,riskProfile:this.riskProfile},
        });
        dialogRef.afterClosed().subscribe(result => {
          this.router.navigate(['advisory']);
        });
      }
    }, err => {
      this.toastr.showError("Error in loading data");
    });
  }
}
