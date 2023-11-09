import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { ReportsModuleService } from '../service/reports-module.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { formatDate } from '@angular/common';

import {
  ClientResponse,
  TransactionResponse,
} from '../modals/transaction.model';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  modalForm: FormGroup;
  financialOptions = ['Mutual Funds', 'Stocks'];
  reportDurationTypes = ['1 Month', '6 Month', 'Custom'];
  mainHeadingValue: string = 'Transactions';
  today = new Date();
  userId!: string;
  setClientList : any;

  constructor(
    private formBuilder: FormBuilder,
    private sharedModuleService: SharedModuleService,
    private router: Router,
    private toastr: ToastrShowService,
    private reportService: ReportsModuleService
  ) {
    (this.modalForm = this.formBuilder.group({})),
      this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);
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
   * Create to calculate the date
   * @param date today's date
   * @param months prior than today's date
   * @returns date prior to today's date
   */
  calculateDate(date: Date, months: number) {
    date.setMonth(date.getMonth() - months);
    return date;
  }

  /**
   * Created to set the date on basis of selected duration type
   * @param durationValue selected duration value
   */
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

  /**
   * created when data is submitted
   */
  submit() {
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
        let obj = {
          clientUserId: this.modalForm.value['investor'],
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

        this.reportService.transactionStartDate = obj.startDate;
        this.reportService.transactionEndDate = obj.endDate;
        this.reportService.clientUserId = obj.clientUserId;
        this.reportService.getClientandRMDetails(obj.clientUserId).subscribe((res: any) => {
          if(res){
            this.reportService.clientandRMDetails = res;
          }
        })
        this.reportService.getNSEvalue().subscribe((res: any) => {
          if(res){
            this.reportService.nseValue = res;
          }
        })
        this.reportService.transactionSummaryReport(obj).subscribe(
          (res: TransactionResponse) => {
            this.reportService.transactionData = res;
            this.router.navigate(['./transaction-summary-report']);
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

  /**
   * To reset the form
   */
  reset() {
    this.modalForm.reset();
  }
}
