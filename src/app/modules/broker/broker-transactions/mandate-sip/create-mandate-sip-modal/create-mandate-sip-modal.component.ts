import { SharedModuleService } from './../../../../../common-services/shared-module-service/shared-module.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { BrokerTransactionsService } from '../../services/broker-transactions.service';
import { mandateTypeList } from '../mandate-sip.model';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-create-mandate-sip-modal',
  templateUrl: './create-mandate-sip-modal.component.html',
  styleUrls: ['./create-mandate-sip-modal.component.css'],
})
export class CreateMandateSipModalComponent implements OnInit {
  modalForm: FormGroup;
  userId: string = '';
  mandateTypeList = mandateTypeList;
  clientList: any;
  filteredUccArray: any[] = [];
  bankAccountDetails: any[] = [];
  bankName: string = '';
  ifscCode: string = '';
  accountType: string = '';
  filteredClientArray: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<CreateMandateSipModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private brokerTransactionsService: BrokerTransactionsService,
    private authUserService: AuthUserService,
    private sharedModuleService: SharedModuleService,
    private toastr: ToastrShowService
  ) {
    this.modalForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.authUserService.getUserDetailBehaviorSubject().subscribe((data) => {
      if (data) this.userId = data.userId;
    });

    this.modalForm = this.formBuilder.group({
      ifscCode: [''],
      accountNo: ['', Validators.required],
      startDate: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      mandateType: ['', Validators.required],
      checkbox: [false],
      endDate: [''],
      accountType: [''],
      bankName: [''],
      clientName: ['', Validators.required],
      clientCode: ['', Validators.required],
    });

    this.setValidations();
    this.getClientList();
  }

  setValidations() {
    if (this.modalForm.value.checkbox) {
      this.modalForm.controls['endDate'].setValidators(Validators.required);
    } else {
      this.modalForm.controls['endDate'].clearValidators();
      this.modalForm.controls['endDate'].updateValueAndValidity();
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  getClientList() {
    this.brokerTransactionsService.getClientsList('', this.userId).subscribe(
      (data) => {
        if (data) {
          this.clientList = data;
          this.filteredClientArray = [];
          let clientList = [...this.clientList];
          let clientCodeBSE: any[] = [null];
          for (var i = 0; i < clientCodeBSE.length; i++) {
            var list = clientList.filter(
              (data) => data.clientCodeBSE != clientCodeBSE[i]
            );
            list.forEach((data) => {
              this.filteredClientArray.push(data);
            });
          }
        }
      },
      (err) => {
        this.toastr.showError('Error in loading data');
      }
    );
  }

  getUcc(clientCode: string) {
    this.getAllBankDetails(clientCode[1]);
    this.filteredUccArray = [];
    let clientList = [...this.clientList];
    let clientId: any[] = [clientCode[0]];
    for (var i = 0; i < clientId.length; i++) {
      var list = clientList.filter((data) => data.clientCodeBSE == clientId[i]);
      list.forEach((data) => {
        this.filteredUccArray.push(data);
      });
    }
  }

  getAllBankDetails(clientCode: string) {
    this.sharedModuleService.getBankData(clientCode).subscribe(
      (data) => {
        if (data) {
          this.bankAccountDetails = data;
        }
      },
      (err) => {
        this.toastr.showError('Error in loading data');
      }
    );
  }

  getSelectedBankDetails(accountNo: string) {
    let bankDetailsList = [...this.bankAccountDetails];
    let accountNumber: any[] = [accountNo];
    for (var i = 0; i < accountNo.length; i++) {
      var list = bankDetailsList.filter(
        (data) => data.accountNo == accountNumber[i]
      );
      list.forEach((data) => {
        this.bankName = data.bankName;
        this.ifscCode = data.ifscCode;
        this.accountType = data.accountType;
        this.modalForm.value.accountType = this.accountType;
      });
    }
  }

  onSubmit() {
    if (this.modalForm.invalid) return;

    this.modalForm.value.ifscCode = this.ifscCode;
    this.modalForm.value.bankName = this.bankName;

    if (this.modalForm.value.checkbox) {
      this.modalForm.value.endDate = moment(
        this.modalForm.value.endDate
      ).format('DD/MM/YYYY');
    } else {
      var startDate = new Date(this.modalForm.value.startDate);
      var year = startDate.getFullYear();
      var month = startDate.getMonth();
      var day = startDate.getDate();
      var endDate = new Date(year + 29, month, day);
      this.modalForm.value.endDate = moment(endDate).format('DD/MM/YYYY');
    }

    if (this.accountType == 'SAVINGS') {
      this.modalForm.value.accountType = 'SB';
    } else if (this.accountType == 'CURRENT') {
      this.modalForm.value.accountType = 'CB';
    } else if (this.accountType == 'NRE') {
      this.modalForm.value.accountType = 'NE';
    } else if (this.accountType == 'NRO') {
      this.modalForm.value.accountType = 'NO';
    } else {
      this.modalForm.value.accountType = this.accountType;
    }

    this.modalForm.value.startDate = moment(
      this.modalForm.value.startDate
    ).format('DD/MM/YYYY');

    delete this.modalForm.value.clientName;
    delete this.modalForm.value.bankName;

    this.brokerTransactionsService
      .createMandate(this.modalForm.value, this.userId, this.bankName)
      .subscribe(
        (data) => {
          if (data) {
            let message = data.message.split('|');
            if (message[0] == '100') {
              this.toastr.showSuccess('Mandate Registration done successfully');
              this.sharedModuleService.sendUpdate(true);
              this.onClose();
            } else {
              this.toastr.showError(message[1]);
            }
          }
        },
        (err) => {
          this.toastr.showError('Error in creating mandate');
        }
      );
  }
}
