import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm! : FormGroup


  type: string = 'password';
  icon: string = 'fa-eye-slash'
  isVisible : boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private userStore: UserStoreService)
    {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email : ['',Validators.required],
      password : ['',Validators.required]
    });
  }


  hideShowPass() : void{
    this.isVisible = !this.isVisible;
    this.isVisible ? this.type = 'text' : this.type = 'password';
    this.isVisible ? this.icon = 'fa-eye' : this.icon = 'fa-eye-slash';
  }

  onLogin(){
    if(this.loginForm.valid){
      this.auth.login(this.loginForm.value)
      .subscribe({
        next: (res => {
        this.toast.success({detail: 'SUCCESS', summary: res.message, duration: 5000});
        this.auth.setToken(res.accessToken);
        this.auth.setRefreshToken(res.refreshToken);
        const payload = this.auth.decodeToken();
        this.userStore.setEmailForStore(payload.email);
        this.loginForm.reset();
        this.router.navigate(['dashboard']);
      }),
      error: (err => {
        this.loginForm.reset();
        this.toast.error({detail: 'ERROR', summary: err.error.error, duration: 5000});
      })
    });
    }else{
      this.validateAllFormFields(this.loginForm)
    }
  }
  private validateAllFormFields(formGroup : FormGroup){
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if(control instanceof FormControl){
        control.markAsDirty({onlySelf: true})
      }
    });
  }
}
