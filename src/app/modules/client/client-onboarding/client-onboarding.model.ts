export interface bankAccountDetails {
  bankName: string;
  accountNo: string;
  accountType: string;
}

export interface nomineeDetails {
  bankName: string;
  accountNo: string;
  accountType: string;
}

export interface taxEntry {
  countryName: string;
  idDocumentType: string;
}

export interface countryList {
  countryCode: string;
  countryName: string;
}

export interface stateList {
  stateCode: string;
  stateName: string;
}

export const accountTypes = [
  { accountCode: 'SB', description: 'Savings Bank ' },
  { accountCode: 'CB', description: 'Current Bank ' },
  { accountCode: 'NE', description: 'NRE' },
  { accountCode: 'NO', description: 'NRO' },
];

export const sourceOfWealth = [
  { sourceCode: '01', source: 'Salary' },
  { sourceCode: '02', source: 'Business Income' },
  { sourceCode: '03', source: 'Gift' },
  { sourceCode: '04', source: 'Ancestral Property' },
  { sourceCode: '05', source: 'Rental Income' },
  { sourceCode: '06', source: 'Prize Money' },
  { sourceCode: '07', source: 'Royalty' },
  { sourceCode: '08', source: 'Others' },
];

export const grossAnnualIncome = [
  { incomeCode: '31', income: 'Below 1 Lacs' },
  { incomeCode: '32', income: '1-5 Lacs' },
  { incomeCode: '33', income: '5-10 Lacs' },
  { incomeCode: '34', income: '10-25 Lacs' },
  { incomeCode: '35', income: '25 Lacs-1Crore' },
  { incomeCode: '36', income: '> 1Crore' },
];

export const genders = [
  { genderCode: 'M', gender: 'Male' },
  { genderCode: 'F', gender: 'Female' },
  { genderCode: 'O', gender: 'Other' },
];

export const holdings = [
  { code: 'SI', holdingName: 'Single' },
  { code: 'JO', holdingName: 'Joint' },
  { code: 'AS', holdingName: 'Anyone or Survivor' },
];

export const forIndividuals = [
  { code: 'Y', individualName: 'I am Politically Exposed Person (PEP)' },
  {
    code: 'R',
    individualName: 'I am Related to Politically Exposed Person (RPEP)',
  },
  { code: 'N', individualName: 'Not Applicable' },
];

export const forNonIndividuals = [
  { code: '01', nonIndividualName: 'Foreign Exchange/Money Change Services' },
  { code: '02', nonIndividualName: 'Gaming/Gambling/Lottery/Casino Services' },
  { code: '03', nonIndividualName: 'Money Lending' },
  { code: '04', nonIndividualName: 'Not Applicable' },
];

export const nomineeType = [
  { code: 'Y', type: 'Minor' },
  { code: 'N', type: 'Major' },
];

export const taxStatus = [
  //INDIAN
  { code: '01', statusType: 'Individual' },
  { code: '02', statusType: 'On Behalf of Minor' },
  { code: '03', statusType: 'HUF' },

  //NRI
  { code: '26', statusType: 'NRI-On Behalf Of Minor-NRE' },
  { code: '29', statusType: 'NRI-HUF-NRE' },
  { code: '21', statusType: 'NRI-Individual-NRE' },

  { code: '11', statusType: 'NRI-Others' },
  { code: '28', statusType: 'NRI-On Behalf Of Minor-NRO' },

  { code: '27', statusType: 'NRI-HUF-NRO' },
  { code: '24', statusType: 'NRI-Individual-NRO' },

  //FOREIGNER
  { code: '42', statusType: 'QFI-On Behalf Of Minor' },
  { code: '41', statusType: 'QFI-Individual' },
  { code: '61', statusType: 'OCI-Repatriation' },
  { code: '62', statusType: 'OCI-Non Repatriation' },
  { code: '70', statusType: 'Person Of Indian Origin' },
];
