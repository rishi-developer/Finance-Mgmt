import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  getOccupationCodeList(): Observable<any> {
    return this.http.get('get/list/occupationCode');
  }

  getMobileDeclarationList(): Observable<any> {
    return this.http.get('get/list/mobileDeclarationFlag');
  }

  getIdDocumentList(): Observable<any> {
    return this.http.get('get/list/idDocument');
  }

  getCountriesList(): Observable<any> {
    return this.http.get('get/list/countries');
  }
  getoverSeasCountriesList(): Observable<any> {
    return this.http.get('get/list/ucccountries');
  }

  getStatesList(): Observable<any> {
    return this.http.get('get/list/states');
  }

  getOrganizationArn(userId:string): Observable<any> {
    let obj={
      "userId":userId
    }
    return this.http.post('organization/arn',obj);
  }

  onboardClient(uccRegistrationParams: any, userId: string, regnType:string,uccCreation:string,fatcaDetails: any): Observable<any> {
    let requestObj = {
      'uccRegistrationParams': uccRegistrationParams,
      "userId": userId,
      "regnType": regnType,
      "uccCreation": uccCreation,
      'fatcaDetails': fatcaDetails,
    }
    return this.http.post('uccRegistration',requestObj);
  }

  activateUcc(uccRequestBody:any): Observable<any> {
    return this.http.post('AOFupload',uccRequestBody);
  }

  // function to generate random 2 characters at first and then random number - for client code in client onboarding
  generate(length:number) :string {
    const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const nums='0123456789';
    let result='';

    // generate two random characters 
    for(let i=0;i<2;i++){
      const randomChar=chars.charAt(Math.floor(Math.random()*chars.length));
      result+=randomChar;
    }
    // generate random numbers
    for(let i=0;i<length-2;i++){
      const randomNum=nums.charAt(Math.floor(Math.random()*nums.length));
      result+=randomNum;
    }
    return result;
  }
  
  updateClientDetails(uccRegistrationParams: any, clientUserId: string, clientDataCSVId: string, uccCreation:any,fatcaDetails:any): Observable<any> {
    let obj = {
      'uccRegistrationParams': uccRegistrationParams,
      "clientUserId": clientUserId,
      'clientDataCSVId':clientDataCSVId,
      "uccCreation": uccCreation,
      "fatcaDetails":fatcaDetails
    }
    return this.http.post('edit/client/details',obj);
  }

  getFatcaTaxDetails(clientPAN:string) : Observable<any>{
    let obj={
      'clientPAN':clientPAN
    }
    return this.http.post('get/client/tax-residence',obj);
  }
}
