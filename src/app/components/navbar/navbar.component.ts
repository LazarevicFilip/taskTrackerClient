import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public email: string = '';
  constructor(
    private auth: AuthService,
    private router: Router,
    private toast : NgToastService,
    private userStore: UserStoreService){

  }
  ngOnInit(): void {
    this.userStore.getUserEmail()
    .subscribe(email => {
      let emailFromToken = this.auth.getUserEmailFromToken();
      this.email = email || emailFromToken
    })
  }

  logout():void{
    this.auth.logout();
    this.router.navigate(['login']);
    this.toast.success({detail: 'SUCCESS',summary: 'You have been succussfully log out',duration:3000});
  }
}
