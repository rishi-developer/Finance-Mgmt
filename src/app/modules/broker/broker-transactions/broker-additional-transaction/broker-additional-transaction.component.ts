import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { BrokerTransactionsService } from './../services/broker-transactions.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-broker-additional-transaction',
  templateUrl: './broker-additional-transaction.component.html',
  styleUrls: ['./broker-additional-transaction.component.css']
})
export class BrokerAdditionalTransactionComponent implements OnInit {
  mainHeadingValue: string = 'Transactions';
  modalForm: FormGroup;
  euinDeclarationOptions = ['Yes', 'No'];
  actionOptions: any = [];
  clientId: string = '';
  fundName: string = '';
  transactionType: string = '';
  modeOfAction: string = '';
  viewDetail: any = {
  };
  buySell?: string
  // submitted:boolean=false;
  viewForm: any;
  placeOrderMessage: any;
  placeOrderMessage2: any;
  placeOrderMessage3: any;
  isOrderPlaced: any;
  accountNumber?: string;
  successfulOrderPlacedMessage: any;
  partnerId!: string;
  clientNameModal: any;
  amountVal: any;
  accounNoList: any;
  popUpType: any;
  AmountModalType: any;
  userId: string = '';
  folioNumber: string = '';
  euinList: any;
  fundSchemeCode: any;
  clientBalanceAmount: any;
  clientBalanceUnits: any;
  defaultBankAccount = 0;
  role:string='';
  euinNumber:string='';
  selectedFundDetails:string='';
  
