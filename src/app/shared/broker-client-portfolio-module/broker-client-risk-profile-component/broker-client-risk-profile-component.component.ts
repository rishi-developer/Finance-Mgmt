import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';

interface Question {
  text: string;
  options: string[];
  selectedOption: string | null;
}

@Component({
  selector: 'app-broker-client-risk-profile-component',
  templateUrl: './broker-client-risk-profile-component.component.html',
  styleUrls: ['./broker-client-risk-profile-component.component.css'],
})
export class BrokerClientRiskProfileComponentComponent implements OnInit {
  questionSet: any;
  clientId: any;
  role: any;
  userId!: string;
  mainHeadingValue: string = 'Risk Profile';
  constructor(
    private formBuilder: FormBuilder,
    private sharedModuleService: SharedModuleService,
    private route: ActivatedRoute,
    private router: Router,
    private authUserService: AuthUserService
  ) {
    this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);
  }

  ngOnInit(): void {
    this.sharedModuleService
      ?.getRiskProfileQUestions()
      .subscribe((data: any) => {
        if (data) {
          this.questionSet = data;
        }
      });

    this.route.paramMap.subscribe((params: any) => {
      this.clientId = params.get?.('id');
      if (this.clientId === null || this.clientId === undefined) {
        this.clientId = this.sharedModuleService.riskClientId;
      }
      this.sharedModuleService.riskClientId = this.clientId;
    });
    this.authUserService.getUserDetailBehaviorSubject().subscribe((data) => {
      if (data) {
        this.role = data.newRoleFinal?.roleDescription;
        this.userId = data.userId;
        if (this.role === 'CLIENT') {
          this.clientId = data.userId;
        }
      }
    });
    this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);
  }

  resetForm() {
    this.questionSet.forEach((question: { selectedOption: null }) => {
      question.selectedOption = null;
    });
  }

  submitForm() {
    // if (this.questionnaireForm.valid) {
    const responses = this.questionSet.map(
      (question: {
        questionId: any;
        questionText: any;
        selectedOption: any;
      }) => {
        return {
          questionId: question.questionId,
          answeroptionId: question.selectedOption.answerId,
          score: question.selectedOption.score,
        };
      }
    );
    const payload = {
      userId: this.clientId,
      riskProfileQA: responses,
    };

    this.sharedModuleService
      .submitRiskProfile(payload)
      .subscribe((res: any) => {
        if (res) {
          this.router.navigate(['/risk-profile-result']);
        }
      });
  }

  onOptionSelected(question: Question, selectedOption: string) {
    question.selectedOption = selectedOption;
  }
}
