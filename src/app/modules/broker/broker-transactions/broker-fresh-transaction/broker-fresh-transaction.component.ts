import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, FormGroupDirective } from '@angular/forms';
import { BrokerTransactionsService } from './../services/broker-transactions.service';
import { ToastrService } from 'ngx-toastr';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { FundListModalComponent } from '../fund-list-modal/fund-list-modal.component'
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-broker-fresh-transaction',
  templateUrl: './broker-fresh-transaction.component.html',
  styleUrls: ['./broker-fresh-transaction.component.css']
})

export class BrokerFreshTransactionComponent implements OnInit {
  mainHeadingValue: string = 'Transactions';
  modalForm: FormGroup;
  euinDeclarationOptions = ['Yes', 'No'];
  modeOfAction: string = '';
  modeOfTransactionOptions: any = [];
  DPTransactionMode = ['CDSL', 'NSDL', 'Physical']
  actionOptions = ['No. of Units', 'Amount (₹)'];
  frequency = ['Monthly', 'Quarterly', 'Weekly'];
  firstOrderToday = ['Yes', 'No']
  userId: any;
  clientData: any;
  clientMobileNumber: any;
  clientEmailId: any;
  brokerId: string = '';
  placeOrderMessage: any;
  isOrderPlaced: any;
  transactionType: string = '';
  fundsData: any;
  successfulOrderPlacedMessage: any;
  minDate = new Date();
  partnerId!: string;
  formtoModal: any;
  SchemeCodeSetFlag: any;
  flagType?: string;
  selectedFundName?: string;
  selectedSchemeCode?: string;
  flag: boolean = false;
  clientName1: any;
  euinList: any;
  clientEmail: string = '';
  clientPhoneNo: string = '';
  mandateList: any;
  noOfInvestment: any;
  clientId: any;
  folioNumber:string='';
  clientCodeBSE:string='';
  role:string='';
  euinNumber:string='';
  schemeCodeExist:boolean=false;
  combinedclientDetails:string='';
  selectedFundDetails:string='';
  filteredClientDataList: any[] = [];
  @ViewChild('picker') datePicker!: MatDatepicker<Date>;
  @ViewChild("picker2") datePicker2!: MatDatepicker<Date>;
  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;

