import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { BrokerModuleService } from '../../service/broker-module.service';

@Component({
  selector: 'app-advisory-dashboard',
  templateUrl: './advisory-dashboard.component.html',
  styleUrls: ['./advisory-dashboard.component.css'],
  providers: [TitleCasePipe]
})
export class AdvisoryDashboardComponent implements OnInit {
  modalForm: FormGroup;
  clientsList: any;
  riskProfile: string = 'Risk Profile';
  userId: string = '';
  riskGenerated?: boolean = true;
  isReadonly: boolean = true;
  saveAdviceData:any;
  convertedRiskProfile:string = 'Risk Profile';

  constructor(private formBuilder: FormBuilder,
    private toastr: ToastrShowService,
    private brokerModuleService: BrokerModuleService,
    private router: Router,
    private authUserService: AuthUserService,
    private titlecasePipe:TitleCasePipe) {
    this.modalForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.authUserService.getUserDetailBehaviorSubject().subscribe(item => {
      if (item) {
        this.userId = item.userId;
      }
    });
    this.modalForm = this.formBuilder.group({
      clientId: ['', Validators.required],
      invAmt: ['',[Validators.required,this.amountValidation]],
    });
    this.getClientList();
  }

  public amountValidation(control: AbstractControl): ValidationErrors | null {
    const amount=control.value;

    if (amount==null || amount=='') {
      return { amountValidation: true, requiredValue: 'Amount is required' };
    }

    if(amount<100000){
      return { amountValidation: true, requiredValue: 'Amount should not be less than 1 lakh' };
    }

    if ((amount % 100000)!=0) {
      return { amountValidation: true, requiredValue: 'Amount should be multiple of 1 lakh' };
    }

    return null;
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

  getClientRiskProfileDetails(clientId: string) {
    this.brokerModuleService.getClientRiskProfile(this.modalForm.value.clientId).subscribe(data => {
      if (data) {
        this.riskProfile = data.message;
        this.riskGenerated = true;
        this.convertedRiskProfile = this.titlecasePipe.transform(this.riskProfile);
        if (this.riskProfile == 'Risk Profile Not Generated.') {
          this.riskGenerated = false;
        }
      }
    }, err => {
      this.toastr.showError("Error in loading data");
    });
  }
  onSubmit() {
    if (this.modalForm.invalid)
      return;

    localStorage.setItem('amount',this.modalForm.value.invAmt);

    this.brokerModuleService.saveAdvice(this.modalForm.value.clientId, this.userId, this.modalForm.value.invAmt, this.riskProfile).subscribe(data => {
      if (data) {
        this.saveAdviceData=data;
        localStorage.setItem('saveAdviceResponse', JSON.stringify(this.saveAdviceData));
        this.router.navigate(['/advisory-fund-list']);
      }
    }, err => {
      this.toastr.showError("Error in loading data");
    });

  }

}

