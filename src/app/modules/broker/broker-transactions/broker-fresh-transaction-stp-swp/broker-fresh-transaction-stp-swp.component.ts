import { SharedModuleService } from './../../../../common-services/shared-module-service/shared-module.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BrokerTransactionsService } from './../services/broker-transactions.service';
import { ActivatedRoute, Router } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  FormGroupDirective,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { FundListModalComponent } from '../fund-list-modal/fund-list-modal.component';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { BankAccount } from 'src/app/models/broker-admin';

@Component({
  selector: 'app-broker-fresh-transaction-stp-swp',
  templateUrl: './broker-fresh-transaction-stp-swp.component.html',
  styleUrls: ['./broker-fresh-transaction-stp-swp.component.css'],
})
export class BrokerFreshTransactionStpSwpComponent implements OnInit {
  mainHeadingValue: string = 'Transactions';
  modalForm: FormGroup;
  euinDeclarationOptions = ['Yes', 'No'];
  modeOfAction: string = '';
  modeOfTransactionOptions = ['Physical', 'CDSL Demat', 'NSDL Demat'];
  modeOfTransactionOptionsSIP = ['Physical', 'Demat'];
  DPTransactionMode = ['CDSL', 'NSDL', 'Physical'];
  actionOptions = ['No. of Units', 'Amount (₹)'];
  frequency = ['Daily', 'Weekly', 'Monthly', 'Quarterly'];
  firstOrderToday = ['Yes', 'No'];
  accounNoList: any;
  userId: any;
  clientData: any;
  clientMobileNumber: any;
  clientEmailId: any;
  clientBankAccNumber: any;
  brokerId: string = '';
  placeOrderMessage: any;
  orderNotPlacedMessage: any;
  isOrderPlaced: any;
  transactionType: string = '';
  fundsData: any;
  successfulOrderPlacedMessage: any;
  maxDate: any;
  minDate = new Date();
  selectedField: any;
  partnerId!: string;
  SchemeCodeFund1: any;
  SchemeCodeFund2: any;
  flag: boolean = false;
  amountVal: any;
  flagType?: string;
  selectedFundName?: string;
  selectedSchemeCode?: string;
  confirmationAmountType: any;
  holdingFundsList: any = {};
  euinList: any;
  folioNosList: any;
  clientEmail: string = '';
  clientPhoneNo: string = '';
  clientId?: any;
  folioNumber: string = '';
  clientCodeBSE: string = '';
  noOfInvestment: any;
  defaultBankAccount = '0';
  toSchemeCodeExist: boolean = false;

