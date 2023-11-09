export interface BrokerAdminClientList {
  clientUserId: string;
  panNo: string;
  clientFirstName: string;
  clientMiddleName: string | null;
  clientLastName: string | null;
  portfolioValue: string;
  investedValue: string;
  assignedRMUserId: string;
  assignedRMFirstName: string;
  assignedRMMiddleName: string;
  assignedRMLastName: string;
  clientUCCActivation: boolean | null;
  clientCodeBse: string | null;
}

export interface BrokerAdminRequestsList {
  requestId: number;
  typeOfAction: string;
  clientFirstName: string;
  clientMiddleName: string | null;
  clientLastName: string | null;
  clientUserId: string;
  rmUserId: string;
  rmFirstName: string;
  rmMiddleName: string;
  rmLastName: string;
  requestDate: number;
  actionDate: number | null;
  actionBy: string | null;
  requestStatus: number;
  organizationId: number;
}

export interface NomineeDetails {
  nomineeName: string;
  nomineeMinorFlag: string;
  nomineeRelationship: string;
  nomineeApplicablePercent: string;
  nomineeDOB: string;
  nomineeGuardian: string;
}

export interface BankAccount {
  accountType: string;
  accountNo: string;
  ifscCode: string;
  micrNo: string;
  bankName: string;
  bankBranch: string | null;
  defaultBankFlag: string;
}

export interface FatcaDetails {
  panRp: string;
  pekrn: string | null;
  invName: string;
  dob: string | null;
  frName: string | null;
  spName: string;
  taxStatus: string;
  dataSrc: string;
  addrType: string;
  poBirInc: string;
  coBirInc: string;
  taxRes1: string;
  tpin1: string;
  id1Type: string;
  taxRes2: string | null;
  tpin2: string | null;
  id2Type: string | null;
  taxRes3: string | null;
  tpin3: string | null;
  id3Type: string | null;
  taxRes4: string | null;
  tpin4: string | null;
  id4Type: string | null;
  srceWealt: string;
  corpServs: string;
  incSlab: string;
  netWorth: string | null;
  nwDate: string | null;
  pepFlag: string;
  occCode: string;
  occType: string;
  exempCode: string | null;
  ffiDrnfe: string | null;
  giinNo: string | null;
  sprEntity: string | null;
  giinNa: string | null;
  giinExemc: string | null;
  nffeCatg: string | null;
  actNfeSc: string | null;
  natureBus: string | null;
  relListed: string | null;
  exchName: string;
  uboAppl: string;
  uboCount: string | null;
  uboName: string | null;
  uboPan: string | null;
  uboNation: string | null;
  uboAdd1: string | null;
  uboAdd2: string | null;
  uboAdd3: string | null;
  uboCity: string | null;
  uboPin: string | null;
  uboState: string | null;
  uboCntry: string | null;
  uboAddTy: string | null;
  uboCtr: string | null;
  uboTin: string | null;
  uboIdTy: string | null;
  uboCob: string | null;
  uboDob: string | null;
  uboGender: string | null;
  uboFrNam: string | null;
  uboOcc: string | null;
  uboOccTy: string | null;
  uboTel: string | null;
  uboMobile: string | null;
  uboCode: string | null;
  uboHolPc: string | null;
  sdfFlag: string;
  uboDf: string;
  aadhaarRp: string | null;
  newChange: string;
  logName: string | null;
  filler1: string | null;
  filler2: string | null;
}

