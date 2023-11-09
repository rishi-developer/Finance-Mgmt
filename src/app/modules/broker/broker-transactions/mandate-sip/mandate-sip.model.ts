export interface mandateSipList {
  ucc: string;
  clientName: string;
  accountNo: string;
  bank: string;
  startDate: string;
  endDate: string;
  umrn: string;
  bseMandateCode: string;
  amount: string;
  status: string;
}

export const mandateTypeList = [
  { code: 'X', description: 'Physical' },
  // { code: 'I', description: 'ISIP' },
  { code: 'N', description: 'NACH' },
];

// export const monthList = [
//   { code: '01', description: 'Jan' },
//   { code: '02', description: 'Feb' },
//   { code: '03', description: 'Mar' },
//   { code: '04', description: 'April' },
//   { code: '05', description: 'May' },
//   { code: '06', description: 'June' },
//   { code: '07', description: 'July' },
//   { code: '08', description: 'Aug' },
//   { code: '09', description: 'Sep' },
//   { code: '10', description: 'Oct' },
//   { code: '11', description: 'Nov' },
//   { code: '12', description: 'Dec' }]
