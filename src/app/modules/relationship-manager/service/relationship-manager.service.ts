import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelationshipManagerService {
  rmProfileData : any;
  private rmProfileUpdate = new Subject<any>();

  constructor(private http: HttpClient) { }

  getRmProfile(userId: string ): Observable<any> {
    return this.http.post('view/rm/details', userId);
  }
  editRmDetails(updatedByUserId: string , rmUserId : string , editdetailsBody: any ): Observable<any> {
    let obj = {
      'updatedByUserId':updatedByUserId,
      'rmUserId':rmUserId,
      'editDetailsBody':editdetailsBody,
    }
    return this.http.post('edit/rm/profile',obj);
  }

  setRMprofileData(data : any){
  this.rmProfileData = data;
  }

  getRMprofileData(){
    return this.rmProfileData;
  }

  getRmClientList(userId:string): Observable<any> {
    return this.http.post('rm/client/list', userId);
  }

  removeClient(rmUserId:string,clientUserId:string,typeOfAction:string): Observable<any>{
    let obj={
      'rmUserId':rmUserId,
      'clientUserId':clientUserId,
      'typeOfAction':typeOfAction
    }
    console.log(obj);
    return this.http.post('rm/create/request', obj);
  }

  setRmProfileUpdate(rmProfileData: any) {
    this.rmProfileUpdate.next({ rmProfile: rmProfileData });
  }

  getRmProfileUpdate(): Observable<any> {
    return this.rmProfileUpdate.asObservable();
  }



}
