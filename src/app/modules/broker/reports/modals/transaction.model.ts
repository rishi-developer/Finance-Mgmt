export interface TransactionResponse {
  amount: string;
  date: string;
  orderId: string;
  schemeDetails: string;
  transactionType: string;
}

export interface ClientResponse {
  clientCodeBSE: string | null;
  clientEmail: string | null;
  clientFirstName: string | null;
  clientKYCStatus: string | null;
  clientLastName: string | null;
  clientMiddleName: string | null;
  clientPan: string | null;
  clientPhoneNo: string | null;
  clientUserCode: string | null;
}