export interface ClientPersonalOtherDetails {
  clientDataCSV: {
    clientDataCSVId: number;
    memberCode: string | null;
    clientCode: string | null;
    primaryHolderFirstName: string;
    primaryHolderMiddleName: string;
    primaryHolderLastName: string;
    taxStatus: string;
    gender: string;
    primaryHolderDOB: string;
    occupationCode: string;
    holdingNature: string;
    secondHolderFirstName: string;
    secondHolderMiddleName: string;
    secondHolderLastName: string;
    thirdHolderFirstName: string;
    thirdHolderMiddleName: string;
    thirdHolderLastName: string;
    secondHolderDOB: string | null;
    thirdHolderDOB: string | null;
    guardianFirstName: string;
    guardianMiddleName: string | null;
    guardianLastName: string | null;
    guardianDOB: string | null;
    primaryHolderPANExempt: string;
    secondHolderPANExempt: string | null;
    thirdHolderPANExempt: string | null;
    guardianPANExempt: string | null;
    primaryHolderPAN: string;
    secondHolderPAN: string | null;
    thirdHolderPAN: string | null;
    guardianPAN: string | null;
    primaryHolderExemptCategory: string | null;
    secondHolderExemptCategory: string | null;
    thirdHolderExemptCategory: string | null;
    guardianExemptCategory: string | null;
    clientType: string;
    defaultDP: string | null;
    accountType1: string;
    accountNo1: string;
    bankName1: string;
    bankBranch1: string | null;
    defaultbankFlag1: string;
    bank1CreatedAt: string | null;
    bank1LastModifiedAt: string | null;
    bank1Status: string | null;
    accountType2: string;
    accountNo2: string;
    bankName2: string;
    bankBranch2: string | null;
    defaultbankFlag2: string;
    bank2CreatedAt: string | null;
    bank2LastModifiedAt: string | null;
    bank2Status: string | null;
    accounttype3: string | null;
    accountNo3: string | null;
    bankName3: string | null;
    bankBranch3: string | null;
    defaultbankFlag3: string | null;
    bank3CreatedAt: string | null;
    bank3LastModifiedAt: string | null;
    bank3Status: string | null;
    accounttype4: string | null;
    accountNo4: string | null;
    bankName4: string | null;
    bankBranch4: string | null;
    defaultbankFlag4: string | null;
    bank4CreatedAt: string | null;
    bank4LastModifiedAt: string | null;
    bank4Status: string | null;
    accounttype5: string | null;
    accountNo5: string | null;
    bankName5: string | null;
    bankBranch5: string | null;
    defaultbankFlag5: string | null;
    bank5CreatedAt: string | null;
    bank5LastModifiedAt: string | null;
    bank5Status: string | null;
    chequeName: string | null;
    address1: string;
    address2: string;
    address3: string | null;
    city: string;
    pincode: string;
    country: string;
    officePhone: string | null;
    officeFax: string | null;
    email: string;
    communicationMode: string;
    foreignAddress1: string;
    foreignAddress2: string;
    foreignAddress3: string | null;
    foreignAddressCity: string;
    foreignAddressPincode: string;
    foreignAddressState: string;
    foreignAddressCountry: string;
    foreignAddressResiPhone: string | null;
    foreignAddressFax: string | null;
    foreignAddressOffPhone: string | null;
    foreignAddressOffFax: string | null;
    indianMobileNo: string;
    nominee1Name: string;
    nominee1Relationship: string;
    nominee1ApplicablePercent: string;
    nominee1MinorFlag: string;
    nominee1DOB: string | null;
    nominee1guardian: string | null;
    nominee2Name: string;
    nominee2Relationship: string;
    nominee2ApplicablePercent: string;
    nominee2MinorFlag: string;
    nominee2DOB: string | null;
    nominee2guardian: string;
    nominee3Name: string;
    nominee3Relationship: string;
    nominee3ApplicablePercent: string;
    nominee3MinorFlag: string;
    nominee3DOB: string | null;
    nominee3guardian: string | null;
    primaryHolderKYCType: string;
    primaryHolderCKYCNumber: string | null;
    secondHolderKYCType: string | null;
    secondHolderCKYCNumber: string | null;
    thirdHolderKYCType: string | null;
    thirdHolderCKYCNumber: string | null;
    guardianKYCType: string;
    guardianCKYCNumber: string | null;
    primaryHolderKRAExemptRefNo: string | null;
    secondHolderKRAExemptRefNo: string | null;
    thirdHolderKRAExemptRefNo: string | null;
    guardianExemptRefNo: string | null;
    aadhaarUpdated: string | null;
    paperless_flag: string;
    emailDeclarationFlag: string;
    mobileDeclarationFlag: string;
    branch: string | null;
    dealer: string | null;
    createdBy: string | null;
    createdAt: string | null;
    lastModifiedBy: string | null;
    lastModifiedAt: string | null;
    clientOnboardedFrom: string;
    clientCodePreference: string | null;
    clientMotherName: string;
    clientFatherName: string;
    clientNationality: string;
    state: string;
    cdsicltd: string | null;
    ifsccode1: string;
    micrno1: string;
    ifsccode2: string;
    micrno2: string;
    ifsccode3: string | null;
    micrno3: string | null;
    ifsccode4: string | null;
    micrno4: string | null;
    ifsccode5: string | null;
    micrno5: string | null;
    pms: string | null;
    cdsldpid: string | null;
    cmbpid: string | null;
    nsdldpid: string | null;
    nsdlcltid: string | null;
    divpaymode: string;
    residentialPhone: string | null;
    residentialFax: string | null;
    mapinId: string | null;
    leino: string | null;
    leivalidity: string | null;
  };
  primaryHolderDOB: string;
}

export interface TaxDetails {
  idtype: string;
  taxres: string;
  tpin: string;
}

export interface BrokerAdminRmList {
  rmUserId: string;
  rmFirstName: string;
  rmMiddleName: string;
  rmLastName: string;
  virtualRMId: string;
  noOfClients: number;
  createdOn: number;
}

export interface Message {
  message: string;
}

export interface BrokerAdminRm {
  memberFirstName: string;
  memberUserId: string;
  memberMiddleName: string;
  memberLastName: string;
  memberRole: string;
}

export interface RMData {
  lastName: string;
  virtualRMId: string;
  rmFirstName: string;
  middleName: string;
  rmUserId: string;
}

export interface BrokerAdminRmClient {
  memberFirstName?: string;
  memberUserId?: string;
  memberMiddleName?: string | null;
  memberLastName?: string | null;
  memberRole?: string;

  clientUserId?: string;
  panNo?: string;
  clientFirstName?: string;
  clientMiddleName?: string | null;
  clientLastName?: string | null;
  portfolioValue?: string;
  investedValue?: string;
  assignedRMUserId?: string;
  assignedRMFirstName?: string;
  assignedRMMiddleName?: string | null;
  assignedRMLastName?: string | null;
  clientUCCActivation?: boolean | null;
  clientCodeBse?: string | null;
}

export interface ActionButton {
  actionButton: string;
  heading: string;
  subheading: string;

  assignedRMFirstName?: string;
  assignedRMLastName?: string;
  assignedRMMiddleName?: string;
  assignedRmUserId?: string;
  clientFirstName?: string;
  clientLastName?: string;
  clientMiddleName?: string;
  clientUserId?: string;

  rmFirstName?: string;
  rmLastName?: string;
  rmMiddleName?: string;
  rmUserId?: string;
}
export interface ArnData {
  arn: string;
  bseMemberId: string;
  bsePwd: string;
  bseUserId: string;
  euin: string;
  userId: string;
}

export interface FundName {
  isin: string;
  scheme_code: string;
  scheme_name: string;
}
export interface SidebarToggleResponse {
  text: boolean;
}
