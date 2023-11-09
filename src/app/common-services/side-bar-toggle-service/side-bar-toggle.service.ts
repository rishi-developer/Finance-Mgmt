import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideBarToggleService {
  isOpened = new Subject<boolean>();
  isSideOpened = this.isOpened.asObservable();
  private isexpanded = new Subject<any>();

  constructor() { }

  toggle(value:boolean){
    this.isOpened.next(value);
  }
  sendIsExpandedUpdate(message: boolean) {
    this.isexpanded.next({ text: message });
  }
  getIsExpandedUpdate(): Observable<any> {
    return this.isexpanded.asObservable();
  }
}
