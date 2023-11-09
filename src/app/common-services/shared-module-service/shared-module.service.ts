import { BrokerModuleService } from 'src/app/modules/broker/service/broker-module.service';
import { ProductAdminService } from './../../modules/product-admin/service/product-admin.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { holdingAdviseList } from 'src/app/_helper/mock-data';
import { holdingBrokerClientList } from 'src/app/_helper/mock-data';
import { ToastrShowService } from '../toastr-service/toastr.service';
import { Message } from 'src/app/models/broker-admin';

@Injectable({
  providedIn: 'root',
})
export class SharedModuleService {
  triggerAdviseList = new BehaviorSubject<any>(null);
  mockAdviseHoldingList = new BehaviorSubject<any>(null);
  clientId!: string;
  isPDFUploaded = new Subject<any>();
  navbarMainHeadingValue = new Subject<any>();
  firstTimeLogin = new Subject<any>();
  private credsPresentUpdate = new Subject<any>();
  successMessage: string = '';
  errorMessage: string = '';
  rmPassword: any;
  ClientOverviewDetails: any;
  ClientBankDetails: any;
  riskClientId!: string;
  clientEmail!: string;
  private uccCreationUpdate = new Subject<any>();

  constructor(
    private http: HttpClient,
    private productAdminService: ProductAdminService,
    private brokerModuleService: BrokerModuleService,
    private toastr: ToastrShowService
  ) {}

  getAllAdvisoryClients(): Observable<any> {
    return this.http.get('admin/advisoryClient/list');
  }

  getAllBrokerClients(): Observable<any> {
    return this.http.get('admin/brokerClient/list');
  }

  getAdviseHoldingList(clientId: string, pageNo: number): Observable<any> {
    let obj = {
      clientId: clientId,
      // 'pageNo': pageNo.toString()
    };
    return this.http.post('advisor/client/holdings', obj);

    this.mockAdviseHoldingList.next(holdingAdviseList);
    return this.mockAdviseHoldingList.asObservable();
  }
  getAdvisorProfile(clientId: string): Observable<any> {
    let obj = {
      clientId: clientId,
    };
    return this.http.post('client/details', obj);
  }
  getAdvisorSummary(clientId: string): Observable<any> {
    let obj = {
      clientId: clientId,
    };
    return this.http.post('client/summary', obj);
  }
  setGenerateAdvise(value: boolean) {
    this.triggerAdviseList.next(value);
  }

  getGenerateAdviseTrigger(): Observable<any> {
    return this.triggerAdviseList.asObservable();
  }

  getRecentAdviseList(
    clientId: string,
    generateAdvise: string,
    pageNo?: number
  ): Observable<any> {
    let obj = {
      clientId: clientId,
      generateAdvise: generateAdvise,
      // 'pageNo': pageNo.toString()
    };
    return this.http.post('portfolio/adviceHistory', obj);
  }
  generateAdvise(clientId: string): Observable<any> {
    let obj = {
      clientId: clientId,
      // 'pageNo': pageNo.toString()
    };
    return this.http.post('generate/advice', obj);
  }
  getAdvisoryClientProfile(
    clientId: string,
    brokerName: string
  ): Observable<any> {
    let obj = {
      clientId: clientId,
      brokerName: brokerName,
      // 'pageNo': pageNo.toString()
    };
    return this.http.post('profile/advisory/client', obj);
  }
  getBrokerProfile(clientId: string): Observable<any> {
    let obj = {
      clientId: clientId,
    };
    return this.http.post('client/details', obj);
  }
  getBrokerHoldings(clientId: string): Observable<any> {
    let obj = {
      clientId: clientId,
      // 'pageNo': pageNo.toString()
    };
    return this.http.post('client/holdings', obj);
  }
  getBrokerSummary(clientId: string): Observable<any> {
    let obj = {
      clientId: clientId,
    };
    return this.http.post('client/summary', obj);
  }
  getBrokerClientHoldingList(
    brokerId: string,
    pageNo: number
  ): Observable<any> {
    // TODO: API integration pending
    // let obj = {
    //   'brokerId': brokerId,
    //   'pageNo': pageNo.toString()
    // }
    // return this.http.post('getadvisoryclientlist', obj);

    //TODO: remove static data
    this.mockAdviseHoldingList.next(holdingBrokerClientList);
    return this.mockAdviseHoldingList.asObservable();
  }

