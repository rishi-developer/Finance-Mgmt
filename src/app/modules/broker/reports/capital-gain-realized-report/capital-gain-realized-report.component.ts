import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { TransactionResponse } from '../modals/transaction.model';
import { ReportsModuleService } from '../service/reports-module.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';


@Component({
  selector: 'app-capital-gain-realized-report',
  templateUrl: './capital-gain-realized-report.component.html',
  styleUrls: ['./capital-gain-realized-report.component.css'],
})
export class CapitalGainRealizedReportComponent implements OnInit {
  mainHeadingValue: string = ' Capital Gain Realized Report';
  financialOptions = ['Mutual Funds', 'Stocks'];
  reportDurationTypes = ['1 Month', '6 Month', 'Custom'];
  setClientList : any;
  modalForm: FormGroup;
  
  today = new Date();
  constructor(
    private sharedModuleService: SharedModuleService,
    private formBuilder: FormBuilder,
    private reportService : ReportsModuleService,
    private toastr: ToastrShowService,
    private router : Router
  ) {
    this.sharedModuleService.setNavbarHeading(this.mainHeadingValue),
      (this.modalForm = this.formBuilder.group({}));
  }
  ngOnInit(): void {
    this.setClientList = this.reportService.getClientsList();

    this.modalForm = this.formBuilder.group({
      investor: ['', Validators.required],
      financialInstruments: ['', Validators.required],
      reportDuration: ['', Validators.required],
      startDate: [''],
      endDate: [''],
    });
  }
/**
  * Created to set the date on basis of selected duration type
  * @param durationValue selected duration value
  */
 calculateDate(date: Date, months: number) {
  date.setMonth(date.getMonth() - months);
  return date;
}

 selectReportDuration(durationValue: string) {
   switch (durationValue) {
     case this.reportDurationTypes[0]:
       this.modalForm.value['startDate'] = this.today;
       this.modalForm.value['endDate'] = this.calculateDate(new Date(), 1);
       break;
     case this.reportDurationTypes[1]:
       this.modalForm.value['startDate'] = this.today;
       this.modalForm.value['endDate'] = this.calculateDate(new Date(), 6);
       break;
     default:
       break;
   }
 }

  onReset() {
    this.modalForm.reset();
  }

  submit() {
    // if ((this.reportService.reportData.type).toLocaleLowerCase() === 'summary') {
    //   this.router.navigate(['./capital-gain-summary-report']);
    // } else {
    //   this.router.navigate(['./capital-gain-detailed-report']);
    // }



    if (
      this.modalForm.controls['reportDuration'].value ===
        this.reportDurationTypes[2] &&
      (!this.modalForm.controls['startDate'].value ||
        !this.modalForm.controls['endDate'].value)
    ) {
      if (!this.modalForm.controls['startDate'].value) {
        this.modalForm.controls['startDate'].setErrors({ required: true });
      }
      if (!this.modalForm.controls['endDate'].value) {
        this.modalForm.controls['endDate'].setErrors({ required: true });
      }
    } else {
      this.modalForm.controls['startDate'].setErrors(null);
      this.modalForm.controls['endDate'].setErrors(null);
      if (this.modalForm.valid) {

        
        let obj:any =
         {
          userId: this.modalForm.value['investor'],
          financialInstruments: this.modalForm.value['financialInstruments'],
          startDate: formatDate(
            this.modalForm.value['startDate'],
            'yyyy-MM-dd',
            'en-US'
          ),
          endDate: formatDate(
            this.modalForm.value['endDate'],
            'yyyy-MM-dd',
            'en-US'
          ),
        };

        // {
        //   userId:"USR_24",
        //   financialInstruments:"mutual funds",
        //   startDate:"2022/01/01",
        //   endDate:"2023/07/14"
        //   }
          
        this.reportService.transactionStartDate = obj.startDate;
        this.reportService.transactionEndDate = obj.endDate;
        this.reportService.clientUserId = obj.userId;
        this.reportService.getClientandRMDetails(obj.userId).subscribe((res: any) => {
          if(res){
            this.reportService.clientandRMDetails = res;
          }
        })
        this.reportService.getNSEvalue().subscribe((res: any) => {
          if(res){
            this.reportService.nseValue = res;
          }
        })


        this.reportService.capitalGainReport(obj).subscribe(
          (res: TransactionResponse) => {
            this.reportService.capitalGainData = res;


            if ((this.reportService.reportData.type).toLocaleLowerCase() === 'summary') {
                this.router.navigate(['./capital-gain-summary-report']);
              } else {
                this.router.navigate(['./capital-gain-detailed-report']);
              }     
            // this.router.navigate(['./transaction-summary-report']);
          },
          (error: HttpErrorResponse) => {
            this.toastr.showError(
              error?.error ?? 'Error in loading Transaction Data'
            );
          }
        );
      }
    }

  }
}
