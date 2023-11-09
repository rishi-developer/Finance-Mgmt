import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ArnData,
  BankAccount,
  BrokerAdminClientList,
  BrokerAdminRequestsList,
  BrokerAdminRm,
  BrokerAdminRmList,
  ClientPersonalOtherDetails,
  FatcaDetails,
  Message,
  NomineeDetails,
  RMData,
  TaxDetails,
} from 'src/app/models/broker-admin';

@Injectable({
  providedIn: 'root',
})
export class BrokerModuleService {
  constructor(private http: HttpClient) { }

  /**
   * fetches the list of clients
   */
  getClientsList(): Observable<any> {
    return this.http.get('get/all/clients');
  }

  saveAdvice(
    clientId: string,
    userId: string,
    amount: string,
    riskProfile: string
  ): Observable<any> {
    let obj = {
      clientId: clientId,
      userId: userId,
      invAmt: amount,
      riskProfile: riskProfile,
    };
    return this.http.post('save/advice', obj);
  }

  /**
   * Fetches the risk profile for the specified client.
   * @param clientId - The unique identifier of the client for whom the risk profile is being fetched.
   * @returns An observable that represents the client's risk profile data.
   */
  getClientRiskProfile(clientId: string): Observable<any> {
    let obj = {
      userId: clientId,
    };
    return this.http.post('get/clientRiskProfile', obj);
  }

  sanctionAdvice(sanctionAdviceRequestBody: any): Observable<any> {
    return this.http.post('sanction/Advice', sanctionAdviceRequestBody);
  }

  /**
   * bse-credentail modal api's
   * @param userId
   * @returns
   */
  checkBseCredential(userId: string): Observable<any> {
    let obj = {
      userId: userId,
    };
    return this.http.post('checkBseCreds', obj);
  }

  saveBseCredential(bseCredentialRequestBody: any): Observable<any> {
    return this.http.post('saveBseCreds', bseCredentialRequestBody);
  }

  // broker admin flow api's

  /**
   * Saves broker BSE information.
   * @param bseDetailsRequestBody - Data containing broker BSE information.
   * @returns {Observable<Message>} An Observable that emits a Message.
   */
  saveBrokerBSEInfo(bseDetailsRequestBody: ArnData): Observable<Message> {
    return this.http.post<Message>('saveBrokerBSEInfo', bseDetailsRequestBody);
  }

  /**
   * Assigns a RM to the specified client.
   * @param assignReassignRmClientRequestBody - The unique identifier of the client.
   * @returns {Observable<Message>} An Observable that emits a Message.
   */
  assignReassignRmClient(
    assignReassignRmClientRequestBody: string
  ): Observable<Message> {
    return this.http.post<Message>(
      'brokerAdmin/assign/rm',
      assignReassignRmClientRequestBody
    );
  }

  /**
   * fetches the RM information for the particular client
   * @param userId The unique identifier of the client whose RM is being fetched
   * @returns An observable that represents the RM information
   */
  getClientRmInfo(userId: string): Observable<RMData> {
    return this.http.post<RMData>('client/rm/info', userId);
  }

  /**
   * Fetches a list of broker admin and relationship manager.
   * @param  organizationId - ID for which to fetch members.
   * @returns {Observable<BrokerAdminRm[]>} An observable of an array of broker admin and relationship manager members.
   */
  getAssignReassignRm(organizationId: Number): Observable<BrokerAdminRm[]> {
    return this.http.post<BrokerAdminRm[]>(
      'organization/members/list',
      organizationId
    );
  }

  /**
   * Checks for duplicate ARN
   * @param arn - ARN to check for duplicates.
   * @returns {Observable<Message>} An Observable that emits a Message.
   */
  checkDuplicateARN(arn: string): Observable<Message> {
    return this.http.post<Message>('check/arn', arn);
  }

  /**
   * changes the request status once approves by the Broker admin
   * @param userId The unique identifier of the Broker Admin
   * @param requestId The unique request Id
   * @param requestStatus The current request status
   * @returns An observable that represents the updated request status
   */
  changeRequestStatus(
    userId: string,
    requestId: string,
    requestStatus: string,
    remarks: string
  ): Observable<any> {
    let obj = {
      brokerAdminUserId: userId,
      requestId: requestId,
      requestStatus: requestStatus,
      remarks: remarks,
    };
    return this.http.post('rmRequest/change/status', obj);
  }

