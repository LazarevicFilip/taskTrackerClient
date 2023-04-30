import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';


import {MatToolbarModule} from '@angular/material/toolbar'; /**yes */
import {MatInputModule} from '@angular/material/input';/**yes */
import {MatButtonModule} from '@angular/material/button'; /**yes */
import {MatFormFieldModule} from '@angular/material/form-field';/**yes */
import { ReactiveFormsModule } from '@angular/forms';/**yes */
import { MatIconModule } from '@angular/material/icon';/**yes */
import { TodoComponent } from './components/todo/todo.component';/**yes */
import {MatCardModule} from '@angular/material/card';/**yes */
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';/**yes */
import { NgToastModule } from 'ng-angular-popup'/**yes */
import { TokenInterceptor } from './interceptors/token.interceptor';/**yes */
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatSelectModule} from '@angular/material/select';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    TodoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    HttpClientModule,
    NgToastModule,
    DragDropModule,
    MatSelectModule,
    NgMultiSelectDropDownModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
