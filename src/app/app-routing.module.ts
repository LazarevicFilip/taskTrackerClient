import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TodoComponent } from './components/todo/todo.component';
import { AuthGuard } from './guards/auth.guard';
import { ProjectComponent } from './components/project/project.component';

const routes: Routes = [
  { path: '', pathMatch: 'full' ,redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: TodoComponent, canActivate:[AuthGuard] },
  { path: 'projects', component: ProjectComponent, canActivate:[AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
