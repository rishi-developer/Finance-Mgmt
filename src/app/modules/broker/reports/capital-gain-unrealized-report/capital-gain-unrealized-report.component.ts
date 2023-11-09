import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';

@Component({
  selector: 'app-capital-gain-unrealized-report',
  templateUrl: './capital-gain-unrealized-report.component.html',
  styleUrls: ['./capital-gain-unrealized-report.component.css']
})
export class CapitalGainUnrealizedReportComponent implements OnInit {
  mainHeadingValue: string = ' Capiatl Gain Unrealized Report';
  modalForm: FormGroup;
  viewModeOptions = ['PDF', 'Email', 'OnScreen'];
  action: string = 'Submit';
  productOptions = ['Mutual Fund', 'Share & Bond'];
  reportTypeOptions = ["Datailed",'Summary']
  financialOptions = ['Mutual Funds', 'Stocks']
  constructor(private sharedModuleService: SharedModuleService,
    private formBuilder: FormBuilder) { this.sharedModuleService.setNavbarHeading(this.mainHeadingValue),
    this.modalForm = this.formBuilder.group({})}

  ngOnInit(): void {

    this.modalForm = this.formBuilder.group({
      // viewMode: ['', Validators.required],
      investor: ['',Validators.required ],
      // product: ['', Validators.required],
      // reportType :[''],
      financialInstruments:['', Validators.required]
    });
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
  // setValidations(){
  //   if(this.action == 'Download' || this.action == 'Send Email' ){
  //     this.modalForm.controls["reportType"].setValidators(Validators.required);
  //    }
  //    else{
  //      this.modalForm.controls["reportType"].clearValidators();
  //      this.modalForm.controls["reportType"].updateValueAndValidity();
  //    }
  // }


  
  onReset(){
    window.location.reload();
  }


  submit(){
    if (this.modalForm.invalid){
      return
    }
    else
    {
      
    }
  }
}
