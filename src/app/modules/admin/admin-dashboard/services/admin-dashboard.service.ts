import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  constructor(private http: HttpClient) { }

  getBrokerList(adminId: string, pageNo: number): Observable<any>{

    let obj = {
      'adminId': adminId,
      // 'pageNo': pageNo.toString()
    }
    return this.http.post('Broker/list', obj);
  }
  getAddBrokerList(): Observable<any>{
    return this.http.get('get/invite/broker/list');
  }
  sendEmailInvite(brokerId:string): Observable<any>{
    let obj = {
      'brokerId':brokerId
    }
    return this.http.post('invite/broker', obj);
  }

}
