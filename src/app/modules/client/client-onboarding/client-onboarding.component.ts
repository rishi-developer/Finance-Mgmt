import { ClientService } from './../service/client.service';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import {
  StepperSelectionEvent,
  STEPPER_GLOBAL_OPTIONS,
} from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {
  bankAccountDetails,
  nomineeDetails,
  taxEntry,
  countryList,
  stateList,
  accountTypes,
  sourceOfWealth,
  grossAnnualIncome,
  genders,
  holdings,
  forIndividuals,
  forNonIndividuals,
  nomineeType,
  taxStatus,
} from './client-onboarding.model';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { SelectionModel } from '@angular/cdk/collections';
import { UccActivationModalComponent } from '../ucc-activation-modal/ucc-activation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { Moment } from 'moment';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-client-onboarding',
  templateUrl: './client-onboarding.component.html',
  styleUrls: ['./client-onboarding.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class ClientOnboardingComponent implements OnInit {
  @ViewChild('mySelect') mySelect!: MatSelect;
  testingVar: boolean = false;
  details: boolean = false;
  mainHeadingValue: string = 'Client Onboarding';
  mobile: boolean = false;
  bankAccountDataSource: any;
  nomineeDetailsDataSource: any;
  taxEntryDataSource: any;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  nomineeDetailsForm: FormGroup;
  bankAccountDetailsForm: FormGroup;
  startsWithZero: boolean = false;
  bankAccountDetails = new FormArray([]);
  nomineeDetails = new FormArray([]);
  taxEntry = new FormArray([]);
  bankAccountCount: number = 0;
  nomineeDetailsCount: number = 0;
  taxEntryCount: number = 0;
  sharePercentage: number = 0;
  taxEntryForm?: FormGroup;
  displayedBankDetailsColumns: string[] = [
    'bankName',
    'accountNo',
    'accountType',
    'action',
  ];
  displayedNomineeDetailsColumns: string[] = ['nomineeName', 'share', 'action'];
  displayedTaxEntryColumns: string[] = [
    'countryName',
    'idDocumentType',
    'action',
  ];
  selection: any;
  mergedBankObj: any = {};
  mergedNomineeObj: any = {};
  mergedTaxObj: any = {};
  occupationCodeList: any = [];
  mobileDeclarationList: any = [];
  idDocumentList: any = [];
  userId: string = '';
  clientCodePreferenceList = ['Random', 'Custom'];
  public filteredCountryList: ReplaySubject<countryList[]> = new ReplaySubject<
    countryList[]
  >(1);
  public filteredOverseasCountryList: ReplaySubject<countryList[]> =
    new ReplaySubject<countryList[]>(1);
  public filteredStateList: ReplaySubject<stateList[]> = new ReplaySubject<
    stateList[]
  >(1);
  protected _onDestroy = new Subject<void>();
  countryListFilterCtrl!: FormControl;
  overseasCountryListFilterCtrl!: FormControl;
  stateListFilterCtrl!: FormControl;
  overseascountryList = [{ countryCode: '', countryName: '' }];
  countriesList = [{ countryCode: '', countryName: '' }];
  statesList = [{ stateCode: '', stateName: '' }];
  arn: any;
  selectedIndex: number = 0;
  role: string = '';
  randomClientCode!: string;
  modifiedPrimaryHolderDate: any;
  modifiedSecondHolderDate: any;
  modifiedThirdHolderDate: any;
  modifiedDOB: any;
  modifiedGuardianDOB: any;
  modifiedNomineeDate: boolean = false;
  clientId: string = '';
  clientUccData: any = {};
  clientFatcaData: any = {};
  clientBankData: any = {};
  clientNomineeData: any = {};
  clientDataCSV: any = {};
  clientFatcaTaxData: any = {};
  editClientDetails: boolean = false;
  viewBankTableDetails: boolean = false;
  disableField: boolean = false;
  disableFatcaField: boolean = false;
  proceedButtonText1: string = '';
  proceedButtonText2: string = '';
  uccHardCodedValuesObj: any = {};
  fatcaHardCodedValuesObj: any = {};
  fatcaHardCodedValuesObj1: any = {};
  clientOnboardedFrom: string = '';
  uccRegistrationParams: any;
  fatcaCheckboxValue: boolean = false;
  fatcaDetails: any;
  showTaxTable: boolean = false;
  accountTypesList = accountTypes;
  sourceOfWealthList = sourceOfWealth;
  grossAnnualIncomeList = grossAnnualIncome;
  gendersList = genders;
  holdingsList = holdings;
  forIndividualsList = forIndividuals;
  forNonIndividualsList = forNonIndividuals;
  nomineeTypeList = nomineeType;
  taxStatusList = taxStatus;
  maxDate: Date;
  minDate: Date;
  taxStatusIndividual = [
    'gender',
    'mobileDeclarationFlag',
    'emailDeclarationFlag',
    'country',
    'city',
    'state',
    'pincode',
    'primaryHolderPAN',
    'primaryHolderFirstName',
    'primaryHolderDOB',
    'indianMobileNo',
    'email',
    'occupationCode',
    'address1',
    'address2',
    'address3',
    'clientCodePreference',
    'clientCode',
  ];
  taxStatusMinor = [
    'gender',
    'guardianFirstName',
    'guardianPAN',
    'guardianDOB',
    'mobileDeclarationFlag',
    'emailDeclarationFlag',
    'pincode',
    'primaryHolderPAN',
    'primaryHolderFirstName',
    'primaryHolderDOB',
    'indianMobileNo',
    'email',
    'country',
    'city',
    'state',
    'occupationCode',
    'address1',
    'address2',
    'address3',
    'clientCodePreference',
    'clientCode',
  ];
  taxStatusHUF = [
    'dateOfIncorporation',
    'gender',
    'primaryHolderPAN',
    'primaryHolderFirstName',
    'primaryHolderDOB',
    'indianMobileNo',
    'email',
    'occupationCode',
    'address1',
    'address2',
    'address3',
    'clientCodePreference',
    'clientCode',
  ];
  taxStatusMinorNRE = [
    'gender',
    'guardianFirstName',
    'guardianPAN',
    'guardianDOB',
    'mobileDeclarationFlag',
    'emailDeclarationFlag',
    'primaryHolderPAN',
    'primaryHolderFirstName',
    'primaryHolderDOB',
    'indianMobileNo',
    'email',
    'country',
    'state',
    'occupationCode',
    'address1',
    'address2',
    'address3',
    'clientCodePreference',
    'clientCode',
    'checkbox',
  ];
  taxStatusHUFNRE = [
    'dateOfIncorporation',
    'primaryHolderPAN',
    'primaryHolderFirstName',
    'primaryHolderDOB',
    'indianMobileNo',
    'email',
    'country',
    'state',
    'occupationCode',
    'address1',
    'address2',
    'address3',
    'clientCodePreference',
    'clientCode',
    'checkbox',
  ];
  taxStatusIndividualNRE = [
    'gender',
    'mobileDeclarationFlag',
    'emailDeclarationFlag',
    'primaryHolderPAN',
    'primaryHolderFirstName',
    'primaryHolderDOB',
    'indianMobileNo',
    'email',
    'country',
    'state',
    'occupationCode',
    'address1',
    'address2',
    'address3',
    'clientCodePreference',
    'clientCode',
    'checkbox',
  ];
  taxStatusNRIOthers = [
    'country',
    'city',
    'state',
    'primaryHolderPAN',
    'primaryHolderFirstName',
    'primaryHolderDOB',
    'indianMobileNo',
    'email',
    'occupationCode',
    'address1',
    'address2',
    'address3',
    'clientCodePreference',
    'clientCode',
    'checkbox',
  ];
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  dialogValue: any;
  isRequestScreen!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private responsiveService: ResponsiveService,
    private sharedModuleService: SharedModuleService,
    private clientService: ClientService,
    private toastr: ToastrShowService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private authUserService: AuthUserService,
    private cdr: ChangeDetectorRef
  ) {
    this.firstFormGroup = this.formBuilder.group({});
    this.secondFormGroup = this.formBuilder.group({});
    this.thirdFormGroup = this.formBuilder.group({});
    this.fourthFormGroup = this.formBuilder.group({});
    this.fifthFormGroup = this.formBuilder.group({});
    this.nomineeDetailsForm = this.formBuilder.group({});
    this.bankAccountDetailsForm = this.formBuilder.group({});
    this.bankAccountDataSource = new MatTableDataSource<bankAccountDetails>([]);
    this.nomineeDetailsDataSource = new MatTableDataSource<nomineeDetails>([]);
    this.taxEntryDataSource = new MatTableDataSource<taxEntry>([]);
    this.selection = new SelectionModel<bankAccountDetails>(true, []);
    this.countryListFilterCtrl = new FormControl();
    this.overseasCountryListFilterCtrl = new FormControl();
    this.stateListFilterCtrl = new FormControl();
    this.maxDate = new Date();
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);

    const currentDate = new Date().getDate();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    this.maxDate = new Date(currentYear, currentMonth, currentDate);
    this.minDate = new Date(currentYear - 18, currentMonth, currentDate);

    this.authUserService.getUserDetailBehaviorSubject().subscribe((data) => {
      if (data) this.userId = data.userId;
      this.role = data.newRoleFinal.roleDescription;
    });

    this.route.queryParams.subscribe((queryparams) => {
      this.clientId = queryparams.clientId;
      if (this.clientId) {
        this.editClientDetails = true;
        this.fetchClientPrefilledData();
      } else {
        this.proceedButtonText1 = 'To Onboard on GemFin';
        this.proceedButtonText2 = 'To Onboard on BSE';
      }
    });
    if (!this.clientId) {
      this.setTaxStatusForm();
    }

    // Non-Edit flow
    if (!this.editClientDetails) {
      this.secondFormGroup = this.formBuilder.group({
        bankAccountDetails: this.bankAccountDetails,
      });
      this.thirdFormGroup = this.formBuilder.group({
        nomineeDetails: this.nomineeDetails,
      });
      this.addBankAccount();
      this.addNomineeDetails();
    }
    // Edit flow
    else {
      this.secondFormGroup = this.formBuilder.group({
        bankAccountDetails: new FormArray(
          this.clientBankData.map((item: any) => {
            const group = this.addBankAccount();
            group!.patchValue(item);
            return group;
          })
        ),
      });
      this.getAllBankAccounts();

      this.thirdFormGroup = this.formBuilder.group({
        nomineeDetails: new FormArray(
          this.clientNomineeData.map((item: any) => {
            const group = this.addNomineeDetails();
            group!.patchValue(item);
            return group;
          })
        ),
      });
      this.getAllNomineeDetails();
    }
    this.fourthFormGroup = this.formBuilder.group({
      clientNationality: [
        {
          value: this.clientDataCSV.clientNationality,
          disabled: this.isRequestScreen ? false : this.disableFatcaField,
        },
        [Validators.required],
      ],
      pobirinc: [
        {
          value: this.clientFatcaData.poBirInc,
          disabled: this.isRequestScreen ? false : this.disableFatcaField,
        },
        [Validators.required],
      ],
      cobirinc: [
        {
          value: this.clientFatcaData.coBirInc,
          disabled: this.isRequestScreen ? false : this.disableFatcaField,
        },
        [Validators.required],
      ],
      clientFatherName: [
        {
          value: this.clientDataCSV.clientFatherName,
          disabled: this.isRequestScreen ? false : this.disableFatcaField,
        },
      ],
      clientMotherName: [
        {
          value: this.clientDataCSV.clientMotherName,
          disabled: this.isRequestScreen ? false : this.disableFatcaField,
        },
      ],
      spname: [
        {
          value: this.clientFatcaData.spName,
          disabled: this.isRequestScreen ? false : this.disableFatcaField,
        },
      ],
      // ckyc: ['', Validators.required],
      // id1type: [''],
      // tpin1: ['', Validators.required],
      fatcaCheckbox: [
        {
          value: this.fatcaCheckboxValue,
          disabled: this.isRequestScreen ? false : this.disableFatcaField,
        },
      ],
    });
    this.addNewControls();

    this.fifthFormGroup = this.formBuilder.group({
      incslab: [
        {
          value: this.clientFatcaData.incSlab,
          disabled: this.isRequestScreen ? false : this.disableFatcaField,
        },
        [Validators.required],
      ],
      pepflag: [
        {
          value: this.clientFatcaData.pepFlag,
          disabled: this.isRequestScreen ? false : this.disableFatcaField,
        },
        [Validators.required],
      ],
      corpservs: [
        {
          value: this.clientFatcaData.corpServs,
          disabled: this.isRequestScreen ? false : this.disableFatcaField,
        },
        [Validators.required],
      ],
      srcewealt: [
        {
          value: this.clientFatcaData.srceWealt,
          disabled: this.isRequestScreen ? false : this.disableFatcaField,
        },
        [Validators.required],
      ],
    });

    this.setValidators();
    this.onResize();
    this.responsiveService.checkWidth();
    this.getOccupationCodeList();
    this.getMobileDeclarationList();
    this.getIdDocumentList();
    this.getOverseasCountriesList();
    this.getCountriesList();
    this.getStatesList();
    this.getOrganizationArn();
  }

  setTaxStatusForm() {
    if (this.clientId) {
      this?.onTaxStatusSelectionChange(this.clientDataCSV?.taxStatus);
      this.testingVar = true;
    }
    this.route.queryParams.subscribe((queryParams) => {
      const sourceScreen = queryParams.sourceScreen;
      this.isRequestScreen = sourceScreen === 'listOfRequests';
      this.firstFormGroup = this.formBuilder.group({
        taxStatus: [
          {
            value: this.clientDataCSV?.taxStatus,
            disabled: this.clientDataCSV.taxStatus != null,
          },
          Validators.required,
        ],

        gender: [this.clientDataCSV?.gender],
        indianMobileNo: [this.clientDataCSV?.indianMobileNo ?? ''],
        email: {
          value: this.clientDataCSV?.email ?? '',
          disabled: this.isRequestScreen
            ? false
            : this.clientDataCSV.email != null,
        },

        emailDeclarationFlag: [this.clientDataCSV?.emailDeclarationFlag ?? ''],
        mobileDeclarationFlag: [
          this.clientDataCSV?.mobileDeclarationFlag ?? '',
        ],
        holdingNature: [this.clientDataCSV?.holdingNature ?? ''],
        occupationCode: [
          this.clientDataCSV?.occupationCode ?? '',
          Validators.required,
        ],
        city: [this.clientDataCSV?.city ?? ''],
        state: [this.clientDataCSV?.state ?? ''],
        pincode: [this.clientDataCSV?.pincode ?? ''],
        country: [this.clientDataCSV?.country ?? ''],
        address1: [this.clientDataCSV?.address1 ?? '', Validators.required],
        address2: [this.clientDataCSV?.address2 ?? '', Validators.required],
        address3: [this.clientDataCSV?.address3 ?? '', Validators.required],
        primaryHolderFirstName: {
          value: this.clientDataCSV?.primaryHolderFirstName ?? '',
          disabled: this.isRequestScreen
            ? false
            : this.clientDataCSV.primaryHolderFirstName != null,
        },

        primaryHolderMiddleName: {
          value: this.clientDataCSV?.primaryHolderMiddleName ?? '',
          disabled: this.isRequestScreen ? false : this.editClientDetails,
        },

        primaryHolderLastName: {
          value: this.clientDataCSV?.primaryHolderLastName ?? '',
          disabled: this.isRequestScreen
            ? false
            : this.clientDataCSV.primaryHolderLastName != null,
        },

        primaryHolderDOB: {
          value: this.clientUccData?.primaryHolderDOB ?? '',
          disabled: this.isRequestScreen
            ? false
            : this.clientUccData.primaryHolderDOB != null,
        },

        primaryHolderPAN: {
          value: this.clientDataCSV?.primaryHolderPAN ?? '',
          disabled: this.isRequestScreen
            ? false
            : this.clientDataCSV.primaryHolderPAN != null,
        },

        secondHolderPan: [this.clientDataCSV?.secondHolderPAN ?? ''],
        thirdHolderPan: [this.clientDataCSV?.thirdHolderPAN ?? ''],
        secondHolderFirstName: [
          this.clientDataCSV?.secondHolderFirstName ?? '',
        ],
        secondHolderMiddleName: [
          this.clientDataCSV?.secondHolderMiddleName ?? '',
        ],
        secondHolderLastName: [this.clientDataCSV?.secondHolderLastName ?? ''],
        thirdHolderFirstName: [this.clientDataCSV?.thirdHolderFirstName ?? ''],
        thirdHolderMiddleName: [
          this.clientDataCSV?.thirdHolderMiddleName ?? '',
        ],
        thirdHolderLastName: [this.clientDataCSV?.thirdHolderLastName ?? ''],
        secondHolderDOB: [
          this.clientDataCSV?.secondHolderDOB
            ? moment(this.clientDataCSV.secondHolderDOB, 'DD/MM/YYYY').toDate()
            : '',
        ],
        secondHolderMobile: [this.clientDataCSV?.secondHolderMobile ?? ''],
        secondHolderEmail: {
          value: this.clientDataCSV?.secondHolderEmail ?? '',
          disabled: this.isRequestScreen
            ? false
            : this.clientDataCSV.secondHolderEmail !== null,
        },

        secondHolderEmailDeclaration: [this.clientDataCSV?.secondHolderEmailDeclaration ?? ''],
        secondHolderMobileDeclaration: [
          this.clientDataCSV?.secondHolderMobileDeclaration ?? '',
        ],


        thirdHolderMobile: [this.clientDataCSV?.thirdHolderMobile ?? ''],
        thirdHolderEmail: {
          value: this.clientDataCSV?.thirdHolderEmail ?? '',
          disabled: this.isRequestScreen
            ? false
            : this.clientDataCSV.thirdHolderEmail !== null,
        },

        thirdHolderEmailDeclaration: [this.clientDataCSV?.thirdHolderEmailDeclaration ?? ''],
        thirdHolderMobileDeclaration: [
          this.clientDataCSV?.thirdHolderMobileDeclaration ?? '',
        ],

        thirdHolderDOB: [''],
        clientCodePreference: {
          value: this.clientDataCSV.clientCodePreference,
          disabled: this.isRequestScreen
            ? false
            : this.clientDataCSV.clientCodePreference != null,
        },

        clientCode: {
          value: this.clientDataCSV.clientCode,
          disabled: this.isRequestScreen
            ? false
            : this.clientDataCSV.clientCode != null,
        },
        thirdHolderPANExempt: [''],
        thirdHolderKycType: [''],
        secondHolderKycType: [''],
        checkbox: [this.clientDataCSV?.checkbox ?? ''],
        foreignAddress1: [this.clientDataCSV?.foreignAddress1 ?? ''],
        foreignAddress2: [this.clientDataCSV?.foreignAddress2 ?? ''],
        foreignAddressCountry: [
          this.clientDataCSV?.foreignAddressCountry ?? '',
        ],
        foreignAddressCity: [this.clientDataCSV?.foreignAddressCity ?? ''],
        foreignAddressState: [this.clientDataCSV?.foreignAddressState ?? ''],
        foreignAddressPincode: [
          this.clientDataCSV?.foreignAddressPincode ?? '',
        ],

        guardianFirstName: [this.clientDataCSV?.guardianFirstName ?? ''],
        guardianPAN: [this.clientDataCSV?.guardianPAN ?? ''],
        guardianDOB: [
          this.clientDataCSV?.guardianDOB
            ? moment(this.clientDataCSV.guardianDOB, 'DD/MM/YYYY').toDate()
            : '',
        ],
        dateOfIncorporation: [this.clientDataCSV?.dateOfIncorporation ?? ''],
        foreignAddressResiPhone: [
          this.clientDataCSV?.foreignAddressResiPhone ?? '',
        ],

        primaryHolderExemptCategory: [
          this.clientDataCSV?.primaryHolderExemptCategory ?? '03',
        ],
        primaryHolderKRAExemptRefNo: [
          this.clientDataCSV?.primaryHolderKRAExemptRefNo ?? 'GJURUI764G',
        ],
        secondHolderPANExempt: [
          this.clientDataCSV?.secondHolderPANExempt ?? 'N',
        ],
      });
    });
  }
  /**
   * Based on the taxStatus selected, sets validation for the the input fields
   * @param selectedValue
   * @param taxArray
   */
  taxStatuschanges(selectedValue: string, taxArray: string[]) {
    for (const controlName in this.firstFormGroup.controls) {
      const control = this.firstFormGroup.get(controlName)!;
      control.setValue('');
      control.clearValidators();
      control.updateValueAndValidity();
    }
    this.firstFormGroup.controls['taxStatus']?.reset(selectedValue);
    for (const controlName of taxArray) {
      this.firstFormGroup.controls[controlName]?.setValidators(
        Validators.required
      );

      this.firstFormGroup.controls[controlName]?.updateValueAndValidity();
      if (
        !taxArray.includes('dateOfIncorporation') &&
        controlName === 'primaryHolderPAN'
      ) {
        this.firstFormGroup.controls[controlName]?.setValidators(
          Validators.pattern('[A-Z]{3}P[A-Z]{1}[0-9]{4}[A-Z]{1}')
        );
      }
      if (
        taxArray.includes('dateOfIncorporation') &&
        controlName === 'primaryHolderPAN'
      ) {
        this.firstFormGroup.controls[controlName]?.setValidators(
          Validators.pattern('[A-Z]{3}H[A-Z]{1}[0-9]{4}[A-Z]{1}')
        );
      }
    }
    this.firstFormGroup.controls['indianMobileNo']?.setValidators([
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern(/^[0-9]*$/),
    ]);
    this.firstFormGroup.controls['email']?.setValidators([
      Validators.required,
      Validators.email,
      Validators.minLength(5),
      Validators.pattern(/^\S+@\S+\.\S+$/),
      Validators.pattern('[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}'),
    ]);
  }

  /**
   * based on the tax status selected, passes the taxstatus and validations value as parameter
   * @param value
   */

  onTaxStatusSelectionChange(value: string): void {
    const selectedValue = value;

    if (selectedValue === '01') {
      this.taxStatuschanges(selectedValue, this.taxStatusIndividual);
    }

    if (selectedValue === '02') {
      this.details = true;
      this.taxStatuschanges(selectedValue, this.taxStatusMinor);
    }

    if (selectedValue === '03') {
      this.taxStatuschanges(selectedValue, this.taxStatusHUF);
    }

    if (
      selectedValue === '28' ||
      selectedValue === '26' ||
      selectedValue === '42'
    ) {
      this.details = true;
      this.taxStatuschanges(selectedValue, this.taxStatusMinorNRE);
    }

    if (selectedValue === '29' || selectedValue === '27') {
      this.taxStatuschanges(selectedValue, this.taxStatusHUFNRE);
    }

    if (
      selectedValue === '21' ||
      selectedValue === '24' ||
      selectedValue === '41' ||
      selectedValue === '61' ||
      selectedValue === '62' ||
      selectedValue === '70'
    ) {
      this.taxStatuschanges(selectedValue, this.taxStatusIndividualNRE);
    }

    if (selectedValue === '11') {
      this.taxStatuschanges(selectedValue, this.taxStatusNRIOthers);
    }
  }

  addNewControls(): void {
    if (!this.editClientDetails || this.fatcaCheckboxValue == false) {
      this.fourthFormGroup = this.formBuilder.group({
        ...this.fourthFormGroup.controls,
        taxEntry: this.taxEntry,
      });
    } else {
      this.fourthFormGroup = this.formBuilder.group({
        ...this.fourthFormGroup.controls,
        taxEntry: new FormArray(
          this.clientFatcaTaxData.map((item: any) => {
            const group = this.addTaxEntry();
            group!.patchValue(item);
            return group;
          })
        ),
      });
      this.getAllTaxEntry();
    }
  }

  validatePhoneNumber(number: any) {
    if (number.target.value[0].toString() === '0') {
      this.startsWithZero = true;
      this.firstFormGroup.controls['indianMobileNo'].setErrors({
        indianMobileNo: true,
      });
    } else {
      this.startsWithZero = false;
    }
  }

  setValidators() {
    if (
      this.firstFormGroup.value.clientCodePreference == 'Custom' ||
      this.firstFormGroup.value.clientCodePreference == ''
    ) {
      this.firstFormGroup.controls['clientCode'].setValidators(
        Validators.required
      );
    } else {
      this.firstFormGroup.controls['clientCode']?.clearValidators();
      this.firstFormGroup.controls['clientCode']?.updateValueAndValidity();
    }

    if (
      this.firstFormGroup.value.holdingNature == 'JO' ||
      this.firstFormGroup.value.holdingNature == 'AS'
    ) {
      this.firstFormGroup.controls['secondHolderPan'].setValidators([
        Validators.required,
        Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}'),
      ]);
      this.firstFormGroup.controls['secondHolderFirstName'].setValidators(
        Validators.required
      );
      this.firstFormGroup.controls['secondHolderDOB'].setValidators(
        Validators.required
      );
      this.firstFormGroup.controls['secondHolderMobile'].setValidators(
        Validators.required
      );
      this.firstFormGroup.controls['secondHolderEmail'].setValidators(
        Validators.required
      );
      this.firstFormGroup.controls['secondHolderEmailDeclaration'].setValidators(
        Validators.required
      );
      this.firstFormGroup.controls['secondHolderMobileDeclaration'].setValidators(
        Validators.required
      );
    } else if (
      this.firstFormGroup.value.holdingNature != 'JO' &&
      this.firstFormGroup.value.holdingNature != 'AS'
    ) {
      this.firstFormGroup.controls['secondHolderPan']?.clearValidators();
      this.firstFormGroup.controls['secondHolderPan']?.updateValueAndValidity();
      this.firstFormGroup.controls['secondHolderDOB']?.clearValidators();
      this.firstFormGroup.controls['secondHolderDOB']?.updateValueAndValidity();
      this.firstFormGroup.controls['secondHolderFirstName']?.clearValidators();
      this.firstFormGroup.controls[
        'secondHolderFirstName'
      ]?.updateValueAndValidity();
      this.firstFormGroup.controls['secondHolderMobile']?.clearValidators();
      this.firstFormGroup.controls['secondHolderMobile']?.updateValueAndValidity();

      this.firstFormGroup.controls['secondHolderEmail']?.clearValidators();
      this.firstFormGroup.controls['secondHolderEmail']?.updateValueAndValidity();

      this.firstFormGroup.controls['secondHolderEmailDeclaration']?.clearValidators();
      this.firstFormGroup.controls['secondHolderEmailDeclaration']?.updateValueAndValidity();


      this.firstFormGroup.controls['secondHolderMobileDeclaration']?.clearValidators();
      this.firstFormGroup.controls['secondHolderMobileDeclaration']?.updateValueAndValidity();

      this.firstFormGroup.controls['thirdHolderPan']?.clearValidators();
      this.firstFormGroup.controls['thirdHolderPan']?.updateValueAndValidity();
      this.firstFormGroup.controls['thirdHolderDOB']?.clearValidators();
      this.firstFormGroup.controls['thirdHolderDOB']?.updateValueAndValidity();
      this.firstFormGroup.controls['thirdHolderFirstName']?.clearValidators();
      this.firstFormGroup.controls[
        'thirdHolderFirstName'
      ]?.updateValueAndValidity();
    }

    if (this.firstFormGroup.value.checkbox) {
      this.firstFormGroup.controls['foreignAddress1']?.setValidators(
        Validators.required
      );
      this.firstFormGroup.controls['foreignAddress2']?.setValidators(
        Validators.required
      );
      this.firstFormGroup.controls['foreignAddressCountry']?.setValidators(
        Validators.required
      );
      this.firstFormGroup.controls['foreignAddressCity']?.setValidators(
        Validators.required
      );
      this.firstFormGroup.controls['foreignAddressState']?.setValidators(
        Validators.required
      );
      this.firstFormGroup.controls['foreignAddressPincode']?.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]*$/),
      ]);
    } else if (!this.firstFormGroup.value.checkbox) {
      this.firstFormGroup.controls['foreignAddress1']?.clearValidators();
      this.firstFormGroup.controls['foreignAddress1']?.updateValueAndValidity();
      this.firstFormGroup.controls['foreignAddress2']?.clearValidators();
      this.firstFormGroup.controls['foreignAddress2']?.updateValueAndValidity();
      this.firstFormGroup.controls['foreignAddressCountry']?.clearValidators();
      this.firstFormGroup.controls[
        'foreignAddressCountry'
      ]?.updateValueAndValidity();
      this.firstFormGroup.controls['foreignAddressCity']?.clearValidators();
      this.firstFormGroup.controls[
        'foreignAddressCity'
      ]?.updateValueAndValidity();
      this.firstFormGroup.controls['foreignAddressState']?.clearValidators();
      this.firstFormGroup.controls[
        'foreignAddressState'
      ]?.updateValueAndValidity();
      this.firstFormGroup.controls['foreignAddressPincode']?.clearValidators();
      this.firstFormGroup.controls[
        'foreignAddressPincode'
      ]?.updateValueAndValidity();
    }
    if (this.nomineeDetailsForm.value.nomineeMinorFlag == 'Y') {
      this.nomineeDetailsForm.controls['nomineeGuardian']?.setValidators(
        Validators.required
      );
      this.nomineeDetailsForm.controls['nomineeDOB']?.setValidators(
        Validators.required
      );
    } else if (this.nomineeDetailsForm.value.nomineeMinorFlag != 'Y') {
      this.nomineeDetailsForm.controls['nomineeGuardian']?.clearValidators();
      this.nomineeDetailsForm.controls[
        'nomineeGuardian'
      ]?.updateValueAndValidity();
      this.nomineeDetailsForm.controls['nomineeDOB']?.clearValidators();
      this.nomineeDetailsForm.controls['nomineeDOB']?.updateValueAndValidity();
    }
  }

  onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile: boolean) => {
      this.mobile = isMobile;
    });
  }

  backRoute() {
    if (this.role == 'BROKER ADMIN') {
      this.router.navigate(['broker']);
    } else {
      this.router.navigate(['relationshipManager']);
    }
  }

  stepChanged(event: StepperSelectionEvent) {
    if (event.previouslySelectedIndex > event.selectedIndex) {
      event.previouslySelectedStep.interacted = false;
    }
  }

  fetchClientPrefilledData() {
    this.clientUccData = JSON.parse(
      localStorage.getItem('clientUccData') || '[]'
    );
    this.clientBankData = JSON.parse(
      localStorage.getItem('clientBankData') || '[]'
    );
    this.clientNomineeData = JSON.parse(
      localStorage.getItem('clientNomineeData') || '[]'
    );
    this.clientFatcaTaxData = JSON.parse(
      localStorage.getItem('clientFatcaTaxDetails') || '[]'
    );
    this.clientDataCSV = this.clientUccData.clientDataCSV;
    if (localStorage.getItem('clientFatcaData') == 'null') {
      this.clientFatcaData = {};
    } else {
      this.clientFatcaData = JSON.parse(
        localStorage.getItem('clientFatcaData') || '[]'
      );
    }
    if (this.clientFatcaData.coBirInc == 'IN') {
      this.fatcaCheckboxValue = false;
      this.clientFatcaTaxData = {};
    } else {
      this.fatcaCheckboxValue = true;
      this.taxEntryCount = this.clientFatcaTaxData.length - 1;
    }
    // same for if client is onboarded with UCC or Onboarded through csv
    if (this.clientDataCSV.clientOnboardedFrom == 'gemfinWithUCC') {
      this.proceedButtonText2 = 'Update on both Gemfin and BSE';
      this.disableField = true;
      this.modifiedNomineeDate = true;
      // onboarded with ucc through gemfin
      if (localStorage.getItem('clientFatcaData') != 'null') {
        this.disableFatcaField = true;
        if (this.clientFatcaData.coBirInc == 'IN') {
          this.showTaxTable = false;
        } else {
          this.showTaxTable = true;
        }
      }
      // onboarded through csv
      else {
        this.disableFatcaField = false;
      }
    }
    // onboarded without ucc through gemfin
    else if (this.clientDataCSV.clientOnboardedFrom == 'gemfinWithoutUCC') {
      this.disableField = false;
      this.disableFatcaField = false;
      this.modifiedNomineeDate = true;
      this.proceedButtonText1 = 'Update on Gemfin';
      this.proceedButtonText2 = 'Update on both Gemfin and BSE';
      if (this.clientFatcaData.coBirInc != 'IN') {
        this.showTaxTable = true;
      }
    }
    this.setTaxStatusForm();
  }

  getOrganizationArn() {
    this.clientService.getOrganizationArn(this.userId).subscribe(
      (data) => {
        if (data) this.arn = data.message;
      },
      (err) => {
        this.toastr.showError('Error in loading data');
      }
    );
  }

  getOccupationCodeList() {
    this.clientService.getOccupationCodeList().subscribe(
      (data) => {
        if (data) this.occupationCodeList = data;
      },
      (err) => {
        this.toastr.showError('Error in loading data');
      }
    );
  }

  getMobileDeclarationList() {
    this.clientService.getMobileDeclarationList().subscribe(
      (data) => {
        if (data) this.mobileDeclarationList = data;
      },
      (err) => {
        this.toastr.showError('Error in loading data');
      }
    );
  }

  getIdDocumentList() {
    this.clientService.getIdDocumentList().subscribe(
      (data) => {
        if (data) this.idDocumentList = data;
      },
      (err) => {
        this.toastr.showError('Error in loading data');
      }
    );
  }

  getOverseasCountriesList() {
    this.clientService.getoverSeasCountriesList().subscribe(
      (data) => {
        if (data) {
          this.overseascountryList = data;
        }
        if (this.overseascountryList) {
          this.filteredOverseasCountryList.next(
            this.overseascountryList.slice()
          );
          this.overseasCountryListFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.filteroverSeasCountryList();
            });
        }
      },
      (err) => {
        this.toastr.showError('Error in loading data');
      }
    );
  }

  filteroverSeasCountryList() {
    if (!this.overseascountryList) {
      return;
    }
    let search = this.overseasCountryListFilterCtrl.value;
    if (!search) {
      this.filteredOverseasCountryList.next(this.overseascountryList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredOverseasCountryList.next(
      this.overseascountryList.filter(
        (countryList) =>
          countryList.countryName.toLowerCase().indexOf(search) > -1
      )
    );
  }

  getCountriesList() {
    this.clientService.getCountriesList().subscribe(
      (data) => {
        if (data) {
          this.countriesList = data;
        }
        if (this.countriesList) {
          this.filteredCountryList.next(this.countriesList.slice());
          this.countryListFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.filterCountryList();
            });
        }
      },
      (err) => {
        this.toastr.showError('Error in loading data');
      }
    );
  }

  filterCountryList() {
    if (!this.countriesList) {
      return;
    }
    let search = this.countryListFilterCtrl.value;
    if (!search) {
      this.filteredCountryList.next(this.countriesList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCountryList.next(
      this.countriesList.filter(
        (countryList) =>
          countryList.countryName.toLowerCase().indexOf(search) > -1
      )
    );
  }

  getStatesList() {
    this.clientService.getStatesList().subscribe(
      (data) => {
        if (data) this.statesList = data.sort(this.dynamicSort('stateName'));
        if (this.statesList) {
          this.filteredStateList.next(this.statesList.slice());
          this.stateListFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.filterStateList();
            });
        }
      },
      (err) => {
        this.toastr.showError('Error in loading data');
      }
    );
  }

  dynamicSort(property: any) {
    var sortOrder = 1;
    if (property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a: any, b: any) {
      /* next line works with strings and numbers,
       * and you may want to customize it to your needs
       */
      var result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  }

  filterStateList() {
    if (!this.statesList) {
      return;
    }
    let search = this.stateListFilterCtrl.value;
    if (!search) {
      this.filteredStateList.next(this.statesList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredStateList.next(
      this.statesList.filter(
        (statesList) => statesList.stateName.toLowerCase().indexOf(search) > -1
      )
    );
  }

  generateClientCode() {
    this.setValidators();
    if (this.firstFormGroup.value.clientCodePreference == 'Random') {
      this.randomClientCode = this.clientService.generate(3);
    }
  }

  selectedRow(index: any) {
    if (!this.secondFormGroup.value.checkbox) {
      this.selectedIndex = index;
    }
    if (!this.disableField) {
      this.selectedIndex = index;
    }
  }

  addBankAccount(value?: string) {
    if (this.secondFormGroup.invalid) return;
    this.getAllBankAccounts();

    // if (this.editClientDetails) {
    //   this.bankAccountCount = this.clientBankData.length - 1;
    // }
    // this.bankAccountDetailsForm = new FormGroup({

    //   bankName: new FormControl('',Validators.required),

    //   accountNo:new FormControl('',[Validators.required, Validators.pattern(/^[0-9]*$/)]),

    //   ifscCode: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]),

    //   micrNo: new FormControl(''),

    //   accountType: new FormControl('',Validators.required),

    // });
    this.bankAccountDetailsForm = this.formBuilder.group({
      bankName: ['', Validators.required],
      accountNo: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      ifscCode: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')],
      ],
      micrNo: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      accountType: ['', Validators.required],
    });

    if (value == 'add' || this.editClientDetails == false) {
      (<FormArray>this.secondFormGroup.get('bankAccountDetails')).push(
        this.bankAccountDetailsForm
      );
    }

    if (value == 'add') {
      this.bankAccountCount = this.bankAccountCount + 1;
      this.cdr.detectChanges();
    }
    this.secondFormGroup?.markAsPristine();
    return this.bankAccountDetailsForm;
  }

  editBankAccount(index: any) {
    this.bankAccountCount = index;
    let length = this.secondFormGroup.value.bankAccountDetails.length - 1;

    if (this.secondFormGroup.value.bankAccountDetails[length].bankName == '') {
      (<FormArray>this.secondFormGroup.get('bankAccountDetails')).removeAt(
        length
      );
    }
    this.getAllBankAccounts();
    this.cdr.detectChanges();
  }

  removeBankAccount(index: any) {
    (<FormArray>this.secondFormGroup.get('bankAccountDetails')).removeAt(index);
    let length = this.secondFormGroup.value.bankAccountDetails.length - 1;
    if (this.secondFormGroup.value.bankAccountDetails[length].bankName == '') {
      (<FormArray>this.secondFormGroup.get('bankAccountDetails')).removeAt(
        length
      );
      length = this.secondFormGroup.value.bankAccountDetails.length - 1;
    }
    this.bankAccountCount = length;
    if (this.bankAccountCount === -1) {
      this.addBankAccount('add');
    }
    this.getAllBankAccounts();
    this.cdr.detectChanges();
  }

  getBankAccounts(form: any) {
    return form.controls.bankAccountDetails.controls;
  }

  getAllBankAccounts() {
    this.bankAccountDataSource = new MatTableDataSource(
      this.secondFormGroup.value.bankAccountDetails
    );
  }

  addNomineeDetails(value?: string) {
    if (this.thirdFormGroup.invalid) return;
    this.getAllNomineeDetails();

    // if (this.editClientDetails) {
    //   this.nomineeDetailsCount = this.clientNomineeData.length - 1;
    // }

    this.nomineeDetailsForm = this.formBuilder.group({
      nomineeName: ['', Validators.required],
      nomineeMinorFlag: ['', Validators.required],
      nomineeRelationship: ['', Validators.required],
      nomineeApplicablePercent: [
        '',
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      nomineeDOB: [''],
      nomineeGuardian: [''],
    });
    if (value == 'add' || this.editClientDetails == false) {
      (<FormArray>this.thirdFormGroup.get('nomineeDetails')).push(
        this.nomineeDetailsForm
      );
    }

    if (value == 'add') {
      this.calculateSharedPercentage();
      this.nomineeDetailsCount = this.nomineeDetailsCount + 1;
    }
    return this.nomineeDetailsForm;
  }

  editNomineeDetails(index: any) {
    // this.nomineeDetailsCount = index + 1;
    this.nomineeDetailsCount = index;
    let length = this.thirdFormGroup.value.nomineeDetails.length - 1;
    if (
      this.thirdFormGroup.value.nomineeDetails[length]
        .nomineeApplicablePercent == ''
    ) {
      (<FormArray>this.thirdFormGroup.get('nomineeDetails')).removeAt(length);
    }
    this.getAllNomineeDetails();
    this.calculateSharedPercentage();
  }

  removeNomineeDetails(index: any) {
    (<FormArray>this.thirdFormGroup.get('nomineeDetails')).removeAt(index);
    let length = this.thirdFormGroup.value.nomineeDetails.length - 1;
    if (
      this.thirdFormGroup.value.nomineeDetails[length]
        .nomineeApplicablePercent == ''
    ) {
      (<FormArray>this.thirdFormGroup.get('nomineeDetails')).removeAt(length);
      length = this.thirdFormGroup.value.nomineeDetails.length - 1;
    }
    // this.nomineeDetailsCount = this.thirdFormGroup.value.nomineeDetails.length;
    this.nomineeDetailsCount = length;
    if (this.nomineeDetailsCount === -1) {
      this.addNomineeDetails('add');
    }
    this.getAllNomineeDetails();
    this.calculateSharedPercentage();
  }

  calculateSharedPercentage() {
    this.sharePercentage = 0;
    for (var i = 0; i < this.thirdFormGroup.value.nomineeDetails.length; i++) {
      this.sharePercentage =
        this.sharePercentage +
        Number(
          this.thirdFormGroup.value.nomineeDetails[i].nomineeApplicablePercent
        );
    }
  }

  getNomineeDetails(form: any) {
    this.calculateSharedPercentage();
    return form.controls.nomineeDetails.controls;
  }

  getAllNomineeDetails() {
    this.nomineeDetailsDataSource = new MatTableDataSource(
      this.thirdFormGroup.value.nomineeDetails
    );
  }

  addTaxEntry(value?: string) {
    if (this.fourthFormGroup.value.fatcaCheckbox) {
      // this.taxEntryCount = this.taxEntryCount + 1;
      this.getAllTaxEntry();

      this.taxEntryForm = this.formBuilder.group({
        taxres: ['', Validators.required],
        tpin: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
        idtype: ['', Validators.required],
      });

      if (
        value == 'add' ||
        this.editClientDetails == false ||
        value == 'checkboxValueChanged'
      ) {
        (<FormArray>this.fourthFormGroup.get('taxEntry')).push(
          this.taxEntryForm
        );
      }

      if (value == 'add') {
        this.taxEntryCount = this.taxEntryCount + 1;
      }
    } else {
      (this.fourthFormGroup.controls['taxEntry'] as FormArray).clear();
      this.taxEntryCount = 0;
      this.showTaxTable = false;
      this.getAllTaxEntry();
    }
    return this.taxEntryForm;
  }

  editTaxEntry(index: any) {
    // this.taxEntryCount = index + 1;
    this.taxEntryCount = index;
    let length = this.fourthFormGroup.value.taxEntry.length - 1;
    if (this.fourthFormGroup.value.taxEntry[length].taxres == '') {
      (<FormArray>this.fourthFormGroup.get('taxEntry')).removeAt(length);
    }
    this.getAllTaxEntry();
  }

  removeTaxEntry(index: any) {
    (<FormArray>this.fourthFormGroup.get('taxEntry')).removeAt(index);
    let length = this.fourthFormGroup.value.taxEntry.length - 1;
    if (this.fourthFormGroup.value.taxEntry[length].taxres == '') {
      (<FormArray>this.fourthFormGroup.get('taxEntry')).removeAt(length);
      length = this.fourthFormGroup.value.taxEntry.length - 1;
    }
    this.taxEntryCount = length;
    // this.taxEntryCount = this.fourthFormGroup.value.taxEntry.length;
    this.getAllTaxEntry();
  }

  getTaxDetails(form: any) {
    return form.controls.taxEntry.controls;
  }

  getAllTaxEntry() {
    this.taxEntryDataSource = new MatTableDataSource(
      this.fourthFormGroup.value.taxEntry
    );
  }

  firstStepperSubmit() {
    if (this.firstFormGroup.invalid) {
      return;
    }
    if (this.firstFormGroup.controls['country'].value != 'India') {
      this.firstFormGroup.controls['state'].reset('No data found');
    }

    if (!this.firstFormGroup.value.checkbox) {
      this.firstFormGroup.controls['foreignAddress1'].reset(''),
        this.firstFormGroup.controls['foreignAddress2'].reset(''),
        this.firstFormGroup.controls['foreignAddressCountry'].reset(''),
        this.firstFormGroup.controls['foreignAddressCity'].reset(''),
        this.firstFormGroup.controls['foreignAddressState'].reset(''),
        this.firstFormGroup.controls['foreignAddressPincode'].reset('');
    }
  }

  secondStepperSubmit() {
    if (this.secondFormGroup.invalid) return;

    let bankDetails: any = [];
    bankDetails = this.secondFormGroup.value.bankAccountDetails;

    for (let i = 0; i < bankDetails.length; i++) {
      if (this.selectedIndex == i) {
        bankDetails[i].defaultBankFlag = 'Y';
      } else {
        bankDetails[i].defaultBankFlag = 'N';
      }
      this.mergedBankObj['bankName' + (i + 1)] = bankDetails[i].bankName;
      this.mergedBankObj['accountNo' + (i + 1)] = bankDetails[i].accountNo;
      this.mergedBankObj['ifscCode' + (i + 1)] = bankDetails[i].ifscCode;
      this.mergedBankObj['micrNo' + (i + 1)] = bankDetails[i].micrNo;
      this.mergedBankObj['accountType' + (i + 1)] = bankDetails[i].accountType;
      this.mergedBankObj['defaultBankFlag' + (i + 1)] =
        bankDetails[i].defaultBankFlag;
    }
  }

  thirdStepperSubmit() {
    if (this.thirdFormGroup.invalid) return;

    let nomineeDetails: any = [];
    nomineeDetails = this.thirdFormGroup.value.nomineeDetails;

    for (let i = 0; i < nomineeDetails.length; i++) {
      if (nomineeDetails[i].nomineeDOB && this.modifiedNomineeDate == true) {
        nomineeDetails[i].nomineeDOB = moment(
          nomineeDetails[i].nomineeDOB
        ).format('DD/MM/YYYY');
      }
      this.mergedNomineeObj['nominee' + (i + 1) + 'Name'] =
        nomineeDetails[i].nomineeName;
      this.mergedNomineeObj['nominee' + (i + 1) + 'Relationship'] =
        nomineeDetails[i].nomineeRelationship;
      this.mergedNomineeObj['nominee' + (i + 1) + 'ApplicablePercent'] =
        nomineeDetails[i].nomineeApplicablePercent;
      this.mergedNomineeObj['nominee' + (i + 1) + 'DOB'] =
        nomineeDetails[i].nomineeDOB;
      this.mergedNomineeObj['nominee' + (i + 1) + 'MinorFlag'] =
        nomineeDetails[i].nomineeMinorFlag;
      this.mergedNomineeObj['nominee' + (i + 1) + 'Guardian'] =
        nomineeDetails[i].nomineeGuardian;
    }
    this.mergedNomineeObj['nominee1Pan'] = "";
    this.mergedNomineeObj['nominee1GuardianPan'] = "";
    this.mergedNomineeObj['nominee2Pan'] = "";
    this.mergedNomineeObj['nominee2GuardianPan'] = "";
    this.mergedNomineeObj['nominee3Pan'] = "";
    this.mergedNomineeObj['nominee3GuardianPan'] = "";
    this.mergedNomineeObj['nominationOpt'] = "Y";
    this.mergedNomineeObj['nominationAuthenticationMode'] = "O";
    this.modifiedNomineeDate = false;
  }

  fourthStepperSubmit() {
    if (this.fourthFormGroup.invalid) return;

    // values from first stepper
    this.fourthFormGroup.value.occcode =
      this.firstFormGroup.getRawValue().occupationCode;
    if (
      this.fourthFormGroup.value.occcode == '01' ||
      this.fourthFormGroup.value.occcode == '43'
    ) {
      this.fourthFormGroup.value.occtype = 'B';
    } else if (
      this.fourthFormGroup.value.occcode == '05' ||
      this.fourthFormGroup.value.occcode == '06' ||
      this.fourthFormGroup.value.occcode == '07' ||
      this.fourthFormGroup.value.occcode == '08' ||
      this.fourthFormGroup.value.occcode == '99'
    ) {
      this.fourthFormGroup.value.occtype = 'O';
    } else {
      this.fourthFormGroup.value.occtype = 'S';
    }

    // for now hardcoded
    // this.fourthFormGroup.value.datasrc = 'P';
    // this.fourthFormGroup.value.addrtype = '1';
    // this.fourthFormGroup.value.sdfflag = 'N';
    // this.fourthFormGroup.value.ubodf = 'N';
    // this.fourthFormGroup.value.newchange = 'N';
    // this.fourthFormGroup.value.exchname = 'B';
    // this.fourthFormGroup.value.uboappl = 'N';

    //if country is not India
    if (this.fourthFormGroup.getRawValue().fatcaCheckbox) {
      let taxDetails: any = [];
      taxDetails = this.fourthFormGroup.value.taxEntry;

      for (let i = 0; i < taxDetails.length; i++) {
        this.mergedTaxObj['taxres' + (i + 1)] = taxDetails[i].taxres;
        this.mergedTaxObj['tpin' + (i + 1)] = taxDetails[i].tpin;
        this.mergedTaxObj['id' + (i + 1) + 'type'] = taxDetails[i].idtype;
      }
      // let mergedFourthFormObject = Object.assign(this.fourthFormGroup.value, this.mergedTaxObj);
      // delete mergedFourthFormObject.taxEntry;
    }
  }

  dateChange1() {
    this.modifiedPrimaryHolderDate = moment(
      this.firstFormGroup.value.primaryHolderDOB
    ).format('DD/MM/YYYY');
  }

  dateChange2() {
    this.modifiedSecondHolderDate = moment(
      this.firstFormGroup.value.secondHolderDOB
    ).format('DD/MM/YYYY');
  }

  dateChange3() {
    this.modifiedThirdHolderDate = moment(
      this.firstFormGroup.value.thirdHolderDOB
    ).format('DD/MM/YYYY');
  }

  dateChange4() {
    this.modifiedNomineeDate = true;
  }
  dobchange() {
    this.modifiedDOB = moment(this.firstFormGroup.value.dob).format(
      'DD/MM/YYYY'
    );
  }

  guardianDOBchange() {
    this.modifiedGuardianDOB = moment(
      this.firstFormGroup.value.guardianDOB
    ).format('DD/MM/YYYY');
  }

  firstStepperValueChanges(uccCreation: string) {
    if (!this.editClientDetails) {
      this.firstFormGroup.value.primaryHolderDOB =
        this.modifiedPrimaryHolderDate;
      this.firstFormGroup.value.secondHolderDOB = this.modifiedSecondHolderDate;
      this.firstFormGroup.value.thirdHolderDOB = this.modifiedThirdHolderDate;
    } else {
      if (this.firstFormGroup.getRawValue().primaryHolderDOB)
        this.modifiedPrimaryHolderDate = moment(
          this.firstFormGroup.getRawValue().primaryHolderDOB
        ).format('DD/MM/YYYY');
      if (this.firstFormGroup.getRawValue().secondHolderDOB)
        this.modifiedSecondHolderDate = moment(
          this.firstFormGroup.getRawValue().secondHolderDOB
        ).format('DD/MM/YYYY');
      if (this.firstFormGroup.getRawValue().thirdHolderDOB)
        this.modifiedThirdHolderDate = moment(
          this.firstFormGroup.getRawValue().thirdHolderDOB
        ).format('DD/MM/YYYY');
    }
    //in case of Joint/ Anyone or Survivor holding
    if (
      this.firstFormGroup.value.holdingNature == 'JO' ||
      this.firstFormGroup.value.holdingNature == 'AS'
    ) {
      this.firstFormGroup.value.secondHolderPANExempt = 'N';
      this.firstFormGroup.value.secondHolderKycType = 'E';

      delete this.firstFormGroup.value.thirdHolderFirstName;
      delete this.firstFormGroup.value.thirdHolderMiddleName;
      delete this.firstFormGroup.value.thirdHolderLastName;
      delete this.firstFormGroup.value.thirdHolderDOB;
      delete this.firstFormGroup.value.thirdHolderPan;
    }

    // in case of Single/Joint/Anyone or Survivor holding
    // this.fourthFormGroup.value.panrp = this.firstFormGroup.value.primaryHolderPAN;
    // this.fourthFormGroup.value.invname = this.firstFormGroup.value.primaryHolderFirstName + this.firstFormGroup.value.primaryHolderMiddleName + this.firstFormGroup.value.primaryHolderLastName;

    // if country is India
    if (this.fourthFormGroup.getRawValue().cobirinc == 'IN') {
      // this.fourthFormGroup.value.taxres1 = this.fourthFormGroup.value.cobirinc,
      // this.fourthFormGroup.value.tpin1 = this.firstFormGroup.value.primaryHolderPAN,
      // this.fourthFormGroup.value.id1type = "C";
      this.fatcaHardCodedValuesObj1 = {
        id1type: 'C',
        tpin1: this.firstFormGroup.getRawValue().primaryHolderPAN,
        taxres1: this.fourthFormGroup.getRawValue().cobirinc,
      };
    } else {
      this.fatcaHardCodedValuesObj1 = Object.assign(this.mergedTaxObj);
    }

    if (this.firstFormGroup.value.clientCodePreference == 'Random') {
      this.firstFormGroup.value.clientCode = this.randomClientCode;
      //this.firstFormGroup.controls['clientCode'].reset(this.randomClientCode)
    }
    //if uccCreation is false
    if (uccCreation == 'false') {
      delete this.firstFormGroup.value.clientCode;
      delete this.firstFormGroup.value.clientCodePreference;
    }

    // sending 3 fifth form group value in first form group
    // this.firstFormGroup.value.clientNationality=this.fourthFormGroup.getRawValue().clientNationality;
    // this.firstFormGroup.value.clientMotherName=this.fourthFormGroup.getRawValue().clientMotherName;
    // this.firstFormGroup.value.clientFatherName=this.fourthFormGroup.getRawValue().clientFatherName;

    //for now harcoded

    this.uccHardCodedValuesObj = {
      // secondHolderPANExempt:
      clientType: 'P',
      divPayMode: '04',
      communicationMode: 'E',
      primaryHolderKycType: 'E',
      paperless_flag: 'Z',
      primaryHolderPANExempt: 'N',
      clientNationality: this.fourthFormGroup.getRawValue().clientNationality,
      clientMotherName: this.fourthFormGroup.getRawValue().clientMotherName,
      clientFatherName: this.fourthFormGroup.getRawValue().clientFatherName,
      primaryHolderDOB: this.modifiedPrimaryHolderDate,
      secondHolderDOB: this.modifiedSecondHolderDate,
      thirdHolderDOB: this.modifiedThirdHolderDate,
      guardianDOB: this.modifiedGuardianDOB,
      guardianKycType: this.details == true ? 'E' : '',
      guardianPANExempt: this.details == true ? 'N' : '',
    };
    if (this.editClientDetails) {
      if (uccCreation == 'true') {
        this.clientOnboardedFrom = 'gemfinWithUCC';
      } else {
        this.clientOnboardedFrom = 'gemfinWithoutUCC';
      }
      let uccHardCodedValuesObj2 = {
        clientOnboardedFrom: this.clientOnboardedFrom,
      };
      this.uccHardCodedValuesObj = Object.assign(
        this.uccHardCodedValuesObj,
        uccHardCodedValuesObj2
      );
    }
    this.fatcaHardCodedValuesObj = {
      datasrc: 'P',
      addrtype: '1',
      sdfflag: 'N',
      ubodf: 'N',
      newchange: 'N',
      exchname: 'B',
      uboappl: 'N',
      id1type: 'C',
      taxstatus: this.firstFormGroup.getRawValue().taxStatus,
      occtype: this.fourthFormGroup.value.occtype,
      occcode: this.firstFormGroup.getRawValue().occupationCode,
      panrp: this.firstFormGroup.getRawValue().primaryHolderPAN,
      invname:
        this.firstFormGroup.getRawValue().primaryHolderFirstName +
        this.firstFormGroup.getRawValue().primaryHolderMiddleName +
        this.firstFormGroup.getRawValue().primaryHolderLastName,
    };
    this.fatcaHardCodedValuesObj = Object.assign(
      this.fatcaHardCodedValuesObj,
      this.fatcaHardCodedValuesObj1
    );
  }

  onboardClient(uccCreation: string, proceedButtonText: string) {
    if (this.fifthFormGroup.invalid) return;

    this.firstStepperValueChanges(uccCreation);
    // this.firstFormGroup.value.email=this.firstFormGroup.value.email.toLowerCase();

    if (
      this.editClientDetails &&
      (this.clientDataCSV?.taxStatus === '61' ||
        this.clientDataCSV?.taxStatus === '41' ||
        this.clientDataCSV?.taxStatus === '62' ||
        this.clientDataCSV?.taxStatus === '70')
    ) {
      this.firstFormGroup.controls['thirdHolderPan'].reset('');
      this.firstFormGroup.controls['thirdHolderFirstName'].reset('');

      if (this.firstFormGroup.value.secondHolderFirstName === '') {
        this.firstFormGroup.controls['secondHolderKycType'].reset('');
      } else {
        this.firstFormGroup.controls['secondHolderKycType'].reset('E');
      }
    }

    if (this.editClientDetails) {
      this.uccRegistrationParams = Object.assign(
        this.firstFormGroup.getRawValue(),
        {
          clientCode:
            this.clientDataCSV.clientCode == null
              ? this.randomClientCode
              : this.clientDataCSV.clientCode,
        },
        {
          secondHolderPANExempt:
            this.firstFormGroup.value.holdingNature == 'JO' ||
            this.firstFormGroup.value.holdingNature == 'AS'
              ? 'N'
              : '',
        },
        {
          secondHolderKycType:
            this.firstFormGroup.value.holdingNature == 'JO' ||
            this.firstFormGroup.value.holdingNature == 'AS'
              ? 'E'
              : '',
        },
        this.uccHardCodedValuesObj,
        this.mergedBankObj,
        this.mergedNomineeObj
      );
      if (uccCreation == 'false') {
        delete this.uccRegistrationParams.clientCode;
        delete this.uccRegistrationParams.clientCodePreference;
      }
    } else {
      this.uccRegistrationParams = Object.assign(
        this.firstFormGroup.value,
        this.uccHardCodedValuesObj,
        this.mergedBankObj,
        this.mergedNomineeObj
      );
    }

    this.fatcaDetails = Object.assign(
      this.fourthFormGroup.getRawValue(),
      this.fatcaHardCodedValuesObj,
      this.fifthFormGroup.getRawValue()
    );
    delete this.fatcaDetails.taxEntry;

    // Fresh client onboard
    if (!this.editClientDetails) {
      const dialogData = {
        title: `Are you sure you want to ${proceedButtonText} ?`,
      };
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '25rem',
        data: dialogData,
        disableClose: true,
        backdropClass: 'addBackdrop',
        hasBackdrop: true,
      });

      dialogRef
        .afterClosed()
        .toPromise()
        .then((result) => {
          this.dialogValue = result.res;
          if (this.dialogValue) {
            this.clientService
              .onboardClient(
                this.uccRegistrationParams,
                this.userId,
                'NEW',
                uccCreation,
                this.fatcaDetails
              )
              .subscribe(
                (data) => {
                  if (data) {
                    if (this.role == 'RELATIONSHIP MANAGER') {
                      uccCreation = 'false';
                      let clientOnboardingResponse = JSON.parse(
                        data.clientOnboardingResponse
                      );
                      let status = clientOnboardingResponse.Status;
                      if (status == '0') {
                        this.toastr.showSuccess(
                          'Client was onboarded successfully. To activate UCC kindly raise a request.'
                        );
                        this.backRoute();
                      }
                    } else if (uccCreation == 'true') {
                      let fatcaResponse = data.fatcaResponse.split('|');
                      let clientOnboardingResponse = JSON.parse(
                        data.clientOnboardingResponse
                      );
                      let status = clientOnboardingResponse.Status;
                      let clientUserId = clientOnboardingResponse.clientUserId;
                      if (status == '0' && fatcaResponse[0] == '100') {
                        this.toastr.showSuccess(
                          'Client Registered and UCC created successfully'
                        );

                        // in case of single holding
                        let uccActivationObj = {
                          clientId: clientUserId,
                          clientFirstName:
                            this.firstFormGroup.value.primaryHolderFirstName,
                          clientMiddleName:
                            this.firstFormGroup.value.primaryHolderMiddleName,
                          clientLastName:
                            this.firstFormGroup.value.primaryHolderLastName,
                        };
                        const dialogRef = this.dialog.open(
                          UccActivationModalComponent,
                          {
                            width: '1024px',
                            data: { modalData: uccActivationObj },
                            panelClass: 'modal-styling',
                          }
                        );
                        dialogRef.afterClosed().subscribe((result) => {
                          this.backRoute();
                        });
                      } else if (status == '1' && fatcaResponse[0] == '101') {
                        this.toastr.showError(
                          clientOnboardingResponse.Remarks +
                            '  and  ' +
                            fatcaResponse[1]
                        );
                      } else if (status == '1' && fatcaResponse[0] == '100') {
                        this.toastr.showError(clientOnboardingResponse.Remarks);
                      } else if (fatcaResponse[0] == '101' && status == '0') {
                        this.toastr.showError(fatcaResponse[1]);
                      }
                    } else if (uccCreation == 'false') {
                      this.toastr.showSuccess('Client onboarded successfully');
                      this.backRoute();
                    }
                  }
                },
                (err) => {
                  this.toastr.showError('Error in registering client');
                }
              );
          }
        });
    }

    // edit client details
    else {
      const dialogData = {
        title: `Are you sure you want to ${proceedButtonText} ?`,
      };
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '25rem',
        data: dialogData,
        disableClose: true,
        backdropClass: 'addBackdrop',
        hasBackdrop: true,
      });

      dialogRef
        .afterClosed()
        .toPromise()
        .then((result) => {
          this.dialogValue = result.res;
          if (this.dialogValue) {
            this.clientService
              .updateClientDetails(
                this.uccRegistrationParams,
                this.clientId,
                String(this.clientDataCSV.clientDataCSVId),
                uccCreation,
                this.fatcaDetails
              )
              .subscribe(
                (res: any) => {
                  if (res) {
                    if (uccCreation == 'true') {
                      let message = JSON.parse(res.message);
                      let statusCode = message.Status;
                      let remarks = message.Remarks;
                      if (statusCode == '1') {
                        window.scrollTo(0, 0);
                        this.toastr.showError(remarks);
                      } else {
                        this.toastr.showSuccess(
                          'Clients details Updated Successfully'
                        );
                        this.router.navigate([
                          'broker-client-portfolio',
                          this.clientId,
                        ]);
                      }
                    } else {
                      this.toastr.showSuccess(
                        'Clients details Updated Successfully'
                      );
                      this.router.navigate([
                        'broker-client-portfolio',
                        this.clientId,
                      ]);
                    }
                  }
                },
                (err) => {
                  this.toastr.showError('Error in updating client details');
                }
              );
          }
        });
    }
  }
}