  getBrokerList(adminId: string, pageNo: number): Observable<any> {
    let obj = {
      adminId: adminId,
      // 'pageNo': pageNo.toString()
    };
    return this.http.post('Broker/list', obj);
  }
  getBrokerDetails(brokerId: string, pageNo: number): Observable<any> {
    let obj = {
      brokerId: brokerId,
      // 'pageNo': pageNo.toString()
    };
    return this.http.post('broker/details', obj);
  }

  getAdvisorClientDetails(advisorId: string, pageNo: number): Observable<any> {
    let obj = {
      userId: '',
      advisorId: advisorId,
      // 'pageNo': pageNo.toString()
    };
    return this.http.post('AdvisoryClient/list', obj);
  }

  getBrokerClientList(brokerId: string, pageNo: number): Observable<any> {
    let obj = {
      userId: '',
      brokerId: brokerId,
      // 'pageNo': pageNo.toString()
    };
    return this.http.post('Brokerclient/list', obj);
  }
  getClientCommunicationDetails(clientId: string): Observable<any> {
    let obj = {
      clientId: clientId,
    };
    return this.http.post('get/client/communication/details', obj);
  }
  getClientBankDetails(clientId: string): Observable<any> {
    let obj = {
      clientId: clientId,
    };
    return this.http.post('get/client/bank/details', obj);
  }
  getClientPersonalDetails(clientId: string): Observable<any> {
    let obj = {
      clientId: clientId,
    };
    return this.http.post('get/client/personal/details', obj);
  }
  setClientId(value: string) {
    this.clientId = value;
  }

  getClientId() {
    return this.clientId;
  }

  sendUpdate(message: boolean) {
    this.credsPresentUpdate.next({ text: message });
  }
  getUpdate(): Observable<any> {
    return this.credsPresentUpdate.asObservable();
  }

  getBrokerClientList1(userId: string, brokerId: string): Observable<any> {
    let obj = {
      userId: userId,
      brokerId: brokerId,
    };
    return this.http.post('Brokerclient/list', obj);
  }

  getRiskProfileQuestions() {
    return this.http.get('get/riskProfileQuestions');
  }

  sendRiskProfileScore(riskProfileQA: any, userId: string): Observable<any> {
    let obj = {
      riskProfileQA: riskProfileQA,
      userId: userId,
    };
    return this.http.post('submit/RiskProfile', obj);
  }

  getRiskProfileResult(userId: string): Observable<any> {
    let obj = {
      userId: userId,
    };
    return this.http.post('get/clientRiskProfile', obj);
  }
  uploadIPD(formData: any): Observable<any> {
    // 'userId': userId,
    // 'file' : file
    // 'formData' : formData

    return this.http.post('upload/ipdDocument', formData);
  }

  viewIPD(userId: string): Observable<any> {
    let obj = {
      userId: userId,
    };
    return this.http.post('get/ipdDocument', obj);
  }

  checkIPDDocument(userId: string): Observable<any> {
    let obj = {
      userId: userId,
    };
    return this.http.post('check/clientIPDDcoucment', obj);
  }

  getTransactionHistory(
    userId: string,
    startDate: any,
    endDate: any
  ): Observable<any> {
    let obj = {
      userId: userId,
      startDate: startDate,
      endDate: endDate,
    };
    return this.http.post('clientTransactionHistory', obj);
  }

  // new flow

  /**
   * Sets the main heading value for the navbar.
   * @param value - The new main heading value to set.
   */
  setNavbarHeading(value: string) {
    this.navbarMainHeadingValue.next({ mainHeading: value });
  }
  getNavbarHeading(): Observable<any> {
    return this.navbarMainHeadingValue.asObservable();
  }

