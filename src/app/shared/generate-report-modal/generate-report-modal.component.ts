import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-generate-report-modal',
  templateUrl: './generate-report-modal.component.html',
  styleUrls: ['./generate-report-modal.component.css']
})
export class GenerateReportModalComponent implements OnInit {
  modalForm: FormGroup;
  today = new Date()
  sixMonthsAgoDate =new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 6,
    new Date().getDate()
  );

  currentDate = new Date()

  reportTypeOptions = ['Portfolio Valuation', 'Portfolio Performance','Capital Gain Realized','Capital Gain Unrealized']
 
  constructor( public dialogRef: MatDialogRef<GenerateReportModalComponent>,
    private formBuilder: FormBuilder,
    
    ) {this.modalForm = this.formBuilder.group({}); 
  }

  ngOnInit(): void {
    this.modalForm = this.formBuilder.group({
    reportType: ['', Validators.required],
    startDate: [this.sixMonthsAgoDate, Validators.required],
    endDate: [ this.currentDate ,Validators.required],
    });
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


  onClose() {
    this.dialogRef.close();
  }

onSubmit(){
  if(this.modalForm.invalid){
    return
  } 
  
}

}
