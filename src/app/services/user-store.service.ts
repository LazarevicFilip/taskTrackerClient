import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private userEmail$ = new BehaviorSubject<string>('');
  private userId$ = new BehaviorSubject<string>('');
  constructor() { }

  public getUserId(){
    return this.userId$.asObservable();
  }
  public setUserIdForStore(id: string){
    this.userId$.next(id);
  }
  public getUserEmail(){
    return this.userEmail$.asObservable();
  }
  public setEmailForStore(email: string){
    this.userEmail$.next(email);
  }
}