  /**
   * Retrieves a list of clients for Broker admin.
   * @param {string} userId - User ID of the broker admin.
   * @returns {Observable<BrokerAdminClientList[]>} - An Observable containing a list of clients for the broker admin.
   */
  getBrokerAdminClientList(
    userId: string
  ): Observable<BrokerAdminClientList[]> {
    return this.http.post<BrokerAdminClientList[]>(
      'brokerAdmin/client/list',
      userId
    );
  }


  /**
   * Retrieves a list of RMs for Broker admin.
   * @param {string} userId - User ID of the broker admin.
   * @returns {Observable<BrokerAdminRmList[]>} - An Observable containing a list of RMs for the broker admin.
   */
  getBrokerAdminRmList(userId: string): Observable<BrokerAdminRmList[]> {
    return this.http.post<BrokerAdminRmList[]>('brokerAdmin/rm/list', userId);
  }

  /**
   * Removes a client by broker admin.
   * @param {string} brokerAdminUserId - User ID of the broker admin.
   * @param {string} clientUserId - User ID of the client to deactivate.
   * @returns {Observable<Message>} - An Observable containing a message indicating the deactivation status.
   */
  deactivateClient(
    brokerAdminUserId: string,
    clientUserId: string
  ): Observable<Message> {
    let obj = {
      brokerAdminUserId: brokerAdminUserId,
      clientUserId: clientUserId,
    };
    return this.http.post<Message>('deactivate/client', obj);
  }

  /**
   * Removes an RM by broker admin.
   * @param {string} brokerAdminUserId - User ID of the broker admin.
   * @param {string} rmUserId - User ID of the RM to deactivate.
   * @returns {Observable<Message>} - An Observable containing a message indicating the deactivation status.
   */
  deactivateRm(
    brokerAdminUserId: string,
    rmUserId: string
  ): Observable<Message> {
    let obj = {
      brokerAdminUserId: brokerAdminUserId,
      rmUserId: rmUserId,
    };
    return this.http.post<Message>('deactivate/rm', obj);
  }

  /**
   * Retrieves a list of broker admin requests for a given user ID.
   * @param {string} userId - User ID of the broker admin.
   * @returns {Observable<BrokerAdminRequestsList[]>} - An Observable containing a list of broker admin requests.
   */
  getRequestRaisedList(userId: string): Observable<BrokerAdminRequestsList[]> {
    let obj = {
      brokerAdminUserId: userId,
    };
    return this.http.post<BrokerAdminRequestsList[]>('list/rmRequests', obj);
  }

  /**
   * Retrieves personal details of a client.
   * @param userId - User ID of the client.
   * @returns {Observable<ClientPersonalOtherDetails>} - An Observable containing the client's personal details.
   */
  getClientPersonalOtherDetails(
    userId: string
  ): Observable<ClientPersonalOtherDetails> {
    return this.http.post<ClientPersonalOtherDetails>(
      'rm/view/client/profile-other-details',
      userId
    );
  }

  /**
   * Retrieves FATCA details of a client.
   * @param clientUserId - User ID of the client.
   * @returns {Observable<FatcaDetails>} - An Observable containing the client's FATCA details.
   */
  getFatcaDetails(clientUserId: string): Observable<FatcaDetails> {
    const obj = {
      clientUserId: clientUserId,
    };
    return this.http.post<FatcaDetails>('fetch/fatcaDetails', obj);
  }

  /**
   * Retrieves bank details of a client.
   * @param clientUserId - User ID of the client.
   * @returns {Observable<BankAccount[]>} - An Observable containing an array of bank details.
   */
  getBankData(clientUserId: string): Observable<BankAccount[]> {
    const obj = {
      userId: clientUserId,
    };
    return this.http.post<BankAccount[]>('get/client/bankAccountDetails', obj);
  }

  /**
   * Retrieves nominee details of a client.
   * @param clientUserId - User ID of the client.
   * @returns {Observable<NomineeDetails[]>} -  An Observable containing an array of nominee details.
   */
  getNomineeDetails(clientUserId: string): Observable<NomineeDetails[]> {
    const obj = {
      clientUserId: clientUserId,
    };
    return this.http.post<NomineeDetails[]>('get/client/nomineeDetails', obj);
  }

  /**
   * Retrieves tax-related details of a client.
   * @param clientPAN - Client's PAN.
   * @returns {Observable<TaxDetails[]>} - An Observable containing an array of tax-related details.
   */
  getFatcaTaxDetails(clientPAN: string): Observable<TaxDetails[]> {
    let obj = {
      clientPAN: clientPAN,
    };
    return this.http.post<TaxDetails[]>('get/client/tax-residence', obj);
  }
}
