import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLoginModel } from '../models/user-login.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from '../models/token-api.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl : string = 'https://tasktrackerappservice.azurewebsites.net/api/auth';

  private userPayload: any;
  constructor(private http: HttpClient)
  {
    this.userPayload = this.decodeToken();
  }
  login(user: UserLoginModel){
    return this.http.post<any>(`${this.baseUrl}/login`,user);
  }
  logout() : void{
    localStorage.clear();
  }
  setToken(tokenValue: string):void{
    localStorage.setItem('token',tokenValue);
  }
  setRefreshToken(refreshToken: string){
    localStorage.setItem('refreshToken', refreshToken)
  }
  getToken() : string | null {
    return localStorage.getItem('token');
  }
  getRefreshToken() : string | null {
    return localStorage.getItem('refreshToken');
  }
  decodeToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token)
  }
  getUserIdFromToken(){
    if(this.userPayload)
      return this.userPayload.UserId;
  }
  getUserEmailFromToken(){
    if(this.userPayload)
      return this.userPayload.email;
  }
  renewToken(tokenModel: TokenApiModel){
    return this.http.post<any>(`${this.baseUrl}/refresh`,tokenModel);
  }
}
