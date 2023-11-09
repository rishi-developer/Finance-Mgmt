import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { advisorClientList } from 'src/app/_helper/mock-data';

@Injectable({
  providedIn: 'root'
})
export class ListOfClientsService {

  mockAdvisorClientList = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient) { }

  getAdvisoryClientList(userid: string, advisorId:string,pageNo: number): Observable<any>{

    let obj = {
      'userId': userid,
      'advisorId':advisorId
      // 'pageNo': pageNo.toString()
    }
    return this.http.post('AdvisoryClient/list', obj);
  }

  getBrokerClientList(userId: string, brokerId:string,pageNo: number): Observable<any>{

    let obj = {
      'userId': userId,
      'brokerId':brokerId
      // 'pageNo': pageNo.toString()
    }
    return this.http.post('Brokerclient/list', obj);
  }
}
