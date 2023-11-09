import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrokerTransactionsService {
  constructor(private http: HttpClient) {}

  // getTransactionsDetails(clientId: string, fundName: string): Observable<any> {
  //   let obj = {
  //     'clientId': clientId,
  //     'fundName': fundName
  //   }
  //   return this.http.post('get/client/preTransaction/details', obj);
  // }

  getClientsList(userIdOfClient: string, userId: string): Observable<any> {
    let obj = {
      userIdOfClient: userIdOfClient,
      userId: userId,
    };
    return this.http.post('get/listOfClients', obj);
  }

  placeOrder(transactionRequestBody: any, userId: string): Observable<any> {
    let obj = {
      orderDetails: transactionRequestBody,
      userId: userId,
    };
    return this.http.post('new/orderEntry', obj);
  }

  // getFundsList(): Observable<any> {
  //   return this.http.get('get/scheme/code/name');
  // }

  placeSipOrder(transactionRequestBody: any, userId: string): Observable<any> {
    let obj = {
      sipOrderDetails: transactionRequestBody,
      userId: userId,
    };
    return this.http.post('new/sipOrderEntry', obj);
  }
  placeStpOrder(transactionRequestBody: any, userId: string): Observable<any> {
    let obj = {
      stpDetails: transactionRequestBody,
      userId: userId,
    };
    return this.http.post('new/stpEntry', obj);
  }

  placeSwpOrder(transactionRequestBody: any, userId: any): Observable<any> {
    let obj = {
      swpOrderDetails: transactionRequestBody,
      userId: userId,
      // 'partnerId': partnerId
    };
    return this.http.post('new/swpOrderEntry', obj);
  }

  searchFund(fundSearch: any): Observable<any> {
    return this.http.post('get/listOfFunds', fundSearch);
  }

  placeSwitchOutOrder(
    transactionRequestBody: any,
    userId: string
  ): Observable<any> {
    let obj = {
      switchOrderDetails: transactionRequestBody,
      userId: userId,
    };
    return this.http.post('new/switchOrderEntry', obj);
  }

  getEuinList(userId: string): Observable<any> {
    let obj = {
      userId: userId,
    };
    return this.http.post('get/ListOfEuin', obj);
  }

  getSchemeInFolioNo(folioNo: string): Observable<any> {
    let obj = {
      folioNo: folioNo,
    };
    return this.http.post('get/schemesInFolio', obj);
  }

  getclientFolioNos(userId: string, clientUserId: string): Observable<any> {
    let obj = {
      clientUserId: clientUserId,
      userId: userId,
    };
    return this.http.post('get/clientFolioNos', obj);
  }

  getclientBankAccountDetails(userId: string): Observable<any> {
    let obj = {
      userId: userId,
    };
    return this.http.post('get/clientBankAccounts', obj);
  }

  getMandateList(userId: string): Observable<any> {
    let obj = {
      userId: userId,
    };
    return this.http.post('list/OfMandates', obj);
  }

  createMandate(
    mandateDetails: any,
    userId: string,
    bankName: string
  ): Observable<any> {
    let obj = {
      mandateDetails: mandateDetails,
      userId: userId,
      bankName: bankName,
    };
    return this.http.post('create/clientMandate', obj);
  }

  // getclientList(userId:string): Observable<any> {
  //   let obj={
  //     'userId':userId
  //   }
  //   return this.http.post('list/clientListWithUCC',obj);
  // }

  inactivateMandate(
    mandateId: string,
    clientCode: string,
    mandateState: string
  ): Observable<any> {
    let obj = {
      mandateId: mandateId,
      clientCode: clientCode,
      mandateState: mandateState,
    };
    return this.http.post('change/mandate/state', obj);
  }

  getClientMandateList(clientUserId: string): Observable<any> {
    let obj = {
      clientUserId: clientUserId,
    };
    return this.http.post('list/clientMandates', obj);
  }

  getUserBalanceAmount(
    clientUserId: string,
    schemeCode: string
  ): Observable<any> {
    let obj = {
      clientUserId: clientUserId,
      schemeCode: schemeCode,
    };
    return this.http.post('fund/amtandunit', obj);
  }
}
