import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ValidatorFn} from '@angular/forms';
import * as moment from 'moment';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';

@Component({
  selector: 'app-portfolio-performance-report',
  templateUrl: './portfolio-performance-report.component.html',
  styleUrls: ['./portfolio-performance-report.component.css']
})
export class PortfolioPerformanceReportComponent implements OnInit {
  mainHeadingValue: string = 'Portfolio Performance Report';
  modalForm: FormGroup;
  financialOptions = ['Mutual Funds', 'Stocks']
  viewModeOptions = ['PDF', 'Email', 'OnScreen'];
  action: string = 'Submit';
  productOptions = ['Mutual Fund', 'Share & Bond'];
  reportTypeOptions = ["Datailed",'Summary'];
  groupByOptions = ['Folio', 'Scheme','Investor']
  reportDurationOptions = ['Custom', 'Last 6 months', 'Last 1 year']
  currentDate = new Date();
  sixmonthsago? : any;
  oneyearago? : any;
  dataOptionsList = ['All','Equity','Liquid and ultra short','debt','Hybird','Arbitrage']
  constructor(private sharedModuleService: SharedModuleService,
    private formBuilder: FormBuilder) 
  {this.sharedModuleService.setNavbarHeading(this.mainHeadingValue),
    this.modalForm = this.formBuilder.group({})}

  ngOnInit(): void {
    this.modalForm = this.formBuilder.group({
      // viewMode: ['', Validators.required],
      investor: ['', Validators.required],
      financialInstruments : ['', Validators.required],
      // product: ['', Validators.required],
      // reportType :[''],
      reportDuration: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      // groupBye:[''],
      // dataOptions:['']
    });
    this.calculateDates();
  }


  // submitAction(action: string) {
  //   this.action = action;
  //   if (this.action == 'PDF') {
  //     this.action = 'Download';
  //   }
  //   else if (this.action == 'Email') {
  //     this.action = 'Send Email';
  //   }
  //   else {
  //     this.action = 'View';
  //   }
  //   this.setValidations();
  // }

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
  
  // setValidations(){
  //   if(this.action == 'Download' || this.action == 'Send Email' ){
  //    this.modalForm.controls["dataOptions"].setValidators(Validators.required);
  //    this.modalForm.controls["reportType"].setValidators(Validators.required);
  //    this.modalForm.controls["groupBye"].clearValidators();
  //    this.modalForm.controls["groupBye"].updateValueAndValidity();
  //   }
  //   else{
  //     this.modalForm.controls["groupBye"].setValidators(Validators.required);
  //     this.modalForm.controls["reportType"].clearValidators();
  //     this.modalForm.controls["reportType"].updateValueAndValidity();
  //     this.modalForm.controls["dataOptions"].clearValidators();
  //     this.modalForm.controls["dataOptions"].updateValueAndValidity();
  //   }
  // }

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
 

  calculateDates() {
  
    this.sixmonthsago = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 6,
      new Date().getDate()
    );

    this.oneyearago = new Date(
      new Date().getFullYear() -1,
      new Date().getMonth() ,
      new Date().getDate()
    );

  }
  onReset(){
    window.location.reload();
  }
  submit(){
  //   if (this.modalForm.invalid){
  // return
  //   }
    if(this.modalForm.value.reportDuration == 'Custom'){
      this.modalForm.value.startDate = moment(this.modalForm.value.startDate).format(
        "DD/MM/YYYY" + " " + "00:00:00"
      );
      this.modalForm.value.endDate = moment(this.modalForm.value.endDate).format(
        "DD/MM/YYYY" + " " + "11:59:59"
      );
    }
    else if (this.modalForm.value.reportDuration == "Last 6 months") {
      this.modalForm.value.startDate = moment (this.sixmonthsago).format(
        "DD/MM/YYYY" + " " + "00:00:00");
      this.modalForm.value.endDate = moment (this.currentDate).format(
        "DD/MM/YYYY" + " " + "11:59:59");
    }
    else {
      this.modalForm.value.startDate = moment (this.oneyearago).format(
        "DD/MM/YYYY" + " " + "00:00:00");
      this.modalForm.value.endDate = moment (this.currentDate).format(
        "DD/MM/YYYY" + " " + "11:59:59");
    }
    
    console.log(this.modalForm.value);
    
  }
  
  
}
