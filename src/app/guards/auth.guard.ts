import { Injectable } from '@angular/core';
import {  CanActivate, Router,  } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService)
    {}
  canActivate() :boolean{
     if(this.auth.getToken() != null){
      return true;
    }else{
      this.toast.error({detail:"ERROR",summary: "Please login first!",duration:5000});
      this.router.navigate(['login'])
      return false;
     }
  }

}