  createCommonInviteAssignReassign(result: any) {
    return new Promise<void>((resolve, reject) => {
      const formResponse = result.resultForm;
      const flag = result.flag;
      if (
        flag == 'Send Email Invitation' ||
        flag == 'Send Email Invitation Broker Admin'
      ) {
        this.productAdminService.onboardUser(formResponse).subscribe(
          (data) => {
            if (data) {
              if (flag == 'Send Email Invitation') {
                this.toastr.showSuccess('Rm Invited successfully');
              } else {
                this.toastr.showSuccess('Broker Admin Invited successfully');
              }
            }
            resolve();
          },
          (err) => {
            reject();
            if (flag == 'Send Email Invitation') {
              if (err.status == 409) {
                this.toastr.showError(err.error);
              } else {
                this.toastr.showError('Error in inviting rm');
              }
            } else {
              if (err.status == 409) {
                this.toastr.showError(err.error);
              } else {
                this.toastr.showError('Error in inviting Broker Admin');
              }
            }
          }
        );
      } else {
        if (flag == 'Assign RM') {
          this.successMessage = 'Rm assigned successfully';
          this.errorMessage = 'Error in assigning rm';
        } else if (flag == 'Assign Client') {
          this.successMessage = 'Client Assigned successfully';
          this.errorMessage = 'Error in assigning client';
        } else if (flag == 'Reassign RM') {
          this.successMessage = 'RM reassigned successfully';
          this.errorMessage = 'Error in reassigning RM';
        } else if (flag == 'Reassign Client') {
          this.successMessage = 'Client reassigned successfully';
          this.errorMessage = 'Error in reassigning Client';
        }
        this.brokerModuleService.assignReassignRmClient(formResponse).subscribe(
          (data) => {
            if (data) {
              this.toastr.showSuccess(this.successMessage);
            }
            resolve();
          },
          (err) => {
            reject();
            this.toastr.showError(this.errorMessage);
          }
        );
      }
    });
  }

  setRmPassword(setRmPassword: any) {
    this.rmPassword = setRmPassword;
  }
  getRmPassword() {
    return this.rmPassword;
  }

  changeRmPassword(email: string, password: string): Observable<any> {
    let obj = {
      email: email,
      password: password,
    };
    return this.http.post('simple/change/password', obj);
  }

  getclientHoldings(clientUserId: string, userId: string): Observable<any> {
    let obj = {
      clientUserId: clientUserId,
      viewerUserId: userId,
    };
    return this.http.post('rm/view/client/holdings-list', obj);
  }

  getClientOverview(
    clientUserId: string,
    viewerUserId: string
  ): Observable<any> {
    let obj = {
      clientUserId: clientUserId,
      viewerUserId: viewerUserId,
    };
    return this.http.post('rm/view/client/profile-overview', obj);
  }

  getClientPersonalOtherDetails(userId: string): Observable<any> {
    return this.http.post('rm/view/client/profile-other-details', userId);
  }

  setClientOverviewDetails(setDetails: any) {
    this.ClientOverviewDetails = setDetails;
  }
  getClientOverviewDetails() {
    return this.ClientOverviewDetails;
  }
  setClientBanksDetails(setDetails: any) {
    this.ClientBankDetails = setDetails;
  }
  getClientBanksDetails() {
    return this.ClientBankDetails;
  }

  getBankData(clientUserId: string): Observable<any> {
    let obj = {
      userId: clientUserId,
    };
    return this.http.post('get/client/bankAccountDetails', obj);
  }

  sendUccActivationUpdate(message: string) {
    this.uccCreationUpdate.next({ text: message });
  }

  getUccActivationUpdate(): Observable<any> {
    return this.uccCreationUpdate.asObservable();
  }

  /**
   * Activates a nominee for a client.
   * @param creatorUserId - User ID of the creator initiating the activation.
   * @param clientUserId - User ID of the client for whom the nominee is being activated.
   * @returns {Observable<Message>} - An Observable representing the result of the nominee activation operation.
   */
  activateNominee(
    creatorUserId: string,
    clientUserId: string
  ): Observable<Message> {
    let obj = {
      creatorUserId: creatorUserId,
      clientUserId: clientUserId,
    };
    return this.http.post<Message>('nominee/authentication', obj);
  }

  getFatcaDetails(clientUserId: string): Observable<any> {
    let obj = {
      clientUserId: clientUserId,
    };
    return this.http.post('fetch/fatcaDetails', obj);
  }

  getNomineeDetails(clientUserId: string): Observable<any> {
    let obj = {
      clientUserId: clientUserId,
    };
    return this.http.post('get/client/nomineeDetails', obj);
  }

  getRiskProfileQUestions(): Observable<any> {
    return this.http.get<any>('get/riskProfileQuestions');
  }

  submitRiskProfile(payload: any) {
    return this.http.post('submit/RiskProfile', payload);
  }
  getClientRiskAssessmentScore(payload: { userId: any }): Observable<any> {
    return this.http.post<any>('get/clientRiskProfile', payload);
  }
}
