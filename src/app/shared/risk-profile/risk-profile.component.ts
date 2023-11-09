import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BrokerModuleService } from 'src/app/modules/broker/service/broker-module.service';
import { catchError, concatMap, switchMap, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

export interface RiskProfileQA {
  questionId: number | undefined;
  answeroptionId: number | undefined;
  score: number | undefined;
}

@Component({
  selector: 'app-risk-profile',
  templateUrl: './risk-profile.component.html',
  styleUrls: ['./risk-profile.component.css'],
})
export class RiskProfileComponent implements OnInit {
  clientData: any;
  brokerId: string = '';
  riskForm: FormGroup;
  questionsdata: any;
  clientsList: any;
  userId: any;
  outputArray: any = [];
  output: RiskProfileQA = {
    questionId: undefined,
    answeroptionId: undefined,
    score: undefined,
  };
  constructor(
    private _sharedModulService: SharedModuleService,
    private router: Router,
    private brokerModuleService: BrokerModuleService,
    private toastr: ToastrShowService,
    private formBuilder: FormBuilder
  ) {
    this.riskForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    console.log('test');
    this.riskForm = this.formBuilder.group({
      clientName: ['test', Validators.required],
      1: ['', Validators.required],
      2: ['', Validators.required],
      3: ['', Validators.required],
      4: ['', Validators.required],
      5: ['', Validators.required],
      6: ['', Validators.required],
      7: ['', Validators.required],
      8: ['', Validators.required],
    });
    this.getClientList();

    this._sharedModulService.getRiskProfileQuestions().subscribe(
      (data) => {
        if (data) {
          this.questionsdata = data || [];
        }
      },
      () => {
        this.toastr.showError(
          'Error in loading the questions.Please try again after sometime'
        );
      }
    );
  }
  // getClientList() {
  //   this._sharedModulService
  //     .getBrokerClientList1('USR_1', this.brokerId)
  //     .subscribe((data) => {
  //       if (data) {
  //         this.clientData = data;
  //       }
  //     },() => {
  //       this.toastr.showError('Error in loading data');
  //     });
  // }

  /**
   * To get the list of all the clients
   */
  getClientList() {
    this.brokerModuleService.getClientsList().subscribe(
      (data) => {
        if (data) {
          // ! need to check its data type
          this.clientsList = data;
        }
      },
      () => {
        this.toastr.showError('Error in loading data');
      }
    );
  }

  /**
   * To reset the form
   */
  onReset() {
    this.riskForm.reset();
  }

  /**
   * Created to get the selected question value and question
   * @param questionId having value questionId of question
   * @param optionSelected having selected option value
   */
  getRadioButtonValue(
    questionId: number,
    optionSelected: { answerId: number; answerText: string; score: number }
  ) {
    let flag = true;
    if (this.outputArray?.length) {
      this.outputArray.map((elem: RiskProfileQA) => {
        if (questionId === elem.questionId) {
          flag = false;
          elem.answeroptionId = optionSelected.answerId;
          elem.score = optionSelected.score;
        }
        return elem;
      });
    }
    if (flag) {
      this.output = {
        questionId: questionId,
        answeroptionId: optionSelected.answerId,
        score: optionSelected.score,
      };
      this.outputArray.push(this.output);
    }
  }

  /**
   * Created when we want to submit all data
   */
  onSubmit() {
    this.riskForm.value.clientName = 'test';
    if (this.riskForm.value.clientName == '') {
      window.scrollTo(0, 0);
      this.toastr.showError('Client Name is required');
    } else if (this.outputArray.length != this.questionsdata.length) {
      window.scrollTo(0, 0);
      this.toastr.showError('All questions are required');
    } else {
      this.userId = this.riskForm.value.clientName;
      this._sharedModulService
        .sendRiskProfileScore(this.outputArray, this.userId)
        .pipe(
          concatMap(() =>
            this._sharedModulService.getRiskProfileResult(this.userId)
          )
        )
        .subscribe(
          (res: { message: string }) => {
            if (res?.message) {
              let profilleresult = res.message;
              localStorage.setItem('profilescore', profilleresult);
              localStorage.setItem('userId', this.userId);
              this.router.navigate(['/risk-profile-result']);
            }
          },
          (error) => {
            this.toastr.showError('Please try again');
          }
        );
    }
  }
}