  constructor(private formBuilder: FormBuilder,
    private _brokerTransactionsService: BrokerTransactionsService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private toastr: ToastrShowService,
    private authUserService: AuthUserService,
    private sharedModuleService: SharedModuleService,
  ) {
    this.modalForm = this.formBuilder.group({});
    this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);
  }

  ngOnInit(): void {

    this.authUserService.getUserDetailBehaviorSubject().subscribe(data => {
      if (data) {
        this.userId = data.userId;
        this.role = data.newRoleFinal.roleDescription;
      }
    });

    this.partnerId = localStorage.getItem('partner-Id') as unknown as string;
    this.route.paramMap.subscribe((params: any) => {
      this.transactionType = params.get?.('selectedAction');
      if (this.transactionType == 'Purchase') {
        this.modeOfAction = 'Purchase';
        this.buySell = 'P';
        this.actionOptions = ['Amount (₹)', 'No. of Units'];
      }
      else if (this.transactionType == 'Redeem') {
        this.modeOfAction = 'Redemption';
        this.buySell = 'R';
        this.actionOptions = ['No. of Units', 'Amount (₹)', 'All redeem'];
      }
    });
    this.route.queryParams.subscribe(queryparams => {
      this.clientId = queryparams.clientId;
      this.fundName = queryparams.fundName;
      this.folioNumber = queryparams.folioNumber;
      this.fundSchemeCode = queryparams.schemeCode;
      this.selectedFundDetails=this.fundSchemeCode + " " +this.fundName;
    });
    this.getTransactionsDetails().then((res: any) => {
      if (res) {
        this.viewForm = res;
        if (this.modeOfAction == 'Redemption') {
          this.accountNumber = this.viewDetail.bankAccountNo;
        }
        else if (this.modeOfAction == 'Purchase') {
          this.accountNumber = '';
        }
        if (this.viewForm) {
          this.modalForm = this.formBuilder.group({
            transCode: ['NEW'],
            selectedAction: [''],
            selectedPurchaseAction: ['Amount (₹)', Validators.required],
            EUIN: [''],
            buySell: [this.buySell],
            orderVal: [''],
            qty: [''],
            buySellType: ['ADDITIONAL'],
            DPC: ['Y'],
            clientCode: [this.viewDetail.clientId],
            DPTxn: ['P'],
            EUINval: ['Y'],
            // EUINval:['',Validators.required],
            KYCstatus: ['Y'],
            minRedeem: ['Y'],
            schemeName:[''],
            // schemeName: [this.fundName],
            schemeCode:[this.fundSchemeCode],
            folioNo: [this.folioNumber],
            // accountNo:[this.accountNumber],
            // remarks:['',Validators.required],
            remarks: [''],
            accountNo: ['']
          });
          this.setValidation();
        }
      }
    });
    this.getclientBankDetails();
    this.getEuinList();

    if (this.modeOfAction == 'Redemption') {
      this.getClientBalanceAmount();
    }

  }

  getTransactionsDetails() {
    var gotTransactionDetails = new Promise((resolve, reject) => {
      this._brokerTransactionsService.getClientsList(this.clientId, this.userId).subscribe(data => {
        if (data) {
          this.viewDetail.kycStatus = data[0].clientKYCStatus;
          // if(this.viewDetail.kycStatus=='Y'){
          //   this.viewDetail.kycStatus='Yes';
          // }
          // else{
          //   this.viewDetail.kycStatus='No';
          // }
          // this.accounNoList  = data.bankAccountNoList,
          this.viewDetail.clientId = data[0].clientCodeBSE;
          // this.viewDetail.clientName=data.clientName;
          if (data[0].clientMiddleName != null) {
            this.viewDetail.combinedclientDetails = data[0].clientPan + " -- " + data[0].clientFirstName + " " + data[0].clientMiddleName + " " + data[0].clientLastName;
          }
          else {
            this.viewDetail.combinedclientDetails = data[0].clientPan + " -- " + data[0].clientFirstName + " " + data[0].clientLastName;
          }
          this.viewDetail.emailId = data[0].clientEmail,
            this.viewDetail.phoneNo = data[0].clientPhoneNo,
            // this.viewDetail.bankAccountNo=data.bankAccountNo,
            // this.viewDetail.bankAccountNo=this.modalForm.value.accountNo
            // this.viewDetail.fundName=data.fundName,
            // this.viewDetail.folioNo=data.folioNo;
            this.clientNameModal = data[0].clientFirstName + " " + data[0].clientLastName;
        }
        resolve(true);
      });
    });
    return gotTransactionDetails;
  }

  // getclientBankAccountDetails(){
  //   this._brokerTransactionsService.getclientBankAccountDetails(this.clientId).subscribe(data => {
  //     if(data){
  //       this.accounNoList = data;
  //     }
  //   }, err => {
  //     this.toastr.error("Error in loading data");
  //   });
  // }


  getclientBankDetails() {
    this.sharedModuleService.getBankData(this.clientId).subscribe(data => {
      if (data) {
        this.accounNoList = data
        data.map((item: any) => {
          if (item.defaultBankFlag == "Y") {
            this.defaultBankAccount = item.accountNo
          }
        })
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


  setValidation() {
    if(this.role!='RELATIONSHIP MANAGER'){
      this.modalForm.controls["EUIN"].setValidators(Validators.required);
    }

    if (this.modeOfAction == 'Redemption') {
      // this.modalForm.controls["minRedeem"].setValidators(Validators.required);
      this.modalForm.controls["selectedAction"].setValidators(Validators.required);
      this.modalForm.controls["accountNo"].setValidators(Validators.required);

      if (this.modalForm.value.selectedAction == 'No. of Units') {
        this.modalForm.controls["qty"].setValidators([Validators.min(1), Validators.required]);
        this.modalForm.controls["orderVal"].clearValidators();
        this.modalForm.controls["orderVal"].updateValueAndValidity();
      }
      else if (this.modalForm.value.selectedAction == 'Amount (₹)') {
        this.modalForm.controls["orderVal"].setValidators([Validators.min(1), Validators.required]);
        this.modalForm.controls["qty"].clearValidators();
        this.modalForm.controls["qty"].updateValueAndValidity();
      }
      else if (this.modalForm.value.selectedAction == 'All redeem') {
        this.modalForm.controls["orderVal"].clearValidators();
        this.modalForm.controls["orderVal"].updateValueAndValidity();
        this.modalForm.controls["qty"].clearValidators();
        this.modalForm.controls["qty"].updateValueAndValidity();
      }
      // if(this.modalForm.value.EUINval=='Yes'){
      //   this.modalForm.controls['EUIN'].enable();
      // }
      // else if(this.modalForm.value.EUINval=='No'){
      //   this.modalForm.controls['EUIN'].disable();
      // }
    }
    else if (this.modeOfAction == 'Purchase') {
      // this.modalForm.controls["DPC"].setValidators(Validators.required);
      this.modalForm.controls["orderVal"].setValidators([Validators.min(1), Validators.required]);
      // if(this.modalForm.value.EUINval=='Yes'){
      //   this.modalForm.controls['EUIN'].enable();
      // }
      // else if(this.modalForm.value.EUINval=='No'){
      //   this.modalForm.controls['EUIN'].disable();
      // }
    }
  }

  getClientBalanceAmount() {
    this._brokerTransactionsService.getUserBalanceAmount(this.clientId, this.fundSchemeCode).subscribe(data => {
      if (data) {
        this.clientBalanceAmount = data.total_Amount
        this.clientBalanceUnits = data.total_Units
      }
    }, err => {
      this.toastr.showError("Error in loading data");
    });
  }


  onReset() {
    window.location.reload();
  }

  onSubmit() {
    if (this.modalForm.invalid)
      return;


    if (this.modeOfAction == 'Purchase') {
      this.popUpType = 'Additional Purchase'
    }
    else {
      this.popUpType = 'Redemption'
    }


    if (this.modalForm.value.orderVal == "" && this.modalForm.value.selectedAction != "All redeem") {
      this.amountVal = this.modalForm.value.qty;
      this.AmountModalType = "No. of Units";
    }
    else if (this.modalForm.value.selectedAction == "All redeem") {
      this.amountVal = "All redeem";
      this.AmountModalType = "Amount";
    }
    else {
      this.amountVal = this.modalForm.value.orderVal;
      this.AmountModalType = "Amount";
    }

    if(this.role=='RELATIONSHIP MANAGER'){
      this.modalForm.value.EUIN = this.euinNumber;
    }

    localStorage.setItem('amount', this.amountVal)
    let transactionType = this.modalForm.value.buySellType.toLowerCase();
    localStorage.setItem('transtype', transactionType)
    // let scheme = this.modalForm.value.schemeCode
    let scheme ="( " + this.fundSchemeCode + " )"+ " - "+ this.fundName;
    localStorage.setItem('schemeType', scheme)
    let mode = 'Physical'
    localStorage.setItem('modeType', mode)
    let installAmount1 = this.modalForm.value.installmentAmount
    localStorage.setItem('installAmountType', installAmount1)
    localStorage.setItem('ClientType', this.clientNameModal)
    let clientEmail = this.viewDetail.emailId;
    localStorage.setItem('clientEmail', clientEmail);

    // this.submitted == true;

    // if (this.modalForm.value.minRedeem == 'Yes') {
    //   this.modalForm.value.minRedeem = 'Y';
    // }
    // else if (this.modalForm.value.minRedeem == 'No') {
    //   this.modalForm.value.minRedeem = 'N';
    // }
    // if (this.modalForm.value.DPC == 'Yes') {
    //   this.modalForm.value.DPC = 'Y';
    // }
    // else if (this.modalForm.value.DPC == 'No') {
    //   this.modalForm.value.DPC = 'N';
    // }
    if (this.modeOfAction == 'Purchase') {
      this.modalForm.value.minRedeem = 'N';
    }
    else if (this.modeOfAction == 'Redemption') {
      this.modalForm.value.DPC = 'N'
    }
    // if(this.modalForm.value.EUINval=='Yes'){
    //   this.modalForm.value.EUINval='Y';
    // }
    // else if(this.modalForm.value.EUINval=='No'){
    //   this.modalForm.value.EUINval='N';
    // }
    if (this.modalForm.value.selectedAction != 'All redeem' && this.modeOfAction == 'Redemption') {
      this.modalForm.value.allRedeem = 'N';
    }
    else if (this.modalForm.value.selectedAction == 'All redeem' && this.modeOfAction == 'Redemption') {
      this.modalForm.value.allRedeem = 'Y';
    }
    if (this.modalForm.value.selectedPurchaseAction != 'All redeem' && this.modeOfAction == 'Purchase') {
      this.modalForm.value.allRedeem = 'N';
    }
    else if (this.modalForm.value.selectedPurchaseAction == 'All redeem' && this.modeOfAction == 'Purchase') {
      this.modalForm.value.allRedeem = 'Y';
    }

    this.modalForm.value.qty = String(this.modalForm.value.qty)
    this.modalForm.value.orderVal = String(this.modalForm.value.orderVal)

    this._brokerTransactionsService.placeOrder(this.modalForm.value, this.userId).subscribe(data => {
      if (data) {
        this.placeOrderMessage = data.message;
        this.isOrderPlaced = this.placeOrderMessage.charAt(this.placeOrderMessage.length - 1);
        let arraySplitMessage = this.placeOrderMessage.split("|");
        let orderNoMessage = arraySplitMessage[arraySplitMessage.length - 6];
        this.placeOrderMessage2 = data.message;
        let arraySplitMessage2 = this.placeOrderMessage2.split(" ");

        this.placeOrderMessage3 = data.message;
        let arraySplitMessage3 = this.placeOrderMessage2.split(" ");
        let var1 = arraySplitMessage3.indexOf("SCHEME:")
        // let schemeCodeMessage = arraySplitMessage3[var1 + 1]
        this.successfulOrderPlacedMessage = arraySplitMessage[arraySplitMessage.length - 2];
        if (this.isOrderPlaced == 0) {
          const dialogRef = this.dialog.open(ConfirmationModalComponent, {
            width: '600px',
            data: { headingValue: 'Order placed', textValue: 'Your Order has been placed with following order details mentioned below.', buttonValue: 'Return to Home', modalType: 'additional-transaction', clientId: this.clientId, orderNO: orderNoMessage,transactionType: this.popUpType, AmountType: this.AmountModalType },
          });
          dialogRef.afterClosed().subscribe(result => {
            if(this.role=='BROKER ADMIN'){
              this.router.navigate(['broker-client-portfolio', this.clientId, 'broker']);
            }
            else{
              this.router.navigate(['broker-client-portfolio',this.clientId,'rm']);
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
