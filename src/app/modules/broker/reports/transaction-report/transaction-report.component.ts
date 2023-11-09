import { ReportsModuleService } from './../service/reports-module.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { BrokerModuleService } from '../../service/broker-module.service';
import * as moment from 'moment';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-transaction-report',
  templateUrl: './transaction-report.component.html',
  styleUrls: ['./transaction-report.component.css']
})
export class TransactionReportComponent implements OnInit {
  modalForm: FormGroup;
  viewModeOptions = ['PDF', 'Email', 'OnScreen'];
  action: string = 'Submit';
  // dataSourceOptions = ['On platform', 'Outside platform', 'Show both'];
  reportDurationOptions: any;
  clientsList: any;
  userId: string = '';
  startDate: any;
  endDate: any;
  date?: Date;
  currentYear?: number;
  previousYear?: number;
  previousYear2?: number;
  previousFinancialYear?: string;
  previousFinancialYear2?: string;
  convertedStartTimeFormat?: any;
  convertedEndTimeFormat?: any;
  currentDate = new Date();
  fileLink?: any;
  fileDataPresent?: string;
  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;
  textValue:string='';

  constructor(private formBuilder: FormBuilder,
    private brokerModuleService: BrokerModuleService,
    private toastr: ToastrShowService,
    private authUserService: AuthUserService,
    private reportModuleService: ReportsModuleService,
    public dialog: MatDialog,
    private router:Router,) {
    this.modalForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.authUserService.getUserDetailBehaviorSubject().subscribe(item => {
      if (item) {
        this.userId = item.userId;
      }
    });
    this.modalForm = this.formBuilder.group({
      viewMode: ['', Validators.required],
      // dataSource: ['', Validators.required],
      reportDuration: ['', Validators.required],
      clientId: ['', Validators.required],
      startDate: [''],
      endDate: ['']
    });
    this.getClientList();
    this.calculateYear();
  }

  public dateRangeValidator: ValidatorFn = (): {
    [key: string]: any;
  } | null => {
    let invalid = false;
    const start_date = this.modalForm && moment(this.modalForm.value.startDate).format('YYYY-MM-DD');
    const end_date = this.modalForm && moment(this.modalForm.value.endDate).format('YYYY-MM-DD');
    if (start_date && end_date) {
      invalid = new Date(start_date).valueOf() > new Date(end_date).valueOf();
    }
    return invalid ? { invalidRange: { start_date, end_date } } : null;
  };

  calculateYear() {
    this.currentYear = new Date().getFullYear();
    const currentMonth= new Date().getMonth();
    if(currentMonth>=3){
      this.previousYear = this.currentYear - 1;
      this.previousYear2 = this.previousYear - 1;
    }
    else if(currentMonth<3){
      this.currentYear=this.currentYear - 1;
      this.previousYear = this.currentYear - 1;
      this.previousYear2 = this.previousYear - 1;
    }
    this.previousFinancialYear = "FY " + this.previousYear + "-" + this.currentYear;
    this.previousFinancialYear2 = "FY " + this.previousYear2 + "-" + this.previousYear;
    this.reportDurationOptions = ['Custom', this.previousFinancialYear, this.previousFinancialYear2]
  }

  setValidation() {
    if (this.modalForm.value.reportDuration == 'Custom') {
      this.modalForm.controls["startDate"].setValidators(Validators.required);
      this.modalForm.controls["endDate"].setValidators(Validators.required);
    }
    else {
      this.modalForm.controls["startDate"].clearValidators();
      this.modalForm.controls["endDate"].clearValidators();
      this.modalForm.controls["startDate"].updateValueAndValidity();
      this.modalForm.controls["endDate"].updateValueAndValidity();
    }
  }

  getClientList() {
    this.brokerModuleService.getClientsList().subscribe(data => {
      if (data) {
        this.clientsList = data;
      }
    }, err => {
      this.toastr.showError("Error in loading data");
    });
  }
  submitAction(action: string) {
    this.action = action;
    if (this.action == 'PDF') {
      this.action = 'Download';
    }
    else if (this.action == 'Email') {
      this.action = 'Send Email';
    }
    else {
      this.action = 'View';
    }
  }

  onReset(){
    window.location.reload();
  }

  onSubmit() {
    if (this.modalForm.invalid)
      return;

    if (this.modalForm.value.reportDuration == 'Custom') {
      this.modalForm.value.startDate = moment(this.modalForm.value.startDate).format(
        "DD/MM/YYYY" + " " + "00:00:00"
      );
      this.modalForm.value.endDate = moment(this.modalForm.value.endDate).format(
        "DD/MM/YYYY" + " " + "11:59:59"
      );
    }
    else if (this.modalForm.value.reportDuration == this.previousFinancialYear) {
      this.modalForm.value.startDate = '01' + "/" + '04' + "/" + this.previousYear + " " + "00:00:00";
      this.modalForm.value.endDate = '31' + "/" + "03" + "/" + this.currentYear + " " + "11:59:59"
    }
    else {
      this.modalForm.value.startDate = '01' + "/" + '04' + "/" + this.previousYear2 + " " + "00:00:00";
      this.modalForm.value.endDate = '31' + "/" + "03" + "/" + this.previousYear + " " + "11:59:59";
    }

    // if(this.modalForm.value.viewMode!='OnScreen'){
    this.reportModuleService.transactionReport(this.userId, this.modalForm.value.clientId, this.modalForm.value.viewMode,this.modalForm.value.startDate, this.modalForm.value.endDate).subscribe(data => {
      if (data) {
        this.fileLink = data.message;
        this.fileDataPresent = data.httpStatus;
        if (this.fileDataPresent != 'CONFLICT') {
          this.textValue='Report has been generated successfully';
          if (this.action == 'Download') {
            const a = document.createElement('a')
            a.href = this.fileLink
            a.download = this.fileLink.split('/').pop()
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
          }
          else if(this.action=='View'){
            this.textValue='Report has been generated successfully';
            window.open(this.fileLink,'_blank');
          }
          else{
            this.textValue='Report has been generated successfully and shared via email';
          }
          const dialogRef = this.dialog.open(ConfirmationModalComponent, {
            width: '472px',
            data: { headingValue: 'Report Generated', textValue: this.textValue, buttonValue: 'Return to Home', modalType: 'report-generation' },
            panelClass: 'confirmation-modal'
          });
          dialogRef.afterClosed().subscribe(result => {
            setTimeout(() => this.formGroupDirective.resetForm(), 200);
            this.action='Submit';
          });
        }
        else {
          const dialogRef = this.dialog.open(ConfirmationModalComponent, {
            width: '472px',
            data: { headingValue: 'No Details Found!', textValue: 'No transaction has taken place in selected duration', buttonValue: 'Try Again', modalType: 'no-data-found-modal' },
            panelClass: 'confirmation-modal'
          });

        }
      }
    }, err => {
      this.toastr.showError("Error in loading data");
    });
  // }
  // else{
  //   this.router.navigate(['transaction-report-view'], { queryParams: { clientId: this.modalForm.value.clientId , startDate: this.modalForm.value.startDate , endDate:this.modalForm.value.endDate }});
  // }
}
}