  constructor(private formBuilder: FormBuilder,
    private _brokerTransactionsService: BrokerTransactionsService,
    private toastr: ToastrShowService,
    private authUserService: AuthUserService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private sharedModuleService: SharedModuleService) {
    this.modalForm = this.formBuilder.group({});
    this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);
  }

  ngOnInit(): void {
    // this.authUserService.resetFormOnRedirect.subscribe(() => {
    //   this.formGroupDirective.resetForm();
    // });

    this.partnerId = localStorage.getItem('partner-Id') as unknown as string;

    this.route.paramMap.subscribe((params: any) => {
      this.transactionType = params.get?.('selectedAction');
      if (this.transactionType == 'SIP') {
        this.modeOfAction = 'SIP';
        this.modeOfTransactionOptions = ['Physical', 'Demat'];
      }
      else {
        this.modeOfAction = 'Purchase';
        this.modeOfTransactionOptions = ['Physical', 'CDSL Demat', 'NSDL Demat'];
      }
    });

    this.route.queryParams.subscribe(queryparams => {
      this.flagType = queryparams.transactionType;
      this.selectedFundName = queryparams.fundName;
      this.selectedSchemeCode = queryparams.schemeCode;
      this.selectedFundDetails=this.selectedSchemeCode + " " +this.selectedFundName;
      this.folioNumber=queryparams.folioNumber;
    });

    this.authUserService.getUserDetailBehaviorSubject().subscribe(data => {
      if (data) {
        this.userId = data.userId;
        this.role = data.newRoleFinal.roleDescription;
      }
    });

    this.modalForm = this.formBuilder.group({
      selectedAction: ['Amount (₹)'],
      EUIN: [''],
      schemeName: [''],
      schemeCode: [''],
      transCode: ['New'],
      allRedeem: ['N'],
      buySell: ['P'],
      orderVal: [''],
      qty: [''],
      buySellType: ['Fresh'],
      DPC: ['Y'],
      clientCode: [''],
      DPTxn: ['Physical', Validators.required],
      EUINval: ['Y'],
      // EUINval:['',Validators.required],
      KYCstatus: ['Y'],
      minRedeem: ['N'],
      folioNo: [''],
      remarks: [''],
      firstOrderFlag: [''],
      startDate: [''],
      param2: [''],
      noOfInstallments: [''],
      dpTransactionMode: [''],
      installmentAmount: [''],
      frequencyType: [''],
      fundSearch: [''],
      mandateId: ['']
    });
    this.setValidation();
    // this.getFundsList();
    // this.getClientList();
    this.getEuinList();

    // if (this.flagType == 'Additional') {
    //   this.getclientPersonalDetails(localStorage.getItem('client-id'))
    // }

    if (this.flagType == 'Additional') {
      this.getClientList(localStorage.getItem('client-id'))
    }
    else {
      this.getClientList();
    }
  }

  getClientList(clientId?: any) {
    if (this.flagType == 'Additional') {
      this.clientId = clientId;
      this.getClientMandateList(this.clientId);
    }
    else {
      this.clientId = '';
    }
    this._brokerTransactionsService.getClientsList(this.clientId, this.userId).subscribe(data => {
      if (data) {
        this.clientData = data;

        let clientList = [... this.clientData];
        let clientUserCode: any[] = [null];
        for (var i = 0; i < clientUserCode.length; i++) {
          var list = clientList.filter(data => data.clientCodeBSE != clientUserCode[i]);
          list.forEach(data => {
          this.filteredClientDataList.push(data);
        });
      }

        if (this.flagType == 'Additional') {
          this.clientEmail = data[0].clientEmail;
          this.clientPhoneNo = data[0].clientPhoneNo;
          this.clientCodeBSE=data[0].clientCodeBSE;
          if(data[0].clientLastName==null){
            this.clientName1 = data[0].clientFirstName;
          }
          else{
            this.clientName1 = data[0].clientFirstName + ' ' + data[0].clientLastName;
          }
          if (data[0].clientMiddleName != null) {
            this.combinedclientDetails = data[0].clientPan + " -- " + data[0].clientFirstName + " " + data[0].clientMiddleName + " " + data[0].clientLastName;
          }
          else {
            this.combinedclientDetails = data[0].clientPan + " -- " + data[0].clientFirstName + " " + data[0].clientLastName;
          }
        }
      }
    }, err => {
      this.toastr.showError("Error in loading data");
    });
  }

  getEuinList() {
    this._brokerTransactionsService.getEuinList(this.userId).subscribe(data => {
      if (data) {
        this.euinList = data;
        if(this.role=='RELATIONSHIP MANAGER'){
          this.euinNumber=data[0];
        }
      }
    }, err => {
      this.toastr.showError("Error in loading data");
    });
  }


  // getFundsList() {
  //   this._brokerTransactionsService.getFundsList().subscribe(data => {
  //     if (data) {
  //       this.fundsData = data;
  //     }
  //   }, err => {
  //     this.toastr.showError("Error in loading data");
  //   });
  // }

  SearchFund() {
    let var1 = this.modalForm.controls['schemeCode'].value
    let fundName = this.modalForm
    this._brokerTransactionsService.searchFund(var1).subscribe((data1: any) => {
      this.modalForm.controls['schemeCode'].reset()
      if (data1.length == 0) {
        window.scrollTo(0, 0);
        this.toastr.showError("No Fund Found for the given key word")
      }

      else {
        const dialogRef = this.dialog.open(FundListModalComponent, {
          width: '1024px',
          data: data1
        });
        dialogRef.afterClosed().subscribe((res: any) => {
          this.SchemeCodeSetFlag = res;
          this.modalForm.controls['schemeCode'].setValue(res.scheme_code + " " + res.scheme_name);
        })
      }
    })
  }


  getclientPersonalDetails(clientCodes: any) {
    this.getClientMandateList(clientCodes[0]);
    let clientList = [... this.clientData];
    let clientUserCode: any[] = [clientCodes[0]];
    for (var i = 0; i < clientUserCode.length; i++) {
      var list = clientList.filter(data => data.clientUserCode == clientUserCode[i]);
      list.forEach(data => {
        this.clientEmail = data.clientEmail;
        this.clientPhoneNo = data.clientPhoneNo;
        this.clientName1 = data.clientFirstName + ' ' + data.clientLastName;
      })
    }

    // this._brokerTransactionsService.getTransactionsDetails(event,"").subscribe(data => {
    //   if(data){
    //   this.clientMobileNumber = data.phoneNo;
    //   this.clientEmailId = data.emailId;
    //   this.clientName1 = data.clientName;
    //   }
    // }, err => {
    //     this.toastr.showError("Error in loading data");
    //   });
  }

  getClientMandateList(clientCode: string) {
    this._brokerTransactionsService.getClientMandateList(clientCode).subscribe(data => {
      if (data) {
        this.mandateList = data;
      }
    }, err => {
      this.toastr.showError("Error in loading data");
    });
  }

  onReset() {
    window.location.reload();
  }

  public dateRangeValidator: ValidatorFn = (): {
    [key: string]: any;
  } | null => {
    let invalid = false;
    const start_date = this.modalForm && moment(this.modalForm.value.startDate).format('YYYY-MM-DD');
    const end_date = this.modalForm && moment(this.modalForm.value.param2).format('YYYY-MM-DD');
    if (start_date && end_date) {
      invalid = new Date(start_date).valueOf() > new Date(end_date).valueOf();
    }
    return invalid ? { invalidRange: { start_date, end_date } } : null;
  };

  setValidation() {
    if(this.role!='RELATIONSHIP MANAGER'){
      this.modalForm.controls["EUIN"].setValidators(Validators.required);
    }
    // if(this.modalForm.value.EUINval=='Yes'){
    //   this.modalForm.controls['EUIN'].enable();
    // }
    // else if(this.modalForm.value.EUINval=='No'){
    //   this.modalForm.controls['EUIN'].disable();
    // }

    if (!this.flagType) {
      this.modalForm.controls["schemeCode"].setValidators(Validators.required);
      this.modalForm.controls["clientCode"].setValidators(Validators.required);
    }


    if (this.modeOfAction == 'SIP') {
      this.modalForm.controls["startDate"].setValidators(Validators.required);
      this.modalForm.controls["param2"].setValidators(Validators.required);
      this.modalForm.controls["firstOrderFlag"].setValidators(Validators.required);
      // this.modalForm.controls["noOfInstallments"].setValidators([Validators.min(1), Validators.required]);
      this.modalForm.controls["frequencyType"].setValidators(Validators.required);
      this.modalForm.controls["installmentAmount"].setValidators([Validators.min(1), Validators.required]);
      this.modalForm.controls["dpTransactionMode"].setValidators(Validators.required);
      this.modalForm.controls["orderVal"].clearValidators();
      this.modalForm.controls["orderVal"].updateValueAndValidity();
      this.modalForm.controls["mandateId"].setValidators(Validators.required);
    }
    else if (this.modeOfAction == 'Purchase') {
      this.modalForm.controls["selectedAction"].setValidators(Validators.required);
      // this.modalForm.controls["KYCstatus"].setValidators(Validators.required);
      this.modalForm.controls["orderVal"].setValidators([Validators.min(1), Validators.required]);
      this.modalForm.controls["mandateId"].clearValidators();
      this.modalForm.controls["mandateId"].updateValueAndValidity();
    }
  }

  getNoOfInvestment() {
    if (this.modalForm.value.frequencyType == 'Monthly') {
      this.noOfInvestment = (new Date(this.modalForm.value.param2).getFullYear() - new Date(this.modalForm.value.startDate).getFullYear()) * 12 + (new Date(this.modalForm.value.param2).getMonth() - new Date(this.modalForm.value.startDate).getMonth());
      this.noOfInvestment = this.noOfInvestment + 1;
      // if (new Date(this.modalForm.value.param2).getMonth() == new Date(this.modalForm.value.startDate).getMonth()) {
      //   this.noOfInvestment = this.noOfInvestment;
      // }
      // else {
      //   this.noOfInvestment = this.noOfInvestment + 1;
      // }
    }
    else if (this.modalForm.value.frequencyType == 'Quarterly') {
      let month = (new Date(this.modalForm.value.param2).getFullYear() - new Date(this.modalForm.value.startDate).getFullYear()) * 12 + (new Date(this.modalForm.value.param2).getMonth() - new Date(this.modalForm.value.startDate).getMonth());
      this.noOfInvestment = Math.floor(month / 3);
    }
    else if (this.modalForm.value.frequencyType == 'Weekly') {
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      this.noOfInvestment = Math.floor((new Date(this.modalForm.value.param2).getTime() - new Date(this.modalForm.value.startDate).getTime()) / oneWeek);
    }
    if(Number.isNaN(this.noOfInvestment)){
      this.noOfInvestment=0;
    }
  }

  onSubmit() {
    if (this.modalForm.invalid)
      return;

    this.formtoModal = this.modalForm.value

    if (!this.flagType) {
      if(this.SchemeCodeSetFlag==undefined){
        window.scrollTo(0, 0);
        this.toastr.showError('Hit go button and then select fund');
        this.schemeCodeExist=false;
      }
      else{
        this.modalForm.value.schemeCode = this.SchemeCodeSetFlag.scheme_code;
        this.schemeCodeExist=true;
      }
      this.modalForm.value.clientCode = this.modalForm.value.clientCode[1];
    }
    else if (this.flagType == 'Additional') {
      this.modalForm.value.schemeCode = this.selectedSchemeCode;
      this.modalForm.value.clientCode = this.clientCodeBSE;
      this.schemeCodeExist=true;
    }

    let amountVal = this.modalForm.value.orderVal
    localStorage.setItem('amount', amountVal)
    let transactionType = this.modalForm.value.buySellType
    localStorage.setItem('transtype', transactionType)
    let Client = this.clientName1
    localStorage.setItem('ClientType', Client)
    if(this.flagType == 'Additional'){
      var scheme = "( " + this.selectedSchemeCode + " )" + " - " + this.selectedFundName;
    }
    else{
      var scheme= "( " + this.SchemeCodeSetFlag.scheme_code + " )" + " - " + this.SchemeCodeSetFlag.scheme_name;
    }
    // let scheme = this.modalForm.value.schemeCode
    localStorage.setItem('schemeType', scheme)
    let mode = this.modalForm.value.DPTxn
    localStorage.setItem('modeType', mode)
    let installAmount1 = this.modalForm.value.installmentAmount
    localStorage.setItem('installAmountType', installAmount1)
    let clientEmail = this.clientEmail;
    localStorage.setItem('clientEmail', clientEmail);

    // this.modalForm.controls['schemeCode'].setValue(this.SchemeCodeSetFlag.schemeCode)
    this.formtoModal = this.modalForm.value


    if (this.modalForm.value.DPTxn == 'Physical') {
      this.modalForm.value.DPTxn = 'P';
    }
    // if(this.modalForm.value.EUINval=='Yes'){
    //   this.modalForm.value.EUINval='Y';
    // }
    // else if(this.modalForm.value.EUINval=='No'){
    //   this.modalForm.value.EUINval='N';
    // }
    this.modalForm.value.qty = String(this.modalForm.value.qty);
    this.modalForm.value.orderVal = String(this.modalForm.value.orderVal);

    if(this.schemeCodeExist){

    if (this.modeOfAction == 'Purchase') {
      if(this.role=='RELATIONSHIP MANAGER'){
        this.modalForm.value.EUIN = this.euinNumber;
      }
      this._brokerTransactionsService.placeOrder(this.modalForm.value, this.userId).subscribe(data => {
        if (data) {
          this.placeOrderMessage = data.message;
          this.isOrderPlaced = this.placeOrderMessage.charAt(this.placeOrderMessage.length - 1);
          let arraySplitMessage = this.placeOrderMessage.split("|");
          this.successfulOrderPlacedMessage = arraySplitMessage[arraySplitMessage.length - 2];
          let orderNoMessage = arraySplitMessage[arraySplitMessage.length - 6];

          if (this.isOrderPlaced == 0) {
            const dialogRef = this.dialog.open(ConfirmationModalComponent, {
              width: '600px',
              data: { headingValue: 'Order placed', textValue: 'Your Order has been placed with following order details mentioned below.', buttonValue: 'Return to Home', modalType: 'purchase-transaction', orderNO: orderNoMessage, transactionType: 'Fresh Purchase' },
            });
            dialogRef.afterClosed().subscribe(result => {
              if (!this.flagType) {
                if(this.role=='BROKER ADMIN'){
                  this.router.navigate(['broker']);
                }
                else{
                  this.router.navigate(['relationshipManager']);
                }
              }
              else if (this.flagType == 'Additional') {
                if(this.role=='BROKER ADMIN'){
                  this.router.navigate(['broker-client-portfolio',localStorage.getItem('client-id'),'broker']);
                }
                else{
                  this.router.navigate(['broker-client-portfolio',localStorage.getItem('client-id'),'rm']);
                }
              }
            });
          }
          else if (this.isOrderPlaced == 1) {
            window.scrollTo(0, 0);
            this.toastr.showError(this.successfulOrderPlacedMessage);
          }
        }
      }, err => {
        window.scrollTo(0, 0);
        this.toastr.showError("Error in Placing Order");
      });
    }

    else if (this.modeOfAction == 'SIP') {
      this.modalForm.value.transMode = this.modalForm.value.DPTxn;
      if(this.role=='RELATIONSHIP MANAGER'){
        this.modalForm.value.EUIN = this.euinNumber;
        this.modalForm.value.euin = this.modalForm.value.EUIN;
      }
      else{
        this.modalForm.value.euin = this.modalForm.value.EUIN;
      }
      this.modalForm.value.euinDeclarationFlag = this.modalForm.value.EUINval;
      this.modalForm.value.dpc = this.modalForm.value.DPC;
      this.modalForm.value.frequencyType = this.modalForm.value.frequencyType.toUpperCase();
      this.modalForm.value.noOfInstallments = this.noOfInvestment;
      this.modalForm.value.folioNo=this.folioNumber;
      delete this.modalForm.value.DPTxn;
      delete this.modalForm.value.EUIN;
      delete this.modalForm.value.EUINval;
      delete this.modalForm.value.DPC;
      delete this.modalForm.value.selectedAction;
      delete this.modalForm.value.schemeName;
      if (this.modalForm.value.firstOrderFlag == 'Yes') {
        this.modalForm.value.firstOrderFlag = 'Y';
      }
      else if (this.modalForm.value.firstOrderFlag == 'No') {
        this.modalForm.value.firstOrderFlag = 'N';
      }
      // if (this.modalForm.value.dpc == 'Yes') {
      //   this.modalForm.value.dpc = 'Y';
      // }
      // else if (this.modalForm.value.dpc == 'No') {
      //   this.modalForm.value.dpc = 'N';
      // }
      if (this.modalForm.value.dpTransactionMode == 'Physical') {
        this.modalForm.value.dpTransactionMode = 'P';
      }
      this.modalForm.value.startDate = moment(this.modalForm.value.startDate).format(
        "DD/MM/YYYY"
      );
      this.modalForm.value.param2 = moment(this.modalForm.value.param2).format(
        "DD/MM/YYYY"
      );
      delete this.modalForm.value.param2;
      this._brokerTransactionsService.placeSipOrder(this.modalForm.value, this.userId).subscribe(data => {
        if (data) {
          this.placeOrderMessage = data.message;
          this.isOrderPlaced = this.placeOrderMessage.charAt(this.placeOrderMessage.length - 3);
          let arraySplitMessage = this.placeOrderMessage.split("|");
          this.successfulOrderPlacedMessage = arraySplitMessage[arraySplitMessage.length - 3];
          let orderNoMessage = arraySplitMessage[arraySplitMessage.length - 4];
          if (this.isOrderPlaced == 0) {
            const dialogRef = this.dialog.open(ConfirmationModalComponent, {
              width: '600px',
              data: { headingValue: 'Order placed!', textValue: 'Your Order has been placed with following order details mentioned below.', buttonValue: 'Return to Home', modalType: 'sip-transaction', orderNO: orderNoMessage, transactionType: 'SIP' },
            });
            dialogRef.afterClosed().subscribe(result => {
              if (!this.flagType) {
                if(this.role=='BROKER ADMIN'){
                  this.router.navigate(['broker']);
                }
                else{
                  this.router.navigate(['relationshipManager']);
                }
              }
              else if (this.flagType == 'Additional') {
                if(this.role=='BROKER ADMIN'){
                  this.router.navigate(['broker-client-portfolio',localStorage.getItem('client-id'),'broker']);
                }
                else{
                  this.router.navigate(['broker-client-portfolio',localStorage.getItem('client-id'),'rm']);
                }
              }
            });
          }
          else if (this.isOrderPlaced == 1) {
            window.scrollTo(0, 0);
            this.toastr.showError(this.successfulOrderPlacedMessage);
          }
        }
      }, err => {
        window.scrollTo(0, 0);
        this.toastr.showError("Error in Placing Order");
      });
    }
  }
  }
}

