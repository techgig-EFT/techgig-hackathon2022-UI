import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutmeComponent } from './aboutme/aboutme.component';
import { EmpaddComponent } from './empadd/empadd.component';
import { EmplistComponent } from './emplist/emplist.component';
import {MsalGuard} from '@azure/msal-angular';

const routes: Routes = [
  {path:'employee-list',component:  EmplistComponent,canActivate:[MsalGuard]},
  {path:'about-me',component:  AboutmeComponent,canActivate:[MsalGuard]},
  {path:'add-employee',component:  EmpaddComponent,canActivate:[MsalGuard]},
  {path:'',redirectTo: 'about-me', pathMatch:'full'},
  {path: '**', redirectTo: '',canActivate:[MsalGuard]}];

@NgModule({
  imports: [RouterModule.forRoot(routes,
  {initialNavigation:'enabled'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