  @ViewChild('picker') datePicker!: MatDatepicker<Date>;
  @ViewChild('picker2') datePicker2!: MatDatepicker<Date>;
  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;
  clientName1: any;
  // firstEuin: any;
  fundSchemeCode: any;
  clientBalanceAmount: any;
  clientBalanceUnits: any;
  clientIDforBalance: any;
  role: string = '';
  euinNumber: string = '';
  combinedclientDetails: string = '';
  selectedFundDetails: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private _brokerTransactionsService: BrokerTransactionsService,
    private toastr: ToastrShowService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private authUserService: AuthUserService,
    private sharedModuleService: SharedModuleService
  ) {
    this.modalForm = this.formBuilder.group({});
    this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);
  }

  ngOnInit(): void {
    this.authUserService.getUserDetailBehaviorSubject().subscribe((data) => {
      if (data) this.userId = data.userId;
      this.role = data.newRoleFinal.roleDescription;
    });

    // this.authUserService.resetFormOnRedirect.subscribe(() => {
    //   this.formGroupDirective.resetForm();
    // });

    this.partnerId = localStorage.getItem('partner-Id') as unknown as string;

    this.route.paramMap.subscribe((params: any) => {
      this.transactionType = params.get?.('selectedAction');
      if (this.transactionType == 'STP') {
        this.modeOfAction = 'STP';
      } else if (this.transactionType == 'SWP') {
        this.modeOfAction = 'SWP';
      } else if (this.transactionType == 'Switch out') {
        this.modeOfAction = 'Switch out';
      }
    });
    this.route.queryParams.subscribe((queryparams) => {
      this.flagType = queryparams.transactionType;
      this.selectedFundName = queryparams.fundName;
      this.selectedSchemeCode = queryparams.schemeCode;
      this.selectedFundDetails =
        this.selectedSchemeCode + ' ' + this.selectedFundName;
      this.folioNumber = queryparams.folioNumber;
      this.fundSchemeCode = queryparams.schemeCode;
      this.clientIDforBalance = queryparams.clientId;
    });

    this.getEuinList();
    this.modalForm = this.formBuilder.group({
      transType: ['NEW'],
      buySellType: ['Fresh'],
      stptype: ['AMC'],
      transactionMode: ['Physical', Validators.required],
      clientCode: [''],
      // folioNo :['',[Validators.min(1),Validators.required]],
      folioNo: [''],
      startDate: [''],
      endDate: [''],
      remarks: [''],
      // remarks:['',Validators.required],
      firstOrderToday: [''],
      frequencyType: [''],
      euindeclaration: ['Y'],
      // euindeclaration:['',Validators.required],
      euinnumber: [''],
      fromBSESchemeCode: [''],
      toBSESchemeCode: [''],
      // noOfTransfers :[''],
      instAmount: [''],
      stpregNo: [''],
      instUnit: [''],
      intallmentAmount: [''],
      installmentUnits: [''],
      accountNumber: [''],
      kycSatus: [''],
      minRedeem: ['Yes'],
      allUnitsFlag: [''],
      switchAmount: [''],
      switchUnits: [''],
    });
    if (this.modeOfAction == 'Switch out') {
      this.setValidation('selectedSwitchField');
    } else {
      this.setValidation('Withdrawl Unit Field');
    }
    // this.getFundsList();
    if (this.modeOfAction == 'Switch out' && this.flagType == 'Additional') {
      this.getClientBalanceAmount();
    }

    if (this.flagType == 'Additional') {
      this.getClientList(localStorage.getItem('client-id'));
      this.clientId = localStorage.getItem('client-id');
      this.sharedModuleService.getBankData(this.clientId).subscribe(
        (data) => {
          if (data) {
            this.accounNoList = data;
            data.map((item: BankAccount) => {
              if (item.defaultBankFlag === 'Y') {
                this.defaultBankAccount = item.accountNo;
              }
            });
          }
        },
        (err) => {
          this.toastr.showError('Error in loading data');
        }
      );
    } else {
      this.getClientList();
    }

    if (this.modalForm.value.clientCode == '' && !this.flagType) {
      this.modalForm.controls['accountNumber'].disable();
    }
  }

  openCalender() {
    this.datePicker.open();
  }

  openCalender2() {
    this.datePicker2.open();
  }

  setValidation(fieldValue?: any) {
    if (this.role != 'RELATIONSHIP MANAGER') {
      this.modalForm.controls['euinnumber'].setValidators(Validators.required);
    }

    // if(this.modalForm.value.euindeclaration=='Yes'){
    //   this.modalForm.controls['euinnumber'].enable();
    // }
    // else if(this.modalForm.value.euindeclaration=='No'){
    //   this.modalForm.controls['euinnumber'].disable();
    // }
    if (
      (this.modalForm.value.allUnitsFlag == 'Yes' ||
        this.modalForm.value.allUnitsFlag == '') &&
      fieldValue == 'selectedSwitchField'
    ) {
      this.modalForm.controls['switchAmount'].disable();
      this.modalForm.controls['switchUnits'].disable();
    } else if (
      (this.modalForm.value.allUnitsFlag == 'No' && fieldValue != undefined) ||
      fieldValue == 'selectedSwitchField'
    ) {
      this.modalForm.controls['switchAmount'].enable();
      this.modalForm.controls['switchUnits'].enable();
      this.selectedField = fieldValue;
      if (fieldValue == 'Transfer Amount') {
        this.modalForm.controls['switchAmount'].setValidators([
          Validators.min(1),
          Validators.required,
        ]);
        this.modalForm.controls['switchUnits'].clearValidators();
        this.modalForm.controls['switchUnits'].updateValueAndValidity();
        if (
          this.modalForm.value.switchAmount == 0 ||
          this.modalForm.value.switchAmount == null
        ) {
          this.modalForm.controls['switchUnits'].enable();
        } else if (this.modalForm.value.switchAmount != 0) {
          this.modalForm.controls['switchUnits'].disable();
        }
      } else if (fieldValue == 'No of Units') {
        this.modalForm.controls['switchUnits'].setValidators([
          Validators.min(1),
          Validators.required,
        ]);
        this.modalForm.controls['switchAmount'].clearValidators();
        this.modalForm.controls['switchAmount'].updateValueAndValidity();
        if (
          this.modalForm.value.switchUnits == 0 ||
          this.modalForm.value.switchUnits == null
        ) {
          this.modalForm.controls['switchAmount'].enable();
        } else if (this.modalForm.value.switchUnits != 0) {
          this.modalForm.controls['switchAmount'].disable();
        }
      }
    }
    if (!this.flagType) {
      // this.modalForm.controls["fromBSESchemeCode"].setValidators(Validators.required);
      this.modalForm.controls['clientCode'].setValidators(Validators.required);
      this.modalForm.controls['folioNo'].setValidators(Validators.required);
    }
    if (this.modeOfAction == 'STP') {
      this.modalForm.controls['instAmount'].setValidators([
        Validators.min(1),
        Validators.required,
      ]);
      this.modalForm.controls['toBSESchemeCode'].setValidators(
        Validators.required
      );
      this.modalForm.controls['startDate'].setValidators(Validators.required);
      this.modalForm.controls['endDate'].setValidators(Validators.required);
      this.modalForm.controls['firstOrderToday'].setValidators(
        Validators.required
      );
      this.modalForm.controls['frequencyType'].setValidators(
        Validators.required
      );
      // this.modalForm.controls["noOfTransfers"].setValidators([Validators.min(1),Validators.required]);
    } else if (this.modeOfAction == 'SWP') {
      this.modalForm.controls['accountNumber'].setValidators(
        Validators.required
      );
      this.modalForm.controls['startDate'].setValidators(Validators.required);
      this.modalForm.controls['endDate'].setValidators(Validators.required);
      this.modalForm.controls['firstOrderToday'].setValidators(
        Validators.required
      );
      this.modalForm.controls['frequencyType'].setValidators(
        Validators.required
      );
      // this.modalForm.controls["noOfTransfers"].setValidators([Validators.min(1),Validators.required]);
      this.selectedField = fieldValue;
      if (fieldValue == 'Withdrawl Unit Field') {
        this.modalForm.controls['installmentUnits'].setValidators([
          Validators.min(1),
          Validators.required,
        ]);
        this.modalForm.controls['intallmentAmount'].clearValidators();
        this.modalForm.controls['intallmentAmount'].updateValueAndValidity();
        if (
          this.modalForm.value.installmentUnits == 0 ||
          this.modalForm.value.installmentUnits == null
        ) {
          this.modalForm.controls['intallmentAmount'].enable();
        } else if (this.modalForm.value.installmentUnits != 0) {
          this.modalForm.controls['intallmentAmount'].disable();
        }
      }
      if (fieldValue == 'Withdrawl Amount Field') {
        this.modalForm.controls['intallmentAmount'].setValidators([
          Validators.min(1),
          Validators.required,
        ]);
        this.modalForm.controls['installmentUnits'].clearValidators();
        this.modalForm.controls['installmentUnits'].updateValueAndValidity();

        if (
          this.modalForm.value.intallmentAmount == 0 ||
          this.modalForm.value.intallmentAmount == null
        ) {
          this.modalForm.controls['installmentUnits'].enable();
        } else if (this.modalForm.value.intallmentAmount != 0) {
          this.modalForm.controls['installmentUnits'].disable();
        }
      }
    } else if (this.modeOfAction == 'Switch out') {
      // this.modalForm.controls["kycSatus"].setValidators(Validators.required);
      this.modalForm.controls['kycSatus'].setValue('Yes');
      // this.modalForm.controls['minRedeem'].disable();
      this.modalForm.controls['minRedeem'].setValidators(Validators.required);
      this.modalForm.controls['allUnitsFlag'].setValidators(
        Validators.required
      );
      this.modalForm.controls['toBSESchemeCode'].setValidators(
        Validators.required
      );
      this.modalForm.controls['switchAmount'].setValidators([
        Validators.min(1),
        Validators.required,
      ]);
      this.modalForm.controls['switchUnits'].setValidators([
        Validators.min(1),
        Validators.required,
      ]);
    }
  }

  public dateRangeValidator: ValidatorFn = (): {
    [key: string]: any;
  } | null => {
    let invalid = false;
    const start_date =
      this.modalForm &&
      moment(this.modalForm.value.startDate).format('YYYY-MM-DD');
    const end_date =
      this.modalForm &&
      moment(this.modalForm.value.endDate).format('YYYY-MM-DD');
    if (start_date && end_date) {
      invalid = new Date(start_date).valueOf() > new Date(end_date).valueOf();
    }
    return invalid ? { invalidRange: { start_date, end_date } } : null;
  };

  onReset() {
    window.location.reload();
  }
  SearchFund() {
    let var1 = this.modalForm.controls['fromBSESchemeCode'].value;
    let fundName = this.modalForm;
    this._brokerTransactionsService.searchFund(var1).subscribe((data1: any) => {
      this.modalForm.controls['fromBSESchemeCode'].reset();
      if (data1.length == 0) {
        window.scrollTo(0, 0);
        this.toastr.showError('No Fund Found for the given key word');
      } else {
        const dialogRef = this.dialog.open(FundListModalComponent, {
          width: '1024px',
          data: data1,
        });
        dialogRef.afterClosed().subscribe((res: any) => {
          this.SchemeCodeFund1 = res;
          this.modalForm.controls['fromBSESchemeCode'].setValue(
            res.scheme_code + ' ' + res.scheme_name
          );
        });
      }
    });
  }

  SearchFund2() {
    let var1 = this.modalForm.controls['toBSESchemeCode'].value;
    let fundName = this.modalForm;
    this._brokerTransactionsService.searchFund(var1).subscribe((data1: any) => {
      this.modalForm.controls['toBSESchemeCode'].reset();

      if (data1.length == 0) {
        window.scrollTo(0, 0);
        this.toastr.showError('No Fund Found for the given key word');
      } else {
        const dialogRef = this.dialog.open(FundListModalComponent, {
          width: '1024px',
          data: data1,
        });
        dialogRef.afterClosed().subscribe((res: any) => {
          this.SchemeCodeFund2 = res;
          this.modalForm.controls['toBSESchemeCode'].setValue(
            res.scheme_code + ' ' + res.scheme_name
          );
        });
      }
    });
  }

  accounNumberEnable() {
    if (this.modalForm.value.clientCode != '') {
      this.modalForm.controls['accountNumber'].enable();
      this.getclientBankDetails();
    }
  }

  // getclientBankAccountDetails(){
  //   this._brokerTransactionsService.getclientBankAccountDetails(this.modalForm.value.clientCode[0]).subscribe(data => {
  //     if(data){
  //       this.accounNoList = data;
  //     }
  //   }, err => {
  //     this.toastr.showError("Error in loading data");
  //   });
  // }

  getclientBankDetails() {
    this.sharedModuleService
      .getBankData(this.modalForm.value.clientCode[0])
      .subscribe(
        (data) => {
          if (data) {
            this.accounNoList = data;
            data.map((item: BankAccount) => {
              if (item.defaultBankFlag === 'Y') {
                this.defaultBankAccount = item.accountNo;
              }
            });
          }
        },
        (err) => {
          this.toastr.showError('Error in loading data');
        }
      );
  }

  getclientFolioNos(clientUserCode: string) {
    this._brokerTransactionsService
      .getclientFolioNos(this.userId, clientUserCode)
      .subscribe(
        (data) => {
          if (data) {
            this.folioNosList = data;
          }
        },
        (err) => {
          this.toastr.showError('Error in loading data');
        }
      );
  }

  getSchemeInFolioNo(folioNo: string) {
    this._brokerTransactionsService.getSchemeInFolioNo(folioNo).subscribe(
      (data) => {
        if (data) {
          this.holdingFundsList = data[0];
          this.getClientBalanceFreshSwitchOut(this.holdingFundsList.fmcode);
        }
      },
      (err) => {
        this.toastr.showError('Error in loading data');
      }
    );
  }

  getclientPersonalDetails(clientCodes: any) {
    this.getclientFolioNos(clientCodes[0]);
    let clientList = [...this.clientData];
    let clientUserCode: any[] = [clientCodes[0]];
    for (var i = 0; i < clientUserCode.length; i++) {
      var list = clientList.filter(
        (data) => data.clientUserCode == clientUserCode[i]
      );
      list.forEach((data) => {
        this.clientEmail = data.clientEmail;
        this.clientPhoneNo = data.clientPhoneNo;
        this.clientName1 =
          (data?.clientFirstName || '') +
          (data?.clientMiddleName ? ' ' + data.clientMiddleName : '') +
          (data?.clientLastName ? ' ' + data.clientLastName : '');
      });
    }
    // this.existingFundList(event);
    // this._brokerTransactionsService.getTransactionsDetails(event,"").subscribe(data => {
    //   if(data){
    //   this.clientMobileNumber = data.phoneNo;
    //   this.clientEmailId = data.emailId;
    //   // this.clientBankAccNumber = data.bankAccountNo
    //   this.clientName1 = data.clientName,
    //   this.accounNoList  = data.bankAccountNoList;
    //   }
    // }, err => {
    //     this.toastr.showError("Error in loading data");
    //   });
  }

  getClientList(clientId?: any) {
    if (this.flagType == 'Additional') {
      this.clientId = localStorage.getItem('client-id');
      this.modalForm.value.clientCode = this.clientId;
    } else {
      this.clientId = '';
    }
    this._brokerTransactionsService
      .getClientsList(this.clientId, this.userId)
      .subscribe(
        (data) => {
          if (data) this.clientData = data;
          if (this.flagType == 'Additional') {
            this.getclientFolioNos(this.clientId);
            this.clientEmail = data[0].clientEmail;
            this.clientPhoneNo = data[0].clientPhoneNo;
            this.clientName1 =
              data[0].clientFirstName + ' ' + data[0].clientLastName;
            this.clientCodeBSE = data[0].clientCodeBSE;
            if (data[0].clientMiddleName != null) {
              this.combinedclientDetails =
                data[0].clientPan +
                ' -- ' +
                data[0].clientFirstName +
                ' ' +
                data[0].clientMiddleName +
                ' ' +
                data[0].clientLastName;
            } else {
              this.combinedclientDetails =
                data[0].clientPan +
                ' -- ' +
                data[0].clientFirstName +
                ' ' +
                data[0].clientLastName;
            }
          }
        },
        (err) => {
          this.toastr.showError('Error in loading data');
        }
      );
  }

  getEuinList() {
    this._brokerTransactionsService.getEuinList(this.userId).subscribe(
      (data) => {
        if (data) {
          this.euinList = data;
          // this.firstEuin = this.euinList[0]
          if (this.role == 'RELATIONSHIP MANAGER') {
            this.euinNumber = data[0];
          }
        }
      },
      (err) => {
        this.toastr.showError('Error in loading data');
      }
    );
  }

  // getFundsList(){
  //   this._brokerTransactionsService.getFundsList().subscribe(data => {
  //     if(data)
  //     this.fundsData=data;
  //   }, err => {
  //     this.toastr.showError("Error in loading data");
  //   });
  // }

  getNoOfInvestment() {
    if (this.modalForm.value.frequencyType == 'Monthly') {
      this.noOfInvestment =
        (new Date(this.modalForm.value.endDate).getFullYear() -
          new Date(this.modalForm.value.startDate).getFullYear()) *
          12 +
        (new Date(this.modalForm.value.endDate).getMonth() -
          new Date(this.modalForm.value.startDate).getMonth());
      this.noOfInvestment = this.noOfInvestment + 1;
      // if(new Date(this.modalForm.value.endDate).getMonth() ==new Date(this.modalForm.value.startDate).getMonth() ){
      // this.noOfInvestment=this.noOfInvestment;
      // }
      // else{
      //   this.noOfInvestment=this.noOfInvestment+1;
      // }
    } else if (this.modalForm.value.frequencyType == 'Quarterly') {
      let month =
        (new Date(this.modalForm.value.endDate).getFullYear() -
          new Date(this.modalForm.value.startDate).getFullYear()) *
          12 +
        (new Date(this.modalForm.value.endDate).getMonth() -
          new Date(this.modalForm.value.startDate).getMonth());
      this.noOfInvestment = Math.floor(month / 3);
    } else if (this.modalForm.value.frequencyType == 'Weekly') {
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      this.noOfInvestment = Math.floor(
        (new Date(this.modalForm.value.endDate).getTime() -
          new Date(this.modalForm.value.startDate).getTime()) /
          oneWeek
      );
    } else if (this.modalForm.value.frequencyType == 'Daily') {
      this.noOfInvestment = Math.floor(
        (this.modalForm.value.endDate - this.modalForm.value.startDate) /
          (1000 * 60 * 60 * 24)
      );
      this.noOfInvestment = this.noOfInvestment + 1;
    }
    if (Number.isNaN(this.noOfInvestment)) {
      this.noOfInvestment = 0;
    }
  }

  getClientBalanceFreshSwitchOut(fundCode: any) {
    // this.modalForm.value.clientCode
    if (this.flagType != 'Additional') {
      this.clientIDforBalance = this.modalForm.value.clientCode[0];
      this.fundSchemeCode = fundCode;

      this._brokerTransactionsService
        .getUserBalanceAmount(this.clientIDforBalance, this.fundSchemeCode)
        .subscribe(
          (data) => {
            if (data) {
              this.clientBalanceAmount = data.total_Amount;
              this.clientBalanceUnits = data.total_Units;
            }
          },
          (err) => {
            this.toastr.showError('Error in loading data');
          }
        );
    }
  }

  getClientBalanceAmount() {
    this._brokerTransactionsService
      .getUserBalanceAmount(this.clientIDforBalance, this.fundSchemeCode)
      .subscribe(
        (data) => {
          if (data) {
            this.clientBalanceAmount = data.total_Amount;
            this.clientBalanceUnits = data.total_Units;
          }
        },
        (err) => {
          this.toastr.showError('Error in loading data');
        }
      );
  }

  onSubmit() {
    if (this.modalForm.invalid) return;

    if (!this.flagType) {
      this.modalForm.value.clientCode = this.modalForm.value.clientCode[1];
    }

    // if(!this.flagType && this.modeOfAction!='Switch out'){
    //   this.modalForm.value.fromBSESchemeCode=this.SchemeCodeFund1.scheme_code;
    // }
    if (this.flagType == 'Additional') {
      this.modalForm.value.fromBSESchemeCode = this.selectedSchemeCode;
      this.modalForm.value.clientCode = this.clientCodeBSE;
      this.modalForm.value.folioNo = this.folioNumber;
    } else {
      this.modalForm.value.fromBSESchemeCode = this.holdingFundsList.fmcode;
    }

    if (this.modeOfAction == 'Switch out') {
      localStorage.setItem('UnitFlagValue', this.modalForm.value.allUnitsFlag);
      if (this.modalForm.value.allUnitsFlag == 'No') {
        if (
          this.selectedField == 'Transfer Amount' ||
          this.selectedField == ''
        ) {
          localStorage.setItem(
            'SwitchFieldValue',
            this.modalForm.value.switchAmount
          );
          this.modalForm.value.switchUnits = 0;
        } else {
          localStorage.setItem(
            'SwitchFieldValue',
            this.modalForm.value.switchUnits
          );
          this.modalForm.value.switchAmount = 0;
        }
      }
    }

    let transactionType = this.modalForm.value.buySellType;
    localStorage.setItem('transtype', transactionType);
    let Client = this.clientName1;
    localStorage.setItem('ClientType', Client);
    // let Scheme = this.modalForm.value.fromBSESchemeCode
    if (this.flagType == 'Additional') {
      var scheme =
        '( ' + this.selectedSchemeCode + ' )' + ' - ' + this.selectedFundName;
    } else {
      var scheme =
        '( ' +
        this.holdingFundsList.fmcode +
        ' )' +
        ' - ' +
        this.holdingFundsList.funddesc;
    }
    localStorage.setItem('schemeType', scheme);
    let mode = this.modalForm.value.transactionMode;
    localStorage.setItem('modeType', mode);
    let installAmount1 = this.modalForm.value.installmentAmount;
    localStorage.setItem('installAmountType', installAmount1);
    let clientEmail = this.clientEmail;
    localStorage.setItem('clientEmail', clientEmail);

    this.modalForm.value.startDate = moment(
      this.modalForm.value.startDate
    ).format('DD/MM/YYYY');
    this.modalForm.value.endDate = moment(this.modalForm.value.endDate).format(
      'DD/MM/YYYY'
    );
    delete this.modalForm.value.endDate;
    if (this.modalForm.value.transactionMode == 'Physical') {
      this.modalForm.value.transactionMode = 'P';
    }
    if (this.modalForm.value.firstOrderToday == 'Yes') {
      this.modalForm.value.firstOrderToday = 'Y';
    } else if (this.modalForm.value.firstOrderToday == 'No') {
      this.modalForm.value.firstOrderToday = 'N';
    }
    // if(this.modalForm.value.euindeclaration=='Yes'){
    //   this.modalForm.value.euindeclaration='Y';
    // }
    // else if(this.modalForm.value.euindeclaration=='No'){
    //   this.modalForm.value.euindeclaration='N';
    // }
    this.modalForm.value.frequencyType =
      this.modalForm.value.frequencyType.toUpperCase();

    if (this.modeOfAction == 'STP') {
      this.modalForm.value.noOfTransfers = this.noOfInvestment;
      if (this.SchemeCodeFund2 == undefined) {
        window.scrollTo(0, 0);
        this.toastr.showError('Hit Go button and then select fund');
        this.toSchemeCodeExist = false;
      } else {
        this.modalForm.value.toBSESchemeCode = this.SchemeCodeFund2.scheme_code;
        this.toSchemeCodeExist = true;
      }
      // this.modalForm.value.fromBSESchemeCode =  this.holdingFundsList.fmcode;

      let amountVal = this.modalForm.value.instAmount;
      localStorage.setItem('amount', amountVal);
      let fund2Code =
        '( ' +
        this.SchemeCodeFund2.scheme_code +
        ' )' +
        ' - ' +
        this.SchemeCodeFund2.scheme_name;
      localStorage.setItem('fund2codeType', fund2Code);

      if (this.role == 'RELATIONSHIP MANAGER') {
        this.modalForm.value.euinnumber = this.euinNumber;
      }

      delete this.modalForm.value.kycSatus,
        this.modalForm.value.minRedeem,
        this.modalForm.value.allUnitsFlag,
        this.modalForm.value.switchAmount,
        this.modalForm.value.switchUnits;

      if (this.toSchemeCodeExist) {
        this._brokerTransactionsService
          .placeStpOrder(this.modalForm.value, this.userId)
          .subscribe(
            (data) => {
              if (data) {
                this.placeOrderMessage =
                  data.BSERemarks + ' STPRegNo: ' + data.STPRegNo;
                this.orderNotPlacedMessage = data.BSERemarks;

                this.isOrderPlaced = data.SuccessFlag;
                if (this.isOrderPlaced == 0) {
                  const dialogRef = this.dialog.open(
                    ConfirmationModalComponent,
                    {
                      width: '600px',
                      data: {
                        headingValue: 'Order placed!',
                        textValue:
                          'Your Order has been placed with the following order details mentioned below.',
                        buttonValue: 'Return to Home',
                        modalType: 'stp-transaction',
                        orderNO: data.STPRegNo,
                        transactionType: 'STP',
                      },
                    }
                  );
                  dialogRef.afterClosed().subscribe((result) => {
                    if (!this.flagType) {
                      if (this.role == 'BROKER ADMIN') {
                        this.router.navigate(['broker']);
                      } else {
                        this.router.navigate(['relationshipManager']);
                      }
                    } else if (this.flagType == 'Additional') {
                      if (this.role == 'BROKER ADMIN') {
                        this.router.navigate([
                          'broker-client-portfolio',
                          localStorage.getItem('client-id'),
                          'broker',
                        ]);
                      } else {
                        this.router.navigate([
                          'broker-client-portfolio',
                          localStorage.getItem('client-id'),
                          'rm',
                        ]);
                      }
                    }
                  });
                } else if (this.isOrderPlaced == 1) {
                  window.scrollTo(0, 0);
                  this.toastr.showError(this.orderNotPlacedMessage);
                }
              }
            },
            (err) => {
              window.scrollTo(0, 0);
              this.toastr.showError('Error in Placing Order');
            }
          );
      }
    } else if (this.modeOfAction == 'SWP') {
      if (this.modalForm.value.installmentUnits != undefined) {
        this.confirmationAmountType = 'Withdrawl Units';
      } else {
        this.confirmationAmountType = 'Withdrawl Amount';
      }

      if (this.modalForm.value.intallmentAmount == undefined) {
        this.amountVal = this.modalForm.value.installmentUnits;
      } else {
        this.amountVal = this.modalForm.value.intallmentAmount;
      }

      localStorage.setItem('amount', this.amountVal);
      // this.modalForm.value.numberofWithdrawls=this.modalForm.value.noOfTransfers;

      if (this.flagType == 'Additional') {
        this.modalForm.value.fromBSESchemeCode = this.selectedSchemeCode;
      } else {
        this.modalForm.value.fromBSESchemeCode = this.holdingFundsList.fmcode;
      }

      this.modalForm.value.numberofWithdrawls = this.noOfInvestment;
      this.modalForm.value.bseSchemeCode =
        this.modalForm.value.fromBSESchemeCode;
      this.modalForm.value.folioNumber = this.modalForm.value.folioNo;
      this.modalForm.value.bankAccountNo = this.modalForm.value.accountNumber;
      this.modalForm.value.euinDeclaration =
        this.modalForm.value.euindeclaration;
      if (this.role == 'RELATIONSHIP MANAGER') {
        this.modalForm.value.euinNumber = this.euinNumber;
      } else {
        this.modalForm.value.euinNumber = this.modalForm.value.euinnumber;
      }
      // this.modalForm.value.euinNumber = this.holdingFundsList[0].fmcode

      delete this.modalForm.value.noOfTransfers,
        this.modalForm.value.fromBSESchemeCode,
        this.modalForm.value.toBSESchemeCode,
        this.modalForm.value.accountNumber,
        this.modalForm.value.folioNo,
        this.modalForm.value.euindeclaration,
        this.modalForm.value.euinnumber,
        this.modalForm.value.kycSatus,
        this.modalForm.value.minRedeem,
        this.modalForm.value.allUnitsFlag,
        this.modalForm.value.switchAmount,
        this.modalForm.value.switchUnits;

      this._brokerTransactionsService
        .placeSwpOrder(this.modalForm.value, this.userId)
        .subscribe(
          (data) => {
            if (data.message.includes('101')) {
              window.scrollTo(0, 0);
              this.toastr.showError('BSE Password Error');
            } else if (data) {
              this.placeOrderMessage = data.message;
              let arraySplitMessage = this.placeOrderMessage.split('|');
              this.isOrderPlaced =
                arraySplitMessage[arraySplitMessage.length - 3];
              let orderNoMessage =
                arraySplitMessage[arraySplitMessage.length - 1];
              this.successfulOrderPlacedMessage =
                arraySplitMessage[arraySplitMessage.length - 2] +
                ' ' +
                arraySplitMessage[arraySplitMessage.length - 1];

              if (this.isOrderPlaced == 100) {
                const dialogRef = this.dialog.open(ConfirmationModalComponent, {
                  width: '600px',
                  data: {
                    headingValue: 'Order placed!',
                    textValue:
                      'Your Order has been placed with following order details mentioned below.',
                    buttonValue: 'Return to Home',
                    modalType: 'swp-transaction',
                    orderNO: orderNoMessage,
                    withdrawlUnits: this.confirmationAmountType,
                    transactionType: 'SWP',
                  },
                });
                dialogRef.afterClosed().subscribe((result) => {
                  if (!this.flagType) {
                    if (this.role == 'BROKER ADMIN') {
                      this.router.navigate(['broker']);
                    } else {
                      this.router.navigate(['relationshipManager']);
                    }
                  } else if (this.flagType == 'Additional') {
                    if (this.role == 'BROKER ADMIN') {
                      this.router.navigate([
                        'broker-client-portfolio',
                        localStorage.getItem('client-id'),
                        'broker',
                      ]);
                    } else {
                      this.router.navigate([
                        'broker-client-portfolio',
                        localStorage.getItem('client-id'),
                        'rm',
                      ]);
                    }
                  }
                });
              } else if (this.isOrderPlaced == 101) {
                window.scrollTo(0, 0);
                this.toastr.showError(this.successfulOrderPlacedMessage);
              }
            }
          },
          (err) => {
            window.scrollTo(0, 0);
            this.toastr.showError('Error in Placing Order');
          }
        );
    } else if (this.modeOfAction == 'Switch out') {
      this.modalForm.value.transactionCode = this.modalForm.value.transType;
      // this.modalForm.value.fromBSESchemeCode=this.holdingFundsList.fmcode;
      this.modalForm.value.fromSchemeCode =
        this.modalForm.value.fromBSESchemeCode;

      if (this.SchemeCodeFund2 == undefined) {
        window.scrollTo(0, 0);
        this.toastr.showError('Hit go button and then select fund');
        this.toSchemeCodeExist = false;
      } else {
        this.modalForm.value.toSchemeCode = this.SchemeCodeFund2.scheme_code;
        this.toSchemeCodeExist = true;
      }
      this.modalForm.value.buySell = 'SO';
      this.modalForm.value.euinVal = this.modalForm.value.euindeclaration;
      this.modalForm.value.dptxn = this.modalForm.value.transactionMode;
      this.modalForm.value.Remarks = this.modalForm.value.remarks;
      this.modalForm.value.buySellType =
        this.modalForm.value.buySellType.toUpperCase();
      if (this.role == 'RELATIONSHIP MANAGER') {
        this.modalForm.value.euin = this.euinNumber;
      } else {
        this.modalForm.value.euin = this.modalForm.value.euinnumber;
      }
      if (this.modalForm.value.allUnitsFlag == 'Yes') {
        this.modalForm.value.allUnitsFlag = 'Y';
      } else if (this.modalForm.value.allUnitsFlag == 'No') {
        this.modalForm.value.allUnitsFlag = 'N';
      }
      if (this.modalForm.value.kycSatus == 'Yes') {
        this.modalForm.value.kycSatus = 'Y';
      } else if (this.modalForm.value.kycSatus == 'No') {
        this.modalForm.value.kycSatus = 'N';
      }
      if (this.modalForm.value.minRedeem == 'Yes') {
        this.modalForm.value.minRedeem = 'Y';
      } else if (this.modalForm.value.minRedeem == 'No') {
        this.modalForm.value.minRedeem = 'N';
      }
      let fund2Code =
        '( ' +
        this.SchemeCodeFund2.scheme_code +
        ' )' +
        ' - ' +
        this.SchemeCodeFund2.scheme_name;
      localStorage.setItem('fund2codeType', fund2Code);

      delete this.modalForm.value.accountNumber,
        delete this.modalForm.value.remarks,
        delete this.modalForm.value.startDate;
      delete this.modalForm.value.stpregNo,
        delete this.modalForm.value.stptype,
        delete this.modalForm.value.toBSESchemeCode,
        delete this.modalForm.value.transType,
        delete this.modalForm.value.transactionMode,
        delete this.modalForm.value.fromBSESchemeCode,
        delete this.modalForm.value.instAmount,
        delete this.modalForm.value.frequencyType,
        delete this.modalForm.value.firstOrderToday,
        delete this.modalForm.value.euindeclaration,
        delete this.modalForm.value.instUnit,
        delete this.modalForm.value.installmentUnits,
        delete this.modalForm.value.intallmentAmount,
        delete this.modalForm.value.noOfTransfers;

      if (this.toSchemeCodeExist) {
        this._brokerTransactionsService
          .placeSwitchOutOrder(this.modalForm.value, this.userId)
          .subscribe(
            (data) => {
              if (data) {
                this.placeOrderMessage = data.message;
                this.isOrderPlaced = this.placeOrderMessage.charAt(
                  this.placeOrderMessage.length - 1
                );
                let arraySplitMessage = this.placeOrderMessage.split('|');
                this.successfulOrderPlacedMessage =
                  arraySplitMessage[arraySplitMessage.length - 2] +
                  ' ' +
                  arraySplitMessage[arraySplitMessage.length - 1];
                let orderNoMessage =
                  arraySplitMessage[arraySplitMessage.length - 6];
                if (this.isOrderPlaced == 0) {
                  const dialogRef = this.dialog.open(
                    ConfirmationModalComponent,
                    {
                      width: '600px',
                      data: {
                        headingValue: 'Order placed!',
                        textValue:
                          'Your Order has been placed with following order details mentioned below.',
                        buttonValue: 'Return to Home',
                        modalType: 'switch-out-transaction',
                        orderNO: orderNoMessage,
                        selectedField: this.selectedField,
                        transactionType: 'Switch Out',
                      },
                    }
                  );
                  dialogRef.afterClosed().subscribe((result) => {
                    if (!this.flagType) {
                      if (this.role == 'BROKER ADMIN') {
                        this.router.navigate(['broker']);
                      } else {
                        this.router.navigate(['relationshipManager']);
                      }
                    } else if (this.flagType == 'Additional') {
                      if (this.role == 'BROKER ADMIN') {
                        this.router.navigate([
                          'broker-client-portfolio',
                          localStorage.getItem('client-id'),
                          'broker',
                        ]);
                      } else {
                        this.router.navigate([
                          'broker-client-portfolio',
                          localStorage.getItem('client-id'),
                          'rm',
                        ]);
                      }
                    }
                  });
                } else if (this.isOrderPlaced == 1) {
                  window.scrollTo(0, 0);
                  this.toastr.showError(this.successfulOrderPlacedMessage);
                }
              }
            },
            (err) => {
              window.scrollTo(0, 0);
              this.toastr.showError('Error in Placing Order');
            }
          );
      }
    }
  }
}
